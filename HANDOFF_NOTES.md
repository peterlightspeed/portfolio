# Handoff Notes — Read This First

For whichever AI assistant continues this work. The person is **Peter Eluwade (Peter Lightspeed / peterphonist)** — backend developer and AI engineer in Lagos, Nigeria, founder of PLSTech. He has a fully-built custom CMS portfolio (Node.js static site generator — **no React/Vue/Next, this is a deliberate architectural choice, keep it that way**) deployed to GitHub Pages at `peterlightspeed.github.io/portfolio/`. Repo: `https://github.com/peterlightspeed/portfolio`.

**Read `CMS_GUIDE.md` in the repo root before touching anything.** Content lives in `/data/*.json` and `/content/*.md`, templates in `/templates/*.hbs` (Handlebars), build script is `build/build.js`, output goes to `/dist`. Never hand-edit `/dist` — it's regenerated every build. Also read `TODO.md` and `MIGRATION_STATUS.md` — they track what's done vs. outstanding.

## Critical technical context

1. **This site deploys to a subpath** (`/portfolio/`), not a domain root. Every internal link/asset MUST use the `{{url}}` or `{{asset}}` Handlebars helpers in `build/lib/helpers.js` — never a raw `href="/something"`. Getting this wrong silently breaks the entire site. This happened repeatedly; see `CHANGELOG.md` for the history.
2. **Always run full verification before delivering a zip**: `node build/lib/validate.js`, a fresh `rm -rf node_modules && npm install` + `node build/build.js`, `node -c` on every `.js` file, plus a link/asset integrity check (reusable Node one-liner pattern is in recent `CHANGELOG.md` entries — copy it).
3. **Never fabricate experience, dates, clients, metrics, or technologies.** He has been explicit and repeated about this. If information is missing, stop and ask rather than inventing something plausible.
4. **He deploys via GitHub's web UI or basic git commands**, walked through step by step. Assume low comfort with CLI/deployment tooling — give copy-paste-level instructions.

## Completed this session

- **Sticky navbar fixed** — `overflow-x: hidden` on `<body>` breaks `position: sticky` in many browsers. Moved to `<html>`.
- **Heading decoration scoped** — a global `h2::after` rule was adding a blue underline to *every* `<h2>` sitewide, including product card titles and resume section headers where it looked misaligned. Now opt-in via `.section-title`; added that class to the genuine section headers that relied on the old global behavior.
- **Splash screen redesigned** — progress ring + live percentage + rotating captions ("Gathering resources..." → "Warming up the engine..." → "Almost there..." → "Ready!"). Files: `templates/partials/splash-screen.hbs`, `js/splash.js`, styles in `css/cms.css`. Keeps the min/max display-time safety rails (won't flash, can't get stuck).
- **Bootstrap Icons self-hosted** — was CDN-loaded (single point of failure). Now an npm dependency, copied to `dist/public/vendor/bootstrap-icons/` at build time.

## Still open

1. **Icons possibly still not showing.** I verified self-hosted files byte-for-byte, correct relative paths, `!important` protection — code is provably correct. If still reported, most likely a stale/cached deploy or something environment-specific I couldn't reproduce without a browser. Ask for a screenshot and check DevTools Network tab for 404s on `bootstrap-icons` before assuming a code bug.
2. **Contact form CORS — requires action only he can take.** Code in `worker/contact-worker.js` and `js/contact.js` is correct and matches. The live Cloudflare Worker is a **separate service from GitHub Pages** — editing the repo file never updates it. A GET self-diagnostic was added to the Worker (visit its URL in a browser, it reports trusted origins). Exact redeploy steps are in `TODO.md`. **Don't debug this in code again — the code is correct.**
3. **SEO for name-search visibility — requested, not started.** He wants the site to surface for "Peter Lightspeed", "peterlightspeed website", "Eluwade Peter", "peterphonist", "web developer". `Person` JSON-LD already exists in `build/lib/seo.js` with name/alternateName/sameAs/jobTitle/knowsAbout. Likely still needed:
   - `data/site.json` has a single `alternateName` — schema.org accepts an **array**; add "Peterphonist" and other name variants.
   - Verify `site.defaultOgImage` is a real, good-looking image (not a placeholder) — drives link previews and often the search preview image.
   - Add a `logo` field to the Person/Organization schema pointing at a real square image, so Google can associate the logo with him.
   - Verify `public/robots.txt` and generated `dist/sitemap.xml` aren't blocking anything.
   - **Google Search Console setup/verification is likely the single biggest lever** for actually ranking on name searches — off-repo action item for him, not a code fix. Recommend it explicitly.

## The resume/CV project — MAJOR pending task, redefined mid-request

He originally asked for **2 combined resumes** (Backend Engineer; Full Stack/AI Engineer). That original brief is pasted in the conversation and **remains the source of truth for content, tone, project selection, and ATS guidance** — but he then changed the *structure* before any resume was produced.

### New structural requirement (supersedes "2 combined resumes")
Separate, **single-purpose resumes per role**, so he hands a recruiter one focused document instead of something "jampacked". Produce at minimum:
- **Backend Engineer**
- **Frontend Developer**
- **Full Stack Developer**
- **AI Engineer**
- **Founder** (for PLSTech / investor-or-partner-facing contexts — different tone from an employee-seeking resume)

All pull from the same real data (`data/projects.json`, `data/products.json`, `data/experience.json`, `data/skills.json`, `data/certificates.json` — the single source of truth, already audited against his GitHub repos and his own corrections). Re-weight and re-word per audience; don't invent anything.

**Ask him to confirm** whether AI Engineer and Founder should have meaningfully different project selections, or mostly reuse Full Stack content with a different summary — this wasn't specified.

### Additional explicit requirements
- **Add Django and FastAPI to the CV and portfolio.** FastAPI is genuinely used (PLS Nexus Talent Intelligence, PLS Compress, PLS QR, PLS Snip, PLS Crack — all confirmed real). **Django is currently only under "Currently Learning" in `data/skills.json` — confirm with him whether he's actually built something with Django before listing it as a core skill.** Promoting it silently would violate his own "don't fabricate" rule.
- **Include keywords recruiters/ATS search for.** The original brief lists a good set: Python, FastAPI, REST API, PostgreSQL, SQLAlchemy, JWT, Authentication, Async Programming, JSON, CSV, Data Validation, ETL, Backend Development, API Integration, Git, GitHub, Software Engineering, Automation. Add Django/FastAPI explicitly once confirmed. **Don't keyword-stuff** — the brief warns against this.
- **He will upload further updates over time** to keep improving the CVs and portfolio. Treat this as ongoing and iterative, not one-shot. When he sends new projects/certs/work history, update **both** the CMS data files (so the live portfolio stays current) **and** the relevant resumes together — the original brief requires project names, descriptions, tech, and links to match exactly between resume and live portfolio.

### Practical guidance
- Backend resume should prioritize: PLS Business Intelligence Suite, Nigerian SMB Data Sanitizer, PLS Nexus Talent Intelligence, PLS QR, PLS Compress. Full Stack can add Hope Assessment App, Faith Centre Global, the portfolio site itself. Derive sensible sets for Frontend/AI/Founder by similar reasoning.
- Deliver each as Markdown (iterable source of truth) **and** a clean, ATS-friendly one-page PDF or DOCX. Check for a `docx` skill in your environment (`/mnt/skills/public/docx/SKILL.md`) before hand-rolling Word output.
- **Still owed from the original brief**: the comparison doc (when to use which resume — now needs 5 versions, not 2), portfolio-alignment suggestions, and a gap analysis (what skills/projects would make him more competitive for backend roles in 6–12 months).

## Suggested first message to him
Confirm the exact resume variants he wants, confirm whether Django has been used in a real project, and confirm whether AI Engineer / Founder resumes need different project selections or just a different summary — then proceed.
