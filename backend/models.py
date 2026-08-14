from sqlalchemy import Column, Integer, String, Float
from database import Base

class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    category = Column(String)
    rating = Column(Float, default=0.0)
    website = Column(String)