/**
 * analytics.js — provider-agnostic analytics facade.
 *
 * The rest of the site only ever talks to PLSAnalytics.track(name, label).
 * Which service receives it is decided by ONE setting in data/site.json
 * (analytics.provider). To swap GoatCounter for Plausible (or anything else),
 * change that setting; to add a new provider, add one adapter below.
 *
 * Nothing loads unless the build found a configured provider (the config
 * <script id="analytics-config"> is only emitted then). Do Not Track is honoured.
 *
 * What gets recorded (all via the provider's normal dashboard):
 *   - page views (=> visitor analytics and project/product popularity, since
 *     every project and product has its own URL)
 *   - any element with data-track="event-name" [data-track-label="x"] on click
 *     (resume prints, cover-letter copies, contact/booking clicks, hero CTAs)
 *   - form submissions with data-track-submit="event-name" (contact form)
 */
(function () {
  'use strict';
  var node = document.getElementById('analytics-config');
  if (!node) return;
  var cfg;
  try { cfg = JSON.parse(node.textContent); } catch (e) { return; }
  if (cfg.respectDoNotTrack && (navigator.doNotTrack === '1' || window.doNotTrack === '1')) return;

  function loadScript(src, attrs) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    Object.keys(attrs || {}).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    document.head.appendChild(s);
  }

  var adapters = {
    goatcounter: {
      init: function (c) {
        if (!c.code) return false;
        loadScript('https://gc.zgo.at/count.js', { 'data-goatcounter': 'https://' + c.code + '.goatcounter.com/count' });
        return true;
      },
      event: function (name, label) {
        var send = function () {
          if (window.goatcounter && window.goatcounter.count) {
            window.goatcounter.count({ path: 'event/' + name + (label ? '/' + label : ''), title: name, event: true });
          }
        };
        window.goatcounter && window.goatcounter.count ? send() : setTimeout(send, 1500);
      }
    },
    plausible: {
      init: function (c) {
        if (!c.domain) return false;
        window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
        loadScript('https://plausible.io/js/script.js', { 'data-domain': c.domain, defer: '' });
        return true;
      },
      event: function (name, label) { window.plausible && window.plausible(name, label ? { props: { label: label } } : undefined); }
    }
  };

  var adapter = adapters[cfg.provider];
  if (!adapter || !adapter.init(cfg[cfg.provider] || {})) return;

  function track(name, label) { try { adapter.event(name, label); } catch (e) {} }
  window.PLSAnalytics = { track: track, provider: cfg.provider };

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (el) track(el.getAttribute('data-track'), el.getAttribute('data-track-label') || '');
  });
  document.addEventListener('submit', function (e) {
    var el = e.target.closest && e.target.closest('[data-track-submit]');
    if (el) track(el.getAttribute('data-track-submit'), '');
  });
  // Ctrl/Cmd+P on resume pages
  window.addEventListener('afterprint', function () {
    if (/\/resume(\/|\.html)/.test(location.pathname)) track('resume-print', location.pathname.replace(/\.html$/, '').split('/').filter(Boolean).pop());
  });
})();
