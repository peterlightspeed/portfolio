# Peter Lightspeed — Portfolio

Personal developer portfolio for Peter Eluwade (Peter Lightspeed). Built as a small, dependency-light static site generator — plain HTML/CSS/vanilla JS output, no client-side framework, deployable to GitHub Pages — with all content driven by JSON and Markdown so adding a project, product, certificate, or article never means writing HTML.

## Quick start

```bash
npm install
npm run build     # generates /dist
npm run serve     # preview at http://localhost:4000
```

## Adding content

```bash
npm run new:project -- "My New Project"
```
Fill in the new (draft) entry in `data/projects.json`, set `"draft": false`, `npm run build`. That's it — its card, its own page, its sitemap entry, and its search-index entry all appear automatically.

Full guide: **[CMS_GUIDE.md](CMS_GUIDE.md)** — start there. Field-by-field reference: **[CONTENT_GUIDE.md](CONTENT_GUIDE.md)**. Deployment details: **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**. What's migrated vs. still legacy: **[MIGRATION_STATUS.md](MIGRATION_STATUS.md)**.

## Architecture, in short

```
data/        ← content (JSON) — edit this for day-to-day updates
content/     ← long-form Markdown (case studies, About story)
templates/   ← Handlebars templates — edit for design/structure changes
build/       ← the generator (build.js + validation/SEO/sitemap/RSS/search-index libs)
dist/        ← build output — this is what gets deployed, never hand-edit it
_legacy/     ← pre-CMS pages not yet migrated onto templates (still functional)
```

Deployment is automatic via GitHub Actions on every push to `main` (`.github/workflows/build.yml`) — see `DEPLOYMENT_GUIDE.md` for the one-time GitHub Pages source setting it requires.

## Stack

Build time only: Node.js, [Handlebars](https://handlebarsjs.com/) (templating), [marked](https://github.com/markedjs/marked) (Markdown). Runtime (what ships to visitors): plain HTML, Bootstrap 5, Bootstrap Icons, vanilla JS. No React/Vue/Next/Angular anywhere in this project, by design — see `CMS_GUIDE.md` for why that still allows "edit one file, everything updates."

## Prior audits

`README.legacy-audit.md`, `FINAL_AUDIT.md`, and `FINAL_RECOMMENDATIONS.md` are kept for history — they document the pre-CMS cleanup pass. `MIGRATION_STATUS.md` is the current, up-to-date status.
