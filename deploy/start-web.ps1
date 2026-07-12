# Builds the web app for production and serves it with `vite preview`,
# which proxies /api to the backend on :8080 (see vite.config.js `preview.proxy`).
# This keeps the web app and API on a single origin, so only ONE tunnel
# (pointed at this port) is needed for friends to use the whole app.

# Load secrets (gitignored) so build-time env vars like VITE_GEOAPIFY_KEY reach
# the Vite build. Vite exposes any VITE_-prefixed process env var to the client.
$dotSecrets = "$PSScriptRoot\.secrets"
if (Test-Path $dotSecrets) {
    Get-Content $dotSecrets | ForEach-Object {
        if ($_ -match '^\s*([^#=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim(), 'Process')
        }
    }
}

Set-Location "$PSScriptRoot\..\web"
npm run build
npx vite preview --host 0.0.0.0 --port 3000
