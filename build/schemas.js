/**
 * schemas.js
 * -----------------------------------------------------------------------
 * Lightweight, dependency-free schema definitions for every content
 * collection in /data. Each schema lists the fields build/lib/validate.js
 * checks for. This file is the canonical reference for "what fields does
 * a project/product/certificate/etc need" — read this before adding a
 * new collection or a new field to an existing one.
 *
 * A field marked required:true must exist (empty string/array is fine —
 * that's how draft placeholders pass validation). required:false fields
 * are optional and templates must handle them being absent.
 * -----------------------------------------------------------------------
 */

const projectSchema = {
  slug: { required: true, type: "string" },
  title: { required: true, type: "string" },
  shortDescription: { required: true, type: "string" },
  problem: { required: false, type: "string" },
  solution: { required: false, type: "string" },
  architecture: { required: false, type: "string" },
  techStack: { required: true, type: "array" },
  features: { required: false, type: "array" },
  challenges: { required: false, type: "string" },
  lessonsLearned: { required: false, type: "string" },
  futureImprovements: { required: false, type: "string" },
  links: { required: true, type: "object" },
  image: { required: false, type: "string" },
  screenshots: { required: false, type: "array" },
  status: { required: false, type: "string" },
  date: { required: false, type: "string" },
  category: { required: false, type: "string" },
  tags: { required: true, type: "array" },
  featured: { required: false, type: "boolean" },
  caseStudy: { required: false, type: "boolean" },
  draft: { required: true, type: "boolean" },
};

const productSchema = {
  slug: { required: true, type: "string" },
  title: { required: true, type: "string" },
  shortDescription: { required: true, type: "string" },
  techStack: { required: true, type: "array" },
  editions: { required: true, type: "array" },
  featured: { required: false, type: "boolean" },
  draft: { required: true, type: "boolean" },
};

const certificateSchema = {
  slug: { required: true, type: "string" },
  title: { required: true, type: "string" },
  issuer: { required: false, type: "string" },
  date: { required: false, type: "string" },
  logo: { required: false, type: "string" },
  description: { required: false, type: "string" },
  skills: { required: true, type: "array" },
  credentialUrl: { required: false, type: "string" },
  draft: { required: true, type: "boolean" },
};

const testimonialSchema = {
  slug: { required: true, type: "string" },
  author: { required: true, type: "string" },
  role: { required: false, type: "string" },
  avatar: { required: false, type: "string" },
  rating: { required: true, type: "number" },
  service: { required: false, type: "string" },
  quote: { required: true, type: "string" },
  draft: { required: true, type: "boolean" },
};

const articleSchema = {
  slug: { required: true, type: "string" },
  title: { required: true, type: "string" },
  summary: { required: true, type: "string" },
  date: { required: true, type: "string" },
  tags: { required: true, type: "array" },
  externalUrl: { required: false, type: "string" },
  contentFile: { required: false, type: "string" },
  draft: { required: true, type: "boolean" },
};

const talkSchema = {
  slug: { required: true, type: "string" },
  title: { required: true, type: "string" },
  event: { required: false, type: "string" },
  date: { required: false, type: "string" },
  description: { required: false, type: "string" },
  link: { required: false, type: "string" },
  draft: { required: true, type: "boolean" },
};

const awardSchema = {
  slug: { required: true, type: "string" },
  title: { required: true, type: "string" },
  issuer: { required: false, type: "string" },
  date: { required: false, type: "string" },
  description: { required: false, type: "string" },
  draft: { required: true, type: "boolean" },
};

const experienceSchema = {
  type: { required: true, type: "string" },
  title: { required: true, type: "string" },
  institution: { required: false, type: "string" },
  period: { required: false, type: "string" },
  description: { required: false, type: "string" },
  draft: { required: true, type: "boolean" },
};

module.exports = {
  projectSchema,
  productSchema,
  certificateSchema,
  testimonialSchema,
  articleSchema,
  talkSchema,
  awardSchema,
  experienceSchema,
};
