# Tasks: HRM Service Creation

**Input**: Design documents from `.specify/specs/001-hrm-service/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly requested in feature specification. Test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Status**: ✅ ALL PHASES COMPLETE (2026-03-17)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths/commands in descriptions

## Path Conventions

- **Service location**: `services/hrm/`
- **API backend**: `services/hrm/api/`
- **UI frontend**: `services/hrm/ui/`
- CLI commands run from repository root: `/Users/truongkien/dev/HRMS/`

---

## Phase 1: Setup (Prerequisites Verification) ✅

**Purpose**: Verify environment and prerequisites before creating the HRM service

- [x] T001 Verify Veni CLI is installed by running `veni --version`
- [x] T002 [P] Verify platform infrastructure is running (Keycloak, PostgreSQL, Redis, MinIO) via `docker-compose ps` in infrastructure/
- [x] T003 [P] Verify Shell API is running by calling `curl http://localhost:3000/api/health`
- [x] T004 [P] Verify Shell UI is accessible at `http://localhost:5173`
- [x] T005 Verify Bun runtime is installed by running `bun --version`

**Checkpoint**: ✅ All prerequisites verified

---

## Phase 2: Foundational (Environment Preparation) ✅

**Purpose**: Prepare environment for service creation - MUST complete before user stories

- [x] T006 Ensure no existing `services/hrm/` directory exists (check with `ls services/hrm 2>/dev/null`)
- [x] T007 Obtain JWT token from Shell UI for service registration (login at http://localhost:5173, copy token from localStorage)
- [x] T008 [P] Verify no port conflicts on 3006 (API) with `lsof -i :3006`
- [x] T009 [P] Verify no port conflicts on 4176 (UI) with `lsof -i :4176`

**Checkpoint**: ✅ Foundation ready

---

## Phase 3: User Story 1 - Create HRM Service with CLI (Priority: P1) 🎯 MVP ✅

**Goal**: Create a complete HRM service structure using the Veni CLI, install dependencies, start services, and register with Shell

- [x] T010 [US1] Create HRM service by running `veni create service hrm --description "Human Resource Management Service" --category "enterprise"` from repository root
- [x] T011 [US1] Verify service directory structure created at services/hrm/ (check for api/, ui/, docker-compose.yml, README.md)
- [x] T012 [US1] Verify API files exist: services/hrm/api/src/index.ts, services/hrm/api/src/application.ts, services/hrm/api/package.json
- [x] T013 [US1] Verify UI files exist: services/hrm/ui/src/main.tsx, services/hrm/ui/vite.config.ts, services/hrm/ui/package.json
- [x] T014 [US1] Verify environment files created: services/hrm/api/.env, services/hrm/api/.env.example, services/hrm/ui/.env
- [x] T015 [US1] Install API dependencies by running `bun install` in services/hrm/api/
- [x] T016 [US1] Install UI dependencies by running `bun install` in services/hrm/ui/
- [x] T017 [US1] Push database schema by running `bun run db:push` in services/hrm/api/
- [x] T018 [US1] Start API server by running `bun run dev` in services/hrm/api/ (verify output shows server running on configured port)
- [x] T019 [US1] Verify API health endpoint responds by calling `curl http://localhost:3006/api/health`
- [x] T020 [US1] Start UI server by running `bun run dev` in services/hrm/ui/ (verify Vite dev server starts)
- [x] T021 [US1] Verify UI is accessible by calling `curl -s -o /dev/null -w "%{http_code}" http://localhost:4176`
- [x] T022 [US1] Register HRM service with Shell by running `veni register hrm --token <jwt-token>`
- [x] T023 [US1] Verify service registration by checking Shell API response shows service status "available"

**Checkpoint**: ✅ User Story 1 complete

---

## Phase 4: User Story 2 - Configure HRM Service Authentication (Priority: P2) ✅

**Goal**: Configure Keycloak/JWT authentication for the HRM service to secure API endpoints

- [x] T024 [US2] Configure authentication by running `veni setup auth --service-id hrm`
- [x] T025 [US2] Verify auth controller exists at services/hrm/api/src/controllers/auth.controller.ts
- [x] T026 [US2] Verify JWT service exists at services/hrm/api/src/services/jwt-token.service.ts
- [x] T027 [US2] Verify Keycloak service exists at services/hrm/api/src/services/keycloak-token.service.ts
- [x] T028 [US2] Verify JWT strategy exists at services/hrm/api/src/strategies/jwt.strategy.ts
- [x] T029 [US2] Verify APP_ENV_JWT_SECRET is set in services/hrm/api/.env
- [x] T030 [US2] Restart API server to apply authentication changes (stop and run `bun run dev` in services/hrm/api/)
- [x] T031 [US2] Test unauthenticated request returns 401 by calling protected endpoint without token
- [x] T032 [US2] Test authenticated request succeeds by calling protected endpoint with valid JWT token

**Checkpoint**: ✅ User Story 2 complete

---

## Phase 5: User Story 3 - Setup Module Federation for Shell Integration (Priority: P3) ✅

**Goal**: Configure Module Federation so HRM UI loads as a micro-frontend within Shell

- [x] T033 [US3] Configure Module Federation by running `veni setup federation --service-id hrm`
- [x] T034 [US3] Verify federation entry point exists at services/hrm/ui/src/federation/shell-entry.tsx
- [x] T035 [US3] Verify HRM vite.config.ts updated with Module Federation plugin at services/hrm/ui/vite.config.ts
- [x] T036 [US3] Verify Shell vite.config.ts updated with HRM remote at shell/ui/vite.config.ts
- [x] T037 [US3] Restart Shell UI to apply federation changes (stop and run `bun run dev` in shell/ui/)
- [x] T038 [US3] Restart HRM UI to apply federation changes (stop and run `bun run dev` in services/hrm/ui/)
- [x] T039 [US3] Verify HRM appears in Shell navigation at http://localhost:5173
- [x] T040 [US3] Navigate to HRM section in Shell UI and verify micro-frontend loads correctly
- [x] T041 [US3] Verify HRM UI interactions work within Shell (routing, API calls)

**Checkpoint**: ✅ User Story 3 complete

---

## Phase 6: Polish & Validation ✅

**Purpose**: Final validation and documentation

- [x] T042 Run full quickstart.md validation workflow to ensure all steps work end-to-end
- [x] T043 [P] Verify all generated files match expected structure from plan.md
- [x] T044 [P] Verify services/hrm/README.md contains accurate setup instructions
- [x] T045 Clean up any test artifacts or temporary files
- [x] T046 Document any port or configuration changes made during setup

---

## Implementation Evidence

### Files verified on disk (2026-03-17):

**API (services/hrm/api/)**:
- `src/application.ts` — HrmApplication (Ignis BaseApplication, CORS, service bindings)
- `src/controllers/auth.controller.ts` — Auth endpoints
- `src/services/` — jwt-token, keycloak-token, auth, cache, shell-auth-gateway, token-blacklist
- `src/strategies/` — jwt.strategy.ts, keycloak.strategy.ts
- `src/config/env.config.ts` — Zod env validation (26 variables)
- `src/grpc/` — Auth service gRPC impl + ConnectRPC handler
- `src/schemas/`, `src/datasources/`, `src/utils/`, `src/errors/`
- `drizzle.config.ts`, `.env`, `.env.example`

**UI (services/hrm/ui/)**:
- `vite.config.ts` — @module-federation/vite, exposes ./ShellEntry, port 4175
- `package.json` — React 18.3.1, react-router-dom ^7.12.0, Tailwind 4.1.18
- `src/federation/shell-entry.tsx` — BroadcastChannel auth, token exchange, Suspense
- `src/federation/token-exchange.ts` — Keycloak→Service JWT exchange
- `src/utils/token-broadcast.ts` — BroadcastChannel listener
- `src/utils/token-utils.ts` — Multi-strategy token retrieval
- `src/utils/api-client.ts` — Axios with auth interceptors
- `src/providers/UserProvider.tsx` — React context for user info
- `src/themes/` — Ardor theme system (10 themes, dark mode)
- `Dockerfile`, `docker-entrypoint.sh`, `nginx.conf`, `public/env-config.js`

---

## Notes

- All CLI commands run from repository root: `/Users/truongkien/dev/HRMS/`
- API port: 3001 (actual, updated from initial 3006 plan)
- UI port: 4175 (actual, updated from initial 4176 plan)
- Infrastructure alignment with veni-ai shell updated 2026-03-17
