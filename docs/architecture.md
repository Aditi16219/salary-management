# Architecture Notes

## Overview

Three-tier web application: React frontend → FastAPI backend → SQLite database.

```
Browser
  └── React 18 (Vite, Tailwind)
        └── axios HTTP client
              └── FastAPI (Python 3.10)
                    ├── SQLAlchemy ORM
                    └── SQLite
```

---

## Backend Design

### Layered architecture

```
routes/      ← HTTP boundary: validation, status codes, serialisation
services/    ← Business logic: queries, mutations, aggregations
models/      ← SQLAlchemy ORM definitions
schemas/     ← Pydantic I/O contracts
```

Routes are thin — they delegate to services immediately. Services own all
business rules and return ORM objects or plain dicts. This makes services
independently testable without an HTTP server.

### Database indexes

The `employees` table has:
- Index on `country` — used by all insights GROUP BY country
- Index on `job_title` — used by job-title filter
- Composite index on `(country, job_title)` — used by salary-by-jobtitle endpoint

### Sorting

Server-side sorting is applied before pagination so results are globally ordered across all 10k records, not just the current page. Supported columns: `salary`, `hire_date`, `full_name`, `country`, `job_title`. The `sort_by` value is validated against a whitelist dict to prevent injection.

### Meta endpoints

`/meta/countries`, `/meta/departments`, `/meta/job-titles` return distinct values from active employees. These power the filter dropdowns in the UI and are always in sync with the actual data — no hardcoded lists.

### Salary by job title in a country

`/insights/salary-by-jobtitle?country=X` is exposed on the Insights dashboard via an interactive country selector. Changing the country fires a new request and updates the table — no page reload. This directly satisfies requirement 2b of the assessment.

### Soft delete

Employees are never removed from the database. `is_active = False` marks
them as deleted. All queries filter on `is_active == True`. This preserves
audit history and makes the seed script idempotent (DELETE + re-INSERT is
safe because no FK constraints reference employees).

---

## Frontend Design

### Component hierarchy

```
App
├── Layout (nav)
├── EmployeesPage
│   ├── EmployeeFilters
│   ├── EmployeeTable
│   │   └── ConfirmDialog (delete confirmation)
│   └── Pagination
├── AddEmployeePage → EmployeeForm
├── EditEmployeePage → EmployeeForm
└── InsightsPage
    ├── StatCard ×4
    ├── SalaryByCountryTable
    ├── DepartmentSummaryTable
    └── TopEarnersTable
```

### Data fetching

Each page owns its own fetch via `useEffect`. Cancellation is handled with
a `cancelled` flag to prevent state updates on unmounted components. Insights
data is loaded in parallel via `Promise.all` to minimise perceived latency.

### API client

`src/api/client.ts` is a single axios instance configured with the backend
base URL. All API modules (`employees.ts`, `insights.ts`) import this instance
and return fully-typed responses.

---

## Seed Script Performance

Target: seed 10,000 employees fast enough for regular developer use.

Approach:
1. Generate all 10,000 records in memory (~0.11s)
2. Single `DELETE FROM employees` transaction
3. Single `executemany` INSERT via SQLAlchemy Core (no ORM overhead per row)
4. Commit once

Result: **0.28s total** for 10,000 rows on SQLite.

Key: bulk `executemany` via SQLAlchemy `text()` with a list of dicts is ~100×
faster than individual ORM `session.add()` calls.

---

## Trade-offs

| Decision | Alternative | Why this choice |
|---|---|---|
| SQLite | PostgreSQL | Zero ops for a 10k-employee demo; trivially swappable via DATABASE_URL |
| Soft delete | Hard delete | Audit trail; seed idempotency; safer for accidental deletes |
| No auth | JWT / OAuth | Out of scope for this assessment; architecture supports adding it at the route layer |
| No pagination on insights | Paginated | Insight aggregations are O(groups), not O(rows); fast at 10k scale |
| React state (no Redux) | Redux / Zustand | Simple fetch-on-mount pattern sufficient; no cross-page shared state needed |

---

## AI Usage

This project was built using Claude Code (Anthropic). Key interactions:

- **Architecture planning** — proposed tech stack, discussed trade-offs before writing code
- **TDD scaffolding** — generated failing tests, implemented to pass, no skipping red phase
- **Debugging** — Node 16 / Vite 5 crypto incompatibility resolved iteratively
- **Code review** — asked Claude to simplify after each component

All generated code was reviewed and accepted or adjusted. Commit messages
describe the reasoning, not just the diff.
