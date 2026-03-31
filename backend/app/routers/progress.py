from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models.user import User, Progress
from app.schemas.progress import ProgressSave, ProgressResponse, ProgressSummary
from app.core.security import get_current_user

router = APIRouter(prefix="/api/progress", tags=["progress"])

XP_PER_CORRECT = 10
STREAK_BONUS    = 5   # extra XP per correct when on a streak


@router.post("", response_model=ProgressResponse)
async def save_progress(
    payload: ProgressSave,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Calculate XP — bonus if they got > 50% correct
    bonus   = STREAK_BONUS if payload.correct > payload.total // 2 else 0
    xp_gain = payload.xp_earned + (bonus * payload.correct)

    # Find or create a progress record for this user + language + scenario
    record = (
        db.query(Progress)
        .filter_by(user_id=current_user.id, language=payload.language, scenario=payload.scenario)
        .first()
    )

    now = datetime.utcnow()

    if record is None:
        record = Progress(
            user_id=current_user.id,
            language=payload.language,
            scenario=payload.scenario,
            xp=xp_gain,
            streak=1,
            last_played=now,
        )
        db.add(record)
    else:
        record.xp += xp_gain
        # Increment streak if played within 24 hours, else reset to 1
        if now - record.last_played < timedelta(hours=24):
            record.streak += 1
        else:
            record.streak = 1
        record.last_played = now

    db.commit()
    db.refresh(record)
    return record


@router.get("/summary", response_model=ProgressSummary)
async def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    records = (
        db.query(Progress)
        .filter_by(user_id=current_user.id)
        .order_by(Progress.last_played.desc())
        .all()
    )
    total_xp = sum(r.xp for r in records)
    streak   = max((r.streak for r in records), default=0)
    return ProgressSummary(total_xp=total_xp, streak=streak, sessions=records)