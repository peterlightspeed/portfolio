/**
 * data.js — loads and lightly normalizes every /data/*.json collection.
 * This is the single place that reads from disk; build.js and every
 * generator module gets its content through this module.
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "..", "data");

function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));
}

/** Items with draft:true are excluded from anything public (listings,
 *  sitemap, search index, RSS) until the person fills them in and flips
 *  draft to false. They still exist in the JSON so the shape is ready. */
function published(items) {
  return items.filter((i) => !i.draft);
}

function loadAll() {
  const site = readJSON("site.json");
  const projects = readJSON("projects.json");
  const products = readJSON("products.json");
  const certificates = readJSON("certificates.json");
  const testimonials = readJSON("testimonials.json");
  const experience = readJSON("experience.json");
  const skills = readJSON("skills.json");
  const community = readJSON("community.json");
  const now = readJSON("now.json");
  const roadmap = readJSON("roadmap.json");
  const services = readJSON("services.json");
  const articles = readJSON("articles.json");
  const talks = readJSON("talks.json");
  const awards = readJSON("awards.json");

  return {
    site,
    projects,
    projectsPublished: published(projects),
    products,
    productsPublished: published(products),
    certificates,
    certificatesPublished: published(certificates),
    testimonials,
    testimonialsPublished: published(testimonials),
    experience,
    experiencePublished: published(experience),
    skills,
    community,
    now,
    roadmap,
    services,
    articles,
    articlesPublished: published(articles),
    talks,
    talksPublished: published(talks),
    awards,
    awardsPublished: published(awards),
    buildDate: new Date().toISOString().slice(0, 10),
  };
}

module.exports = { loadAll, published, readJSON };
