# TODO Roadmap (Aligned with 8‑Week Curriculum)

Completed

- [x] Scaffold Next.js app in `web/` with TS, Tailwind, ESLint, Vitest
- [x] Brand + header/nav + challenges list/detail with filters (Sprint 1–2)
- [x] Sprint 3 pages: Dashboard, Map, Settings
- [x] CI: Lint/Test/Build + Preview E2E (fork‑safe)
- [x] SEO metadata + dynamic OG image route
- [x] Auth (Bearer) UI flows + RoleGuard + Protected component
- [x] Minimal tests (login, Protected, dashboard render)

In Progress / Next (Sprint 4)

- [ ] Merge Sprint 3 enhancements (Dashboard widgets, Google Maps) once CI is green on PR #5
- [ ] Dashboard: wire recent challenges to data source (mock for now)
- [ ] Map: verify preview deploy with `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] Settings: persist basic preferences (localStorage) placeholder

Curriculum Features — Challenge Engine & Weekly Tracks

- [ ] Challenge Engine: core types (week, topic, type, XP, badge, rubric, proof requirements)
- [ ] Week 1: quiz + real‑world tasks (name check helper, LLC filing upload, EIN upload)
- [ ] Week 2: banking checklist + bookkeeping setup flow; mini‑game: Expense Category Match
- [ ] Week 3: calculators (Labor Burden, Markup↔Margin) + estimating challenge UIs
- [ ] Week 4: financing quiz; LOC checklist; cash‑flow simulator (stub)
- [ ] Week 5: insurance matcher; quote uploads; safety plan templates; claim simulator
- [ ] Week 6: GMB checklist; website submission; social launch; referral program; proposal builder (stub)
- [ ] Week 7: classification quiz; payroll calculator; job description builder; payroll setup upload
- [ ] Week 8: SOP builder; KPI dashboard (manual entry); PM setup; 90‑day plan; pitch upload; boss battle

Proof Uploads / Storage

- [ ] S3 integration with signed URLs (per `docs/AWS_S3_SETUP_GUIDE.md`)
- [ ] File upload component + progress + retry
- [ ] Proof gallery per challenge with metadata (who/when/type)

Gamification

- [ ] XP level calc: Apprentice → Journeyman → Master → Contractor → Business Owner
- [ ] Badges (foundation/technical/marketing/operations/mastery) — seed 20 demo badges
- [ ] Streaks widget with resume/recovery logic
- [ ] Leaderboards: weekly + overall (privacy‑friendly composite score)

Instructor Tools

- [ ] Instructor dashboard: roster + cohorts + basic grading view
- [ ] Rubric definition (admin) + grading workflow (instructor)
- [ ] Challenge builder (admin) with preview; schedule/visibility controls

Social / Support

- [ ] Study buddy matching (opt‑in) — simple matching rules
- [ ] Alumni/mentor routing stubs

Infra / Quality

- [ ] Expand Vitest coverage for core pages/components
- [ ] Playwright smoke against Vercel Preview (login → challenge → upload stub)
- [ ] 404 page polish + basic a11y pass
- [ ] Dependabot updates triage weekly
