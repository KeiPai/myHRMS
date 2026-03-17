# Plan: Production Login Page Implementation

## Context

The HRMS login page currently works with mock data (hardcoded email list, simulated delays, no real authentication). This plan upgrades it to production quality by:
1. Replacing custom HTML with Ardor UI Kit components (consistency with Veni-AI platform)
2. Building real backend auth endpoints using Ignis patterns (proxying to Shell API)
3. Wiring the frontend to real APIs
4. Connecting to the Shell/Keycloak auth flow

All work reuses existing Venizia infrastructure: Ignis framework, Ardor UI Kit, Shell auth patterns, and token exchange utilities already in the HRM service.

---

## Phase 1: UI Upgrade — Replace Custom HTML with Ardor Components

**Goal:** Replace raw HTML inputs/buttons with Ardor components for design consistency.

### Files to modify:
- `src/components/login/LoginForm.tsx` — Main form component

### Changes:
1. **Replace `<input type="email">` and `<input type="password">` with Ardor `TextField`**
   - Import from `@venizia/ardor-ui-kit`
   - Use `startIcon` prop for Mail/Lock icons
   - Use `endIcon` prop for password visibility toggle
   - Reuse existing: `TextField` component at `/Users/truongkien/dev/veni-ai/packages/ardor-ui-kit/src/components/ui/text-field.tsx`

2. **Replace `<button>` elements with Ardor `Button`**
   - Primary variant for "Sign In" and "Send Reset Link"
   - Ghost/link variant for "Forgot password?" and "Back to login"
   - Reuse existing: `Button` at `/Users/truongkien/dev/veni-ai/packages/ardor-ui-kit/src/components/ui/button.tsx`

3. **Replace `<input type="checkbox">` with Ardor `CheckboxInput`**
   - For "Remember me" checkbox
   - Reuse existing: `CheckboxInput` at `/Users/truongkien/dev/veni-ai/packages/ardor-ui-kit/src/components/ui/checkbox-input.tsx`

4. **Replace error `<div>` with Ardor `Alert`**
   - Destructive variant for error messages
   - Reuse existing: `Alert` at `/Users/truongkien/dev/veni-ai/packages/ardor-ui-kit/src/components/ui/alert.tsx`

5. **Replace hardcoded hex colors with CSS variables**
   - `#00a63e` → `hsl(var(--primary))`
   - `#101828` → `hsl(var(--foreground))`
   - `#6a7282` → `hsl(var(--muted-foreground))`
   - `#f3f4f6` → `hsl(var(--muted))`
   - `#d1d5dc` → `hsl(var(--border))`

---

## Phase 2: Backend Auth API — HRM Auth Endpoints

**Goal:** Add login and password-reset proxy endpoints to HRM API using Ignis patterns. These proxy requests to Shell's existing auth API.

### Files to modify/create:
- `services/hrm/api/src/controllers/auth.controller.ts` — Add endpoints (file exists, needs new routes)
- `services/hrm/api/src/services/auth.service.ts` — Add login/reset methods (file exists)

### Reference patterns:
- Shell auth controller: `/Users/truongkien/dev/veni-ai/shell/api/src/controllers/auth.controller.ts`
  - `POST /api/auth/local-login` — email + password login
  - `POST /api/auth/request-password-reset` — sends reset email
  - `POST /api/auth/confirm-password-reset` — resets password with token
- Shell password service: `/Users/truongkien/dev/veni-ai/shell/api/src/services/password.service.ts`
  - Password validation: 8+ chars, uppercase, lowercase, number
- Shell validation utils: `/Users/truongkien/dev/veni-ai/shell/api/src/utils/validation.util.ts`
  - Email validation: RFC 5322 regex
- Ignis patterns: `/Users/truongkien/dev/ignis/packages/core/src/decorators/`
  - `@controller`, `@post`, `@inject`, `BaseRestController`

### New endpoints:
1. **`POST /api/auth/login`** — Proxy to Shell's `/api/auth/local-login`
   - Input: `{ email: string, password: string }`
   - Output: `{ token: string, user: { id, email, name } }`
   - Validates email domain (@nexpando.com) before proxying

2. **`POST /api/auth/request-password-reset`** — Proxy to Shell's endpoint
   - Input: `{ email: string }`
   - Output: `{ success: boolean }`
   - Validates email domain before proxying

3. **`POST /api/auth/confirm-password-reset`** — Proxy to Shell's endpoint
   - Input: `{ token: string, newPassword: string }`
   - Output: `{ success: boolean }`
   - Validates password strength (Shell's rules)

### Auth service additions:
- `login(email, password)` — calls Shell gateway, returns service JWT
- `requestPasswordReset(email)` — calls Shell gateway
- `confirmPasswordReset(token, newPassword)` — calls Shell gateway
- Reuse existing `ShellAuthGatewayClient` at `services/hrm/api/src/services/shell-auth-gateway.client.ts`

---

## Phase 3: Frontend Integration — Wire UI to Real API

**Goal:** Replace mock data with real API calls.

### Files to modify/create:
- `src/utils/auth-api.ts` — New API client for auth endpoints
- `src/pages/LoginPage.tsx` — Call real login API
- `src/hooks/useAuth.ts` — Enhance with real token management

### Changes:
1. **Create `auth-api.ts`** — Typed API client
   ```
   loginApi(email, password) → { token, user }
   requestPasswordResetApi(email) → { success }
   confirmPasswordResetApi(token, newPassword) → { success }
   ```
   - Use fetch with base URL from env config
   - Reuse existing API interceptor pattern from `src/utils/api-interceptor.ts`

2. **Update `LoginPage.tsx`**
   - Replace simulated delay with `loginApi()` call
   - Store JWT token via `setServiceJWT()` from `src/federation/token-exchange.ts`
   - Handle API error responses (invalid credentials, network errors)

3. **Update `LoginForm.tsx`**
   - Remove `VALID_EMAILS` mock database
   - Remove `isRegisteredEmail()` client-side check (server validates)
   - Keep `isNexpandoEmail()` for instant client-side domain validation
   - Wire forgot password form to `requestPasswordResetApi()`

4. **Enhance `useAuth.ts`**
   - Check `getServiceJWT()` + `isTokenValid()` for `isAuthenticated`
   - Add `logout()` that calls `clearServiceJWT()`
   - Reuse existing token utilities from `src/federation/token-exchange.ts`

---

## Phase 4: Shell/Keycloak Auth Flow

**Goal:** Support both standalone login and Shell-federated Keycloak auth.

### Files to modify:
- `src/federation/shell-entry.tsx` — Already has token exchange logic
- `src/pages/LoginPage.tsx` — Detect Shell context

### Changes:
1. **Dual auth detection** — If running inside Shell (Keycloak token available), skip login page and use token exchange. If standalone, show login form.
   - Check: `localStorage.getItem('keycloak_token')` or BroadcastChannel updates
   - Already partially implemented in `shell-entry.tsx` lines 77-166

2. **Token refresh** — Add periodic token validity check
   - Use existing `isTokenValid()` from `token-exchange.ts`
   - On expiry, attempt re-exchange or redirect to login

3. **Password reset page** — Add `ResetPasswordPage` for the token-based flow
   - Route: `/reset-password?token=xxx`
   - Calls `confirmPasswordResetApi(token, newPassword)`
   - Add to shell-entry.tsx routes

---

## Phase 5: Verification

### Manual testing checklist:
- [ ] Login with valid @nexpando.com email → redirects to /profile/me
- [ ] Login with non-@nexpando.com email → shows domain error
- [ ] Login with wrong password → shows credentials error
- [ ] Forgot password flow → shows success state
- [ ] EN/VI language toggle works on all screens
- [ ] Ardor components render correctly (no raw HTML inputs)
- [ ] Token stored after login, cleared after logout
- [ ] Page refresh preserves auth state

### Automated:
- Run existing tests: `bun test`
- TypeScript check: `bunx tsc --noEmit`
- Visual verification with Playwright screenshots at each phase
