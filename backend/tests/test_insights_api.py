def emp(email: str, country: str, job_title: str, salary: str, department: str = "Engineering"):
    return {
        "full_name": "Test User",
        "job_title": job_title,
        "country": country,
        "salary": salary,
        "department": department,
        "email": email,
        "hire_date": "2022-01-01",
        "employment_type": "full_time",
    }


# --- salary-by-country ---

def test_salary_by_country_returns_stats(client):
    client.post("/employees", json=emp("a@x.com", "USA", "Engineer", "50000.00"))
    client.post("/employees", json=emp("b@x.com", "USA", "Engineer", "70000.00"))
    client.post("/employees", json=emp("c@x.com", "USA", "Engineer", "90000.00"))

    response = client.get("/insights/salary-by-country")
    assert response.status_code == 200
    data = response.json()
    usa = next(d for d in data if d["country"] == "USA")
    assert usa["min_salary"] == 50000.0
    assert usa["max_salary"] == 90000.0
    assert abs(usa["avg_salary"] - 70000.0) < 0.01
    assert usa["employee_count"] == 3


def test_salary_by_country_multiple_countries(client):
    client.post("/employees", json=emp("a@x.com", "USA", "Engineer", "80000.00"))
    client.post("/employees", json=emp("b@x.com", "UK", "Engineer", "60000.00"))

    response = client.get("/insights/salary-by-country")
    countries = {d["country"] for d in response.json()}
    assert "USA" in countries
    assert "UK" in countries


def test_salary_by_country_excludes_inactive(client):
    r = client.post("/employees", json=emp("a@x.com", "USA", "Engineer", "80000.00"))
    client.delete(f"/employees/{r.json()['id']}")

    response = client.get("/insights/salary-by-country")
    countries = [d["country"] for d in response.json()]
    assert "USA" not in countries


# --- salary-by-jobtitle ---

def test_salary_by_jobtitle_in_country(client):
    client.post("/employees", json=emp("a@x.com", "USA", "Engineer", "90000.00"))
    client.post("/employees", json=emp("b@x.com", "USA", "Designer", "70000.00"))
    client.post("/employees", json=emp("c@x.com", "UK",  "Engineer", "80000.00"))

    response = client.get("/insights/salary-by-jobtitle", params={"country": "USA"})
    assert response.status_code == 200
    data = {d["job_title"]: d for d in response.json()}
    assert "Engineer" in data
    assert "Designer" in data
    assert data["Engineer"]["avg_salary"] == 90000.0
    assert "UK" not in [d["country"] for d in response.json()]


def test_salary_by_jobtitle_requires_country(client):
    response = client.get("/insights/salary-by-jobtitle")
    assert response.status_code == 422


# --- headcount-by-country ---

def test_headcount_by_country(client):
    client.post("/employees", json=emp("a@x.com", "USA", "Engineer", "80000.00"))
    client.post("/employees", json=emp("b@x.com", "USA", "Designer", "70000.00"))
    client.post("/employees", json=emp("c@x.com", "UK",  "Engineer", "75000.00"))

    response = client.get("/insights/headcount-by-country")
    assert response.status_code == 200
    data = {d["country"]: d["employee_count"] for d in response.json()}
    assert data["USA"] == 2
    assert data["UK"] == 1


# --- department-summary ---

def test_department_summary(client):
    client.post("/employees", json=emp("a@x.com", "USA", "Engineer", "80000.00", "Engineering"))
    client.post("/employees", json=emp("b@x.com", "USA", "Engineer", "100000.00", "Engineering"))
    client.post("/employees", json=emp("c@x.com", "USA", "Designer", "60000.00", "Design"))

    response = client.get("/insights/department-summary")
    assert response.status_code == 200
    data = {d["department"]: d for d in response.json()}
    assert data["Engineering"]["employee_count"] == 2
    assert abs(data["Engineering"]["avg_salary"] - 90000.0) < 0.01
    assert data["Design"]["employee_count"] == 1


# --- top-earners ---

def test_top_earners_returns_sorted_desc(client):
    for i, salary in enumerate(["50000", "90000", "70000", "110000", "80000"]):
        client.post("/employees", json=emp(f"u{i}@x.com", "USA", "Engineer", f"{salary}.00"))

    response = client.get("/insights/top-earners")
    assert response.status_code == 200
    salaries = [float(e["salary"]) for e in response.json()]
    assert salaries == sorted(salaries, reverse=True)


def test_top_earners_respects_limit(client):
    for i in range(10):
        client.post("/employees", json=emp(f"u{i}@x.com", "USA", "Engineer", f"{50000 + i * 1000}.00"))

    response = client.get("/insights/top-earners", params={"limit": 3})
    assert len(response.json()) == 3


def test_top_earners_excludes_inactive(client):
    r = client.post("/employees", json=emp("top@x.com", "USA", "Engineer", "999999.00"))
    client.delete(f"/employees/{r.json()['id']}")

    response = client.get("/insights/top-earners")
    salaries = [float(e["salary"]) for e in response.json()]
    assert 999999.0 not in salaries
