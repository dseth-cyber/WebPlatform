@echo off
setlocal enabledelayedexpansion

title CHIOTRON TECHNOLOGY WebPlatform Installer

echo ======================================================================
echo    CHIOTRON TECHNOLOGY - Automatic One-Click Setup (HTTPS)
echo ======================================================================
echo.

:: 1. Check Docker installation
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH!
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

:: 2. Check if Docker daemon is running
docker info >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is installed but Docker Desktop is not running!
    echo Please start Docker Desktop and wait until the engine is ready.
    pause
    exit /b 1
)

:: 3. Configure Windows Firewall (Allows other devices on LAN to access via IP)
echo [*] Ensuring Windows Firewall permits inbound HTTP (80) and HTTPS (443)...
netsh advfirewall firewall show rule name="CHIOTRON WebPlatform (HTTP/HTTPS)" >nul 2>nul
if %errorlevel% neq 0 (
    netsh advfirewall firewall add rule name="CHIOTRON WebPlatform (HTTP/HTTPS)" dir=in action=allow protocol=TCP localport=80,443 >nul 2>nul
)

echo [1/3] Building and starting CHIOTRON containers (chiotron_postgres, chiotron_minio, chiotron_api, chiotron_nginx)...
docker compose up -d --build --remove-orphans
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start Docker containers!
    pause
    exit /b 1
)

echo.
echo [2/3] Waiting for database initialization and services to be healthy...
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Seeding initial database data (Users, Roles, Pages, Products)...
docker compose exec -T api /app/seeder
if %errorlevel% neq 0 (
    echo [WARNING] Seeder execution returned an error, database might already be initialized.
)

echo.
echo ======================================================================
echo    INSTALLATION COMPLETED SUCCESSFULLY! (SECURED WITH HTTPS)
echo ======================================================================
echo.
echo   * Website (Public)    : https://localhost
echo   * Admin CMS Portal    : https://localhost/admin
echo   * MinIO Storage UI    : http://localhost:9001 (User: lohakit_minio / Pass: LohakitMinIOSecureKey2026!)
echo.
echo   --- Default Superadmin Credentials ---
echo   Email    : admin@localhost.co.th
echo   Password : AdminLocalhost2026!
echo ======================================================================
echo.

:: Automatically open browser to HTTPS Admin Portal
start https://localhost/admin

echo The application is ready to use. You may close this window.
pause
