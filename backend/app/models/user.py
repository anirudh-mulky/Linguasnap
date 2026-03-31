from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    progress = relationship("Progress", back_populates="user")

class Progress(Base):
    __tablename__ = "progress"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    language   = Column(String, nullable=False)
    scenario   = Column(String, nullable=False)
    xp         = Column(Integer, default=0)
    streak     = Column(Integer, default=0)
    last_played = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="progress")