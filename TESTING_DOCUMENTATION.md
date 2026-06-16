# DentalApp (ClinicApp) — Test Strategy, API Testing & Defect Management

**Project:** DentalApp — Full-stack dental clinic management system  
**Document version:** 1.0  
**Date:** 22 May 2026  
**Prepared by:** QA / Software Testing Team  

This document fulfills the coursework requirements for **Test Strategy and Test Plan (Section 3)**, **API Testing with Postman (Section 6)**, and **Bug Tracking and Defect Management (Section 9)**.

---

## 3. Test Strategy and Test Plan

### 3.1 Purpose

The purpose of this test strategy is to define a structured approach for verifying that DentalApp meets functional, security, and usability requirements. The application is a React + Node.js/Express REST API system with MySQL, JWT authentication, role-based access control (admin, doctor, staff).

### 3.2 Scope of Testing

#### 3.2.1 In Scope

| Area | Description |
|------|-------------|
| **Authentication** | Register, login, logout, refresh token, session persistence |
| **Patient management** | CRUD (admin), list/view (all roles), medical history tabs |
| **Appointments** | Create, update, delete, list (admin/staff) |
| **Doctors** | CRUD (admin), list (API: admin/staff/doctor) |
| **Patient history** | CRUD with doctor-scoped access |
| **Dashboard** | Overview stats and analytics charts |
| **Audit logs** | Admin-only listing and filters |
| **API layer** | All `/api/*` endpoints, validation, authorization, error responses |
| **Security** | JWT, RBAC, input validation (Joi), CORS/cookies |
| **UI/UX** | Forms, navigation, responsive layout, toast notifications |

#### 3.2.2 Out of Scope

- Performance/load testing at scale (1000+ concurrent users)
- Penetration testing by external security firms
- Mobile native applications
- Email/SMS notification delivery
- Automated CI/CD pipeline integration (future work)
- Third-party MySQL or hosting provider SLA testing

### 3.3 Test Levels

| Level | Objective | Tools / Method | Coverage in DentalApp |
|-------|-----------|------------------|------------------------|
| **Unit** | Verify isolated functions (validators, token utils, controllers with mocks) | Manual code review; optional Jest/Mocha | Joi schemas, `tokens.js`, `hashToken`, controller validation branches |
| **Integration** | Verify API + database + middleware chain | Postman, manual API calls | Auth → protected routes → Sequelize models; FK constraints; audit logging |
| **System** | Verify end-to-end workflows through UI + API | Manual exploratory testing, browser (Chrome/Edge) | Login → create patient → schedule appointment → view dashboard |
| **Acceptance** | Confirm business requirements per role | User acceptance scenarios (UAT) | Admin manages clinic; staff schedules appointments; doctor manages own patient history |

#### 3.3.1 Unit Testing (planned / partial)

- Validate `patientSchema`, `appointmentSchema`, `loginSchema` reject invalid payloads.
- Verify `signAccessToken` / `signRefreshToken` include expected claims and expiry.
- Controller unit tests for 404 when patient/doctor not found on appointment create.

#### 3.3.2 Integration Testing

- POST `/api/auth/login` returns `accessToken` and sets `refreshToken` cookie.
- GET `/api/patients` with valid Bearer token returns array; without token returns 401.
- POST `/api/appointments` with invalid `patientId` returns 404.
- Role matrix: staff cannot DELETE `/api/patients/:id` (403).

#### 3.3.3 System Testing

- Full registration and login flow on `http://localhost:5173`.
- Cross-page navigation via sidebar; protected routes redirect to login when unauthenticated.
- Data consistency: deleted patient cascades or blocks related appointments per DB rules.

#### 3.3.4 Acceptance Testing

| ID | Scenario | Role | Pass Criteria |
|----|----------|------|---------------|
| UAT-01 | Admin adds a new patient | Admin | Patient appears in list; audit log CREATE recorded |
| UAT-02 | Staff schedules appointment | Staff | Appointment visible with correct patient/doctor/date |
| UAT-03 | Doctor adds medical history | Doctor | Record saved; doctor cannot edit another doctor's record |
| UAT-04 | Staff cannot open audit logs | Staff | UI or API returns forbidden / access denied |
| UAT-05 | User registers and logs in | Public | Account created; login succeeds with new credentials |

### 3.4 Test Types

| Test Type | Description | Examples in DentalApp |
|-----------|-------------|------------------------|
| **Functional** | Features work per specification | Patient CRUD, appointment status enum |
| **Regression** | Re-test after fixes | Re-run login and appointment suite after auth bug fix |
| **Security** | AuthZ, AuthN, data exposure | Register default role; JWT expiry; admin-only audit logs |
| **Usability** | Ease of use, clarity | Form labels, error messages, sidebar navigation |
| **Compatibility** | Browsers and resolutions | Chrome, Firefox, Edge; desktop and tablet widths |
| **API** | Contract and status codes | Postman collection (Section 6) |
| **Negative** | Invalid input and edge cases | Empty login fields, duplicate email register, missing Bearer token |
| **Boundary** | Limits of fields | Password min 6 chars; required phone on patient |

### 3.5 Risk Analysis

| Risk ID | Risk Description | Probability | Impact | Mitigation | Owner |
|---------|------------------|-------------|--------|------------|-------|
| R-01 | New users receive **admin** role on registration | High | Critical | Change default role to `staff`; disable public register in production | Dev |
| R-02 | JWT access token theft via XSS | Medium | High | HttpOnly refresh cookie; short access TTL; sanitize inputs | Dev |
| R-03 | Unauthorized API access (missing/invalid token) | Medium | High | Test all endpoints with/without token; enforce `authenticate` middleware | QA |
| R-04 | Doctor cannot access appointments (403) while UI implies access | High | Medium | Align API `authorize` with requirements; read-only GET for doctors | Dev |
| R-05 | Data loss on patient delete (cascade) | Medium | High | Confirm dialog; backup DB before testing deletes | QA / DBA |
| R-06 | MySQL unavailable — app unusable | Low | High | Health check `/api/health`; document startup order | Ops |
| R-07 | Stale session in localStorage after token revoke | Medium | Medium | Clear storage on logout; validate refresh on app load | Dev |
| R-08 | No pagination on large lists — UI slowdown | Medium | Low | Pagination on audit logs; extend to patients list | Dev |
| R-09 | Inconsistent validation (frontend vs Joi) | Medium | Medium | Single source of truth; API tests for invalid bodies | QA |
| R-10 | Extended modules untested — regression in clinic core | Medium | Medium | Smoke test clinic flows after any release | QA |

### 3.6 Entry Criteria

Testing activities may begin when **all** of the following are satisfied:

1. Development environment builds without errors (`npm install` in `backend` and `frontend`).
2. MySQL database `clinic_db` is created and migrations executed (`npm run migrate` in `backend`).
3. Seed data loaded (`npm run seed`) with known test accounts.
4. Backend running on `http://localhost:5000` and frontend on `http://localhost:5173`.
5. Test plan and Postman collection reviewed and baselined.
6. Test environment variables configured (`.env` files per README).

### 3.7 Exit Criteria

Testing phase is considered complete when:

1. All **critical** and **high** severity defects are fixed or accepted with documented waiver.
2. Minimum **5 API test cases** executed in Postman with pass results (Section 6).
3. Minimum **12 defects** logged with reproduction steps and screenshots (Section 9).
4. UAT scenarios UAT-01 through UAT-05 passed for release candidate build.
5. No open **Blocker** or **Critical** bugs remain for core clinic flows (auth, patients, appointments).
6. Test summary report delivered to project supervisor.

### 3.8 Test Environment

| Component | Specification |
|-----------|---------------|
| **OS** | Windows 10/11 (test workstation) |
| **Browser** | Google Chrome 120+ (primary), Microsoft Edge (secondary) |
| **Frontend** | Vite dev server — `http://localhost:5173` |
| **Backend** | Node.js 18+, Express — `http://localhost:5000` |
| **Database** | MySQL 8.0, database name `clinic_db` |
| **API base URL** | `http://localhost:5000/api` |
| **API testing tool** | Postman 10+ |
| **Network** | Localhost (no external deployment required for coursework) |

**Test accounts (after seed):**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@clinic.com | Admin@123 |
| Doctor | doctor@clinic.com | Doctor@123 |
| Staff | staff@clinic.com | Staff@123 |

### 3.9 Test Schedule

| Phase | Activity | Duration | Start | End | Deliverable |
|-------|----------|----------|-------|-----|-------------|
| 1 | Test planning & environment setup | 2 days | Week 1 Mon | Week 1 Tue | Test plan (this document) |
| 2 | Unit & integration (API) testing | 3 days | Week 1 Wed | Week 1 Fri | Postman results export |
| 3 | System & exploratory UI testing | 4 days | Week 2 Mon | Week 2 Thu | Defect log (12+ bugs) |
| 4 | Regression & UAT | 2 days | Week 2 Fri | Week 3 Mon | UAT sign-off checklist |
| 5 | Test closure & documentation | 1 day | Week 3 Tue | Week 3 Tue | Final test report |

**Total estimated duration:** 12 working days.

### 3.10 Roles and Responsibilities

| Role | Responsibility |
|------|----------------|
| QA Lead | Own test plan, defect triage, exit criteria |
| Tester | Execute manual and API tests, log bugs, attach screenshots |
| Developer | Fix defects, support environment setup |
| Project Supervisor | Approve UAT and final submission |

### 3.11 Test Deliverables

- Test Strategy and Test Plan (Section 3 — this document)
- Postman collection: `postman/DentalApp-API-Tests.postman_collection.json`
- API test execution evidence (Postman Runner screenshot or export)
- Defect log with screenshots: `docs/screenshots/`
- Test summary report (optional appendix)

---

## 6. API Testing (Postman)

### 6.1 Postman Setup

1. Import collection: `postman/DentalApp-API-Tests.postman_collection.json`
2. Create environment **DentalApp Local** with variables:

| Variable | Initial Value |
|----------|---------------|
| `baseUrl` | `http://localhost:5000/api` |
| `adminEmail` | `admin@clinic.com` |
| `adminPassword` | `Admin@123` |
| `accessToken` | *(empty — set by Login test)* |

3. Run collection with backend server active (`cd backend && npm run dev`).
4. For cookie-based refresh tests, enable **Automatically follow redirects** and ensure Postman sends cookies (desktop app).

### 6.2 API Test Cases (Minimum 5)

| TC ID | Test Case Name | Method | Endpoint | Preconditions | Test Steps | Expected Result | Actual Result (sample run) |
|-------|----------------|--------|----------|---------------|------------|-----------------|------------------------------|
| API-01 | Health check | GET | `/health` | Server running | Send GET without auth | `200`, body `{ "status": "ok" }` | Pass |
| API-02 | Login with valid admin credentials | POST | `/auth/login` | User exists in DB | Body: `{ "email": "admin@clinic.com", "password": "Admin@123" }` | `200`, `accessToken` present, `user.role` = `admin` | Pass |
| API-03 | Login with invalid password | POST | `/auth/login` | User exists | Body: wrong password | `401`, message contains `Invalid credentials` | Pass |
| API-04 | Get patients without token | GET | `/patients` | No Authorization header | Send GET | `401`, unauthorized message | Pass |
| API-05 | Get patients with valid token | GET | `/patients` | Run API-02 first; set Bearer token | GET with `Authorization: Bearer {{accessToken}}` | `200`, JSON array of patients | Pass |
| API-06 | Create patient (admin) | POST | `/patients` | Admin token | Body: valid `fullName`, `phone` | `201`, patient object with `id` | Pass |
| API-07 | Create appointment — patient not found | POST | `/appointments` | Staff/admin token | `patientId: 99999`, valid doctor/date | `404`, `Patient not found` | Pass |
| API-08 | Staff forbidden on audit logs | GET | `/audit-logs` | Staff user token | GET `/audit-logs` | `403` Forbidden | Pass |

*Note: API-01 uses full URL `{{baseUrl}}/../health` or direct `http://localhost:5000/api/health` — health route is mounted at `/api/health`.*

### 6.3 Postman Test Scripts (Assertions)

Each request in the collection includes automated checks in the **Tests** tab, for example:

**API-02 Login — Tests script:**
```javascript
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Access token returned", () => {
  const json = pm.response.json();
  pm.expect(json.accessToken).to.be.a("string");
  pm.environment.set("accessToken", json.accessToken);
});
pm.test("User role is admin", () => {
  pm.expect(pm.response.json().user.role).to.eql("admin");
});
```

**API-04 Unauthorized — Tests script:**
```javascript
pm.test("Status is 401", () => pm.response.to.have.status(401));
```

### 6.4 Sample Request Bodies

**Login (API-02):**
```json
{
  "email": "admin@clinic.com",
  "password": "Admin@123"
}
```

**Create Patient (API-06):**
```json
{
  "fullName": "Test Patient API",
  "phone": "555-9999",
  "email": "test.api@email.com",
  "address": "Test Street 1",
  "dateOfBirth": "1995-01-15",
  "notes": "Created via Postman"
}
```

**Create Appointment — negative (API-07):**
```json
{
  "patientId": 99999,
  "doctorId": 1,
  "appointmentDate": "2026-06-01T10:00:00.000Z",
  "reason": "Checkup",
  "status": "scheduled"
}
```

### 6.5 API Test Execution Evidence

Attach to submission:

- Postman Collection Runner screenshot showing **8/8** tests passed
- Or export: **Collection Runner → Export Results → JSON/HTML**

Screenshot path (example): `docs/screenshots/API-Postman-Runner-Results.png`

---

## 9. Bug Tracking and Defect Management

### 9.1 Defect Lifecycle

| Status | Description |
|--------|-------------|
| New | Reported by tester, not yet reviewed |
| Assigned | Assigned to developer |
| Fixed | Fix deployed to test environment |
| Retest | QA verifying fix |
| Closed | Verified fixed |
| Deferred | Accepted for future release |

### 9.2 Severity and Priority Definitions

| Severity | Definition |
|----------|------------|
| **Blocker** | System unusable; no workaround |
| **Critical** | Major feature broken; security vulnerability |
| **Major** | Important feature impaired; workaround exists |
| **Minor** | Cosmetic or low-impact issue |
| **Trivial** | Typo, alignment, non-functional text |

| Priority | Definition |
|----------|------------|
| **P1** | Fix immediately |
| **P2** | Fix before release |
| **P3** | Fix in next iteration |
| **P4** | Fix when possible |

### 9.3 Defect Log (12 Bugs Minimum)

| Bug ID | Description | Steps to Reproduce | Expected Result | Actual Result | Severity | Priority | Screenshot |
|--------|-------------|-------------------|-----------------|---------------|----------|----------|------------|
| **BUG-001** | New registered users are assigned **admin** role by default | 1. Open `/register`<br>2. Register new user `testuser@test.com`<br>3. Login with new account<br>4. Check sidebar (Audit Logs, Doctors) and API role | New users should have **staff** (or pending approval), not full admin | User has `role: admin` and can access admin-only features | Critical | P1 | `docs/screenshots/BUG-001.png` |
| **BUG-002** | Doctor role cannot access Appointments page | 1. Login as `doctor@clinic.com` / `Doctor@123`<br>2. Click **Appointments** in sidebar | Doctor can **view** appointments (read-only per requirements) | Message: "Only admin or staff can manage appointments"; API returns 403 on GET `/appointments` | Major | P2 | `docs/screenshots/BUG-002.png` |
| **BUG-003** | Staff cannot view Doctors list in UI though API allows it | 1. Login as `staff@clinic.com`<br>2. Navigate to `/doctors` | Staff should view doctor list (API allows GET for staff) | Page shows "Only admin can manage doctors" with no list | Major | P2 | `docs/screenshots/BUG-003.png` |
| **BUG-004** | Audit Logs page calls API before role check for non-admin | 1. Login as staff<br>2. Open `/audit-logs` (via URL if hidden) | No API call or friendly message without 403 error in network | `GET /audit-logs` returns **403**; possible error flash in console | Minor | P3 | `docs/screenshots/BUG-004.png` |
| **BUG-005** | Dashboard stays on loading spinner if API fails | 1. Stop backend server<br>2. Login as admin<br>3. Open Dashboard | Error message or empty state; spinner stops | Infinite **Loading...** spinner | Major | P2 | `docs/screenshots/BUG-005.png` |
| **BUG-006** | Login button not disabled during submit — double login possible | 1. Open `/login`<br>2. Enter valid credentials<br>3. Double-click **Login** quickly | Button disabled while `loading`; single request | Multiple requests may fire; duplicate navigation possible | Minor | P3 | `docs/screenshots/BUG-006.png` |
| **BUG-007** | Edit/Delete on patient row triggers row selection (event bubbling) | 1. Login as admin<br>2. Patients page — click **Edit** on second patient | Only edit form opens; selection may change intentionally on row click | Row click handler fires; selected patient changes unexpectedly | Minor | P3 | `docs/screenshots/BUG-007.png` |
| **BUG-008** | Typo **autherName** in Postimi module (UI and DB field) | 1. Open **Postimi & Komenti**<br>2. Observe author field label and payload | Field labeled **Author Name**; API uses `authorName` | Label/field uses **autherName** (misspelling) | Trivial | P4 | `docs/screenshots/BUG-008.png` |
| **BUG-009** | Patients page has no error handling on initial load failure | 1. Stop backend<br>2. Login (if cached) or refresh Patients | User-friendly error toast or message | Unhandled promise rejection; blank or broken page | Major | P2 | `docs/screenshots/BUG-009.png` |
| **BUG-010** | Non-admin can navigate to `/audit-logs` via URL without route guard | 1. Login as staff<br>2. Manually enter `http://localhost:5173/audit-logs` | Redirect or access denied at route level | Page loads; shows text "Only admin..." after failed fetch | Minor | P3 | `docs/screenshots/BUG-010.png` |
| **BUG-011** | App restores user from localStorage before token refresh completes | 1. Login as admin<br>2. Invalidate refresh token in DB<br>3. Reload page | Redirect to login if refresh fails | Brief authenticated UI then logout; confusing UX | Minor | P3 | `docs/screenshots/BUG-011.png` |
| **BUG-012** | Documentation lists wrong default password (`password123`) | 1. Open `documentation.md` section 7.4<br>2. Try login with documented password | Credentials match `seed.js` (`Admin@123`) | Doc says `password123`; login fails | Minor | P4 | `docs/screenshots/BUG-012.png` |

### 9.4 Detailed Bug Reports

---

#### BUG-001 — Registration assigns admin role by default

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-001 |
| **Description** | The `User` model sets `role` default to `"admin"`. Any user who self-registers receives full administrative privileges, including patient/doctor deletion and audit log access. |
| **Steps to Reproduce** | 1. Navigate to `http://localhost:5173/register`<br>2. Enter name, new email, password (≥6 chars)<br>3. Submit registration<br>4. Login with the new account<br>5. Observe sidebar links (Audit Logs, Doctors) and attempt admin actions |
| **Expected Result** | Self-registered users receive **staff** role or remain inactive until an admin approves |
| **Actual Result** | User `role` is `admin`; full admin UI and APIs are available |
| **Severity** | Critical |
| **Priority** | P1 |
| **Screenshot** | ![BUG-001](docs/screenshots/BUG-001.png) |

**Root cause (reference):** `backend/src/models/User.js` — `defaultValue: "admin"`.

---

#### BUG-002 — Doctor cannot view appointments

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-002 |
| **Description** | Appointment routes use `authorize("admin", "staff")` on the entire router. Doctors receive 403 on GET `/api/appointments`. Frontend `AppointmentsPage` blocks doctors entirely. |
| **Steps to Reproduce** | 1. Login as `doctor@clinic.com` / `Doctor@123`<br>2. Click **Appointments** in sidebar |
| **Expected Result** | Doctor sees list of appointments (read-only) |
| **Actual Result** | UI: "Only admin or staff can manage appointments."; Network: 403 Forbidden |
| **Severity** | Major |
| **Priority** | P2 |
| **Screenshot** | ![BUG-002](docs/screenshots/BUG-002.png) |

---

#### BUG-003 — Staff blocked from Doctors page in UI

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-003 |
| **Description** | `DoctorsPage.jsx` returns early for non-admin users, but backend `GET /api/doctors` allows `admin`, `staff`, and `doctor`. |
| **Steps to Reproduce** | 1. Login as `staff@clinic.com` / `Staff@123`<br>2. Open **Doctors** from sidebar |
| **Expected Result** | Staff can view doctor list to assign appointments |
| **Actual Result** | Only message displayed; no doctor table |
| **Severity** | Major |
| **Priority** | P2 |
| **Screenshot** | ![BUG-003](docs/screenshots/BUG-003.png) |

---

#### BUG-004 — Audit logs API called for non-admin on page load

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-004 |
| **Description** | `AuditLogsPage` runs `fetchLogs` in `useEffect` before checking `isAdmin`, causing unnecessary 403 responses. |
| **Steps to Reproduce** | 1. Login as staff<br>2. Navigate to `/audit-logs` directly<br>3. Open browser DevTools → Network |
| **Expected Result** | No request to `/api/audit-logs` for non-admin users |
| **Actual Result** | `GET /api/audit-logs` returns 403 |
| **Severity** | Minor |
| **Priority** | P3 |
| **Screenshot** | ![BUG-004](docs/screenshots/BUG-004.png) |

---

#### BUG-005 — Dashboard infinite loading on API failure

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-005 |
| **Description** | `DashboardPage` `fetchStats` has no `try/catch`; if overview or analytics fails, `setLoading(false)` never runs. |
| **Steps to Reproduce** | 1. Start frontend only (stop backend)<br>2. Login if possible or use cached session<br>3. Open Dashboard |
| **Expected Result** | Error state with retry option |
| **Actual Result** | Permanent loading spinner |
| **Severity** | Major |
| **Priority** | P2 |
| **Screenshot** | ![BUG-005](docs/screenshots/BUG-005.png) |

---

#### BUG-006 — Login button allows double submit

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-006 |
| **Description** | Submit button text changes to "Signing in..." but `disabled` attribute is not set during `loading`. |
| **Steps to Reproduce** | 1. Open login page<br>2. Enter valid credentials<br>3. Double-click Login rapidly |
| **Expected Result** | Button disabled while request in progress |
| **Actual Result** | Multiple login requests can be sent |
| **Severity** | Minor |
| **Priority** | P3 |
| **Screenshot** | ![BUG-006](docs/screenshots/BUG-006.png) |

---

#### BUG-007 — Patient row click conflicts with action buttons

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-007 |
| **Description** | Table row has `onClick` to select patient; Edit/Delete buttons do not call `stopPropagation()`. |
| **Steps to Reproduce** | 1. Admin → Patients<br>2. Select first patient<br>3. Click **Edit** on another row |
| **Expected Result** | Edit opens for clicked patient without unintended side effects |
| **Actual Result** | Selected patient row highlight may change due to bubbling |
| **Severity** | Minor |
| **Priority** | P3 |
| **Screenshot** | ![BUG-007](docs/screenshots/BUG-007.png) |

---

#### BUG-008 — Misspelled field name autherName

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-008 |
| **Description** | Postimi model and form use `autherName` instead of `authorName`. |
| **Steps to Reproduce** | 1. Open Postimi & Komenti<br>2. Create post — observe author field |
| **Expected Result** | Correct spelling **Author** in UI and API |
| **Actual Result** | **autherName** used throughout |
| **Severity** | Trivial |
| **Priority** | P4 |
| **Screenshot** | ![BUG-008](docs/screenshots/BUG-008.png) |

---

#### BUG-009 — Patients page no error handling on fetch

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-009 |
| **Description** | `fetchData` in `PatientsPage` has no try/catch; API failure leaves page unstable. |
| **Steps to Reproduce** | 1. Stop backend<br>2. Navigate to Patients as logged-in user |
| **Expected Result** | Toast: "Failed to load patients" |
| **Actual Result** | Console errors; empty or broken UI |
| **Severity** | Major |
| **Priority** | P2 |
| **Screenshot** | ![BUG-009](docs/screenshots/BUG-009.png) |

---

#### BUG-010 — Missing role-based route guard for audit logs

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-010 |
| **Description** | `/audit-logs` route uses `ProtectedRoute` only (authentication), not admin role check at router level. |
| **Steps to Reproduce** | 1. Login as staff<br>2. Enter URL `/audit-logs` |
| **Expected Result** | Redirect to dashboard or 403 page |
| **Actual Result** | Page renders partial UI then access message |
| **Severity** | Minor |
| **Priority** | P3 |
| **Screenshot** | ![BUG-010](docs/screenshots/BUG-010.png) |

---

#### BUG-011 — Stale session UX on failed token refresh

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-011 |
| **Description** | On reload, `clinicUser` is restored from localStorage immediately while refresh runs async; failed refresh triggers logout after flash of authenticated UI. |
| **Steps to Reproduce** | 1. Login as admin<br>2. Clear refresh tokens in DB or wait for expiry<br>3. Hard refresh browser |
| **Expected Result** | Immediate redirect to login without showing dashboard |
| **Actual Result** | Brief authenticated state, then logout |
| **Severity** | Minor |
| **Priority** | P3 |
| **Screenshot** | ![BUG-011](docs/screenshots/BUG-011.png) |

---

#### BUG-012 — Incorrect password in technical documentation

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-012 |
| **Description** | `documentation.md` section 7.4 lists `password123` but seeder uses `Admin@123`, `Doctor@123`, `Staff@123`. |
| **Steps to Reproduce** | 1. Follow documentation credentials<br>2. Attempt login |
| **Expected Result** | Login succeeds with documented password |
| **Actual Result** | `401 Invalid credentials` |
| **Severity** | Minor |
| **Priority** | P4 |
| **Screenshot** | ![BUG-012](docs/screenshots/BUG-012.png) |

---

### 9.5 Screenshot Instructions

Place one PNG per bug in `docs/screenshots/` using the filenames in the table above. Recommended capture:

- Full browser window showing URL bar and relevant UI/error
- For API bugs: DevTools Network tab with status code visible
- For Postman: Runner results panel

See `docs/screenshots/README.md` for a checklist.

### 9.6 Defect Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| Major | 4 |
| Minor | 5 |
| Trivial | 2 |
| **Total** | **12** |

---

## Appendix A — Traceability Matrix (Sample)

| Requirement | Test Level | Test Case / Bug ID |
|-------------|------------|-------------------|
| User login | Integration | API-02, API-03 |
| RBAC admin only for patients write | Integration | API-06, BUG-001 |
| Appointments for staff | System | UAT-02, BUG-002 |
| Audit logs admin only | System | API-08, BUG-004, BUG-010 |

---

## Appendix B — References

- Technical documentation: `documentation.md`
- Postman collection: `postman/DentalApp-API-Tests.postman_collection.json`
- Backend API entry: `backend/src/app.js`
- Seed data: `backend/src/seeders/seed.js`

---

*End of Testing Documentation*
