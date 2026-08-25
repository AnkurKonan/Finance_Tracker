from fastapi import FastAPI
from sqlalchemy import text
from app.db.base import Base
from app.db.database import engine
from app.models.user import User
from app.api.auth import router as auth_router
from app.models.transaction import Transaction
from app.api.transactions import (router as transaction_router)
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)
app = FastAPI(title="Personal Finance Tracker API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(transaction_router)
@app.get("/")
def home():
    return {"message": "Finance Tracker API Running"}
@app.get("/health")
def health_check():
    return {"status": "healthy"}
@app.get("/db-test")
def db_test():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"message": "Database connected successfully"}
    except Exception as e:
        return {
            "error": str(e)
        }
