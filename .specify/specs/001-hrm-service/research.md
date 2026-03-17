# Research: HRM Service Creation

**Feature**: 001-hrm-service
**Date**: 2026-01-26

## CLI Command Analysis

### Decision: Use `veni create service hrm` command
**Rationale**: The Veni CLI already provides a complete service scaffolding solution. The `create service` command generates both API and UI components with all necessary configurations.

**Alternatives considered**:
- Manual file creation: Rejected - error-prone, time-consuming, doesn't follow platform standards
- Fork existing service: Rejected - would include business logic not relevant to HRM
- Custom scaffolding script: Rejected - duplicates existing CLI functionality

### Command Syntax

```bash
# Primary command
veni create service hrm \
  --description "Human Resource Management Service" \
  --category "enterprise" \
  --register

# Alternative: With explicit ports
veni create service hrm \
  --api-port 3006 \
  --ui-port 4176 \
  --description "Human Resource Management Service" \
  --category "enterprise"
```

### Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--api-port` | number | auto-detect | API server port |
| `--ui-port` | number | auto-detect | UI dev server port |
| `--description` | string | "" | Service description |
| `--category` | string | "custom" | Service category |
| `--skip-auth` | boolean | false | Skip authentication setup |
| `--skip-ui` | boolean | false | Create API only |
| `--skip-api` | boolean | false | Create UI only |
| `--register` | boolean | false | Register with Shell after creation |
| `--no-git` | boolean | false | Skip Git initialization |

## Template Structure Analysis

### Decision: Use `templates/veni-service` template
**Rationale**: This is the standard template used by the CLI, based on the Drive service structure. It includes all necessary files for a complete micro-service.

**Template Contents**:
- API: Hono framework with @venizia/ignis, Drizzle ORM, JWT/Keycloak auth
- UI: React 18 with Vite, Module Federation, TailwindCSS
- Infrastructure: Docker Compose, environment configs

### Generated File Structure

```
services/hrm/
├── api/                        # Backend service
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── services/           # Business logic
│   │   ├── config/             # Environment config
│   │   ├── datasources/        # Database connections
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── strategies/         # Auth strategies
│   │   ├── utils/              # Utilities
│   │   ├── application.ts      # App setup
│   │   └── index.ts            # Entry point
│   ├── drizzle.config.ts       # Database config
│   └── package.json
├── ui/                         # Frontend service
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── pages/              # Page components
│   │   ├── federation/         # Module Federation entry
│   │   ├── providers/          # React context providers
│   │   ├── utils/              # Utilities
│   │   └── main.tsx            # Entry point
│   ├── vite.config.ts          # Vite + Federation config
│   └── package.json
├── docker-compose.yml          # Local development
└── README.md                   # Service documentation
```

## Port Allocation Strategy

### Decision: Use auto-detection with fallback
**Rationale**: The CLI's `port-finder.ts` automatically finds available ports starting from base values. This prevents conflicts with existing services.

**Port Ranges**:
- API ports: 3001-3099 (Shell uses 3000)
- UI ports: 4173-4199 (based on Vite defaults)

**Current Service Ports** (from infrastructure):
- Shell API: 3000
- Shell UI: 5173
- Keycloak: 18080
- PostgreSQL: 5432
- Redis: 16379
- MinIO: 19000/19001

**Recommended HRM Ports**:
- API: 3006 (next available after existing services)
- UI: 4176 (corresponding UI port)

## Authentication Integration

### Decision: Use Keycloak + JWT dual strategy
**Rationale**: Follows platform standard. Keycloak provides SSO/OAuth2, JWT enables service-to-service auth.

**Flow**:
1. User authenticates via Shell UI → Keycloak
2. Shell provides JWT token to micro-frontend
3. HRM UI receives token via Module Federation bridge
4. HRM API validates JWT using platform shared secret

**Generated Auth Files**:
- `auth.controller.ts`: Token exchange endpoints
- `jwt-token.service.ts`: JWT validation/generation
- `keycloak-token.service.ts`: Keycloak token introspection
- `jwt.strategy.ts`: Hono auth middleware
- `keycloak.strategy.ts`: OAuth2 strategy

## Module Federation Configuration

### Decision: Standard federation setup via CLI
**Rationale**: `veni setup federation` configures both the service UI and Shell's vite.config.ts.

**Configuration Points**:
1. Service `ui/vite.config.ts`: Exposes `./shell-entry` as federated module
2. Shell `shell/ui/vite.config.ts`: Adds HRM as remote

**Entry Point**:
```typescript
// ui/src/federation/shell-entry.tsx
// Exports the HRM page component for Shell to load dynamically
```

## Error Handling Patterns

### CLI Exit Codes

| Code | Condition | User Action |
|------|-----------|-------------|
| 0 | Success | Continue to next step |
| 1 | General error | Check error message |
| 3 | Service exists | Choose different name or delete existing |
| 4 | Port in use | Specify different port or stop conflicting service |
| 5 | Shell connection failed | Start Shell API first |
| 6 | Auth failed | Check JWT token validity |

### Recovery Strategy

1. **Service exists**: Delete `services/hrm/` and retry, or use different name
2. **Port conflict**: Use `--api-port` and `--ui-port` to specify available ports
3. **Shell not running**: Start Shell API/UI before registration
4. **Auth setup fails**: Run `veni setup auth --service-id hrm` separately

## Dependencies Analysis

### No New Dependencies Required
The HRM service uses the same dependencies as the template:

**API Dependencies** (from template):
- @venizia/ignis: Platform framework
- hono: HTTP server
- drizzle-orm: Database ORM
- zod: Validation
- jose: JWT handling

**UI Dependencies** (from template):
- react: UI framework
- react-router-dom: Routing
- @originjs/vite-plugin-federation: Module Federation
- tailwindcss: Styling
- axios: HTTP client
