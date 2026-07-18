from fastapi import APIRouter, Depends, Header
from typing import Optional
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import get_dashboard_data

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "",
    response_model=DashboardResponse,
)
def dashboard(
    db: Session = Depends(get_db),
    x_user_id: Optional[str] = Header(None)
):
    user_id = int(x_user_id) if x_user_id else None
    return get_dashboard_data(db, user_id=user_id)