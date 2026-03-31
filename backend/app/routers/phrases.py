import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.phrases import PhraseRequest, PhraseResponse
from app.core.redis_client import redis_client
from app.core.security import get_current_user
from app.models.user import User
from app import services

router = APIRouter(prefix="/api/phrases", tags=["phrases"])


@router.post("", response_model=PhraseResponse)
async def generate_phrases(
    req: PhraseRequest,
    bust: int = Query(0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cache_key = f"phrases:{req.language}:{req.scenario}:{req.level}"

    # Cache hit
    if not bust:
        cached = await redis_client.get(cache_key)
        if cached:
            return PhraseResponse(**json.loads(cached))

    # Cache miss — call OpenAI
    try:
        from app.services import llm_service
        result = await llm_service.generate(req)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))

    # Store in Redis (24 h TTL)
    await redis_client.setex(cache_key, 86400, json.dumps(
        {"phrases": [p.model_dump() for p in result.phrases]}
    ))

    return result