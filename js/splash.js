// Splash screen: animates a progress ring, percentage, and rotating
// captions while the page finishes loading, then fades out. The
// percentage is a smooth simulated progression (browsers don't expose a
// reliable "% of page loaded") but is tied to the real window.load signal
// so it always reaches 100% exactly when the fade-out happens, never
// before. Two safety rails: a minimum display time (no instant flash)
// and a hard maximum (can never get stuck covering the site).
(function () {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;

    const ring = document.getElementById('splashRingFill');
    const percentEl = document.getElementById('splashPercent');
    const captionEl = document.getElementById('splashCaption');

    const MIN_DISPLAY_MS = 900;
    const MAX_DISPLAY_MS = 3000;
    const RING_CIRCUMFERENCE = 339.292; // 2 * PI * r(54), matches the SVG
    const CAPTIONS = [
        { at: 0, text: 'Gathering resources...' },
        { at: 30, text: 'Warming up the engine...' },
        { at: 60, text: 'Almost there...' },
        { at: 90, text: 'Ready!' },
    ];

    const shownAt = Date.now();
    let hidden = false;
    let pageReady = false;
    let currentPercent = 0;

    function setProgress(percent) {
        currentPercent = Math.min(100, Math.max(0, percent));
        if (ring) {
            ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - currentPercent / 100));
        }
        if (percentEl) percentEl.textContent = Math.round(currentPercent) + '%';

        const next = CAPTIONS.slice().reverse().find((c) => currentPercent >= c.at);
        if (next && captionEl && captionEl.textContent !== next.text) {
            captionEl.style.opacity = '0';
            setTimeout(() => {
                captionEl.textContent = next.text;
                captionEl.style.opacity = '0.85';
            }, 150);
        }
    }

    function hideSplash() {
        if (hidden) return;
        hidden = true;
        setProgress(100);
        setTimeout(() => {
            splash.classList.add('splash-hidden');
            splash.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                if (splash.parentNode) splash.parentNode.removeChild(splash);
            }, 500);
        }, 150); // brief pause at 100% so it reads as "done", not an abrupt cut
    }

    function tick() {
        if (hidden) return;
        const elapsed = Date.now() - shownAt;
        // Ease toward ~92%, then hold — the final stretch to 100% only
        // happens once the page is actually ready, so it's never a lie.
        const target = pageReady ? 100 : Math.min(92, (elapsed / MIN_DISPLAY_MS) * 92);
        setProgress(currentPercent + (target - currentPercent) * 0.15);
        if (currentPercent < 99.5) requestAnimationFrame(tick);
    }

    function requestHide() {
        pageReady = true;
        const elapsed = Date.now() - shownAt;
        setTimeout(hideSplash, Math.max(0, MIN_DISPLAY_MS - elapsed));
    }

    requestAnimationFrame(tick);

    if (document.readyState === 'complete') {
        requestHide();
    } else {
        window.addEventListener('load', requestHide, { once: true });
    }

    setTimeout(hideSplash, MAX_DISPLAY_MS); // hard safety net
})();
