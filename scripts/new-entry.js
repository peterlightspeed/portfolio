#!/usr/bin/env node
/**
 * new-entry.js — scaffolds a blank entry in the right /data/*.json file
 * so adding new content never means hand-writing JSON from memory.
 *
 * Usage:
 *   npm run new:project   -- "My New Project"
 *   npm run new:product   -- "My New Product"
 *   npm run new:article   -- "My New Article"
 *   npm run new:certificate -- "My New Certificate"
 *   npm run new:talk      -- "My New Talk"
 *
 * Appends a draft:true entry with every required field present (empty)
 * so `npm run validate` still passes. Edit the new entry in the JSON
 * file, flip draft to false, and run `npm run build`.
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const kind = process.argv[2];
const title = process.argv.slice(3).join(" ") || "Untitled";

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const templates = {
  project: (title, slug) => ({
    slug,
    title,
    shortDescription: "",
    problem: "",
    solution: "",
    architecture: "",
    techStack: [],
    features: [],
    challenges: "",
    lessonsLearned: "",
    futureImprovements: "",
    links: { github: "", liveDemo: "", video: "" },
    image: "",
    screenshots: [],
    status: "",
    date: "",
    category: "",
    tags: [],
    featured: false,
    caseStudy: false,
    draft: true,
  }),
  product: (title, slug) => ({
    slug,
    title,
    badge: "",
    icon: "bi-box-seam",
    shortDescription: "",
    techStack: [],
    editions: [],
    featured: false,
    draft: true,
  }),
  article: (title, slug) => ({
    slug,
    title,
    summary: "",
    date: new Date().toISOString().slice(0, 10),
    tags: [],
    externalUrl: "",
    contentFile: "",
    draft: true,
  }),
  certificate: (title, slug) => ({
    slug,
    title,
    issuer: "",
    date: "",
    dateLabel: "",
    logo: "",
    description: "",
    skills: [],
    credentialUrl: "",
    ctaLabel: "View Certificate",
    draft: true,
  }),
  talk: (title, slug) => ({
    slug,
    title,
    event: "",
    date: "",
    description: "",
    link: "",
    draft: true,
  }),
};

const files = {
  project: "projects.json",
  product: "products.json",
  article: "articles.json",
  certificate: "certificates.json",
  talk: "talks.json",
};

if (!templates[kind]) {
  console.error(`Unknown kind "${kind}". Use one of: ${Object.keys(templates).join(", ")}`);
  process.exit(1);
}

const filePath = path.join(DATA_DIR, files[kind]);
const items = JSON.parse(fs.readFileSync(filePath, "utf8"));

let slug = slugify(title);
let suffix = 2;
while (items.some((i) => i.slug === slug)) {
  slug = `${slugify(title)}-${suffix++}`;
}

const entry = templates[kind](title, slug);
items.push(entry);
fs.writeFileSync(filePath, JSON.stringify(items, null, 2) + "\n");

console.log(`✓ Added "${title}" (slug: ${slug}) to data/${files[kind]} as a draft.`);
console.log(`  Edit that entry, set "draft": false when ready, then run: npm run build`);

if (kind === "project") {
  const mdPath = path.join(__dirname, "..", "content", "projects", `${slug}.md`);
  if (!fs.existsSync(mdPath)) {
    fs.writeFileSync(
      mdPath,
      `<!-- Optional engineering case study for "${title}". Leave empty to skip; ` +
        `fill in and it renders automatically at the bottom of the project's page. -->\n\n` +
        `## Research\n\n## Architecture\n\n## Implementation\n\n## Challenges\n\n## Tradeoffs\n\n## Lessons\n`
    );
    console.log(`  Also created content/projects/${slug}.md for an optional case study.`);
  }
}
