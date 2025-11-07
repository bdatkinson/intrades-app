# TODO

Status as of today

- [x] Scaffold Next.js app in `web/` with TS, Tailwind, ESLint, Vitest
- [x] Brand + header/nav + challenges list/detail with filters (Sprint 1-2)
- [x] Sprint 3 scaffolds: Dashboard, Map, Settings
- [x] CI: Lint/Test/Build + Preview workflows (fixed fork-secrets condition)
- [x] Auth mode set to Option A (Bearer tokens via Authorization header, no cookies)
- [x] Redirect UX: next param on login, post-register → /settings, post-reset → /auth/login
- [x] RoleGuard component added (student | instructor | admin)
- [x] Branch protection updated to require CI check: "CI / web-ci" (and 1 review)
- [x] .env.example updated with staging/prod API URLs
- [ ] Merge Sprint 3 enhancements (Dashboard widgets, Google Maps) once CI is green on PR #5

Role access decisions (applied)

- View Dashboard: student, instructor, admin
- View Map: student, instructor, admin
- Browse Challenges: student, instructor, admin
- Attempt/Submit Challenge: student
- View Submission History: student, instructor, admin
- XP/Badges/Streak widgets: student
- Edit Own Profile: student, instructor, admin
- Instructor Dashboard: instructor, admin
- Student Roster: instructor, admin
- Cohort Management: instructor, admin
- Create/Publish Challenges: admin
- Quiz/Question Builder: instructor, admin
- Grade Submissions + Rubric: instructor, admin
- Schedule Windows/Visibility: student, instructor, admin
- Analytics (completion/XP/engagement): instructor, admin
- Manage Roles/Users: admin

Next up (Sprint 3 wrap-up)

- [ ] Dashboard: wire recent challenges to data source (mock for now)
- [ ] Map: verify preview deploy with `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` present
- [ ] Settings: persist basic preferences (localStorage) as placeholder
- [ ] Gate student-only widgets on Dashboard (placeholder added)
- [ ] Gate student-only submit CTA on Challenge detail (placeholder added)

Sprint 4: Testing + Quality

- [ ] Add SEO metadata (Open Graph, Twitter) and OG image route
- [ ] Expand Vitest coverage for core pages/components
- [ ] Enable Playwright smoke against Vercel Preview (already scaffolded)
- [ ] Add 404 page polish and basic accessibility pass

Backlog

- [ ] User profile & avatars
- [ ] Real data for challenges (API or CMS)
- [ ] Email events (Resend) and analytics
