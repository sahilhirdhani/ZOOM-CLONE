from datetime import datetime
from pydantic import BaseModel

class MessageResponse(BaseModel):
    id: int
    meeting_id: int
    sender_name: str
    content: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class MessageCreate(BaseModel):
    sender_name: str
    content: str
