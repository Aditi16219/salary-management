import random
import uuid
from datetime import date, timedelta
from typing import Optional

COUNTRIES = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany",
    "France", "India", "Brazil", "Japan", "Singapore", "Netherlands",
    "Sweden", "Switzerland", "Spain", "Italy", "Mexico", "South Korea",
    "New Zealand", "Ireland", "Denmark",
]

JOB_TITLES: dict[str, tuple[int, int]] = {
    "Software Engineer": (70000, 150000),
    "Senior Software Engineer": (100000, 180000),
    "Principal Engineer": (140000, 220000),
    "Technical Lead": (110000, 180000),
    "Engineering Manager": (130000, 200000),
    "DevOps Engineer": (80000, 150000),
    "QA Engineer": (60000, 110000),
    "Security Engineer": (90000, 160000),
    "Solution Architect": (120000, 200000),
    "Data Scientist": (85000, 160000),
    "Data Analyst": (60000, 110000),
    "Business Analyst": (65000, 115000),
    "Product Manager": (90000, 170000),
    "UX Designer": (65000, 120000),
    "HR Manager": (60000, 110000),
    "HR Specialist": (45000, 80000),
    "Financial Analyst": (65000, 120000),
    "Sales Manager": (70000, 130000),
    "Marketing Manager": (65000, 125000),
    "Operations Manager": (70000, 120000),
}

JOB_TITLE_TO_DEPARTMENT: dict[str, str] = {
    "Software Engineer": "Engineering",
    "Senior Software Engineer": "Engineering",
    "Principal Engineer": "Engineering",
    "Technical Lead": "Engineering",
    "Engineering Manager": "Engineering",
    "DevOps Engineer": "Engineering",
    "QA Engineer": "Engineering",
    "Security Engineer": "Engineering",
    "Solution Architect": "Engineering",
    "Data Scientist": "Data",
    "Data Analyst": "Data",
    "Business Analyst": "Data",
    "Product Manager": "Product",
    "UX Designer": "Design",
    "HR Manager": "Human Resources",
    "HR Specialist": "Human Resources",
    "Financial Analyst": "Finance",
    "Sales Manager": "Sales",
    "Marketing Manager": "Marketing",
    "Operations Manager": "Operations",
}

_EMPLOYMENT_TYPES = ["full_time", "part_time", "contract"]
_EMPLOYMENT_WEIGHTS = [75, 10, 15]
_HIRE_START = date(2015, 1, 1)
_HIRE_END = date(2024, 12, 31)
_HIRE_RANGE_DAYS = (_HIRE_END - _HIRE_START).days


def generate_records(
    first_names: list[str],
    last_names: list[str],
    count: int,
    rng: Optional[random.Random] = None,
) -> list[dict]:
    r = rng or random.Random()
    job_title_list = list(JOB_TITLES.keys())
    email_counters: dict[str, int] = {}
    records = []

    for _ in range(count):
        first = r.choice(first_names)
        last = r.choice(last_names)
        job_title = r.choice(job_title_list)
        min_sal, max_sal = JOB_TITLES[job_title]

        key = f"{first.lower()}.{last.lower()}"
        n = email_counters.get(key, 0)
        email_counters[key] = n + 1
        email = f"{key}{n if n > 0 else ''}@company.com"

        hire_date = _HIRE_START + timedelta(days=r.randint(0, _HIRE_RANGE_DAYS))
        emp_type = r.choices(_EMPLOYMENT_TYPES, weights=_EMPLOYMENT_WEIGHTS)[0]

        records.append({
            "id": str(uuid.uuid4()),
            "full_name": f"{first} {last}",
            "job_title": job_title,
            "country": r.choice(COUNTRIES),
            "salary": round(r.uniform(min_sal, max_sal), 2),
            "department": JOB_TITLE_TO_DEPARTMENT[job_title],
            "email": email,
            "hire_date": hire_date.isoformat(),
            "employment_type": emp_type,
            "is_active": True,
            "created_at": "2024-01-01 00:00:00",
            "updated_at": "2024-01-01 00:00:00",
        })

    return records
