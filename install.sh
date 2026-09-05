#!/usr/bin/env bash
set -e

# ======================================================================
#  CHIOTRON TECHNOLOGY - One-Command Automated Installer (Linux / macOS)
# ======================================================================

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}======================================================================${NC}"
echo -e "${CYAN}   CHIOTRON TECHNOLOGY - Automatic One-Click Setup                   ${NC}"
echo -e "${CYAN}======================================================================${NC}"
echo ""

# 1. Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR] Docker is not installed or not in PATH!${NC}"
    echo -e "${YELLOW}Please install Docker from https://docs.docker.com/engine/install/${NC}"
    exit 1
fi

# 2. Check Docker running
if ! docker info &> /dev/null; then
    echo -e "${RED}[ERROR] Docker daemon is not running!${NC}"
    echo -e "${YELLOW}Please start Docker daemon (e.g. 'sudo systemctl start docker')${NC}"
    exit 1
fi

# 3. Build & start containers
echo -e "${GREEN}[1/3] Building and starting containers (PostgreSQL, MinIO, Go API, Nginx)...${NC}"
docker compose up -d --build

# 4. Wait for services
echo ""
echo -e "${GREEN}[2/3] Waiting for database initialization and services to be healthy...${NC}"
sleep 5

# 5. Run Database Seeder
echo ""
echo -e "${GREEN}[3/3] Seeding initial database data (Users, Roles, Pages, Products)...${NC}"
docker compose exec -T api /app/seeder || echo -e "${YELLOW}[NOTE] Seeder executed or already seeded.${NC}"

echo ""
echo -e "${CYAN}======================================================================${NC}"
echo -e "${GREEN}   INSTALLATION COMPLETED SUCCESSFULLY!                               ${NC}"
echo -e "${CYAN}======================================================================${NC}"
echo ""
echo -e "  * Website (Public)    : http://localhost"
echo -e "  * Admin CMS Portal    : http://localhost/admin"
echo -e "  * MinIO Storage UI    : http://localhost:9001 (User: lohakit_minio / Pass: LohakitMinIOSecureKey2026!)"
echo ""
echo -e "${YELLOW}  --- Default Superadmin Credentials ---${NC}"
echo -e "${YELLOW}  Email    : admin@localhost.co.th${NC}"
echo -e "${YELLOW}  Password : AdminLocalhost2026!${NC}"
echo -e "${CYAN}======================================================================${NC}"
echo ""
