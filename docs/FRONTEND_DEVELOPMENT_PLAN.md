# 🎨 InTrades Frontend Development Plan (Aligned with 8‑Week Curriculum)

## Executive Summary
We are building a mobile‑first, challenge‑based learning app for skilled trades entrepreneurship. The frontend is a Next.js 16 App Router app with Tailwind and shadcn‑style components, integrated with a JWT API using Bearer tokens. This plan reflects the 8‑week curriculum, gamification model, and instructor tooling.

## Tech Stack (current)
- Framework: Next.js 16 (App Router) + TypeScript
- Styling: Tailwind CSS + shadcn‑style primitives (CVA, clsx, tailwind‑merge, Radix)
- Data: React Query
- Forms/Validation: React Hook Form + Zod
- Testing: Vitest + RTL; Playwright smoke on preview
- Analytics/Monitoring: PostHog, Sentry

## Gamification Model (from curriculum)
- Levels: Apprentice → Journeyman → Master → Contractor → Business Owner
- 45+ badges grouped by theme (Foundation, Technical, Marketing, Operations, Mastery)
- Streaks, leaderboards (weekly, overall, team), boss battles (scenario games)

## Feature Map by Curriculum Weeks
Week 1 (Foundations & Legal)
- Challenge Engine: quiz + real‑world tasks (name check, LLC filing upload, EIN upload)
- Domain check helper

Week 2 (Banking & Finance)
- Banking checklist, bookkeeping setup flow
- Mini‑game: Expense Category Match

Week 3 (Estimating & Pricing)
- Calculators: Labor Burden, Markup↔Margin
- Estimating challenges with AI feedback (stubbed frontend)

Week 4 (Financing)
- Financing options quiz; LOC application checklist; cash‑flow simulator

Week 5 (Insurance)
- Insurance types matcher; quote uploads; safety plan templates; claim simulator

Week 6 (Marketing)
- GMB setup checklist; Website submission; Social launch; Referral program; Proposal builder

Week 7 (Operations & Payroll)
- Classification quiz; Payroll calculator; Job description builder; Payroll setup upload

Week 8 (Scaling & Systems)
- SOP builder; KPI dashboard (manual entry); PM setup; 90‑day plan; Pitch upload; Final boss battle

## Architecture Slices
- Challenge Engine: typed challenge objects (week, topic, type, XP, badge, time, rubric)
- Proof Uploads: S3 (per AWS_S3_SETUP_GUIDE.md) with signed URLs
- Calculators: pure TS utils + UI wrappers
- Leaderboards: privacy‑friendly composite scores; weekly/overall/team views
- Real‑World Tracker: milestone checklist across weeks
- Instructor Tools: roster, cohorts, challenge builder, rubrics, grading, reminders
- Social: study buddy matching; alumni/mentor routing (stubs first)

## Phases & Milestones
Phase A (Now → Sprint 4)
- Auth (Bearer), role guards, dashboards, maps, settings, SEO/tests (WIP)
- Challenge Engine (core types + Week 1/2 UIs with mock data)
- Uploads pipeline (signed URLs) for real‑world proofs

Phase B (Next sprints)
- Calculators (Labor Burden, Markup/Margin), Week 3 flows
- Leaderboard (weekly + overall), streaks
- Instructor dashboard (roster, cohorts), basic grading view

Phase C
- Challenge builder (admin), rubric designer, reminders
- Social: buddy matching, team challenges; regional/alumni stubs

Target Launch Window: January 2026 (per curriculum)

## Definition of Done (unchanged essentials)
- Lint/tests/build green; accessible; responsive; documented; deployed to preview; minimal E2E smoke
