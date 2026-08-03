# Performance Guide

## What the build already does

- Every generated `<img>` in project/product/testimonial/certificate cards has `loading="lazy"`.
- CSS/JS for Bootstrap, Bootstrap Icons, and AOS are loaded from CDN (jsdelivr/unpkg) with `<link rel="preload">` hints for the critical CSS.
- `public/search-index.json` is fetched lazily — only when someone actually opens the search modal, not on every page load.
- Sitemap/RSS/search-index generation happens at build time, not per-request — there's no runtime cost to any of it.

## Known follow-ups (flagged in the original audit, still true)

- Several images in `/images` are large, unoptimized PNGs (700KB–1.4MB per the original `FINAL_AUDIT.md`). Converting these to WebP and resizing to actual display dimensions is the single biggest remaining performance win — not done in this milestone since it touches binary assets outside the CMS's scope, but worth a dedicated pass.
- Bootstrap/AOS are currently pulled from public CDNs (jsdelivr/unpkg) rather than self-hosted — fine for now, but self-hosting removes the DNS/connection overhead of a third-party origin if Lighthouse flags it.

## How to check

```bash
npm run build && npm run serve
```
then run Lighthouse against `http://localhost:4000` (Chrome DevTools → Lighthouse tab) for a real read on Performance/Accessibility/Best Practices/SEO scores against the actual generated output, not the source templates.
