from datetime import datetime
from pydantic import BaseModel


class MeetingResponse(BaseModel):
    id: int
    meeting_code: str
    title: str
    description: str | None = None
    status: str
    visibility: str
    scheduled_at: datetime | None = None
    duration: int | None = None
    is_instant: bool = False
    host_id: int | None = None
    created_at: datetime | None = None

    model_config = {
        "from_attributes": True
    }


class InstantMeetingResponse(BaseModel):
    message: str
    meeting_code: str
    meeting_link: str
    meeting: MeetingResponse


class ScheduleMeetingRequest(BaseModel):
    title: str
    description: str | None = None
    scheduled_at: datetime
    duration: int = 60


class JoinMeetingRequest(BaseModel):
    meeting_code: str
    display_name: str


class JoinMeetingResponse(BaseModel):
    message: str
    meeting: MeetingResponse
    participant_id: int