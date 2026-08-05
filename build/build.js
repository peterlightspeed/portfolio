#!/usr/bin/env node
/**
 * build.js — the entire site generator.
 *
 * Run: `npm run build` (outputs to /dist)
 *
 * What it does, in order:
 *   1. Validates every /data/*.json file against build/schemas.js
 *   2. Loads all content (build/lib/data.js)
 *   3. Registers Handlebars partials/components + helpers
 *   4. Renders every data-driven page (home, projects, products,
 *      certifications, testimonials, about, timeline, now, community)
 *      plus one detail page per published project/product
 *   5. Copies legacy static pages (contact/resume/cv/services/labs/
 *      sax/sponsor/demo/404) through unchanged — see MIGRATION_STATUS.md
 *   6. Copies static assets (css/js/images/public/documents)
 *   7. Writes sitemap.xml, rss.xml, and public/search-index.json from
 *      whatever pages were actually generated in step 4 — never by hand
 *
 * Add a project/product/certificate/testimonial/experience entry to its
 * JSON file and re-run this script: its card, its detail page (where
 * applicable), its sitemap entry, its search-index entry, and its RSS
 * entry (for articles) all appear with zero other changes.
 */
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const { marked } = require("marked");

const { validateAll } = require("./lib/validate");
const { loadAll } = require("./lib/data");
const helpers = require("./lib/helpers");
const { buildMeta, softwareApplicationSchema } = require("./lib/seo");
const { writeSitemap } = require("./lib/sitemap");
const { writeRss } = require("./lib/rss");
const { writeSearchIndex } = require("./lib/search-index");
const { readCache: readGithubCache } = require("./lib/github");

const ROOT = path.join(__dirname, "..");
const TEMPLATES = path.join(ROOT, "templates");
const OUT_DIR = path.join(ROOT, "dist");
const CONTENT_DIR = path.join(ROOT, "content");

// ---------------------------------------------------------------------
// 1. Validate content before touching the filesystem
// ---------------------------------------------------------------------
console.log("→ Validating content...");
validateAll(); // exits process on failure
console.log("✓ Content valid.\n");

// ---------------------------------------------------------------------
// 2. Load data
// ---------------------------------------------------------------------
const data = loadAll();
const githubMeta = readGithubCache();

// ---------------------------------------------------------------------
// 3. Handlebars setup
// ---------------------------------------------------------------------
// GitHub Pages "project sites" (repo name != <user>.github.io) are served
// from a subpath, e.g. https://peterlightspeed.github.io/portfolio/ — every
// root-relative URL in the whole site (css/js/images, internal nav links)
// needs that "/portfolio" prefix, or it silently resolves to the domain
// root instead and 404s/breaks. basePath is derived once, here, from the
// single source of truth (site.baseUrl) so it can never drift out of sync.
const basePath = new URL(data.site.baseUrl).pathname.replace(/\/$/, "");
helpers.register(Handlebars, basePath);

function registerPartial(name, relPath) {
  Handlebars.registerPartial(name, fs.readFileSync(path.join(TEMPLATES, relPath), "utf8"));
}
registerPartial("head", "partials/head.hbs");
registerPartial("nav", "partials/nav.hbs");
registerPartial("footer", "partials/footer.hbs");
registerPartial("scripts", "partials/scripts.hbs");
registerPartial("project-card", "components/project-card.hbs");
registerPartial("product-card", "components/product-card.hbs");
registerPartial("testimonial-card", "components/testimonial-card.hbs");
registerPartial("cert-card", "components/cert-card.hbs");

const layoutSrc = fs.readFileSync(path.join(TEMPLATES, "layout.hbs"), "utf8");
const layout = Handlebars.compile(layoutSrc);

function compilePage(name) {
  const src = fs.readFileSync(path.join(TEMPLATES, "pages", `${name}.hbs`), "utf8");
  return Handlebars.compile(src);
}

// ---------------------------------------------------------------------
// 4. Output helpers
// ---------------------------------------------------------------------
const sitemapEntries = [];

function writePage(outPath, bodyTemplate, bodyContext, meta, opts = {}) {
  const body = bodyTemplate(bodyContext);
  const html = layout({
    body,
    meta,
    site: data.site,
    page: opts.page || "",
    breadcrumbs: opts.breadcrumbs,
    extraStyles: opts.extraStyles,
    extraScripts: opts.extraScripts,
  });
  const fullPath = path.join(OUT_DIR, outPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, html);

  if (!opts.noindex) {
    sitemapEntries.push({
      path: "/" + outPath.replace(/index\.html$/, ""),
      lastmod: opts.lastmod || data.buildDate,
      changefreq: opts.changefreq || "monthly",
      priority: opts.priority != null ? opts.priority : 0.6,
    });
  }
}

function enrich(item) {
  const repoMatch = item.links && item.links.github && item.links.github.match(/github\.com\/([^\/]+)\/([^\/#?]+)/);
  const repoKey = repoMatch ? `${repoMatch[1]}/${repoMatch[2].replace(/\.git$/, "")}` : null;
  return { ...item, github: repoKey ? githubMeta[repoKey] : null };
}

// ---------------------------------------------------------------------
// 5. Home page
// ---------------------------------------------------------------------
{
  const homeTpl = compilePage("home");
  const featuredProjects = data.projectsPublished.filter((p) => p.featured).slice(0, 6);
  const featuredProducts = data.productsPublished.filter((p) => p.featured).slice(0, 4);
  const testimonialsPreview = data.testimonialsPublished.slice(0, 3);

  const currentlyBuilding = (data.site.currentlyBuilding || [])
    .map((slug) => {
      const product = data.products.find((p) => p.slug === slug);
      const project = data.projects.find((p) => p.slug === slug);
      const item = product || project;
      if (!item) return null;
      return {
        title: item.title,
        shortDescription: item.shortDescription,
        icon: item.icon || "bi-rocket-takeoff-fill",
        statusLabel: (item.editions && item.editions[0] && item.editions[0].statusLabel) || item.status || "In Progress",
        url: product ? `/products/${item.slug}/` : `/projects/${item.slug}/`,
      };
    })
    .filter(Boolean);

  writePage(
    "index.html",
    homeTpl,
    { site: data.site, featuredProjects, featuredProducts, testimonialsPreview, currentlyBuilding },
    buildMeta(data.site, { path: "/", description: data.site.shortBio }),
    { page: "home", priority: 1.0, changefreq: "weekly", extraStyles: ["hero"], extraScripts: ["js/hero-network.js"] }
  );
}

// ---------------------------------------------------------------------
// 6. Projects — listing + one detail page per published project
// ---------------------------------------------------------------------
{
  const listTpl = compilePage("projects");
  const detailTpl = compilePage("project-detail");

  const categories = [...new Set(data.projectsPublished.map((p) => p.category).filter(Boolean))];
  const draftCount = data.projects.filter((p) => p.draft).length;

  const groupDefs = [
    { workType: "client", slug: "client-work", label: "Client Work", icon: "bi-briefcase-fill", description: "Real sites and platforms built for real clients." },
    { workType: "open-source", slug: "open-source", label: "Open Source", icon: "bi-code-square", description: "Public repositories — tools, tutorials, and code anyone can read or reuse." },
    { workType: "labs", slug: "labs-projects", label: "Labs & Experiments", icon: "bi-flask-fill", description: "Smaller builds, design experiments, and practice pieces." },
  ];
  const groups = groupDefs
    .map((g, i) => ({ ...g, alt: i % 2 === 1, items: data.projectsPublished.filter((p) => p.workType === g.workType).map(enrich) }))
    .filter((g) => g.items.length > 0);

  writePage(
    "projects/index.html",
    listTpl,
    { projects: data.projectsPublished.map(enrich), categories, draftCount, groups },
    buildMeta(data.site, {
      path: "/projects/",
      title: "Projects",
      description: "Engineering work spanning client solutions, open-source code, and experiments.",
      breadcrumbs: [{ label: "Home", href: "/" }, { label: "Projects", href: "/projects/" }],
    }),
    { page: "projects", priority: 0.9, changefreq: "weekly", breadcrumbs: [{ label: "Home", href: "/" }, { label: "Projects", href: "/projects/" }], extraScripts: ["js/projects.js"], extraStyles: ["projects"] }
  );

  data.projectsPublished.forEach((project) => {
    const url = `projects/${project.slug}/`;
    let caseStudyHtml = null;
    const mdPath = path.join(CONTENT_DIR, "projects", `${project.slug}.md`);
    if (fs.existsSync(mdPath)) {
      const md = fs.readFileSync(mdPath, "utf8").trim();
      if (md) caseStudyHtml = marked.parse(md);
    }

    writePage(
      `${url}index.html`,
      detailTpl,
      { ...enrich(project), caseStudyHtml },
      buildMeta(data.site, {
        path: "/" + url,
        title: project.title,
        description: project.shortDescription,
        image: project.image,
        type: "article",
        jsonLd: [softwareApplicationSchema(data.site, project, "/" + url)],
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects/" },
          { label: project.title, href: "/" + url },
        ],
      }),
      {
        page: "projects",
        priority: project.featured ? 0.8 : 0.6,
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects/" },
          { label: project.title, href: "/" + url },
        ],
      }
    );
  });
}

// ---------------------------------------------------------------------
// 7. Products — listing + detail pages
// ---------------------------------------------------------------------
{
  const listTpl = compilePage("products");
  const detailTpl = compilePage("product-detail");

  writePage(
    "products/index.html",
    listTpl,
    { products: data.productsPublished, roadmap: data.roadmap },
    buildMeta(data.site, {
      path: "/products/",
      title: "Products",
      description: "Software people can actually use — SaaS products built by Peter Lightspeed / PLSTech.",
      breadcrumbs: [{ label: "Home", href: "/" }, { label: "Products", href: "/products/" }],
    }),
    { page: "products", priority: 0.9, breadcrumbs: [{ label: "Home", href: "/" }, { label: "Products", href: "/products/" }] }
  );

  data.productsPublished.forEach((product) => {
    const url = `products/${product.slug}/`;
    writePage(
      `${url}index.html`,
      detailTpl,
      product,
      buildMeta(data.site, {
        path: "/" + url,
        title: product.title,
        description: product.shortDescription,
        type: "article",
        jsonLd: [softwareApplicationSchema(data.site, product, "/" + url)],
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Products", href: "/products/" },
          { label: product.title, href: "/" + url },
        ],
      }),
      { page: "products", priority: 0.7 }
    );
  });
}

// ---------------------------------------------------------------------
// 8. Certifications (+ skills + education, single page, all data-driven)
// ---------------------------------------------------------------------
{
  const tpl = compilePage("certifications");
  writePage(
    "certifications.html",
    tpl,
    { certificates: data.certificatesPublished, skills: data.skills, experience: data.experiencePublished },
    buildMeta(data.site, {
      path: "/certifications.html",
      title: "Certifications & Education",
      description: "Formal training, credentials, and skills behind the work.",
    }),
    { page: "certifications", priority: 0.5, extraStyles: ["certifications"] }
  );
}

// ---------------------------------------------------------------------
// 9. Testimonials
// ---------------------------------------------------------------------
{
  const tpl = compilePage("testimonials");
  writePage(
    "testimonials.html",
    tpl,
    { testimonials: data.testimonialsPublished },
    buildMeta(data.site, {
      path: "/testimonials.html",
      title: "Testimonials",
      description: "What clients, students, and collaborators have said.",
    }),
    { page: "testimonials", priority: 0.5, extraStyles: ["testimonials"] }
  );
}

// ---------------------------------------------------------------------
// 10. About
// ---------------------------------------------------------------------
{
  const tpl = compilePage("about");
  const storyMd = fs.readFileSync(path.join(CONTENT_DIR, "about-story.md"), "utf8");
  writePage(
    "about.html",
    tpl,
    { site: data.site, skills: data.skills, experience: data.experiencePublished, community: data.community, storyHtml: marked.parse(storyMd), awards: data.awardsPublished },
    buildMeta(data.site, {
      path: "/about.html",
      title: "About",
      description: `Discover ${data.site.name}, a ${data.site.jobTitle.toLowerCase()} from ${data.site.location.city}, ${data.site.location.country}.`,
    }),
    { page: "about", priority: 0.7, extraStyles: ["about"] }
  );
}

// ---------------------------------------------------------------------
// 11. Timeline — auto-assembled from experience + dated projects + certs
// ---------------------------------------------------------------------
{
  const tpl = compilePage("timeline");
  const events = [];

  data.experiencePublished.forEach((e) =>
    events.push({
      dateLabel: e.period,
      sortKey: (e.period || "").slice(0, 4),
      title: e.title,
      subtitle: e.institution,
      description: e.description,
      icon: e.icon,
      color: e.color,
    })
  );

  data.projectsPublished
    .filter((p) => p.date)
    .forEach((p) =>
      events.push({
        dateLabel: p.date,
        sortKey: p.date,
        title: p.title,
        subtitle: "Project",
        description: p.shortDescription,
        href: `/projects/${p.slug}/`,
        icon: "bi-rocket-takeoff-fill",
        color: "primary",
      })
    );

  data.certificatesPublished
    .filter((c) => c.date)
    .forEach((c) =>
      events.push({
        dateLabel: c.dateLabel || c.date,
        sortKey: c.date,
        title: c.title,
        subtitle: c.issuer,
        icon: "bi-award-fill",
        color: "warning",
      })
    );

  data.awardsPublished.forEach((a) =>
    events.push({
      dateLabel: a.date,
      sortKey: a.date,
      title: a.title,
      subtitle: a.issuer,
      description: a.status,
      icon: "bi-trophy-fill",
      color: "danger",
    })
  );

  events.sort((a, b) => (b.sortKey || "").localeCompare(a.sortKey || ""));

  writePage(
    "timeline.html",
    tpl,
    { events },
    buildMeta(data.site, { path: "/timeline.html", title: "Timeline", description: "Career timeline — auto-generated from projects, education, and certifications." }),
    { page: "timeline", priority: 0.5 }
  );
}

// ---------------------------------------------------------------------
// 12. Now
// ---------------------------------------------------------------------
{
  const tpl = compilePage("now");
  const currentProjects = data.now.currentProjects
    .map((slug) => data.projects.find((p) => p.slug === slug))
    .filter(Boolean);

  writePage(
    "now.html",
    tpl,
    { now: data.now, currentProjects },
    buildMeta(data.site, { path: "/now.html", title: "Now", description: "What I'm currently building, learning, and focused on." }),
    { page: "now", priority: 0.4, changefreq: "weekly" }
  );
}

// ---------------------------------------------------------------------
// 13. Community
// ---------------------------------------------------------------------
{
  const tpl = compilePage("community");
  writePage(
    "community.html",
    tpl,
    { community: data.community, talks: data.talksPublished },
    buildMeta(data.site, { path: "/community.html", title: "Community", description: "Teaching, mentoring, live coding, and open-source work." }),
    { page: "community", priority: 0.4 }
  );
}

// ---------------------------------------------------------------------
// 13b. Services — fully data-driven (data/services.json)
// ---------------------------------------------------------------------
{
  const tpl = compilePage("services");
  writePage(
    "services.html",
    tpl,
    { services: data.services },
    buildMeta(data.site, {
      path: "/services.html",
      title: "Services",
      description: `${data.site.name} offers backend development, AI engineering, and SaaS product development services, alongside web development and technical content creation.`,
    }),
    { page: "services", priority: 0.7, extraStyles: ["services"] }
  );
}


//
//     Group A — onto the shared nav/footer/head via extraction: these
//     pages' unique body content is preserved exactly, but they no
//     longer carry their own hand-written copy of the nav/footer, and
//     their <head>/SEO tags now come from the same generator as every
//     other page. (contact, services, labs, sax, sponsor, demo)
//
//     Group B — fully migrated onto data: resume, cv, and 404 are now
//     generated from data/experience.json + data/skills.json +
//     data/projects.json + data/certificates.json + data/site.json,
//     same single source of truth as everything else, instead of a
//     third hand-copy of the same facts.
// ---------------------------------------------------------------------
const LEGACY_DIR = path.join(ROOT, "_legacy");

function extractLegacyBody(slug) {
  const html = fs.readFileSync(path.join(LEGACY_DIR, `${slug}.html`), "utf8");
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  const descMatch = html.match(/name="description"\s+content="([^"]*)"/);

  const mainStart = html.indexOf("<main>");
  const footerMarker = html.indexOf("<!-- FOOTER");
  const footerTagFallback = html.indexOf('<footer class="footer');
  const end = footerMarker !== -1 ? footerMarker : footerTagFallback;

  let body;
  if (mainStart !== -1 && end !== -1) {
    body = html.slice(mainStart + "<main>".length, end);
  } else {
    // sax.html has no <main> wrapper — extract between the last </nav> and the footer marker.
    const navEnd = html.lastIndexOf("</nav>");
    body = html.slice(navEnd + "</nav>".length, end !== -1 ? end : undefined);
  }

  return {
    body,
    title: titleMatch ? titleMatch[1].split(" - ")[0].split(" | ")[0].trim() : slug,
    description: descMatch ? descMatch[1] : "",
  };
}

const groupAPages = [
  { slug: "contact", page: "contact", priority: 0.8, extraScripts: ["js/contact.js"], extraStyles: ["contact"] },
  { slug: "labs", page: "labs", priority: 0.5, extraScripts: ["js/labs.js"], extraStyles: ["labs"] },
  { slug: "sax", page: "sax", priority: 0.3, extraScripts: ["public/sax-bot.js", "public/sax.js"], extraStyles: ["sax"] },
  { slug: "sponsor", page: "sponsor", priority: 0.3, extraScripts: ["js/sponsor.js"], extraStyles: ["sponsor"] },
  { slug: "demo", page: "demo", priority: 0.4, extraScripts: ["js/demo.js"], extraStyles: [] },
];

groupAPages.forEach(({ slug, page, priority, extraScripts, extraStyles }) => {
  const { body, title, description } = extractLegacyBody(slug);
  const bodyFn = () => body;
  writePage(
    `${slug}.html`,
    bodyFn,
    {},
    buildMeta(data.site, { path: `/${slug}.html`, title, description }),
    { page, priority, extraScripts, extraStyles }
  );
});

// --- Group B: resume, cv, 404 — fully data-driven ---
{
  const resumeTpl = compilePage("resume");
  const cvTpl = compilePage("cv");
  const notFoundTpl = compilePage("404");

  const topProjects = data.projectsPublished.filter((p) => p.featured).slice(0, 4);

  writePage(
    "resume.html",
    resumeTpl,
    { site: data.site, skills: data.skills, experience: data.experiencePublished, projects: topProjects, certificates: data.certificatesPublished },
    buildMeta(data.site, {
      path: "/resume.html",
      title: "Resume",
      description: `View ${data.site.name}'s ATS-friendly resume online. ${data.site.jobTitle} with expertise in Python, Go, FastAPI, and AI-powered SaaS products.`,
    }),
    { page: "resume", priority: 0.6, extraStyles: ["resume", "print"] }
  );

  writePage(
    "cv.html",
    cvTpl,
    { site: data.site, skills: data.skills, experience: data.experiencePublished, certificates: data.certificatesPublished },
    buildMeta(data.site, {
      path: "/cv.html",
      title: "Download CV",
      description: `Download ${data.site.name}'s CV/Resume. ${data.site.jobTitle} with expertise in Python, Go, FastAPI, and AI-powered SaaS products.`,
    }),
    { page: "cv", priority: 0.6, extraStyles: ["cv"] }
  );

  // 404 renders standalone (no shared nav, matching the original design
  // intent for error pages) so it bypasses writePage()/layout entirely.
  const html404 = notFoundTpl({ site: data.site });
  fs.writeFileSync(path.join(OUT_DIR, "404.html"), html404);
}

// ---------------------------------------------------------------------
// 14b. Redirect stubs for old flat URLs now served as clean folder URLs.
//      Legacy pages (copied through unchanged, see step 14) still link to
//      "projects.html" / "products.html" the old way — these stubs keep
//      those links working without hand-editing 9 legacy files.
// ---------------------------------------------------------------------
[
  { from: "projects.html", to: `${basePath}/projects/` },
  { from: "products.html", to: `${basePath}/products/` },
].forEach(({ from, to }) => {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${to}"><title>Redirecting…</title></head><body>Redirecting to <a href="${to}">${to}</a>…</body></html>`;
  fs.writeFileSync(path.join(OUT_DIR, from), html);
});


function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
["css", "js", "images", "public", "documents"].forEach((dir) => copyDir(path.join(ROOT, dir), path.join(OUT_DIR, dir)));

// ---------------------------------------------------------------------
// 16. sitemap.xml, rss.xml, search-index.json
// ---------------------------------------------------------------------
writeSitemap(data.site, sitemapEntries, OUT_DIR);
writeRss(data.site, data.articlesPublished, OUT_DIR);
writeSearchIndex(data, OUT_DIR);

console.log(`\n✓ Build complete → ${OUT_DIR}`);
console.log(`  ${sitemapEntries.length} pages, ${data.projectsPublished.length} projects, ${data.productsPublished.length} products, ${data.certificatesPublished.length} certificates`);
