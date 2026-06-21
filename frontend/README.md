# ENAULD Website

Static website for ENAULD Technology Health Research and Services.

## Running Locally

No build step is required. Open `index.html` directly in a browser or serve the directory with any static server:

```bash
npx serve .
```

Then visit `http://localhost:3000`.

## Project Structure

```text
frontend/
├── index.html        # Main ENAULD single-page site
├── Contact.html      # Standalone contact page
├── WorkerBull.html   # Redirect alias to index.html
├── public/           # Favicon and image assets
├── documentation/    # Deployment notes
└── vercel.json       # Static Vercel configuration
```

## Theme

The site uses a light navy and burgundy palette:

- Navy: `#0B1F3F`
- Burgundy: `#8B1A1A`
- Ink: `#0e1726`
- Muted text: `#5b6478`
- Soft background: `#f9fafc`

## Content

Source copy is in `../enauldthrs-website-full-content.md`. Theme notes are in `../colour_theme.txt`.
