# Production Deployment Guide

## 1. Prerequisites
- Docker Engine 24.0+ & Docker Compose v2+
- Linux VM (Ubuntu 22.04 LTS recommended)
- Minimum: 2 vCPU, 4GB RAM, 40GB SSD

## 2. Production Step-by-Step

### Step 1: Clone Repository
```bash
git clone https://github.com/lohakit/cms-backend.git /opt/lohakit
cd /opt/lohakit
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env: update DB passwords, MINIO credentials, and SESSION_SECRET
nano .env
```

### Step 3: Launch Containers
```bash
docker compose up -d --build
```

### Step 4: Run Initial Database Seed
```bash
docker compose exec api /app/seeder
```

### Step 5: Verify Health Checks
```bash
curl http://localhost/healthz
curl http://localhost/readyz
```
Expected output:
```json
{"data":{"database":"UP","status":"UP","timestamp":"..."}}
```
