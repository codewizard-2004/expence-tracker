import os
import tempfile
from typing import Any, Dict

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from graph.graph import app as langgraph_app
from graph.chat import policy_chat_agent

from schema.models import ProcessReceiptRequest, PolicyChatRequest


router = APIRouter(prefix="/api", tags=["receipt"])
# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get("/health")
async def health_check():
    """Simple health check — confirms the server and graph are running."""
    return {"status": "ok", "message": "LangGraph Receipt Processor is running"}


@router.post("/process-receipt")
async def process_receipt(request: ProcessReceiptRequest):
    """
    Download a receipt image from a Supabase storage URL, run it through
    the 4-node LangGraph audit pipeline, and return the full result.

    Flow:
        image_url → download → temp file → LangGraph → JSON result → cleanup
    """
    tmp_path = None

    try:
        # 1. Determine file extension from the URL (strip query params first)
        clean_url = request.image_url.split("?")[0]
        ext = os.path.splitext(clean_url)[-1] or ".jpg"

        # 2. Download the image from Supabase
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(request.image_url)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to download image. HTTP {response.status_code} from Supabase.",
                )

        # 3. Write to a temp file on disk
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
            tmp.write(response.content)
            tmp_path = tmp.name

        # 4. Build the initial graph input
        initial_input = {
            "image_path": tmp_path,
            "user_image_description": request.user_image_description,
            "trip_metadata": request.trip_metadata,
        }

        # 5. Run the LangGraph pipeline (synchronous invoke — runs in the event loop thread)
        final_state = langgraph_app.invoke(initial_input)

        # 6. Strip the local disk path before returning (it's meaningless to the client)
        final_state.pop("image_path", None)

        return final_state

    except HTTPException:
        raise  # Re-raise FastAPI HTTP errors as-is

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Receipt processing error: {str(e)}")

    finally:
        # 7. Always clean up the temp file
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


@router.post("/policy-chat")
async def policy_chat(request: PolicyChatRequest):
    """
    Chat with the corporate policy using the policy's Vector Store.
    Uses in-memory persistence (MemorySaver) via the provided thread_id.
    """
    config = {"configurable": {"thread_id": request.thread_id}}
    
    try:
        # 1. Prepare the input message
        input_data = {"messages": [("user", request.message)]}
        
        # 2. Invoke the agent (it will automatically look up history for the thread_id)
        result = policy_chat_agent.invoke(input_data, config=config)
        
        # 3. Extract the final AI message
        # In create_react_agent, the 'messages' list is in the state
        final_message = result["structured_response"]
        
        return {
            "response": final_message,
            "thread_id": request.thread_id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Policy chat error: {str(e)}")
