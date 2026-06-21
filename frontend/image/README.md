# Project images

Drop project images here. A project page shows its **Images** card only when at
least one matching file exists in this folder.

## Naming

Name the file after the project's `slug` (see `slug` in `../projects-data.js`):

```
image/<slug>.jpg          e.g.  image/who-oman.jpg
```

- Lowercase, hyphens, no spaces or accents — must match the slug exactly.
- Multiple images for one project: add a number suffix, in order:
  `image/who-oman-1.jpg`, `image/who-oman-2.jpg`, … (stops at the first gap).
- Allowed types: `.jpg`, `.jpeg`, `.png`, `.webp`. Keep ≤ ~1600px wide / ≤ ~500KB.
- Optional video poster: `image/<slug>-poster.jpg`.

## Slugs

See the slug table in `../../project_update.md`, or the `slug` field of each
entry in `../projects-data.js`.
