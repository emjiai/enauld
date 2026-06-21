# ENAULD Website Plan

The previous WorkerBull implementation has been replaced by a light-theme ENAULD website.

Current structure:

- `index.html`: ENAULD single-page site with Home, About, Services, Health, IMT, Team, Track Record, Gallery, Publications and Contact sections.
- `project.html`: per-project detail page; reads the slug from the URL hash (`project.html#<slug>`) and renders from `projects-data.js`.
- `projects-data.js`: single source of truth for the Track Record projects.
- `Contact.html`: standalone ENAULD contact page.

The old WorkerBull redirect stubs (`Projects.html`, `Enroll.html`, `Masterclass.html`, `BookConsultation.html`, `WorkerBull.html`) have been removed.

Future content changes should use `../../enauldthrs-website-full-content.md` and `../../colour_theme.txt` as source files.
