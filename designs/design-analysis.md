# HRM Service — Design Analysis

**Source:** `HRMSv1.pen` (imported from Figma)
**Screens:** 5 (Login, Employee Directory, Employee Profile, My Requests, Notifications)
**Generated:** 2026-03-16

---

## 1. Design Tokens

### 1.1 Color Palette

#### Fill Colors

| Hex | Role | Tailwind Token |
|-----|------|----------------|
| `#ffffff` | Background (cards, sidebar) | `--background` |
| `#f9fafb` | Background (muted/page) | `--muted` |
| `#f3f4f6` | Background (gradient end) | `--accent` |
| `#e5e7eb` | Border | `--border` |
| `#d1d5dc` | Border (stronger) | `--input` |
| `#333333` | Dark fill | — |
| `#00a63e` | Primary green (brand) | `--primary` |
| `#1ab443` | Primary green (sidebar active) | `--primary` (variant) |
| `#00c950` | Accent green (avatars) | `--primary-foreground` bg |
| `#2b7fff` | Info blue (indicators) | `--info` |
| `#fb2c36` | Destructive red | `--destructive` |
| `#dcfce7` | Success bg (approved) | `--success-bg` |
| `#f0fdf4` | Success bg (light) | — |
| `#ffedd4` | Warning bg (pending) | `--warning-bg` |
| `#fff7ed` | Warning bg (light) | — |
| `#ffe2e2` | Error bg (rejected) | `--error-bg` |
| `#eff6ff` | Info bg | `--info-bg` |
| `#fffbeb` | Caution bg | — |

#### Text Colors

| Hex | Role | Tailwind Token |
|-----|------|----------------|
| `#0a0a0a` | Primary text | `--foreground` |
| `#101828` | Headings | `--foreground` |
| `#1e2939` | Secondary headings | `--foreground` |
| `#364153` | Body text (strong) | `--muted-foreground` (dark) |
| `#4a5565` | Body text | `--muted-foreground` |
| `#6a7282` | Muted text | `--muted-foreground` |
| `#99a1af` | Placeholder text | `--placeholder` |
| `#000000` | Black text | — |
| `#ffffff` | White text (on primary) | `--primary-foreground` |
| `#00a63e` | Green text (links/active) | `--primary` |
| `#155dfc` | Blue text (links) | `--link` |
| `#008236` | Approved status text | `--success` |
| `#f54900` | Pending status text | `--warning` |
| `#ca3500` | Warning text | `--warning` (dark) |
| `#c10007` | Rejected status text | `--destructive` |

#### Stroke Colors

| Hex | Role |
|-----|------|
| `#e5e7eb` | Default border |
| `#d1d5dc` | Input border |
| `#f3f4f6` | Light separator |
| `#00a63e` / `#00c950` | Active/success border |
| `#2b7fff` | Info border |
| `#ff6900` / `#fe9a00` | Warning border |
| `#364153` / `#6a7282` | Icon stroke |

### 1.2 Typography

| Property | Values |
|----------|--------|
| **Font Family** | `Inter` (single font, all screens) |
| **Font Sizes** | 10, 12, 14, 16, 18, 20, 24, 30 (px) |
| **Font Weights** | 400 (normal), 500 (medium), 600 (semibold), 700 (bold) |

**Typography Scale → Tailwind:**

| Design Size | Tailwind Class | Usage |
|-------------|---------------|-------|
| 30px | `text-3xl` | Page titles (Login brand) |
| 24px | `text-2xl` | Section headings |
| 20px | `text-xl` | Sub-headings |
| 18px | `text-lg` | Employee names |
| 16px | `text-base` | Body text, nav items |
| 14px | `text-sm` | Secondary text, labels |
| 12px | `text-xs` | Captions, badges, metadata |
| 10px | `text-[10px]` | Fine print |

### 1.3 Spacing & Radii

**Corner Radii:**

| Value | Tailwind Class | Usage |
|-------|---------------|-------|
| 0 | `rounded-none` | Sharp edges |
| 4 | `rounded-sm` | Small elements |
| 8 | `rounded-md` / `rounded-lg` | Cards, inputs |
| 10 | `rounded-lg` | Table containers |
| 14 | `rounded-xl` | Sidebar search button |
| 16 | `rounded-2xl` | Nav links, login card |
| 9999 (pill) | `rounded-full` | Avatars, indicators |

**Standard Gap Values:**

| Value | Tailwind Class | Usage |
|-------|---------------|-------|
| 4 | `gap-1` | Tight (nav items, label stacks) |
| 8 | `gap-2` | Compact (icon + text) |
| 10 | `gap-2.5` | Sidebar search inner |
| 12 | `gap-3` | Card content |
| 16 | `gap-4` | Section spacing |
| 24 | `gap-6` | Major sections |
| 32 | `gap-8` | Card grid |

**Common Padding Patterns:**

| Pattern | Usage |
|---------|-------|
| `p-6` (24px all) | Page content areas |
| `px-4 py-3` (16h, 12v) | Sidebar items |
| `px-10 py-3` (40h, 12v) | Tab content padding |
| `px-4` (16px horizontal) | Sidebar header |
| `p-1` | Table container inset |

---

## 2. Component Mapping → Ardor UI Kit

### 2.1 Shared Components (all screens)

| Design Pattern | Ardor Component | Status | Notes |
|---------------|----------------|--------|-------|
| Sidebar (256px, left) | `Sidebar` + `SidebarProvider` | **Exists** | Match 256px width, white bg, right border |
| Sidebar logo + subtitle | `SidebarHeader` | **Exists** | "NEXPANDO" + "GROWING TOGETHER" |
| Search/account button | `SidebarMenuButton` | **Exists** | Rounded, gray bg, icon + text + chevron |
| Nav links (6 items) | `SidebarMenu` + `SidebarMenuItem` + `SidebarMenuButton` | **Exists** | Active: green bg (#1ab443), icon + label |
| Language switcher | `Button` (group) | **Exists** | EN/VI toggle at bottom |
| Logout link | `SidebarMenuButton` | **Exists** | Icon + "Logout" at bottom |
| Notification badge | `Badge` | **Exists** | Red dot on "Notifications" nav item |

### 2.2 Screen 1: Login

| Design Pattern | Ardor Component | Status | Notes |
|---------------|----------------|--------|-------|
| Full page layout | `NoAuthLayout` | **Exists** | Centered content, optional header |
| Login card (centered) | `Card` | **Exists** | Double shadow, rounded-2xl, white bg |
| Gradient page background | — | **CSS** | linear-gradient(135deg, #f9fafb, #f3f4f6) |
| Email input + icon | `TextField` | **Exists** | With left icon support |
| Password input + toggle | `PasswordInput` | **Exists** | Built-in visibility toggle + lock icon |
| "Remember me" checkbox | `CheckboxInput` | **Exists** | Checkbox + label |
| "Forgot password?" link | `Button` variant=link | **Exists** | Green text link |
| "Sign in" button | `Button` variant=default | **Exists** | Green bg, white text, full-width |
| Privacy/Terms footer | Text links | **CSS** | Gray centered text |

### 2.3 Screen 2: Employee Directory

| Design Pattern | Ardor Component | Status | Notes |
|---------------|----------------|--------|-------|
| Page header (title + subtitle) | Heading + `<p>` | **CSS** | "Employee Directory 28/8" |
| Search bar | `SearchInput` | **Exists** | Icon + placeholder + filter icon |
| Department filter dropdown | `Select` | **Exists** | "All Departments" |
| View toggle (grid/list/kanban) | `Button` group (toggle) | **Compose** | 3 icon buttons |
| Employee card | `Card` | **Compose** | Avatar + name + role + location + contact + Profile button |
| Avatar circle (colored) | `Avatar` | **Exists** | Initials on green gradient bg |
| "Profile" button | `Button` variant=outline | **Exists** | Gray border, small |
| Card grid (3 columns) | — | **CSS** | `grid grid-cols-3 gap-8` |

### 2.4 Screen 3: Employee Profile

| Design Pattern | Ardor Component | Status | Notes |
|---------------|----------------|--------|-------|
| Back navigation | `Breadcrumb` or `Button` + icon | **Exists** | "← Nguyễn Văn A" |
| Profile header | Custom compose | **Compose** | Avatar + name + role + status badge + tenure + managers |
| Status badge ("Active Full-time") | `Badge` | **Exists** | Green bg (#dcfce7), green text |
| Tab navigation (6 tabs) | `Tabs` + `TabsList` + `TabsTrigger` | **Exists** | Individual Profile, Work History, Payroll & Benefits, Attendance, Documents & Contracts, Assets |
| "Update Profile" button | `Button` | **Exists** | Green bg, right-aligned |
| Section card ("Personal Identification") | `Card` with `Accordion` | **Compose** | Title + collapse arrow + form fields |
| Form field rows (2-col) | `FormField` or grid layout | **Exists** | Label + value pairs |

### 2.5 Screen 4: My Requests

| Design Pattern | Ardor Component | Status | Notes |
|---------------|----------------|--------|-------|
| Page header + action button | Heading + `Button` | **Exists** | "My Requests" + "Create Request" (green) |
| Stats cards (3 horizontal) | `Card` | **Compose** | Icon + number + label + sublabel, bordered |
| Request History card | `Card` | **Exists** | Rounded-lg, white bg, border |
| Tab filter (All/Leave/Assets) | `Tabs` | **Exists** | Pill-style tabs |
| Request table | `Table` | **Exists** | Columns: Type, Date, Status, Action |
| Request row (expandable) | `Table` row | **Compose** | Icon + title + description, status badge |
| Status badges | `Badge` | **Exists** | APPROVED (green), PENDING (orange), REJECTED (red) |

### 2.6 Screen 5: Notifications

| Design Pattern | Ardor Component | Status | Notes |
|---------------|----------------|--------|-------|
| Page header + count badge | Heading + `Badge` | **Exists** | "Notifications" + red count circle |
| "Mark all as read" link | `Button` variant=link | **Exists** | Red text, right-aligned |
| Tab filter (All/Unread/Requests) | `Tabs` | **Exists** | With count on Unread tab |
| Date group header | Text | **CSS** | "Today", "Yesterday" — gray, small |
| Notification item | Custom compose | **New** | Green dot + icon/avatar + title + description + category badge + timestamp + action link |
| Category badge | `Badge` | **Exists** | Engineering, Marketing, Sales, Product |
| Action link ("View Request") | `Button` variant=link | **Exists** | Green text |

---

## 3. Component Status Summary

| Status | Count | Components |
|--------|-------|------------|
| **Exists** | 32 | Sidebar system (24), Button, Card, TextField, PasswordInput, Badge, Avatar, Tabs, Table/DataTable, Select, SearchInput, CheckboxInput, Breadcrumb, FormField, ScreenLayout, NoAuthLayout, FormLayout, EmptyState, ConfirmDialog, Loading |
| **Compose** | 6 | Employee Card, Profile Header, Stats Card, Section Accordion Card, View Toggle, Request Row |
| **New** | 1 | Notification Item |
| **CSS only** | 4 | Gradient bg, Card grid, Typography headings, Date group headers |

### Key Ardor Discoveries (from inventory scan)
- **PasswordInput** — Has built-in visibility toggle → matches Login password field exactly
- **NoAuthLayout** — Centered layout with optional header → perfect for Login screen
- **ScreenLayout** — Main screen container with breadcrumbs, title, description, actions → all 4 app screens
- **FormLayout** — Card-based form container → Employee Profile edit forms
- **DataTable** — Sorting, filtering, pagination built-in → Request History table
- **EmptyState** — Icon + title + description + action → for empty lists/tables
- **ConfirmDialog** — With variants (default, destructive, warning) → for delete actions
- **AdaptiveDialog** — Responsive dialog → for "Create Request" modal

---

## 4. Tailwind CSS 4 Token Mapping

```css
/* designs/design-tokens.css — Map to Ardor/Tailwind */

:root {
  /* Brand */
  --primary: #00a63e;
  --primary-hover: #1ab443;
  --primary-foreground: #ffffff;

  /* Backgrounds */
  --background: #ffffff;
  --muted: #f9fafb;
  --accent: #f3f4f6;

  /* Text */
  --foreground: #0a0a0a;
  --muted-foreground: #6a7282;
  --placeholder: #99a1af;

  /* Borders */
  --border: #e5e7eb;
  --input: #d1d5dc;

  /* Semantic */
  --destructive: #fb2c36;
  --destructive-foreground: #c10007;
  --info: #2b7fff;
  --link: #155dfc;
  --success: #008236;
  --success-bg: #dcfce7;
  --warning: #f54900;
  --warning-bg: #ffedd4;
  --error-bg: #ffe2e2;
  --info-bg: #eff6ff;

  /* Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-2xl: 16px;
  --radius: 8px; /* default */

  /* Typography */
  --font-sans: 'Inter', sans-serif;
}
```

---

## 5. Layout Architecture

All 4 app screens (Directory, Profile, Requests, Notifications) share:

```
┌──────────────────────────────────────────────────┐
│ Full Screen (1129 × 813)                         │
├──────────┬───────────────────────────────────────┤
│ Sidebar  │ Main Content                          │
│ 256px    │ fill (873px)                          │
│          │                                        │
│ Logo     │ ┌─ Header ─────────────────────────┐  │
│ Search   │ │ Title + Actions                   │  │
│ Nav      │ └──────────────────────────────────┘  │
│ ...      │ ┌─ Content ────────────────────────┐  │
│ Lang     │ │ Cards / Table / Form / List       │  │
│ Logout   │ │                                    │  │
│          │ └──────────────────────────────────┘  │
└──────────┴───────────────────────────────────────┘
```

- Sidebar: 256px fixed, white bg, right border (#e5e7eb)
- Main content: `fill_container`, gray bg (#f9fafb)
- Content padding: 24px all sides
- Login: centered card on gradient, no sidebar

---

## 6. Veni-AI Specific Notes

### Import Patterns
```tsx
// Ardor UI Kit (NPM package)
import { Button, Card, Badge, Avatar, Tabs, TabsList, TabsTrigger, TabsContent } from '@venizia/ardor-ui-kit';
import { TextField, PasswordInput, CheckboxInput, DatePicker } from '@venizia/ardor-ui-kit';
import { Dialog, AlertDialog, AdaptiveDialog } from '@venizia/ardor-ui-kit';

// Layout components
import { ScreenLayout, FormLayout, NoAuthLayout } from '@/layout';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/layout';
import { Breadcrumb, NavGroup } from '@/layout';

// Shared composed components
import { SearchInput, EmptyState, Loading, ConfirmDialog, Modal } from '@/components/shared';
import { DataTable, FormField, FormActions } from '@/components/shared';

// Styling utility
import { cn } from '@/ardor';
```

### New Components to Create
1. **EmployeeCard** — Compose from `Card` + `Avatar` + `Badge` + `Button`
2. **NotificationItem** — New component: status dot + icon + text + badge + timestamp
3. **StatsCard** — Compose from `Card` with icon, number, label
4. **ProfileHeader** — Compose from `Avatar` + `Badge` + text layout
5. **SectionAccordion** — Compose from `Card` + `Accordion` for profile sections
6. **RequestRow** — Compose from table row + icon + badge
