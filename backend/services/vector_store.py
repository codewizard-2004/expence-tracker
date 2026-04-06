import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.tools import tool

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")

# Embeddings model
# embeddings = GoogleGenerativeAIEmbeddings(
#     model="text-embedding-3-small",
#     api_key=openai_api_key,
# )

embeddings = OpenAIEmbeddings(
    model = "text-embedding-3-small",
    api_key = openai_api_key
)

# ChromaDB vector store — points to policy_db/ in the backend directory
# This is loaded once at startup (module-level singleton)
vector_store = Chroma(
    collection_name="policy_collection",
    embedding_function=embeddings,
    persist_directory="./policy_db",
)


@tool(response_format="content_and_artifact")
def retrieve_context(query: str):
    """Retrieve relevant policy information to help answer a compliance query."""
    retrieved_docs = vector_store.similarity_search(query, k=2)
    serialized = "\n\n".join(
        (f"Source: {doc.metadata}\nContent: {doc.page_content}")
        for doc in retrieved_docs
    )
    return serialized, retrieved_docs
