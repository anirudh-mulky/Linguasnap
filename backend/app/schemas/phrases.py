from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class PhraseRequest(BaseModel):
    language: str = Field(..., min_length=2, max_length=50)
    scenario: Literal['airport', 'restaurant', 'shopping', 'medical', 'work']
    level: Literal['tourist', 'conversational', 'fluent'] = 'tourist'


class Phrase(BaseModel):
    original: str
    translation: str
    phonetic: str
    difficulty: int = Field(ge=1, le=5)
    usage_note: Optional[str] = None


class PhraseResponse(BaseModel):
    phrases: List[Phrase]