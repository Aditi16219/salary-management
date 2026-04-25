from typing import Optional

from sqlalchemy import or_, asc, desc
from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


def create_employee(db: Session, data: EmployeeCreate) -> Employee:
    employee = Employee(**data.model_dump())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


def get_employee(db: Session, employee_id: str) -> Optional[Employee]:
    return (
        db.query(Employee)
        .filter(Employee.id == employee_id, Employee.is_active == True)
        .first()
    )


SORTABLE_COLUMNS = {
    "full_name": Employee.full_name,
    "salary": Employee.salary,
    "hire_date": Employee.hire_date,
    "country": Employee.country,
    "job_title": Employee.job_title,
}


def list_employees(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    country: Optional[str] = None,
    job_title: Optional[str] = None,
    department: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "full_name",
    sort_order: str = "asc",
) -> tuple:
    query = db.query(Employee).filter(Employee.is_active == True)

    if country:
        query = query.filter(Employee.country == country)
    if job_title:
        query = query.filter(Employee.job_title == job_title)
    if department:
        query = query.filter(Employee.department == department)
    if search:
        query = query.filter(
            or_(
                Employee.full_name.ilike(f"%{search}%"),
                Employee.email.ilike(f"%{search}%"),
                Employee.job_title.ilike(f"%{search}%"),
            )
        )

    sort_col = SORTABLE_COLUMNS.get(sort_by, Employee.full_name)
    query = query.order_by(desc(sort_col) if sort_order == "desc" else asc(sort_col))

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def update_employee(db: Session, employee_id: str, data: EmployeeUpdate) -> Optional[Employee]:
    employee = get_employee(db, employee_id)
    if not employee:
        return None

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(employee, field, value)

    db.commit()
    db.refresh(employee)
    return employee


def delete_employee(db: Session, employee_id: str) -> bool:
    employee = get_employee(db, employee_id)
    if not employee:
        return False

    employee.is_active = False
    db.commit()
    return True
