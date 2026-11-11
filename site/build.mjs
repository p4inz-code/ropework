// Builds the Ropework website into dist/: plain static HTML and CSS, no framework in the page, nothing loaded from another address.
//   node build.mjs            (reads site.json, data/*.json, data/*.md, src/*)
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(root, p), "utf8");
const site = JSON.parse(read("site.json"));
const base = (process.env.SITE_BASE || "").replace(/\/$/, ""); // "/ropework" when the site lives under a project path (GitHub Pages project site)
const rebase = (text) => (base ? text.replace(/(href|src|action)="\//g, `$1="${base}/`).replace(/url\("\//g, `url("${base}/`) : text);
if (process.env.SITE_FORM_ENDPOINT) site.formEndpoint = process.env.SITE_FORM_ENDPOINT; // for tests only
const icons = JSON.parse(read("src/icons.json"));
const releases = JSON.parse(read("data/releases.json"));
const downloads = JSON.parse(read("data/downloads.json"));
const known = JSON.parse(read("data/known-issues.json"));
const dist = join(root, process.env.SITE_OUT ?? "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ico = (name, extra = "") => (icons[name] ?? "").replace("<svg", `<svg class="ico ${extra}"`);
const date = (iso) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const mb = (bytes) => (bytes / 1048576 >= 10 ? Math.round(bytes / 1048576) : Math.round((bytes / 1048576) * 10) / 10) + " MB";

// ---------------------------------------------------------------- a small Markdown reader (headings, lists, code, bold, links)
function md(src) {
  const inline = (t) =>
    esc(t)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  const out = [];
  let list = null;
  let code = null;
  const close = () => {
    if (list) out.push(`</${list}>`);
    list = null;
  };
  for (const line of src.split(/\r?\n/)) {
    if (line.startsWith("```")) {
      if (code === null) {
        close();
        code = [];
      } else {
        out.push(`<pre class="code"><code>${esc(code.join("\n"))}</code></pre>`);
        code = null;
      }
      continue;
    }
    if (code !== null) {
      code.push(line);
      continue;
    }
    let m;
    if ((m = /^(#{1,3})\s+(.*)$/.exec(line))) {
      close();
      // the page has its own h1; headings in the text start at h2
      const level = Math.min(m[1].length + 1, 4);
      out.push(`<h${level}>${inline(m[2])}</h${level}>`);
    } else if ((m = /^\s*[-*]\s+(.*)$/.exec(line))) {
      if (list !== "ul") {
        close();
        out.push("<ul>");
        list = "ul";
      }
      out.push(`<li>${inline(m[1])}</li>`);
    } else if ((m = /^\s*\d+\.\s+(.*)$/.exec(line))) {
      if (list !== "ol") {
        close();
        out.push("<ol>");
        list = "ol";
      }
      out.push(`<li>${inline(m[1])}</li>`);
    } else if (line.trim() === "") close();
    else {
      close();
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  close();
  return out.join("\n");
}

// ---------------------------------------------------------------- page shell
const NAV = [
  ["Features", "/features/"],
  ["Pricing", "/pricing/"],
  ["Migrate", "/migrate/"],
  ["Docs", "/docs/"],
  ["Releases", "/releases/"],
];
const FOOT = {
  Product: [["Features", "/features/"], ["Pricing", "/pricing/"], ["Download", "/download/"], ["Releases", "/releases/"], ["Known issues", "/known-issues/"]],
  Learn: [["Docs", "/docs/"], ["Migrate from P4V", "/migrate/"], ["Privacy and security", "/privacy/"]],
  Company: [["Contact", "/contact/"], ["Get the beta", "/request/"], ["Beta terms", "/terms/"]],
};

function shell({ path, title, description, body, hero }) {
  const here = (href) => (path === href || (href !== "/" && path.startsWith(href)) ? ' aria-current="page"' : "");
  const nav = NAV.map(([t, h]) => `<a href="${h}"${here(h)}>${t}</a>`).join("");
  const foot = Object.entries(FOOT)
    .map(([h, links]) => `<div><h4>${h}</h4><ul>${links.map(([t, u]) => `<li><a href="${u}">${t}</a></li>`).join("")}</ul></div>`)
    .join("");
  const full = path === "/" ? site.name : `${title} · ${site.name}`;
  const csp = `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' ${site.formEndpoint ? new URL(site.formEndpoint).origin : ""}; object-src 'none'; base-uri 'none'; form-action 'none'`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<meta name="description" content="${esc(description ?? site.tagline)}">
<meta name="color-scheme" content="light dark">
<meta name="form-endpoint" content="${esc(site.formEndpoint)}">
<title>${esc(full)}</title>
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/tokens.css">
<link rel="stylesheet" href="/site.css">
<script src="/theme.js"></script>
</head>
<body>
<a class="skip" href="#main">Skip to the content</a>
<header class="site-head"><div class="wrap">
<a class="brand" href="/" aria-label="${esc(site.name)} home"><img class="logo-light" src="/brand/ropework-lockup-light.svg" alt="" width="177" height="36"><img class="logo-dark" src="/brand/ropework-lockup-dark.svg" alt="" width="177" height="36"></a>
<nav class="nav" aria-label="Main">${nav}</nav>
<a class="btn primary small head-cta" href="/download/">Download the beta</a>
<div class="menu"><button type="button" class="menu-btn" data-toggle="menu-panel" aria-expanded="false" aria-controls="menu-panel">${ico("Menu")} Menu</button><div class="menu-panel" id="menu-panel" hidden>${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join("")}<a href="/download/">Download the beta</a><a href="/request/">Request beta access</a></div></div>
</div></header>
<main id="main">
${hero ?? `<section class="page-title"><div class="wrap"><h1>${esc(title)}</h1>${description ? `<p>${esc(description)}</p>` : ""}</div></section>`}
${body}
</main>
<footer class="site-foot"><div class="wrap">
<div class="foot-grid">
<div><a class="brand" href="/" aria-label="${esc(site.name)} home"><img class="logo-light" src="/brand/ropework-lockup-light.svg" alt="" width="148" height="30"><img class="logo-dark" src="/brand/ropework-lockup-dark.svg" alt="" width="148" height="30"></a><p class="brand-line">${esc(site.footerLine)}</p></div>
${foot}
</div>
<div class="foot-base"><span>${esc(site.legalLine)}</span><span class="theme" role="group" aria-label="Theme"><button type="button" data-theme-set="system" aria-pressed="true">System</button><button type="button" data-theme-set="light" aria-pressed="false">Light</button><button type="button" data-theme-set="dark" aria-pressed="false">Dark</button></span><span>© ${site.year} ${esc(site.owner)}</span></div>
</div></footer>
<script src="/site.js" defer></script>
</body>
</html>`;
}

const pages = [];
const page = (path, o) => pages.push({ path, ...o });

// ---------------------------------------------------------------- Home (W01)
page("/", {
  title: "Home",
  description: site.tagline,
  hero: `<section class="hero"><div class="wrap hero-grid"><div>
<p class="eyebrow">${esc(site.tagline)}</p>
<h1>Version control that stays calm when the files are huge</h1>
<p class="lead">Ropework is for Unreal artists and tech artists. It shows what will happen before it happens, undoes what it did, and keeps your files and server details on your network.</p>
<div class="cta-row"><a class="btn primary" href="/download/">Download the free beta</a><a class="btn" href="/pricing/">See pricing</a></div>
<p class="facts">Windows 11 now, Ubuntu 24.04 next · works with your existing server · no telemetry</p>
</div>
<div class="appcard" role="img" aria-label="A sketch of the Ropework file list: Hero_Rig.uasset needs resolve, ClimbComponent.cpp is edited by you, Hero_Face.fbx is locked by tomasz.k, Hero_LOD2.fbx is not downloaded, and Get latest is at 412 of 663 files.">
<div class="row"><span class="dot"></span><span class="name">northlight-p4:1666</span><span class="pill">Submit...</span></div>
<div class="row"><span class="name">Hero_Rig.uasset</span><span class="state">needs resolve</span></div>
<div class="row"><span class="name">ClimbComponent.cpp</span><span class="state">edited by you</span></div>
<div class="row"><span class="name">Hero_Face.fbx</span><span class="state">locked by tomasz.k</span></div>
<div class="row"><span class="name">Hero_LOD2.fbx</span><span class="state">not downloaded</span></div>
<div class="row"><span>Get latest · 412 / 663 files</span><span class="bar"><i></i></span><span class="state" style="margin-inline-start:auto">You can keep working.</span></div>
</div></div></section>`,
  body: `<section class="band"><div class="wrap">
<div class="points">
<div class="point">${ico("LayoutGrid")}<h3>Artist first</h3><p>Big thumbnails, the lock in plain words, and two buttons: Get latest and Submit.</p></div>
<div class="point">${ico("Eye")}<h3>Preview before change</h3><p>Every Get latest, revert and unshelve shows what it will touch first.</p></div>
<div class="point">${ico("Undo2")}<h3>Undo for 14 days</h3><p>Safety copies before anything lossy. Undo from the notification.</p></div>
<div class="point">${ico("ShieldCheck")}<h3>Private</h3><p>Your files and server details stay on your network. No telemetry and no automatic update check.</p></div>
</div></div></section>
<section class="band tint edge"><div class="wrap">
<h2 class="section">New in the beta</h2>
<div class="points three">
<div class="point">${ico("Box")}<h3>3D previews that stay safe</h3><p>Open glTF, FBX, OBJ, STL, PLY and USD models in a sandboxed viewer, with textures, animation, measuring and a Low, Mid and High quality that fits your computer.</p></div>
<div class="point">${ico("Shuffle")}<h3>Compare two versions</h3><p>Lay an older version of a model over a newer one with the changes in heat colours, or slide a divider between them.</p></div>
<div class="point">${ico("ExternalLink")}<h3>Open in your other programs</h3><p>Blender, Maya, Photoshop, Substance Painter and more, found on your computer. A read-only copy opens, so nothing saved there can change your file.</p></div>
</div>
<p style="margin-top:28px"><a class="btn" href="/features/">All features</a></p>
</div></section>
<section class="band edge"><div class="wrap"><div class="notice good">${ico("CircleCheck")}<p><strong>The beta is free and open.</strong> <a href="/download/">Download the installer</a> and start; no key is needed during the beta. Questions and bugs go to <a href="https://github.com/p4inz-code/ropework/issues" rel="noopener">the issue tracker</a>.</p></div></div></section>`,
});

// ---------------------------------------------------------------- Features (W02)
const today = [
  ["LayoutGrid", "Artist layout", "A grid of thumbnails with state you can read without colour, and the two buttons artists need."],
  ["ListChecks", "Blockers, not grey buttons", "A Submit that cannot run says why and offers each fix."],
  ["Undo2", "A safety net", "A safety copy before anything lossy, kept for 14 days. Undo from the notification."],
  ["BookmarkCheck", "Checkpoints", "Save your open work to the server as a shelf and go back to it, with an undo."],
  ["Eye", "Preview before change", "Get latest, revert and unshelve show what they will touch first."],
  ["Box", "Previews that stay safe", "Images, text, audio and video, and 3D models (glTF, FBX, OBJ, STL, PLY, USD) with textures, animation, measuring and compare. Previews never run a file's own code."],
  ["ExternalLink", "Open in", "Photoshop, Substance Painter, Blender, Maya and more, found on your computer; a read-only copy opens."],
  ["Shuffle", "Resolve and merge", "Merge automatically, keep yours, take theirs, or choose for each clash by hand, with a safety copy first."],
  ["FileText", "History and who changed what", "A file's revisions, who last changed each line, and what changed between two versions."],
];
const coming = [
  ["GitFork", "Streams without fear", "Merge down and copy up explain what will happen before they run."],
  ["Building2", "Studio profiles", "Ship layouts, templates, rules and locks to the whole studio, each lock with a reason."],
  ["Puzzle", "Extensions and an AI agent, off by default", "Add columns, panels and commands; an agent can only propose, you approve."],
  ["Eye", "Review workspace", "Preview, annotate and decide in a read-only workspace. Quality gates, rounds and reports."],
];
page("/features/", {
  title: "Everything you do daily, made calm",
  description: "What the beta does today, and what is coming.",
  body: `<section class="band"><div class="wrap">
<h2 class="section">In the beta today</h2>
<div class="cards">${today.map(([i, t, d]) => `<div class="card">${ico(i)}<h3>${t}</h3><p>${d}</p></div>`).join("")}</div>
</div></section>
<section class="band tint edge"><div class="wrap">
<h2 class="section">Coming</h2>
<div class="cards">${coming.map(([i, t, d]) => `<div class="card">${ico(i)}<h3>${t}</h3><p>${d}</p><span class="soon">Not in the beta yet</span></div>`).join("")}</div>
<p class="muted" style="margin-top:24px">Every feature will be in every plan. See <a href="/releases/">Releases</a> for what each beta added.</p>
</div></section>`,
});

// ---------------------------------------------------------------- Pricing (W03)
const plans = [
  ["Free", "€0", "up to 7 seats · registration needed", "Every feature, Review included. Register once to get your key. Community support."],
  ["8 to 25 seats", "€29", "a month, flat per studio", "Every feature. Email support within two working days."],
  ["26 to 100 seats", "€59", "a month, flat per studio", "Every feature. Priority email support and onboarding help."],
  ["Over 100 seats", "€99", "a month, flat per studio", "Every feature. Priority support and a named contact."],
];
page("/pricing/", {
  title: "One flat price per studio",
  description: "Every plan has every feature, including the Review workspace and previews. Plans differ only by seats and support.",
  body: `<section class="band"><div class="wrap">
<div class="notice info" style="margin:0 0 28px 0">${ico("Info")}<p><strong>The beta is free.</strong> These prices apply after the beta, when paid plans open. Nothing can be bought on this site yet; the buttons start a request.</p></div>
<div class="plans">${plans.map(([n, p, s, d]) => `<div class="card plan"><h3>${n}</h3><div class="price"><b>${p}</b><span>${s}</span></div><p>${d}</p><a class="btn block" href="/request/?plan=${encodeURIComponent(n)}">Ask about this plan</a></div>`).join("")}</div>
<div class="notice good">${ico("CircleCheck")}<p><strong>Founding Studio promise.</strong> Studios that join in the first year keep their price for 36 months, while subscribed.</p></div>
</div></section>
<section class="band tint edge"><div class="wrap"><h2 class="section">Questions</h2><div class="faq">
<div><h3>Is it per seat?</h3><p>No. One flat price per studio, by the number of people using it.</p></div>
<div><h3>What does the beta cost?</h3><p>Nothing. Beta keys are free until 1.0.</p></div>
<div><h3>What is the Founding Studio promise?</h3><p>Studios that join in the first year keep their price for 36 months.</p></div>
<div><h3>What if the licence check cannot reach you?</h3><p>After a grace period (14 days on paid plans, 10 on the free plan) the app becomes read-only. Nothing is deleted or hidden; one successful check restores everything. Beta keys never go read-only.</p></div>
<div><h3>What about closed networks?</h3><p>Every paid plan can use an offline licence file at no extra charge. Ask us; it is valid for 90 days and then renewed.</p></div>
</div></div></section>`,
});

// ---------------------------------------------------------------- Migrate (W04)
page("/migrate/", {
  title: "Migrate from P4V",
  description: "Switch at your own pace. Nothing on your server changes.",
  body: `<section class="band"><div class="wrap split">
<ol class="steps">
<li><h3>Install next to P4V</h3><p>Same server, same workspaces, nothing to convert. Use both side by side while you switch.</p></li>
<li><h3>Sign in to your server</h3><p>The first start finds the free <code>p4</code> command-line client, asks for your server and user, and lists your workspaces.</p></li>
<li><h3>Learn the few differences</h3><p>Files show their state in words, a button that cannot run says why, and Get latest shows what it will change first. The <a href="/docs/tester-guide/">tester guide</a> walks through it.</p></li>
<li><h3>Roll out to the studio</h3><p>Today each person installs it with their own key. Shared studio profiles with layouts, templates and rules are planned.</p></li>
</ol>
<div><h2 class="section" style="font-size:22px">What carries over</h2>
<table class="table"><thead><tr><th scope="col">From P4V</th><th scope="col">In Ropework</th></tr></thead><tbody>
<tr><td>Server, workspaces and files</td><td>Used as they are: nothing is converted or moved</td></tr>
<tr><td>Connections and favourites</td><td>Entered once (importing them is planned)</td></tr>
<tr><td>Custom tools, bookmarks, shortcuts</td><td>Not imported yet; planned for a later release</td></tr>
<tr><td>Passwords</td><td>Never stored: you sign in again, and the server's ticket is kept by <code>p4</code></td></tr>
</tbody></table></div>
</div></section>`,
});

// ---------------------------------------------------------------- Download manager (W05)
const winRel = downloads.releases;
const fileRow = (r, f) => {
  const url = f.url || (downloads.baseUrl ? downloads.baseUrl + encodeURIComponent(f.name) : "");
  return `<div class="file"><div><div class="fname">${esc(f.name)}</div><div class="meta">${mb(f.size)} · ${esc(f.label)}</div><div class="sum"><span>SHA-256 ${esc(f.sha256)}</span><button class="copy" type="button" data-copy="${esc(f.sha256)}" aria-label="Copy the checksum of ${esc(f.name)}">${ico("Copy")} Copy</button></div></div>
${url ? `<a class="btn primary" href="${esc(url)}" rel="noopener">${ico("Download")} Download</a>` : `<span class="btn primary" aria-disabled="true">${ico("Download")} Link not attached yet</span>`}</div>`;
};
const latest = winRel[0];
const meta = (r) => `Version ${esc(r.version)} · <span class="pill ${esc(r.channel)}">${esc(r.channel)}</span> · ${date(r.date)}`;
page("/download/", {
  title: "Download the beta",
  description: "The beta is free and open. Download an installer and start; every file has a checksum you can check.",
  body: `<section class="band"><div class="wrap">
<div class="dl-tabs" role="tablist" aria-label="Platform">
<button type="button" role="tab" id="tab-win" aria-selected="true" aria-controls="panel-win" data-tab="win">${ico("Monitor")} Windows 11</button>
<button type="button" role="tab" id="tab-linux" aria-selected="false" aria-controls="panel-linux" data-tab="linux" tabindex="-1">${ico("Server")} Ubuntu 24.04</button>
</div>
<div id="panel-win" role="tabpanel" aria-labelledby="tab-win" data-panel="win">
${
  latest
    ? `<div class="dl-head"><h2>Latest</h2><span class="muted">${meta(latest)}</span> <a href="/releases/#v${esc(latest.version)}">What's new</a></div>
<div class="files">${latest.files.map((f) => fileRow(latest, f)).join("")}</div>`
    : `<p>No release is listed yet.</p>`
}
<div class="notice info">${ico("Info")}<p>You also need the free <code>p4</code> command-line client from Perforce. The first start can point you to it.</p></div>
<div class="notice warn">${ico("TriangleAlert")}<p>The installers are not code-signed yet, so Windows may say "Windows protected your PC". Choose <strong>More info</strong>, then <strong>Run anyway</strong>, after checking the checksum below.</p></div>
<h2 class="section" style="margin-top:36px;font-size:20px">Check your download</h2>
<p>In PowerShell, in the folder you saved it to:</p>
<pre class="code"><code>Get-FileHash "Ropework Setup ${esc(latest?.version ?? "x.y.z")}.exe" -Algorithm SHA256</code></pre>
<p>The result must match the SHA-256 shown above.</p>
<h2 class="section" style="margin-top:36px;font-size:20px">After installing</h2>
<p>The app works without a key during the beta. Questions and bugs go to <a href="https://github.com/p4inz-code/ropework/issues" rel="noopener">the issue tracker</a>.</p>
${
  winRel.length > 1
    ? `<h2 class="section" style="margin-top:36px;font-size:20px">Older releases</h2><div class="older">${winRel
        .slice(1)
        .map((r, i) => `<div class="older-item"><button type="button" class="older-btn" data-toggle="older-${i}" aria-expanded="false" aria-controls="older-${i}"><span class="mono">${esc(r.version)}</span> <span class="pill ${esc(r.channel)}">${esc(r.channel)}</span> <span class="muted">${date(r.date)}</span></button><div class="files" id="older-${i}" style="margin-top:14px" hidden>${r.files.map((f) => fileRow(r, f)).join("")}</div></div>`)
        .join("")}</div>`
    : ""
}
</div>
<div id="panel-linux" role="tabpanel" aria-labelledby="tab-linux" data-panel="linux" hidden>
<div class="notice info" style="margin-top:0">${ico("Info")}<p><strong>No Ubuntu build in this release.</strong> An Ubuntu 24.04 package (AppImage and .deb) is planned for a later release. It will appear here with its checksum.</p></div>
</div>
</div></section>`,
});

// ---------------------------------------------------------------- Request beta access (W06)
page("/request/", {
  title: "Get the beta",
  description: "The beta is free and open: download it, install it, and tell us what you find.",
  hero: `<section class="band" style="background:var(--color-surface);border-bottom:1px solid var(--color-border)"><div class="wrap split" style="align-items:start">
<div><h1 style="font-size:clamp(30px,4vw,38px);font-weight:700">Get the beta</h1><p class="muted" style="font-size:18px;margin-top:14px;max-width:44ch">The beta is free and open. Download it, install it, and tell us what you find. No key is needed during the beta.</p>
<p style="margin-top:22px"><a class="btn primary" href="/download/">${ico("Download")} Go to the download</a></p>
<ul class="contact-list"><li>${ico("ShieldCheck")}<span>What the app sends and what it does not: <a href="/privacy/">Privacy and security</a></span></li><li>${ico("FileText")}<span>The rules of the beta: <a href="/terms/">Beta terms</a></span></li></ul></div>
<div class="form-card"><h2 style="font-size:20px;margin:0 0 12px">Three steps</h2><ol class="steps"><li><strong>Download</strong> the installer or the portable zip, and check the checksum shown next to it.</li><li><strong>Install the free <code>p4</code> client</strong> from Perforce if you do not have it; the first start points you to it.</li><li><strong>Tell us</strong> what broke or confused you: in the app, Help, Send feedback builds a text you can paste into <a href="https://github.com/p4inz-code/ropework/issues" rel="noopener">an issue</a>.</li></ol></div></div></section>`,
  body: ``,
});

// ---------------------------------------------------------------- Privacy and security (W07)
page("/privacy/", {
  title: "Privacy and security",
  description: "Your files and server details never leave your network.",
  body: `<section class="band"><div class="wrap">
<div class="lists">
<div class="card"><h3>Leaves your computer</h3>
<p>In the beta, the app sends nothing anywhere: no telemetry, no automatic update check and no licence call. It only talks to the Perforce servers you configure.</p>
<p>When you ask for a beta key or write to us on this site, the answers you type in the form pass through our email service (Resend) to reach us. Nothing else on this site collects anything: no cookies, no analytics, no outside scripts or fonts.</p>
<p>Later, when licence checks go live: the licence id, the app version, a one-way device hash and a seat count, every few days. We will say so here first.</p></div>
<div class="card"><h3>Never leaves your computer</h3>
<p>Your files, file names and paths.</p>
<p>Server addresses, user names, changelist descriptions and logs. A feedback bundle is built on your computer, shown to you, and saved for you to send yourself.</p></div>
</div>
<div class="prose" style="margin-top:36px"><h2>Security</h2>
<ul>
<li>Passwords are never stored. They are passed once to the free <code>p4</code> client and wiped from memory; the server's login ticket is kept by <code>p4</code> in its own file.</li>
<li>3D models open in a separate, sandboxed viewer that cannot reach the app, your files or the network.</li>
<li>Other programs are started only from a fixed list, with a read-only copy of the file and a time limit.</li>
<li>Every download has a SHA-256 checksum on the <a href="/download/">download page</a>. The installers are not code-signed yet; signed installers come with the first public release.</li>
<li>Safety copies of files, kept 14 days, are encrypted with a key held by your operating system.</li>
</ul></div>
</div></section>`,
});

// ---------------------------------------------------------------- Docs (W08, W09)
page("/docs/", {
  title: "Docs",
  description: "Guides for testers. More arrive as they are written.",
  body: `<section class="band"><div class="wrap"><ul class="doc-list">
<li><a href="/docs/tester-guide/">Guide for testers<span>Install, first minutes, what to try, and how to send feedback.</span></a></li>
<li><a href="/migrate/">Migrate from P4V<span>Four steps, and what carries over.</span></a></li>
<li><a href="/privacy/">Privacy and security<span>What leaves your computer and what never does.</span></a></li>
<li><a href="/known-issues/">Known issues<span>What is not working yet and when it is planned.</span></a></li>
</ul></div></section>`,
});
page("/docs/tester-guide/", {
  title: "Guide for testers",
  description: "Install, first minutes, what to try, and how to send feedback.",
  body: `<section class="band"><div class="wrap"><div class="prose">${md(read("data/tester-guide.md").replace(/^# .*\n/, ""))}</div></div></section>`,
});

// ---------------------------------------------------------------- Releases (W10)
const kind = { new: "New", fixed: "Fixed", known: "Known issue" };
page("/releases/", {
  title: "Releases",
  description: "Numbered beta releases. Each one lists what is new, what was fixed and what is still known.",
  body: `<section class="band"><div class="wrap rel">${releases
    .map(
      (r) => `<article id="v${esc(r.version)}"><h2>${esc(r.version)}</h2><span class="pill ${esc(r.channel)}">${esc(r.channel)}</span><time datetime="${esc(r.date)}">${date(r.date)}</time><ul>${r.items.map((i) => `<li><b>${kind[i.kind] ?? i.kind}:</b> ${esc(i.text)}</li>`).join("")}</ul></article>`,
    )
    .join("")}</div></section>`,
});

// ---------------------------------------------------------------- Known issues (W11)
page("/known-issues/", {
  title: "Known issues",
  description: "What does not work yet, and when it is planned.",
  body: `<section class="band"><div class="wrap"><table class="table"><thead><tr><th scope="col">Issue</th><th scope="col">Status</th><th scope="col">Planned</th></tr></thead><tbody>${known.issues
    .map((i) => `<tr><td>${esc(i.text)}</td><td><span class="status-pill">${esc(i.status)}</span></td><td>${esc(i.planned)}</td></tr>`)
    .join("")}</tbody></table></div></section>`,
});

// ---------------------------------------------------------------- Contact (W12)
page("/contact/", {
  title: "Contact",
  description: "Questions, bugs and ideas: the issue tracker is the place, and the app builds the text for you.",
  hero: `<section class="band" style="background:var(--color-surface);border-bottom:1px solid var(--color-border)"><div class="wrap split" style="align-items:start">
<div><h1 style="font-size:clamp(30px,4vw,38px);font-weight:700">Contact</h1><p class="muted" style="font-size:18px;margin-top:14px;max-width:44ch">Questions, bugs and ideas. The issue tracker is where we read and answer them.</p>
<ul class="contact-list"><li>${ico("MessageSquare")}<span>Ask or report: <a href="https://github.com/p4inz-code/ropework/issues" rel="noopener">the issue tracker</a></span></li><li>${ico("Download")}<span>Get the beta: <a href="/download/">Download</a></span></li><li>${ico("FileText")}<span>From the app: <strong>Help, Send feedback</strong> builds a text with the version and what you were doing, with no file names, server addresses or passwords.</span></li></ul></div>
<div class="form-card"><h2 style="font-size:20px;margin:0 0 12px">Before you write</h2><ul class="plain"><li>Read the <a href="/known-issues/">known issues</a>: yours may be listed with a way around it.</li><li>Say which version you run (Help, About) and which Perforce server version you use.</li><li>Do not paste passwords or private file names.</li></ul></div></div></section>`,
  body: ``,
});

// ---------------------------------------------------------------- Beta terms
page("/terms/", {
  title: "Beta terms",
  description: "The terms for the private beta. These are a draft for the beta and are replaced after review.",
  body: `<section class="band"><div class="wrap"><div class="notice warn" style="margin:0 0 28px">${ico("TriangleAlert")}<p><strong>Draft for the beta.</strong> These terms are replaced by reviewed text before the first public release.</p></div><div class="prose">${md(read("data/beta-notice.md").replace(/^# .*\n/, ""))}</div></div></section>`,
});

// ---------------------------------------------------------------- 404
page("/404.html", { title: "Page not found", description: "That page is not here.", body: `<section class="band"><div class="wrap"><p><a class="btn primary" href="/">Go to the home page</a></p></div></section>` });

// ---------------------------------------------------------------- write
for (const p of pages) {
  const html = rebase(shell(p));
  const file = p.path.endsWith(".html") ? join(dist, p.path) : join(dist, p.path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
for (const f of ["tokens.css", "site.css", "site.js", "theme.js"]) writeFileSync(join(dist, f), rebase(readFileSync(join(root, "src", f), "utf8")));
cpSync(join(root, "src", "fonts"), join(dist, "fonts"), { recursive: true });
cpSync(join(root, "src", "brand"), join(dist, "brand"), { recursive: true });
writeFileSync(join(dist, "robots.txt"), "User-agent: *\nAllow: /\n");
writeFileSync(join(dist, ".nojekyll"), "");
console.log(`built ${pages.length} pages into dist/`);
