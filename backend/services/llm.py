import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openrouter import ChatOpenRouter

load_dotenv()

google_api = os.getenv("GEMINI_API_KEY")
open_router_api = os.getenv("OPENROUTER_API")

# Primary LLM — Gemini 2.5 Flash (vision + structured output for extraction/authenticity/decision)
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
)

# Policy Agent LLM — Gemini 2.5 Flash Lite (used inside the policy LangChain agent)
policy_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    api_key=google_api,
)
