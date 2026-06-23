# Exposes the web app (which proxies /api to the backend) to the internet
# via a free Cloudflare quick tunnel. Prints a random https://*.trycloudflare.com
# URL — share that URL with friends. Valid HTTPS cert included automatically,
# no domain or router configuration needed.
#
# Run this AFTER start-backend.ps1 and start-web.ps1 are both already running.

cloudflared tunnel --url http://localhost:3000
