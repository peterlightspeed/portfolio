/**
 * helpers.js — Handlebars helpers shared by every template.
 * Keep this list small and boring on purpose: a future maintainer should
 * be able to read this one file and understand every {{helper}} used
 * anywhere in /templates.
 */
function register(Handlebars, basePath = "") {
  const withBase = (p) => {
    const str = (p || "").toString();
    if (str.startsWith("http") || str.startsWith("mailto:") || str.startsWith("tel:")) return str;
    const clean = str.replace(/^\//, "");
    return basePath ? `${basePath}/${clean}` : `/${clean}`;
  };

  // Prefix any site-relative path with the GitHub Pages project-site
  // subpath (e.g. "/portfolio", derived from site.baseUrl in build.js) so
  // the site works correctly whether it's served from a domain root or a
  // subfolder. Use this for EVERY internal href/src in every template —
  // css/js/images root files AND internal nav links alike. Never write a
  // raw href="/..." or src="/..." directly in a template.
  Handlebars.registerHelper("url", (p) => withBase(p));

  // Sizes a Bootstrap column based on how many sibling items share the row —
  // e.g. a product with only 1 edition should get the full row, not a lonely
  // 1/3-width card next to empty space. Used by product cards/detail pages.
  Handlebars.registerHelper("colFor", (count) => {
    if (count <= 1) return "col-12";
    if (count === 2) return "col-md-6";
    return "col-md-4";
  });

  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("gt", (a, b) => a > b);
  Handlebars.registerHelper("includes", (arr, val) => Array.isArray(arr) && arr.includes(val));

  // String helpers
  Handlebars.registerHelper("upper", (s) => (s || "").toString().toUpperCase());
  Handlebars.registerHelper("truncate", (s, n) => {
    if (!s) return "";
    const str = s.toString();
    return str.length > n ? str.slice(0, n).trim() + "…" : str;
  });

  Handlebars.registerHelper("formatDate", (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return iso;
    }
  });

  Handlebars.registerHelper("urlencode", (s) => encodeURIComponent(s || ""));

  // Resolve a local asset path (subpath-prefixed) vs. an external http(s)
  // URL (used as-is). Projects/certificates/products mix both kinds.
  Handlebars.registerHelper("asset", (p) => {
    if (!p) return "";
    if (p.startsWith("http")) return p;
    return withBase(p);
  });

  // JSON dump — used to embed structured data / search index inline
  Handlebars.registerHelper("json", (context) => JSON.stringify(context));

  // Star rating (supports .5 halves), returns raw HTML of bootstrap-icon stars
  Handlebars.registerHelper("stars", (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    let html = "";
    for (let i = 0; i < full; i++) html += '<i class="bi bi-star-fill"></i>';
    if (half) html += '<i class="bi bi-star-half"></i>';
    for (let i = 0; i < empty; i++) html += '<i class="bi bi-star"></i>';
    return new Handlebars.SafeString(html);
  });

  // Resolve a site-relative path against the configured baseUrl for
  // absolute URLs (used where a full https:// URL is required, not just
  // a site-relative one — canonical/OG tags, sitemap, RSS).
  Handlebars.registerHelper("absUrl", function (relPath, options) {
    const site = (options && options.data && options.data.root && options.data.root.site) || this.site;
    const base = (site && site.baseUrl) || "";
    if (!relPath) return base + "/";
    if (relPath.startsWith("http")) return relPath;
    return base.replace(/\/$/, "") + "/" + relPath.replace(/^\//, "");
  });

  // Active-nav-item detector
  Handlebars.registerHelper("activeIf", (current, match) =>
    current === match ? "active" : ""
  );

  Handlebars.registerHelper("year", () => new Date().getFullYear());
}

module.exports = { register };
