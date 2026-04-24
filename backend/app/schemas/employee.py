from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.employee import EmploymentType


class EmployeeCreate(BaseModel):
    full_name: str
    job_title: str
    country: str
    salary: Decimal
    department: str
    email: EmailStr
    hire_date: date
    employment_type: EmploymentType = EmploymentType.FULL_TIME


class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    job_title: Optional[str] = None
    country: Optional[str] = None
    salary: Optional[Decimal] = None
    department: Optional[str] = None
    email: Optional[EmailStr] = None
    hire_date: Optional[date] = None
    employment_type: Optional[EmploymentType] = None


class EmployeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    job_title: str
    country: str
    salary: Decimal
    department: str
    email: str
    hire_date: date
    employment_type: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class EmployeeListResponse(BaseModel):
    items: list[EmployeeResponse]
    total: int
    page: int
    page_size: int
