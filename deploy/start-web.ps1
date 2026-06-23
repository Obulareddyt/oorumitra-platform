# Builds the web app for production and serves it with `vite preview`,
# which proxies /api to the backend on :8080 (see vite.config.js `preview.proxy`).
# This keeps the web app and API on a single origin, so only ONE tunnel
# (pointed at this port) is needed for friends to use the whole app.

Set-Location "$PSScriptRoot\..\web"
npm run build
npx vite preview --host 0.0.0.0 --port 3000
