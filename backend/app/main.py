from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import employee  # noqa: F401 — registers model with Base
from app.routes import employees

app = FastAPI(title="Salary Management API", version="1.0.0")

Base.metadata.create_all(bind=engine)

app.include_router(employees.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}
