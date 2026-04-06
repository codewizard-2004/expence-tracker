from langchain.tools import tool
from datetime import datetime


@tool
def get_current_date(format: str = "%B %d, %Y") -> str:
    """
    Returns today's current date. Use this whenever you need to
    reference the current day, month, or year.
    """
    return datetime.now().strftime(format)


