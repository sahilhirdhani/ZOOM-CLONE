from sqlalchemy.orm import Session
from app.models.user import User

def get_default_user(db: Session):
    return db.query(User).first()