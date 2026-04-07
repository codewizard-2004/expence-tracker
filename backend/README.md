# Macrosoft Expense Tracker — AI Auditor Backend

## Setup

### 1. Copy this `.env.example` to `.env` and fill in your keys

```
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
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
}
```

### `POST /api/policy-chat`

**Body (JSON):**
```json
{
  "message": "What is the daily meal allowance for New York?",
  "thread_id": "unique-session-id-123"
}
```

**Response:**
```json
{
  "response": {
    "reply": "The daily meal allowance for New York is 75 USD.",
    "pages": [12, 14]
  },
  "thread_id": "unique-session-id-123"
}
```

## Backend Architecture

The backend is a robust FastAPI application serving as the orchestration layer for the AI Auditor. It utilizes a LangGraph workflow to process and evaluate receipts against company policies intelligently.

### Core Components
* **FastAPI:** Provides a high-performance RESTful API to communicate with the frontend application.
* **LangGraph:** Manages the stateful workflow of receipt processing, routing the data through various intelligent nodes: extraction, authentication, validation, and policy checking.
* **Vision Models (Gemini):** Used to perform OCR and extract structured tabular data from receipt images uploaded by users.
* **Authentication & Validation:** Integrates with Tavily Search to cross-reference merchant locations and checks currency/date logic to prevent fraudulent claims.
* **RAG System (Chroma):** Employs a Retrieval-Augmented Generation approach to retrieve relevant company expense policies from a local vector database, ensuring accurate, up-to-date, and context-aware compliance checks.
