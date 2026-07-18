from datetime import datetime
from pydantic import BaseModel


class ParticipantResponse(BaseModel):
    id: int
    display_name: str
    email: str | None = None
    role: str
    joined_at: datetime | None = None

    model_config = {
        "from_attributes": True
    }
