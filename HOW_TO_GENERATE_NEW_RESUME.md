# How To Generate a New Role-Specific Resume (and Cover Letter)

**Resumes, cover letters and homepage career modes all come from `data/career.json`.** (The old `data/resume-profiles.json` and `data/cover-letter.json` no longer exist — they were merged into `career.json`.)

Adding a role = adding **one entry** to `roles` in `data/career.json`. Build, and you get:

- `/resume/<slug>/` — the resume (use **Print / Save as PDF**)
- `/cover-letters/<slug>/` — the cover letter draft (replace the `[Bracketed]` tokens)
- a homepage career mode + entry in the "View this portfolio as…" dropdown

See `PERSONAL_GUIDE.md` §9 for the full field list and an example. Key rules:

1. A role only **references** other data: experience by `id`, projects/products/certificates by `slug`, skills by name. Nothing is copied.
2. Every reference is checked at build time. A typo, a `draft: true` target, or a skill not backed by `skills.json` / a tech stack / a job's technologies **fails the build with a clear message**.
3. Use `"extends": "<other-role-slug>"` to create a variant (only store what differs).
4. `"draft": true` hides a role (used for Go Developer until a real Go project exists).
5. `letter.highlightSlug` must be one of the role's own `projectSlugs` / `productSlugs`.
6. Shared cover-letter wording (greeting, sign-off, `[Company Name]` tokens) is in `career.json → coverLetter`.
7. Cover-letter pages are `noindex` and excluded from the sitemap by design.
8. Do not add a Machine Learning Engineer role unless real ML experience exists.
