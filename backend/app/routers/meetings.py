from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.meeting import (
    InstantMeetingResponse,
    ScheduleMeetingRequest,
    MeetingResponse,
    JoinMeetingRequest,
    JoinMeetingResponse,
)
from app.schemas.participant import ParticipantResponse
from app.services.meeting_service import (
    create_instant_meeting,
    schedule_meeting,
    join_meeting,
    get_meeting_detail,
    end_meeting,
    remove_participant_from_meeting,
)
from app.crud.participant import get_participants_by_meeting
from app.crud.meeting import get_meeting_by_code

from app.models.participant import Participant

router = APIRouter(
    prefix="/meetings",
    tags=["Meetings"],
)


@router.post("/instant", response_model=InstantMeetingResponse)
def instant_meeting(db: Session = Depends(get_db)):
    """Create an instant meeting."""
    result = create_instant_meeting(db)
    return result


@router.post("/schedule", response_model=InstantMeetingResponse)
def schedule(data: ScheduleMeetingRequest, db: Session = Depends(get_db)):
    """Schedule a future meeting."""
    result = schedule_meeting(db, data)
    return result


@router.post("/join", response_model=JoinMeetingResponse)
def join(data: JoinMeetingRequest, db: Session = Depends(get_db)):
    """Join a meeting by code and display name."""
    result = join_meeting(db, data.meeting_code, data.display_name)
    if not result:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return result


@router.get("/{code}")
def meeting_detail(code: str, db: Session = Depends(get_db)):
    """Get full meeting details with participants."""
    result = get_meeting_detail(db, code)
    if not result:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return {
        "meeting": MeetingResponse.model_validate(result["meeting"]),
        "participants": [
            ParticipantResponse.model_validate(p) for p in result["participants"]
        ],
        "meeting_link": result["meeting_link"],
    }


@router.patch("/{code}/end", response_model=MeetingResponse)
def end(code: str, db: Session = Depends(get_db)):
    """End an active meeting."""
    result = end_meeting(db, code)
    if not result:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return result


@router.get("/{code}/participants", response_model=list[ParticipantResponse])
def participants(code: str, db: Session = Depends(get_db)):
    """List participants in a meeting."""
    meeting = get_meeting_by_code(db, code)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return get_participants_by_meeting(db, meeting.id)


@router.delete("/participants/{participant_id}")
def remove_participant(participant_id: int, requester_id: int = None, db: Session = Depends(get_db)):
    """Remove a participant (host control)."""
    target = db.query(Participant).filter(Participant.id == participant_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    if requester_id is not None:
        if requester_id == participant_id:
            # A participant can always remove themselves (leave)
            pass
        else:
            requester = db.query(Participant).filter(Participant.id == requester_id).first()
            if not requester or requester.meeting_id != target.meeting_id or requester.role != "HOST":
                raise HTTPException(status_code=403, detail="Only the host can remove participants")
    else:
        raise HTTPException(status_code=403, detail="Requester ID is required to verify privileges")

    success = remove_participant_from_meeting(db, participant_id)
    if not success:
        raise HTTPException(status_code=404, detail="Participant not found")
    return {"message": "Participant removed"}


@router.patch("/participants/{participant_id}/mute")
def mute_participant(
    participant_id: int,
    is_muted: bool,
    requester_id: int = None,
    db: Session = Depends(get_db)
):
    """Mute or unmute a specific participant (host or self control)."""
    target = db.query(Participant).filter(Participant.id == participant_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    # Check permissions
    if requester_id is not None:
        if requester_id == participant_id:
            # Self-muting is allowed
            pass
        else:
            # Only host can mute others
            requester = db.query(Participant).filter(Participant.id == requester_id).first()
            if not requester or requester.meeting_id != target.meeting_id or requester.role != "HOST":
                raise HTTPException(status_code=403, detail="Only the host can mute other participants")
    else:
        raise HTTPException(status_code=403, detail="Requester ID is required to verify privileges")
    
    target.is_muted = is_muted
    db.commit()
    db.refresh(target)
    return {"message": "Participant mute status updated", "is_muted": target.is_muted}


@router.patch("/{code}/mute-all")
def mute_all_participants(
    code: str,
    requester_id: int = None,
    db: Session = Depends(get_db)
):
    """Mute all participants in a meeting (host control)."""
    meeting = get_meeting_by_code(db, code)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    if requester_id is not None:
        requester = db.query(Participant).filter(Participant.id == requester_id).first()
        if not requester or requester.meeting_id != meeting.id or requester.role != "HOST":
            raise HTTPException(status_code=403, detail="Only the host can mute all participants")
    else:
        raise HTTPException(status_code=403, detail="Requester ID is required to verify host privileges")
        
    attendees = db.query(Participant).filter(Participant.meeting_id == meeting.id, Participant.role != "HOST").all()
    for attendee in attendees:
        attendee.is_muted = True
    db.commit()
    return {"message": "All participants muted"}
