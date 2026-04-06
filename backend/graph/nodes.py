import base64
import mimetypes
from typing import List, Optional

from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage
from langchain.agents import create_agent
from langchain_community.document_loaders import PyPDFLoader

from services.llm import llm_for_extraction, llm_for_authenticity, policy_llm
from services.vector_store import retrieve_context
from services.tools import get_current_date
from services.tavily import tavily_search_tool
from graph.state import GraphState

from schema.prompts import AUTH_SYSTEM_PROMPT, POLICY_SYSTEM_PROMPT, POLICY_CONTEXT_PROMPT, DECISION_CONTEXT_PROMPT
from schema.models import AuthenticityResult, RecieptExtraction, PolicyNodeResult, DecisionNodeResult

# ---------------------------------------------------------------------------
# agents — lazy singleton (created once on first request)
# ---------------------------------------------------------------------------

_policy_agent = None
_authenticity_agent = None

def _get_policy_agent():
    global _policy_agent
    if _policy_agent is None:
        tools = [retrieve_context, get_current_date]
        system_prompt = POLICY_SYSTEM_PROMPT
        _policy_agent = create_agent(
            policy_llm,
            tools,
            system_prompt=system_prompt,
            response_format=PolicyNodeResult,
        )
    return _policy_agent

def _get_authenticity_agent():
    global _authenticity_agent
    if _authenticity_agent is None:
        tools = [tavily_search_tool]
        system_prompt = AUTH_SYSTEM_PROMPT
        _authenticity_agent = create_agent(
            llm_for_authenticity,
            tools,
            system_prompt=system_prompt,
            response_format=AuthenticityResult,
        )
    return _authenticity_agent

# ---------------------------------------------------------------------------
# Node functions
# ---------------------------------------------------------------------------
def pdf_extractor_node(state: GraphState):
    print("--- NODE: PDF Extractor ---")
    
    loader = PyPDFLoader(state.image_path)
    docs = loader.load()
    # Combine all pages into one text block for the LLM
    full_text = "\n".join([doc.page_content for doc in docs])
    
    prompt = f"""
    Analyze the following text extracted from a PDF. 
    Check if it is a receipt. If yes, extract the details into the required format.
    
    PDF TEXT:
    {full_text}
    """
    extraction_llm = llm_for_extraction.with_structured_output(RecieptExtraction)
    # Use the same structured LLM you used in the vision node
    try:
        response = extraction_llm.invoke(prompt) # Text-only call
        return {
            "is_readable": response.is_readable,
            "is_receipt": response.is_receipt,
            "merchant_name": response.merchant_name,
            "merchant_location": response.merchant_location,
            "receipt_date": response.receipt_date,
            "receipt_amount": response.receipt_amount,
            "currency": response.currency,
            "items_list": response.items_list,
            "receipt_category": response.receipt_category,
            "extracted_description": response.extracted_description,
        }
    except Exception as e:
        print(f"   > PDF Extraction Error: {e}")
        return {"is_readable": False}

def extraction_node(state: GraphState) -> dict:
    print("--- NODE: Extraction (Vision) ---")
    structured_llm = llm_for_extraction.with_structured_output(RecieptExtraction)

    image_path = state.image_path
    mime_type, _ = mimetypes.guess_type(image_path)
    if not mime_type:
        mime_type = "image/jpeg"  # fallback

    with open(image_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode("utf-8")

    prompt = "Analyze this image. First, determine if it is a readable receipt. If so, extract the details."
    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt},
            {
                "type": "image_url",
                "image_url": {"url": f"data:{mime_type};base64,{base64_image}"},
            },
        ]
    )

    try:
        response = structured_llm.invoke([message])
        print(f"\t> Success: {response.is_readable} | Merchant: {response.merchant_name}")
        return {
            "is_readable": response.is_readable,
            "is_receipt": response.is_receipt,
            "merchant_name": response.merchant_name or "Unknown",
            "merchant_location": response.merchant_location or "Unknown",
            "receipt_date": response.receipt_date,
            "receipt_amount": float(response.receipt_amount or 0.0),
            "receipt_tax_id": response.receipt_tax_id or None,
            "currency": response.currency or "Cannot Understand",
            "items_list": response.items_list,
            "receipt_category": response.receipt_category,
            "extracted_description": response.extracted_description,
        }
    except Exception as e:
        print(f"   > ERROR in Extraction: {e}")
        return {"is_readable": False, "auth_violations": [f"Extraction Error: {str(e)}"]}


def authenticity_node(state: GraphState) -> dict:
    print("--- NODE: Authenticity ---")
    is_authentic = True
    viol = []

    # 1. Date window check
    start_date, end_date = state.trip_metadata["window"]
    if not (start_date <= state.receipt_date <= end_date):
        is_authentic = False
        viol.append(
            f"Receipt date {state.receipt_date} is outside trip window ({start_date} to {end_date})"
        )
    else:
        print("\t>Dates OK")

    # 2. Currency check
    if state.currency not in state.trip_metadata.get("trip_currencies", ["INR"]):
        is_authentic = False
        viol.append(
            f"Currency {state.currency} is not valid for this trip "
            f"(Expected: {state.trip_metadata.get('trip_currencies')})"
        )
    else:
        print("\t>Currency OK")

    # 3. Location verification via Tavily + LLM
    search_query = f"{state.merchant_name} address {state.merchant_location}"
    print(f"   > Searching: {search_query}")
    search_results = tavily_search_tool.invoke(search_query)

    prompt = f"""
    Verify if the merchant '{state.merchant_name}' located at '{state.merchant_location}'
    actually exists in any of these trip locations: {state.trip_metadata.get('locations')}.
    You can approve if the merchant city name is given as a short form of {state.trip_metadata.get('locations')}.
    Eg. NY for New York, LA for Los Angeles etc.
    You can also approve if the merchant location is within close proximity of {state.trip_metadata.get('locations')}.

    Search Results: {search_results}
    """

    response = None
    try:
        verify_llm = llm_for_authenticity.with_structured_output(AuthenticityResult)
        response = verify_llm.invoke([HumanMessage(content=prompt)])

        if not response.location_match:
            is_authentic = False
            viol.append(f"Merchant '{state.merchant_name}' not verified in trip locations.")
    except Exception as e:
        print(f"   > Error in verification: {e}")
        viol.append("Technical error during location verification.")

    if response:
        print("\t>Location OK" if response.location_match else "\t>Location NOT OK")
        print(response.explanation)

    return {
        "is_authentic": is_authentic,
        "auth_violations": state.auth_violations + viol,
    }

def authenticity_node2(state: GraphState):
    print("--- NODE: Authenticity ---")
    is_authentic = True
    local_violations = [] # Initialize here to avoid NameError

    # 1. Date Window Check (Python Logic)
    start_date, end_date = state.trip_metadata["window"]
    if not (start_date <= state.receipt_date <= end_date):
        is_authentic = False
        msg = f"Receipt date {state.receipt_date} is outside trip window ({start_date} to {end_date})"
        print(f"\t>{msg}")
        # Return early if date is bad
        return {
            "is_authentic": False,
            "auth_violations": state.auth_violations + [msg]
        }
    
    print("\t>Dates OK") 
     
    # 2. Agent Check (Currency and Location)
    prompt = f"""
    Verify authenticity:
    Merchant: {state.merchant_name} at {state.merchant_location}
    Trip Information: {state.trip_metadata.get('locations')}
    """
    agent = _get_authenticity_agent()
    try:
        answer = agent.invoke({"messages": [HumanMessage(content=prompt)]})
        response = answer['structured_response']
        
        if not response.location_match or not response.currency_match:
            is_authentic = False
            if response.violations:
                local_violations.append(response.violations)
            print(f"\t>Receipt flagged: {response.violations}")
            
    except Exception as e:
        print(f"\t> Error in Agent verification: {e}")
        local_violations.append("Technical error during agentic verification.")
        is_authentic = False

    return {
        "is_authentic": is_authentic,
        "auth_violations": state.auth_violations + local_violations
    }

def policy_check_node(state: GraphState) -> dict:
    print("--- NODE: Policy Check ---")

    exclude_keys = {
        "is_authentic", "auth_violations", "is_readable", "is_receipt",
        "is_relevant", "is_policy_violating", "decision", "justification",
    }
    data_for_llm = {k: v for k, v in state.model_dump().items() if k not in exclude_keys}

    prompt = POLICY_CONTEXT_PROMPT(data_for_llm)
    query = HumanMessage(content=prompt)
    agent = _get_policy_agent()

    try:
        response = agent.invoke({"messages": [query]})
        print(f"\t>Policy Node: {response['structured_response']}")
        return {
            "is_relevant": response["structured_response"].is_relevant,
            "is_policy_violating": response["structured_response"].is_policy_violating,
            "policy_violations": state.policy_violations + response["structured_response"].policy_violations,
            "policy_pages": state.policy_pages + response["structured_response"].policy_pages,
        }
    except Exception as e:
        print(f"\t> Error in Policy node: {str(e)}")
        return {
            "is_policy_violating": False,
            "policy_violations": ["Technical error during policy audit."],
        }


def decision_node(state: GraphState) -> dict:
    print("--- NODE: Decision ---")

    exclude_keys = {"decision"}
    data_for_llm = {k: v for k, v in state.model_dump().items() if k not in exclude_keys}

    prompt = DECISION_CONTEXT_PROMPT(data_for_llm)

    try:
        primary_judge = llm_for_extraction.with_structured_output(DecisionNodeResult)
        response = primary_judge.invoke([HumanMessage(content=prompt)])

        status = "approved" if response.is_approved else "disapproved"
        return {
            "decision": status,
            "justification": state.justification + response.justification,
        }
    except Exception as e:
        print(f"   > Error in Decision node: {e}")
        return {
            "decision": "flagged",
            "justification": state.justification + ["System error during final audit. Manual review required."],
        }
