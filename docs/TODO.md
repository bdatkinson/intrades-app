# TODO

Status as of today

- [x] Scaffold Next.js app in `web/` with TS, Tailwind, ESLint, Vitest
- [x] Brand refresh + header/nav + challenges list/detail with filters (Sprint 1-2)
- [x] Sprint 3 pages: Dashboard, Map, Settings scaffolds
- [x] SEO metadata + OG image route
- [x] Auth UI, context, and role gating (localStorage-backed)
- [x] Student widgets on Dashboard; submit CTA on challenge detail
- [x] Week 3 calculators (utils, tests, UI pages)
- [x] Uploader component (proxy + presigned flows) with tests
- [x] AWS S3 wired; CloudFront distribution (OAC + Trusted Key Group) with signed GETs
- [x] Upload-type challenges wired to Uploader; submissions listed with fresh signed URLs
- [x] CI/CD stabilization: lockfile sync, gated secrets, continue-on-error for Vercel, fixed root dir path
- [x] Sprint 3 wrap-up: recent challenges data, Map fallback on missing key, Settings preferences persisted

In flight / Monitoring

- [ ] Monitor Vercel preview deploys to confirm no more "Root Directory 'web' does not exist" errors
- [ ] Keep CI green: lint, tests, build on all PRs
- [ ] Verify only the official GitHub Action triggers Vercel preview (GitHub Integration disabled)

Sprint 4: Testing + Quality

- [ ] Expand Vitest coverage for core pages/components (target > 20 specs)
- [ ] Add 404 page polish and basic accessibility pass (landmarks, labels)
- [ ] Enable Playwright smoke against Vercel Preview when secrets present

Sprint 5: Curriculum + Data

- [ ] Week 4 features (prioritize with Benjamin): e.g., quoting/estimating helpers or marketing assets
- [ ] Replace mock challenge data with API/CMS source

Backlog

- [ ] Auth provider integration (Auth0/OIDC) end-to-end
- [ ] User profile & avatars
- [ ] Email events (Resend) and analytics (PostHog/Sentry instrumentation)
