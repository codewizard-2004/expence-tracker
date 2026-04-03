from graph.state import GraphState


def extraction_decision(state: GraphState) -> str:
    """Route to authenticity if readable & is a receipt, else go straight to decision."""
    if state.is_readable and state.is_receipt:
        return "authenticity"
    return "decision"


def authenticity_decision(state: GraphState) -> str:
    """Route to policy if authentic, else skip to decision."""
    if state.is_authentic:
        return "policy"
    return "decision"
