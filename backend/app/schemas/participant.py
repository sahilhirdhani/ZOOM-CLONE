from datetime import datetime
from pydantic import BaseModel


class ParticipantResponse(BaseModel):
    id: int
    display_name: str
    email: str | None = None
    role: str
    is_muted: bool = False
    raised_hand: bool = False
    reaction: str | None = None
    joined_at: datetime | None = None

    model_config = {
        "from_attributes": True
    }
