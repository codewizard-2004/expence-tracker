import base64
import mimetypes
from typing import List, Optional

from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage
from langchain.agents import create_agent

from services.llm import llm, policy_llm
from services.vector_store import retrieve_context
from services.tavily import tavily_search_tool
from graph.state import GraphState


# ---------------------------------------------------------------------------
# Structured output schemas
# ---------------------------------------------------------------------------

class RecieptExtraction(BaseModel):
    """Structured data extracted from a business travel receipt."""

    is_readable: bool = Field(description="Whether the image is a clear, readable receipt.")
    is_receipt: bool = Field(description="Whether the uploaded image is actually a receipt and not a random photo.")
    merchant_name: Optional[str] = Field(description="The name of the vendor or store.")
    merchant_location: Optional[str] = Field(description="The city or address of the merchant.")
    receipt_date: Optional[str] = Field(description="The date on the receipt in YYYY-MM-DD format.")
    receipt_amount: float = Field(default=0.0, description="The total amount shown on the receipt.")
    receipt_tax_id: Optional[str] = Field(description="VAT ID, GST ID, or any other tax identification number.")
    currency: str = Field(default="USD", description="The currency code (e.g., USD, EUR, INR).")
    items_list: list[str] = Field(default_factory=list, description="A list of items purchased.")
    extracted_description: str = Field(description="A short description of the extracted image in 2-3 sentences.")


class AuthenticityResult(BaseModel):
    location_match: bool = Field(description="True if the merchant actually exists in any of the trip locations.")
    explanation: Optional[str] = Field(description="Explain the decision of location_match.")


class PolicyNodeResult(BaseModel):
    is_relevant: bool = False
    is_policy_violating: bool = False
    policy_violations: List[str] = Field(default_factory=list, description="Contains all policy violations.")
    policy_pages: List[int] = Field(default_factory=list, description="Pages of policy rules that were violated.")


class DecisionNodeResult(BaseModel):
    is_approved: bool = Field(description="True if the receipt is approved.")
    justification: List[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Policy agent — lazy singleton (created once on first request)
# ---------------------------------------------------------------------------

_policy_agent = None


def _get_policy_agent():
    global _policy_agent
    if _policy_agent is None:
        tools = [retrieve_context]
        system_prompt = (
            "You are a strict Corporate Compliance Agent. "
            "Use the retrieve_context tool to search the company policy for every item listed in the receipt. "
            "If an item (like alcohol) is forbidden or a category (like meals) has a price limit, "
            "you also need to check if the given items are relevant to the trip (e.g., going to Disney Park etc.). "
            "Explicitly state the violation. If you are unsure or the context is missing, flag it for review."
        )
        _policy_agent = create_agent(
            policy_llm,
            tools,
            system_prompt=system_prompt,
            response_format=PolicyNodeResult,
        )
    return _policy_agent


# ---------------------------------------------------------------------------
# Node functions
# ---------------------------------------------------------------------------

def extraction_node(state: GraphState) -> dict:
    print("--- NODE: Extraction (Vision) ---")
    structured_llm = llm.with_structured_output(RecieptExtraction)

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
        verify_llm = llm.with_structured_output(AuthenticityResult)
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


def policy_check_node(state: GraphState) -> dict:
    print("--- NODE: Policy Check ---")

    exclude_keys = {
        "is_authentic", "auth_violations", "is_readable", "is_receipt",
        "is_relevant", "is_policy_violating", "decision", "justification",
    }
    data_for_llm = {k: v for k, v in state.model_dump().items() if k not in exclude_keys}

    prompt = f"""
    Data extracted from the image.\n\n{data_for_llm}\n\n
    Trip Metadata is the information about the trip extracted from the Database.
    Use these to check for any policy violations and relevancy of the receipt.
    Explain the policy violations if any in the justifications list in 1-3 points.
    Add which pages of the policy documents are violated (if any) in policy_pages list.
    Ignore if any messages like "NOT A FINAL RECEIPT" appear in the document.
    """
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

    prompt = f"""
    You are an expert corporate auditor. Based on the following receipt data and travel metadata,
    decide if this expense should be Approved or Disapproved.

    AUDIT DATA:
    {data_for_llm}

    GUIDELINES:
    - If there are any 'auth_violations' or 'policy_violations', you MUST Disapprove.
    - Provide exactly 1-3 bullet points of justification only if you disapproved.
    - Be professional and concise.
    - Make sure that the receipt doesn't exceed the budget of the trip.
    """

    try:
        primary_judge = llm.with_structured_output(DecisionNodeResult)
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
