/**
 * search-index.js — builds public/search-index.json, a flat array every
 * collection contributes to. js/search.js fetches this once on page load
 * and filters it client-side (no server, fits GitHub Pages). A new
 * project/product/certificate/article automatically appears in site
 * search the moment it's added to its JSON file and is no longer draft.
 */
const fs = require("fs");
const path = require("path");

function buildSearchIndex(data) {
  const index = [];

  data.projectsPublished.forEach((p) =>
    index.push({
      type: "Project",
      title: p.title,
      description: p.shortDescription,
      url: `/projects/${p.slug}/`,
      tags: [...(p.tags || []), p.category].filter(Boolean),
    })
  );

  data.productsPublished.forEach((p) =>
    index.push({
      type: "Product",
      title: p.title,
      description: p.shortDescription,
      url: `/products/${p.slug}/`,
      tags: p.techStack || [],
    })
  );

  data.certificatesPublished.forEach((c) =>
    index.push({
      type: "Certificate",
      title: c.title,
      description: c.description || c.issuer || "",
      url: `/certifications.html#${c.slug}`,
      tags: c.skills || [],
    })
  );

  data.articlesPublished.forEach((a) =>
    index.push({
      type: "Article",
      title: a.title,
      description: a.summary,
      url: a.externalUrl || `/articles/${a.slug}/`,
      tags: a.tags || [],
    })
  );

  data.talksPublished.forEach((t) =>
    index.push({
      type: "Talk",
      title: t.title,
      description: t.description || t.event || "",
      url: t.link || "/community.html",
      tags: [],
    })
  );

  // Skills — core + learning, so "search skills" works as requested.
  data.skills.core.forEach((group) =>
    group.items.forEach((item) =>
      index.push({
        type: "Skill",
        title: item,
        description: `Core skill — ${group.group}`,
        url: "/about.html#skills",
        tags: [group.group],
      })
    )
  );

  data.experiencePublished.forEach((e) =>
    index.push({
      type: "Experience",
      title: e.title,
      description: e.institution || "",
      url: "/about.html#experience",
      tags: [e.type],
    })
  );

  return index;
}

function writeSearchIndex(data, outDir) {
  const index = buildSearchIndex(data);
  fs.mkdirSync(path.join(outDir, "public"), { recursive: true });
  fs.writeFileSync(path.join(outDir, "public", "search-index.json"), JSON.stringify(index));
  return index;
}

module.exports = { buildSearchIndex, writeSearchIndex };
