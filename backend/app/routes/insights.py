from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.insights import (
    CountryHeadcount,
    CountrySalaryStats,
    DepartmentSummary,
    JobTitleSalaryStats,
    TopEarner,
)
from app.services import insights_service

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/salary-by-country", response_model=list[CountrySalaryStats])
def salary_by_country(db: Session = Depends(get_db)):
    return insights_service.salary_by_country(db)


@router.get("/salary-by-jobtitle", response_model=list[JobTitleSalaryStats])
def salary_by_jobtitle(country: str, db: Session = Depends(get_db)):
    return insights_service.salary_by_jobtitle(db, country)


@router.get("/headcount-by-country", response_model=list[CountryHeadcount])
def headcount_by_country(db: Session = Depends(get_db)):
    return insights_service.headcount_by_country(db)


@router.get("/department-summary", response_model=list[DepartmentSummary])
def department_summary(db: Session = Depends(get_db)):
    return insights_service.department_summary(db)


@router.get("/top-earners", response_model=list[TopEarner])
def top_earners(
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return insights_service.top_earners(db, limit)
