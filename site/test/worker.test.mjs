// The form function, tested directly: who may call it, what it refuses, and the email it sends. Resend is replaced by a stand-in.
import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.js";

const ORIGIN = "https://ropework.github.io";
const env = { RESEND_API_KEY: "test-key", TO_EMAIL: "owner@example.test", ALLOW_ORIGIN: ORIGIN };
let sent = [];
globalThis.fetch = async (url, init) => {
  sent.push({ url, init, body: JSON.parse(init.body) });
  return new Response("{}", { status: 200 });
};
const post = (body, headers = {}) => worker.fetch(new Request("https://form.example/", { method: "POST", headers: { origin: ORIGIN, "content-type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) }), env);
const good = { kind: "request", took: 9000, fields: { name: "Maya R.", email: "maya@northlight.example", studio: "Northlight Games", people: "26 to 100", today: "P4V on Windows", terms: "on", website: "" } };
const fresh = (over = {}) => ({ ...good, ...over, fields: { ...good.fields, email: `u${Math.random().toString(36).slice(2)}@x.example`, ...(over.fields ?? {}) } });

test("a real request is sent to the owner through Resend with the visitor as reply-to", async () => {
  sent = [];
  const r = await post(fresh());
  assert.equal(r.status, 200);
  assert.equal((await r.json()).ok, true);
  assert.equal(r.headers.get("access-control-allow-origin"), ORIGIN);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, "https://api.resend.com/emails");
  assert.equal(sent[0].init.headers.authorization, "Bearer test-key");
  assert.deepEqual(sent[0].body.to, ["owner@example.test"]);
  assert.match(sent[0].body.subject, /Northlight Games/);
  assert.match(sent[0].body.reply_to, /@x\.example$/);
  assert.match(sent[0].body.text, /People: 26 to 100/);
});

test("a contact message is sent", async () => {
  sent = [];
  const r = await post({ kind: "contact", took: 9000, fields: { email: "a@b.example", message: "Can we trial with 10 first?", website: "" } });
  assert.equal(r.status, 200);
  assert.match(sent[0].body.text, /trial with 10/);
});

test("another origin, a wrong method and a broken body are refused", async () => {
  sent = [];
  assert.equal((await post(good, { origin: "https://evil.example" })).status, 403);
  assert.equal((await worker.fetch(new Request("https://form.example/", { method: "GET" }), env)).status, 404);
  assert.equal((await post("not json")).status, 400);
  assert.equal((await post({ kind: "other", fields: {}, took: 9000 })).status, 400);
  assert.equal((await post("x".repeat(30000))).status, 413);
  assert.equal(sent.length, 0);
});

test("the spam trap gets a pretend success and sends nothing; a form filled too fast is told to wait", async () => {
  sent = [];
  const trapped = await post(fresh({ fields: { website: "http://spam.example" } }));
  assert.equal(trapped.status, 200);
  assert.equal(sent.length, 0);
  assert.equal((await post(fresh({ took: 500 }))).status, 429);
  assert.equal(sent.length, 0);
});

test("missing answers and bad emails are refused with a plain message", async () => {
  sent = [];
  for (const over of [{ fields: { name: "" } }, { fields: { studio: "" } }, { fields: { people: "" } }, { fields: { terms: "" } }, { fields: { email: "not-an-email" } }, { fields: { email: "a@b.example\r\nBcc: x@y.example" } }]) {
    const r = await post(fresh(over));
    assert.equal(r.status, 400, JSON.stringify(over));
    assert.ok((await r.json()).message.length > 5);
  }
  assert.equal(sent.length, 0);
});

test("the same address cannot send twice within a minute", async () => {
  sent = [];
  const same = fresh();
  assert.equal((await post(same)).status, 200);
  assert.equal((await post(same)).status, 429);
  assert.equal(sent.length, 1);
});

test("when Resend fails the visitor is told to try again, and without a key the form says it is not set up", async () => {
  const real = globalThis.fetch;
  globalThis.fetch = async () => new Response("{}", { status: 500 });
  assert.equal((await post(fresh())).status, 502);
  globalThis.fetch = real;
  const r = await worker.fetch(new Request("https://form.example/", { method: "POST", headers: { origin: ORIGIN }, body: JSON.stringify(good) }), { ...env, RESEND_API_KEY: "" });
  assert.equal(r.status, 503);
});

test("the email text carries control characters and markup safely", async () => {
  sent = [];
  await post(fresh({ fields: { today: "<script>alert(1)</script>\u0000\u0007 hi" } }));
  assert.ok(!sent[0].body.text.includes("\u0000"));
  assert.ok(!sent[0].body.html.includes("<script>"));
});
