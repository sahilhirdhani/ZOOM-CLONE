from fastapi import FastAPI

from app.database import Base, engine
from app.seed import seed_database
from app.models import User, Meeting, Participant

Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Zoom Clone API"}

# @app.get("/about")
# def about():
#     return {
#         "project": "Zoom clone",
#         "backend":"FastAPI"
#     }