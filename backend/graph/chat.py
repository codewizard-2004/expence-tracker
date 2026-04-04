from langchain.agents import create_agent
from langgraph.checkpoint.memory import MemorySaver

from services.llm import policy_llm
from services.vector_store import retrieve_context

# 1. Define the system prompt for the chat assistant
SYSTEM_PROMPT = (
    "You are a helpful Corporate Policy Assistant for the Macrosoft Expense Tracker. "
    "Your goal is to answer user questions about the company's expense, travel, and reimbursement policies. "
    "Use the 'retrieve_context' tool to find relevant policy information. "
    "Always be professional, concise, and helpful. "
    "If you cannot find the answer in the retrieved context, politely inform the user and suggest they contact HR."
)

# 2. Define the tools
tools = [retrieve_context]

# 3. Initialize the MemorySaver for in-memory chat history
memory = MemorySaver()

# 4. Create the chat agent with built-in persistence
# The 'checkpointer' allows us to maintain state between calls using a 'thread_id'
policy_chat_agent = create_agent(
    model = policy_llm,
    tools = tools,
    system_prompt=SYSTEM_PROMPT,
    checkpointer=memory
)
