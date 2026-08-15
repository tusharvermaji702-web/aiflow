from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# Falls back to a local SQLite file if DATABASE_URL isn't set, so the app
# still runs without a Postgres install. Set DATABASE_URL in .env to point
# at a real Postgres instance for anything beyond local development.
DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./aiflow.db"

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
