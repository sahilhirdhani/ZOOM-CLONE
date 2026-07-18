from app.crud.user import get_default_user
from app.crud.meeting import (
    get_recent_meetings,
    get_upcoming_meetings
)


def get_dashboard_data(db):
    user = get_default_user(db)
    upcoming = get_upcoming_meetings(db)
    recent = get_recent_meetings(db)
    return {"user": user, "upcoming_meetings": upcoming, "recent_meetings": recent}