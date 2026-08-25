from pydantic import BaseModel
class TransactionCreate(BaseModel):
    amount: float
    category: str
    type: str
    description: str | None = None
class TransactionResponse(BaseModel):
    id: int
    amount: float
    category: str
    type: str
    description: str | None
    user_id: int
    class Config:
        from_attributes = True
class TransactionUpdate(BaseModel):
    amount: float | None = None
    category: str | None = None
    type: str | None = None
    description: str | None = None
