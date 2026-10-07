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
  id: { required: false, type: "string" },
  type: { required: true, type: "string" },
  title: { required: true, type: "string" },
  institution: { required: false, type: "string" },
  period: { required: false, type: "string" },
  description: { required: false, type: "string" },
  draft: { required: true, type: "boolean" },
};

// A resume profile never carries its own copy of a project, product,
// experience entry, or skill — only references (slugs / title+institution
// pairs / skill strings) into the collections above. build.js resolves
// each reference against the *published* collection and throws a build
// error if one doesn't match, so a typo can never silently ship a resume
// that quietly drops a project or claims a skill that isn't backed by
// anything real elsewhere on the site. See HOW_TO_GENERATE_NEW_RESUME.md.
const resumeProfileSchema = {
  slug: { required: true, type: "string" },
  extends: { required: false, type: "string" },
  hero: { required: false, type: "object" },
  label: { required: true, type: "string" },
  roleTag: { required: true, type: "string" },
  audience: { required: false, type: "string" },
  summary: { required: true, type: "string" },
  featuredSkillGroups: { required: false, type: "array" },
  featuredSkills: { required: false, type: "array" },
  experienceOrder: { required: true, type: "array" },
  projectSlugs: { required: false, type: "array" },
  productSlugs: { required: false, type: "array" },
  certificateSlugs: { required: false, type: "array" },
  ctaLabel: { required: false, type: "string" },
  ctaHref: { required: false, type: "string" },
  letter: { required: false, type: "object" },
  pendingNote: { required: false, type: "string" },
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
  resumeProfileSchema,
};
