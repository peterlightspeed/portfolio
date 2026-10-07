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

// Analytics: emitted only when a provider is configured AND its identifier
// is filled in, so an unconfigured site ships no tracking code at all.
{
  const a = data.site.analytics || {};
  const idOk = (a.provider === "goatcounter" && a.goatcounter && a.goatcounter.code) || (a.provider === "plausible" && a.plausible && a.plausible.domain);
  if (idOk) {
    data.site.analyticsConfigJson = JSON.stringify({
      provider: a.provider,
      goatcounter: a.goatcounter || {},
      plausible: a.plausible || {},
      respectDoNotTrack: a.respectDoNotTrack !== false,
    }).replace(/</g, "\\u003c");
  }
}
helpers.register(Handlebars, basePath);

function registerPartial(name, relPath) {
  Handlebars.registerPartial(name, fs.readFileSync(path.join(TEMPLATES, relPath), "utf8"));
}
registerPartial("head", "partials/head.hbs");
registerPartial("nav", "partials/nav.hbs");
registerPartial("footer", "partials/footer.hbs");
registerPartial("social-sidebar", "partials/social-sidebar.hbs");
registerPartial("splash-screen", "partials/splash-screen.hbs");
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
// 4b. Career resolution — data/career.json is the single control file.
//     Every role in it drives (1) a resume, (2) a cover letter, (3) a
//     homepage "career mode", and (4) the audience switcher. Roles only
//     REFERENCE other data (slugs / experience ids / skill names), and
//     every reference is verified here so a typo fails the build instead
//     of silently shipping a wrong or misleading page.
//     See PERSONAL_GUIDE.md and HOW_TO_GENERATE_NEW_RESUME.md.
// ---------------------------------------------------------------------
const career = data.career;
const careerRules = {
  maxWorkSamples: 8,
  includeEducation: true,
  includeCertificates: true,
  letterSkillCount: 6,
  ...(career.resumeRules || {}),
};

function joinList(items) {
  if (items.length <= 1) return items.join("");
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
}
const presentJobs = data.experiencePublished.filter((e) => e.type === "work" && /present/i.test(e.period || ""));
const summaryTokens = {
  currentRoles: joinList(presentJobs.map((e) => `${e.title} at ${e.institution}`)),
  productCount: String(data.productsPublished.length),
  projectCount: String(data.projectsPublished.length),
};
function fillTokens(text, extra = {}) {
  const vars = { ...summaryTokens, ...extra };
  return String(text || "").replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
}

// Every skill term that actually exists somewhere real. A role can only
// feature a skill that resolves against this pool, so a resume can never
// claim expertise that isn't backed by something else in the CMS.
const skillPool = new Set();
const addTerm = (t) => skillPool.add(String(t).toLowerCase());
data.skills.core.forEach((g) => g.items.forEach(addTerm));
(data.skills.learning.items || []).forEach(addTerm);
[...data.projectsPublished, ...data.productsPublished].forEach((i) => (i.techStack || []).forEach(addTerm));
data.experiencePublished.forEach((e) => [...(e.technologies || []), ...(e.skillsGained || [])].forEach(addTerm));

function assertSkillIsReal(term, roleSlug) {
  const t = term.toLowerCase();
  const ok = skillPool.has(t) || [...skillPool].some((p) => p.includes(t) || t.includes(p));
  if (!ok) throw new Error(`career.json (${roleSlug}): featured skill "${term}" isn't in skills.json, any tech stack, or any experience entry.`);
}
function resolveSkillGroups(names, roleSlug) {
  return (names || []).map((name) => {
    const g = data.skills.core.find((x) => x.group === name);
    if (!g) throw new Error(`career.json (${roleSlug}): no skill group "${name}" in skills.json`);
    return g;
  });
}
function resolveExperience(ids, roleSlug) {
  return (ids || []).map((id) => {
    const m = data.experiencePublished.find((e) => e.id === id);
    if (!m) throw new Error(`career.json (${roleSlug}): no published experience entry with id "${id}" (typo, missing "id" field, or draft:true in experience.json).`);
    return m;
  });
}
function resolveBySlug(collection, slugs, kind, roleSlug) {
  return (slugs || []).map((slug) => {
    const m = collection.find((i) => i.slug === slug);
    if (!m) throw new Error(`career.json (${roleSlug}): no published ${kind} with slug "${slug}"`);
    return m;
  });
}
const educationEntries = careerRules.includeEducation ? data.experiencePublished.filter((e) => e.type === "education") : [];
const preferredIndex = (slug) => {
  const i = (career.preferredRoles || []).indexOf(slug);
  return i === -1 ? 9999 : i;
};

const resumeVariants = data.resumeProfilesPublished
  .slice()
  .sort((a, b) => preferredIndex(a.slug) - preferredIndex(b.slug))
  .map((role) => {
    (role.featuredSkills || []).forEach((s) => assertSkillIsReal(s, role.slug));
    const toSample = (kind) => (p) => ({
      title: p.title,
      shortDescription: p.shortDescription,
      techStack: p.techStack,
      link: (p.links && (p.links.liveDemo || p.links.github)) || "",
      kind,
      slug: p.slug,
    });
    const projects = resolveBySlug(data.projectsPublished, role.projectSlugs, "project", role.slug).map(toSample("Project"));
    const products = resolveBySlug(data.productsPublished, role.productSlugs, "product", role.slug).map(toSample("Product"));
    const summary = fillTokens(role.summary || career.summaryTemplates.default, { label: role.label });
    return {
      ...role,
      summary,
      href: `/resume/${role.slug}/`,
      letterHref: `/cover-letters/${role.slug}/`,
      skillGroups: resolveSkillGroups(role.featuredSkillGroups, role.slug),
      experience: resolveExperience(role.experienceOrder, role.slug),
      education: educationEntries,
      certificates: careerRules.includeCertificates ? resolveBySlug(data.certificatesPublished, role.certificateSlugs, "certificate", role.slug) : [],
      workSamples: [...projects, ...products].slice(0, careerRules.maxWorkSamples),
    };
  });

if (!resumeVariants.find((v) => v.slug === career.defaultRole)) {
  throw new Error(`career.json: defaultRole "${career.defaultRole}" is not a published role.`);
}

// Client-side config for the homepage career modes + audience switcher.
const careerConfig = {
  base: new URL(data.site.baseUrl).pathname.replace(/\/$/, ""),
  defaultRole: career.defaultRole,
  roles: Object.fromEntries(
    resumeVariants.map((v) => [
      v.slug,
      {
        label: v.label,
        headline: (v.hero && v.hero.headline) || v.roleTag,
        subline: (v.hero && v.hero.subline) || v.summary,
        ctaLabel: v.ctaLabel || "",
        ctaHref: v.ctaHref || "",
        resumeHref: v.href,
        letterHref: v.letterHref,
        projects: v.projectSlugs || [],
        products: v.productSlugs || [],
        skillGroups: v.featuredSkillGroups || [],
        experience: v.experienceOrder || [],
      },
    ])
  ),
  audiences: (career.audiences || [])
    .filter((a) => resumeVariants.find((v) => v.slug === a.role))
    .map((a) => ({ slug: a.slug, label: a.label, role: a.role, sectionOrder: a.sectionOrder || [], ctaLabel: a.ctaLabel || "", ctaHref: a.ctaHref || "" })),
};
const careerConfigJson = JSON.stringify(careerConfig).replace(/</g, "\\u003c");

// ---------------------------------------------------------------------
// 5. Home page
// ---------------------------------------------------------------------
{
  const homeTpl = compilePage("home");
  // Default view = the items marked featured. Every item any career mode
  // wants is also rendered but `hidden`, so the mode switcher can reveal and
  // reorder them client-side without fetching anything (no CLS, no requests).
  const defaultProjects = data.projectsPublished.filter((p) => p.featured).slice(0, 6);
  const defaultProducts = data.productsPublished.filter((p) => p.featured).slice(0, 6);
  const withVisibility = (all, defaults, slugs) => {
    const keep = new Set([...defaults.map((d) => d.slug), ...slugs]);
    const order = [...defaults, ...all.filter((i) => !defaults.includes(i))];
    return order.filter((i) => keep.has(i.slug)).map((i) => ({ ...i, hidden: !defaults.includes(i) }));
  };
  const modeProjectSlugs = Object.values(careerConfig.roles).flatMap((r) => r.projects);
  const modeProductSlugs = Object.values(careerConfig.roles).flatMap((r) => r.products);
  const featuredProjects = withVisibility(data.projectsPublished, defaultProjects, modeProjectSlugs);
  const featuredProducts = withVisibility(data.productsPublished, defaultProducts, modeProductSlugs);
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
    { site: data.site, featuredProjects, featuredProducts, testimonialsPreview, currentlyBuilding, careerConfigJson, modeOptions: { roles: resumeVariants.map((v) => ({ slug: v.slug, label: v.label })), audiences: careerConfig.audiences } },
    buildMeta(data.site, { path: "/", description: data.site.shortBio }),
    { page: "home", priority: 1.0, changefreq: "weekly", extraStyles: ["hero"], extraScripts: ["js/hero-network.js", "js/career-mode.js"] }
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
    { workType: "__products__", slug: "products-on-projects", label: "Products", icon: "bi-box-seam-fill", description: "Software people can actually use, not just engineering demos.", isProducts: true },
    { workType: "client", slug: "client-work", label: "Client Work", icon: "bi-briefcase-fill", description: "Real sites and platforms built for real clients." },
    { workType: "open-source", slug: "open-source", label: "Open Source", icon: "bi-code-square", description: "Public repositories — tools, tutorials, and code anyone can read or reuse." },
    { workType: "labs", slug: "labs-projects", label: "Labs & Experiments", icon: "bi-flask-fill", description: "Smaller builds, design experiments, and practice pieces." },
  ];
  const groups = groupDefs
    .map((g, i) => ({
      ...g,
      alt: i % 2 === 1,
      items: g.isProducts ? data.productsPublished.filter((p) => p.featured) : data.projectsPublished.filter((p) => p.workType === g.workType).map(enrich),
    }))
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
    { site: data.site, skills: data.skills, experience: data.experiencePublished, community: data.community, storyHtml: marked.parse(storyMd), awards: data.awardsPublished, careerConfigJson },
    buildMeta(data.site, {
      path: "/about.html",
      title: "About",
      description: `Discover ${data.site.name}, a ${data.site.jobTitle.toLowerCase()} from ${data.site.location.city}, ${data.site.location.country}.`,
    }),
    { page: "about", priority: 0.7, extraStyles: ["about"], extraScripts: ["js/career-mode.js"] }
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

// Contact channels (calendar, YouTube, X, GitHub, WhatsApp community...) come from
// data/site.json -> contactChannels. Each channel names its URL source, so a
// URL lives in exactly one place.
function resolveContactChannels() {
  const site = data.site;
  return (site.contactChannels || [])
    .map((c) => {
      let url = "";
      if (c.source === "booking") url = site.booking && site.booking.url;
      else if (c.source === "whatsappCommunity") url = site.whatsappCommunity;
      else if (c.source && c.source.startsWith("social:")) {
        const s = site.socials.find((x) => x.id === c.source.slice(7));
        url = s && s.url;
      } else url = c.url;
      return url ? { ...c, url } : null;
    })
    .filter(Boolean);
}

groupAPages.forEach(({ slug, page, priority, extraScripts, extraStyles }) => {
  const extracted = extractLegacyBody(slug);
  const { title, description } = extracted;
  let body = extracted.body;
  if (slug === "contact") {
    const connect = compilePage("contact-connect")({ channels: resolveContactChannels() });
    const marker = "<!-- CONTACT FORM SECTION -->";
    if (!body.includes(marker)) throw new Error("contact: legacy body no longer contains the form-section marker; update build.js");
    body = body.replace(marker, connect + marker);
  }
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
// 14a½. Resume + cover-letter pages, generated from the resolved roles in
//       section 4b (data/career.json). Nothing here is role-specific.
// ---------------------------------------------------------------------
{
  const hubTpl = compilePage("resume-hub");
  const variantTpl = compilePage("resume-variant");
  const fill = (tpl, vars) => String(tpl).replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
  const hubCrumbs = [{ label: "Home", href: "/" }, { label: "Resume", href: "/resume/" }];

  writePage(
    "resume/index.html",
    hubTpl,
    { site: data.site, variants: resumeVariants },
    buildMeta(data.site, {
      path: "/resume/",
      title: "Resume — Choose a Role",
      description: `Role-specific, ATS-friendly resumes for ${data.site.name} — Backend Engineer, AI Engineer, Founder, and more, all generated from one source of truth.`,
      breadcrumbs: hubCrumbs,
    }),
    { page: "resume", priority: 0.6, extraStyles: ["resume"], breadcrumbs: hubCrumbs }
  );

  resumeVariants.forEach((variant) => {
    const url = `resume/${variant.slug}/`;
    const crumbs = [...hubCrumbs, { label: variant.label, href: "/" + url }];
    writePage(
      `${url}index.html`,
      variantTpl,
      { site: data.site, v: variant },
      buildMeta(data.site, {
        path: "/" + url,
        title: `${variant.label} Resume`,
        description: `${data.site.name}'s ${variant.label} resume — ${variant.roleTag}.`,
        breadcrumbs: crumbs,
      }),
      { page: "resume", priority: 0.5, extraStyles: ["resume", "print"], breadcrumbs: crumbs }
    );
  });

  // ---- Cover letters (drafts with [placeholders]: noindex, not in sitemap) ----
  const letterWording = data.coverLetter;
  const portfolioUrl = String(data.site.baseUrl || "").replace(/\/$/, "");
  const letters = resumeVariants
    .filter((v) => v.letter)
    .map((v) => {
      const hl = v.workSamples.find((w) => w.slug === v.letter.highlightSlug);
      if (!hl) throw new Error(`career.json (${v.slug}): letter.highlightSlug "${v.letter.highlightSlug}" isn't one of this role's projectSlugs/productSlugs.`);
      const ph = letterWording.placeholders;
      const skills = (v.featuredSkills || []).slice(0, careerRules.letterSkillCount).join(", ");
      return {
        slug: v.slug,
        label: v.label,
        href: v.letterHref,
        resumeHref: v.href,
        roleTag: v.roleTag,
        audience: v.audience,
        date: ph.date,
        greeting: fill(letterWording.greeting, { recipient: ph.recipient }),
        paragraphs: [
          fill(letterWording.applicationLine, { role: ph.role, company: ph.company }) + " " + v.letter.openingHook,
          fill(letterWording.highlightIntro, { title: hl.title, shortDescription: hl.shortDescription }) + " " + fill(letterWording.skillsLine, { skills }),
          fill(letterWording.portfolioLine, { portfolioUrl: portfolioUrl || "my portfolio" }) + " " + v.letter.closingNote,
        ],
        signOff: letterWording.signOff,
      };
    });

  const letterHubCrumbs = [{ label: "Home", href: "/" }, { label: "Cover Letters", href: "/cover-letters/" }];
  writePage(
    "cover-letters/index.html",
    compilePage("cover-letter-hub"),
    { site: data.site, letters },
    buildMeta(data.site, {
      path: "/cover-letters/",
      title: "Cover Letters — Choose a Role",
      description: `Role-specific cover letter drafts for ${data.site.name}, generated from the same data as the resumes.`,
      breadcrumbs: letterHubCrumbs,
      noindex: true,
    }),
    { page: "resume", noindex: true, extraStyles: ["resume"], breadcrumbs: letterHubCrumbs }
  );
  const letterVariantTpl = compilePage("cover-letter-variant");
  letters.forEach((l) => {
    const crumbs = [...letterHubCrumbs, { label: l.label, href: l.href }];
    writePage(
      `cover-letters/${l.slug}/index.html`,
      letterVariantTpl,
      { site: data.site, l },
      buildMeta(data.site, {
        path: l.href,
        title: `${l.label} Cover Letter`,
        description: `Cover letter draft for ${l.label} roles by ${data.site.name}.`,
        breadcrumbs: crumbs,
        noindex: true,
      }),
      { page: "resume", noindex: true, extraStyles: ["resume", "print"], breadcrumbs: crumbs }
    );
  });
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

// Self-host bootstrap-icons (font + CSS) instead of loading it from a CDN.
// This was previously loaded from cdn.jsdelivr.net — if that CDN is slow,
// blocked, or unreachable on a visitor's network, every icon sitewide
// (including the whole navbar) silently fails to render, since the font
// file never arrives. Bundling it locally removes that single point of
// failure entirely, the same reasoning as the AOS fallback added earlier.
{
  const iconSrc = path.join(ROOT, "node_modules", "bootstrap-icons", "font");
  const iconDest = path.join(OUT_DIR, "public", "vendor", "bootstrap-icons");
  if (fs.existsSync(iconSrc)) {
    fs.mkdirSync(iconDest, { recursive: true });
    fs.copyFileSync(path.join(iconSrc, "bootstrap-icons.min.css"), path.join(iconDest, "bootstrap-icons.min.css"));
    copyDir(path.join(iconSrc, "fonts"), path.join(iconDest, "fonts"));
  } else {
    console.warn("⚠ bootstrap-icons not found in node_modules — run `npm install` first. Falling back to CDN reference in head.hbs.");
  }
}

// ---------------------------------------------------------------------
// 16. sitemap.xml, rss.xml, search-index.json
// ---------------------------------------------------------------------
writeSitemap(data.site, sitemapEntries, OUT_DIR);
writeRss(data.site, data.articlesPublished, OUT_DIR);
writeSearchIndex(data, OUT_DIR);

console.log(`\n✓ Build complete → ${OUT_DIR}`);
console.log(`  ${sitemapEntries.length} pages, ${data.projectsPublished.length} projects, ${data.productsPublished.length} products, ${data.certificatesPublished.length} certificates`);
