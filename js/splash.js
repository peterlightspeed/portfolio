// Splash screen: shows briefly while the page's fonts/images/scripts finish
// loading, then fades out. Two safety rails so this can never go wrong:
//   - a minimum display time, so it doesn't flash instantly on fast
//     connections and look like a glitch
//   - a hard maximum timeout, so if something else on the page hangs, the
//     splash screen can never get stuck covering the site forever
(function () {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;

    const MIN_DISPLAY_MS = 350;
    const MAX_DISPLAY_MS = 2500;
    const shownAt = Date.now();
    let hidden = false;

    function hideSplash() {
        if (hidden) return;
        hidden = true;
        splash.classList.add('splash-hidden');
        splash.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            if (splash.parentNode) splash.parentNode.removeChild(splash);
        }, 400); // matches the CSS fade-out duration
    }

    function requestHide() {
        const elapsed = Date.now() - shownAt;
        const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
        setTimeout(hideSplash, remaining);
    }

    if (document.readyState === 'complete') {
        requestHide();
    } else {
        window.addEventListener('load', requestHide, { once: true });
    }

    // Hard safety net — never let the splash screen get stuck.
    setTimeout(hideSplash, MAX_DISPLAY_MS);
})();
