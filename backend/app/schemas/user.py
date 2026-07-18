from pydantic import BaseModel

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    avatar: str
    plan: str

    model_config = {
        "from_attributes": True
    }