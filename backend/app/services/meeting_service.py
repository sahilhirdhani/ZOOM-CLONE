from datetime import datetime

from sqlalchemy.orm import Session

from app.crud.meeting import (
    create_meeting,
    get_meeting_by_code,
    update_meeting_status,
)
from fastapi import HTTPException
from app.crud.participant import (
    add_participant,
    get_participants_by_meeting,
    remove_participant,
)
from app.crud.user import get_default_user, get_user_by_id
from app.utils.meeting_id import generate_meeting_code, generate_meeting_link
from app.schemas.meeting import ScheduleMeetingRequest


def create_instant_meeting(db: Session, host_id: int = None):
    """Create an instant meeting and add the host as participant."""
    if host_id:
        user = get_user_by_id(db, host_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found. Please log in again.")
    else:
        user = get_default_user(db)
        if not user:
            raise HTTPException(status_code=500, detail="No default user available")
    code = generate_meeting_code()

    meeting = create_meeting(
        db,
        meeting_code=code,
        title=f"{user.name}'s Meeting",
        description="Instant Meeting",
        host_id=user.id,
        status="ACTIVE",
        visibility="PRIVATE",
        scheduled_at=datetime.now(),
        duration=40,
        max_participants=100,
        video_enabled=True,
        chat_enabled=True,
        screen_share_enabled=True,
        screen_share_permission="HOST_ONLY",
        is_instant=True,
    )

    # Add host as participant
    add_participant(
        db,
        meeting_id=meeting.id,
        display_name=user.name,
        email=user.email,
        role="HOST",
    )

    return {
        "message": "Meeting created successfully",
        "meeting_code": code,
        "meeting_link": generate_meeting_link(code),
        "meeting": meeting,
    }


def schedule_meeting(db: Session, data: ScheduleMeetingRequest, host_id: int = None):
    """Schedule a future meeting."""
    if host_id:
        user = get_user_by_id(db, host_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found. Please log in again.")
    else:
        user = get_default_user(db)
        if not user:
            raise HTTPException(status_code=500, detail="No default user available")
    code = generate_meeting_code()

    meeting = create_meeting(
        db,
        meeting_code=code,
        title=data.title,
        description=data.description,
        host_id=user.id,
        status="SCHEDULED",
        visibility="PRIVATE",
        scheduled_at=data.scheduled_at,
        duration=data.duration,
        max_participants=100,
        video_enabled=True,
        chat_enabled=True,
        screen_share_enabled=True,
        screen_share_permission="HOST_ONLY",
        is_instant=False,
    )

    # Add host as participant
    add_participant(
        db,
        meeting_id=meeting.id,
        display_name=user.name,
        email=user.email,
        role="HOST",
    )

    return {
        "message": "Meeting scheduled successfully",
        "meeting_code": code,
        "meeting_link": generate_meeting_link(code),
        "meeting": meeting,
    }


def join_meeting(db: Session, code: str, display_name: str):
    """Join a meeting by code."""
    meeting = get_meeting_by_code(db, code)
    if not meeting:
        return None

    # If meeting is SCHEDULED, activate it when someone joins
    if meeting.status == "SCHEDULED":
        update_meeting_status(db, meeting.id, "ACTIVE")
        meeting.status = "ACTIVE"

    # Add participant
    participant = add_participant(
        db,
        meeting_id=meeting.id,
        display_name=display_name,
        role="PARTICIPANT",
    )

    return {
        "message": "Joined meeting successfully",
        "meeting": meeting,
        "participant_id": participant.id,
    }


def get_meeting_detail(db: Session, code: str):
    """Get full meeting details including participants."""
    meeting = get_meeting_by_code(db, code)
    if not meeting:
        return None

    participants = get_participants_by_meeting(db, meeting.id)

    return {
        "meeting": meeting,
        "participants": participants,
        "meeting_link": generate_meeting_link(code),
    }


def end_meeting(db: Session, code: str):
    """End a meeting by setting status to COMPLETED."""
    meeting = get_meeting_by_code(db, code)
    if not meeting:
        return None

    updated = update_meeting_status(
        db, meeting.id, "COMPLETED", ended_at=datetime.now()
    )
    return updated


def remove_participant_from_meeting(db: Session, participant_id: int):
    """Host control: remove a participant."""
    return remove_participant(db, participant_id)
