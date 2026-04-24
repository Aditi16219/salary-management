from datetime import date
from decimal import Decimal

import pytest
from sqlalchemy.exc import IntegrityError

from app.models.employee import Employee, EmploymentType


def test_create_employee(db):
    employee = Employee(
        full_name="Jane Doe",
        job_title="Software Engineer",
        country="United States",
        salary=Decimal("95000.00"),
        department="Engineering",
        email="jane.doe@example.com",
        hire_date=date(2022, 1, 15),
        employment_type=EmploymentType.FULL_TIME,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)

    assert employee.id is not None
    assert employee.full_name == "Jane Doe"
    assert employee.job_title == "Software Engineer"
    assert employee.country == "United States"
    assert employee.salary == Decimal("95000.00")


def test_employee_is_active_defaults_to_true(db):
    employee = Employee(
        full_name="John Smith",
        job_title="Designer",
        country="United Kingdom",
        salary=Decimal("75000.00"),
        department="Design",
        email="john.smith@example.com",
        hire_date=date(2021, 6, 1),
        employment_type=EmploymentType.FULL_TIME,
    )
    db.add(employee)
    db.commit()

    assert employee.is_active is True


def test_employee_email_must_be_unique(db):
    e1 = Employee(
        full_name="Alice Brown",
        job_title="Manager",
        country="Canada",
        salary=Decimal("100000.00"),
        department="HR",
        email="alice@example.com",
        hire_date=date(2020, 3, 10),
        employment_type=EmploymentType.FULL_TIME,
    )
    e2 = Employee(
        full_name="Bob Brown",
        job_title="Analyst",
        country="Canada",
        salary=Decimal("80000.00"),
        department="Finance",
        email="alice@example.com",
        hire_date=date(2021, 5, 20),
        employment_type=EmploymentType.FULL_TIME,
    )
    db.add(e1)
    db.commit()
    db.add(e2)
    with pytest.raises(IntegrityError):
        db.commit()


def test_soft_delete_employee(db):
    employee = Employee(
        full_name="Charlie Wilson",
        job_title="Developer",
        country="Australia",
        salary=Decimal("90000.00"),
        department="Engineering",
        email="charlie@example.com",
        hire_date=date(2023, 2, 14),
        employment_type=EmploymentType.CONTRACT,
    )
    db.add(employee)
    db.commit()

    employee.is_active = False
    db.commit()
    db.refresh(employee)

    assert employee.is_active is False


def test_employment_type_values():
    assert EmploymentType.FULL_TIME == "full_time"
    assert EmploymentType.PART_TIME == "part_time"
    assert EmploymentType.CONTRACT == "contract"


def test_created_at_is_set_automatically(db):
    employee = Employee(
        full_name="Diana Prince",
        job_title="HR Specialist",
        country="Germany",
        salary=Decimal("70000.00"),
        department="HR",
        email="diana@example.com",
        hire_date=date(2022, 9, 1),
        employment_type=EmploymentType.PART_TIME,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)

    assert employee.created_at is not None
    assert employee.updated_at is not None
