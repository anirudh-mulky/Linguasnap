def test_summary_empty(auth_client):
    res = auth_client.get("/api/progress/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_xp"] >= 0
    assert "sessions" in data
    assert isinstance(data["sessions"], list)


def test_save_progress(auth_client):
    res = auth_client.post("/api/progress", json={
        "language": "Spanish",
        "scenario": "airport",
        "xp_earned": 50,
        "correct": 5,
        "total": 7,
    })
    assert res.status_code == 200
    data = res.json()
    assert data["language"] == "Spanish"
    assert data["scenario"] == "airport"
    assert data["xp"] >= 50


def test_save_progress_accumulates_xp(auth_client):
    auth_client.post("/api/progress", json={
        "language": "French",
        "scenario": "restaurant",
        "xp_earned": 30,
        "correct": 3,
        "total": 7,
    })
    auth_client.post("/api/progress", json={
        "language": "French",
        "scenario": "restaurant",
        "xp_earned": 40,
        "correct": 4,
        "total": 7,
    })
    res = auth_client.get("/api/progress/summary")
    assert res.status_code == 200
    # Total XP should include both sessions
    assert res.json()["total_xp"] >= 70


def test_save_progress_requires_auth(client):
    res = client.post("/api/progress", json={
        "language": "Spanish",
        "scenario": "airport",
        "xp_earned": 50,
        "correct": 5,
        "total": 7,
    })
    assert res.status_code == 401