# Implementation Plan: HRM UI Screens

**Branch**: `002-hrm-ui-screens` | **Date**: 2026-03-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `.specify/specs/002-hrm-ui-screens/spec.md`
**Design Reference**: `designs/HRMSv1.pen` (5 screens) + `designs/design-analysis.md` (component mapping)

## Summary

Implement 5 HRM UI screens (Login, Employee Directory, Employee Profile, My Requests, Notifications) plus shared sidebar navigation as React components using the Ardor UI Kit, Tailwind CSS 4 design tokens, and the Pencil MCP design-to-code workflow.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**:
- UI: React 18, Vite 7, TailwindCSS 4, @venizia/ardor-ui-kit
- State: React hooks, React Router DOM
- Auth: Keycloak JS adapter, Jose (JWT)
- HTTP: Fetch API or Axios
- Module Federation: @originjs/vite-plugin-federation
**Testing**: Vitest + React Testing Library
**Target Platform**: Web browser (modern Chrome, Firefox, Safari, Edge)
**Project Type**: Micro-frontend (Module Federation via Vite)
**Design System**: Ardor UI Kit (shadcn/ui + Radix UI), Inter font, Lucide icons
**Styling**: Tailwind CSS 4 with CSS custom properties from `designs/design-tokens.css`

## Constitution Check

| Check | Status | Notes |
|-------|--------|-------|
| I. SCS | PASS | HRM owns its UI, API, DB |
| II. Ignis | N/A | This spec is UI-only; API is spec 001 |
| III. Ardor First | PASS | 32 existing components mapped, 6 to compose, 1 new |
| IV. Module Federation | PASS | ShellEntry exposed via federation |
| V. Tailwind CSS 4 | PASS | All colors via design-tokens.css variables |
| VI. Type Safety | PASS | TypeScript strict, Zod for API responses |
| VII. TDD | PASS | Vitest tests before implementation |
| VIII. Keycloak Auth | PASS | Login via Keycloak, JWT exchange |

## Project Structure

```text
services/hrm/ui/
├── src/
│   ├── components/
│   │   ├── shared/               # Shared UI elements
│   │   │   ├── AppSidebar.tsx    # Sidebar navigation
│   │   │   ├── EmployeeCard.tsx  # Employee directory card
│   │   │   ├── StatsCard.tsx     # Stats summary card
│   │   │   ├── ProfileHeader.tsx # Employee profile header
│   │   │   ├── SectionAccordion.tsx  # Expandable profile section
│   │   │   ├── NotificationItem.tsx  # Single notification
│   │   │   └── RequestRow.tsx    # Request table row
│   │   ├── login/                # Login screen components
│   │   │   └── LoginForm.tsx
│   │   ├── directory/            # Employee directory components
│   │   │   ├── EmployeeGrid.tsx
│   │   │   ├── EmployeeFilters.tsx
│   │   │   └── ViewToggle.tsx
│   │   ├── profile/              # Employee profile components
│   │   │   ├── ProfileTabs.tsx
│   │   │   └── PersonalInfoSection.tsx
│   │   ├── requests/             # My Requests components
│   │   │   ├── RequestStats.tsx
│   │   │   ├── RequestTable.tsx
│   │   │   └── CreateRequestDialog.tsx
│   │   └── notifications/        # Notifications components
│   │       ├── NotificationList.tsx
│   │       └── NotificationFilters.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── EmployeeDirectoryPage.tsx
│   │   ├── EmployeeProfilePage.tsx
│   │   ├── MyRequestsPage.tsx
│   │   └── NotificationsPage.tsx
│   ├── hooks/
│   │   ├── useEmployees.ts
│   │   ├── useEmployee.ts
│   │   ├── useRequests.ts
│   │   ├── useNotifications.ts
│   │   └── useAuth.ts
│   ├── types/
│   │   ├── employee.ts
│   │   ├── request.ts
│   │   ├── notification.ts
│   │   └── common.ts
│   ├── federation/
│   │   └── shell-entry.tsx
│   ├── utils/
│   │   ├── api-client.ts
│   │   └── token-exchange.ts
│   └── main.tsx
├── index.css                     # Imports design-tokens.css + Tailwind
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Component Implementation Strategy

### Design-to-Code Workflow (Per Component)

1. Open `HRMSv1.pen` in Pencil
2. Use `batch_get` to read component structure
3. Use `get_screenshot` to capture design reference
4. Map to Ardor components (from `designs/design-analysis.md`)
5. Write React + Tailwind component
6. Use `get_screenshot` to verify output matches design
7. Write tests

### Component Priority Order

| Priority | Component | Ardor Status | Screen(s) |
|----------|-----------|-------------|-----------|
| 1 | AppSidebar | Exists (Sidebar system) | All authenticated |
| 2 | LoginForm | Exists (Card, TextField, PasswordInput, Button) | Login |
| 3 | EmployeeCard | **Compose** (Card + Avatar + Badge + Button) | Directory |
| 4 | EmployeeGrid + Filters | Exists (SearchInput, Select) + CSS grid | Directory |
| 5 | ProfileHeader | **Compose** (Avatar + Badge + text) | Profile |
| 6 | SectionAccordion | **Compose** (Card + Accordion) | Profile |
| 7 | ProfileTabs | Exists (Tabs) | Profile |
| 8 | StatsCard | **Compose** (Card + icon + text) | Requests |
| 9 | RequestTable | Exists (DataTable + Badge) | Requests |
| 10 | NotificationItem | **New** (dot + icon + text + badge + timestamp) | Notifications |

### Import Patterns

```tsx
// Ardor UI Kit (NPM package)
import { Button, Card, Badge, Avatar, Tabs, TabsList, TabsTrigger, TabsContent } from '@venizia/ardor-ui-kit';
import { TextField, PasswordInput, CheckboxInput } from '@venizia/ardor-ui-kit';
import { Dialog, AlertDialog, AdaptiveDialog } from '@venizia/ardor-ui-kit';

// Layout components
import { ScreenLayout, FormLayout, NoAuthLayout } from '@/layout';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/layout';

// Shared composed components
import { SearchInput, EmptyState, Loading, ConfirmDialog, DataTable } from '@/components/shared';

// Styling utility
import { cn } from '@/ardor';
```

## AI Agent Strategy

| Task Type | Agent | Reason |
|-----------|-------|--------|
| Design-to-code from .pen | **Claude Code** | Pencil MCP access required |
| Complex composed components | **Claude Code** | Ardor composition, state logic |
| Page layout and routing | **Gemini CLI** | Boilerplate, large context |
| Data hooks and API client | **Gemini CLI** | Repetitive patterns |
| Type definitions | **Gemini CLI** | Fast boilerplate |
| Tests | **Gemini CLI** | Pattern-based test generation |
| Visual verification | **Claude Code** | Pencil MCP get_screenshot |

## Complexity Tracking

No violations — all components map to Ardor primitives or simple compositions.
