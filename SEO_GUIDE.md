# SEO Guide

What's automated, what you can still tune per-entry.

## Automatic on every generated page (nothing to maintain)

- `<title>`, meta description, canonical URL — built from `data/site.json` + the page's own data (`build/lib/seo.js`)
- Open Graph + Twitter Card tags
- `Person` JSON-LD on every page (name, jobTitle, sameAs socials, knowsAbout)
- `BreadcrumbList` JSON-LD wherever breadcrumbs are shown (projects, products)
- `SoftwareApplication` JSON-LD on every project and product detail page
- `sitemap.xml` — regenerated from the actual list of pages built, every build
- `rss.xml` — regenerated from `data/articles.json`
- `robots.txt` — static, in `public/`, copied through as-is

## Per-entry things worth setting deliberately

- Every project/product's `shortDescription` doubles as its meta description unless you're unhappy with it — keep it under ~155 characters for a clean search-result snippet.
- `image` on a project becomes its Open Graph image (falls back to `public/opengraph.jpg` site default if empty) — set a real screenshot once you have one.
- `date` on projects feeds both SEO (freshness signals, sort order) and `/timeline.html` — worth filling in even roughly (`"2026-07"` is fine).

## Verification tags

`public/BingSiteAuth.xml` is already in place and copied through. If you need a Google Search Console verification file/tag, drop it in `public/` (copied automatically) or add the meta tag to `templates/partials/head.hbs`.

## What to check after adding a lot of new content

Re-run `npm run validate` (catches missing/malformed fields) and spot check `dist/sitemap.xml` after a build — it should list every public page and nothing else (drafts are correctly excluded).
