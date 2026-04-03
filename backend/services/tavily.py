from langchain_tavily import TavilySearch

# Tavily search tool — initialized once at module load
tavily_search_tool = TavilySearch(max_results=5)
