# ======================================================================
#  CHIOTRON TECHNOLOGY - One-Command Automated Installer (PowerShell)
# ======================================================================

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   CHIOTRON TECHNOLOGY - Automatic One-Click Setup (PowerShell)       " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Docker installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Docker is not installed or not found in system PATH!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Read-Host "Press Enter to exit..."
    exit 1
}

# 2. Check Docker daemon running
docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker is installed but Docker Desktop is not currently running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and wait until the engine is running, then re-run this script." -ForegroundColor Yellow
    Read-Host "Press Enter to exit..."
    exit 1
}

# 3. Build & start containers
Write-Host "[1/3] Building and starting containers (PostgreSQL, MinIO, Go API, Nginx)..." -ForegroundColor Green
docker compose up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to start Docker containers!" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

# 4. Wait for database & api to initialize
Write-Host ""
Write-Host "[2/3] Waiting for database initialization and services to be healthy..." -ForegroundColor Green
Start-Sleep -Seconds 5

# 5. Run Database Seeder
Write-Host ""
Write-Host "[3/3] Seeding initial database data (Users, Roles, Pages, Products)..." -ForegroundColor Green
docker compose exec -T api /app/seeder

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   INSTALLATION COMPLETED SUCCESSFULLY!                               " -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  * Website (Public)    : http://localhost" -ForegroundColor White
Write-Host "  * Admin CMS Portal    : http://localhost/admin" -ForegroundColor White
Write-Host "  * MinIO Storage UI    : http://localhost:9001 (User: lohakit_minio / Pass: LohakitMinIOSecureKey2026!)" -ForegroundColor White
Write-Host ""
Write-Host "  --- Default Superadmin Credentials ---" -ForegroundColor Yellow
Write-Host "  Email    : admin@localhost.co.th" -ForegroundColor Yellow
Write-Host "  Password : AdminLocalhost2026!" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# Automatically open browser
Start-Process "http://localhost/admin"
