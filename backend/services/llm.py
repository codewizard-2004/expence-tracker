import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI

load_dotenv()

google_api = os.getenv("GEMINI_API_KEY")
openai_api = os.getenv("OPENAI_API_KEY")

# Primary LLM — Gemini 2.5 Flash (vision + structured output for extraction/authenticity/decision)
llm_for_extraction = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
)

llm_for_authenticity = ChatGoogleGenerativeAI(
    model = "models/gemini-3-flash-preview",
    temperature = 0
)

# Policy Agent LLM — Gemini 2.5 Flash Lite (used inside the policy LangChain agent)
# policy_llm = ChatGoogleGenerativeAI(
#     model="gemini-2.5-flash-lite",
#     api_key=google_api,
# )

policy_llm = ChatOpenAI(
    model = "gpt-5.4-nano",
    api_key = openai_api
)

