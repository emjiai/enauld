# Project videos

Drop project videos here. A project page shows its **Video** card only when a
matching file exists in this folder (or when the project has a `videoUrl` in
`../projects-data.js`, which embeds YouTube instead).

## Naming

Name the file after the project's `slug` (see `slug` in `../projects-data.js`):

```
video/<slug>.mp4          e.g.  video/who-oman.mp4
```

- Lowercase, hyphens, no spaces or accents — must match the slug exactly.
- Use `.mp4` (H.264) for broad browser support.
- Keep under ~50MB. For larger videos, add a `videoUrl` (YouTube link) to the
  project's entry in `../projects-data.js` instead of self-hosting — the page
  will embed it automatically.
