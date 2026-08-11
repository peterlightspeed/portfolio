# TODO

Running list of things that need your input or a decision. Check items off as you go; this file isn't read by the build, it's just for you.

## ✅ Resolved this round
- **Degree conflict** — confirmed Lagos State University (Jan 2026 - Jan 2030) is correct. `data/experience.json` updated, no longer shows University of The People.
- **Screenshots** — Cedarville, Coach Gideon, and Hope Assessment App now have real screenshots (converted to WebP, ~95% smaller than the originals you sent). PLS Nexus Talent Intelligence is correctly marked as having no screenshot possible (backend-only API, no UI exists). Coach Gideon's site is still being worked on — the screenshot in place is from what exists now; swap it whenever the site changes meaningfully.
- **Case studies for Coach Gideon / Cedarville / Hope Assessment App** — you said you don't remember the specifics well enough. Honored that: no case study was written for these, and I won't ask again unless you bring it up. Their project descriptions stand on their own.
- **Performance — images** — converted the 22 largest referenced images sitewide (backgrounds, profile photos, certificate logos, testimonial avatars, service images, the 4 product screenshots) from PNG/JPG to WebP. Total: 6.7MB → 1.5MB just for these, ~78% smaller, plus the new project screenshots. Every reference across `data/`, `css/`, `_legacy/`, `templates/` was updated to match — verified zero broken links/images after.

## Still open

### DataFlow AI
Acknowledged — update `status`/`statusLabel`/`links` in `data/products.json` whenever it moves past ~v0.5 or goes public. No action needed until then.

### Not yet fully on the CMS
`contact.html`, `labs.html`, `sax.html`, `sponsor.html`, `demo.html` still have hand-written bodies. You said "let's fix it" — this is a bigger job than the image pass; I'll take `sponsor.html` next since it fits the `services.json` pattern directly, unless you'd rather I do a different one first.

### Remaining performance items
- 3 images in the repo are currently unused by any page (`bot-img.jpeg`, `peterphonist_3.png`, `virtual-assistant.jpg`) — not a performance cost (browsers never fetch unreferenced files) but worth deleting for repo hygiene if you don't need them.
- Bootstrap/AOS still load from public CDNs (jsdelivr/unpkg) rather than self-hosted.

### How to run a real Lighthouse audit (you asked)
1. Push this to GitHub and let it deploy (see below), or run `npm run build && npm run serve` locally.
2. Open the site in Chrome.
3. Right-click anywhere → Inspect → click the **Lighthouse** tab in DevTools (if you don't see it, click the `>>` overflow menu).
4. Check all four categories (Performance, Accessibility, Best Practices, SEO), leave device on "Mobile," click **Analyze page load**.
5. It'll give you a 0-100 score per category plus a specific list of what to fix, ranked by impact. Screenshot or paste me the results and I'll act on them directly.

### How to set the GitHub Pages source (you asked)
1. Go to your repo on GitHub → **Settings** tab.
2. In the left sidebar, click **Pages**.
3. Under "Build and deployment" → "Source," change the dropdown from "Deploy from a branch" to **"GitHub Actions."**
4. That's it — no branch to pick, no folder to configure. The next `git push` to `main` will trigger `.github/workflows/build.yml`, which builds and deploys automatically.
5. You'll see the deployment progress under the repo's **Actions** tab. A green checkmark means it's live at your GitHub Pages URL.

## Process
- [ ] Run the Lighthouse audit above once deployed and send me the results.
- [ ] Set the GitHub Pages source as above (one-time, ~30 seconds).

## Contact form — "shows error but still sends" (action needed from you — this is the same issue reported again, still needs the manual step below)
This is a **CORS mismatch between what's live on Cloudflare and what's in this repo** — I've now confirmed the code itself is correct on both the form and the Worker side (checked the form's `action` matches the JS fetch URL exactly, checked `e.preventDefault()` fires correctly, checked `ALLOWED_ORIGINS` in the source already lists `https://peterlightspeed.github.io` correctly). The problem is specifically that **editing `worker/contact-worker.js` in this repo never updates what's actually running on Cloudflare** — that's a separate service you deploy to manually, it's not part of the GitHub Actions build. If your *live* Worker still has different code than what's in this repo, the email genuinely sends, but the browser blocks your page from reading the "it worked" response — so the form shows an error even though the message went through.

**Step-by-step fix — no command line or software install needed:**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and log in.
2. Click **Workers & Pages** in the left sidebar.
3. Click on your existing contact-form Worker (it's whatever you named it when you first created it).
4. Click **Edit Code** (sometimes labeled "Quick Edit").
5. Select all the code in the editor (Ctrl+A / Cmd+A) and delete it.
6. Open `worker/contact-worker.js` from this zip, copy its entire contents, and paste it into the Cloudflare editor.
7. Click **Save and Deploy**.
8. Test your contact form again.

**How to check it worked, without guessing:** visit your Worker's URL directly in a browser (the same URL that's in `js/contact.js`'s `CONTACT_WORKER_URL`, and in `contact.html`'s form `action` attribute — they should match). You'll get back a small JSON status page confirming the Worker is live and showing exactly which origins it currently allows. If `allowedOrigins` doesn't show `https://peterlightspeed.github.io`, the deploy above didn't take — try again. (I added this diagnostic endpoint this round specifically so you can self-check this without needing DevTools or asking me to guess.)

- [x] Made the error message itself smarter in the meantime: `js/contact.js` distinguishes this specific failure mode (a `TypeError`, which is what the browser throws for CORS/network-level failures) from a genuine send failure, and tells you your message may have gone through instead of implying total failure.
- [x] Added a GET-based self-diagnostic to the Worker itself (see above) so you can verify what's actually deployed without needing my help to check.
- [ ] **You still need to do the redeploy above** — no code change on my end can complete this step; it requires access to your Cloudflare account.
