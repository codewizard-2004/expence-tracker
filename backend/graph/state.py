from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class GraphState(BaseModel):
    # --- Input Data (Mandatory at start) ---
    image_path: str
    user_image_description: str
    trip_metadata: Dict[str, Any] = Field(default_factory=lambda: {
        "trip_currencies": ["USD", "INR"],
        "locations": ["Mumbai", "New York"],
        "window": ["2026-03-20", "2026-03-25"],
        "budget_limit": "500 USD",
        "description": "Business trip for tech conference"
    })

    # --- Extraction Results (Optional at start) ---
    is_readable: bool = True
    is_receipt: bool = True
    merchant_name: Optional[str] = None
    merchant_location: Optional[str] = None
    receipt_date: Optional[str] = Field(default=None, description="Date of the receipt in YYYY-MM-DD format")
    receipt_time: Optional[str] = None
    receipt_tax_id: Optional[str] = Field(default=None, description="VAT ID, GST ID, etc.")
    receipt_amount: float = 0.0
    currency: str = "USD"
    items_list: List[str] = Field(default_factory=list)
    extracted_description: Optional[str] = Field(default=None, description="Short description of image")

    # --- Authenticity and Results ---
    is_authentic: bool = False
    auth_violations: List[str] = Field(default_factory=list)

    # --- Policy Node Results ---
    is_relevant: bool = False
    is_policy_violating: bool = False
    policy_violations: List[str] = Field(default_factory=list)
    policy_pages: List[int] = Field(default_factory=list)

    # --- Final Decision ---
    decision: str = ""  # approved, disapproved, flagged
    justification: List[str] = Field(default_factory=list)
