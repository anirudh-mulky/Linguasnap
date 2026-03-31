from unittest.mock import patch


MOCK_PHRASES = {
    "phrases": [
        {
            "original": "¿Dónde está el baño?",
            "translation": "Where is the bathroom?",
            "phonetic": "DOHN-deh eh-STAH el BAH-nyoh",
            "difficulty": 1,
            "usage_note": "Essential phrase",
        }
    ] * 7
}


def test_phrases_requires_auth(client):
    res = client.post("/api/phrases", json={
        "language": "Spanish",
        "scenario": "airport",
        "level": "tourist",
    })
    assert res.status_code == 401


@patch("app.services.llm_service.generate")
@patch("app.routers.phrases.redis_client")
def test_phrases_returns_data(mock_redis, mock_generate, auth_client):
    from app.schemas.phrases import PhraseResponse, Phrase
    from unittest.mock import AsyncMock

    mock_redis.get = AsyncMock(return_value=None)
    mock_redis.setex = AsyncMock(return_value=True)

    mock_generate.return_value = PhraseResponse(phrases=[
        Phrase(
            original="Hola",
            translation="Hello",
            phonetic="OH-lah",
            difficulty=1,
            usage_note="Greeting",
        )
    ])

    res = auth_client.post("/api/phrases", json={
        "language": "Spanish",
        "scenario": "airport",
        "level": "tourist",
    })
    assert res.status_code == 200
    assert "phrases" in res.json()
    assert len(res.json()["phrases"]) == 1


def test_phrases_invalid_scenario(auth_client):
    res = auth_client.post("/api/phrases", json={
        "language": "Spanish",
        "scenario": "invalid_scenario",
        "level": "tourist",
    })
    assert res.status_code == 422


def test_phrases_invalid_level(auth_client):
    res = auth_client.post("/api/phrases", json={
        "language": "Spanish",
        "scenario": "airport",
        "level": "invalid_level",
    })
    assert res.status_code == 422