from datetime import datetime
from sqlalchemy.orm import Session
from app.models.participant import Participant


def add_participant(db: Session, meeting_id: int, display_name: str,
                    email: str = None, role: str = "PARTICIPANT") -> Participant:
    """Add a participant to a meeting."""
    participant = Participant(
        meeting_id=meeting_id,
        display_name=display_name,
        email=email,
        role=role,
        joined_at=datetime.now(),
    )
    db.add(participant)
    db.commit()
    db.refresh(participant)
    return participant


def get_participants_by_meeting(db: Session, meeting_id: int):
    """List all active participants in a meeting."""
    return (
        db.query(Participant)
        .filter(Participant.meeting_id == meeting_id, Participant.left_at.is_(None))
        .all()
    )


def remove_participant(db: Session, participant_id: int) -> bool:
    """Remove a participant from a meeting (soft-delete)."""
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if participant:
        participant.left_at = datetime.now()
        db.commit()
        return True
    return False
