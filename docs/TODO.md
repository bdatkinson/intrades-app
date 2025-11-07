# InTrades – TODO Roadmap

## Completed
- ✅ Backend Development (100% DONE – deployed to GitHub)
- ✅ Repo docs/roadmaps published (Frontend Plan, Project Roadmap)
- ✅ Initial frontend groundwork in repo (Next.js app, branding, basic pages, CI)

## Next Priority (High-Level)
- Frontend Setup (TS/Next.js plumbing, envs, API client)
- Authentication UI (login, registration, profile, JWT handling)
- Student Dashboard (XP, badges, recent activity, quick stats)
- Weekly Challenge Interface (quiz + submission)
- Instructor Dashboard (teacher/admin tooling)

## Remaining Work (25 tasks)

### Authentication & Profile
1. [ ] Build Login UI wired to backend JWT auth
2. [ ] Build Registration UI with validation + error states
3. [ ] Implement Forgot/Reset Password flows (request + reset pages)
4. [ ] Token refresh + session persistence (auto-renew, logout)
5. [ ] Protected routes + role guards (student/instructor/admin)
6. [ ] Profile page (view/edit trades-specific fields)

### Student Experience
7. [ ] Dashboard: XP progress bar wired to backend
8. [ ] Dashboard: Badge showcase grid (earned + next)
9. [ ] Dashboard: Recent activity feed
10. [ ] Dashboard: Quick stats cards (streak, level, tier)

### Weekly Challenges
11. [ ] Quiz interface (render questions, validate, client scoring UX)
12. [ ] Submission form for tasks (notes, file upload to backend/S3)
13. [ ] Submission status/history (per challenge)
14. [ ] Challenge progress tracker (steps, deadlines, XP)

### Gamification
15. [ ] XP gain animations + toast
16. [ ] Badge award modal with confetti
17. [ ] Streak counter + tier progression display

### Instructor Features
18. [ ] Instructor dashboard shell + nav
19. [ ] Student roster view (filters, search)
20. [ ] Cohort management (create/edit cohorts)
21. [ ] Challenge creation form (content, XP, deadlines)
22. [ ] Question builder for quizzes
23. [ ] Grading workflow UI (review, rubric, feedback)
24. [ ] Scheduling interface (publish windows, visibility)
25. [ ] Analytics overview (completion, XP, engagement)

## Timeline Overview
- Phase 1: Backend – ✅ COMPLETE (Nov 1–4)
- Phase 2: Frontend – 🚧 In Progress (Nov 5 – Jan 21)
  - Weeks 1–2: Setup & Authentication
  - Weeks 3–6: Student Features
  - Weeks 7–9: Instructor Features
  - Weeks 10–12: Polish & Deploy
- Phase 3: Launch – 🚀 (Jan 21 – Feb 1)
  - Beta testing, production deployment, onboarding

## Budget Summary
- Development: $63,200 total (Frontend $48k; UI/UX $9.6k; Testing $5.6k)
- Monthly Infra: $500/mo (Hosting $200; DB $100; Storage $50; CDN $50; Monitoring $100)

## Immediate Next Steps
- Set up staging environments
  - Backend: Heroku
  - Frontend: Vercel/Netlify
  - Database: MongoDB Atlas
- Start Authentication UI
  - Connect to backend API
  - Implement JWT handling
  - Build login/register forms

## Success Metrics
- MVP (Dec 15): Student dashboard, challenge system, basic gamification
- Full Launch (Feb 1): 100+ users, 70% challenge completion, <2s page load, 4.5+ rating

## Resources
- Repo: https://github.com/bdatkinson/intrades-app
- Frontend Plan: /docs/FRONTEND_DEVELOPMENT_PLAN.md
- Project Roadmap: /docs/PROJECT_ROADMAP.md
- API Docs: Ready for frontend integration
