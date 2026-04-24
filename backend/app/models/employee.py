import uuid
from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean, Column, Date, DateTime, Index, Numeric, String

from app.database import Base


class EmploymentType(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"


class Employee(Base):
    __tablename__ = "employees"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=False, index=True)
    country = Column(String(100), nullable=False, index=True)
    salary = Column(Numeric(12, 2), nullable=False)
    department = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    hire_date = Column(Date, nullable=False)
    employment_type = Column(String(20), nullable=False, default=EmploymentType.FULL_TIME)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("ix_employees_country_job_title", "country", "job_title"),
    )
