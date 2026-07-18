from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.participant import Participant
from app.crud.meeting import get_meeting_by_code
from app.crud.participant import remove_participant

def verify_host_privilege(db: Session, requester_id: int | None, meeting_id: int) -> Participant:
    """Helper to verify that the requester exists in the meeting and is the HOST."""
    if requester_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Requester ID is required to verify host privileges"
        )
    requester = db.query(Participant).filter(Participant.id == requester_id).first()
    if not requester or requester.meeting_id != meeting_id or requester.role != "HOST":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the host can perform this action"
        )
    return requester

def remove_participant_from_meeting(db: Session, participant_id: int, requester_id: int | None) -> bool:
    """Host control or self-service: remove a participant."""
    target = db.query(Participant).filter(Participant.id == participant_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    if requester_id is not None:
        if requester_id != participant_id:
            verify_host_privilege(db, requester_id, target.meeting_id)
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Requester ID is required to verify privileges"
        )

    return remove_participant(db, participant_id)

def toggle_mute_status(db: Session, participant_id: int, is_muted: bool, requester_id: int | None) -> Participant:
    """Mute or unmute a specific participant (host or self control)."""
    target = db.query(Participant).filter(Participant.id == participant_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    if requester_id is not None:
        if requester_id != participant_id:
            verify_host_privilege(db, requester_id, target.meeting_id)
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Requester ID is required to verify privileges"
        )
    
    target.is_muted = is_muted
    db.commit()
    db.refresh(target)
    return target

def mute_all_meeting_participants(db: Session, meeting_code: str, requester_id: int | None):
    """Mute all non-host participants in a meeting (host control)."""
    meeting = get_meeting_by_code(db, meeting_code)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    verify_host_privilege(db, requester_id, meeting.id)
        
    attendees = db.query(Participant).filter(
        Participant.meeting_id == meeting.id,
        Participant.role != "HOST",
        Participant.left_at.is_(None)
    ).all()
    
    for attendee in attendees:
        attendee.is_muted = True
    db.commit()
    return {"message": "All participants muted"}

def update_hand_status(db: Session, participant_id: int, raised: bool) -> Participant:
    """Raise or lower hand."""
    target = db.query(Participant).filter(Participant.id == participant_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Participant not found")
    target.raised_hand = raised
    db.commit()
    db.refresh(target)
    return target

def update_reaction(db: Session, participant_id: int, reaction: str | None) -> Participant:
    """Submit a reaction emoji."""
    target = db.query(Participant).filter(Participant.id == participant_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Participant not found")
    target.reaction = reaction
    db.commit()
    db.refresh(target)
    return target
