# Deployment Plan — GitHub to Hostinger

---

## Step 1 — Push to GitHub

Before deploying, make sure all files are committed and pushed.

```bash
git init                          # only if not already a git repo
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

> The site has no secrets to deploy; `.env` files stay gitignored by default. ✓

---

## Step 2 — Connect GitHub to Hostinger (Git Auto-Deploy)

Hostinger has a built-in Git integration in hPanel that pulls directly from your GitHub repo.

1. Log in to **Hostinger hPanel**
2. Go to **Advanced** → **Git**
3. Click **Create Repository**
4. Fill in:
   - **Repository URL**: paste your GitHub repo URL (e.g. `https://github.com/YOUR_USERNAME/YOUR_REPO.git`)
   - **Branch**: `main`
   - **Directory**: `public_html` (this is your web root — where files are served from)
5. Click **Create**
6. Hostinger will clone your repo into `public_html/`

> If you see an authentication prompt, use a **GitHub Personal Access Token** (not your password):
> - GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic) → Generate new token
> - Tick `repo` scope → Generate
> - Paste the token as the password when prompted

---

## Step 3 — Set Up Auto-Deploy Webhook (so live site updates on every push)

1. In hPanel → **Git** → find your repository → copy the **Deploy URL** (webhook URL)
2. Go to your **GitHub repo** → Settings → Webhooks → Add webhook
3. Paste the Deploy URL into **Payload URL**
4. Set **Content type** to `application/json`
5. Select **Just the push event**
6. Click **Add webhook**

From now on, every `git push` to `main` will automatically update the live site on Hostinger.

---

## Step 4 — Environment Variables (none required)

This site is fully static and needs **no environment variables** and no `.env` file on the
server. There is no contact form or EmailJS integration — the Contact page uses a plain
`mailto:` link. You can skip this step entirely.

---

## Step 5 — Connect Your Domain

1. In hPanel → **Domains** → **Add Domain** (if not already added)
2. If your domain is registered at Hostinger: it is likely already pointed at your hosting
3. If your domain is registered elsewhere (e.g. GoDaddy, Namecheap): update the nameservers to:
   - `ns1.dns-parking.com`
   - `ns2.dns-parking.com`
4. DNS changes take up to 24 hours (usually under 1 hour)

---

## Step 6 — Enable HTTPS / SSL

1. In hPanel → **Security** → **SSL**
2. Click **Install** next to your domain (free Let's Encrypt certificate)
3. Enable **Force HTTPS** so all `http://` traffic redirects to `https://`

---

## Step 7 — Verify Everything is Live

| Check | Expected |
|---|---|
| `https://yourdomain.com` | Homepage loads (index.html) |
| `https://yourdomain.com/Contact.html` | Contact page loads |
| Clicking a Track Record card | Opens `project.html#<slug>` with full details |
| Clicking the email link | Opens mail client to `info@enauld.nl` |
| Favicon in browser tab | ✓ |
| Logo visible in nav | ✓ |

---

## Day-to-Day Workflow (after setup)

```bash
# Make changes locally
git add .
git commit -m "describe your change"
git push origin main
# → Hostinger auto-deploys within seconds via webhook
```

---

## Summary

| Step | Where | Action |
|---|---|---|
| 1 | Terminal | Push code to GitHub |
| 2 | hPanel → Git | Connect GitHub repo to public_html |
| 3 | GitHub + hPanel | Set up auto-deploy webhook |
| 4 | — | No environment variables required |
| 5 | hPanel → Domains | Point domain to hosting |
| 6 | hPanel → SSL | Install free HTTPS certificate |
| 7 | Browser | Verify live site |
