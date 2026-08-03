# Deployment Guide

## Local preview

```bash
npm install        # first time only
npm run build       # generates /dist
npm run serve       # serves /dist at http://localhost:4000
# or both in one go:
npm run dev
```

## Automatic deployment (recommended — already set up)

`.github/workflows/build.yml` builds and deploys automatically on every push to `main`:

1. Validates all content
2. Best-effort refreshes GitHub repo metadata (stars/language)
3. Builds the site into `/dist`
4. Publishes `/dist` to GitHub Pages via `actions/deploy-pages`

**One-time setup in the GitHub repo:** Settings → Pages → Source → set to **"GitHub Actions"** (not "Deploy from a branch"). After that, `git push` is the entire deployment workflow — same as before, the build step just now happens automatically instead of you needing to hand-write HTML.

The workflow also runs weekly (Monday 6am UTC) purely to refresh GitHub stars/language even if you haven't pushed anything.

## Manual deployment (fallback)

If you ever need to deploy without Actions:
```bash
npm run build
# commit the contents of /dist to whatever branch/path your Pages source points to
```

## Custom domain

If you add a custom domain in GitHub Pages settings, also add a `CNAME` file with that domain to `public/` (it gets copied into `/dist` automatically by the build) — GitHub will otherwise overwrite/remove it on each deploy if it isn't part of the published output.

## Environment variables / secrets

- `GITHUB_TOKEN` — used by `build/lib/github.js` to raise the GitHub API rate limit when fetching repo stars/language. The default `secrets.GITHUB_TOKEN` GitHub Actions provides automatically is sufficient; no manual secret setup needed.
