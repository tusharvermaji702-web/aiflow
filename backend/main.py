from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine
from models import Tool, Base
from pydantic import BaseModel
from typing import Optional

from auth import hash_password, verify_password, create_token
from models import User

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
class UserRegister(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/auth/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}