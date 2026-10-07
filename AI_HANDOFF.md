# AI HANDOFF — Peter Lightspeed "Career Operating System"

**Read this first if you are an AI assistant (or a human) picking this project up.**
Last updated: 2026-09-28 (session 2). This file is the single status board for the "PLS Tech Portfolio CMS v2" brief. Keep it updated at the end of every work session (see "How to update this file").

---

## 0. Ground rules (non-negotiable, set by the owner)

1. **Never fabricate.** No invented roles, dates, metrics, skills, achievements, or project details. If a fact is missing, leave a clearly marked `PLACEHOLDER` and `"draft": true`, and ask.
2. **One JSON entry = one change.** A new job, certificate, project, promotion, talk, etc. must be doable by editing a single `data/*.json` entry. Never require HTML edits.
3. **Do not remove anything good.** Preserve SEO, CMS, accessibility, responsiveness.
4. **Static-site friendly:** GitHub Pages, vanilla JS, Handlebars build pipeline. No React/Vue/Next.
5. **Fail loudly.** References between data files are resolved at build time and the build throws on a bad reference (see `build/build.js`, "Resume Builder" block).
6. **Verify before handing back:** `npm install && npm run validate && node build/build.js`, `node -c` on every JS file, and a link/asset integrity check (all local `href`/`src`, subpath `/portfolio` aware, strip `#`/`?` before checking).

## 1. Architecture in 60 seconds

- `data/career.json` — CONTROL FILE (roles → resume + cover letter + homepage mode; audiences; goals; rules; letter wording). Replaces old resume-profiles.json / cover-letter.json.
- `data/*.json` — all content (source of truth). `content/*.md` — long-form markdown.
- `build/build.js` — reads data, validates (`build/schemas.js`, `build/lib/validate.js`), renders Handlebars (`templates/`) into `dist/`. Also emits sitemap, RSS, robots, search index.
- `build/lib/data.js` — loads every JSON file; exposes `xPublished` arrays (drafts filtered).
- Deploy: `.github/workflows/build.yml` builds and publishes `dist/` to GitHub Pages on push to `main` (plus weekly cron for GitHub metadata).
- Base path is `/portfolio` (`site.baseUrl`). Use the `{{url '/path'}}` helper in templates, never hardcode.
- Pages use `writePage(file, template, context, meta, options)`; `options.extraStyles` adds CSS (`["resume","print"]`).

## 2. DONE

### Earlier sessions
CMS data files, per-project/product pages, timeline, community, certifications, testimonials, services, now, cv, general resume, search index, sitemap/RSS/robots, JSON-LD/OG/Twitter/canonical/breadcrumbs, build-time GitHub metadata (stars/lang/updated), GitHub Actions deploy, guides (CMS/CONTENT/SEO/DEPLOYMENT/PERFORMANCE/PROJECT).

### This engagement (all verified: validate clean, 62 pages, 4,180 local refs / 0 broken, all JS `node -c` clean, career-mode tested in jsdom)
- Resume Builder + Cover Letter Builder, now driven by **`data/career.json`** (roles with `extends`; every reference verified at build; skills verified against real data).
- Roles live: backend-engineer, python-developer, fastapi-developer, ai-engineer, software-engineer, automation-engineer, data-engineer, founder, startup-founder, saas-builder, cto, presales-engineer, solutions-engineer (extends presales), it-engineer (extends presales), cybersecurity (extends presales). Draft: go-developer (no Go project exists). Deliberately NOT created: machine-learning-engineer (owner decision).
- **Career modes + Profile Switcher** on homepage (`js/career-mode.js`); audiences: Backend Recruiter, Startup Founder, Client, Open Source Contributor, Cybersecurity Employer. About page reorders skills/experience. Works without JS (default view).
- Real experience: CTO — Moi Doctar (Aug 2026–Present, part-time/startup leadership); Presales Engineer / IT — EESolutions (Oct 2026–Present, full-time hybrid); Oasis Infobyte "Completed — Certificate Not Claimed". Experience entries have stable `id`s; About + resume pages render responsibilities/impact/technologies.
- Skills groups added: Enterprise IT & Cybersecurity, Leadership & Architecture.
- Project added from README: OIBSIP (Oasis Infobyte submissions). BI Suite repo link added. All owner-listed repos are present in projects/products except TechCrush AI Capstone (no public repo found).
- Analytics: provider-agnostic `js/analytics.js` (GoatCounter + Plausible adapters), config in `site.json → analytics`; emits nothing until GoatCounter code is set. Click/print/copy/form tracking via `data-track*`.
- Contact: Calendly, YouTube (fixed to @peterlight_speed), X, GitHub, WhatsApp community via `site.json → contactChannels`; community page has WhatsApp.
- CLS: `imgAttrs` helper adds width/height to logo/splash/hero images.
- Cover letters: noindex, excluded from sitemap.
- Docs: PERSONAL_GUIDE.md (complete owner guide), HOW_TO_GENERATE_NEW_RESUME.md (rewritten for career.json), CHANGELOG. TODO.md rewritten as developer-only and git-ignored.
- `.gitignore` hardened: TODO/handoff/audit notes, `.env*`, keys, `.wrangler`, editor/OS files.

## 3. BLOCKED ON OWNER
| Item | Blocks |
|---|---|
| GoatCounter site code | Analytics actually recording |
| Oasis end month | Exact dates/timeline |
| A real Go project (or move Go to "learning") | go-developer role |
| TechCrush AI Capstone repo/URL | Capstone project + timeline milestone |
| Dates: Python start, backend transition, AI journey | Timeline milestones |
| Cybersecurity certs/courses held or in progress | Courses/learning dashboard, cybersecurity credibility |
| Confirm CTO/Presales text is fine to publish (now live) | — |

## 4. REMAINING (see also TODO.md, developer-only)
1. Admin dashboard (`/admin/`, GitHub-API based; security = fine-grained token).
2. Dedicated pages: `/talks/`, `/achievements/`, `/learning/`; data files `courses.json`, `timeline.json`, `publications.json`.
3. Certificates v2 fields + rendering.
4. GitHub v2 (license, topics, contributors, pinned repos, contribution stats; needs token).
5. Project page audit (Motivation, Gallery, Videos, Downloads, Timeline) and Product page depth (pricing comparison, docs, release notes, FAQs, support).
6. Add `imgAttrs` to card components; run a real Lighthouse audit (never run — static scan only: 0 missing alt, 0 duplicate ids, lang present on every page).
7. Docs still to write: HOW_TO_ADD_PROJECT / CERTIFICATE / EXPERIENCE (content exists in PERSONAL_GUIDE §4–6; split out if wanted), backup/restore/migrate are in PERSONAL_GUIDE §14–16.
8. Multiple cover-letter tones, per-role achievements on resumes, build-time PDF generation.

## 5. Notes for the next AI
- Run: `npm install && npm run validate && node build/build.js`, `node -c` every JS file, link check (strip `#`/`?`, `/portfolio` base), and jsdom test of `js/career-mode.js`.
- `career.json` roles reference experience by **id**, not title (titles change on promotion).
- Never fabricate. Mark unknowns `PLACEHOLDER` + `draft: true`.
- Dev-only files (TODO.md, AI_HANDOFF.md, HANDOFF_NOTES.md, FINAL_*.md) are git-ignored; if already tracked, `git rm --cached` them.
- Legacy: contact page body is still `_legacy/contact.html` with a generated "connect" block injected before the form section marker.

## 6. How to update this file
End of each session: move finished items to §2, add blockers to §3, note verification results, bump the date.
