import random
import string

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from pydantic import BaseModel

from database import get_db, engine, Base
from models import Tool, User, ShortLink
from auth import hash_password, verify_password, create_token, decode_token

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AIFlow API", version="0.5.0")

bearer_scheme = HTTPBearer(auto_error=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- schemas ----------

class ToolOut(BaseModel):
    id: int
    slug: str
    name: str
    category: str
    tagline: str
    description: str
    pricing: str
    tags: list[str]
    pros: list[str]
    cons: list[str]
    rating: float
    website: str

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_tool(cls, tool: Tool) -> "ToolOut":
        return cls(
            id=tool.id,
            slug=tool.slug,
            name=tool.name,
            category=tool.category,
            tagline=tool.tagline or "",
            description=tool.description or "",
            pricing=tool.pricing or "Free",
            tags=[t for t in (tool.tags or "").split(",") if t],
            pros=[p for p in (tool.pros or "").split(",") if p],
            cons=[c for c in (tool.cons or "").split(",") if c],
            rating=tool.rating or 0.0,
            website=tool.website or "",
        )


class ToolCreate(BaseModel):
    slug: str
    name: str
    category: str
    tagline: str = ""
    description: str = ""
    pricing: str = "Free"
    tags: list[str] = []
    pros: list[str] = []
    cons: list[str] = []
    rating: float = 0.0
    website: str = ""


class ToolUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    pricing: Optional[str] = None
    tags: Optional[list[str]] = None
    pros: Optional[list[str]] = None
    cons: Optional[list[str]] = None
    rating: Optional[float] = None
    website: Optional[str] = None


class UserRegister(BaseModel):
    email: str
    username: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    username: str

    class Config:
        from_attributes = True


class ShortLinkCreate(BaseModel):
    target_url: str
    slug: Optional[str] = None


class ShortLinkOut(BaseModel):
    slug: str
    target_url: str
    clicks: int
    short_url: str


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(credentials.credentials)
    if payload is None or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(User).filter(User.email == payload["sub"]).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User no longer exists")
    return user


# ---------- health ----------

@app.get("/health")
def health():
    return {"status": "ok", "message": "AIFlow backend is running."}


# ---------- tools: CRUD ----------

@app.get("/tools", response_model=list[ToolOut])
def list_tools(
    category: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Tool)
    if category and category.lower() != "all":
        query = query.filter(func.lower(Tool.category) == category.lower())
    if q:
        like = f"%{q.lower()}%"
        query = query.filter(
            func.lower(Tool.name).like(like)
            | func.lower(Tool.tagline).like(like)
            | func.lower(Tool.description).like(like)
        )
    tools = query.all()
    return [ToolOut.from_orm_tool(t) for t in tools]


@app.get("/tools/{slug}", response_model=ToolOut)
def get_tool(slug: str, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.slug == slug).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    return ToolOut.from_orm_tool(tool)


@app.post("/tools", response_model=ToolOut, status_code=201)
def create_tool(payload: ToolCreate, db: Session = Depends(get_db)):
    if db.query(Tool).filter(Tool.slug == payload.slug).first():
        raise HTTPException(status_code=400, detail="A tool with this slug already exists")
    tool = Tool(
        slug=payload.slug,
        name=payload.name,
        category=payload.category,
        tagline=payload.tagline,
        description=payload.description,
        pricing=payload.pricing,
        tags=",".join(payload.tags),
        pros=",".join(payload.pros),
        cons=",".join(payload.cons),
        rating=payload.rating,
        website=payload.website,
    )
    db.add(tool)
    db.commit()
    db.refresh(tool)
    return ToolOut.from_orm_tool(tool)


@app.put("/tools/{slug}", response_model=ToolOut)
def update_tool(slug: str, payload: ToolUpdate, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.slug == slug).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")

    data = payload.dict(exclude_unset=True)
    for field in ("tags", "pros", "cons"):
        if field in data and data[field] is not None:
            data[field] = ",".join(data[field])
    for key, value in data.items():
        setattr(tool, key, value)

    db.commit()
    db.refresh(tool)
    return ToolOut.from_orm_tool(tool)


@app.delete("/tools/{slug}")
def delete_tool(slug: str, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.slug == slug).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    db.delete(tool)
    db.commit()
    return {"message": "Deleted"}


# ---------- categories (derived from live tool data) ----------

@app.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    rows = db.query(Tool.category, func.count(Tool.id)).group_by(Tool.category).all()
    return [{"name": name, "count": count} for name, count in rows]


# ---------- auth ----------

@app.post("/auth/register", status_code=201)
def register(user: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    new_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = create_token({"sub": new_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut.from_orm(new_user),
    }


@app.post("/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": db_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut.from_orm(db_user),
    }


@app.get("/auth/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


# ---------- URL shortener ----------

def generate_slug(length: int = 6) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(random.choice(alphabet) for _ in range(length))


@app.post("/links", response_model=ShortLinkOut, status_code=201)
def create_short_link(payload: ShortLinkCreate, request: Request, db: Session = Depends(get_db)):
    if not payload.target_url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="URL must start with http:// or https://")

    slug = payload.slug.strip() if payload.slug else None
    if slug:
        if not slug.replace("-", "").replace("_", "").isalnum():
            raise HTTPException(status_code=400, detail="Custom slugs can only contain letters, numbers, - and _")
        if db.query(ShortLink).filter(ShortLink.slug == slug).first():
            raise HTTPException(status_code=400, detail="That custom slug is already taken")
    else:
        slug = generate_slug()
        while db.query(ShortLink).filter(ShortLink.slug == slug).first():
            slug = generate_slug()

    link = ShortLink(slug=slug, target_url=payload.target_url, clicks=0)
    db.add(link)
    db.commit()
    db.refresh(link)

    base_url = str(request.base_url).rstrip("/")
    return ShortLinkOut(slug=link.slug, target_url=link.target_url, clicks=link.clicks, short_url=f"{base_url}/s/{link.slug}")


@app.get("/links/{slug}", response_model=ShortLinkOut)
def get_short_link_stats(slug: str, request: Request, db: Session = Depends(get_db)):
    link = db.query(ShortLink).filter(ShortLink.slug == slug).first()
    if not link:
        raise HTTPException(status_code=404, detail="Short link not found")
    base_url = str(request.base_url).rstrip("/")
    return ShortLinkOut(slug=link.slug, target_url=link.target_url, clicks=link.clicks, short_url=f"{base_url}/s/{link.slug}")


@app.get("/s/{slug}")
def redirect_short_link(slug: str, db: Session = Depends(get_db)):
    link = db.query(ShortLink).filter(ShortLink.slug == slug).first()
    if not link:
        raise HTTPException(status_code=404, detail="Short link not found")
    link.clicks += 1
    db.commit()
    return RedirectResponse(url=link.target_url, status_code=307)


@app.get("/")
def root():
    return {"message": "Welcome to the AIFlow API. Visit /docs for interactive API docs."}
