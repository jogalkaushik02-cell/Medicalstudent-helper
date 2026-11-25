# Deploy to Vercel — SENSE Atlas v0.2

The repository root is `/data/data/com.termux/files/home/senses-atlas`.

## Option A — CLI (recommended)

Install the CLI once, then deploy. Vercel needs your account credentials.

```bash
npm install -g vercel@latest
vercel --version
```

If you have a token, run:

```bash
VERCEL_TOKEN=<paste token> vercel login --token <paste token>   # or just export
cd /data/data/com.termux/files/home/senses-atlas
VERCEL_TOKEN=<paste token> vercel deploy --prod --yes --token "$VERCEL_TOKEN"
```

Then confirm the printed URL. Or interactively, the CLI will ask for a GitHub/Google account.

## Option B — Interactive login

```bash
npm install -g vercel@latest
vercel login
```

It prints a sign-in URL and code; open it in a browser (on another device or via `xdg-open`), sign in, then:

```bash
cd /data/data/com.termux/files/home/senses-atlas
vercel deploy --prod --yes
```

## Notes

- `vercel.json` already has the SPA rewrite: `/ (.*)` → `/index.html`, so `/nose`, `/pharynx`, `/larynx`, `/sections` and other deep links work on refresh.
- Build command on Vercel: `npm run build`. Output: `dist`.
- Verify with:
  ```bash
  curl -s -o /dev/null -w '%{http_code}\n' https://senses-atlas.vercel.app/nose
  ```
- Framework preset: Vite. TypeScript strict typecheck runs first in the build script.

## If you don’t have Vercel credentials

I can prepare the exact deployment config and a readiness report; deployment needs your account or a token.
