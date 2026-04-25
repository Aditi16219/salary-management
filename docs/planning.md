# Planning Notes

## Requirements Analysis

The assessment asked for a salary management tool for an HR Manager at a 10,000-employee org.
Key constraints identified upfront:

- **Scale**: 10k employees — enough to need pagination and indexed queries, not enough to need a heavy DB
- **User persona**: HR Manager — needs to find, compare, and manage employee records quickly
- **Seed performance**: "engineers run this regularly" — bulk insert, not ORM row-by-row
- **Full-stack**: both backend API and UI required

---

## Decisions Made Before Writing Code

### 1. Tech stack
The JD mentioned Python. Chose FastAPI over Django/Flask because:
- Automatic OpenAPI docs (useful for evaluators)
- Pydantic validation built in
- Minimal boilerplate — routes stay thin

### 2. Architecture: layered backend
Decided on `routes → services → models` before writing anything.
- Routes: HTTP concerns only (status codes, request parsing, serialisation)
- Services: all business logic and queries
- Benefit: services are testable without spinning up an HTTP server

### 3. TDD from the start
Wrote failing tests before each component — model, CRUD API, seed generator, insights API.
This caught the SQLite in-memory/thread issue early (needed `StaticPool` for FastAPI tests).

### 4. Soft delete
Chose `is_active` flag over hard delete. Reasons:
- Seed script can truncate + re-insert without FK issues
- HR data shouldn't be permanently destroyed accidentally
- No extra migration needed later if audit log is required

### 5. Single currency (USD)
All salaries stored in USD. Alternatives considered:
- Store local currency + exchange rate → complex, exchange rates change
- Store local currency only → can't compare salaries across countries meaningfully
- USD baseline → simple, consistent, standard in global HR tools

### 6. Seed performance strategy
Tested two approaches mentally before implementing:
- ORM `session.add()` per row → O(n) round trips → too slow at 10k
- SQLAlchemy Core `executemany` → single transaction → fast
Result: 0.28s for 10,000 rows.

---

## Commit Strategy

Planned 10 incremental commits so the evolution of the solution is visible:
1. Scaffold
2. Model (TDD)
3. CRUD API (TDD)
4. Seed script
5. Insights API (TDD)
6. Frontend scaffold + API client
7. Employee list UI
8. Add/edit/delete UI
9. Insights dashboard
10. Docker + docs

Post-plan additions (based on testing the live app):
- Country/department/job title dropdowns (from live DB, not hardcoded)
- Server-side column sorting (salary, hire date)
- Indigo/blue colour theme
- Email and hire date columns in table
- "Avg salary by job title in a country" section added to Insights UI (was in backend API from the start but missing from the dashboard — caught during requirements review)
- Seed script Docker path fix — script resolves `/app` in Docker vs `../backend` locally

---

## What I Would Add With More Time

- **Authentication** — JWT login for HR managers; role-based access
- **Audit log** — track who changed what and when
- **Bulk import** — CSV upload to add many employees at once
- **Export** — download filtered results as CSV/Excel
- **Charts** — salary distribution histogram on insights page
- **PostgreSQL** — for production multi-user concurrent write support
