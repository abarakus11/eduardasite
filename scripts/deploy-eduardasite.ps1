# Commit + push automático do eduardasite -> GitHub/Vercel
$ErrorActionPreference = 'SilentlyContinue'

$Root = if ($env:CURSOR_PROJECT_DIR) { $env:CURSOR_PROJECT_DIR } else { Split-Path -Parent $PSScriptRoot }
if (-not (Test-Path "$Root\.git")) { exit 0 }

$LogFile = Join-Path $Root '.cursor\hooks\deploy-eduardasite.log'

function Write-Log($msg) {
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg"
    New-Item -ItemType Directory -Force (Split-Path $LogFile) | Out-Null
    Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue
}

Set-Location $Root
git add -A 2>$null
$status = git status --porcelain 2>$null
if (-not $status) { exit 0 }

$msg = "Atualizacao automatica eduardasite - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git -c user.name="abarakus11" -c user.email="abarakus11@users.noreply.github.com" commit -m $msg 2>$null
if ($LASTEXITCODE -ne 0) { Write-Log "commit falhou"; exit 0 }

git push origin main 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Log "push ok: $msg"
} else {
    git pull --rebase origin main 2>$null
    git push origin main 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Log "push ok apos rebase" } else { Write-Log "push falhou" }
}

exit 0
