/**
 * DARK MODE SYSTEM
 * ================
 * Handles dark/light mode toggle with localStorage persistence.
 * Injected on every page automatically via this shared script.
 *
 * HOW TO CUSTOMIZE:
 * - Colors are controlled by the .dark-mode CSS class in darkmode.css
 * - The toggle button injects itself into the navbar automatically
 */

(function () {
  var STORAGE_KEY = 'pl-dark-mode';

  function applyTheme(dark) {
    if (dark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  function isDark() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  function toggle() {
    var next = !isDark();
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    updateIcon();
  }

  function updateIcon() {
    var btn = document.getElementById('darkModeToggle');
    if (!btn) return;
    if (isDark()) {
      btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
      btn.title = 'Switch to light mode';
    } else {
      btn.innerHTML = '<i class="bi bi-moon-fill"></i>';
      btn.title = 'Switch to dark mode';
    }
  }

  function injectToggle() {
    var nav = document.querySelector('.navbar-nav');
    if (!nav) return;
    if (document.getElementById('darkModeToggle')) return;

    var li = document.createElement('li');
    li.className = 'nav-item d-flex align-items-center ms-2';
    li.innerHTML =
      '<button id="darkModeToggle" class="btn btn-outline-light btn-sm rounded-circle dark-mode-btn" ' +
      'title="Switch to dark mode" aria-label="Toggle dark mode" style="width:36px;height:36px;padding:0;">' +
      '<i class="bi bi-moon-fill"></i>' +
      '</button>';
    nav.appendChild(li);

    document.getElementById('darkModeToggle').addEventListener('click', toggle);
    updateIcon();
  }

  /* Apply theme immediately (before paint) to prevent flash */
  applyTheme(isDark());

  document.addEventListener('DOMContentLoaded', function () {
    injectToggle();
  });
})();
