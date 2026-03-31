from pydantic import BaseModel
from datetime import datetime


class ProgressSave(BaseModel):
    language: str
    scenario: str
    xp_earned: int
    correct: int
    total: int

    model_config = {"from_attributes": True}


class ProgressResponse(BaseModel):
    language: str
    scenario: str
    xp: int
    streak: int
    last_played: datetime

    model_config = {"from_attributes": True}


class ProgressSummary(BaseModel):
    total_xp: int
    streak: int
    sessions: list[ProgressResponse]

    model_config = {"from_attributes": True}