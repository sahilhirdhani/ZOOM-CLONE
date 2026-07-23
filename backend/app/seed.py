from datetime import datetime, timedelta

from app.database import SessionLocal
from app.models.user import User
from app.models.meeting import Meeting
from app.models.participant import Participant
from app.utils.meeting_id import generate_meeting_code
from app.utils.security import hash_password


def seed_database():
    db = SessionLocal()

    try:
        # Clean up existing data to force re-seeding with new requirements
        db.query(Participant).delete()
        db.query(Meeting).delete()
        db.query(User).delete()
        db.commit()

        user = User(
            name="Sahil Hirdhani",
            email="sahilhirdhani@gmail.com",
            avatar="https://i.pravatar.cc/150?img=12",
            plan="Pro",
            hashed_password=hash_password("password123"),
            personal_meeting_id=generate_meeting_code(),
        )

        db.add(user)
        db.flush()

        now = datetime.now()
        
        # Specific dates: July 20, July 21, July 23, and missed on July 18, 2026
        date_missed = datetime(2026, 7, 18, 9, 0)

        meetings_data = [
            {
                "title": "System Design Discussion",
                "description": "Deep dive into microservices architecture and scaling strategies",
                "status": "SCHEDULED",
                "visibility": "PRIVATE",
                "scheduled_at": now + timedelta(days=1),
                "duration": 60,
                "participants": [
                    ("Alice Johnson", "alice@example.com"),
                    ("Bob Smith", "bob@example.com"),
                    ("Charlie Brown", "charlie@example.com"),
                ],
            },
            {
                "title": "Frontend Sprint Planning",
                "description": "Plan the next sprint for React component migration",
                "status": "SCHEDULED",
                "visibility": "PRIVATE",
                "scheduled_at": now + timedelta(days=3),
                "duration": 45,
                "participants": [
                    ("David Lee", "david@example.com"),
                    ("Emma Wilson", "emma@example.com"),
                    ("Sophia Davis", "sophia@example.com"),
                ],
            },
            {
                "title": "Project Demo & Review",
                "description": "Final demo of the Zoom Clone project to stakeholders",
                "status": "SCHEDULED",
                "visibility": "PUBLIC",
                "scheduled_at": now + timedelta(days=5),
                "duration": 90,
                "participants": [
                    ("Noah Garcia", "noah@example.com"),
                    ("Olivia Martinez", "olivia@example.com"),
                    ("Liam Anderson", "liam@example.com"),
                ],
            },
            {
                "title": "Team Standup",
                "description": "Daily standup — blockers and progress updates",
                "status": "MISSED",
                "visibility": "PRIVATE",
                "scheduled_at": date_missed,
                "duration": 15,
                "participants": [
                    ("Max Turner", "max@example.com"),
                    ("Jane Cooper", "jane@example.com"),
                ],
            },
            {
                "title": "Daily Standup",
                "description": "Yesterday's standup discussion",
                "status": "COMPLETED",
                "visibility": "PRIVATE",
                "scheduled_at": now - timedelta(days=1),
                "duration": 20,
                "participants": [
                    ("John Miller", "john@example.com"),
                    ("Jane Cooper", "jane@example.com"),
                    ("Max Turner", "max@example.com"),
                ],
            },
            {
                "title": "Weekly Sync",
                "description": "Weekly team sync and retrospective",
                "status": "COMPLETED",
                "visibility": "PUBLIC",
                "scheduled_at": now - timedelta(days=3),
                "duration": 60,
                "participants": [
                    ("Chris Evans", "chris@example.com"),
                    ("Sarah Johnson", "sarah@example.com"),
                    ("Alex Kim", "alex@example.com"),
                ],
            },
            {
                "title": "Design Review",
                "description": "Review latest UI/UX mockups for the dashboard",
                "status": "COMPLETED",
                "visibility": "PRIVATE",
                "scheduled_at": now - timedelta(days=5),
                "duration": 45,
                "participants": [
                    ("Rachel Green", "rachel@example.com"),
                    ("Monica Geller", "monica@example.com"),
                ],
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
                max_participants=100,
                video_enabled=True,
                chat_enabled=True,
                screen_share_enabled=True,
                screen_share_permission="HOST_ONLY",
                is_instant=False,
            )

            db.add(meeting)
            db.flush()

            # Host as participant
            db.add(
                Participant(
                    meeting_id=meeting.id,
                    display_name=user.name,
                    email=user.email,
                    role="HOST",
                    joined_at=item["scheduled_at"],
                )
            )

            # Other participants
            for name, email in item["participants"]:
                db.add(
                    Participant(
                        meeting_id=meeting.id,
                        display_name=name,
                        email=email,
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