from pydantic import BaseModel
class MonthlyAnalytics(BaseModel):
    income: float
    expense: float
    balance: float
