// Checks the built site (run after build.mjs). Fails (exit 1) on anything that breaks the rules the site keeps:
//   no address outside the site in any page, every internal link and anchor works, no system drop-down (select), one h1 per page,
//   a title, a language and a skip link on every page, and each page's CSS and script under 100 KB together.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const BASE = (process.env.SITE_BASE || "").replace(/\/$/, ""); // the project path the site is built for, if any

const dist = join(dirname(fileURLToPath(import.meta.url)), "dist");
const site = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "site.json"), "utf8"));
const problems = [];
const pages = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (n.endsWith(".html")) pages.push(p);
  }
})(dist);

const rel = (p) => p.slice(dist.length).replace(/\\/g, "/");
const target = (href, from) => {
  const path = href.split("#")[0].split("?")[0];
  const abs = path.startsWith("/") ? path : join(dirname(rel(from)), path).replace(/\\/g, "/");
  let f = join(dist, abs);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  return existsSync(f) ? f : null;
};
const ids = new Map();
const idsOf = (f) => {
  if (!ids.has(f)) ids.set(f, new Set([...readFileSync(f, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(f);
};
const cssjs = ["tokens.css", "site.css", "site.js", "theme.js"].reduce((n, f) => n + statSync(join(dist, f)).size, 0);
if (cssjs > 100 * 1024) problems.push(`CSS and script together are ${Math.round(cssjs / 1024)} KB (limit 100 KB)`);

for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const at = rel(file);
  if (!/<html lang="en">/.test(html)) problems.push(`${at}: no language`);
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${at}: no title`);
  if (!/class="skip"/.test(html)) problems.push(`${at}: no skip link`);
  if ((html.match(/<h1[ >]/g) ?? []).length !== 1) problems.push(`${at}: needs exactly one h1`);
  if (/\sstyle="/.test(html)) problems.push(`${at}: an inline style (the page policy blocks it)`);
  if (/<select[\s>]/.test(html)) problems.push(`${at}: a system drop-down (select) is not allowed`);
  if (/<script(?![^>]*\ssrc=)(?![^>]*type="application\/ld\+json")[^>]*>/.test(html)) problems.push(`${at}: an inline script`);
  for (const m of html.matchAll(/(src|href)="([^"]+)"/g)) {
    const url = m[2];
    if (/^mailto:/.test(url)) continue;
    // the only places a page may link to outside itself: the project's own public repository (downloads, issues); nothing is ever loaded from outside
    if (/^https:\/\/github\.com\/p4inz-code\/ropework(\/|$)/.test(url)) continue;
    // plain links (never loaded content) to the maker's other public projects are allowed
    if (m[1] === "href" && /^https:\/\/(github\.com\/p4inz-code(\/|$)|p4inz-code\.github\.io\/)/.test(url)) continue;
    if (/^(https?:)?\/\//.test(url)) {
      problems.push(`${at}: an address outside the site: ${url}`);
      continue;
    }
    if (url.startsWith("#")) {
      if (url.length > 1 && !idsOf(file).has(url.slice(1))) problems.push(`${at}: anchor ${url} not found`);
      continue;
    }
    const f = target(BASE && url.startsWith(BASE + "/") ? url.slice(BASE.length) : url, file);
    if (!f) problems.push(`${at}: link ${url} leads nowhere`);
    else if (url.includes("#") && f.endsWith(".html") && !idsOf(f).has(url.split("#")[1])) problems.push(`${at}: anchor in ${url} not found`);
  }
  // no image without text for people who cannot see it (decorative images use an empty alt on purpose)
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) problems.push(`${at}: an image without alt`);
}
const csp = readFileSync(join(dist, "index.html"), "utf8").match(/Content-Security-Policy" content="([^"]+)"/)?.[1] ?? "";
for (const bad of ["unsafe-eval", "unsafe-inline", " http:", " https:", "*"]) if (new RegExp(`(?:script|style|default)-src[^;]*${bad.replace("*", "\\*")}`).test(csp)) problems.push(`content policy contains ${bad.trim()}`);
if (site.formEndpoint && !csp.includes(new URL(site.formEndpoint).origin)) problems.push("content policy does not allow the form endpoint");

if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`\n${problems.length} problem(s) in ${pages.length} pages`);
  process.exit(1);
}
console.log(`ok: ${pages.length} pages, ${Math.round(cssjs / 1024)} KB of CSS and script, no outside addresses, all links work`);

// nothing native or default on the site either (project rule): no system drop-down, disclosure, media controls or file/date/color inputs
{
  const { readdirSync } = await import("node:fs");
  const found = [];
  const walkDir = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      statSync(p).isDirectory() ? walkDir(p) : /\.html$/.test(n) && scan(p);
    }
  };
  const scan = (p) => {
    const html = readFileSync(p, "utf8");
    for (const re of [/<select[\s>]/, /<details[\s>]|<summary[\s>]/, /<(audio|video)[^>]*controls/, /type="(date|time|color|file|range)"/, /<progress[\s>]|<dialog[\s>]/]) if (re.test(html)) found.push(`${p}: native element ${re}`);
  };
  walkDir(dist);
  if (found.length) {
    console.log(found.join("\n"));
    console.log(`${found.length} native element(s) on the site`);
    process.exit(1);
  }
}

// Claims about what is built or not live in data/status.json only. A hand-written copy elsewhere is how a list goes stale,
// so the markdown a visitor can read must point to the generated page instead of repeating it.
{
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const stale = [];
  const mdFiles = ["README.md", "SUPPORT.md", "CONTRIBUTING.md", "legal/PRIVACY.md", "legal/TERMS.md"];
  for (const n of readdirSync(join(root, "guides"))) if (n.endsWith(".md")) mdFiles.push("guides/" + n);
  for (const f of mdFiles) {
    if (!existsSync(join(root, f))) continue;
    const text = readFileSync(join(root, f), "utf8");
    if (/not built yet|are not built|is not built/i.test(text.replace(/\[[^\]]*not built yet[^\]]*\]\([^)]*\)/gi, ""))) stale.push(`${f}: a hand-written "not built" claim; link to the known issues page instead`);
  }
  if (stale.length) {
    console.log(stale.join("\n"));
    process.exit(1);
  }
}

// No emoji anywhere on the site: icons are Lucide SVGs from src/icons.json only.
{
  const emoji = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u2B50\u2B06]/u;
  const found = [];
  const walk = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(html|css|js|json|txt|xml)$/.test(n) && emoji.test(readFileSync(p, "utf8"))) found.push(p);
    }
  };
  walk(join(dirname(fileURLToPath(import.meta.url)), "dist"));
  if (found.length) {
    console.log("emoji found in:\n" + found.join("\n"));
    process.exit(1);
  }
}
