/**
 * github.js — optional enrichment step. Scans data/projects.json and
 * data/products.json for GitHub repo URLs, fetches stars/language/
 * last-updated from the GitHub REST API, and caches the result in
 * data/.cache/github-meta.json.
 *
 * This is intentionally NOT called from the browser (no client-side API
 * calls, no rate-limit risk for site visitors, no exposed token needed
 * for public repos). Run it manually (`npm run fetch:github`) or on a
 * schedule in CI (see .github/workflows/build.yml) — build.js reads
 * whatever is in the cache file and simply skips enrichment if the
 * cache doesn't exist yet or a specific repo lookup fails.
 *
 * No token is required for public-repo reads at GitHub's unauthenticated
 * rate limit (60 req/hour). Set GITHUB_TOKEN in the environment (e.g. a
 * GitHub Actions secret) to raise that limit if the project list grows.
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const CACHE_FILE = path.join(DATA_DIR, ".cache", "github-meta.json");

function extractRepoPath(url) {
  if (!url) return null;
  const m = url.match(/github\.com\/([^\/]+)\/([^\/#?]+)/);
  if (!m) return null;
  return `${m[1]}/${m[2].replace(/\.git$/, "")}`;
}

async function fetchRepo(repoPath) {
  const headers = { "User-Agent": "portfolio-build-script" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${repoPath}`, { headers });
  if (!res.ok) throw new Error(`${repoPath}: ${res.status}`);
  const json = await res.json();
  return {
    stars: json.stargazers_count,
    language: json.language,
    updatedAt: json.pushed_at,
    openIssues: json.open_issues_count,
    url: json.html_url,
  };
}

async function run() {
  const projects = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "projects.json"), "utf8"));
  const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "products.json"), "utf8"));

  const repoPaths = new Set();
  [...projects, ...products].forEach((item) => {
    const url = item.links && item.links.github;
    const repo = extractRepoPath(url);
    if (repo) repoPaths.add(repo);
    (item.editions || []).forEach((ed) => {
      const r = extractRepoPath(ed.cta && ed.cta.href);
      if (r) repoPaths.add(r);
    });
  });

  const results = {};
  for (const repoPath of repoPaths) {
    try {
      results[repoPath] = await fetchRepo(repoPath);
      console.log(`  ✓ ${repoPath}`);
    } catch (e) {
      console.warn(`  ✗ ${repoPath}: ${e.message} (skipping, will keep any previous cached value)`);
    }
  }

  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
  const previous = fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) : {};
  const merged = { ...previous, ...results, fetchedAt: new Date().toISOString() };
  fs.writeFileSync(CACHE_FILE, JSON.stringify(merged, null, 2));
  console.log(`GitHub metadata cached for ${Object.keys(results).length} repo(s) -> ${CACHE_FILE}`);
}

function readCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    return {};
  }
}

if (require.main === module) {
  run().catch((e) => {
    console.error("GitHub metadata fetch failed:", e.message);
    process.exit(0); // never fail the build over this — it's an enrichment step
  });
}

module.exports = { readCache, extractRepoPath };
