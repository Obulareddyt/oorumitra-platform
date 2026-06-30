# Starts the OoruMitra backend against the local PostgreSQL database
# using the base (production-style) Spring profile — no --spring.profiles.active
# means application.yml (Postgres, Flyway, ddl-auto=validate) is used, not the
# H2-based "dev" profile.
#
# DB_URL/DB_USERNAME/DB_PASSWORD are left unset here because they already match
# application.yml's defaults (db "ooumitra" / user "ooumitra" / password
# "ooumitra123") — see deploy/setup-postgres.sql which creates exactly that.
#
# JWT_SECRET is generated once and cached in deploy/.jwt-secret (gitignored,
# never committed) so it stays stable across restarts instead of invalidating
# every issued token each time this script runs.

$secretFile = "$PSScriptRoot\.jwt-secret"
if (-not (Test-Path $secretFile)) {
    $bytes = New-Object byte[] 64
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    [Convert]::ToBase64String($bytes) | Set-Content -Path $secretFile -NoNewline
}
$env:JWT_SECRET = Get-Content -Path $secretFile -Raw

# Load additional secrets from .secrets file (gitignored)
$dotSecrets = "$PSScriptRoot\.secrets"
if (Test-Path $dotSecrets) {
    Get-Content $dotSecrets | ForEach-Object {
        if ($_ -match '^\s*([^#=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim(), 'Process')
        }
    }
}

Set-Location "$PSScriptRoot\..\backend"
java -jar target/ooru-mitra-backend-1.0.0.jar `
    "--spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect"
