# Project System Guide

How individual project pages work and what makes a good entry.

## Every project page is generated from two sources

1. **`data/projects.json`** — structured facts (title, tech stack, links, status...). Required.
2. **`content/projects/<slug>.md`** — an optional deep-dive case study, rendered under "Engineering Case Study" at the bottom of the page. Skip it (empty file) for smaller/older projects; write it for the ones you want to impress an employer with.

## What makes a strong entry vs. a minimal one

**Minimal** (fine for older/smaller work): `title`, `shortDescription`, `techStack`, `tags`, `draft: false`. Renders a clean card + a simple page. This is what most of the 15 migrated projects currently have — accurately, since that's what existed on the site before.

**Case-study quality** (what to aim for on your best 3–5 projects, e.g. PLS Nexus / PLS Nexus Talent Intelligence): also fill in `problem`, `solution`, `architecture`, `challenges`, `lessonsLearned`, `futureImprovements`, and write the matching `content/projects/<slug>.md` with a real Research/Architecture/Implementation/Tradeoffs walkthrough. This is the content that actually differentiates a portfolio for employers/investors — see `CMS_GUIDE.md` → "Case studies" for the mechanics.

## Featured vs. not

`"featured": true` puts a project on the homepage (max 6 shown, most-recently-added-first within `data/projects.json`'s array order — reorder the array to control which show). Keep this to your strongest, most current 4–6 projects; everything else is still fully browsable at `/projects/`.

## Draft projects

`"draft": true` = scaffolded but not public yet. The seven new projects you mentioned (PLS QR, PLS Compress, DataFlow AI, Hope Assessment App, Faith Centre Global, Coach Gideon, Cedarville) are already in `data/projects.json` this way, with matching empty case-study files in `content/projects/`. Fill in real details, flip `draft` to `false`, rebuild.

## Categories & tags

`category` (singular) powers the filter buttons on `/projects/` — keep this to one of a small, consistent set (`backend`, `ai`, `web`, `design`, `content`...). `tags` (array) is more free-form and feeds search — add as many as are genuinely relevant.
