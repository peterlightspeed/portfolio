# PERSONAL GUIDE — Peter's Portfolio, explained for future Peter

You built a website that is driven by data. **You almost never edit HTML.** You edit small JSON files in `data/`, rebuild, and push. This guide assumes you've forgotten everything.

---

## 1. The mental model (read this first)

```
data/*.json  ──►  npm run build  ──►  dist/  ──►  GitHub Pages (live site)
 (your facts)      (build/build.js)   (generated)
```

- `data/` = **your facts** (jobs, projects, skills…). This is what you edit.
- `templates/` = page layouts. Only touch for design changes.
- `dist/` = generated output. **Never edit it.** It's rebuilt every time.
- **`data/career.json` = the control panel.** It decides which resume, cover letter and homepage "mode" exists, and what each one highlights. It only *points at* other files (by slug/id) — it never copies content. Fix a typo in a project once and every resume, letter and mode updates.
- If you point at something that doesn't exist (typo, or still `draft: true`), **the build stops and tells you exactly what's wrong.** That's a feature, not a bug.

## 2. Daily commands

```bash
npm install          # once, or after pulling
npm run validate     # checks all JSON files
npm run build        # builds dist/  (validates first)
npm run serve        # preview locally (see package.json)
```

Deploy = `git add . && git commit -m "..." && git push`. GitHub Actions builds and publishes automatically.

## 3. Where does each thing live?

| I want to add/change… | File | Notes |
|---|---|---|
| A job / promotion / education | `data/experience.json` | Give it a unique `"id"` |
| A certificate | `data/certificates.json` | |
| A project (code I built) | `data/projects.json` | |
| A product (something people use/buy) | `data/products.json` | |
| A skill | `data/skills.json` | Under the right group |
| A talk | `data/talks.json` | |
| Community activity / event | `data/community.json` | |
| Award / achievement | `data/awards.json` | |
| Testimonial | `data/testimonials.json` | |
| Blog article | `data/articles.json` | |
| Service I offer | `data/services.json` | |
| Site name, links, nav, analytics, booking | `data/site.json` | |
| **Resumes, cover letters, homepage modes, audiences, career goals** | **`data/career.json`** | |

Never hand-edit HTML for any of the above.

## 4. Add experience (a new job or a promotion)

Open `data/experience.json`. Add an entry at the **top** (newest first):

```json
{
  "id": "acme-senior-backend",
  "type": "work",
  "title": "Senior Backend Engineer",
  "institution": "Acme Ltd",
  "period": "Jan 2028 - Present",
  "employmentType": "Full-time",
  "icon": "bi-briefcase-fill",
  "color": "primary",
  "description": "One paragraph on what the role is.",
  "responsibilities": ["…", "…"],
  "technologies": ["Python", "FastAPI"],
  "impact": ["A real, true outcome"],
  "skillsGained": ["…"],
  "projectsCompleted": [],
  "links": [],
  "draft": false
}
```

Rules: `id` never changes once created (career.json uses it). `type` is `work` or `education`. **Only write true things.** Unsure? Set `"draft": true` — it stays hidden until you flip it.

**Promotion:** add a *new* entry (new id) for the new title, and end the old one's `period` (e.g. `"Jan 2026 - Dec 2027"`).
**Job ended:** change `Present` to the end date. Then update `career.json` roles that list that id in `experienceOrder`.
Then open `career.json` and add the new id to the roles that should show it (see §9).

## 5. Add a certificate

`data/certificates.json` → add an entry (copy an existing one for the exact fields: `slug, title, issuer, date, logo, description, skills, credentialUrl, draft`). Then add its `slug` to `certificateSlugs` of the roles that should list it in `career.json`. Put the image in `images/` and reference it in `logo`. Never add a certificate you didn't earn (Oasis Infobyte is deliberately *not* listed).

## 6. Add a project

`data/projects.json` → copy a full existing entry, change `slug` (lowercase-hyphens, unique) and fill in only what's true. Empty strings are fine for things you don't know. Set `"featured": true` to show on the homepage by default. It automatically gets its own page at `/projects/<slug>/`, appears in the sitemap and search, and pulls GitHub stars/language/updated from the `links.github` URL at build time. To put it on a resume, add its slug to a role's `projectSlugs` in `career.json`.

## 7. Add a product

Same as a project but in `data/products.json` (needs `editions`). Products have pricing/edition status, roadmap etc. Reference in `career.json` via `productSlugs`.

## 8. Add a talk / community event / achievement / testimonial / blog / skill / course

- Talk → `data/talks.json`
- Community activity → `data/community.json` (`activities` array)
- Award/achievement → `data/awards.json`
- Testimonial → `data/testimonials.json`
- Blog article → `data/articles.json` (long text lives in `content/` if the schema asks for it)
- Skill → `data/skills.json`, put it in the right `core` group's `items`. A skill must exist here (or in a project's `techStack` / a job's `technologies`) before a resume may list it — this stops resumes from claiming skills you can't back up.
- Course / learning goal → `data/skills.json` → `learning` and `roadmap`.

Copy an existing entry in each file to get the field names right; `npm run validate` will tell you if you missed one.

## 9. `career.json` — resumes, cover letters, modes

Top-level keys: `goals`, `targetIndustries`, `preferredRoles` (order of the resume hub), `defaultRole`, `summaryTemplates`, `resumeRules`, `coverLetter` (shared letter wording), `roles`, `audiences`.

**A role** (one entry in `roles`) creates ALL of these automatically:
1. a resume at `/resume/<slug>/`
2. a cover letter at `/cover-letters/<slug>/`
3. a homepage "mode" (headline, projects, skills, experience order, resume link)

```json
{
  "slug": "backend-engineer",
  "label": "Backend Engineer",
  "roleTag": "Backend Engineer | Python • FastAPI • PostgreSQL",
  "audience": "Who this version is for.",
  "summary": "Tailored summary. May use {{currentRoles}}, {{productCount}}, {{projectCount}}.",
  "hero": { "headline": "Optional homepage headline", "subline": "Optional homepage sentence" },
  "featuredSkillGroups": ["Backend", "AI & LLMs"],
  "featuredSkills": ["Python", "FastAPI"],
  "experienceOrder": ["cto-moi-doctar", "founder-plstech"],
  "projectSlugs": ["pls-nexus-talent-intelligence"],
  "productSlugs": ["pls-nexus"],
  "certificateSlugs": ["techcrush-ai-bootcamp"],
  "ctaLabel": "View backend projects",
  "ctaHref": "/projects/",
  "letter": { "openingHook": "…", "highlightSlug": "pls-nexus-talent-intelligence", "closingNote": "…" },
  "draft": false
}
```

- **Order = importance.** The order of `projectSlugs`, `experienceOrder`, `featuredSkillGroups` is the order shown.
- **Variants without copying:** `"extends": "presales-engineer"` makes a role inherit everything and override only what differs (Solutions Engineer, IT Engineer and Cybersecurity work this way).
- **Hold back a role:** `"draft": true` (used for Go Developer until a real Go project exists).
- `letter.highlightSlug` must be one of that role's own project/product slugs.
- **Audiences** (Backend Recruiter, Startup Founder, Client, Open Source Contributor, Cybersecurity Employer) point at a role and add a homepage section order + a custom CTA. Add one = add one entry in `audiences`.

**Generating a new resume:** add a role (above), build, open `/resume/<slug>/`, click **Print / Save as PDF**.
**Generating a cover letter:** open `/cover-letters/<slug>/`, replace the `[Bracketed]` tokens (company, role, name, date), **Copy text** or Print. Shared wording lives in `career.json → coverLetter`. These pages are `noindex` and not in the sitemap on purpose.

**Career modes:** on the homepage the "View this portfolio as…" dropdown switches hero text, CTA, resume link, project/product order (and skill/experience order on the About page). The choice is remembered. Force one with `/?mode=ai-engineer` or `/?as=client`. Without JavaScript the normal default page is shown (good for SEO).

**Honesty rules you set:** Machine Learning Engineer is *not* offered (add a role only after real ML experience exists). Solutions Engineer is presented as a variant of Presales Engineer. The Oasis Infobyte internship is shown as "Completed — Certificate Not Claimed."

## 10. SEO

- Site name, description, socials, `baseUrl`: `data/site.json`.
- Every page automatically gets title, meta description, canonical URL, Open Graph, Twitter card, breadcrumbs and JSON-LD; sitemap, RSS and robots are generated.
- Per-project SEO comes from its `title`, `shortDescription`, `tags`, `image`. Write good short descriptions.
- After changing `baseUrl`, rebuild. See `SEO_GUIDE.md` for more.

## 11. Analytics (GoatCounter)

1. Create a free site at goatcounter.com. Your "code" is the part before `.goatcounter.com`.
2. In `data/site.json → analytics.goatcounter.code`, paste it. Rebuild, push.
3. Until the code is filled in, **no tracking code is shipped at all.**
4. Switch provider later by changing `analytics.provider` (`goatcounter` | `plausible` | `none`). New provider = one small adapter in `js/analytics.js`.
5. What you'll see: page views (project/product popularity = views of their pages), resume prints, cover-letter copies, contact/booking clicks (elements with `data-track="…"`), contact form submits. Do Not Track is respected.

## 12. Contact channels

Calendly, YouTube, WhatsApp community, X, GitHub etc. appear in "More Ways to Connect" on the Contact page. Edit `data/site.json → booking`, `whatsappCommunity`, `socials`, and the list `contactChannels`.

## 13. Deploy

Push to `main` → GitHub Actions (`.github/workflows/build.yml`) builds and publishes. One-time: GitHub repo → Settings → Pages → Source = **GitHub Actions**. See `DEPLOYMENT_GUIDE.md`.

## 14. Backup

Your whole career lives in `data/`, `content/`, `images/`, `documents/`. Git is the backup: keep the GitHub repo, and occasionally copy the folder (or `git clone --mirror`) to a drive/cloud. Local-only files (TODO.md, AI_HANDOFF.md, notes, `.env`) are **not** in Git — back those up yourself.

## 15. Restore / move to a new computer

```bash
git clone https://github.com/peterlightspeed/portfolio.git
cd portfolio && npm install && npm run build
```
Then restore your local-only files (TODO.md, etc.) from your own backup. To roll back a bad change: `git log`, then `git revert <commit>`.

## 16. Migrate (new domain, new repo, new host)

- New domain/host: change `baseUrl` in `data/site.json`, rebuild.
- Everything is static HTML in `dist/`, so it works on Netlify, Cloudflare Pages, or any host: publish the `dist/` folder.
- Repo renamed? The base path comes from `baseUrl`, so just update it.

## 17. Maintain (monthly / yearly)

- Monthly: update `experience.json` if anything changed, add new projects/certificates, re-run `npm run build`, push.
- New job: §4, then update `career.json` (`experienceOrder`, summaries, `{{currentRoles}}` fills automatically).
- Yearly: `npm outdated`, update dependencies, run the full check below.

**Full check before pushing:** `npm run validate && npm run build`, open the site locally, click the resume hub and one cover letter.

## 18. If something breaks

| Symptom | Fix |
|---|---|
| Build error "no published experience entry with id …" | Typo in `career.json`, or that entry is `draft: true`, or missing `"id"`. |
| Build error "featured skill … isn't in skills.json…" | Add the skill to `data/skills.json` first (only if true), or remove it from the role. |
| Build error about a slug | Typo, or the project/product/cert is `draft: true`. |
| "invalid JSON" | Missing/extra comma or quote. Paste the file into jsonlint.com. |
| Page looks stale | Hard refresh; confirm the Action finished (repo → Actions). |
| Analytics silent | `analytics.goatcounter.code` is empty. |

## 19. Golden rules

1. Only true facts. Unsure → `draft: true`.
2. Fix data in ONE place; never copy content between files.
3. Never edit `dist/`.
4. Validate before you push.
