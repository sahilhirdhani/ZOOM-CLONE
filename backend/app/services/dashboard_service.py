from app.models.user import User
from app.crud.user import get_default_user
from app.crud.meeting import (
    get_recent_meetings,
    get_upcoming_meetings
)


def get_dashboard_data(db, user_id: int = None):
    user = None
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = get_default_user(db)
        
    upcoming = get_upcoming_meetings(db)
    recent = get_recent_meetings(db)
    return {"user": user, "upcoming_meetings": upcoming, "recent_meetings": recent}