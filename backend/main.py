from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router

app = FastAPI(
    title="Macrosoft Expense Tracker — AI Auditor",
    description="LangGraph-powered receipt processing and expense audit API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Allow requests from the React Native / Expo app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Tighten this to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
