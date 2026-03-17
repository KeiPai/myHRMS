# Quickstart: HRM Service Creation

**Feature**: 001-hrm-service
**Date**: 2026-01-26

## Prerequisites

Before starting, ensure you have:

- [ ] Veni CLI installed (`bun install -g @venizia/cli` or local dev setup)
- [ ] Platform infrastructure running (Keycloak, PostgreSQL, Redis, MinIO)
- [ ] Shell API and UI running
- [ ] Bun runtime installed (v1.0.0+)

## Step-by-Step Execution

### Step 1: Create the HRM Service

```bash
# Navigate to project root
cd /Users/truongkien/dev/HRMS

# Create the HRM service with CLI
veni create service hrm \
  --description "Human Resource Management Service" \
  --category "enterprise"
```

**Expected Output**:
```
Creating service directory: /Users/truongkien/dev/HRMS/services/hrm
Copying template files...
Processing template files...
Creating API environment file...
Creating UI environment file...
Creating README...
Updating package.json files...

✅ Service "hrm" created successfully!

Next steps:
  cd services/hrm
  bun install -r
  cd api && bun run dev
  cd ../ui && bun run dev
  veni register hrm
```

**Verification**:
```bash
# Check service directory was created
ls -la services/hrm/

# Should show:
# api/
# ui/
# docker-compose.yml
# README.md
# .gitignore
```

### Step 2: Install Dependencies

```bash
# Navigate to HRM service
cd services/hrm

# Install both API and UI dependencies
bun install -r

# Or install separately:
cd api && bun install
cd ../ui && bun install
```

**Expected Duration**: 30-60 seconds

### Step 3: Configure Environment

```bash
# Review API environment (already created with defaults)
cat api/.env

# Review UI environment
cat ui/.env
```

**Key Values to Verify**:
- `APP_ENV_PORT` - API port (should be auto-assigned, e.g., 3006)
- `APP_ENV_DATABASE_URL` - PostgreSQL connection
- `APP_ENV_JWT_SECRET` - Auto-generated secret
- `VITE_API_URL` - Should match API port

### Step 4: Setup Database

```bash
cd api

# Push schema to database
bun run db:push

# Or generate and run migrations
bun run db:generate
bun run db:migrate
```

### Step 5: Start the Services

**Terminal 1 - API**:
```bash
cd services/hrm/api
bun run dev
```

**Expected Output**:
```
🔥 Server running on http://localhost:3006
```

**Terminal 2 - UI**:
```bash
cd services/hrm/ui
bun run dev
```

**Expected Output**:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:4176/
  ➜  Network: use --host to expose
```

### Step 6: Verify Services Running

```bash
# Check API health
curl http://localhost:3006/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-01-26T10:00:00.000Z"}
```

```bash
# Check UI accessible
curl -s -o /dev/null -w "%{http_code}" http://localhost:4176

# Expected: 200
```

### Step 7: Register with Shell

**Prerequisites**:
- Shell API running on http://localhost:3000
- Shell UI running on http://localhost:5173
- JWT token from Shell (login first)

**Get JWT Token**:
1. Open http://localhost:5173
2. Login with credentials (default: veni/veni)
3. Open Developer Tools (F12) → Application → Local Storage
4. Copy `veni-ai-token` value

**Register**:
```bash
veni register hrm --token <your-jwt-token>

# Or interactive (will prompt for token):
veni register hrm
```

**Expected Output**:
```
Registering service "hrm" with Shell...
✅ Service registered successfully!

{
  "id": "hrm",
  "name": "Human Resource Management",
  "apiUrl": "http://localhost:3006",
  "uiUrl": "http://localhost:4176",
  "status": "available"
}
```

### Step 8: Setup Authentication

```bash
veni setup auth --service-id hrm
```

**Expected Output**:
```
Setting up authentication for "hrm"...
✅ Authentication configured!

Updated files:
  - api/src/controllers/auth.controller.ts
  - api/src/services/jwt-token.service.ts
  - api/src/services/keycloak-token.service.ts
  - api/.env (JWT_SECRET updated)
```

### Step 9: Setup Module Federation

```bash
veni setup federation --service-id hrm
```

**Expected Output**:
```
Setting up Module Federation for "hrm"...
✅ Federation configured!

Updated files:
  - ui/vite.config.ts
  - ui/src/federation/shell-entry.tsx
  - shell/ui/vite.config.ts (added remote)

Restart both Shell UI and HRM UI to apply changes.
```

### Step 10: Verify Integration

1. Restart Shell UI and HRM UI
2. Open Shell at http://localhost:5173
3. Login with credentials
4. Navigate to HRM section in sidebar
5. Verify HRM UI loads within Shell

## Quick Commands Summary

```bash
# All-in-one creation with registration
veni create service hrm \
  --description "Human Resource Management Service" \
  --category "enterprise" \
  --register

# Full workflow (manual)
veni create service hrm --description "HRM Service" --category "enterprise"
cd services/hrm && bun install -r
cd api && bun run db:push && bun run dev &
cd ../ui && bun run dev &
veni register hrm
veni setup auth --service-id hrm
veni setup federation --service-id hrm
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Use `--api-port 3007 --ui-port 4177` |
| Service already exists | Delete `services/hrm/` or use different name |
| Shell not running | Start Shell first: `cd shell/api && bun run dev` |
| Registration fails | Check JWT token validity, ensure Shell API is accessible |
| Database connection fails | Verify PostgreSQL is running, check `APP_ENV_DATABASE_URL` |
