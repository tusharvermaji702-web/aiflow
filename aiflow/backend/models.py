from sqlalchemy import Column, Integer, String, Float, Text
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
