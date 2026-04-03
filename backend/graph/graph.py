from langgraph.graph import StateGraph, END

from graph.state import GraphState
from graph.nodes import extraction_node, authenticity_node, policy_check_node, decision_node
from graph.routing import extraction_decision, authenticity_decision


def compile_graph():
    """Build and compile the receipt audit graph."""
    graph = StateGraph(GraphState)

    # --- Nodes ---
    graph.add_node("extract", extraction_node)
    graph.add_node("authenticity", authenticity_node)
    graph.add_node("policy", policy_check_node)
    graph.add_node("decision", decision_node)

    # --- Entry point ---
    graph.set_entry_point("extract")

    # --- Conditional edges ---
    graph.add_conditional_edges(
        "extract",
        extraction_decision,
        {
            "authenticity": "authenticity",
            "decision": "decision",
        },
    )
    graph.add_conditional_edges(
        "authenticity",
        authenticity_decision,
        {
            "policy": "policy",
            "decision": "decision",
        },
    )

    # --- Static edges ---
    graph.add_edge("policy", "decision")
    graph.add_edge("decision", END)

    return graph.compile()


# Compiled once at server startup — reused for every request
app = compile_graph()
