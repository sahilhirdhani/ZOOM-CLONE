from sqlalchemy.orm import Session
from app.models.user import User

def get_default_user(db: Session):
    return db.query(User).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()