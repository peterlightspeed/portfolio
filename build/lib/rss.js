/**
 * rss.js — generates rss.xml from published articles (data/articles.json).
 * Add a new article by adding one entry to articles.json (or dropping a
 * Markdown file in content/articles/ and referencing it via contentFile);
 * this feed regenerates automatically on the next build.
 */
const fs = require("fs");
const path = require("path");
const { absolute } = require("./seo");

function escapeXml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function writeRss(site, articles, outDir) {
  const items = articles
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(
      (a) => `  <item>
    <title>${escapeXml(a.title)}</title>
    <link>${escapeXml(a.externalUrl || absolute(site, `articles/${a.slug}/`))}</link>
    <guid>${escapeXml(a.externalUrl || absolute(site, `articles/${a.slug}/`))}</guid>
    <pubDate>${new Date(a.date).toUTCString()}</pubDate>
    <description>${escapeXml(a.summary)}</description>
  </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(site.name)} — Articles</title>
  <link>${absolute(site, "/")}</link>
  <description>${escapeXml(site.shortBio)}</description>
${items}
</channel>
</rss>
`;
  fs.writeFileSync(path.join(outDir, "rss.xml"), xml);
}

module.exports = { writeRss };
