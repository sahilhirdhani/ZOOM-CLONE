from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.message import Message
from app.models.participant import Participant
from app.crud.meeting import get_meeting_by_code
from app.schemas.message import MessageCreate

def send_meeting_message(db: Session, meeting_code: str, data: MessageCreate) -> Message:
    """Send a chat message in the meeting, linking to the active participant if found."""
    meeting = get_meeting_by_code(db, meeting_code)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Try to find an active participant with the sender_name to set sender_id
    participant = db.query(Participant).filter(
        Participant.meeting_id == meeting.id,
        Participant.display_name == data.sender_name,
        Participant.left_at.is_(None)
    ).first()
    
    sender_id = participant.id if participant else None
        
    msg = Message(
        meeting_id=meeting.id,
        sender_id=sender_id,
        sender_name=data.sender_name,
        content=data.content
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

def get_meeting_messages(db: Session, meeting_code: str):
    """Retrieve all chat messages in a meeting."""
    meeting = get_meeting_by_code(db, meeting_code)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    return db.query(Message).filter(Message.meeting_id == meeting.id).order_by(Message.created_at.asc()).all()
