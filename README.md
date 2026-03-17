# HRMS — Human Resource Management System

Self-contained HRM service built on the Veni-AI platform stack. Designed for Nexpando as the initial client deployment.

## Architecture

| Layer | Stack |
|-------|-------|
| **Frontend** | React 18 + Vite 7 + Tailwind CSS 4 + Ardor UI Kit |
| **Backend** | Ignis (Hono-based) + Drizzle ORM + PostgreSQL |
| **Auth** | Keycloak → Shell JWT → Service JWT exchange |
| **Microfrontend** | Module Federation (loads into Shell app) |
| **Runtime** | Bun + TypeScript strict mode |

## Project Structure

```
HRMS/
├── services/hrm/
│   ├── api/                 # Ignis backend
│   │   └── src/
│   │       ├── controllers/ # Route handlers
│   │       ├── services/    # Business logic
│   │       ├── schemas/     # Drizzle DB schemas
│   │       ├── strategies/  # Auth strategies
│   │       └── grpc/        # gRPC service definitions
│   └── ui/                  # React microfrontend
│       └── src/
│           ├── components/  # UI components (login, requests, shared)
│           ├── pages/       # Route pages (Login, Directory, Profile, Requests, Notifications)
│           ├── hooks/       # Data hooks (useAuth, useEmployees, useNotifications, etc.)
│           ├── federation/  # Module Federation entry (shell-entry.tsx)
│           └── utils/       # API client, token utils
├── designs/                 # Pencil .pen design files + design tokens
├── .specify/                # Spec Kit SDD artifacts + constitution
└── package.json             # Bun workspace root
```

## Setup

```bash
# Install dependencies
bun install

# Copy environment files
cp services/hrm/api/env.example services/hrm/api/.env

# Start API dev server
bun run dev:api

# Start UI dev server (port 4175)
bun run dev:ui
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev:api` | Start API dev server |
| `bun run dev:ui` | Start UI dev server (port 4175) |
| `bun run build` | Production build (UI) |
| `bun run test` | Run all tests |
| `bun run type-check` | TypeScript type checking |
| `bun run lint` | ESLint |

## UI Screens

- **Login** — Email/password with @nexpando.com domain validation, forgot password flow (EN/VI)
- **Employee Directory** — Searchable grid/list view with department filters
- **Employee Profile** — Tabbed view (personal, employment, documents, time off)
- **My Requests** — Leave/asset/document requests with create dialog and status tracking
- **Notifications** — Categorized notification list with read/unread state

## Docker

```bash
# Build UI image
cd services/hrm/ui
docker build -t hrms-ui .

# Run with runtime env injection
docker run -p 8080:8080 \
  -e VITE_API_URL=https://api.example.com \
  -e VITE_SHELL_URL=https://shell.example.com \
  -e VITE_SERVICE_ID=hrm \
  hrms-ui
```

## Testing

```bash
# Run all tests (13 files, 33 tests)
cd services/hrm/ui
bun run test

# Watch mode
bun run test:watch

# Type check
bun run type-check
```
