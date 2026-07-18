from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    meeting_code = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    host_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="SCHEDULED")
    visibility = Column(String, default="PRIVATE")
    scheduled_at = Column(DateTime(timezone=True))
    duration = Column(Integer)
    max_participants = Column(Integer, default=100)
    video_enabled = Column(Boolean, default=True)
    chat_enabled = Column(Boolean, default=True)
    screen_share_enabled = Column(Boolean, default=True)
    screen_share_permission = Column(
        String,
        default="HOST_ONLY"
    )
    is_instant = Column(Boolean, default=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
    ended_at = Column(DateTime(timezone=True))
    host = relationship(
        "User",
        back_populates="meetings"
    )
    participants = relationship(
        "Participant",
        back_populates="meeting",
        cascade="all, delete"
    )