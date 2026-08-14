from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine
from models import Tool, Base
from pydantic import BaseModel
from typing import Optional

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AIFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ToolCreate(BaseModel):
    name: str
    description: str
    category: str
    rating: Optional[float] = 0.0
    website: Optional[str] = ""

@app.get("/health")
def health():
    return {"status": "AIFlow backend is running."}

@app.get("/tools")
def get_tools(db: Session = Depends(get_db)):
    return db.query(Tool).all()

@app.post("/tools")
def create_tool(tool: ToolCreate, db: Session = Depends(get_db)):
    db_tool = Tool(**tool.dict())
    db.add(db_tool)
    db.commit()
    db.refresh(db_tool)
    return db_tool

@app.delete("/tools/{tool_id}")
def delete_tool(tool_id: int, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    db.delete(tool)
    db.commit()
    return {"message": "Deleted"}