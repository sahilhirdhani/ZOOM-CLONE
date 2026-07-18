from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship

from app.database import Base


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id")
    )

    display_name = Column(String, nullable=False)

    email = Column(String)

    role = Column(String, default="PARTICIPANT")

    joined_at = Column(DateTime(timezone=True))

    left_at = Column(DateTime(timezone=True))

    meeting = relationship(
        "Meeting",
        back_populates="participants"
    )