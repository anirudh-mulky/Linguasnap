def test_register_success(client):
    res = client.post("/api/auth/register", json={
        "email": "newuser@test.com",
        "password": "securepass123",
    })
    assert res.status_code in (200, 201)
    assert "email" in res.json()


def test_register_duplicate(client):
    client.post("/api/auth/register", json={
        "email": "dupe@test.com",
        "password": "securepass123",
    })
    res = client.post("/api/auth/register", json={
        "email": "dupe@test.com",
        "password": "securepass123",
    })
    assert res.status_code == 400


def test_login_success(client):
    client.post("/api/auth/register", json={
        "email": "login@test.com",
        "password": "securepass123",
    })
    res = client.post("/api/auth/login", json={
        "email": "login@test.com",
        "password": "securepass123",
    })
    assert res.status_code == 200
    assert "access_token" in res.json()
    assert res.json()["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "email": "wrongpass@test.com",
        "password": "correctpass123",
    })
    res = client.post("/api/auth/login", json={
        "email": "wrongpass@test.com",
        "password": "wrongpassword",
    })
    assert res.status_code == 401


def test_protected_route_without_token(client):
    res = client.get("/api/progress/summary")
    assert res.status_code == 401


def test_protected_route_with_token(auth_client):
    res = auth_client.get("/api/progress/summary")
    assert res.status_code == 200