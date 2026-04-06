from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AuthenticityResult(BaseModel):
    location_match: bool = Field(description="Returns true if the merchant actually exists in any of the trip locations")
    violations: Optional[str] = Field(description="List out all the violations")
    currency_match: bool = Field(description="Returns True is the currency is valid and from one of the trip locations")

class RecieptExtraction(BaseModel):
    """Structured data extracted from a business travel receipt."""

    is_readable: bool = Field(description="Whether the image is a clear, readable receipt.")
    is_receipt: bool = Field(description="Whether the uploaded image is actually a receipt and not a random photo.")
    merchant_name: Optional[str] = Field(description="The name of the vendor or store.")
    merchant_location: Optional[str] = Field(description="The city or address of the merchant.")
    receipt_date: Optional[str] = Field(description="The date on the receipt in YYYY-MM-DD format.")
    receipt_amount: float = Field(default=0.0, description="The total amount shown on the receipt.")
    receipt_tax_id: Optional[str] = Field(description="VAT ID, GST ID, or any other tax identification number.")
    currency: str = Field(default="USD", description="The currency code (e.g., USD, EUR, INR).")
    items_list: list[str] = Field(default_factory=list, description="A list of items purchased.")
    extracted_description: str = Field(description="A short description of the extracted image in 2-3 sentences.")

class PolicyNodeResult(BaseModel):
    is_relevant: bool = False
    is_policy_violating: bool = False
    policy_violations: List[str] = Field(default_factory=list, description="Contains all policy violations.")
    policy_pages: List[int] = Field(default_factory=list, description="Pages of policy rules that were violated.")

class DecisionNodeResult(BaseModel):
    is_approved: bool = Field(description="True if the receipt is approved.")
    justification: List[str] = Field(default_factory=list)

class ProcessReceiptRequest(BaseModel):
    image_url: str
    user_image_description: str
    trip_metadata: Dict[str, Any]

class PolicyChatRequest(BaseModel):
    message: str
    thread_id: str

class PolicyChatResult(BaseModel):
    reply: str = Field(description = "Reply to the query by the user")
    pages: List = Field(default_factory=list, description="pages referenced for the reply")

