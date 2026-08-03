/**
 * seo.js — builds the metadata object every page's <head> partial reads
 * from: title, description, canonical URL, Open Graph/Twitter tags, and
 * JSON-LD structured data. Centralizing this means every new generated
 * page (a new project, product, article...) automatically gets correct,
 * consistent SEO without anyone writing a single <meta> tag by hand.
 */

function absolute(site, relPath) {
  if (!relPath) return site.baseUrl + "/";
  if (relPath.startsWith("http")) return relPath;
  return site.baseUrl.replace(/\/$/, "") + "/" + relPath.replace(/^\//, "");
}

/**
 * @param {object} site   data/site.json
 * @param {object} opts
 *   path        site-relative output path, e.g. "projects/pls-nexus/"
 *   title       page title (without the site name suffix)
 *   description meta description
 *   image       relative or absolute OG image (falls back to site default)
 *   type        og:type, defaults to "website"
 *   jsonLd      array of extra JSON-LD objects beyond the base Person schema
 *   noindex     boolean — true for 404 and internal utility pages
 */
function buildMeta(site, opts) {
  const canonical = absolute(site, opts.path);
  const title = opts.title ? `${opts.title} | ${site.name}` : `${site.name} | ${site.jobTitle}`;
  const description = opts.description || site.shortBio;
  const image = absolute(site, opts.image || site.defaultOgImage);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.alternateName,
    jobTitle: site.jobTitle,
    url: site.baseUrl + "/",
    sameAs: site.socials.filter((s) => s.id !== "email").map((s) => s.url),
    knowsAbout: ["Python", "Go", "FastAPI", "Flask", "PostgreSQL", "REST APIs", "AI Engineering", "SaaS Development"],
  };

  const breadcrumbSchema =
    opts.breadcrumbs && opts.breadcrumbs.length
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: opts.breadcrumbs.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: b.label,
            item: absolute(site, b.href),
          })),
        }
      : null;

  const jsonLd = [personSchema, breadcrumbSchema, ...(opts.jsonLd || [])].filter(Boolean);

  return {
    title,
    description,
    canonical,
    ogType: opts.type || "website",
    ogImage: image,
    robots: opts.noindex ? "noindex, follow" : "index, follow",
    jsonLd,
    jsonLdString: jsonLd.map((obj) => JSON.stringify(obj, null, 2)),
  };
}

/** SoftwareApplication schema for an individual project/product page. */
function softwareApplicationSchema(site, item, url) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: item.title,
    description: item.shortDescription,
    applicationCategory: item.category || "DeveloperApplication",
    url: absolute(site, url),
    author: { "@type": "Person", name: site.name },
    ...(item.links && item.links.github ? { codeRepository: item.links.github } : {}),
  };
}

module.exports = { buildMeta, softwareApplicationSchema, absolute };
