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
def remove_participant(participant_id: int, db: Session = Depends(get_db)):
    """Remove a participant (host control)."""
    success = remove_participant_from_meeting(db, participant_id)
    if not success:
        raise HTTPException(status_code=404, detail="Participant not found")
    return {"message": "Participant removed"}
