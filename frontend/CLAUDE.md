# CLAUDE.md

This directory contains the static ENAULD Technology Health Research and Services website.

## Architecture

- `index.html` is the primary single-page site.
- `Contact.html` is a standalone contact page.
- Legacy route files redirect into the new ENAULD homepage or relevant section.
- There is no package manager, build step or backend.

## Styling

The site uses plain HTML, CSS and a small inline mobile-menu script. Keep the default theme light. Use the navy and burgundy palette from `../colour_theme.txt`:

- Navy: `#0B1F3F`
- Burgundy: `#8B1A1A`
- Ink: `#0e1726`
- Muted text: `#5b6478`
- Soft background: `#f9fafc`

## Content

Use `../enauldthrs-website-full-content.md` as the source of truth for copy. Do not reintroduce old WorkerBull content, pricing sections or AI-training programme pages.

## Development

Open `index.html` directly or serve the directory with a static server such as:

```bash
npx serve .
```
