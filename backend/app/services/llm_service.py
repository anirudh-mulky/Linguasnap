import json
import re
from groq import AsyncGroq
from app.core.config import settings
from app.schemas.phrases import PhraseRequest, PhraseResponse

client = AsyncGroq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = """You are a professional language teacher.
Always respond with valid JSON only.
No markdown, no prose, no backticks, no explanation."""

def _build_prompt(req: PhraseRequest) -> str:
    return (
        f"Generate 7 practical phrases for a {req.level} English speaker "
        f"learning {req.language} for the scenario: {req.scenario}.\n\n"
        f"Rules:\n"
        f"- 'original': the phrase written in {req.language} (NOT English)\n"
        f"- 'translation': the English meaning of that phrase\n"
        f"- 'phonetic': how to pronounce the {req.language} phrase using English letters\n"
        f"- 'difficulty': integer 1-5\n"
        f"- 'usage_note': short English tip on when to use it\n\n"
        f"Return JSON in exactly this shape:\n"
        f'{{"phrases": [{{"original": str, "translation": str, '
        f'"phonetic": str, "difficulty": 1-5, "usage_note": str}}]}}\n\n'
        f"Order by difficulty ascending. Keep translations concise."
    )

def _parse_response(raw: str) -> dict:
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw.strip())
    return json.loads(cleaned)

async def generate(req: PhraseRequest) -> PhraseResponse:
    last_error = None
    for attempt in range(3):
        try:
            response = await client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                max_tokens=800,
                temperature=0.7,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": _build_prompt(req)},
                ],
            )
            data = _parse_response(response.choices[0].message.content)
            return PhraseResponse(**data)
        except (json.JSONDecodeError, ValueError) as e:
            last_error = e
            continue
    raise ValueError(f"Failed to parse LLM response after 3 attempts: {last_error}")