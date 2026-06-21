# ENAULD Website

Static website for ENAULD Technology Health Research and Services.

## Running Locally

No build step is required. Serve the directory with any static server (recommended, so that
`fetch`-based features like the gallery captions work):

```bash
npx serve .
```

Then visit `http://localhost:3000`.

> Opening `index.html` directly via `file://` works, but the browser blocks local `fetch`, so
> gallery image captions (`image/gallery/descriptions.json`) won't load. Use a static server to
> see the full site.

## Project Structure

```text
frontend/
├── index.html                      # Main ENAULD single-page site (hero, about, services,
│                                   #   team, track record, gallery carousel, publications, contact)
├── project.html                    # Per-project detail page; reads the slug from the URL hash
│                                   #   (project.html#<slug>) and renders from projects-data.js
├── projects-data.js                # Single source of truth for all track-record projects
│                                   #   (window.ENAULD_PROJECTS) used by index.html + project.html
├── Contact.html                    # Standalone contact page
├── public/                         # Favicon and section images (favicon.ico, enuald_1.jpg, ngozi.jpg)
├── image/
│   ├── gallery/                    # Carousel images gal_1.jpg … gal_10.jpg
│   │   └── descriptions.json       # Editable per-image captions shown in the click-to-zoom modal
│   └── <slug>.jpg                  # Optional per-project images (named after a project slug)
├── video/                          # Optional per-project videos (video/<slug>.mp4)
├── llm.txt                         # Plain-text site summary for LLMs/crawlers
└── vercel.json                     # Static Vercel configuration (no build step)
```

## Deploying to Vercel

The site is pure static files — there is **no build step**. `vercel.json` already pins the
correct settings: `buildCommand: null`, `outputDirectory: "."`, `cleanUrls: false`,
`trailingSlash: false`, and a rewrite of `/` → `/index.html`.

> Deploy from inside the `frontend/` directory — it is the project root. Do **not** deploy the
> repository root, or paths like `image/gallery/...` will not resolve.

### Option A — Vercel CLI (fastest)

1. Install the CLI once: `npm i -g vercel`
2. From `frontend/`, log in: `vercel login`
3. Deploy a preview: `vercel`
   - When prompted, accept the detected settings (framework: **Other**, build command: **none**,
     output directory: **.**). These come from `vercel.json`, so just confirm.
4. Promote to production: `vercel --prod`

The CLI prints the live URL after each deploy.

### Option B — Git + Vercel Dashboard (continuous deploys)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In the Vercel dashboard: **Add New… → Project** and import the repository.
3. Set **Root Directory** to `frontend` (Edit → select the `frontend` folder). This is the most
   important step.
4. Framework Preset: **Other**. Leave Build Command empty and Output Directory as `.`
   (`vercel.json` enforces this).
5. Click **Deploy**. Every push to the production branch then auto-deploys; pull requests get
   preview URLs.

### Custom domain

In the project's **Settings → Domains**, add your domain (e.g. `enauld.nl`) and follow the DNS
records Vercel shows (an `A`/`ALIAS` record for the apex and a `CNAME` for `www`). Vercel issues
HTTPS certificates automatically.

### Post-deploy checks

- Home page loads and the gallery carousel auto-scrolls.
- Clicking a Track Record card opens `project.html#<slug>` in a new tab with full details.
- Clicking a gallery image opens the modal with its caption.
- Favicon and the About/Team images render (paths under `public/`).

## Editing content

- **Projects** (track record + detail pages): edit `projects-data.js`. Add per-project media as
  `image/<slug>.jpg` / `video/<slug>.mp4` (the detail page reveals the card only if the file exists).
- **Gallery captions**: edit `image/gallery/descriptions.json` (keyed by filename, e.g. `"gal_1.jpg"`).
- **Source copy**: `../enauldthrs-website-full-content.md`. Theme notes: `../colour_theme.txt`.

## Theme

The site uses a light navy and burgundy palette:

- Navy: `#0B1F3F`
- Burgundy: `#8B1A1A`
- Ink: `#0e1726`
- Muted text: `#5b6478`
- Soft background: `#f9fafc`

Headings and body both use the **Outfit** font (Google Fonts).
