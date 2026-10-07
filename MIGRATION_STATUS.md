# Migration Status

Honest record of what's fully on the new CMS architecture vs. what's still the original hand-written HTML, so nobody (including future-you) is confused about which system a given page is on.

## ✅ Fully migrated — generated from `/data` + `/templates`

| Page | Source |
|---|---|
| `/` (home) | `data/site.json`, featured projects/products, testimonials |
| `/projects/` + one page per project | `data/projects.json` + `content/projects/*.md` |
| `/products/` + one page per product | `data/products.json`, `data/roadmap.json` |
| `/certifications.html` | `data/certificates.json`, `data/skills.json`, `data/experience.json` |
| `/testimonials.html` | `data/testimonials.json` |
| `/about.html` | `data/skills.json`, `data/experience.json`, `data/community.json`, `content/about-story.md` |
| `/timeline.html` | auto-assembled from `data/experience.json` + dated projects + certificates — no separate file to maintain |
| `/now.html` | `data/now.json` |
| `/community.html` | `data/community.json`, `data/talks.json` |
| `/resume.html` | `data/experience.json`, `data/skills.json`, `data/projects.json`, `data/certificates.json` |
| `/resume/` + one page per role | `data/resume-profiles.json`, resolved against `data/experience.json`, `data/skills.json`, `data/projects.json`, `data/products.json`, `data/certificates.json` — see `HOW_TO_GENERATE_NEW_RESUME.md` |
| `/cv.html` | `data/site.json` (documents, additional info) |
| `/404.html` | `data/site.json` (standalone template, no shared nav by design) |
| `/services.html` | `data/services.json` |

Nav, footer, and every `<head>`/SEO tag across **every page above** come from one partial each — `templates/partials/nav.hbs`, `footer.hbs`, `head.hbs` — driven by `data/site.json`.

## 🟡 On the shared layout, body content not yet data-modeled

These pages' unique body content is preserved exactly as it existed, but they've been pulled off their own hand-written nav/footer/`<head>` and onto the same shared partials as everything else — so a nav/footer/SEO change now updates these too, automatically. Their *body content* is still hand-written HTML for this milestone, since none of it falls under the projects/products/certifications/articles/talks/experience/community list this CMS is built around:

- `contact.html` — the contact form itself (submission still goes through the existing Cloudflare Worker)
- `labs.html` — interactive dev tools (password generator, typing test, etc.)
- `sax.html` — saxophonist booking page + chatbot widget
- `sponsor.html` — sponsorship tiers
- `demo.html` — embedded project preview iframes

These are meaningfully more bespoke/interactive than a card list and would gain comparatively little from JSON-driving — but the pattern used for `services.json` (a single object holding the page's structured sections) would work the same way for `sponsor.html`'s tiers if you want that one done too.

## Fixes made during migration (bugs found, not introduced)

- `sax.html` referenced `sax-bot.js`/`sax.js` at the site root; the files actually live in `/public`. Fixed the two `<script src>` paths.
- `cv.html`'s "Skills Assessment" download button pointed to a placeholder href (`Skills_Assessment`, no extension) — the actual file exists at `documents/Skills_Assessment.pdf`; now correctly linked via `data/site.json`'s `documents` object.
- Project detail pages' "Live Demo" links (for projects using the shared `/demo.html?project=...` page) were relative and would have 404'd from inside `/projects/<slug>/` once those became folder-based clean URLs. Made absolute in `data/projects.json`.
- Old flat `projects.html`/`products.html` links now redirect to `/projects/` and `/products/` via small stub files, since those became folder URLs.
- `resume.html` listed real work experience (PLS WorldNews, freelance web development, Camex Global Concept instructor role) that wasn't yet in `data/experience.json` — added as `type: "work"` entries, now the single source for both `/resume.html` and `/timeline.html`.
- **Found, not fixed — flagging for you to resolve:** `certifications.html` and `resume.html` on the original site disagreed about your Computer Science degree — one says University of The People (2025–present), the other says Lagos State University (Jan 2026–Jan 2030). `data/experience.json` currently uses the University of The People version since it's what `certifications.html`'s dedicated education section stated. Let me know which is correct and I'll update the one source of truth.
- `services.html` referred to your company as "PLS TechCompany" in one spot, inconsistent with "PLSTech" used everywhere else on the site (including `site.json`'s `company` field). Normalized to "PLSTech" in `data/services.json`.

## New pages this milestone added that didn't exist before

`/timeline.html`, `/now.html`, `/community.html` — all requested in the original brief, all fully data-driven from day one.
