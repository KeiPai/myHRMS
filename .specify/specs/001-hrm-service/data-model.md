# Data Model: HRM Service

**Feature**: 001-hrm-service
**Date**: 2026-01-26

## Overview

This document defines the data entities created by the `veni create service hrm` command. These are **scaffolding entities** - the configuration and registration data, not HRM business entities (employees, departments, etc.) which would be added later.

## Entities

### Service

Represents the HRM service registration in the Shell application.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, required, unique | Service identifier (e.g., "hrm") |
| name | string | required | Display name (e.g., "Human Resource Management") |
| description | string | optional | Service description |
| category | string | required, default: "custom" | Service category (e.g., "enterprise") |
| apiUrl | string | required, URL format | API endpoint URL |
| uiUrl | string | optional, URL format | UI endpoint URL |
| status | enum | required | "available", "unavailable", "maintenance" |
| createdAt | timestamp | auto | Creation timestamp |
| updatedAt | timestamp | auto | Last update timestamp |

**Validation Rules**:
- `id` must be lowercase alphanumeric with hyphens, 3-50 characters
- `apiUrl` must be a valid URL starting with http:// or https://
- `uiUrl` must be a valid URL if provided

### ServiceConfiguration

Environment configuration for the service (stored in .env files, not database).

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| APP_ENV_PORT | number | api/.env | API server port |
| APP_ENV_DATABASE_URL | string | api/.env | PostgreSQL connection string |
| APP_ENV_JWT_SECRET | string | api/.env | JWT signing secret (auto-generated) |
| APP_ENV_JWT_ISSUER | string | api/.env | JWT issuer claim |
| APP_ENV_JWT_AUDIENCE | string | api/.env | JWT audience claim |
| APP_ENV_KEYCLOAK_URL | string | api/.env | Keycloak server URL |
| APP_ENV_KEYCLOAK_REALM | string | api/.env | Keycloak realm |
| APP_ENV_KEYCLOAK_CLIENT_ID | string | api/.env | Keycloak client ID |
| APP_ENV_REDIS_URL | string | api/.env | Redis connection string |
| APP_ENV_MINIO_ENDPOINT | string | api/.env | MinIO server endpoint |
| APP_ENV_MINIO_PORT | number | api/.env | MinIO server port |
| VITE_API_URL | string | ui/.env | API URL for frontend |
| VITE_PORT | number | ui/.env | UI dev server port |

**Default Values**:
```env
# API defaults
APP_ENV_PORT=3006
APP_ENV_JWT_ISSUER=veni-ai-platform
APP_ENV_JWT_AUDIENCE=veni-ai-services
APP_ENV_KEYCLOAK_URL=http://localhost:18080
APP_ENV_KEYCLOAK_REALM=veni-ai
APP_ENV_KEYCLOAK_CLIENT_ID=veni-ai-platform
APP_ENV_REDIS_URL=redis://localhost:16379
APP_ENV_MINIO_ENDPOINT=localhost
APP_ENV_MINIO_PORT=19000

# UI defaults
VITE_API_URL=http://localhost:3006
VITE_PORT=4176
```

### ServiceRegistration

Shell's service registry entry (runtime data managed by Shell API).

| Field | Type | Description |
|-------|------|-------------|
| serviceId | string | Reference to Service.id |
| shellToken | string | JWT token used for registration |
| registeredAt | timestamp | When service was registered |
| lastHealthCheck | timestamp | Last successful health check |
| healthStatus | enum | "healthy", "unhealthy", "unknown" |

## Relationships

```
┌─────────────────┐     ┌───────────────────────┐
│     Service     │────►│  ServiceConfiguration │
│   (Registry)    │     │      (.env files)     │
└────────┬────────┘     └───────────────────────┘
         │
         │ registers
         ▼
┌─────────────────────┐
│ ServiceRegistration │
│  (Shell Runtime)    │
└─────────────────────┘
```

## State Transitions

### Service Status

```
┌──────────────┐    create    ┌─────────────┐
│   (none)     │─────────────►│  available  │
└──────────────┘              └──────┬──────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                  │
                    ▼                                  ▼
             ┌─────────────┐                   ┌──────────────┐
             │ unavailable │◄─────────────────►│ maintenance  │
             └─────────────┘   manual toggle   └──────────────┘
```

### Registration Flow

```
1. Service Created (files generated)
   │
   ▼
2. Dependencies Installed (bun install)
   │
   ▼
3. Service Started (bun run dev)
   │
   ▼
4. Service Registered (veni register hrm)
   │
   ▼
5. Auth Configured (veni setup auth)
   │
   ▼
6. Federation Configured (veni setup federation)
   │
   ▼
7. Service Active in Shell
```

## File Artifacts

The CLI generates the following data-related files:

| File | Purpose |
|------|---------|
| `api/.env` | Runtime configuration |
| `api/.env.example` | Configuration template |
| `api/drizzle.config.ts` | Database schema config |
| `api/src/config/env.config.ts` | Typed env access |
| `api/src/datasources/db.datasource.ts` | DB connection |
| `ui/.env` | UI configuration |
| `ui/.env.example` | UI config template |
