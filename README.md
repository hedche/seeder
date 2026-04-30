# Seeder

Personal seed-tray tracker. Cloudflare Pages + KV. SvelteKit.

## Local dev

```sh
npm install
npm run dev
```

Local dev uses Miniflare-emulated KV via the SvelteKit Cloudflare adapter; the
default password is `dev-password` and the dev cookie secret is built in. Both
are overridden by `APP_PASSWORD` and `COOKIE_SECRET` on Cloudflare.

## Deploy

1. Create a KV namespace in the Cloudflare dashboard (e.g. `seeder-state`) and
   bind it as `SEED_KV` on your Pages project. Update `wrangler.toml` ids if you
   want `wrangler` to drive deploys instead.
2. Set Pages env vars / secrets:
   - `APP_PASSWORD` — the password you'll type at `/login`
   - `COOKIE_SECRET` — a random string used to sign the auth cookie
3. Build and deploy:

```sh
npm run build
npx wrangler pages deploy .svelte-kit/cloudflare
```

Or connect the GitHub repo to Cloudflare Pages and let it build on push.

## Data model

A single KV key `state` holds `{ trays, nextId }` as JSON. Tray ids are
sequential and never reused — the id matches the number of triangle notches
cut into the physical tray.
