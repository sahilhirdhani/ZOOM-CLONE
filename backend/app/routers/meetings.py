import os
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from livekit.api import AccessToken, VideoGrants

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
)
from app.crud.participant import get_participants_by_meeting
from app.crud.meeting import get_meeting_by_code
from app.schemas.message import MessageResponse, MessageCreate
from app.services import participant_service, message_service

router = APIRouter(
    prefix="/meetings",
    tags=["Meetings"],
)


@router.post("/instant", response_model=InstantMeetingResponse)
def instant_meeting(db: Session = Depends(get_db), x_user_id: int | None = Header(None)):
    """Create an instant meeting."""
    return create_instant_meeting(db, x_user_id)


@router.post("/schedule", response_model=InstantMeetingResponse)
def schedule(data: ScheduleMeetingRequest, db: Session = Depends(get_db), x_user_id: int | None = Header(None)):
    """Schedule a future meeting."""
    return schedule_meeting(db, data, x_user_id)


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
    """List active participants in a meeting."""
    meeting = get_meeting_by_code(db, code)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return get_participants_by_meeting(db, meeting.id)


@router.delete("/participants/{participant_id}")
def remove_participant(participant_id: int, requester_id: int = None, db: Session = Depends(get_db)):
    """Remove a participant (host control)."""
    success = participant_service.remove_participant_from_meeting(db, participant_id, requester_id)
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
    result = participant_service.toggle_mute_status(db, participant_id, is_muted, requester_id)
    return {"message": "Participant mute status updated", "is_muted": result.is_muted}


@router.patch("/{code}/mute-all")
def mute_all_participants(
    code: str,
    requester_id: int = None,
    db: Session = Depends(get_db)
):
    """Mute all participants in a meeting (host control)."""
    return participant_service.mute_all_meeting_participants(db, code, requester_id)


@router.patch("/participants/{participant_id}/raise-hand")
def raise_hand(
    participant_id: int,
    raised: bool,
    db: Session = Depends(get_db)
):
    """Raise or lower hand."""
    result = participant_service.update_hand_status(db, participant_id, raised)
    return {"message": "Hand status updated", "raised_hand": result.raised_hand}


@router.patch("/participants/{participant_id}/react")
def react(
    participant_id: int,
    reaction: str = None,
    db: Session = Depends(get_db)
):
    """Submit a reaction emoji."""
    result = participant_service.update_reaction(db, participant_id, reaction)
    return {"message": "Reaction updated", "reaction": result.reaction}


@router.post("/{code}/messages", response_model=MessageResponse)
def send_message(
    code: str,
    data: MessageCreate,
    db: Session = Depends(get_db)
):
    """Send a chat message in the meeting."""
    return message_service.send_meeting_message(db, code, data)


@router.get("/{code}/messages", response_model=list[MessageResponse])
def get_messages(
    code: str,
    db: Session = Depends(get_db)
):
    """Retrieve all chat messages in a meeting."""
    return message_service.get_meeting_messages(db, code)


@router.get("/{code}/livekit-token")
def get_livekit_token(
    code: str,
    participant_name: str,
    db: Session = Depends(get_db)
):
    """Generate a LiveKit access token for a participant."""
    meeting = get_meeting_by_code(db, code)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    api_key = os.getenv("LIVEKIT_API_KEY")
    api_secret = os.getenv("LIVEKIT_API_SECRET")

    if not api_key or not api_secret:
        raise HTTPException(status_code=500, detail="LiveKit credentials not configured on server")

    token = AccessToken(api_key, api_secret) \
        .with_identity(participant_name) \
        .with_name(participant_name) \
        .with_grants(VideoGrants(
            room_join=True,
            room=code,
        ))
    
    return {"token": token.to_jwt()}

