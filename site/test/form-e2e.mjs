// The two forms in a real (headless) browser against the real form function with Resend replaced by a stand-in:
// an empty submit shows the errors, a full one is sent and confirmed, and an unreachable function gives a plain failure.
//   node test/form-e2e.mjs
import { createServer } from "node:http";
import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
const run = promisify(execFile); // the stand-in function runs in this process, so the browser must be started without blocking it
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8788;
const mails = [];
globalThis.fetch = async (url, init) => {
  mails.push(JSON.parse(init.body));
  return new Response("{}", { status: 200 });
};
const { default: worker } = await import("../worker/index.js");
const server = createServer(async (req, res) => {
  try {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const origin = req.headers.origin ?? "";
  const r = await worker.fetch(new Request(`http://127.0.0.1:${PORT}/`, { method: req.method, headers: { origin, "content-type": "application/json" }, body: req.method === "POST" ? Buffer.concat(chunks) : undefined }), { RESEND_API_KEY: "k", TO_EMAIL: "owner@example.test", ALLOW_ORIGIN: origin });
  res.writeHead(r.status, Object.fromEntries(r.headers));
  res.end(await r.text());
  } catch (e) {
    console.error('stand-in function error:', e);
    res.writeHead(500);
    res.end('{}');
  }
});
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));

const build = (endpoint) => execFileSync(process.execPath, ["build.mjs"], { cwd: root, env: { ...process.env, SITE_OUT: "dist-test", SITE_FORM_ENDPOINT: endpoint } });
const drive = async (path, doJs, thenWait, print) =>
  (await run(process.execPath, ["tools/cdp.mjs", join(root, "test", "form-shot.png"), path, "--w", "1280", "--h", "1000", "--wait", "document.readyState === 'complete' && document.querySelector('form[data-kind]') && document.querySelector('script[src]')", "--do", doJs, ...(thenWait ? ["--then-wait", thenWait] : []), "--print", print, "--timeout", "20000", "--settle", "300"], { cwd: root, env: { ...process.env, SITE_DIST: join(root, "dist-test") }, encoding: "utf8" })).stdout;
const printed = (out) => JSON.parse(/print -> (.*)/.exec(out)[1]);
const fill = (kind) => `(async () => {
  const set = (n, v) => { const e = document.querySelector('[name="' + n + '"]'); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); };
  ${kind === "request" ? `set('name','Maya R.'); set('email','maya@northlight.example'); set('studio','Northlight Games'); document.querySelector('input[name=people][value="26 to 100"]').click(); set('today','P4V on Windows, Unreal 5.4'); document.querySelector('input[name=terms]').click();` : `set('email','contact@northlight.example'); set('message','We have 40 artists on P4V. Can we trial with 10 first?');`}
  await new Promise((r) => setTimeout(r, 3300));
  document.querySelector('form[data-kind=${kind}] button[type=submit]').click();
  return 'submitted';
})()`;

try {
  build(`http://127.0.0.1:${PORT}/`);
  // 1. an empty submit shows the errors in words and sends nothing
  let out = await drive("request/", "document.querySelector('form[data-kind=request] button[type=submit]').click(); 1", "document.querySelectorAll('.err').length >= 4", "[...document.querySelectorAll('.err')].map(e => e.textContent).join(' | ') + ' #' + document.querySelectorAll('[aria-invalid=true]').length");
  const errs = printed(out);
  assert.match(errs, /your name/i);
  assert.match(errs, /work email/i);
  assert.match(errs, /studio/i);
  assert.match(errs, /read the beta terms/i);
  assert.equal(mails.length, 0);
  console.log("ok: an empty request shows errors and sends nothing");

  // 2. a full request is sent and confirmed
  out = await drive("request/", fill("request"), "document.querySelector('.status')?.textContent.includes('We got it')", "document.querySelector('.status')?.textContent");
  assert.match(printed(out), /We got it/);
  assert.equal(mails.length, 1);
  assert.match(mails[0].subject, /Northlight Games/);
  assert.match(mails[0].text, /People: 26 to 100/);
  assert.equal(mails[0].reply_to, "maya@northlight.example");
  console.log("ok: a full request is confirmed and the owner's email has the answers");

  // 3. the contact form
  out = await drive("contact/", fill("contact"), "document.querySelector('.status')?.textContent.includes('We got it')", "document.querySelector('.status')?.textContent");
  assert.match(printed(out), /We got it/);
  assert.equal(mails.length, 2);
  assert.match(mails[1].text, /trial with 10/);
  console.log("ok: the contact message is confirmed and sent");

  // 4. the function is unreachable: a plain failure, nothing lost to the user
  build("http://127.0.0.1:9/");
  out = await drive("request/", fill("request"), "document.querySelector('.status')?.textContent.includes('did not go through')", "document.querySelector('.status')?.textContent");
  assert.match(printed(out), /did not go through/);
  console.log("ok: an unreachable function gives a plain failure");

  // 5. no function address set: it says so and sends nothing
  build("");
  out = await drive("contact/", fill("contact"), "document.querySelector('.status')?.textContent.includes('not connected')", "document.querySelector('.status')?.textContent");
  assert.match(printed(out), /not connected/);
  console.log("ok: without a function address the form says it is not connected");
  console.log("form e2e: all passed");
} finally {
  server.close();
  mkdirSync(join(root, "test"), { recursive: true });
}
