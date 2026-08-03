/**
 * sitemap.js — generates sitemap.xml from the list of pages build.js
 * actually rendered. Nobody maintains this by hand; every generator
 * (renderPage, renderCollection) registers its own URL as it renders,
 * so the sitemap can never drift from the real output again.
 */
const fs = require("fs");
const path = require("path");
const { absolute } = require("./seo");

function writeSitemap(site, entries, outDir) {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${absolute(site, e.path)}</loc>
    <lastmod>${e.lastmod || new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>${e.changefreq || "monthly"}</changefreq>
    <priority>${e.priority != null ? e.priority : 0.5}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);
}

module.exports = { writeSitemap };
