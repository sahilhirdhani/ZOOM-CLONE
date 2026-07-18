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

# CORS — allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Zoom Clone API"}


app.include_router(dashboard_router)
app.include_router(meetings_router)