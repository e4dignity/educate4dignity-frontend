Env example (documentation)

This file documents the Vite env variables used by the frontend (do NOT store secrets here).

- `VITE_API_URL` - public backend root URL (no trailing `/api`), e.g. `https://your-backend.onrender.com`
- `VITE_APP_VERSION` - optional version string used for cache-busting
- `VITE_API_TIMEOUT_MS` - API timeout in ms (default 15000)
- `VITE_DEV_AUTO_LOGIN` - `true` to enable dev auto-login (not for production)

How to use on Render

1. In your frontend Render service, set `VITE_API_URL` to the backend public URL.
2. Build with `npm ci && npm run build` and start with `node server.cjs` (see `RENDER.md`).
