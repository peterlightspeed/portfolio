# TODO — DEVELOPER ONLY (git-ignored, never deployed)

> This file is in `.gitignore`. If it was previously committed, run once: `git rm --cached TODO.md AI_HANDOFF.md HANDOFF_NOTES.md FINAL_AUDIT.md FINAL_RECOMMENDATIONS.md README.legacy-audit.md`

## Needs owner input
- [ ] GoatCounter site code → `data/site.json` `analytics.goatcounter.code`
- [ ] Oasis Infobyte exact end month (currently "Aug 2026 - Completed")
- [ ] Go: add a real Go project (then fill in `go-developer` role, set draft false) or move Go to "learning" in skills.json
- [ ] TechCrush AI Capstone: no public repo found under github.com/peterlightspeed — confirm repo name/URL before adding a project
- [ ] Confirm the correct project for each case study / gallery (none invented)
- [ ] Publicly verify the CTO / Presales wording is OK to be public (both are now `draft: false`)

## Technical debt
- Legacy hand-written bodies still in `_legacy/`: labs, sax, sponsor, demo, contact (contact now has a generated "connect" block injected). Migrate to templates + `services.json`.
- Resume header hardcodes " Toluwanimi" after `site.name` → add `legalName` to site.json.
- `build.js` is one big file; split sections into `build/pages/*.js`.
- Bootstrap/AOS load from CDN; self-host for speed and privacy.
- Card images (projects/products/testimonials) still lack width/height → add `imgAttrs` to `templates/components/*.hbs` (CSS already fixes heights, so CLS risk is low).
- `products.html` / `projects.html` are meta-refresh redirect stubs (0 h1 by design).
- Two 404/redirect pages lack viewport meta (redirect stubs only).
- `career-mode.js` reloads on change; could re-apply in place.
- Job dates are free-text; add ISO `start`/`end` fields so timeline sorting and "years of experience" are exact.
- Lighthouse never run in CI. Add `lhci` to the GitHub Action.
- Add a CI link/asset/JSON-LD check (the script used ad hoc during development).

## Features not yet built (from the original brief)
- [ ] Admin dashboard (`/admin/`) — plan: static page, GitHub fine-grained token entered by owner, forms generated from `build/schemas.js`, commits JSON via GitHub API. (True client-side "protection" is impossible on Pages; security = the token.)
- [ ] Dedicated `/talks/`, `/achievements/`, `/learning/` (courses: completed / in progress / planned + progress %) pages
- [ ] `courses.json`, `timeline.json` (milestones editable: Python start, backend transition, AI journey, capstone…), `publications.json`
- [ ] Certificates v2 fields: `credentialId, expiry, badge, image, pdf, verificationUrl, skillsGained, provider` + template rendering
- [ ] GitHub v2: license, topics, contributors, pinned repos, contribution stats (needs `GITHUB_TOKEN` in Actions)
- [ ] Project page audit: Motivation, Gallery, Videos, Downloads, Timeline sections
- [ ] Product pages: pricing comparison, docs, release notes, FAQs, support
- [ ] Multiple cover-letter tones per role; `applications.json` to prefill company/role/date
- [ ] Per-role achievements on resumes (`awardSlugs`)
- [ ] Machine Learning Engineer resume — ONLY after real ML work exists
- [ ] Downloadable PDF generation at build time (currently browser Print → PDF)

## Ideas
- Public /now page auto-fed from GitHub activity
- RSS for talks/achievements
- Dark-mode-aware resume print
- i18n
