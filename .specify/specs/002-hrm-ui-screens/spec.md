# Feature Specification: HRM UI Screens Implementation

**Feature Branch**: `002-hrm-ui-screens`
**Created**: 2026-03-17
**Status**: Draft
**Input**: Design analysis from `designs/design-analysis.md` and Figma export `designs/HRMSv1.pen` (5 screens)
**Design Reference**: `designs/HRMSv1.pen` — open in Pencil for visual verification via MCP tools

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Employee Login (Priority: P1)

An employee or HR manager navigates to the HRM application and is presented with a login screen. They enter their email and password to authenticate. After successful login, they are redirected to the Employee Directory.

**Why this priority**: Login is the entry point for all users. Without authentication, no other screens are accessible. This is the foundation of the entire application.

**Independent Test**: Can be fully tested by navigating to the login URL, entering valid credentials, and verifying redirection to the Employee Directory. Also test invalid credentials show error feedback.

**Acceptance Scenarios**:

1. **Given** the user is not authenticated, **When** they navigate to any HRM route, **Then** they are redirected to the Login screen.

2. **Given** the Login screen is displayed, **When** the user enters valid email and password and clicks "Sign in", **Then** they are authenticated via Keycloak and redirected to the Employee Directory.

3. **Given** the Login screen is displayed, **When** the user enters invalid credentials and clicks "Sign in", **Then** an error message is displayed and they remain on the Login screen.

4. **Given** the Login screen is displayed, **When** the user checks "Remember me" and logs in, **Then** their session persists across browser restarts.

5. **Given** the Login screen is displayed, **When** the user clicks "Forgot password?", **Then** they are directed to the Keycloak password reset flow.

---

### User Story 2 - View Employee Directory (Priority: P1)

An HR manager views a grid of employee cards showing all employees in the organization. They can search by name, filter by department, and toggle between grid/list/kanban views. Each card shows the employee's avatar (initials), name, role, department, location, and contact actions.

**Why this priority**: The Employee Directory is the primary navigation hub — the default screen after login and the most frequently used view. It enables quick employee lookup.

**Independent Test**: Can be tested by logging in, verifying the directory loads with employee cards, using the search bar to filter, changing departments via dropdown, and clicking "Profile" to navigate to a detail view.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they navigate to the Employee Directory, **Then** a grid of employee cards is displayed showing avatar, name, role, department, location, and email/phone.

2. **Given** the Employee Directory is displayed, **When** the user types in the search bar, **Then** the employee list filters in real-time by name, role, or department.

3. **Given** the Employee Directory is displayed, **When** the user selects a department from the "All Departments" dropdown, **Then** only employees in that department are shown.

4. **Given** an employee card is displayed, **When** the user clicks the "Profile" button, **Then** they are navigated to the Employee Profile screen for that employee.

5. **Given** the Employee Directory is displayed, **When** the user clicks the view toggle icons, **Then** the display switches between grid, list, and kanban views.

---

### User Story 3 - View Employee Profile (Priority: P1)

An HR manager views a detailed employee profile with personal information, work history, payroll, attendance, documents, and assets organized in tabs. They can update the employee's profile information.

**Why this priority**: The Employee Profile is the core data view — all employee management actions originate here. It provides complete employee information across 6 tabbed sections.

**Independent Test**: Can be tested by clicking "Profile" on any employee card, verifying the profile header loads with correct info, switching between tabs, and verifying section accordion cards expand/collapse.

**Acceptance Scenarios**:

1. **Given** the user navigates to an Employee Profile, **Then** the profile header displays avatar, full name, role, active/full-time status badge, tenure, reporting manager, and department.

2. **Given** the Employee Profile is displayed, **When** the user clicks "Individual Profile" tab, **Then** section cards show Personal Identification, Contact Information, and Emergency Contacts with expand/collapse.

3. **Given** the Employee Profile is displayed, **When** the user clicks "Work History" tab, **Then** employment history, promotions, and department transfers are shown.

4. **Given** the Employee Profile is displayed, **When** the user clicks "Payroll & Benefits" tab, **Then** salary information, deductions, and benefits enrollment are shown.

5. **Given** the Employee Profile is displayed, **When** the user clicks "Update Profile", **Then** editable form fields are shown with save/cancel actions.

6. **Given** the Employee Profile is displayed, **When** the user clicks the back arrow, **Then** they return to the Employee Directory.

---

### User Story 4 - Manage My Requests (Priority: P2)

An employee views their submitted requests (leave, assets, etc.) with status tracking. They can create new requests and see summary statistics (total requests, approved, pending).

**Why this priority**: Request management is a key self-service feature enabling employees to submit and track leave/asset requests without HR intervention. Reduces HR workload.

**Independent Test**: Can be tested by navigating to "My Requests", verifying stats cards show correct counts, viewing request history in the table, filtering by type, and creating a new request.

**Acceptance Scenarios**:

1. **Given** the user navigates to "My Requests", **Then** three stats cards are displayed: Total Requests (count), Approved (count), and Pending (count).

2. **Given** the My Requests screen is displayed, **Then** a request history table shows columns: Type, Date, Status, Action.

3. **Given** the request history table is displayed, **When** the user clicks tab filters (All/Leave/Assets/Other), **Then** the table filters to show only matching request types.

4. **Given** the My Requests screen is displayed, **When** the user clicks "Create Request", **Then** a dialog/form for submitting a new request is shown.

5. **Given** a request row is displayed, **Then** the status badge shows APPROVED (green), PENDING (orange), or REJECTED (red) with correct colors.

---

### User Story 5 - View Notifications (Priority: P2)

An employee views their notifications including system alerts, request updates, and team announcements. Notifications are grouped by date (Today, Yesterday) with unread indicators.

**Why this priority**: Notifications keep employees informed about request approvals/rejections, system announcements, and team updates. Essential for workflow continuity.

**Independent Test**: Can be tested by navigating to "Notifications", verifying the notification list loads with date grouping, checking unread indicators, using tab filters, and clicking "Mark all as read".

**Acceptance Scenarios**:

1. **Given** the user navigates to "Notifications", **Then** the page header shows "Notifications" with a red count badge showing unread count.

2. **Given** the Notifications screen is displayed, **Then** notifications are grouped by date: "Today", "Yesterday", with timestamps.

3. **Given** the Notifications screen is displayed, **When** the user clicks "Mark all as read", **Then** all notification unread indicators are cleared.

4. **Given** a notification item is displayed, **Then** it shows a green unread dot, icon/avatar, title, description, category badge (Engineering/Marketing/Sales/Product), and timestamp.

5. **Given** the Notifications screen is displayed, **When** the user clicks tab filters (All/Unread/Requests), **Then** the list filters accordingly with count badges on the Unread tab.

---

### User Story 6 - Sidebar Navigation (Priority: P1)

The authenticated user sees a persistent sidebar with navigation links to all screens, a company logo, search functionality, language switcher, and logout.

**Why this priority**: The sidebar is the shared navigation shell — it appears on all 4 authenticated screens and enables movement between features.

**Independent Test**: Can be tested by verifying sidebar appears after login, all 6 nav links are present and clickable, active state highlights correctly, notification badge shows count, and language toggle works.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **Then** a 256px sidebar is displayed on the left with company logo ("NEXPANDO"), subtitle, and search button.

2. **Given** the sidebar is displayed, **Then** 6 navigation links are shown: Dashboard, Employee Directory, My Profile, My Requests, Notifications, Settings.

3. **Given** the user is on the Employee Directory page, **Then** the "Employee Directory" nav link has active styling (green background #1ab443).

4. **Given** the sidebar is displayed, **Then** the "Notifications" nav link shows a red badge with unread count.

5. **Given** the sidebar is displayed, **When** the user clicks "Logout", **Then** they are logged out and redirected to the Login screen.

6. **Given** the sidebar is displayed, **When** the user clicks EN/VI language toggle, **Then** the UI language switches accordingly.

---

### Edge Cases

- What happens when the employee directory is empty (no employees)?
- How does the profile display when optional fields (emergency contact, photo) are missing?
- What happens when a request creation fails (network error, validation)?
- How does the notification list handle 100+ items (pagination/infinite scroll)?
- What happens when the user's session expires while viewing a page?
- How does the search handle special characters or very long queries?
- What happens when the Keycloak server is unreachable during login?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a centered login card with email, password, remember me, and sign in button
- **FR-002**: System MUST authenticate users via Keycloak and redirect to Employee Directory on success
- **FR-003**: System MUST display login errors without exposing security-sensitive information
- **FR-004**: System MUST render employee cards in a 3-column grid with avatar, name, role, department, location, and contact
- **FR-005**: System MUST support real-time search filtering across employee name, role, and department
- **FR-006**: System MUST support department filtering via dropdown select
- **FR-007**: System MUST support grid, list, and kanban view toggles for the employee directory
- **FR-008**: System MUST display a tabbed employee profile with 6 sections: Individual Profile, Work History, Payroll & Benefits, Attendance, Documents & Contracts, Assets
- **FR-009**: System MUST display section content in expandable/collapsible accordion cards
- **FR-010**: System MUST allow HR managers to update employee profile fields
- **FR-011**: System MUST display request statistics (Total, Approved, Pending) in summary cards
- **FR-012**: System MUST display request history in a filterable table with Type, Date, Status, Action columns
- **FR-013**: System MUST support creating new requests via a dialog/form
- **FR-014**: System MUST display status badges with correct colors: APPROVED (green), PENDING (orange), REJECTED (red)
- **FR-015**: System MUST display notifications grouped by date with unread indicators
- **FR-016**: System MUST support "Mark all as read" functionality
- **FR-017**: System MUST display notification items with category badges (Engineering, Marketing, Sales, Product)
- **FR-018**: System MUST render a persistent 256px sidebar on all authenticated screens
- **FR-019**: System MUST highlight the active navigation link with green background
- **FR-020**: System MUST show notification count badge on the sidebar nav link
- **FR-021**: System MUST support EN/VI language switching
- **FR-022**: System MUST use Ardor UI Kit components exclusively before creating new components
- **FR-023**: System MUST use Tailwind CSS 4 with design token CSS variables for all styling

### Key Entities

- **Employee**: Full name, email, phone, role/position, department, location, status (active/inactive), hire date, avatar/initials, reporting manager
- **Department**: Name, employee count (e.g., Engineering, Marketing, Sales, Product, HR)
- **Request**: Type (leave/asset/other), submission date, status (approved/pending/rejected), description, reviewer
- **Notification**: Title, description, category, timestamp, read/unread status, action link, sender
- **User Session**: Authenticated user, JWT token, role (employee/HR manager), language preference

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the login flow in under 10 seconds
- **SC-002**: Employee Directory loads and displays cards within 2 seconds
- **SC-003**: Search filtering produces results within 300ms of typing
- **SC-004**: All 5 screens render correctly at 1440px, 1024px, and 768px widths
- **SC-005**: Visual diff between design (.pen file) and implementation has less than 5% pixel deviation
- **SC-006**: All interactive elements (buttons, links, tabs, toggles) respond within 100ms
- **SC-007**: 100% of Ardor UI Kit components used where design maps to existing components (32 identified)
- **SC-008**: Zero hardcoded hex color values — all colors via CSS custom properties

## Assumptions

- Keycloak is configured and running for authentication
- API endpoints for employee CRUD, request management, and notifications exist or will be built in parallel
- The design in HRMSv1.pen is the approved final design
- Inter font is available via Google Fonts or bundled
- Lucide icons are the icon set used throughout
- The application targets modern browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)
- The sidebar brand shows "NEXPANDO" as the client company name
