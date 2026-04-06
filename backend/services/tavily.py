from langchain_tavily import TavilySearch
import os
from dotenv import load_dotenv

load_dotenv()

tavily_api = os.getenv("TAVILY_API_KEY")

# Tavily search tool — initialized once at module load
tavily_search_tool = TavilySearch(max_results=5, api_key=tavily_api)
