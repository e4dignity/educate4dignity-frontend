Frontend Render deployment notes

- Build command:
  npm ci && npm run build

- Start command (Web Service):
  node server.cjs

- Required environment variables (Render dashboard -> Environment):
  - VITE_API_URL : public URL of the backend, e.g. https://your-backend.onrender.com
  - VITE_APP_VERSION (optional)

- Publish directory (if using Static Site): `dist` (for Web Service using `server.cjs`, server serves `dist`).

- Notes:
  - `API_BASE_URL` in the app defaults to http://localhost:4000/api unless `VITE_API_URL` is set. Set `VITE_API_URL` to the backend root (without trailing `/api`).
  - If CORS issues occur, add the frontend URL to the backend `CORS_ORIGINS` env variable.
