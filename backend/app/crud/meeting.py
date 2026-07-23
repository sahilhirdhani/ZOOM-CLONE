from datetime import datetime
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.models.meeting import Meeting

def get_upcoming_meetings(db: Session):
    """Get all scheduled meetings that haven't passed yet, ordered by nearest first."""
    now = datetime.now()
    return (
        db.query(Meeting)
        .filter(
            Meeting.status == "SCHEDULED",
            Meeting.scheduled_at >= now
        )
        .order_by(Meeting.scheduled_at.asc())
        .all()
    )


def get_recent_meetings(db: Session):
    """Get all completed meetings ordered by most recent first."""
    return (
        db.query(Meeting)
        .filter(Meeting.status == "COMPLETED")
        .order_by(Meeting.scheduled_at.desc())
        .all()
    )


def get_missed_meetings(db: Session):
    """Get all missed meetings or scheduled meetings that have passed, ordered by most recent first."""
    now = datetime.now()
    return (
        db.query(Meeting)
        .filter(
            or_(
                Meeting.status == "MISSED",
                (Meeting.status == "SCHEDULED") & (Meeting.scheduled_at < now)
            )
        )
        .order_by(Meeting.scheduled_at.desc())
        .all()
    )


def get_meeting_by_code(db: Session, code: str):
    """Look up a meeting by its meeting code."""
    return (
        db.query(Meeting)
        .filter(Meeting.meeting_code == code)
        .first()
    )


def create_meeting(db: Session, **kwargs) -> Meeting:
    """Insert a new meeting row."""
    meeting = Meeting(**kwargs)
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


def update_meeting_status(db: Session, meeting_id: int, status: str, ended_at=None):
    """Transition meeting status."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting:
        meeting.status = status
        if ended_at:
            meeting.ended_at = ended_at
        db.commit()
        db.refresh(meeting)
    return meeting