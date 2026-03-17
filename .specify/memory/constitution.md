# HRMS Constitution

## Core Principles

### I. Self-Contained Systems (SCS)
The HRM service owns its UI, API, and database as a single deployable unit. No shared database access between services. Communication with other services only through well-defined APIs. Each layer (controller, service, repository) has clear responsibilities and boundaries.

### II. Ignis Backend Pattern
All backend code follows the Ignis framework conventions:
- Controllers handle HTTP request/response (Hono routes)
- Services contain business logic (injectable via IoC/DI)
- Repositories handle data access (Drizzle ORM)
- Schemas define database tables and DTOs (Drizzle + Zod)
- Config manages environment variables and app settings

### III. Ardor UI Kit First
Every UI element MUST use existing Ardor components before creating new ones. New components are composed from Ardor primitives. Only create truly new components when no existing primitive or composition works. All Ardor components use Radix UI for accessibility.

### IV. Module Federation
The HRM UI is a microfrontend loaded dynamically within the Shell application via Vite Module Federation. It exposes a single `ShellEntry` component. Routing, auth context, and theme are provided by Shell.

### V. Tailwind CSS 4
All styling uses Tailwind CSS utility classes. Colors reference CSS custom properties from design tokens — never hardcode hex values. Use `cn()` utility for conditional class merging. No inline styles, no CSS modules, no styled-components.

### VI. Type Safety
Bun + TypeScript in strict mode. Drizzle ORM for type-safe database schemas and queries. Zod for runtime validation at API boundaries. No `any` types except in clearly justified edge cases.

### VII. Test-Driven Development
Tests are written before implementation (Red-Green-Refactor). API: Bun test. UI: Vitest + React Testing Library. Each user story has independently testable acceptance criteria. Integration tests for auth flows and API contracts.

### VIII. Keycloak Authentication
All protected endpoints require valid JWT tokens. Authentication flows through Keycloak -> Shell JWT -> Service JWT exchange. Token validation via Jose library. Role-based access control for HR manager vs employee views.

## Design System Constraints

- **Font:** Inter (single font family, all screens)
- **Primary Color:** #00a63e (green brand)
- **Layout:** 256px sidebar + fill main content
- **Breakpoints:** 1440px (desktop), 1024px (tablet), 768px (mobile)
- **Icons:** Lucide icon set
- **5 Screens:** Login, Employee Directory, Employee Profile, My Requests, Notifications

## Development Workflow

1. Design-first: All UI work references `.pen` design files via Pencil MCP
2. Spec-first: Features start with `/speckit.specify` before any code
3. Component extraction: One component at a time — extract, create, validate, next
4. Visual verification: `get_screenshot` after each component to compare with design
5. API contract-first: Define API contracts before implementing endpoints

## Governance

This constitution governs all HRMS development. Amendments require documented rationale, team review, and migration plan for existing code. All PRs must verify compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-03-17 | **Last Amended**: 2026-03-17
