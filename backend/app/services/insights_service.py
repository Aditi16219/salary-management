from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.employee import Employee


def salary_by_country(db: Session) -> list[dict]:
    rows = (
        db.query(
            Employee.country,
            func.min(Employee.salary).label("min_salary"),
            func.max(Employee.salary).label("max_salary"),
            func.avg(Employee.salary).label("avg_salary"),
            func.count(Employee.id).label("employee_count"),
        )
        .filter(Employee.is_active == True)
        .group_by(Employee.country)
        .order_by(Employee.country)
        .all()
    )
    return [
        {
            "country": r.country,
            "min_salary": float(r.min_salary),
            "max_salary": float(r.max_salary),
            "avg_salary": round(float(r.avg_salary), 2),
            "employee_count": r.employee_count,
        }
        for r in rows
    ]


def salary_by_jobtitle(db: Session, country: str) -> list[dict]:
    rows = (
        db.query(
            Employee.job_title,
            Employee.country,
            func.avg(Employee.salary).label("avg_salary"),
            func.count(Employee.id).label("employee_count"),
        )
        .filter(Employee.is_active == True, Employee.country == country)
        .group_by(Employee.job_title)
        .order_by(Employee.job_title)
        .all()
    )
    return [
        {
            "job_title": r.job_title,
            "country": r.country,
            "avg_salary": round(float(r.avg_salary), 2),
            "employee_count": r.employee_count,
        }
        for r in rows
    ]


def headcount_by_country(db: Session) -> list[dict]:
    rows = (
        db.query(
            Employee.country,
            func.count(Employee.id).label("employee_count"),
        )
        .filter(Employee.is_active == True)
        .group_by(Employee.country)
        .order_by(func.count(Employee.id).desc())
        .all()
    )
    return [{"country": r.country, "employee_count": r.employee_count} for r in rows]


def department_summary(db: Session) -> list[dict]:
    rows = (
        db.query(
            Employee.department,
            func.avg(Employee.salary).label("avg_salary"),
            func.min(Employee.salary).label("min_salary"),
            func.max(Employee.salary).label("max_salary"),
            func.count(Employee.id).label("employee_count"),
        )
        .filter(Employee.is_active == True)
        .group_by(Employee.department)
        .order_by(Employee.department)
        .all()
    )
    return [
        {
            "department": r.department,
            "avg_salary": round(float(r.avg_salary), 2),
            "min_salary": float(r.min_salary),
            "max_salary": float(r.max_salary),
            "employee_count": r.employee_count,
        }
        for r in rows
    ]


def top_earners(db: Session, limit: int = 10) -> list[Employee]:
    return (
        db.query(Employee)
        .filter(Employee.is_active == True)
        .order_by(Employee.salary.desc())
        .limit(limit)
        .all()
    )
