/**
 * Labs page JavaScript
 * Implements: Typing Speed Test, Password Generator, Binary <-> Decimal Converter,
 * JSON Formatter, Color Palette Generator.
 * Everything here runs entirely client-side; no data leaves the browser.
 */
document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    // TYPING SPEED TEST
    // ============================================================
    (function initTypingTest() {
        const sampleEl = document.getElementById('typingSample');
        const inputEl = document.getElementById('typingInput');
        const wpmEl = document.getElementById('typingWpm');
        const accuracyEl = document.getElementById('typingAccuracy');
        const timeEl = document.getElementById('typingTime');
        const restartBtn = document.getElementById('typingRestart');

        if (!sampleEl || !inputEl) return;

        const samples = [
            'The quick brown fox jumps over the lazy dog while the sun sets over the horizon.',
            'Backend development with Python and Go requires a solid understanding of APIs and databases.',
            'Building AI powered SaaS products means balancing simplicity with real business value.',
            'Consistent practice is the fastest way to improve both typing speed and coding skill.'
        ];

        let startTime = null;
        let timerInterval = null;
        let currentSample = '';

        function pickSample() {
            currentSample = samples[Math.floor(Math.random() * samples.length)];
            sampleEl.textContent = currentSample;
        }

        function resetTest() {
            clearInterval(timerInterval);
            startTime = null;
            inputEl.value = '';
            inputEl.disabled = false;
            wpmEl.textContent = '0';
            accuracyEl.textContent = '100';
            timeEl.textContent = '0';
            pickSample();
            inputEl.focus();
        }

        function calculateAccuracy(typed, target) {
            let correct = 0;
            for (let i = 0; i < typed.length; i++) {
                if (typed[i] === target[i]) correct++;
            }
            return typed.length === 0 ? 100 : Math.round((correct / typed.length) * 100);
        }

        inputEl.addEventListener('input', function () {
            if (!startTime) {
                startTime = Date.now();
                timerInterval = setInterval(() => {
                    const elapsed = (Date.now() - startTime) / 1000;
                    timeEl.textContent = elapsed.toFixed(1);
                }, 100);
            }

            const typed = inputEl.value;
            accuracyEl.textContent = calculateAccuracy(typed, currentSample);

            const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
            const wordsTyped = typed.trim().split(/\s+/).filter(Boolean).length;
            wpmEl.textContent = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;

            if (typed === currentSample) {
                clearInterval(timerInterval);
                inputEl.disabled = true;
            }
        });

        restartBtn.addEventListener('click', resetTest);
        resetTest();
    })();

    // ============================================================
    // PASSWORD GENERATOR
    // ============================================================
    (function initPasswordGenerator() {
        const output = document.getElementById('passwordOutput');
        const lengthInput = document.getElementById('passwordLength');
        const lengthValue = document.getElementById('passwordLengthValue');
        const uppercaseCheck = document.getElementById('passwordUppercase');
        const numbersCheck = document.getElementById('passwordNumbers');
        const symbolsCheck = document.getElementById('passwordSymbols');
        const generateBtn = document.getElementById('passwordGenerate');
        const copyBtn = document.getElementById('passwordCopy');

        if (!output || !generateBtn) return;

        const LOWER = 'abcdefghijklmnopqrstuvwxyz';
        const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const NUMBERS = '0123456789';
        const SYMBOLS = '!@#$%^&*()_+-=[]{}';

        function generate() {
            let charset = LOWER;
            if (uppercaseCheck.checked) charset += UPPER;
            if (numbersCheck.checked) charset += NUMBERS;
            if (symbolsCheck.checked) charset += SYMBOLS;

            const length = parseInt(lengthInput.value, 10);
            const randomValues = new Uint32Array(length);
            crypto.getRandomValues(randomValues);

            let password = '';
            for (let i = 0; i < length; i++) {
                password += charset[randomValues[i] % charset.length];
            }
            output.value = password;
        }

        lengthInput.addEventListener('input', function () {
            lengthValue.textContent = lengthInput.value;
            generate();
        });
        [uppercaseCheck, numbersCheck, symbolsCheck].forEach(el => el.addEventListener('change', generate));
        generateBtn.addEventListener('click', generate);

        copyBtn.addEventListener('click', function () {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value).then(() => {
                const original = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="bi bi-check-lg"></i> Copied';
                setTimeout(() => { copyBtn.innerHTML = original; }, 1500);
            });
        });

        generate();
    })();

    // ============================================================
    // BINARY <-> DECIMAL CONVERTER
    // ============================================================
    (function initBinaryConverter() {
        const binaryInput = document.getElementById('binaryInput');
        const decimalInput = document.getElementById('decimalInput');
        const binaryError = document.getElementById('binaryError');
        const decimalError = document.getElementById('decimalError');

        if (!binaryInput || !decimalInput) return;

        let updating = false;

        binaryInput.addEventListener('input', function () {
            if (updating) return;
            binaryError.textContent = '';
            const val = binaryInput.value.trim();
            if (val === '') { decimalInput.value = ''; return; }
            if (!/^[01]+$/.test(val)) {
                binaryError.textContent = 'Only 0s and 1s are allowed.';
                return;
            }
            updating = true;
            decimalInput.value = parseInt(val, 2).toString(10);
            updating = false;
        });

        decimalInput.addEventListener('input', function () {
            if (updating) return;
            decimalError.textContent = '';
            const val = decimalInput.value.trim();
            if (val === '') { binaryInput.value = ''; return; }
            if (!/^\d+$/.test(val)) {
                decimalError.textContent = 'Only whole numbers are allowed.';
                return;
            }
            updating = true;
            binaryInput.value = parseInt(val, 10).toString(2);
            updating = false;
        });
    })();

    // ============================================================
    // JSON FORMATTER
    // ============================================================
    (function initJsonFormatter() {
        const input = document.getElementById('jsonInput');
        const output = document.getElementById('jsonOutput');
        const status = document.getElementById('jsonStatus');
        const formatBtn = document.getElementById('jsonFormat');
        const minifyBtn = document.getElementById('jsonMinify');
        const clearBtn = document.getElementById('jsonClear');

        if (!input || !formatBtn) return;

        function withParsedJson(callback) {
            try {
                const parsed = JSON.parse(input.value);
                status.textContent = 'Valid JSON.';
                status.className = 'form-text mt-2 text-success';
                callback(parsed);
            } catch (err) {
                status.textContent = 'Invalid JSON: ' + err.message;
                status.className = 'form-text mt-2 text-danger';
                output.value = '';
            }
        }

        formatBtn.addEventListener('click', function () {
            withParsedJson(parsed => { output.value = JSON.stringify(parsed, null, 2); });
        });

        minifyBtn.addEventListener('click', function () {
            withParsedJson(parsed => { output.value = JSON.stringify(parsed); });
        });

        clearBtn.addEventListener('click', function () {
            input.value = '';
            output.value = '';
            status.textContent = '';
        });
    })();

    // ============================================================
    // COLOR PALETTE GENERATOR
    // ============================================================
    (function initColorPalette() {
        const container = document.getElementById('paletteContainer');
        const generateBtn = document.getElementById('paletteGenerate');
        const feedback = document.getElementById('paletteCopyFeedback');

        if (!container || !generateBtn) return;

        function randomHex() {
            const randomValues = new Uint8Array(3);
            crypto.getRandomValues(randomValues);
            return '#' + Array.from(randomValues).map(b => b.toString(16).padStart(2, '0')).join('');
        }

        function renderPalette() {
            container.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const hex = randomHex();
                const swatch = document.createElement('button');
                swatch.type = 'button';
                swatch.className = 'palette-swatch';
                swatch.style.backgroundColor = hex;
                swatch.setAttribute('aria-label', 'Copy color ' + hex);
                swatch.innerHTML = `<span>${hex}</span>`;
                swatch.addEventListener('click', function () {
                    navigator.clipboard.writeText(hex).then(() => {
                        feedback.textContent = hex + ' copied to clipboard.';
                        setTimeout(() => { feedback.textContent = ''; }, 2000);
                    });
                });
                container.appendChild(swatch);
            }
        }

        generateBtn.addEventListener('click', renderPalette);
        renderPalette();
    })();

    // ============================================================
    // SNAKE (Take a Short Break)
    // ============================================================
    (function initSnake() {
        const canvas = document.getElementById('snakeCanvas');
        const startBtn = document.getElementById('snakeStart');
        const scoreEl = document.getElementById('snakeScore');
        const highScoreEl = document.getElementById('snakeHighScore');
        const dpadBtns = document.querySelectorAll('.snake-dpad-btn');

        if (!canvas || !startBtn) return;

        const ctx = canvas.getContext('2d');
        const GRID = 16;
        const CELLS = canvas.width / GRID;
        const HIGH_SCORE_KEY = 'pl-snake-high-score';

        let snake, direction, nextDirection, food, score, gameLoop, running;

        // Hire-me nudge: shown once per session, only after genuine engagement
        // (either a decent score or enough accumulated play time), never on
        // the very first move.
        const HIRE_NUDGE_SESSION_KEY = 'pl-snake-hire-nudge-shown';
        const HIRE_NUDGE_SCORE_THRESHOLD = 50;
        const HIRE_NUDGE_PLAYTIME_MS = 45000;
        let playStartTime = null;
        let hireNudgeTimer = null;

        function showHireNudge() {
            if (sessionStorage.getItem(HIRE_NUDGE_SESSION_KEY)) return;
            sessionStorage.setItem(HIRE_NUDGE_SESSION_KEY, 'true');

            const toast = document.createElement('div');
            toast.className = 'pl-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.innerHTML =
                '<div class="pl-toast-icon"><i class="bi bi-controller"></i></div>' +
                '<div class="pl-toast-body">' +
                '<strong>Enjoying the game?</strong>' +
                '<p>I build things like this too. If you\'re hiring for backend or AI work, let\'s talk.</p>' +
                '<a href="contact.html" class="pl-toast-cta">Get in touch &rarr;</a>' +
                '</div>' +
                '<button type="button" class="pl-toast-close" aria-label="Dismiss">&times;</button>';

            document.body.appendChild(toast);
            requestAnimationFrame(() => toast.classList.add('pl-toast-show'));

            function dismiss() {
                toast.classList.remove('pl-toast-show');
                setTimeout(() => toast.remove(), 300);
            }
            toast.querySelector('.pl-toast-close').addEventListener('click', dismiss);
            setTimeout(dismiss, 15000);
        }

        function loadHighScore() {
            return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
        }

        function saveHighScore(value) {
            localStorage.setItem(HIGH_SCORE_KEY, String(value));
        }

        highScoreEl.textContent = loadHighScore();

        function randomCell() {
            return {
                x: Math.floor(Math.random() * CELLS),
                y: Math.floor(Math.random() * CELLS)
            };
        }

        function placeFood() {
            let cell;
            do {
                cell = randomCell();
            } while (snake.some(seg => seg.x === cell.x && seg.y === cell.y));
            return cell;
        }

        function resetGame() {
            snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
            direction = { x: 1, y: 0 };
            nextDirection = { x: 1, y: 0 };
            food = placeFood();
            score = 0;
            scoreEl.textContent = '0';
            running = true;
        }

        function draw() {
            ctx.fillStyle = '#0f1115';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#dc3545';
            ctx.fillRect(food.x * GRID, food.y * GRID, GRID - 1, GRID - 1);

            snake.forEach((seg, i) => {
                ctx.fillStyle = i === 0 ? '#0d6efd' : '#66a3ff';
                ctx.fillRect(seg.x * GRID, seg.y * GRID, GRID - 1, GRID - 1);
            });
        }

        function endGame() {
            running = false;
            clearInterval(gameLoop);
            const best = loadHighScore();
            if (score > best) {
                saveHighScore(score);
                highScoreEl.textContent = score;
            }
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over - press Start to try again', canvas.width / 2, canvas.height / 2);
        }

        function tick() {
            direction = nextDirection;
            const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

            if (head.x < 0 || head.y < 0 || head.x >= CELLS || head.y >= CELLS) {
                endGame();
                return;
            }
            if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
                endGame();
                return;
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreEl.textContent = score;
                food = placeFood();
                if (score >= HIRE_NUDGE_SCORE_THRESHOLD) {
                    clearTimeout(hireNudgeTimer);
                    showHireNudge();
                }
            } else {
                snake.pop();
            }

            draw();
        }

        function setDirection(dx, dy) {
            if (!running) return;
            if (direction.x === -dx && direction.y === -dy) return;
            nextDirection = { x: dx, y: dy };
        }

        function startGame() {
            clearInterval(gameLoop);
            clearTimeout(hireNudgeTimer);
            resetGame();
            draw();
            gameLoop = setInterval(tick, 120);
            canvas.focus();

            if (!playStartTime) playStartTime = Date.now();
            hireNudgeTimer = setTimeout(showHireNudge, HIRE_NUDGE_PLAYTIME_MS);
        }

        function handleKey(e) {
            switch (e.key) {
                case 'ArrowUp': case 'w': setDirection(0, -1); break;
                case 'ArrowDown': case 's': setDirection(0, 1); break;
                case 'ArrowLeft': case 'a': setDirection(-1, 0); break;
                case 'ArrowRight': case 'd': setDirection(1, 0); break;
            }
        }

        startBtn.addEventListener('click', startGame);

        document.addEventListener('keydown', function (e) {
            const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
            if (keys.includes(e.key) && (document.activeElement === canvas || canvas.contains(document.activeElement))) {
                e.preventDefault();
                handleKey(e);
            }
        });

        dpadBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const dir = btn.getAttribute('data-dir');
                if (dir === 'up') setDirection(0, -1);
                if (dir === 'down') setDirection(0, 1);
                if (dir === 'left') setDirection(-1, 0);
                if (dir === 'right') setDirection(1, 0);
            });
        });

        // Draw an idle board before the first Start press
        snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
        food = { x: 12, y: 8 };
        running = false;
        draw();
    })();

});
