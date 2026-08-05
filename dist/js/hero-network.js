// Interactive particle-network animation for the homepage hero.
// Pure canvas + vanilla JS, no dependencies. Nodes drift slowly, connect
// to nearby nodes with fading lines, and connect to the cursor when it's
// close — a small nod to "networked systems" fitting a backend/AI portfolio.
// Respects prefers-reduced-motion (renders a static frame instead of animating).
(function () {
    const canvas = document.getElementById('heroNetwork');
    if (!canvas) return; // only present on the homepage

    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width, height, dpr;
    let nodes = [];
    let mouse = { x: null, y: null, active: false };
    let animationId = null;

    const CONNECT_DISTANCE = 150;
    const MOUSE_CONNECT_DISTANCE = 200;
    const NODE_COLOR = 'rgba(255, 255, 255, 0.85)';
    const LINE_COLOR = '255, 255, 255';
    const MOUSE_LINE_COLOR = '255, 190, 80'; // warm accent so the cursor's influence stands out

    function nodeCountFor(w, h) {
        // Scale with area, capped both ends so it stays fast on huge screens
        // and still looks alive on small ones.
        const target = Math.round((w * h) / 14000);
        return Math.max(28, Math.min(90, target));
    }

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeNodes() {
        const count = nodeCountFor(width, height);
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 1.2,
        }));
    }

    function step() {
        for (const n of nodes) {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;

            // Gentle drift away from the cursor so the network feels responsive
            // without particles getting stuck orbiting the pointer.
            if (mouse.active) {
                const dx = n.x - mouse.x;
                const dy = n.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 90 && dist > 0.01) {
                    const force = (90 - dist) / 90 * 0.06;
                    n.x += (dx / dist) * force * 10;
                    n.y += (dy / dist) * force * 10;
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Node-to-node connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < CONNECT_DISTANCE) {
                    const opacity = (1 - dist / CONNECT_DISTANCE) * 0.35;
                    ctx.strokeStyle = `rgba(${LINE_COLOR}, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        // Cursor connections (the interactive part)
        if (mouse.active) {
            for (const n of nodes) {
                const dx = n.x - mouse.x;
                const dy = n.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < MOUSE_CONNECT_DISTANCE) {
                    const opacity = (1 - dist / MOUSE_CONNECT_DISTANCE) * 0.7;
                    ctx.strokeStyle = `rgba(${MOUSE_LINE_COLOR}, ${opacity})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${MOUSE_LINE_COLOR}, 0.9)`;
            ctx.fill();
        }

        // Nodes on top
        ctx.fillStyle = NODE_COLOR;
        for (const n of nodes) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function loop() {
        step();
        draw();
        animationId = requestAnimationFrame(loop);
    }

    function getRelativeCoords(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function onMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            mouse.active = false;
            return;
        }
        const p = getRelativeCoords(e.clientX, e.clientY);
        mouse.x = p.x;
        mouse.y = p.y;
        mouse.active = true;
    }

    function onMouseLeave() {
        mouse.active = false;
    }

    function onTouchMove(e) {
        if (!e.touches || !e.touches[0]) return;
        const rect = canvas.getBoundingClientRect();
        const t = e.touches[0];
        if (t.clientX < rect.left || t.clientX > rect.right || t.clientY < rect.top || t.clientY > rect.bottom) {
            mouse.active = false;
            return;
        }
        const p = getRelativeCoords(t.clientX, t.clientY);
        mouse.x = p.x;
        mouse.y = p.y;
        mouse.active = true;
    }

    function init() {
        resize();
        makeNodes();

        if (prefersReducedMotion) {
            // Respect the user's preference: render one calm static frame, no motion.
            draw();
            return;
        }

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('mouseleave', onMouseLeave, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onMouseLeave, { passive: true });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resize();
                makeNodes();
            }, 150);
        });

        // Pause the animation loop when the tab isn't visible — saves battery/CPU
        // on a background tab and is generally good citizenship for a homepage effect.
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animationId) cancelAnimationFrame(animationId);
                animationId = null;
            } else if (!animationId) {
                loop();
            }
        });

        loop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
