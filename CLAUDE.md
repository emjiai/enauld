# CLAUDE.md

This repository contains a static ENAULD Technology Health Research and Services website.

## Structure

- `frontend/` contains the deployable static site.
- `frontend/index.html` is the main single-page website.
- `frontend/Contact.html` is the standalone contact page.
- `frontend/project.html` is the per-project detail page; it reads `?id=<slug>` and renders from the shared data.
- `frontend/projects-data.js` is the single source of truth for the Track Record (`window.ENAULD_PROJECTS`); both `index.html` cards and `project.html` read from it.
- `frontend/image/` and `frontend/video/` hold per-project media named after each project `slug` (e.g. `image/who-oman.jpg`); the project page reveals its image/video card only when a matching file exists.
- `enauldthrs-website-full-content.md` is the source copy.
- `colour_theme.txt` is the source theme palette.

## Rules for Future Changes

- Keep the site light theme by default.
- Use the navy and burgundy palette from `colour_theme.txt`.
- Do not add a Pricing section or Pricing navigation item.
- Do not reintroduce old WorkerBull content.
- Preserve mobile responsiveness for nav, service cards, track record entries and publication links.

## Local Development

No build step is required. Serve `frontend/` with a static server or open `frontend/index.html` directly.
