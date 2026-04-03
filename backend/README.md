# Macrosoft Expense Tracker — AI Auditor Backend

## Setup

### 1. Copy this `.env.example` to `.env` and fill in your keys

```
GEMINI_API_KEY=your_gemini_api_key_here
OPENROUTER_API=your_openrouter_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

### 2. Install dependencies (using uv)

```bash
uv sync
```

### 3. Run the server

```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. API Docs

Open http://localhost:8000/docs in your browser.

---

## API Reference

### `GET /api/health`
Health check. Returns `{"status": "ok"}`.

### `POST /api/process-receipt`

**Body (JSON):**
```json
{
  "image_url": "https://your-project.supabase.co/storage/v1/object/public/receipts/receipt.jpg",
  "user_image_description": "Dinner receipt from New York trip",
  "trip_metadata": {
    "locations": ["New York", "London"],
    "window": ["2026-03-20", "2026-03-25"],
    "budget_limit": "500 USD",
    "description": "Business trip for tech conference",
    "trip_currencies": ["USD", "INR"]
  }
}
```

**Response:**
```json
{
  "decision": "approved",
  "merchant_name": "The Coffee Shop",
  "receipt_amount": 45.50,
  "currency": "USD",
  "is_authentic": true,
  "auth_violations": [],
  "is_policy_violating": false,
  "policy_violations": [],
  "justification": []
}
```
