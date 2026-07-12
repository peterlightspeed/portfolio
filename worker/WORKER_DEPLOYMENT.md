# Deploying the Contact Form Worker

This gets your contact form (with file attachments) working through a free
Cloudflare Worker + Resend, replacing the old Basin form backend. Everything
here is free-tier: Cloudflare Workers free plan (100,000 requests/day) and
Resend free plan (3,000 emails/month, attachments up to 40MB).

You do **not** need to know Cloudflare Workers already — follow these in order.

---

## 1. Create your accounts

1. **Cloudflare**: go to https://dash.cloudflare.com/sign-up and create a free account (or log in if you already have one for anything else).
2. **Resend**: go to https://resend.com/signup and create a free account.

## 2. Get a Resend API key

1. In the Resend dashboard, go to **API Keys** (left sidebar).
2. Click **Create API Key**, give it a name like `portfolio-contact-form`, and copy the key it shows you (you only see it once).
3. Keep this key somewhere safe for now — you'll paste it into Cloudflare in step 5, not into any file in this project.

**About the "from" address:** the Worker code currently sends from `onboarding@resend.dev`, which is Resend's built-in test sender — it works immediately with no setup, but emails may land in spam more often. When you're ready, verify your own domain in Resend (**Domains** → **Add Domain**, then add the DNS records they give you at your domain registrar) and update the `FROM_EMAIL` constant near the top of `worker/contact-worker.js` to something like `Peter Lightspeed <contact@yourdomain.com>`.

## 3. Install the Wrangler CLI (Cloudflare's deployment tool)

You'll need Node.js installed on your computer first (https://nodejs.org, LTS version). Then, in a terminal:

```bash
npm install -g wrangler
```

Log in to your Cloudflare account from the terminal:

```bash
wrangler login
```

This opens a browser tab to authorize the CLI — approve it.

## 4. Deploy the Worker

From inside this project's `worker/` folder:

```bash
cd worker
wrangler deploy
```

Wrangler will read `wrangler.toml` and deploy `contact-worker.js`. When it finishes, it prints a URL that looks like:

```
https://peter-contact-worker.<your-subdomain>.workers.dev
```

Copy that exact URL — you need it in step 6.

## 5. Add your Resend API key as a Worker secret

Never put the real API key directly in the code or in `wrangler.toml` (those files are visible in your public GitHub repo). Instead, store it as an encrypted secret:

```bash
wrangler secret put RESEND_API_KEY
```

It will prompt you to paste the key — paste the one you copied in step 2, then press Enter. Cloudflare stores it securely and makes it available to the Worker as `env.RESEND_API_KEY`.

## 6. Point the website at your deployed Worker

Two places in this repo currently have a placeholder URL that needs to become your real Worker URL from step 4:

1. `js/contact.js` — near the top:
   ```js
   const CONTACT_WORKER_URL = 'https://peter-contact-worker.YOUR-SUBDOMAIN.workers.dev';
   ```
2. `contact.html` — the form's `action` attribute (only used as a no-JavaScript fallback):
   ```html
   <form id="contactForm" action="https://peter-contact-worker.YOUR-SUBDOMAIN.workers.dev" ...>
   ```

Replace `YOUR-SUBDOMAIN` (and the whole placeholder if it differs) with your real URL from step 4 in both places, then redeploy/republish the site.

## 7. Update the allowed origin (CORS)

Near the top of `worker/contact-worker.js`:

```js
const ALLOWED_ORIGINS = [
    'https://peterlightspeed.github.io',
];
```

This should be the exact origin (protocol + domain, no path) your site is actually served from. If you ever move to a custom domain, add it here too, then run `wrangler deploy` again from the `worker/` folder to push the update.

## 8. Test it

1. Open your live contact page, fill out the form, attach a small test file, and submit.
2. Check the inbox at `petereluwade55@gmail.com` for the email with the attachment.
3. If something goes wrong, run `wrangler tail` from the `worker/` folder while you submit the form again — it streams live logs from the Worker, including the `console.error` messages already built into the script, so you can see exactly what failed (bad API key, CORS mismatch, Resend error, etc).

## Ongoing costs

Both free tiers are generous for a portfolio site:
- Cloudflare Workers: 100,000 requests/day free
- Resend: 3,000 emails/month free, attachments up to 40MB per email (well above the 10MB the form itself allows)

You will not be charged unless you explicitly upgrade either service.
