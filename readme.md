# 🎥 Zoom Clone — Video Conferencing Platform

A full-stack **Zoom-like video conferencing web application** built with **Next.js** (frontend) and **FastAPI** (backend), featuring a pixel-perfect recreation of Zoom's modern UI/UX design.

![Tech Stack](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)
![Tech Stack](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![Tech Stack](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite)
![Tech Stack](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss)

---

## ✨ Features

### Core Features
- **📋 Landing Dashboard** — Professional Zoom-style home page with welcome header, action cards, and meeting lists
- **🎬 Instant Meeting** — Create meetings instantly with auto-generated Meeting IDs and shareable invite links
- **🔗 Join Meeting** — Join via Meeting ID or direct invite link with display name entry
- **📅 Schedule Meetings** — Full scheduling with title, description, date/time picker, and duration selector
- **👥 Meeting Room** — Dark-themed meeting room with participant grid, real-time timer, and full toolbar
- **🎛️ Host Controls** — Mute all, remove participants, end meeting

### Bonus Features
- **📱 Responsive Design** — Works across desktop, tablet, and mobile
- **🎨 Pixel-perfect Zoom UI** — Faithful recreation of Zoom Workplace's design language
- **⚡ Real-time Timer** — Live meeting duration counter
- **📋 Copy Invite Links** — One-click copy for meeting links
- **🔒 Encrypted Badge** — Security indicator in meeting room header

---

## 🛠️ Tech Stack

| Layer      | Technology           |
|------------|---------------------|
| Frontend   | Next.js 16 (React 19) |
| Backend    | Python + FastAPI     |
| Database   | SQLite               |
| Styling    | Tailwind CSS v4 + Custom CSS |
| HTTP Client| Axios                |
| Icons      | Lucide React         |
| Forms      | React Hook Form      |

---

## 📐 Database Schema

```
┌──────────────────────┐     ┌──────────────────────────────┐     ┌──────────────────────┐
│       users           │     │          meetings              │     │    participants        │
├──────────────────────┤     ├──────────────────────────────┤     ├──────────────────────┤
│ id (PK)              │────│ id (PK)                       │────│ id (PK)              │
│ name                 │     │ meeting_code (UNIQUE)         │     │ meeting_id (FK)      │
│ email (UNIQUE)       │     │ title                         │     │ display_name         │
│ avatar               │     │ description                   │     │ email                │
│ plan                 │     │ host_id (FK → users.id)       │     │ role                 │
│ personal_meeting_id  │     │ status                        │     │ joined_at            │
│ created_at           │     │ visibility                    │     │ left_at              │
│ updated_at           │     │ scheduled_at                  │     └──────────────────────┘
└──────────────────────┘     │ duration                      │
                             │ max_participants              │
                             │ video_enabled                 │
                             │ chat_enabled                  │
                             │ screen_share_enabled          │
                             │ screen_share_permission       │
                             │ is_instant                    │
                             │ created_at                    │
                             │ updated_at                    │
                             │ ended_at                      │
                             └──────────────────────────────┘
```

### Relationships
- **User → Meetings**: One-to-Many (a user can host many meetings)
- **Meeting → Participants**: One-to-Many (a meeting has many participants)

### Status Values
- `SCHEDULED` — Future scheduled meeting
- `ACTIVE` — Currently ongoing meeting
- `COMPLETED` — Meeting has ended

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.10+
- **pip** (Python package manager)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server (auto-creates and seeds the database)
uvicorn app.main:app --reload
```

The backend starts at **http://localhost:8000**

API docs available at: **http://localhost:8000/docs** (Swagger UI)

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend starts at **http://localhost:3000**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard` | Get dashboard data (user + meetings) |
| `POST` | `/meetings/instant` | Create an instant meeting |
| `POST` | `/meetings/schedule` | Schedule a future meeting |
| `POST` | `/meetings/join` | Join a meeting by code |
| `GET` | `/meetings/{code}` | Get meeting details with participants |
| `PATCH` | `/meetings/{code}/end` | End an active meeting |
| `GET` | `/meetings/{code}/participants` | List meeting participants |
| `DELETE` | `/meetings/participants/{id}` | Remove a participant |

---

## 📁 Project Structure

```
ZOOM_CLONE/
├── backend/
│   ├── app/
│   │   ├── crud/              # Database CRUD operations
│   │   │   ├── meeting.py
│   │   │   ├── participant.py
│   │   │   └── user.py
│   │   ├── models/            # SQLAlchemy ORM models
│   │   │   ├── meeting.py
│   │   │   ├── participant.py
│   │   │   └── user.py
│   │   ├── routers/           # FastAPI route handlers
│   │   │   ├── dashboard.py
│   │   │   └── meetings.py
│   │   ├── schemas/           # Pydantic validation schemas
│   │   │   ├── dashboard.py
│   │   │   ├── meeting.py
│   │   │   ├── participant.py
│   │   │   └── user.py
│   │   ├── services/          # Business logic layer
│   │   │   ├── dashboard_service.py
│   │   │   └── meeting_service.py
│   │   ├── utils/             # Utility functions
│   │   │   └── meeting_id.py
│   │   ├── database.py        # DB connection + shared dependency
│   │   ├── main.py            # FastAPI app entry point
│   │   └── seed.py            # Database seed data
│   ├── requirements.txt
│   └── zoom_clone.db          # SQLite database (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── join/page.tsx          # Join meeting page
│   │   │   ├── meeting/[code]/page.tsx # Meeting room page
│   │   │   ├── globals.css            # Zoom design system
│   │   │   ├── layout.tsx             # Root layout
│   │   │   └── page.tsx               # Dashboard / Home page
│   │   ├── components/
│   │   │   ├── JoinModal.tsx          # Join meeting modal
│   │   │   ├── MeetingCard.tsx        # Meeting list card
│   │   │   ├── NewMeetingModal.tsx    # Instant meeting modal
│   │   │   ├── ParticipantsPanel.tsx  # Meeting room panel
│   │   │   ├── ScheduleModal.tsx      # Schedule meeting modal
│   │   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   │   └── TopBar.tsx             # Top header bar
│   │   └── lib/
│   │       ├── api.ts                 # Axios API client
│   │       └── types.ts               # TypeScript interfaces
│   ├── package.json
│   └── next.config.ts
│
└── readme.md
```

---

## 🎨 Design Decisions

- **Zoom Workplace UI**: The interface closely mirrors Zoom's 2025 design language with its clean sidebar navigation, blue accent colors (#0B5CFF), and white content areas
- **Inter Font**: Used as the primary typeface to match Zoom's clean sans-serif aesthetic
- **Component Architecture**: All UI elements are separated into reusable components with clear responsibilities
- **Service Layer Pattern**: Backend uses a 3-layer architecture (Router → Service → CRUD) for clean separation of concerns
- **No Authentication Required**: A default user is assumed to be logged in per assignment requirements

---

## ⚠️ Assumptions

1. **Single User**: The app assumes one default user (seeded on startup). No login/signup flow.
2. **Simulated Video**: Video/audio is simulated with avatar-based participant tiles — the focus is on UI/UX and meeting workflows.
3. **Local Development**: Meeting links use `localhost:3000` as the base URL.
4. **SQLite**: Database is file-based and auto-created on first run. Delete `zoom_clone.db` to reset.

---

## 👤 Author

**Sahil Hirdhani**  
Built as part of the SDE Fullstack Assignment
