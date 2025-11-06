# TODO

Status as of today

- [x] Scaffold Next.js app in `web/` with TS, Tailwind, ESLint, Vitest
- [x] Brand + header/nav + challenges list/detail with filters (Sprint 1-2)
- [x] Sprint 3 scaffolds: Dashboard, Map, Settings
- [x] CI: Lint/Test/Build + Preview workflows (fixed fork-secrets condition)
- [ ] Merge Sprint 3 enhancements (Dashboard widgets, Google Maps) once CI is green on PR #5

Next up (Sprint 3 wrap-up)

- [ ] Dashboard: wire recent challenges to data source (mock for now)
- [ ] Map: verify preview deploy with `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` present
- [ ] Settings: persist basic preferences (localStorage) as placeholder

Sprint 4: Testing + Quality

- [ ] Add SEO metadata (Open Graph, Twitter) and OG image route
- [ ] Expand Vitest coverage for core pages/components
- [ ] Enable Playwright smoke against Vercel Preview (already scaffolded)
- [ ] Add 404 page polish and basic accessibility pass

Backlog

- [ ] Auth integration (provider TBD)
- [ ] User profile & avatars
- [ ] Real data for challenges (API or CMS)
- [ ] Email events (Resend) and analytics
