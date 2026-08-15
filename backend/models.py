from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base


class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    tagline = Column(String)
    description = Column(Text)
    pricing = Column(String, default="Free")  # "Free" | "Freemium" | "Paid"
    tags = Column(String, default="")  # comma-separated; kept simple for Month 3
    pros = Column(String, default="")  # comma-separated
    cons = Column(String, default="")  # comma-separated
    rating = Column(Float, default=0.0)
    website = Column(String, default="")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class SavedItem(Base):
    """A tool or workflow a user has saved. Workflows are still mock data
    (see web/lib/mock-data.ts), so we store their slug/name directly rather
    than a foreign key — that'll change once workflows get their own table."""
    __tablename__ = "saved_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    item_type = Column(String, index=True)  # "tool" | "workflow"
    item_slug = Column(String, index=True)
    item_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
