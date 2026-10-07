/**
 * career-mode.js — progressive-enhancement career mode / audience switcher.
 *
 * The HTML the build emits is the complete default view (fully crawlable,
 * works with JS off). This script only re-presents the SAME content for a
 * chosen role or audience: hero copy, CTA, resume link, featured project and
 * product order, skill-group emphasis, and experience order. Choice is kept
 * in localStorage and can be forced with ?mode=<role-slug> or ?as=<audience>.
 * All configuration comes from data/career.json via #career-config.
 */
(function () {
  'use strict';
  var node = document.getElementById('career-config');
  if (!node) return;
  var cfg;
  try { cfg = JSON.parse(node.textContent); } catch (e) { return; }
  var KEY = 'pls-career-mode';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function read() { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function write(v) { try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch (e) {} }

  var params = new URLSearchParams(location.search);
  var initial = params.get('mode') ? 'role:' + params.get('mode') : params.get('as') ? 'aud:' + params.get('as') : read();

  function resolve(value) {
    if (!value) return null;
    var parts = value.split(':'), kind = parts[0], slug = parts.slice(1).join(':');
    if (kind === 'role' && cfg.roles[slug]) return { role: cfg.roles[slug], roleSlug: slug, audience: null };
    if (kind === 'aud') {
      var a = cfg.audiences.filter(function (x) { return x.slug === slug; })[0];
      if (a && cfg.roles[a.role]) return { role: cfg.roles[a.role], roleSlug: a.role, audience: a };
    }
    return null;
  }

  function reorder(container, items, key, order) {
    if (!container || !order.length) return;
    var byKey = {};
    items.forEach(function (el) { byKey[el.getAttribute(key)] = el; });
    var seen = {};
    order.forEach(function (k) { if (byKey[k]) { container.appendChild(byKey[k]); seen[k] = 1; } });
    items.forEach(function (el) { if (!seen[el.getAttribute(key)]) container.appendChild(el); });
  }

  function setText(el, text) { if (el && text) el.textContent = text; }

  function apply(state) {
    if (!state) return;
    var r = state.role, a = state.audience;
    // hero
    setText($('[data-career="headline"]'), r.headline);
    setText($('[data-career="subline"]'), r.subline);
    var ctaLabel = (a && a.ctaLabel) || r.ctaLabel, ctaHref = (a && a.ctaHref) || r.ctaHref;
    var cta = $('[data-career="cta"]');
    if (cta && ctaLabel && ctaHref) {
      setText($('[data-career="cta-label"]', cta), ctaLabel);
      if (/^https?:/.test(ctaHref)) { cta.setAttribute('href', ctaHref); cta.setAttribute('target', '_blank'); cta.setAttribute('rel', 'noopener'); }
      else cta.setAttribute('href', (cfg.base || '') + ctaHref);
    }
    var res = $('[data-career="resume"]');
    if (res) res.setAttribute('href', (cfg.base || '') + r.resumeHref);

    // featured projects / products (home)
    [['#featured-projects', r.projects], ['#featured-products', r.products]].forEach(function (pair) {
      var sec = $(pair[0]); if (!sec || !pair[1].length) return;
      var row = $('.row', sec), cards = $$('[data-slug]', row);
      cards.forEach(function (c) { c.hidden = pair[1].indexOf(c.getAttribute('data-slug')) === -1; });
      reorder(row, cards, 'data-slug', pair[1]);
    });

    // home section order per audience
    if (a && a.sectionOrder && a.sectionOrder.length) {
      var anchor = $('#cta');
      if (anchor) a.sectionOrder.forEach(function (id) { var s = document.getElementById(id); if (s) anchor.parentNode.insertBefore(s, anchor); });
    }

    // about: skill emphasis + experience order
    var skillRow = $('#skills .row');
    if (skillRow) reorder(skillRow, $$('[data-skill-group]', skillRow), 'data-skill-group', r.skillGroups);
    var expRow = $('#experience .row');
    if (expRow) reorder(expRow, $$('[data-exp-id]', expRow), 'data-exp-id', r.experience);

    document.documentElement.setAttribute('data-career-mode', state.roleSlug);
  }

  var select = document.getElementById('careerSelect');
  var box = document.getElementById('careerSwitcher');
  var state = resolve(initial);
  if (select) {
    if (state) select.value = initial;
    select.addEventListener('change', function () {
      write(select.value);
      // Simplest, most reliable: reload so the default markup resets, then re-apply.
      location.href = location.pathname;
    });
  }
  if (box) box.classList.add('is-ready');
  apply(state);
})();
