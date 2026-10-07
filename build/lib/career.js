/**
 * career.js — resolves data/career.json.
 *
 * A role may `extend` another role. The child inherits every field from the
 * parent and only stores what differs (e.g. "Solutions Engineer" extends
 * "Presales Engineer" and overrides label/summary/skills). This is how the
 * same underlying role is presented several ways without duplicating data.
 */
function resolveRoles(roles) {
  const bySlug = new Map(roles.map((r) => [r.slug, r]));
  const cache = new Map();

  function resolve(slug, trail = []) {
    if (cache.has(slug)) return cache.get(slug);
    const raw = bySlug.get(slug);
    if (!raw) throw new Error(`career.json: role "${slug}" does not exist (referenced by extends).`);
    if (trail.includes(slug)) throw new Error(`career.json: circular "extends" chain: ${[...trail, slug].join(" -> ")}`);
    let merged = { ...raw };
    if (raw.extends) {
      const parent = resolve(raw.extends, [...trail, slug]);
      // child overrides parent; parent's draft/pendingNote never leak down
      const { draft, pendingNote, slug: _s, extends: _e, ...inheritable } = parent;
      merged = { ...inheritable, ...raw };
    }
    cache.set(slug, merged);
    return merged;
  }
  return roles.map((r) => resolve(r.slug));
}

module.exports = { resolveRoles };
