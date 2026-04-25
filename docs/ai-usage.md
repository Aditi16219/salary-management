# AI Usage Notes

This project was built using **Claude Code** (Anthropic's CLI agent) throughout the entire development process.

---

## How AI Was Used

### Planning phase
- Described requirements to Claude and asked it to propose a tech stack with trade-off reasoning
- Reviewed and confirmed the architecture before any code was written
- Asked Claude to plan the commit sequence so the solution evolved incrementally

### Implementation
- Each commit followed TDD: asked Claude to write failing tests first, then implement
- Claude generated the initial implementation for each component
- All generated code was reviewed before accepting — particularly the service layer logic, test fixtures, and seed performance approach

### Debugging
- Node 16 / Vite 5 crypto incompatibility — worked through iteratively with Claude diagnosing the root cause (Vite 5 requires `globalThis.crypto` which isn't available in Node 16.14 without a flag)
- SQLite in-memory thread issue in FastAPI tests — Claude identified the need for `StaticPool`
- PostCSS `export default` → `module.exports` for Node 16 CommonJS compatibility
- Seed script Docker path resolution — script used `../backend` relative path which doesn't exist inside the container; fixed to fall back to `/app` in Docker

### UI iteration
- After seeing the running app, asked Claude to add features not in the original plan: dropdowns for filters, column sorting, colour theme
- Claude suggested the indigo/blue scheme; reviewed and approved each change visually

---

## What I Verified Manually

- All test assertions make sense and cover real behaviour (not just coverage padding)
- The seed script actually runs fast (timed it: 0.28s)
- The UI was tested live — searched, filtered, added/edited/deleted employees, checked insights
- API responses match what the frontend expects (checked via `/docs`)

---

## Prompts Used

Key instructions given to Claude during development:

```
"Do not make any code changes, first let me know the plan"
"We need to follow Test Driven Development — write failing tests first"
"Commits should be after each component, not all together"
"Ask after every commit before proceeding"
"Do not commit this — let me check how it looks first"
```

These instructions kept the process deliberate — reviewing each step rather than letting the AI run ahead unchecked.

---

## Reflection

Using AI as a coding partner significantly accelerated development, but the quality came from:
- Clear upfront planning before writing any code
- Reviewing every decision (architecture, test coverage, UI choices)
- Testing the live running application, not just trusting the tests
- Iterating on the UI based on what actually looked good in the browser

The AI did not replace engineering judgment — it executed it faster.
