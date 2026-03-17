# Feature Specification: Human Resource Management Service

> **Note**: Adapted from veni-ai monorepo for standalone HRMS project.

**Feature Branch**: `001-hrm-service`
**Created**: 2026-01-26
**Status**: Adapted
**Input**: User description: "Use veni platform cli to create new human resource management service"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create HRM Service with CLI (Priority: P1)

A platform administrator uses the Veni CLI to create a new Human Resource Management (HRM) service. The administrator runs the CLI command with appropriate options to scaffold a complete service structure including API and UI components, then registers it with the Shell application.

**Why this priority**: This is the foundational step - without creating the service, no HRM functionality can exist. The CLI automates the setup process, reducing integration time significantly.

**Independent Test**: Can be fully tested by running the `veni create service hrm` command and verifying that the service structure is created with all required files, and the service starts successfully.

**Acceptance Scenarios**:

1. **Given** the Veni CLI is installed and the platform is running, **When** the administrator runs `veni create service hrm --description "Human Resource Management Service" --category "enterprise"`, **Then** a complete service directory structure is created under `services/hrm/` with both API and UI components.

2. **Given** the HRM service has been created, **When** the administrator navigates to the service directory and runs the API and UI servers, **Then** both servers start without errors and are accessible at their configured ports.

3. **Given** the HRM service is running, **When** the administrator runs `veni register hrm`, **Then** the service is registered with Shell and appears in the Shell UI navigation.

---

### User Story 2 - Configure HRM Service Authentication (Priority: P2)

After service creation, the administrator configures authentication to ensure secure access to HRM data and operations. The service integrates with the platform's Keycloak authentication system.

**Why this priority**: Authentication is critical for an HRM service as it handles sensitive employee data. This must be completed before any HRM functionality is developed.

**Independent Test**: Can be tested by running `veni setup auth --service-id hrm` and verifying that protected endpoints require valid JWT tokens.

**Acceptance Scenarios**:

1. **Given** the HRM service exists without authentication, **When** the administrator runs `veni setup auth --service-id hrm`, **Then** authentication controllers and JWT services are generated and configured.

2. **Given** authentication is configured for the HRM service, **When** an unauthenticated request is made to a protected endpoint, **Then** the system returns an authentication error response.

3. **Given** authentication is configured, **When** a request with a valid JWT token is made to a protected endpoint, **Then** the request is processed and the user context is available.

---

### User Story 3 - Setup Module Federation for Shell Integration (Priority: P3)

The HRM service UI is configured for Module Federation, allowing it to be loaded dynamically within the Shell application as a micro-frontend.

**Why this priority**: Module Federation enables seamless integration with the Shell application, providing a unified user experience across all platform services.

**Independent Test**: Can be tested by running `veni setup federation --service-id hrm` and verifying the HRM UI loads correctly within the Shell application.

**Acceptance Scenarios**:

1. **Given** the HRM service has a UI component, **When** the administrator runs `veni setup federation --service-id hrm`, **Then** the vite.config.ts is updated with Module Federation configuration.

2. **Given** Module Federation is configured, **When** a user navigates to the HRM section in Shell UI, **Then** the HRM micro-frontend loads dynamically within the Shell container.

3. **Given** the HRM micro-frontend is loaded, **When** the user interacts with HRM features, **Then** the interactions work correctly including routing and API calls.

---

### Edge Cases

- What happens when the `hrm` service name already exists in the services directory?
- How does the system handle port conflicts if the default ports are already in use?
- What happens if the Shell API is not running when attempting to register the service?
- How does the system handle network failures during Keycloak configuration?
- What happens if the administrator runs the create command without sufficient disk space?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creation of a new HRM service using the command `veni create service hrm`
- **FR-002**: System MUST generate a complete service directory structure including `api/` and `ui/` subdirectories with all required files
- **FR-003**: System MUST auto-detect and assign available ports if `--api-port` and `--ui-port` options are not specified
- **FR-004**: System MUST create environment configuration files (`.env.example`) with all required variables for the HRM service
- **FR-005**: System MUST support the `--description` option to set the HRM service description
- **FR-006**: System MUST support the `--category` option to categorize the HRM service (e.g., "enterprise", "custom")
- **FR-007**: System MUST support the `--register` flag to automatically register the service with Shell after creation
- **FR-008**: System MUST generate authentication controllers and JWT services when `veni setup auth --service-id hrm` is run
- **FR-009**: System MUST configure Module Federation when `veni setup federation --service-id hrm` is run
- **FR-010**: System MUST register the HRM service with Shell API when `veni register hrm` is executed
- **FR-011**: System MUST display clear error messages with exit codes when operations fail
- **FR-012**: System MUST support verbose mode (`--verbose`) for detailed output during service creation

### Key Entities

- **Service**: Represents the HRM service with attributes: id, name, description, category, apiUrl, uiUrl, status
- **Service Configuration**: Environment variables and settings for API and UI components (ports, JWT secrets, Keycloak settings)
- **Service Registration**: Entry in Shell's service registry containing service metadata and endpoints

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrators can create a complete HRM service structure in under 2 minutes using the CLI
- **SC-002**: The created service structure passes validation with all required files present (API controllers, services, UI components, configuration files)
- **SC-003**: Service registration with Shell completes successfully on first attempt when Shell API is running
- **SC-004**: 100% of generated configuration files contain valid, working default values
- **SC-005**: The HRM service API starts without errors after creation and dependency installation
- **SC-006**: The HRM service UI starts and is accessible in a browser after creation and dependency installation
- **SC-007**: Authentication setup generates all required files and the service correctly validates JWT tokens
- **SC-008**: Module Federation configuration allows the HRM UI to load within Shell without errors

## Assumptions

- The Veni platform CLI (@venizia/cli) is already installed globally or locally
- The Shell application (API and UI) is running and accessible for service registration
- Keycloak is configured and running for authentication setup
- Bun runtime is installed for running the generated service
- The administrator has appropriate permissions to create directories and files
- Network connectivity is available for any required external dependencies
- The platform uses the standard port ranges: 3000+ for APIs, 4000+ for UIs
