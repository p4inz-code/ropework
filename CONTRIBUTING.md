# Contributing

The app's source is private, so there is no code to send a pull request against for the app itself. There are still useful ways to help.

## Test and tell us

Use the beta on a real or sample depot and open an issue for anything that broke, confused you or felt slow. The [tester guide](guides/tester-guide.md) lists what we most want to hear about. Short reports with exact steps are the most useful.

## Fix the guides or the website

The guides in `guides/` and the website in `site/` are public. If you spot a mistake or an unclear sentence, open an issue or a pull request.

To work on the site:

```bash
cd site
node build.mjs
node check.mjs
```

`check.mjs` fails if a page has no single heading, loads anything from outside the site, uses a system drop-down, or has a broken link. The site draws its own controls and scrollbars, so please keep it that way.

## Writing style

Write plainly. Say what happens, in short sentences. Avoid marketing words, long dashes and lists where every line starts with a bold label.

## Security

Report vulnerabilities privately, as described in [SECURITY.md](SECURITY.md).
