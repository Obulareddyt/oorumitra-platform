# Exposes the web app via the named Cloudflare tunnel "oorumitra".
# Routes traffic from oorumitra.tgvctechnologies.in → localhost:3000
#
# Run this AFTER start-backend.ps1 and start-web.ps1 are both already running.

& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --config "$PSScriptRoot\cloudflared-config.yml" run
