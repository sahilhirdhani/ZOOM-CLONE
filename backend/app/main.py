from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.seed import seed_database

from app.routers.dashboard import router as dashboard_router
from app.routers.meetings import router as meetings_router

from app.models import User, Meeting, Participant

Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="Zoom Clone API",
    description="Backend API for Zoom Clone video conferencing platform",
    version="1.0.0",
)

import os
from pathlib import Path

# Load .env file
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if "=" in line:
                key, val = line.strip().split("=", 1)
                os.environ[key.strip()] = val.strip().strip('"').strip("'")

FRONTEND_URL = os.getenv("FRONTEND_URL")

# CORS — allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Zoom Clone API"}


app.include_router(dashboard_router)
app.include_router(meetings_router)