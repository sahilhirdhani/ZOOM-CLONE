from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABSE_URL = "sqlite:///./zoom_clone.db"

engine = create_engine(
    DATABSE_URL,
    connect_args={"check_same_thread":False},
    # echo=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()