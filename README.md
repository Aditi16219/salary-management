# Salary Management

A full-stack salary management tool for HR managers. Manage 10,000+ employees, view salary analytics, and track compensation across countries and departments.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Backend | Python 3.10 + FastAPI |
| Database | SQLite + SQLAlchemy |
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Testing | pytest (backend) · Jest + React Testing Library (frontend) |
| Deployment | Docker + docker-compose |

---

## Quick Start

### Option A — Docker (recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

Seed 10,000 employees (run after containers are up):

```bash
docker-compose exec backend python /seed/seed.py
```

### Option B — Local development

**Backend**

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend** (requires Node 16+)

```bash
cd frontend
npm install
npm run dev
```

**Seed script**

```bash
python seed/seed.py
```

---

## Running Tests

**Backend (36 tests)**

```bash
cd backend
venv\Scripts\python -m pytest tests/ -v
```

**Frontend (22 tests)**

```bash
cd frontend
npm run test:run
```

---

## Features

### Employee Management
- Add, view, edit, and delete employees
- Fields: full name, email, job title, department, country, salary, hire date, employment type
- Search by name, email, or job title
- Filter by country, department, and job title (populated from live data)
- Sort by salary or hire date (ascending / descending) — server-side across all records
- Paginated table (20 per page)
- Soft delete (employees are deactivated, not removed)
- Color-coded employment type badges (Full Time · Part Time · Contract)

### Salary Insights Dashboard
- Global summary: total headcount, avg salary, highest salary, top country
- Salary by country: min / avg / max per country
- **Avg salary by job title in a country** — interactive country selector updates table instantly
- Department summary: headcount and salary range per department
- Top 10 earners across the organisation

### Seed Script
- Generates 10,000 realistic employees in **< 0.3 seconds**
- Names drawn from `seed/first_names.txt` + `seed/last_names.txt`
- Realistic job titles, departments, countries, and salary ranges
- Idempotent — safe to re-run (clears and re-inserts)

---

## API Reference

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | List employees (paginated, filterable, sortable) |
| POST | `/employees` | Create employee |
| GET | `/employees/{id}` | Get employee |
| PUT | `/employees/{id}` | Update employee |
| DELETE | `/employees/{id}` | Soft delete employee |
| GET | `/insights/salary-by-country` | Salary stats per country |
| GET | `/insights/salary-by-jobtitle?country=X` | Avg salary per job title in country |
| GET | `/insights/headcount-by-country` | Employee count per country |
| GET | `/insights/department-summary` | Salary stats per department |
| GET | `/insights/top-earners` | Top N earners |
| GET | `/meta/countries` | Distinct countries from active employees |
| GET | `/meta/departments` | Distinct departments from active employees |
| GET | `/meta/job-titles` | Distinct job titles from active employees |

### Query params for `GET /employees`

| Param | Default | Description |
|---|---|---|
| `page` | 1 | Page number |
| `page_size` | 20 | Results per page (max 100) |
| `search` | — | Search name, email, or job title |
| `country` | — | Filter by exact country |
| `department` | — | Filter by exact department |
| `job_title` | — | Filter by exact job title |
| `sort_by` | `full_name` | Column to sort (`salary`, `hire_date`, `full_name`, `country`, `job_title`) |
| `sort_order` | `asc` | `asc` or `desc` |

Interactive docs: http://localhost:8000/docs

---

## Project Structure

```
salary-management/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # Business logic layer
│   │   ├── routes/          # FastAPI routers (employees, insights, meta)
│   │   └── utils/           # Seed data generator
│   └── tests/               # 36 pytest tests
├── frontend/
│   └── src/
│       ├── api/             # Typed axios API client
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level page components
│       ├── types/           # TypeScript interfaces
│       └── test/            # 22 Jest tests
├── seed/
│   ├── seed.py              # Bulk-insert seed script
│   ├── first_names.txt
│   └── last_names.txt
└── docker-compose.yml
```
