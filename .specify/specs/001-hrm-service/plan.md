# Implementation Plan: HRM Service Creation via Veni CLI

**Branch**: `001-hrm-service` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `.specify/specs/001-hrm-service/spec.md`

## Summary

Create a new Human Resource Management (HRM) service using the existing Veni platform CLI. The feature leverages the `veni create service` command to scaffold a complete service structure with API (Hono/TypeScript) and UI (React/Vite) components, then configures authentication and Module Federation for Shell integration.

## Technical Context

**Language/Version**: TypeScript 5.x (CLI, API, UI)
**Primary Dependencies**:
- CLI: Commander, Inquirer, Chalk, fs-extra, Mustache
- API: Hono, @venizia/ignis, Drizzle ORM, Zod, Jose (JWT)
- UI: React 18, Vite, TailwindCSS, Module Federation
**Storage**: PostgreSQL (via Drizzle ORM), MinIO (object storage), Redis (cache)
**Testing**: Bun test (API), Vitest (UI)
**Target Platform**: Linux server (Docker), Web browser (UI)
**Project Type**: Web application (micro-frontend architecture)
**Performance Goals**: Service creation <2 minutes, API startup <5 seconds
**Constraints**: Must use existing CLI templates, integrate with Keycloak auth
**Scale/Scope**: Single new service (HRM), 3 CLI commands to execute

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution file contains placeholder content only. No specific project constraints defined. Proceeding with platform best practices:

| Check | Status | Notes |
|-------|--------|-------|
| Uses existing tooling | PASS | Leverages existing `veni` CLI |
| Follows platform patterns | PASS | Uses standard template structure |
| No new dependencies | PASS | HRM service uses template dependencies |
| Testable outcomes | PASS | Each step produces verifiable artifacts |

## Project Structure

### Documentation (this feature)

```text
.specify/specs/001-hrm-service/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── hrm-service-api.yaml
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (to be generated)

```text
services/hrm/
├── api/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt-token.service.ts
│   │   │   ├── keycloak-token.service.ts
│   │   │   └── index.ts
│   │   ├── config/
│   │   │   ├── env.config.ts
│   │   │   └── index.ts
│   │   ├── datasources/
│   │   ├── schemas/
│   │   ├── application.ts
│   │   └── index.ts
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── drizzle.config.ts
├── ui/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── HrmPage.tsx
│   │   ├── federation/
│   │   │   └── shell-entry.tsx
│   │   ├── utils/
│   │   │   ├── api-client.ts
│   │   │   ├── token-exchange.ts
│   │   │   └── token-broadcast.ts
│   │   ├── providers/
│   │   │   └── UserProvider.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker-compose.yml
├── .gitignore
└── README.md
```

**Structure Decision**: Web application with separate API (backend) and UI (frontend) directories, following the existing Veni platform micro-service pattern from `templates/veni-service`.

## Complexity Tracking

No violations - using existing CLI tooling and templates.

## Implementation Phases

### Phase 0: Research (Completed)

See [research.md](./research.md) for:
- CLI command syntax and options
- Template structure analysis
- Port allocation strategy
- Error handling patterns

### Phase 1: Design & Contracts

See artifacts:
- [data-model.md](./data-model.md) - Service entity definitions
- [contracts/hrm-service-api.yaml](./contracts/hrm-service-api.yaml) - API contract
- [quickstart.md](./quickstart.md) - Step-by-step execution guide

### Phase 2: Tasks (Generated via /speckit.tasks)

Task breakdown will be generated in [tasks.md](./tasks.md).
