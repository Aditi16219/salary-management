def employee_payload(**overrides):
    base = {
        "full_name": "Jane Doe",
        "job_title": "Software Engineer",
        "country": "United States",
        "salary": "95000.00",
        "department": "Engineering",
        "email": "jane.doe@example.com",
        "hire_date": "2022-01-15",
        "employment_type": "full_time",
    }
    return {**base, **overrides}


def test_create_employee_returns_201(client):
    response = client.post("/employees", json=employee_payload())
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Jane Doe"
    assert data["id"] is not None
    assert data["is_active"] is True


def test_create_employee_duplicate_email_returns_409(client):
    client.post("/employees", json=employee_payload())
    response = client.post("/employees", json=employee_payload())
    assert response.status_code == 409


def test_get_employee_returns_200(client):
    create_response = client.post("/employees", json=employee_payload())
    employee_id = create_response.json()["id"]
    response = client.get(f"/employees/{employee_id}")
    assert response.status_code == 200
    assert response.json()["id"] == employee_id


def test_get_nonexistent_employee_returns_404(client):
    response = client.get("/employees/nonexistent-id")
    assert response.status_code == 404


def test_list_employees_returns_paginated_response(client):
    client.post("/employees", json=employee_payload(email="a@example.com"))
    client.post("/employees", json=employee_payload(email="b@example.com"))
    response = client.get("/employees")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2
    assert data["page"] == 1


def test_list_employees_pagination(client):
    for i in range(5):
        client.post("/employees", json=employee_payload(email=f"user{i}@example.com"))
    response = client.get("/employees", params={"page": 1, "page_size": 3})
    data = response.json()
    assert data["total"] == 5
    assert len(data["items"]) == 3
    assert data["page_size"] == 3


def test_list_employees_filter_by_country(client):
    client.post("/employees", json=employee_payload(email="us@example.com", country="United States"))
    client.post("/employees", json=employee_payload(email="uk@example.com", country="United Kingdom"))
    response = client.get("/employees", params={"country": "United States"})
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["country"] == "United States"


def test_list_employees_search_by_name(client):
    client.post("/employees", json=employee_payload(email="alice@example.com", full_name="Alice Smith"))
    client.post("/employees", json=employee_payload(email="bob@example.com", full_name="Bob Jones"))
    response = client.get("/employees", params={"search": "Alice"})
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["full_name"] == "Alice Smith"


def test_update_employee_salary(client):
    create_response = client.post("/employees", json=employee_payload())
    employee_id = create_response.json()["id"]
    response = client.put(f"/employees/{employee_id}", json={"salary": "110000.00"})
    assert response.status_code == 200
    assert float(response.json()["salary"]) == 110000.0


def test_update_nonexistent_employee_returns_404(client):
    response = client.put("/employees/nonexistent-id", json={"salary": "110000.00"})
    assert response.status_code == 404


def test_delete_employee_returns_204(client):
    create_response = client.post("/employees", json=employee_payload())
    employee_id = create_response.json()["id"]
    response = client.delete(f"/employees/{employee_id}")
    assert response.status_code == 204


def test_deleted_employee_not_in_list(client):
    create_response = client.post("/employees", json=employee_payload())
    employee_id = create_response.json()["id"]
    client.delete(f"/employees/{employee_id}")
    response = client.get("/employees")
    assert response.json()["total"] == 0


def test_delete_nonexistent_employee_returns_404(client):
    response = client.delete("/employees/nonexistent-id")
    assert response.status_code == 404
