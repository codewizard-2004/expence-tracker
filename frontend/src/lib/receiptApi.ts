import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export type ProcessReceiptRequest = {
  image_url: string;
  user_image_description: string;
  trip_metadata: {
    locations: string[];
    window: string[];
    budget_limit: string;
    description: string;
  };
};

export type ProcessReceiptResponse = {
  user_image_description: string;
  trip_metadata: {
    locations: string[];
    window: string[];
    budget_limit: string;
    description: string;
  };
  is_readable: boolean;
  is_receipt: boolean;
  merchant_name: string | null;
  merchant_location: string | null;
  receipt_date: string | null;
  receipt_tax_id: string | null;
  receipt_amount: number | null;
  currency: string | null;
  items_list: string[];
  extracted_description: string | null;
  is_authentic: boolean;
  auth_violations: string[];
  is_relevant: boolean;
  is_policy_violating: boolean;
  policy_violations: string[];
  policy_pages: number[];
  decision: string;
  justification: string[];
  auth_violations: string[];
};

export async function processReceipt(
  request: ProcessReceiptRequest
): Promise<ProcessReceiptResponse> {
  const response = await fetch(`${BASE_URL}/api/process-receipt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Process receipt request failed');
  }

  return response.json();
}