from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class CountrySalaryStats(BaseModel):
    country: str
    min_salary: float
    max_salary: float
    avg_salary: float
    employee_count: int


class JobTitleSalaryStats(BaseModel):
    job_title: str
    country: str
    avg_salary: float
    employee_count: int


class CountryHeadcount(BaseModel):
    country: str
    employee_count: int


class DepartmentSummary(BaseModel):
    department: str
    avg_salary: float
    min_salary: float
    max_salary: float
    employee_count: int


class TopEarner(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    job_title: str
    country: str
    department: str
    salary: Decimal
