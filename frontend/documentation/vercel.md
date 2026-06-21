# Deployment Plan — GitHub to Vercel

---

## Why Vercel for a Static HTML Site

Vercel detects static HTML sites automatically — no framework config, no build command needed. It deploys straight from your GitHub repo, gives you a free `*.vercel.app` URL instantly, and connects your custom domain with automatic HTTPS in minutes.

---

## Prerequisites

- Code pushed to a GitHub repository
- A Vercel account (free) — sign up at [https://vercel.com](https://vercel.com) using your GitHub account

---

## Step 1 — Push to GitHub

If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

> `.env` will NOT be pushed — it is covered by `.gitignore`. ✓

---

## Step 2 — Import Your Repo into Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **Continue with GitHub** and authorise Vercel to access your repos
3. Find your repository in the list and click **Import**
4. On the **Configure Project** screen:
   - **Framework Preset**: leave as `Other` (Vercel auto-detects static HTML)
   - **Root Directory**: leave as `/` (default)
   - **Build Command**: leave **empty**
   - **Output Directory**: leave **empty**
   - **Install Command**: leave **empty**
5. Click **Deploy**

Vercel will deploy in about 30 seconds and give you a live URL like:
`https://your-repo-name.vercel.app`

---

## Step 3 — Add Environment Variables in Vercel

Because `.env` is gitignored, you must add your secrets manually in the Vercel dashboard.

1. Go to your project in the Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable one at a time:

| Name | Value | Environment |
|---|---|---|
| `EMAIL_HOST` | `smtp.gmail.com` | Production, Preview, Development |
| `EMAIL_PORT` | `587` | Production, Preview, Development |
| `EMAIL_HOST_USER` | `info@workerbull.com` | Production, Preview, Development |
| `EMAIL_HOST_PASSWORD` | *(your Gmail App Password)* | Production, Preview, Development |
| `EMAIL_USE_TLS` | `True` | Production, Preview, Development |
| `EMAILJS_PUBLIC_KEY` | `DhBapWbS8FZDIVHeP` | Production, Preview, Development |
| `EMAILJS_SERVICE_ID` | `service_workerbull` | Production, Preview, Development |
| `EMAILJS_TEMPLATE_CONTACT` | `template_contact` | Production, Preview, Development |
| `EMAILJS_TEMPLATE_BOOKING` | `template_booking` | Production, Preview, Development |

4. Click **Save** after each entry

> **Note:** For this static HTML site, these Vercel env vars are stored securely in Vercel's system and are for your reference. The EmailJS keys are already embedded in `Contact.html` and work directly in the browser — no server-side injection needed. If you later add a serverless function (e.g. `/api/send-email`), Vercel will inject these vars into it automatically.

---

## Step 4 — Connect Your Custom Domain

1. In your Vercel project → **Settings** → **Domains**
2. Type your domain (e.g. `workerbull.com`) and click **Add**
3. Vercel will show you DNS records to add. Choose one of two options:

### Option A — Domain registered at Vercel or supports nameserver change
Update nameservers at your registrar to:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Option B — Add DNS records manually (keep existing registrar)
Add these records at your domain registrar's DNS settings:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

4. DNS propagation takes up to 24 hours (usually under 30 minutes)
5. Vercel automatically provisions a **free SSL certificate** once DNS resolves — no action needed

---

## Step 5 — Verify Everything is Live

| Check | Expected |
|---|---|
| `https://yourdomain.com` | Homepage loads (index.html) |
| `https://yourdomain.com/Contact.html` | Contact form loads and sends email |
| Clicking a Track Record card | Opens `project.html#<slug>` with full details |
| Clicking a gallery image | Opens the modal with its caption |
| Favicon in browser tab | ✓ |
| Logo visible in nav | ✓ |
| `https://yourdomain.com/llm.txt` | LLM context file accessible |

---

## Day-to-Day Workflow (after setup)

Every push to `main` triggers an automatic redeploy — no manual steps needed:

```bash
# Make changes locally
git add .
git commit -m "describe your change"
git push origin main
# → Vercel redeploys automatically in ~30 seconds
```

Pull request branches also get a unique **preview URL** automatically, so you can test changes before merging to main.

---

## Summary

| Step | Where | Action |
|---|---|---|
| 1 | Terminal | Push code to GitHub |
| 2 | vercel.com/new | Import repo, no build config needed |
| 3 | Vercel → Settings → Env Vars | Add all keys from .env manually |
| 4 | Vercel → Settings → Domains | Add domain + DNS records |
| 5 | Browser | Verify live site and forms |
