from pydantic import BaseModel

from app.schemas.user import UserResponse
from app.schemas.meeting import MeetingResponse


class DashboardResponse(BaseModel):
    user: UserResponse
    upcoming_meetings: list[MeetingResponse]
    recent_meetings: list[MeetingResponse]