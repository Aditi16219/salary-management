import random

from app.utils.seed_generator import generate_records, JOB_TITLES, JOB_TITLE_TO_DEPARTMENT

FIRST = ["Alice", "Bob", "Carol", "Dave", "Eve"]
LAST = ["Smith", "Jones", "Brown", "Taylor", "Wilson"]


def test_generates_correct_count():
    records = generate_records(FIRST, LAST, 100)
    assert len(records) == 100


def test_all_emails_are_unique():
    records = generate_records(FIRST, LAST, 500)
    emails = [r["email"] for r in records]
    assert len(emails) == len(set(emails))


def test_all_required_fields_present():
    required = {"id", "full_name", "job_title", "country", "salary",
                "department", "email", "hire_date", "employment_type",
                "is_active", "created_at", "updated_at"}
    records = generate_records(FIRST, LAST, 10)
    for r in records:
        assert required.issubset(r.keys())


def test_salary_within_job_title_range():
    records = generate_records(FIRST, LAST, 200)
    for r in records:
        min_sal, max_sal = JOB_TITLES[r["job_title"]]
        assert min_sal <= r["salary"] <= max_sal


def test_department_matches_job_title():
    records = generate_records(FIRST, LAST, 100)
    for r in records:
        assert r["department"] == JOB_TITLE_TO_DEPARTMENT[r["job_title"]]


def test_employment_type_is_valid():
    valid = {"full_time", "part_time", "contract"}
    records = generate_records(FIRST, LAST, 100)
    for r in records:
        assert r["employment_type"] in valid


def test_is_deterministic_with_fixed_seed():
    rng = random.Random(42)
    r1 = generate_records(FIRST, LAST, 10, rng=rng)
    rng = random.Random(42)
    r2 = generate_records(FIRST, LAST, 10, rng=rng)
    assert [r["full_name"] for r in r1] == [r["full_name"] for r in r2]
