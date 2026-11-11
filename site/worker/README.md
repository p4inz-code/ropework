# The form function

The site is static, so the Request beta access and Contact forms post to this one small function. It checks the answers, rejects bots (a hidden trap field and a minimum fill time), limits repeats, and sends one email to you through Resend. It stores nothing.

## Set it up (about ten minutes, free tiers)

1. **Resend**: create an account, make an API key. Until you verify a sending domain, Resend sends only from its test address (`onboarding@resend.dev`) and only to your own address, which is exactly what this needs. (Check Resend's current free-tier limits when you sign up.)
2. **Cloudflare**: create a free account, then in this folder:
   ```
   npx wrangler login
   npx wrangler secret put RESEND_API_KEY     # paste the key; it stays in Cloudflare, never in this repository
   npx wrangler deploy
   ```
3. Set the two variables in `wrangler.toml` (or the dashboard): `TO_EMAIL` (your own address) and `ALLOW_ORIGIN` (`https://ropework.github.io`).
4. Put the Worker's address in `site.json` as `formEndpoint`, rebuild, push. The site's content policy allows connections to that one address and nothing else.

Never put the Resend key in `site.json`, in `wrangler.toml` or anywhere in the repository: the repository is public.

When a domain is verified in Resend, set `FROM_EMAIL` and add a confirmation email to the visitor.
