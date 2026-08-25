from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from fastapi import Query
from fastapi import HTTPException
from sqlalchemy import func
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse
)
from app.schemas.dashboard import (
    DashboardResponse
)
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionUpdate
)
from app.schemas.analytics import (
    MonthlyAnalytics
)
from app.core.redis_client import (
    redis_client
)
import json
from app.api.dependencies import (
    get_current_user
)
router = APIRouter(
    prefix="/api/transactions",
    tags=["Transactions"]
)
@router.post(
    "/",
    response_model=TransactionResponse
)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    db_transaction = Transaction(
        amount=transaction.amount,
        category=transaction.category,
        type=transaction.type,
        description=transaction.description,
        user_id=current_user.id
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    redis_client.delete(
        f"analytics:{current_user.id}"
    )
    return db_transaction
@router.get(
    "/{transaction_id}",
    response_model=TransactionResponse
)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id
            == transaction_id,
            Transaction.user_id
            == current_user.id
        )
        .first()
    )
    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )
    return transaction
@router.get(
    "/dashboard/summary",
    response_model=DashboardResponse
)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    income = (
        db.query(
            func.sum(
                Transaction.amount
            )
        )
        .filter(
            Transaction.user_id
            == current_user.id,
            Transaction.type
            == "income"
        )
        .scalar()
        or 0
    )
    expense = (
        db.query(
            func.sum(
                Transaction.amount
            )
        )
        .filter(
            Transaction.user_id
            == current_user.id,
            Transaction.type
            == "expense"
        )
        .scalar()
        or 0
    )
    count = (
        db.query(Transaction)
        .filter(
            Transaction.user_id
            == current_user.id
        )
        .count()
    )
    return {
        "total_income": income,
        "total_expense": expense,
        "balance": income - expense,
        "transaction_count": count
    }
@router.put(
    "/{transaction_id}",
    response_model=TransactionResponse
)
def update_transaction(
    transaction_id: int,
    data: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id
        )
        .first()
    )
    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )
    update_data = (
        data.model_dump(
            exclude_unset=True
        )
    )
    for key, value in update_data.items():
        setattr(
            transaction,
            key,
            value
        )
    db.commit()
    db.refresh(transaction)
    redis_client.delete(
        f"analytics:{current_user.id}"
    )
    return transaction
@router.delete(
    "/{transaction_id}"
)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id
        )
        .first()
    )
    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )
    db.delete(transaction)
    db.commit()
    redis_client.delete(
        f"analytics:{current_user.id}"
    )
    return {
        "message": "Transaction deleted"
    }
@router.get(
    "/",
    response_model=list[
        TransactionResponse
    ]
)
def get_transactions(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    search: str | None = None,
    category: str | None = None,
    transaction_type: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    query = (
        db.query(Transaction)
        .filter(
            Transaction.user_id
            == current_user.id
        )
    )
    if search:
        query = query.filter(
            Transaction.description
            .ilike(f"%{search}%")
        )
    if category:
        query = query.filter(
            Transaction.category
            == category
        )
    if transaction_type:
        query = query.filter(
            Transaction.type
            == transaction_type
        )
    offset = (
        page - 1
    ) * limit
    return (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

@router.get(
    "/analytics/monthly",
    response_model=MonthlyAnalytics
)
def monthly_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    cache_key = (
        f"analytics:{current_user.id}"
    )
    cached_data = (
        redis_client.get(cache_key)
    )
    if cached_data:
        return json.loads(
            cached_data
        )
    income = (
        db.query(
            func.sum(
                Transaction.amount
            )
        )
        .filter(
            Transaction.user_id
            == current_user.id,
            Transaction.type
            == "income"
        )
        .scalar()
        or 0
    )
    expense = (
        db.query(
            func.sum(
                Transaction.amount
            )
        )
        .filter(
            Transaction.user_id
            == current_user.id,
            Transaction.type
            == "expense"
        )
        .scalar()
        or 0
    )
    result = {
        "income": income,
        "expense": expense,
        "balance": income - expense
    }
    redis_client.setex(
        cache_key,
        60,
        json.dumps(result)
    )
    return result
@router.delete("/all")
def delete_all_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    (
        db.query(Transaction)
        .filter(
            Transaction.user_id
            == current_user.id
        )
        .delete()
    )
    db.commit()
    redis_client.delete(
        f"analytics:{current_user.id}"
    )
    return {
        "message":
        "All transactions deleted"
    }
