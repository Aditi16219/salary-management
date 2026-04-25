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
