from fastapi import APIRouter, Depends
from sqlalchemy import distinct
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee

router = APIRouter(prefix="/meta", tags=["meta"])


@router.get("/countries")
def get_countries(db: Session = Depends(get_db)):
    rows = (
        db.query(distinct(Employee.country))
        .filter(Employee.is_active == True)
        .order_by(Employee.country)
        .all()
    )
    return [r[0] for r in rows]


@router.get("/departments")
def get_departments(db: Session = Depends(get_db)):
    rows = (
        db.query(distinct(Employee.department))
        .filter(Employee.is_active == True)
        .order_by(Employee.department)
        .all()
    )
    return [r[0] for r in rows]


@router.get("/job-titles")
def get_job_titles(db: Session = Depends(get_db)):
    rows = (
        db.query(distinct(Employee.job_title))
        .filter(Employee.is_active == True)
        .order_by(Employee.job_title)
        .all()
    )
    return [r[0] for r in rows]
