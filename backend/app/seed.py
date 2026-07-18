# pyrefly: ignore [missing-import]
from datetime import datetime, timedelta
import uuid

from app.database import SessionLocal
from app.models.user import User
from app.models.meeting import Meeting
from app.models.participant import Participant

def generate_meeting_code():
    return uuid.uuid4().hex[:12].upper()

def seed_database():
    db = SessionLocal()

    try:
        #idempotent seeding
        if db.query(User).first():
            print("Database already seeded.")
            return

        user = User(
            name="Sahil Hirdhani",
            email="sahilhirdhani@gmail.com",
            avatar="https://i.pravatar.cc/150?img=12",
            plan="PRO",
            personal_meeting_id=generate_meeting_code(),
        )

        db.add(user)
        db.flush()

        now = datetime.now()

        meetings_data = [
            {
                "title": "System Design Discussion",
                "description": "Microservices Architecture",
                "status": "SCHEDULED",
                "visibility": "PRIVATE",
                "scheduled_at": now + timedelta(days=1),
                "duration": 60,
                "participants": ["Alice", "Bob", "Charlie"],
            },
            {
                "title": "Frontend Sprint Planning",
                "description": "React Integration",
                "status": "SCHEDULED",
                "visibility": "PRIVATE",
                "scheduled_at": now + timedelta(hours=2),
                "duration": 45,
                "participants": ["David", "Emma", "Sophia"],
            },
            {
                "title": "Project Demo",
                "description": "Zoom Clone Demo",
                "status": "SCHEDULED",
                "visibility": "PUBLIC",
                "scheduled_at": now + timedelta(days=7),
                "duration": 90,
                "participants": ["Noah", "Olivia", "Liam"],
            },
            {
                "title": "Daily Standup",
                "description": "Yesterday Standup",
                "status": "COMPLETED",
                "visibility": "PRIVATE",
                "scheduled_at": now - timedelta(days=1),
                "duration": 20,
                "participants": ["John", "Jane", "Max"],
            },
            {
                "title": "Weekly Sync",
                "description": "Weekly Team Sync",
                "status": "COMPLETED",
                "visibility": "PUBLIC",
                "scheduled_at": now - timedelta(days=3),
                "duration": 60,
                "participants": ["Chris", "Sarah", "Alex"],
            },
        ]

        for item in meetings_data:
            meeting = Meeting(
                meeting_code=generate_meeting_code(),
                title=item["title"],
                description=item["description"],
                host_id=user.id,
                status=item["status"],
                visibility=item["visibility"],
                scheduled_at=item["scheduled_at"],
                duration=item["duration"],
                max_participants=20,
                video_enabled=True,
                chat_enabled=True,
                screen_share_enabled=True,
                screen_share_permission="HOST_ONLY",
                is_instant=False,
            )

            db.add(meeting)
            db.flush()

            #host
            db.add(
                Participant(
                    meeting_id=meeting.id,
                    display_name=user.name,
                    email=user.email,
                    role="HOST",
                    joined_at=item["scheduled_at"],
                )
            )

            # Participants
            for name in item["participants"]:

                db.add(
                    Participant(
                        meeting_id=meeting.id,
                        display_name=name,
                        email=f"{name.lower()}@example.com",
                        role="PARTICIPANT",
                    )
                )
        db.commit()
        print("Database seeded successfully")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()