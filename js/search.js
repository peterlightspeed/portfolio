// Site-wide search. Backed entirely by /public/search-index.json, which
// build/lib/search-index.js regenerates from data/*.json on every build.
// No server, no framework — fits GitHub Pages. Add a project/product/
// certificate/article and it's searchable after the next build, with
// nothing else to wire up here.
document.addEventListener('DOMContentLoaded', function () {
    const openBtn = document.getElementById('siteSearchOpen');
    const modal = document.getElementById('siteSearchModal');
    const closeBtn = document.getElementById('siteSearchClose');
    const input = document.getElementById('siteSearchInput');
    const results = document.getElementById('siteSearchResults');

    if (!openBtn || !modal) return;

    let index = null;
    let indexPromise = null;

    function loadIndex() {
        if (!indexPromise) {
            indexPromise = fetch('/public/search-index.json')
                .then((r) => r.json())
                .then((json) => { index = json; })
                .catch(() => { index = []; });
        }
        return indexPromise;
    }

    function open() {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        loadIndex().then(() => input.focus());
    }

    function close() {
        modal.hidden = true;
        document.body.style.overflow = '';
        input.value = '';
        results.innerHTML = '';
    }

    function render(items) {
        if (!items.length) {
            results.innerHTML = '<p class="text-muted small px-2">No results yet — try a different term.</p>';
            return;
        }
        results.innerHTML = items
            .slice(0, 20)
            .map(
                (item) => `
        <a href="${item.url}" class="site-search-result">
          <span class="badge bg-light text-dark border">${item.type}</span>
          <div>
            <strong>${item.title}</strong>
            <p class="small text-muted mb-0">${item.description || ''}</p>
          </div>
        </a>`
            )
            .join('');
    }

    function search(query) {
        if (!index) return [];
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return index.filter((item) => {
            const haystack = [item.title, item.description, ...(item.tags || [])].join(' ').toLowerCase();
            return haystack.includes(q);
        });
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) close();
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
    });
    input.addEventListener('input', () => render(search(input.value)));
});
