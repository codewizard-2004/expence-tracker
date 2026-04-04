import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

const THREAD_ID_KEY = 'policy_chat_thread_id';

export type PolicyChatRequest = {
  message: string;
  thread_id: string;
};

export type PolicyChatResponse = {
  response: string;
  thread_id: string;
};

export async function sendPolicyChatMessage(
  request: PolicyChatRequest
): Promise<PolicyChatResponse> {
  const response = await fetch(`${BASE_URL}/api/policy-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Policy chat request failed');
  }

  return response.json();
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function getOrCreateThreadId(): Promise<string> {
  const existing = await AsyncStorage.getItem(THREAD_ID_KEY);
  if (existing) return existing;

  const newId = generateId();
  await AsyncStorage.setItem(THREAD_ID_KEY, newId);
  return newId;
}

export async function resetThreadId(): Promise<string> {
  const newId = generateId();
  await AsyncStorage.setItem(THREAD_ID_KEY, newId);
  return newId;
}
