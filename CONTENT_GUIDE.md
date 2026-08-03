# Content Guide

Field-by-field reference for editing `/data`. See `build/schemas.js` for the machine-readable version of this same contract (that's what `npm run validate` actually checks against).

## data/projects.json

| Field | Required | Notes |
|---|---|---|
| `slug` | ✅ | URL-safe, unique. Becomes `/projects/<slug>/`. Never change once published — it breaks the URL and any links to it. |
| `title` | ✅ | Display name. |
| `shortDescription` | ✅ | 1–2 sentences. Used on cards, search, and meta description if no override. |
| `problem` / `solution` / `architecture` | optional | Prose paragraphs for the detail page. Leave `""` to hide that section. |
| `techStack` | ✅ (array) | Renders as badges. |
| `features` | optional (array) | Renders as a bullet list if present. |
| `challenges` / `lessonsLearned` / `futureImprovements` | optional | Prose, same hide-if-empty behavior. |
| `links.github` / `links.liveDemo` / `links.video` | optional | Leave `""` to hide that button. |
| `image` | optional | Local path (e.g. `images/projects/foo.png`) or a full `https://` URL — both work. Leave empty for a placeholder icon. |
| `status` | optional | Free text badge, e.g. `"In Progress"`, `"Completed"`. |
| `date` | optional | `YYYY-MM` or `YYYY-MM-DD`. Drives sort order on `/timeline.html`. |
| `category` | optional | Powers the filter buttons on `/projects/`. |
| `tags` | ✅ (array) | Used by search. |
| `featured` | optional (bool) | Featured projects appear on the homepage. |
| `caseStudy` | optional (bool) | Informational flag; the actual case study content comes from `content/projects/<slug>.md` regardless of this flag. |
| `draft` | ✅ (bool) | `true` = hidden from all public output but still validated. |

## data/products.json

Products use an `editions` array — each product typically ships Community / Pro / Web tiers:

```json
"editions": [
  {
    "name": "Community",
    "tier": "community",
    "features": ["...", "..."],
    "status": "available" | "coming-soon",
    "statusLabel": "Available Now",
    "cta": { "label": "View on GitHub", "href": "https://...", "icon": "bi-github" }
  }
]
```
Leave `cta.href` empty (with `status: "coming-soon"`) to render a disabled button instead of a link.

## data/certificates.json, data/testimonials.json, data/experience.json

Each entry follows the same pattern: a `slug` (certificates/testimonials only), the display fields, and a `draft` boolean. Testimonials use a `rating` number (supports halves, e.g. `4.5`) rendered as stars.

## data/skills.json

Two groups under `core` (Backend / Frontend & Tools today — add more groups freely), a `learning` object with a flat `items` list (badges) and a `roadmap` (grouped by category), and `tools` for the icon strip. `softSkillsIntro` is one paragraph of prose.

## data/site.json

The single source for the nav (`primaryNav`, `moreNav`), footer (`footerServices`), all social links (`socials`), and site-wide facts (`name`, `tagline`, `shortBio`, `email`, `location`, `stats`). Every template reads from here — there is no second copy anywhere.

## data/services.json

One object (not a slug-keyed array — this page isn't a "collection" the way projects/products are) holding every section of `/services.html`: `hero`, `mentorship`, `pricingPackages` (array), `serviceGrid` (array), `aiServiceGrid` (array), `whyChooseMe` (array), `faq` (array), `cta`. Add a new service by pushing a new object into `serviceGrid` or `aiServiceGrid` with the same shape as its neighbors — no template changes needed.

## Products vs. Projects — the taxonomy

Two separate collections, not a flag on one collection:

- **`data/products.json`** — things people can actually use: PLS Nexus, DataFlow AI, PLS QR, PLS Compress, PLS Snip, PLS Crack, the SMB Data Sanitizer, and the BI Suite. Every entry has an `editions` array (even flagship/in-development ones get a single-entry "Platform" edition describing real current status — never a fabricated tier).
- **`data/projects.json`** — engineering work that isn't shipped as a standalone product. Each entry has a `workType` field: `"client"` (built for a real client — Faith Centre Global, Cedarville, Coach Gideon, Hope Assessment App, Lightspeed Hospital Template), `"open-source"` (public, reusable repos — PeterLightspeed Projects, the AI Cover Letter Generator, this portfolio itself), or `"labs"` (smaller practice/demo pieces). The `/projects/` page groups automatically by `workType` — add a new client project with `"workType": "client"` and it appears under "Client Work" with zero template changes.

## data/awards.json

Leadership/achievement entries with a `status` field for anything not yet resolved (e.g. `"Application Submitted (Pending Outcome)"`) — never state or imply an outcome that hasn't happened. Rendered on the About page under "Leadership & Achievements" and folded into `/timeline.html` automatically.

## data/site.json — metrics & Currently Building

`site.metrics` is the array behind the homepage's Portfolio Metrics section (icon/value/label triples) — reorder, add, or edit any entry and the section updates, no template change needed. `site.currentlyBuilding` is a list of slugs (looked up against both `products.json` and `projects.json`) that drives the homepage's "Currently Building" highlight section — add or remove a slug there to change what's featured.

## data/now.json, data/community.json, data/roadmap.json

Free-form but structured — open any of these and the shape is self-explanatory; each array item maps directly to one card/row on its page.

## content/*.md

Long-form prose that doesn't belong in JSON:
- `content/about-story.md` — the "My Journey" narrative on `/about.html`.
- `content/projects/<slug>.md` — optional case study per project, matched by filename to the project's `slug`.

Plain Markdown (headings, bold, lists, links, code blocks) — rendered with [marked](https://github.com/markedjs/marked) at build time.
