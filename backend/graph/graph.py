from langgraph.graph import StateGraph, END, START

from graph.state import GraphState
from graph.nodes import extraction_node, authenticity_node2, policy_check_node, decision_node, pdf_extractor_node
from graph.routing import extraction_decision, authenticity_decision


def type_classifier(state: GraphState):
    # Splits the path and checks extension
    file_extension = state.image_path.split(".")[-1].lower()
    if file_extension == "pdf":
        return "pdf"
    return "image"

def compile_graph():
    """Build and compile the receipt audit graph."""
    graph = StateGraph(GraphState)

    # --- 2. Add Nodes ---
    graph.add_node("pdf_extraction", pdf_extractor_node)
    graph.add_node("vision_extraction", extraction_node)
    graph.add_node("authenticity", authenticity_node2)
    graph.add_node("policy", policy_check_node)
    graph.add_node("decision", decision_node)

    # --- Conditional edges ---
    graph.add_conditional_edges(
        START,
        type_classifier,
        {
            "pdf": "pdf_extraction",
            "image": "vision_extraction"
        }
    )

    # B. Branching from PDF Extraction
    graph.add_conditional_edges(
        "pdf_extraction", # Match the node name above
        extraction_decision,
        {
            "authenticity": "authenticity",
            "decision": "decision"
        }
    )

    # C. Branching from Vision Extraction
    graph.add_conditional_edges(
        "vision_extraction", # Match the node name above
        extraction_decision,
        {
            "authenticity": "authenticity",
            "decision": "decision"
        }
    )

    # D. Authenticity Logic
    graph.add_conditional_edges(
        "authenticity", 
        authenticity_decision,
        {
            "policy": "policy",
            "decision": "decision"
        }
    )

    # E. Final Steps
    graph.add_edge("policy", "decision")
    graph.add_edge("decision", END)

    # --- 4. Compile and Visualize ---
    app = graph.compile()
    print("✅ Graph Skeleton Compiled Successfully!")

    return graph.compile()


# Compiled once at server startup — reused for every request
app = compile_graph()
