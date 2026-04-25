from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeListResponse,
    EmployeeResponse,
    EmployeeUpdate,
)
from app.services import employee_service

router = APIRouter(prefix="/employees", tags=["employees"])


@router.post("", response_model=EmployeeResponse, status_code=201)
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    try:
        return employee_service.create_employee(db, data)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already exists")


@router.get("", response_model=EmployeeListResponse)
def list_employees(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    country: Optional[str] = None,
    job_title: Optional[str] = None,
    department: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "full_name",
    sort_order: str = "asc",
    db: Session = Depends(get_db),
):
    items, total = employee_service.list_employees(
        db,
        page=page,
        page_size=page_size,
        country=country,
        job_title=job_title,
        department=department,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return EmployeeListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    employee = employee_service.get_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(employee_id: str, data: EmployeeUpdate, db: Session = Depends(get_db)):
    employee = employee_service.update_employee(db, employee_id, data)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.delete("/{employee_id}", status_code=204)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    deleted = employee_service.delete_employee(db, employee_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Employee not found")
