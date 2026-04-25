#!/usr/bin/env python3
"""
Seed 10,000 employees into the database.
Safe to run repeatedly — truncates existing data before inserting.
"""
import os
import sys
import time
from pathlib import Path

SEED_DIR = Path(__file__).parent

# Support both local (repo/backend) and Docker (/app) layouts
_local_backend = Path(__file__).parent.parent / "backend"
BACKEND_DIR = _local_backend if _local_backend.exists() else Path("/app")

sys.path.insert(0, str(BACKEND_DIR))

from sqlalchemy import create_engine, text

from app.database import Base
from app.models import employee as _employee_model  # noqa: F401 — registers model
from app.utils.seed_generator import generate_records

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BACKEND_DIR}/salary.db")
TARGET_COUNT = 10_000


def load_names() -> tuple[list[str], list[str]]:
    first = (SEED_DIR / "first_names.txt").read_text().strip().splitlines()
    last = (SEED_DIR / "last_names.txt").read_text().strip().splitlines()
    return first, last


def run(database_url: str = DATABASE_URL, count: int = TARGET_COUNT) -> None:
    first_names, last_names = load_names()
    print(f"Loaded {len(first_names)} first names, {len(last_names)} last names")

    print(f"Generating {count:,} records...")
    t0 = time.perf_counter()
    records = generate_records(first_names, last_names, count)
    t1 = time.perf_counter()
    print(f"  Generated in {t1 - t0:.2f}s")

    engine = create_engine(database_url)
    Base.metadata.create_all(engine)

    print("Inserting into database...")
    t2 = time.perf_counter()
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM employees"))
        conn.execute(
            text(
                "INSERT INTO employees "
                "(id, full_name, job_title, country, salary, department, email, "
                " hire_date, employment_type, is_active, created_at, updated_at) "
                "VALUES "
                "(:id, :full_name, :job_title, :country, :salary, :department, :email, "
                " :hire_date, :employment_type, :is_active, :created_at, :updated_at)"
            ),
            records,
        )
        conn.commit()
    t3 = time.perf_counter()

    print(f"  Inserted {count:,} records in {t3 - t2:.2f}s")
    print(f"Total time: {t3 - t0:.2f}s")


if __name__ == "__main__":
    run()
