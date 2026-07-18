from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    plan: Optional[str] = "Basic"
    avatar: Optional[str] = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    avatar: str
    plan: str
    personal_meeting_id: str

    model_config = {
        "from_attributes": True
    }