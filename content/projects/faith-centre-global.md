## Architecture

The site needed to be editable by non-technical church staff without a CMS backend, hosting costs, or a build step. The solution is a client-side JSON-CMS pattern split into two layers: `content/` (things that change often — sermons, events, books, testimonies, leadership, announcements) and `config/` (things that rarely change — payment providers, form endpoints, analytics IDs, social links).

`js/content-loader.js` fetches every file in both layers on page load and exposes them as `window.TFCG_CONTENT` / `window.TFCG_CONFIG`, firing a `tfcg:content-ready` event once everything's loaded. `js/render.js` listens for that event and renders every section of every page from that data through reusable card/list renderer functions — each renderer checks whether its container exists on the current page before doing anything, so this one file safely covers all 10 pages without page-specific branches.

## Implementation notes

- `js/script.js` (navbar behavior, counters, filter tabs, live search, scroll-to-top) is written to tolerate content being injected asynchronously, since the JSON fetch means the DOM isn't fully populated on first paint.
- A floating "Ministry Assistant" chat widget answers common visitor questions by matching keywords against a separate, self-contained knowledge base (`js/church-data.json`) — deliberately kept independent from the `content/`/`config/` CMS so it keeps working even if a content file is temporarily broken. The code has a marked `// TODO: Swap this function for a real AI API call` for when that upgrade happens.
- Payments (Paystack), contact forms (Formspree), and analytics are fully wired in code but shipped with `enabled: false` and empty placeholders in their respective config files — turning any of them on is a config edit, not a code change, once the church confirms which providers to use.
- A service worker (`sw.js`) plus an install-banner script give the site an installable, offline-capable PWA app shell.

## Tradeoffs

Fetching JSON client-side means the site can't be opened directly from disk (`file://`) — it needs to be served over even a minimal local web server for the `fetch()` calls to succeed. That's a one-line `npm run dev` for local development, and no different from any other site in production, so it was an acceptable tradeoff for the much bigger win: zero backend, zero hosting cost beyond static file hosting, and content updates that are a JSON edit instead of an HTML edit — the same architectural bet this portfolio itself is built on.
