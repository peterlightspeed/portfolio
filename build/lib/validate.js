/**
 * validate.js
 * -----------------------------------------------------------------------
 * Validates every collection in /data against the schemas defined in
 * build/schemas.js. Run automatically at the start of every build
 * (`npm run build`) and can also be run standalone (`npm run validate`).
 *
 * Fails loudly (non-zero exit code) on:
 *   - malformed JSON
 *   - missing required fields
 *   - wrong field type
 *   - duplicate slugs within a collection
 *
 * This is what makes "just edit one JSON file" safe: if a content author
 * (present or future) makes a typo or forgets a field, the build stops
 * with a precise error instead of silently shipping a broken page.
 * -----------------------------------------------------------------------
 */
const fs = require("fs");
const path = require("path");
const schemas = require("../schemas");
const { resolveRoles } = require("./career");

const DATA_DIR = path.join(__dirname, "..", "..", "data");

const collections = [
  { file: "projects.json", schema: schemas.projectSchema, isArray: true },
  { file: "products.json", schema: schemas.productSchema, isArray: true },
  { file: "certificates.json", schema: schemas.certificateSchema, isArray: true },
  { file: "testimonials.json", schema: schemas.testimonialSchema, isArray: true },
  { file: "articles.json", schema: schemas.articleSchema, isArray: true },
  { file: "talks.json", schema: schemas.talkSchema, isArray: true },
  { file: "awards.json", schema: schemas.awardSchema, isArray: true },
  { file: "experience.json", schema: schemas.experienceSchema, isArray: true },
];

function typeOf(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function validateItem(item, schema, context) {
  const errors = [];
  for (const [field, rule] of Object.entries(schema)) {
    const present = Object.prototype.hasOwnProperty.call(item, field);
    if (rule.required && !present) {
      errors.push(`${context}: missing required field "${field}"`);
      continue;
    }
    if (present && typeOf(item[field]) !== rule.type) {
      errors.push(
        `${context}: field "${field}" should be type ${rule.type}, got ${typeOf(item[field])}`
      );
    }
  }
  return errors;
}

function validateAll({ throwOnError = true } = {}) {
  let allErrors = [];
  const loaded = {};

  for (const { file, schema, isArray } of collections) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      allErrors.push(`${file}: file not found`);
      continue;
    }

    let json;
    try {
      json = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      allErrors.push(`${file}: invalid JSON — ${e.message}`);
      continue;
    }

    loaded[file] = json;

    if (isArray) {
      if (!Array.isArray(json)) {
        allErrors.push(`${file}: expected a top-level array`);
        continue;
      }
      const seenSlugs = new Set();
      json.forEach((item, i) => {
        const context = `${file}[${i}]${item.slug ? ` (${item.slug})` : ""}`;
        allErrors = allErrors.concat(validateItem(item, schema, context));
        if (item.slug) {
          if (seenSlugs.has(item.slug)) {
            allErrors.push(`${file}: duplicate slug "${item.slug}"`);
          }
          seenSlugs.add(item.slug);
        }
      });
    }
  }


  // career.json — the central control file. Validate each role AFTER
  // inheritance ("extends") is resolved, and every cross-reference.
  try {
    const career = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "career.json"), "utf8"));
    loaded["career.json"] = career;
    if (!Array.isArray(career.roles)) throw new Error('"roles" must be an array');
    const seen = new Set();
    career.roles.forEach((r) => {
      if (!r.slug) allErrors.push("career.json: a role is missing its slug");
      else if (seen.has(r.slug)) allErrors.push(`career.json: duplicate role slug "${r.slug}"`);
      else seen.add(r.slug);
    });
    const roles = resolveRoles(career.roles);
    roles.forEach((r) => {
      allErrors = allErrors.concat(validateItem(r, schemas.resumeProfileSchema, `career.json role (${r.slug})`));
    });
    const check = (slug, where) => {
      if (slug && !seen.has(slug)) allErrors.push(`career.json: ${where} references unknown role "${slug}"`);
    };
    (career.preferredRoles || []).forEach((s) => check(s, "preferredRoles"));
    check(career.defaultRole, "defaultRole");
    (career.audiences || []).forEach((a) => check(a.role, `audience "${a.slug}"`));
    const dr = roles.find((r) => r.slug === career.defaultRole);
    if (dr && dr.draft) allErrors.push(`career.json: defaultRole "${career.defaultRole}" is a draft`);
  } catch (e) {
    allErrors.push(`career.json: ${e.message}`);
  }

  // site.json — just confirm it parses and has the fields templates rely on
  try {
    const site = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "site.json"), "utf8"));
    ["name", "baseUrl", "primaryNav", "socials"].forEach((key) => {
      if (!(key in site)) allErrors.push(`site.json: missing required field "${key}"`);
    });
    loaded["site.json"] = site;
  } catch (e) {
    allErrors.push(`site.json: invalid JSON — ${e.message}`);
  }

  if (allErrors.length && throwOnError) {
    console.error("\n✗ Content validation failed:\n");
    allErrors.forEach((e) => console.error("  - " + e));
    console.error(`\n${allErrors.length} error(s). Fix the JSON above and re-run the build.\n`);
    process.exit(1);
  }

  return { errors: allErrors, loaded };
}

if (require.main === module) {
  const { errors } = validateAll({ throwOnError: false });
  if (errors.length) {
    console.error(`✗ ${errors.length} validation error(s):`);
    errors.forEach((e) => console.error("  - " + e));
    process.exit(1);
  }
  console.log("✓ All content files are valid.");
}

module.exports = { validateAll };
