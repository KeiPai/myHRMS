# Data Model: HRM UI Screens

**Feature**: 002-hrm-ui-screens
**Date**: 2026-03-17

## Overview

This document defines the business entities that the HRM UI screens display and manage. These are the user-facing data structures consumed by React components via API hooks. The backend schema (Drizzle ORM) is defined in the API layer.

## Entities

### Employee

The core entity displayed across Employee Directory, Employee Profile, and various references.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, required, unique | Employee identifier (UUID) |
| firstName | string | required | First name |
| lastName | string | required | Last name |
| email | string | required, email format | Work email address |
| phone | string | optional | Phone number |
| role | string | required | Job title/position (e.g., "Senior Developer") |
| department | string | required, FK → Department | Department name |
| location | string | optional | Office location (e.g., "HCMC Office") |
| status | enum | required | "active", "inactive", "on_leave" |
| employmentType | enum | required | "full_time", "part_time", "contract", "intern" |
| hireDate | date | required | Date of joining |
| avatarUrl | string | optional | Profile photo URL (fallback: initials on colored bg) |
| reportingManagerId | string | optional, FK → Employee | Direct manager |
| createdAt | timestamp | auto | Record creation |
| updatedAt | timestamp | auto | Last update |

### EmployeeProfile (extended)

Additional fields shown on the Employee Profile screen tabs.

| Field | Type | Tab | Description |
|-------|------|-----|-------------|
| personalId | string | Individual Profile | National ID / passport |
| dateOfBirth | date | Individual Profile | Date of birth |
| gender | enum | Individual Profile | "male", "female", "other" |
| nationality | string | Individual Profile | Country of citizenship |
| address | string | Individual Profile | Home address |
| emergencyContact | object | Individual Profile | Name, phone, relationship |
| bankAccount | string | Payroll & Benefits | Bank account number |
| salary | number | Payroll & Benefits | Monthly salary |
| benefits | string[] | Payroll & Benefits | Enrolled benefits list |
| workHistory | WorkHistoryEntry[] | Work History | Positions held |
| documents | Document[] | Documents & Contracts | Uploaded files |
| assets | Asset[] | Assets | Company-issued equipment |

### Department

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, required | Department identifier |
| name | string | required, unique | Department name (e.g., "Engineering") |
| employeeCount | number | computed | Number of active employees |

### Request

Employee-submitted requests (leave, assets, etc.)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, required | Request identifier |
| employeeId | string | required, FK → Employee | Requesting employee |
| type | enum | required | "leave", "asset", "document", "other" |
| title | string | required | Request title |
| description | string | optional | Detailed description |
| status | enum | required | "approved", "pending", "rejected" |
| submittedAt | timestamp | required | Submission date |
| reviewedAt | timestamp | optional | Review date |
| reviewedBy | string | optional, FK → Employee | Reviewing manager |

### Notification

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, required | Notification identifier |
| userId | string | required, FK → Employee | Recipient |
| title | string | required | Notification title |
| description | string | required | Notification body text |
| category | enum | required | "engineering", "marketing", "sales", "product", "hr", "system" |
| isRead | boolean | required, default: false | Read status |
| actionUrl | string | optional | Link for action (e.g., "View Request") |
| actionLabel | string | optional | Action link text |
| senderName | string | optional | Who triggered the notification |
| senderAvatar | string | optional | Sender avatar URL |
| createdAt | timestamp | required | When notification was created |

## Relationships

```
┌──────────────┐     ┌──────────────┐
│  Department   │◄────│   Employee   │
└──────────────┘     └──────┬───────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                   │
         ▼                  ▼                   ▼
┌─────────────────┐  ┌───────────┐    ┌────────────────┐
│ EmployeeProfile │  │  Request   │    │  Notification  │
│  (1:1 extended) │  │  (1:many)  │    │   (1:many)     │
└─────────────────┘  └───────────┘    └────────────────┘
```

## TypeScript Types

```typescript
// types/employee.ts
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  location?: string;
  status: 'active' | 'inactive' | 'on_leave';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  hireDate: string;
  avatarUrl?: string;
  reportingManagerId?: string;
}

// types/request.ts
interface Request {
  id: string;
  employeeId: string;
  type: 'leave' | 'asset' | 'document' | 'other';
  title: string;
  description?: string;
  status: 'approved' | 'pending' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// types/notification.ts
interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'engineering' | 'marketing' | 'sales' | 'product' | 'hr' | 'system';
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  senderName?: string;
  senderAvatar?: string;
  createdAt: string;
}
```

## State Transitions

### Request Status

```
┌─────────┐   submit   ┌──────────┐
│ (none)  │───────────►│ pending  │
└─────────┘            └─────┬────┘
                             │
                  ┌──────────┴──────────┐
                  │                      │
                  ▼                      ▼
           ┌──────────┐          ┌──────────┐
           │ approved │          │ rejected │
           └──────────┘          └──────────┘
```

### Notification Read Status

```
┌──────────┐   view / mark read   ┌──────────┐
│  unread  │─────────────────────►│   read   │
└──────────┘                      └──────────┘
         ▲        mark all read          │
         └───────────── (no reverse) ────┘
```
