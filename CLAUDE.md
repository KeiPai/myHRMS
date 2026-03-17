# HRMS — Human Resource Management System

## Project Overview

Standalone HRM service built on the Veni-AI platform stack, following the Figma-to-Production pipeline. Designed for Nexpando as the initial client deployment.

## Architecture

- **Pattern:** Self-Contained System (SCS) — the HRM service owns its UI + API + DB
- **Backend:** Ignis framework (Hono-based), Controllers -> Services -> Repositories
- **Frontend:** React 18 + Vite 7, Module Federation microfrontend
- **Database:** PostgreSQL via Drizzle ORM (type-safe schemas)
- **Styling:** Tailwind CSS 4 with design tokens from Figma
- **UI Kit:** Ardor (extends shadcn/ui + Radix UI)
- **Auth:** Keycloak -> Shell JWT -> Service JWT exchange
- **Runtime:** Bun + TypeScript strict mode

## Project Structure

```
HRMS/
├── designs/                      # Pencil .pen files + design tokens
│   ├── HRMSv1.pen              # Figma export (5 screens: Login, Directory, Profile, Requests, Notifications)
│   ├── design-analysis.md       # Component mapping + token extraction (335 lines)
│   └── design-tokens.css        # Tailwind CSS 4 custom properties
├── .specify/                     # Spec Kit SDD artifacts
│   ├── memory/constitution.md   # 8 articles: SCS, Ignis, Ardor, ModFed, TW4, Types, TDD, Keycloak
│   └── specs/
│       ├── 001-hrm-service/     # Service scaffolding (CLI, auth, federation)
│       └── 002-hrm-ui-screens/  # UI screens implementation (5 screens + sidebar)
├── services/hrm/
│   ├── api/                     # Ignis backend (Hono + Drizzle)
│   │   └── src/{controllers,services,repositories,types,config,datasources,schemas,strategies}/
│   └── ui/                      # React microfrontend (Vite + Tailwind + Ardor)
│       └── src/{components,pages,hooks,types,federation,utils}/
└── package.json                 # Bun workspace root
```

## Spec Kit Artifacts

### 001-hrm-service (Service Infrastructure)
Covers CLI scaffolding, auth setup, Module Federation. 3 user stories, 46 tasks, 12 FRs.
- `spec.md` — Service creation via Veni CLI
- `plan.md` — TypeScript + Hono + Drizzle + React + Vite stack
- `tasks.md` — 6-phase task breakdown (T001-T046)
- `data-model.md` — Service, ServiceConfiguration, ServiceRegistration entities
- `research.md` — CLI analysis, port allocation, auth flow, ModFed config
- `quickstart.md` — 10-step setup guide
- `contracts/hrm-service-api.yaml` — OpenAPI 3.1.0 (health, auth exchange/verify/logout)

### 002-hrm-ui-screens (UI Implementation)
Covers 5 Figma screens + shared sidebar. 6 user stories, 57 tasks, 23 FRs.
- `spec.md` — Login, Directory, Profile, Requests, Notifications, Sidebar
- `plan.md` — Component-by-component approach with Pencil MCP workflow
- `tasks.md` — 8-phase task breakdown (T001-T057)
- `data-model.md` — Employee, Department, Request, Notification entities + TypeScript types

## Design System

### Ardor Component Usage (from design-analysis.md)

| Status | Count | Examples |
|--------|-------|---------|
| **Exists** | 32 | Sidebar, Button, Card, TextField, PasswordInput, Badge, Avatar, Tabs, Table, Select, SearchInput |
| **Compose** | 6 | EmployeeCard, ProfileHeader, StatsCard, SectionAccordion, ViewToggle, RequestRow |
| **New** | 1 | NotificationItem |
| **CSS only** | 4 | Gradient bg, card grid, typography headings, date group headers |

### Design Tokens (designs/design-tokens.css)
- Primary: `#00a63e` (green brand)
- Font: Inter (single family)
- Layout: 256px sidebar + fill main
- All colors via `--variable` custom properties

### Import Patterns
```tsx
import { Button, Card, Badge, Avatar, Tabs } from '@venizia/ardor-ui-kit';
import { TextField, PasswordInput, CheckboxInput } from '@venizia/ardor-ui-kit';
import { ScreenLayout, NoAuthLayout } from '@/layout';
import { Sidebar, SidebarProvider, SidebarMenu } from '@/layout';
import { SearchInput, DataTable, EmptyState } from '@/components/shared';
import { cn } from '@/ardor';
```

## Development Pipeline (Figma-to-Production)

| Phase | Status | Command / Tool | Output |
|-------|--------|---------------|--------|
| 0. Setup | Done | `specify init --here --ai claude` | `.specify/` dir, constitution |
| 1. Extract | Done | Figma plugin -> .pen | `designs/HRMSv1.pen` |
| 2. Analyze | Done | Pencil MCP tools | `designs/design-analysis.md` |
| 3. Specify | Done | Spec Kit | `001/spec.md`, `002/spec.md` |
| 4. Plan | Done | Spec Kit | `001/plan.md`, `002/plan.md` |
| 5a. Implement 001 | **Done** | Veni CLI + manual | Service scaffold, auth, Module Federation |
| 5b. Implement 002 | **Done** | Claude Code + Gemini CLI | 65/65 tasks (100%) — all screens, tests (33), code quality pass |
| 6. Verify | **Done** | Visual diff + tests + simplify | 33 tests pass, tsc clean, 8 quality fixes |

## Implementation Status (as of 2026-03-17)

### 001-hrm-service: ✅ COMPLETE (46/46 tasks)
Full service scaffold with API (Ignis/Hono, auth, gRPC, Drizzle), UI infrastructure (Module Federation, token exchange, BroadcastChannel, Ardor themes), and deployment (Docker, nginx, env-config).

### 002-hrm-ui-screens: ✅ COMPLETE (65/65 tasks, 100%)

Claude (39 tasks): design-to-code, visual verification, integration, code quality simplify.
Gemini (26 tasks): types, hooks, tests (13 files / 33 tests), audits.

| Phase | Status | What's Done |
|-------|--------|-------------|
| 1. Setup | ✅ Complete | Infrastructure, types, hooks, config |
| 2. Sidebar | ✅ Complete | AppSidebar + tests (5 pass) |
| 3. Login | ✅ Complete | LoginForm, LoginPage, useAuth + tests (5 pass) |
| 4. Directory | ✅ Complete | EmployeeCard, filters, grid, page + tests (pass) |
| 5. Profile | ✅ Complete | ProfileHeader, accordion, tabs, sections + tests (pass) |
| 6. Requests | ✅ Complete | StatsCard, RequestTable, dialog, page + tests (pass) |
| 7. Notifications | ✅ Complete | NotificationItem, list, filters, page + tests (pass) |
| 8. Integration | ✅ Complete | React Router, AppLayout, shell-entry, responsive, Ardor audit |
| 9. Simplify | ✅ Complete | 8 code quality fixes (lazy loading, debounce, types, async forms) |

## Conventions

- Use Ardor components before creating new ones (Constitution Art. III)
- All colors via CSS variables (never hardcode hex) (Constitution Art. V)
- Inter font family throughout
- TDD: tests before implementation (Constitution Art. VII)
- `cn()` utility for Tailwind class merging
- Design-to-code: open .pen in Pencil, `batch_get` structure, `get_screenshot` to verify

## Commands

```bash
bun install          # Install all workspace dependencies
bun run dev:api      # Start API dev server
bun run dev:ui       # Start UI dev server
bun test             # Run all tests
```
