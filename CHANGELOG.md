# Changelog

## [3.0.0] — CMS Architecture — 2026-08-02

### Added — the CMS itself
- Node.js static-site build pipeline (`build/build.js`) — reads `/data` + `/content`, renders Handlebars templates, outputs plain HTML/CSS/vanilla JS to `/dist`. No React/Vue/Next/Angular; GitHub Pages compatible.
- Schema + validation layer (`build/schemas.js`, `build/lib/validate.js`) — every content file is checked for required fields, correct types, and duplicate slugs before every build.
- 13 structured data files in `/data`: `site.json`, `projects.json`, `products.json`, `roadmap.json`, `certificates.json`, `experience.json`, `skills.json`, `testimonials.json`, `community.json`, `now.json`, `articles.json`, `talks.json`, `awards.json`.
- Shared templates: one layout, one nav partial, one footer partial, one head/SEO partial, four reusable card components (project, product, testimonial, certificate) — replacing 14 copies of hand-written nav/footer markup.
- Automatic `sitemap.xml`, `rss.xml`, and `public/search-index.json` generation, built from the actual rendered page list every time — not hand-maintained.
- Site-wide search UI (`js/search.js` + modal in the nav partial), powered by the generated search index.
- Per-page SEO: title/description/canonical/OG/Twitter tags plus `Person`, `BreadcrumbList`, and `SoftwareApplication` JSON-LD, all generated from data (`build/lib/seo.js`).
- Optional GitHub metadata enrichment (`build/lib/github.js`) — fetches stars/language/last-updated for any project/product with a GitHub link, cached to disk, runs weekly via CI.
- `scripts/new-entry.js` + `npm run new:project|product|article|certificate|talk` — scaffolds a valid draft entry (and, for projects, a matching empty case-study Markdown file) so new content never means writing JSON from memory.
- `.github/workflows/build.yml` — validates, builds, and deploys to GitHub Pages automatically on every push to `main`.
- Three new pages that didn't exist before, all fully data-driven: `/timeline.html` (auto-assembled from experience + dated projects + certificates, nothing hand-maintained), `/now.html`, `/community.html`.

### Migrated onto the CMS
- Home, Projects (listing + one page per project), Products (listing + one page per product), Certifications, Testimonials, About — all now generated from `/data`, using only content already present on the site (see `MIGRATION_STATUS.md` for the full breakdown).
- All 15 existing projects transcribed into `data/projects.json` faithfully — nothing rewritten, nothing invented.
- Both products (SMB Data Sanitizer, BI Suite) and their edition tiers transcribed into `data/products.json`.

### New draft scaffolding (per your instruction — no invented content)
- 7 new projects added to `data/projects.json` as `draft: true` with every schema field present but empty: PLS QR, PLS Compress, DataFlow AI, Hope Assessment App, Faith Centre Global, Coach Gideon, Cedarville.
- Matching empty case-study templates created at `content/projects/<slug>.md` for all 7.

### Fixed (bugs found during migration, not introduced by it)
- `sax.html` referenced `sax-bot.js`/`sax.js` at the site root; corrected to their actual location in `/public`.
- Project "Live Demo" links using the shared `/demo.html?project=...` page were relative and would have 404'd once projects became folder-based clean URLs (`/projects/<slug>/`) — made absolute.
- Added redirect stubs for the old flat `projects.html`/`products.html` URLs, since not-yet-migrated legacy pages (contact, resume, cv, services, labs, sax, sponsor, demo) still link to them the old way.
- Removed duplicated `backToTop` button logic that was copy-pasted into `about.js`, `certifications.js`, and other per-page scripts — consolidated into one handler in `js/script.js`.
- Removed now-redundant client-side nav-highlighting JS (active nav state is now set correctly at build time via the `{{activeIf}}` helper).

### Known pre-existing issue, left as-is
- `cv.html`'s "Skills Assessment" download button points to a placeholder href with no matching file. No source document exists to link it to — noted in `MIGRATION_STATUS.md` rather than guessed at.

### Verification performed
- Full automated link-integrity check across every generated page's `href`/`src` attributes against the actual build output — zero broken links/assets introduced by this migration.
- Automated check confirming every local image/logo/avatar referenced in `/data` exists in the built output.
- `npm run validate` passes clean; `npm run build` produces 34 pages (15 projects, 2 products, 7 certificates) with no template errors.

### Not yet migrated (next milestone — see `MIGRATION_STATUS.md`)
- `contact.html`, `resume.html`, `cv.html`, `services.html`, `labs.html`, `sax.html`, `sponsor.html`, `demo.html`, `404.html` are carried through unchanged from the original site for this milestone. They work correctly; they just aren't yet driven by `/data` + templates.

### Suggested commit messages
```
feat(cms): add Node-based static site build pipeline with schema validation
feat(data): migrate projects, products, certificates, testimonials, skills,
            experience, and site settings into structured JSON
feat(templates): introduce shared layout + nav/footer/head partials and
                 reusable card components, replacing 14 copies of hand-written markup
feat(seo): auto-generate sitemap.xml, rss.xml, and per-page JSON-LD from content data
feat(search): add site-wide search UI backed by an auto-generated search index
feat(ci): add GitHub Actions workflow to validate, build, and deploy to Pages
feat(pages): add /timeline, /now, and /community pages
feat(content): scaffold 7 draft projects (PLS QR, PLS Compress, DataFlow AI,
               Hope Assessment App, Faith Centre Global, Coach Gideon, Cedarville)
fix(links): correct sax.html script paths and absolute-ize demo.html project links
fix(js): de-duplicate back-to-top handler; remove redundant client-side nav highlighting
docs: add CMS_GUIDE, CONTENT_GUIDE, DEPLOYMENT_GUIDE, PROJECT_GUIDE,
      SEO_GUIDE, PERFORMANCE_GUIDE, and MIGRATION_STATUS
chore: archive pre-CMS HTML pages to /_legacy for reference
```

## [3.1.0] — Legacy Page Migration — 2026-08-02

### Migrated onto the CMS
- `/resume.html` — now generated from `data/experience.json`, `data/skills.json`, `data/projects.json`, `data/certificates.json` instead of hand-written HTML with its own copy of the same facts.
- `/cv.html` — document links and copy now sourced from `data/site.json`.
- `/404.html` — rebuilt as a standalone data-driven template (intentionally has no shared nav, matching the original design).
- `/services.html` — fully migrated to `data/services.json` (mentorship section, 4 pricing packages, 13 service cards across two grids, 3 "why choose me" points, 4 FAQ items, closing CTA — all data-driven now).
- `contact.html`, `labs.html`, `sax.html`, `sponsor.html`, `demo.html` — pulled onto the shared nav/footer/head partials via safe extraction (unique body content preserved exactly); no longer carrying their own hand-written copies of the nav/footer.

### Fixed
- `cv.html`'s dead "Skills Assessment" download link now correctly points to `documents/Skills_Assessment.pdf` (the file existed; the link was just missing the extension and path).
- Added 3 real work-experience entries (PLS WorldNews, freelance web development, Camex Global Concept instructor) to `data/experience.json` that existed on the old `resume.html` but weren't anywhere else on the site — now the single source for both `/resume.html` and `/timeline.html`.
- Added the "Trade Test Grade III, II & I" certification (found on the old resume, missing from `certifications.html`) to `data/certificates.json`.
- Normalized "PLS TechCompany" → "PLSTech" in services copy for consistency with the rest of the site.

### Found, not silently resolved
- `certifications.html` and `resume.html` disagreed about which university you're attending and the enrollment dates. Not guessed at — flagged in `MIGRATION_STATUS.md` for you to confirm.

### Verification performed
- Automated href/src integrity check across all 34 generated pages after every change in this milestone — zero broken links/assets at each step.
- Manual spot-check of `services.html`'s FAQ accordion (correct `data-bs-target` IDs generated via `{{@index}}`) and `resume.html`'s Work Experience section.

### Suggested commit messages
```
feat(cms): migrate resume, cv, and 404 to fully data-driven templates
feat(cms): migrate services.html to data/services.json
feat(cms): pull contact/labs/sax/sponsor/demo onto shared nav/footer/head partials
fix(data): correct dead Skills Assessment download link on cv.html
fix(data): add missing work-experience entries and Trade Test certification
          found on the legacy resume but absent elsewhere on the site
docs: update MIGRATION_STATUS and CONTENT_GUIDE for this milestone
```

## [3.2.0] — Client-Conversion Fixes — 2026-08-02

### Fixed — real bugs affecting lead quality, found while reviewing the "Get a Quote" funnel
- **Contact form pre-fill was completely dead.** `js/contact.js` looked for an element with `id="service"` to pre-select the service dropdown from a `?service=` URL param; no such element has ever existed on `contact.html` (the actual field is `id="projectType"`). Every "Get a Quote" link on the site landed on a blank form. Fixed the selector and expanded the dropdown's options so all 13 services on `/services.html` now map to a matching option.
- **"Get a Quote" links weren't URL-encoding the service name.** Two of them (`Data Entry & Typing`, `AI & Web Content Development`) would have broken the query string entirely at the `&`. Added a `urlencode` Handlebars helper and applied it to both service grids.

### Added
- Availability signal (`data/site.json` → `availability`) — a pulsing "Available for backend, AI & SaaS engineering work · reply within 24h" badge on the homepage hero and site footer (every page, including the not-yet-fully-migrated ones, since it lives in the shared footer partial). Set `availability.status` to anything other than `"available"` to hide it.
- Live GitHub metadata is now actually fetched (`npm run fetch:github`) and displayed on project pages that have a matching public repo — stars, primary language, last-updated date. (Currently live for the portfolio repo itself; the AI Cover Letter Generator repo returned a 403 from GitHub's API on this fetch — likely a private/rate-limited repo, re-run `npm run fetch:github` with `GITHUB_TOKEN` set to retry.)
- `formatDate` helper for clean date display anywhere an ISO timestamp needs to be human-readable.

### Data
- `data/site.json`: added `languages` correction (English native, Japanese basic) and the new `availability` object.

### Verification performed
- Full href/src integrity check across all 34 pages — zero broken links.
- Confirmed URL-encoded query strings render correctly in generated HTML.
- Confirmed availability badge and live GitHub stats render with real data, not placeholders.

## [3.3.0] — Real Repository Data Import — 2026-08-02

### Source
Inspected all 21 public repositories on github.com/peterlightspeed via the GitHub API — READMEs, topics, package.json/requirements.txt, and planning docs — and rebuilt project/product content from that source data. No placeholder content was scaffolded; every field below is traceable to a real README, manifest file, or the existing site.

### Products — "Products" mindset added
Four previously-undocumented, actually-deployed tools were found and added as real products (not projects) since they're standalone, no-signup, live tools rather than portfolio demos:
- **PLS Compress** (github.com/peterlightspeed/pls-compress) — live at pls-compress.onrender.com
- **PLS QR** (github.com/peterlightspeed/pls-qr) — live at pls-qr.onrender.com
- **PLS Snip** (github.com/peterlightspeed/pls-snip) — source available, no public demo URL found
- **PLS Crack** (github.com/peterlightspeed/pls-crack) — source available, no public demo URL found

The existing SMB Data Sanitizer product was enriched with its real GitHub link and the actual feature list from its README (previously partially placeholder-derived).

### Projects — replaced drafts with real data, added real content
- **Coach Gideon**, **Cedarville**, **Faith Centre Global** — were `draft: true` placeholders; replaced with real descriptions, tech stacks, and features sourced from their actual READMEs.
- **Faith Centre Global** turned out to be the most architecturally interesting project on the account — a full client-side JSON-CMS (16 content/config files, a single generic renderer, offline PWA support, a self-contained chat widget) — given a real engineering case study in `content/projects/faith-centre-global.md` and marked `featured: true`.
- **PLS Nexus Talent Intelligence** — enriched with real architecture detail from its `docs/PLANNING.md` (entity design, why Pydantic/SQLAlchemy are kept separate, async-first decision, Google Gemini via `google-genai`) and given a real case study.
- **Hope Assessment App** — new project, not previously on the site. Real Next.js/React/TypeScript/Tailwind/Radix healthcare app with a confirmed live Vercel demo.
- **PeterLightspeed Projects** — new project, not previously on the site. Tutorial/live-coding source repository.
- **Lightspeed Hospital Template**, **Freedom Reign Basketball Academy** — added confirmed real GitHub links (previously unlinked).
- **PLS Nexus** — clarified as the umbrella platform with Talent Intelligence as its first module (per the module's own planning doc), rather than a standalone repo — it doesn't have one yet, and this was already accurately reflected on the pre-migration site.

### Skills — updated per your explicit current skill set
Added a new "AI & LLMs" core skill group (backed by real usage: Google Gemini integration in Talent Intelligence, HuggingFace Transformers in the Cover Letter Generator) and moved React + added TypeScript into core Frontend skills (backed by the real, deployed Hope Assessment App) rather than "currently learning."

### Explicitly NOT scaffolded — needs your input
Per your instructions, nothing below was invented or placeholder-filled:
- **DataFlow AI** — no matching public repository found under any name variant checked, and no prior content existed for it on the site either. Still `draft: true`, empty. Needs your input.
- **Oasis Infobyte AI Internship** — not derivable from any repository; no existing content on the site. Needs your input (dates, role, what was built).
- **World Forum for Democracy Youth Delegate 2026** — not derivable from any repository; no existing content on the site, and "application" is ambiguous (applied vs. selected vs. pending). Needs your input.

### Verification performed
- Full href/src integrity check across all 43 generated pages (up from 34) — zero broken links.
- Confirmed both new case studies (Faith Centre Global, PLS Nexus Talent Intelligence) render correctly with real technical content.
- Confirmed the search index (61 entries, up from ~40) and sitemap (43 URLs) picked up all new products/projects automatically with no manual wiring.

## [3.4.0] — Products Taxonomy, Currently Building, Metrics, New Life Details — 2026-08-02

### Data — no fabrication, only what was explicitly provided
- **DataFlow AI** — added as a real product (private repo, ~v0.5, In Progress). Description limited strictly to the confirmed feature list (CSV/Excel upload, profiling, quality detection, cleaning/standardization, report generation) — no GitHub link, no demo link, no invented details, and the UI explicitly labels it "Private Project · In Progress."
- **Oasis Infobyte AI & Python Development Internship** — added to `data/experience.json` as ongoing (`Aug 2026 - Present`), responsibilities only, no claimed completed work or achievements.
- **World Forum for Democracy Youth Delegation 2026** — added to `data/awards.json` as "Application Submitted (Pending Outcome)" — explicitly does not state or imply selection.

### Restructured — Products vs. Projects, for real this time
- `data/products.json` and `data/projects.json` are now genuinely separate taxonomies rather than a shared list with a `featured` flag. PLS Nexus and DataFlow AI moved from projects to products (they're platforms being built for users, not portfolio demonstrations).
- Every project now carries a `workType`: `client`, `open-source`, or `labs`. `/projects/` auto-groups into "Client Work," "Open Source," and "Labs & Experiments" sections from this field — add a new client project with `workType: "client"` and it appears in the right section with no template change.

### Added
- **Homepage "Currently Building" section** — highlights PLS Nexus, DataFlow AI, and PLS Nexus Talent Intelligence, driven by `site.currentlyBuilding` (a list of slugs resolved against both products and projects).
- **Homepage "Portfolio Metrics" section** — replaced the old generic stats block (95% "client satisfaction," 24/7 "support" — unverifiable marketing claims) with real, editable metrics from `site.metrics`: Building Since 2024, 20+ Projects Built, 6 Production Products (now 8), AI · Python · Go Backend Developer, Open Source Developer.
- **"Leadership & Achievements" section on About page**, sourced from `data/awards.json`, also folded into `/timeline.html` automatically.

### Fixed
- `templates/pages/about.hbs` had an invalid CSS class (`col-lg-2-4` — not a real Bootstrap class, silently no-oped since browsers ignore unknown classes) in the skills roadmap grid. Corrected to a valid responsive class.

### Final quality pass performed (this milestone)
- Full href/src integrity check across all 44 generated pages — **0 broken links/assets**.
- Sitemap: 44 URLs, matches actual generated page count exactly.
- RSS (`rss.xml`) generates correctly (empty channel — no articles published yet, which is accurate).
- Search index: 63 entries, includes every new product/project/award automatically.
- JSON-LD (Person + Breadcrumb + SoftwareApplication where applicable) confirmed present on homepage, a sample project page, and the new DataFlow AI product page.
- Canonical URL, Open Graph, and Twitter Card tags confirmed present.
- Viewport meta confirmed present on all real pages (absent only on the two intentional 0-second redirect stubs for legacy `projects.html`/`products.html` URLs, which render nothing and aren't in the sitemap — correct, not a gap).
- Accessibility spot-check: zero `<img>` tags missing `alt`, skip-to-content link present, `lang="en"` set.
- **Not independently verifiable in this environment:** an actual Lighthouse performance run requires a real browser instance, which isn't available here. Everything checkable via static analysis (meta tags, structured data, semantic HTML, responsive Bootstrap grid classes throughout) passes; a real Lighthouse score should still be pulled from Chrome DevTools against the deployed site to confirm perceived load performance, which static analysis can't measure.

## [3.5.0] — Real Screenshots + Live Demos for All 4 Products — 2026-08-03

### Added
- Real screenshots (from your uploads) for PLS Compress, PLS QR, PLS Snip, and PLS Crack — saved to `images/products/` and wired into `data/products.json`.
- Confirmed live demo links added for all four, including PLS Snip and PLS Crack, which previously had none:
  - PLS Compress → https://pls-compress.onrender.com/
  - PLS QR → https://pls-qr.onrender.com/
  - PLS Snip → https://pls-snip.onrender.com
  - PLS Crack → https://pls-crack-tv5k.onrender.com
- PLS Snip and PLS Crack's edition CTA updated from "View on GitHub" to "Try It Live" now that a real demo exists, and their status changed from "Source Available" to "Live."

### Fixed
- **Real gap found**: the `image` field on products has existed since Milestone 6, but `product-card.hbs` and `product-detail.hbs` never actually rendered an `<img>` tag for it — screenshots were being silently ignored regardless of what was in the JSON. Both templates now display the screenshot when one is present.

### Verification performed
- Confirmed all 4 screenshots render on both the products listing page and each product's own detail page.
- Full href/src integrity check across all 44 pages — 0 broken links/assets.

## [3.6.0] — Degree Fix, Real Screenshots, Sitewide Image Optimization — 2026-08-03

### Fixed
- Degree conflict resolved: Lagos State University (Jan 2026 - Jan 2030) confirmed correct in `data/experience.json` — no longer shows University of The People.

### Added
- Real screenshots for Cedarville, Coach Gideon, and Hope Assessment App, sourced from your uploads, converted to WebP.
- PLS Nexus Talent Intelligence's `_todo` corrected to note it has no UI to screenshot (backend-only API) rather than implying a screenshot is just pending.

### Removed (honestly, per your input)
- Case-study `_todo` markers for Coach Gideon, Cedarville, and Hope Assessment App — replaced with a note that no case study is planned since the specifics aren't remembered well enough to write one accurately.

### Performance
- Converted the 22 largest referenced images sitewide — backgrounds, profile photos, certificate logos, testimonial avatars, service images — from PNG/JPG to WebP, resized to sensible display widths. 6.7MB → 1.5MB (~78% smaller) across just these files.
- Also converted the 4 product screenshots (PLS Compress/QR/Snip/Crack) added last milestone to WebP for consistency.
- Every reference to these images across `data/*.json`, `css/*.css`, `_legacy/*.html`, and `templates/` was updated programmatically to match, using exact-path matching to avoid false-positive renames.

### Verification performed
- Full href/src integrity check across all 44 pages after every change in this pass — 0 broken links/images at each step, including CSS `url()` background-image references.
- Confirmed all 3 new project screenshots render on both listing and detail pages.
- `images/` folder: reduced overall footprint substantially; noted 3 genuinely unused images left untouched (no performance cost since browsers never fetch unreferenced files).

## [3.7.0] — Critical Fix: GitHub Pages Subpath — 2026-08-03

### Fixed — root cause of the site being fully broken in production
Every internal URL across the entire site (CSS, JS, images, and every internal nav/card/breadcrumb link) was built as root-absolute (`/css/style.css`, `/projects/`, etc.), which is only correct if a site is served from a domain root (`username.github.io/`). This site is a GitHub Pages **project site** — served from `peterlightspeed.github.io/portfolio/`, a subpath — so every one of those references was silently resolving one level too high and 404ing or failing to load. This explains, as one root cause: broken CSS (unstyled run-together tech badges), every broken image sitewide, and clicking internal nav links landing on the wrong URL entirely.

- Added a `basePath`, derived once from `site.baseUrl` in `build/build.js` (`new URL(site.baseUrl).pathname`) — single source of truth, can't drift out of sync with the real deployed URL.
- Added a `{{url}}` Handlebars helper that prefixes any site-relative path with `basePath`, and passes external `http(s)`/`mailto:`/`tel:` URLs through unchanged.
- Updated `{{asset}}` to use the same subpath-aware logic.
- Fixed all 54 hardcoded root-absolute paths across every template (found via automated scan, applied via a verified auto-fix script, then hand-verified) — css/js/images references, every internal nav/footer/breadcrumb link, every card and detail-page link, document downloads, and the redirect stubs written directly by `build.js`.
- Fixed several data-driven hrefs the initial scan couldn't catch because they come from JSON, not template literals: `community.json` activity links, `products.json`'s PLS Nexus → Talent Intelligence cross-link, timeline event links, product edition CTAs, and project live-demo links.
- Injected `window.SITE_BASE` into every page's `<head>` so the one static (non-templated) JS file that needs to know the subpath — `js/search.js`, for fetching `search-index.json` and building result links — resolves correctly too.
- **Found and fixed a naming collision my own fix introduced**: registering a helper called `url` broke the homepage's "Currently Building" cards, which have a data field also called `url` — `{{url}}` (bare) started calling the helper instead of reading the field. Fixed by using `{{url this.url}}` to disambiguate.
- **Found and fixed a second-order bug**: the first version of the `url` helper didn't guard against already-absolute external URLs the way `asset()` did, which would have broken `community.json`'s LinkedIn/YouTube/GitHub links the moment they were wrapped. Added the same `http(s)`/`mailto:`/`tel:` passthrough guard before wrapping any more data-driven hrefs.

### Also fixed this pass
- AOS fade-in animations could leave real content permanently invisible if the AOS CDN failed to load (no fallback existed). Added a guard around `AOS.init()` plus a timeout-based safety net that forces `[data-aos]` content visible regardless, in `templates/partials/scripts.hbs`.

### Verification performed
- Custom subpath-aware link/asset integrity checker (adjusted to strip `/portfolio` before checking against the local `dist/` layout) across all 44 generated pages: **0 broken references, 0 references still missing the required prefix** — up from 66+ broken/missing before this pass.
- Confirmed external links (social profiles, GitHub repos, live demo URLs) remain untouched and correct — not accidentally prefixed.
- Confirmed `window.SITE_BASE` is present and correctly valued on every page that loads `search.js`.

## [3.8.0] — Full Site Audit: Missing Scripts/Styles, New Lab Tool — 2026-08-04

### Fixed — major, previously-undiscovered bug
While doing a full pass of the whole site, found that **every legacy-extracted page (Contact, Labs, Sax, Sponsor, Demo) and every fully-migrated page with its own stylesheet (Resume, CV, About, Services, Certifications, Testimonials, Projects) had silently lost its page-specific CSS and/or JavaScript** during earlier migrations. The original pages' `<link>`/`<script>` tags lived in their own `<head>` or after their own `<footer>` — outside the `<main>`-to-footer range my extraction/generation ever looked at — so none of it carried forward automatically.

Practically, this meant: the contact form had no validation logic, every Labs tool (typing test, password generator, JSON formatter, color palette, snake game) was completely inert, the sax booking chatbot never loaded, the sponsor payment modal didn't work, and Resume/CV/About/Services/Certifications/Testimonials/Projects were all missing page-specific styling (e.g. `.resume-sheet`, `.cv-preview`, `.document-card`, `.timeline-panel` were defined only in stylesheets that were never being loaded).

- Extended the existing (but previously unused) `extraScripts`/`extraStyles` mechanism and wired the correct files into every affected page in `build/build.js`.
- Also restored the **sitewide floating chatbot** (`js/bot.js`) that was present on every page of the original site but had been dropped entirely during the Milestone 1 rebuild — confirmed it's fully self-contained (injects its own DOM, guards against double-init) and added it to the global script list in `templates/partials/scripts.hbs`, so it's back on every page at once.
- Found and fixed a real bug inside `js/projects.js` itself while wiring it up: it referenced a `#noResults` element that doesn't exist on the new template, which would have thrown a JavaScript error on every single filter-button click. Added proper null guards before loading it.

### Added — Algorithm Visualizer, moved from "Coming Soon" to actually live
Built the Sorting Algorithm Visualizer that Labs already advertised as "Coming Soon" — Bubble/Selection/Insertion/Quick Sort, animated bar comparisons and swaps, adjustable array size and speed, live comparison/swap counters. Vanilla JS, no dependencies, consistent with the rest of Labs. Removed it from the placeholder grid since it's real now.

### Fixed — a bug in my own fix
While inserting the visualizer's JavaScript, a `str_replace` accidentally deleted the Snake game's own IIFE closing (`})();`), which broke `labs.js`'s syntax entirely — every tool on the page would have failed silently the moment the file loaded. Caught via `node -c` syntax-checking (added as a standing step — see Verification below) before it ever reached a zip.

### Verification performed (a genuinely full pass this time)
- `node -c` syntax-checked **every JavaScript file in the project**, not just the ones touched this session.
- Subpath-aware href/src integrity check across all 44 generated pages — 0 broken, 0 missing `/portfolio` prefix.
- Confirmed, page by page, that every page's actual `<link>`/`<script>` output matches what it's supposed to load (spot-checked all 11 affected pages individually).
- Confirmed 0 unrendered Handlebars tokens, 0 images missing `alt`, sitemap/RSS/search-index all regenerate correctly (44 URLs, 63 search entries).
- Confirmed the new visualizer's HTML renders in the built `labs.html`.

## [3.9.0] — Interactive Hero Animation + Another Missing-CSS Fix — 2026-08-05

### Added
- **Interactive particle-network animation** on the homepage hero (`js/hero-network.js`) — nodes drift and connect with fading lines, and respond to the cursor (mouse or touch) with a warm accent color forming a live constellation effect. Pure canvas + vanilla JS, zero dependencies, GitHub Pages compatible. Respects `prefers-reduced-motion` (renders one static frame instead of animating), pauses via the Page Visibility API when the tab isn't active, debounced on resize, and the canvas is `aria-hidden` with `pointer-events: none` so it never interferes with screen readers or clicking hero buttons.

### Fixed — another instance of the missing-CSS bug class
While wiring up the new animation, found that **the homepage itself** had the same bug as the 11 pages fixed last milestone: `css/hero.css` (which defines `.hero-section`, `.hero-shape-bottom`, and the rest of the hero layout) was never being loaded. Wired it in. Also swept every remaining CSS file in the project and confirmed everything is now referenced from somewhere except `highlights.css`, which is genuinely unused by any current template (verified, not assumed) and was left as-is.

### Verification performed
- `node -c` syntax-checked every JS file in the project, including the new animation, before packaging.
- Confirmed the canvas element, `hero.css`, and `hero-network.js` all appear correctly in the built `index.html`, with correct `/portfolio` subpath prefixing.
- Full href/src integrity check across all 44 pages — 0 broken, 0 missing subpath prefix.
- Confirmed 0 unrendered template tokens, 0 images missing `alt`, sitemap (44 URLs)/RSS/search-index (63 entries) all regenerate correctly.
- Reviewed dark-mode CSS interaction with the new canvas — confirmed no visual conflict (white particles remain clearly visible against the dark-mode background variant).

### Known limitation, stated plainly
I don't have a real browser in this environment, so I can't visually confirm the animation's actual on-screen appearance or interaction feel — only that it's syntactically correct, wired in correctly, and every element/class it depends on resolves. Load the live site once deployed and tell me if the motion, colors, or interaction feel need tuning (particle count, connection distance, and cursor-influence radius are all single constants at the top of `js/hero-network.js`, easy to adjust).

## [3.10.0] — Bot Fixes, Smarter Chatbot, Contact Form, Products-in-Projects — 2026-08-06

### Fixed
- **Chatbot avatar was broken on every page except the homepage.** `js/bot.js` used a relative image path (`images/logos/peter-logo.png`), which resolves differently depending on how deeply nested the current page is — correct on `/portfolio/`, wrong everywhere else (e.g. `/portfolio/projects/some-project/`). Fixed using the same `SITE_BASE` mechanism already in place for `search.js`. Also guarded against a **stale cached avatar path** in `localStorage` from before this fix, so returning visitors don't keep the broken version forever.
- **Every internal link the chatbot ever generates was broken the same way** — the entire knowledge base writes links like `href='projects.html'`, which only resolve correctly from the site root. Fixed centrally, once, in `processMessageFormatting()` rather than hand-editing hundreds of links throughout the knowledge base — any relative internal link the bot outputs now gets corrected automatically before it's ever displayed.
- **Contact form showing an error after actually sending successfully** — diagnosed as a CORS mismatch between what's live on Cloudflare and what's in this repo (the Worker deploys separately from GitHub Pages; editing the file here doesn't push it live). The current source already has the correct origin whitelisted — **you need to redeploy `worker/contact-worker.js` to Cloudflare for this to take effect**, see `TODO.md`. In the meantime, made `contact.js` distinguish this specific failure mode from a genuine send failure, so the message shown is accurate either way instead of implying total failure.
- **6 products were marked `featured: true` but only 4 ever showed on the homepage** — a hardcoded `.slice(0, 4)` silently cut off SMB Data Sanitizer and BI Suite. Expanded to show all 6.

### Chatbot made smarter, per request
- Fixed factual errors that had gone stale: "PLS TechCompany" → "PLSTech" (site-wide elsewhere), wrong university, "virtual assistant" framing (badly outdated — now correctly describes backend/AI engineering work), an unverifiable "50+ projects" claim replaced with the same real numbers used elsewhere on the site.
- Rewrote the products/roadmap knowledge entries, which only knew about 2 old products, to cover all 8 current ones with accurate status and live demo links where they exist.
- **Added quick-reply buttons** — shown after the greeting (View Projects / See Products / My Skills / Hire Me) and automatically whenever the bot doesn't understand a message, so there's always an easy way forward instead of a dead end.

### Added — Products now visible from the Projects page too
Per request, `/projects/` now has a "Products" section at the top showing all 6 featured products, in addition to the dedicated `/products/` page — so a visitor browsing Projects doesn't miss the things that are actually shippable, working software.

### Verification performed (three full passes, as requested)
1. JS syntax-checked every file, full subpath-aware link/asset integrity across all 44 pages, 0 unrendered template tokens.
2. **Full clean reinstall** (`rm -rf node_modules && npm install`) followed by a full rebuild — this is what actually simulates GitHub Actions' fresh environment, not just a local rebuild reusing cached state.
3. Deep checks: confirmed the bot avatar and quick-reply code are present in the shipped `bot.js`, sitemap (44 URLs)/RSS/search-index (63 entries) all correct, 0 images missing `alt`.
- Also structurally scanned every generated page for the specific class of Bootstrap layout bug (`.col-*` used without a `.row` parent) that would cause misaligned containers — 0 found across the whole site.

## [3.11.0] — Splash Screen, Social Sidebar, New Experience — 2026-08-08

### Investigated: "splash screen not showing"
Searched the entire codebase — no splash screen implementation existed anywhere (every "splash" match was the word "Unsplash" in image URLs). Nothing to debug; built one fresh instead: a brief full-screen loading overlay (logo + spinner + tagline) that fades out once the page has loaded. Two safety rails so it can never misbehave: a minimum display time (~350ms, so it doesn't flash instantly and look glitchy on fast connections) and a hard maximum (2.5s, so it can never get stuck covering the site if something else hangs). Respects `prefers-reduced-motion`. Deliberately **not** added to the 404 page — a loading screen would only delay the "not found" message a visitor needs immediately there.

### Fixed: social media sidebar was missing sitewide
Found that `js/script.js` already had fully-working, guarded logic for a floating social sidebar (`#socialToggle`, `.social-sidebar`) — but the actual HTML markup was never carried into any of the new CMS templates during the original migration, so the toggle button simply didn't exist on any page. Rebuilt it as `templates/partials/social-sidebar.hbs`, driven by `data/site.json`'s socials list (not hardcoded) like everything else on the site, and added it to the shared layout so it's back on every page at once.

While rebuilding it, found **Facebook was missing from `site.json` entirely** — it was in the original hardcoded sidebar markup but never made it into the single source of truth. Added it, along with WhatsApp (previously only stored separately for the footer's contact section).

### Added — two new work experience entries
- **Senior AI & Web Developer** — PLSTech (self-founded), self-employed, Nigeria. Jul 2026 - Present.
- **Tech Educator** — Self-employed, YouTube & social media, Nigeria. Mar 2026 - Present.

Both feed `/resume.html` and `/timeline.html` automatically from the one entry in `data/experience.json`, reordered to reverse-chronological alongside the existing roles.

### Verification performed
- JS syntax-checked every file.
- Full href/src integrity check across all 44 pages — 0 broken, 0 missing subpath prefix.
- Confirmed the splash screen renders on the homepage and a nested inner page (different URL depths), correctly absent from 404, and `splash.js` loads.
- Confirmed the social sidebar (with the new Facebook link) renders on multiple pages at different depths.
- Confirmed both new experience entries render correctly on Resume and Timeline (the `&` in "Senior AI & Web Developer" is correctly HTML-escaped to `&amp;` by Handlebars — verified this wasn't a rendering failure, just proper escaping that my first grep check didn't account for).

## [3.12.0] — Card Correctness Audit — 2026-08-09

### Updated per clarification
- Work experience title changed to "Founder & Senior AI & Web Developer" at PLSTech (simplified from "PLSTech (Self-Founded)").
- Tech Educator role broadened from "YouTube & Social Media" to the full platform list: YouTube, LinkedIn, TikTok, Instagram, X.

### Fixed — real bugs found during a full card-by-card audit
Checked every card component (`project-card`, `product-card`, `testimonial-card`, `cert-card`) against its actual data for empty fields, and checked every grid these cards sit in for alignment issues:

- **Significant alignment bug**: 6 of your 8 products have exactly 1 edition, but the edition grid always sized each edition card as 1/3-width (`col-md-4`) regardless of how many there were — meaning those 6 products' single edition card sat in the left third of the row with two-thirds of the row empty next to it, on both the Products page and every individual product's own page. Added a `colFor` helper that sizes the column based on the actual edition count (1 edition → full width, 2 → half each, 3 → thirds), so this is now correct everywhere it's used and will stay correct automatically if you ever add a 2nd edition to any of these products.
- **Resume was missing the company/platform name entirely for all work experience** — the Education section correctly showed "institution · period," but Work Experience only ever showed the job title, period, and description, silently dropping *where* the work was done. This affected every job on your resume, not just the two new ones. Fixed, with matching styling.
- **Empty tag row on the Trade Test certificate card** — it has no `skills` array (accurately, since none were provided), but the card unconditionally rendered its skills-tag container anyway, leaving a small empty gap. Now hidden when there are no skills, matching how every other optional field on that card already behaves.
- Audited every published project, product, certificate, and testimonial for missing/empty required-looking fields (category, status, tech stack, description, icon, edition features, CTA labels) — found nothing else broken.

### Verification performed
- Full href/src integrity check across all 44 pages — 0 broken, 0 missing subpath prefix.
- Confirmed the `colFor` fix renders `col-12` correctly on all 6 single-edition products and unchanged `col-md-4` on the two 3-edition products.
- Confirmed both updated experience entries and the newly-visible institution names render correctly on the resume.
- JS syntax-checked every file; 0 unrendered template tokens.

## [3.13.0] — Self-Hosted Icons, Contact Form Diagnostics — 2026-08-10

### Fixed — navbar icons not rendering
Bootstrap Icons was being loaded from `cdn.jsdelivr.net`. If that CDN is slow, blocked, or unreachable on a visitor's network, every icon sitewide silently fails — most noticeable in the navbar since it's always visible. Same class of risk as the AOS animation library fixed in an earlier milestone. Fixed by **self-hosting bootstrap-icons entirely**: added it as a real npm dependency (`bootstrap-icons@1.10.5`), the build now copies the font files and CSS into `public/vendor/bootstrap-icons/` on every build, and every page (including the standalone 404 page) references the local copy instead of the CDN. Verified this survives a completely fresh `npm install` from scratch, matching what GitHub Actions actually does.

### Contact form — investigated further, root cause confirmed, self-diagnostic added
Re-verified every piece of the code path end to end: the form's native `action` attribute and the JS `fetch()` URL are identical, `e.preventDefault()` correctly fires before the fetch runs (so there's no race between a native form submission and the JS one), and the Worker's `ALLOWED_ORIGINS` list in this repo already correctly includes `https://peterlightspeed.github.io`. Everything in the *source code* is correct. The problem is specifically that **this source code and what's actually deployed to Cloudflare are two different things** — editing the file here has never updated the live Worker, since Cloudflare Workers deploy separately from GitHub Pages.

- Added a **GET-based self-diagnostic endpoint** to `worker/contact-worker.js` — visiting the Worker's URL directly in a browser now returns a small JSON status page showing whether it's reachable and exactly which origins it currently allows, so this can be verified directly without needing DevTools or guessing.
- Rewrote the fix instructions in `TODO.md` as a simple dashboard copy-paste-and-save process — no command line or software installation required, since the previous instructions assumed comfort with `wrangler` that may not apply.

### Verification performed
- **Full clean reinstall from scratch** (`rm -rf node_modules && npm install`) followed by a full rebuild, specifically to confirm the new `bootstrap-icons` dependency installs and wires correctly under the same conditions GitHub Actions uses — not just locally with cached state.
- Confirmed self-hosted icon CSS/fonts are referenced on every single generated page, with zero remaining CDN references anywhere in the built output.
- Confirmed the two pages that don't reference the icon CSS are the intentional 0-second redirect stubs for the old flat `projects.html`/`products.html` URLs (they render nothing, by design) — not a gap.
- Syntax-checked every JS file plus the Worker itself (as an ES module, its actual runtime format).
- Full href/src integrity check across all 44 pages — 0 broken, 0 missing subpath prefix.
