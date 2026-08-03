# CMS Guide

How this portfolio actually works, for you today and for whoever maintains it in five years.

## The idea in one paragraph

Every page on this site is **generated**, not hand-written. Content lives as structured data in `/data/*.json` (and long-form prose in `/content/*.md`). A build script (`build/build.js`) reads that data, runs it through templates in `/templates`, and writes plain HTML/CSS/JS into `/dist`. `/dist` is what GitHub Pages serves. You never hand-edit HTML for content changes — you edit a JSON file (or run one `npm run new:...` command) and re-run the build.

## The one rule that makes this maintainable

**Content and presentation are separate, and every generator reads from exactly one source of truth per fact.** The nav lives once, in `data/site.json`. A project's tech stack lives once, in that project's object in `data/projects.json`. Nothing is copy-pasted across 15 files anymore. If you're ever tempted to hand-edit an HTML file in `/templates` to add or change *content* (not structure/design), stop — that content belongs in `/data` instead.

## Folder map

```
data/            ← all structured content. This is what you edit day to day.
content/         ← long-form Markdown (case studies, the About story).
templates/       ← Handlebars templates. Edit these for DESIGN/structure changes only.
  layout.hbs         the outer HTML shell every page is wrapped in
  partials/          nav, footer, <head>, shared scripts — each exists ONCE
  components/        reusable cards (project-card, product-card, ...)
  pages/             one template per page "type" (home, projects, project-detail...)
build/
  build.js           the whole generator, read top to bottom, runs in order
  schemas.js         the field contract for every content type
  lib/               validate.js, data.js, helpers.js, seo.js, sitemap.js,
                      rss.js, search-index.js, github.js
scripts/
  new-entry.js       scaffolds a new draft entry in the right JSON file
dist/            ← BUILD OUTPUT. Never edit this directly — it's overwritten
                   every build. This is what actually gets deployed.
_legacy/         ← the pre-CMS HTML pages not yet migrated onto templates
                   (see MIGRATION_STATUS.md). Copied through as-is for now.
```

## The build pipeline, step by step

Running `npm run build` (or letting GitHub Actions run it on push):

1. **Validates** every file in `/data` against `build/schemas.js` — wrong types, missing required fields, or duplicate slugs stop the build with a precise error before anything is generated.
2. **Loads** all data once (`build/lib/data.js`).
3. **Renders** every data-driven page: home, `/projects/` + one page per published project, `/products/` + one page per published product, certifications, testimonials, about, timeline (auto-assembled from experience + dated projects + certificates), now, community.
4. **Copies through** the legacy pages that haven't been migrated onto templates yet (contact, resume, cv, services, labs, sax, sponsor, demo, 404) — see `MIGRATION_STATUS.md`.
5. **Copies** static assets (`css/`, `js/`, `images/`, `public/`, `documents/`).
6. **Generates** `sitemap.xml`, `rss.xml`, and `public/search-index.json` from the actual list of pages just rendered — these can never drift out of sync with reality again, because nobody maintains them by hand.

## Adding content — the whole point of this system

### A new project
```bash
npm run new:project -- "My New Project"
```
This appends a `draft: true` entry with every field the template needs (see `build/schemas.js`) to `data/projects.json`, and creates an empty `content/projects/<slug>.md` for an optional case study. Fill in the fields, set `"draft": false`, run `npm run build`. Its card appears on `/projects/`, its own page is generated at `/projects/<slug>/`, it's now searchable, it's in the sitemap, and — if you gave it a `date` — it shows up on `/timeline.html` automatically. Nothing else to touch.

### A new product, certificate, talk, or article
Same pattern: `npm run new:product`, `npm run new:certificate`, `npm run new:talk`, `npm run new:article` — or just open the relevant file in `/data` and copy the shape of an existing entry (every field is documented in `build/schemas.js`).

### Work experience / internships
Add an entry to `data/experience.json` with `"type": "work"` (existing entries use `"type": "education"` — both render on `/certifications.html` and feed `/timeline.html` automatically).

### Updating the nav, socials, or site tagline
Edit `data/site.json`. It's read by the nav partial, footer partial, and every page's SEO tags — one edit, every page updates.

## Draft entries — how "empty templates" work

Any entry with `"draft": true` is fully validated (so a typo still gets caught) but excluded from listings, detail pages, the sitemap, RSS, and search — it simply doesn't generate a public page yet. Flip `draft` to `false` once you've filled it in. The seven new projects you mentioned (PLS QR, PLS Compress, DataFlow AI, Hope Assessment App, Faith Centre Global, Coach Gideon, Cedarville) already exist in `data/projects.json` this way — every field the schema requires is present and empty, ready for you to fill in.

## Case studies (Markdown)

Long-form engineering write-ups don't belong in JSON. Drop Markdown into `content/projects/<slug>.md` (the filename must match the project's `slug`) and it's automatically rendered under "Engineering Case Study" at the bottom of that project's page. Leave the file empty (or delete it) to skip a case study for that project — nothing breaks either way.

## GitHub metadata (stars, language, last updated)

`npm run fetch:github` scans every `links.github` URL in `data/projects.json`/`data/products.json`, hits the GitHub API, and caches the result in `data/.cache/github-meta.json`. The build reads that cache automatically if present. This runs weekly via GitHub Actions (see `.github/workflows/build.yml`) so stars/language stay current without you doing anything — and if the API call ever fails (rate limit, no network), the build just proceeds without the enrichment; it never breaks the site.

## Validation — why this is safe to hand off or forget about for months

`npm run validate` (also run automatically at the start of every build) checks every content file against its schema: required fields present, correct types, no duplicate slugs. A future you — or a future contributor who's never seen this repo — gets a clear error message instead of a silently broken page.

## Leaving yourself a note on a specific entry

Any JSON object can carry an `"_todo": ["...", "..."]` array — the underscore prefix is a convention (not enforced by the schema) meaning "metadata for humans, never rendered." Templates never read `_todo`, so it's safe to leave reminders directly on the entry they concern — see `data/products.json`'s `dataflow-ai` entry for an example. For anything bigger than a one-line reminder, use `TODO.md` at the repo root instead.

## What NOT to do

- Don't hand-edit anything in `/dist` — it's regenerated every build and your edit will be lost.
- Don't add a new field to one project's data without adding it to `build/schemas.js` (as optional) and to the templates that should render it — otherwise it's silently ignored.
- Don't duplicate the nav/footer/head into a new page template — always extend `layout.hbs` and the partials instead.
