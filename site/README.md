# Ropework website

The public site for Ropework, at https://ropework.github.io. Plain static HTML and CSS built by one script, nothing loaded from another address, no cookies, no analytics.

```
node build.mjs     # builds dist/
node check.mjs     # checks dist/: no outside addresses, links work, one h1 per page, no system drop-downs, size limits
```

## Where things come from
- `src/tokens.css` is the colour, spacing and type file the app uses, so the site and the app look alike. `src/site.css` sets the page layout.
- `site.json` holds the name, tagline, footer and legal lines, and the form function's address. A rename is one edit here (and the logos in `src/brand`).
- `data/releases.json` is the app's `docs/release/notes.json`. `data/downloads.json` is written by the app repository's `tools/make-site-data.mjs`; **you attach the download links** by filling each file's `url` (or the one `baseUrl`). Links already attached are kept when it runs again.
- `data/known-issues.json` is kept by hand. `data/tester-guide.md` and `data/beta-notice.md` are copied from the app repository's `docs/release`.

## The forms
`worker/` is the small function behind the Request beta access and Contact forms (Resend, free tier). See `worker/README.md`. The Resend key is a secret of the function and must never be added to this repository, which is public.

## Publishing
GitHub Pages builds and publishes on every push to `main` (`.github/workflows/pages.yml`); the workflow fails if `check.mjs` fails.
