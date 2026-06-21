# Repository Guidelines

## Project Structure & Module Organization

This repository contains static marketing-site assets. The active site lives in `frontend/`.

- `frontend/index.html` is the homepage entry point.
- `frontend/*.html` contains standalone pages such as `Projects.html`, `Contact.html`, `Enroll.html`, and `BookConsultation.html`.
- `frontend/public/` stores images, the logo, and `favicon.ico`. Project thumbnails are named after project titles, for example `The Vault.png`.
- `frontend/documentation/` contains deployment notes for Vercel and Hostinger.
- Root files such as `enauldthrs-website-full-content.md`, `colour_theme.txt`, and `CLAUDE.md` provide content, theme, and agent context.

Each page is self-contained: CSS is in a `<style>` block and React components are in one `<script type="text/babel">` block.

## Build, Test, and Development Commands

Run commands from `frontend/` unless noted otherwise.

```bash
npx serve .
```

Serves the static site at `http://localhost:3000`. Use this instead of `file://` when testing EmailJS forms.

There is no build step. Vercel deploys files as-is using `frontend/vercel.json` with `"buildCommand": null` and `"outputDirectory": "."`.

## Coding Style & Naming Conventions

Use the existing single-file page pattern. Keep React loaded from the CDN and avoid introducing a package manager unless the project direction changes. Prefer function components and React hooks already used in the pages, especially `useState`, `useRef`, and `useEffect`.

Keep styling in vanilla CSS with custom properties. Preserve the dark-gold design system:

```css
--bg: #08080f;
--surface: #0e0e1a;
--gold: #c9a84c;
--white: #f0ede8;
--white-muted: #9896ae;
```

Use `Cormorant Garamond` for headings and `DM Sans` for body text. Name new pages with PascalCase when matching the existing pattern, for example `Masterclass.html`.

## Testing Guidelines

No automated test framework is configured. Validate changes manually by serving `frontend/` and checking affected pages in a browser. For form work, test through the local server and confirm EmailJS configuration placeholders or keys are correct. Check responsive layouts on mobile and desktop widths before shipping.

## Commit & Pull Request Guidelines

This checkout does not include Git history, so no project-specific commit convention can be inferred. Use short, imperative commit messages such as `Update contact form validation` or `Add project thumbnail assets`.

Pull requests should include a concise description, changed pages, manual test notes, linked issues if applicable, and screenshots for visual changes. Mention any new environment variables or EmailJS template changes.

## Security & Configuration Tips

Do not commit `.env` files or private EmailJS/Gmail credentials. Public EmailJS values may appear in static HTML when required, but document any replacements clearly and keep production secrets in the deployment platform.
