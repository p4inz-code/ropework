// The form function for the Ropework website: receives the request and contact forms and sends them to the owner through Resend.
// Runs on Cloudflare Workers (free tier). It stores nothing. The Resend key is a secret of the Worker and is never in this repository.
//
// Settings (see worker/README.md):
//   secret   RESEND_API_KEY   the Resend API key
//   var      TO_EMAIL         where requests are sent (the owner's own address)
//   var      FROM_EMAIL       the sender (default onboarding@resend.dev until a domain is verified in Resend)
//   var      ALLOW_ORIGIN     the site's address, for example https://ropework.github.io

const MAX_FIELD = 2000;
const MIN_FILL_MS = 3000;
const recent = new Map(); // email -> last time; per instance, enough to stop a burst

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "access-control-allow-origin": origin, vary: "Origin" },
  });

const clean = (v) => String(v ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, MAX_FIELD);
const validEmail = (e) => /^[^@\s]{1,64}@[^@\s]{1,255}\.[^@\s]{2,}$/.test(e) && !/[\r\n]/.test(e);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default {
  async fetch(request, env) {
    const origin = env.ALLOW_ORIGIN || "https://ropework.github.io";
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: { "access-control-allow-origin": origin, "access-control-allow-methods": "POST", "access-control-allow-headers": "content-type", "access-control-max-age": "86400", vary: "Origin" } });
    }
    if (request.method !== "POST") return json({ ok: false, message: "Not found." }, 404, origin);
    if (request.headers.get("origin") !== origin) return json({ ok: false, message: "Not allowed from here." }, 403, origin);
    if (!env.RESEND_API_KEY || !env.TO_EMAIL) return json({ ok: false, message: "The form is not set up yet." }, 503, origin);

    let payload;
    try {
      const text = await request.text();
      if (text.length > 20000) return json({ ok: false, message: "That is too long." }, 413, origin);
      payload = JSON.parse(text);
    } catch {
      return json({ ok: false, message: "That did not look right." }, 400, origin);
    }
    const kind = payload.kind === "contact" ? "contact" : payload.kind === "request" ? "request" : null;
    const f = payload.fields ?? {};
    if (!kind) return json({ ok: false, message: "That did not look right." }, 400, origin);

    // the spam trap must be empty and a person takes more than a few seconds to fill a form
    if (clean(f.website) !== "") return json({ ok: true }, 200, origin); // pretend success to a bot
    if (typeof payload.took !== "number" || payload.took < MIN_FILL_MS) return json({ ok: false, message: "Please take a moment and try again." }, 429, origin);

    const email = clean(f.email);
    if (!validEmail(email)) return json({ ok: false, message: "Please give a valid email address." }, 400, origin);
    const now = Date.now();
    const last = recent.get(email.toLowerCase());
    if (last && now - last < 60_000) return json({ ok: false, message: "That was just sent. Please wait a minute." }, 429, origin);
    recent.set(email.toLowerCase(), now);
    if (recent.size > 500) recent.clear();

    let subject;
    let lines;
    if (kind === "request") {
      const name = clean(f.name);
      const studio = clean(f.studio);
      const people = clean(f.people);
      if (!name || !studio || !people || !f.terms) return json({ ok: false, message: "Some answers are missing." }, 400, origin);
      subject = `Beta access request: ${studio}`;
      lines = [`Name: ${name}`, `Email: ${email}`, `Studio: ${studio}`, `People: ${people}`, `Uses today: ${clean(f.today) || "(not said)"}`, "Terms and privacy notice: ticked"];
    } else {
      const message = clean(f.message);
      if (!message) return json({ ok: false, message: "Please write a message." }, 400, origin);
      subject = "Message from the Ropework site";
      lines = [`Email: ${email}`, "", message];
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: `Ropework site <${env.FROM_EMAIL || "onboarding@resend.dev"}>`,
        to: [env.TO_EMAIL],
        reply_to: email,
        subject: subject.slice(0, 120),
        text: lines.join("\n"),
        html: `<pre style="font:14px/1.5 system-ui,sans-serif;white-space:pre-wrap">${esc(lines.join("\n"))}</pre>`,
      }),
    });
    if (!res.ok) return json({ ok: false, message: "It did not go through. Please try again in a moment." }, 502, origin);
    return json({ ok: true }, 200, origin);
  },
};
