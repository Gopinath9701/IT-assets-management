# ITAMS Backend (Node.js + Express + PostgreSQL / Neon)

Backend for the IT Asset Management System, matching the existing React pages
(Login, ForgotPassword, HRManagement, AddEmployee, UpdateEmployee,
ViewEmployeeList, EmployeeStatus, DepartmentManagement, ReportMaintenance,
AssetManagement, AddAsset, EditAsset, ManageAsset, AssetDetails, AssetRequest,
RequestApproval, AssetAssignment, AssetInventory).

Covers Sprint 1 backlog items: PB-01 (Auth), PB-02 (RBAC), PB-23 (DB Design),
PB-24 (API Development), the HR-module tables needed by Sprint 2, and the
full Sprint 3 Asset Request → Approval → Assignment → Inventory chain.

Originally built on MySQL/Aiven; migrated to PostgreSQL/Neon on request from
the team lead. Every query was rewritten (not just find-and-replaced) and
re-tested end-to-end against a real local Postgres instance before this was
handed off — see "Verified, not just written" below.

---

## 1. Set up the free Neon Postgres database

1. Go to **https://neon.com** (or neon.tech) → Sign up (free tier, no card required).
2. Create a new project → name it e.g. `itams-db`.
3. On the project dashboard, open **Connection Details** and copy the full
   connection string — it looks like:
   `postgresql://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require`

## 2. Configure environment variables

```bash
cp .env.example .env
```

Paste that connection string into `DATABASE_URL` in `.env`. That's the only
database config needed — Neon's string already includes `sslmode=require`.

## 3. Create the database tables

Open the **SQL Editor** in the Neon console, paste the full contents of
`sql/schema.sql`, and run it. Or from your machine with `psql`:

```bash
psql "postgresql://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require" -f sql/schema.sql
```

## 4. Set up real email sending (Gmail SMTP)

The Forgot Password flow (`ForgotPassword.js`) sends a real OTP email.

1. On the Gmail account you want to send from, turn on **2-Step Verification**:
   https://myaccount.google.com/security

2. Create an **App Password**: https://myaccount.google.com/apppasswords
   (choose app = "Mail", device = "Other", name it "ITAMS")
3. Copy the 16-character password into `.env`:
   ```
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
   ```
   Do **not** use your normal Gmail login password — it will not work.

## 5. Install, seed, and run

```bash
npm install
npm run seed     # creates the HR and Asset Manager logins + sample departments
npm run dev       # nodemon, for local development
# or
npm start         # plain node, for production
```

On success you'll see:
```
✅ Connected to PostgreSQL (Neon) database
✅ Gmail SMTP transporter ready
🚀 ITAMS API listening on port 5000
```

### Seeded login credentials

Both accounts share the **same password** (set via `DEFAULT_SEED_PASSWORD` in `.env`, default `ITAMS@2026`).

⚠️ **Important:** the deployed `Login.js` and `ForgotPassword.js` pages only accept
an identifier that is either `EMP` + 3 characters, or an email ending in
`@gmail.com` — nothing else passes their client-side validation before the
request is even sent. So:

- Set `SEED_HR_EMAIL` and `SEED_ASSET_MANAGER_EMAIL` in `.env` to **real Gmail
  inboxes you control** (needed both to pass that validation and to actually
  receive the OTP email).
- Log in with that **email**, not the `login_id` (`HR001`/`AM001` won't pass
  the form's own validation).

| Role          | Log in with                     | Password     |
|---------------|-----------------------------------|---------------|
| HR            | value of `SEED_HR_EMAIL`          | `ITAMS@2026`  |
| Asset Manager | value of `SEED_ASSET_MANAGER_EMAIL`| `ITAMS@2026`  |

Change these after first login — `PATCH` endpoints for profile/password update
can be added the same way `resetPassword` in `authController.js` works.

---

## API summary

| Method | Endpoint                                   | Access             | Purpose |
|--------|---------------------------------------------|---------------------|---------|
| POST   | `/api/login`                                | public              | Login — body `{ employeeIdOrEmail, password }`, returns JWT + role |
| POST   | `/api/forgot-password/send-otp`             | public (rate-limited)| body `{ emailOrId }` — emails a real 6-digit OTP |
| POST   | `/api/forgot-password/verify-otp`           | public (rate-limited)| body `{ emailOrId, otp }` |
| POST   | `/api/forgot-password/reset`                | public              | body `{ emailOrId, otp, newPassword }` |

> These paths and field names are matched exactly to the `fetch()` calls already
> written into `Login.js` and `ForgotPassword.js` in the `frontend-developer`
> branch — no frontend changes needed.
| GET/POST/PUT/PATCH/DELETE | `/api/employees...`           | HR, Admin           | Add/Update/View/Status/Delete employee |
| GET    | `/api/employees/stats/summary`              | HR, Admin           | Powers the "Employee Status Overview" cards on `HRManagement.js` |
| GET/POST/DELETE | `/api/departments...`                 | HR, Admin           | Department Management |
| GET/POST/PUT/DELETE | `/api/assets...`                  | AssetManager, Admin  | Add/Edit/Delete/View asset — matches `AddAsset.js`/`EditAsset.js`/`ManageAsset.js`/`AssetDetails.js` field sets exactly |
| GET    | `/api/asset-requests`                       | HR, AssetManager, Admin | List requests, filter by `status`/`employeeId`/`assetType` |
| POST   | `/api/asset-requests`                       | HR, Admin           | Submit a request — matches `AssetRequest.js` |
| PATCH  | `/api/asset-requests/:requestId/approve`    | AssetManager, Admin  | Matches `RequestApproval.js` |
| PATCH  | `/api/asset-requests/:requestId/reject`     | AssetManager, Admin  | body `{ reason }` |
| GET    | `/api/asset-assignments/pending`            | AssetManager, Admin  | Approved-but-unassigned requests, matches `AssetAssignment.js` |
| GET    | `/api/asset-assignments/history`            | AssetManager, Admin  | Matches the "Assignment History" table exactly, incl. the `"Name (ASTxxx)"` display format |
| GET    | `/api/asset-assignments/available-assets`   | AssetManager, Admin  | Real asset picker (replaces the free-text field in the current frontend placeholder) |
| POST   | `/api/asset-assignments`                    | AssetManager, Admin  | body `{ requestId, assetId }` — transaction-guarded against double-assignment |
| GET    | `/api/inventory`                            | AssetManager, Admin  | Aggregated stock counts by asset type, matches `AssetInventory.js` |
| GET/POST | `/api/maintenance`                        | any logged-in user   | Report Maintenance |
| PATCH  | `/api/maintenance/:requestId/status`        | AssetManager, Admin, Technician | Update ticket status |

All protected routes require `Authorization: Bearer <token>` from the login response.

## Coverage status vs the `frontend-developer` branch

Every page that's actually coded in the frontend (not just mocked up on
`Lead-Developer`) has a matching, validated backend endpoint:

| Frontend page | Backend coverage |
|---|---|
| `Login.js` | ✅ `/api/login` — field names and validation matched exactly |
| `ForgotPassword.js` | ✅ `/api/forgot-password/*` — real OTP email, field names matched exactly |
| `AddEmployee.js` | ✅ `/api/employees` (POST) — server-side validation now mirrors the frontend's own regexes (EMP### ID, @gmail.com, +91 phone, name/designation length+charset, no future joining date) |
| `UpdateEmployee.js` | ✅ `/api/employees/:employeeId` (PUT) — same validation |
| `ViewEmployeeList.js` | ✅ `/api/employees` (search) + `/api/employees/:employeeId` (detail + assigned assets, matches the popup exactly) |
| `EmployeeStatus.js` | ✅ `/api/employees/:employeeId/status` (PATCH) |
| `DepartmentManagement.js` | ✅ `/api/departments` (GET/POST/DELETE) |
| `ReportMaintenance.js` | ✅ `/api/maintenance` (GET/POST) + status update |
| `HRManagement.js` | ✅ `/api/employees/stats/summary` now backs the "Employee Status Overview" cards (previously hardcoded numbers in the frontend) |
| `AssetManagement.js` | ✅ basic CRUD routes exist (`/api/assets`), ready for whenever the frontend adds real asset fields — currently that page is nav cards only, no form to match yet |
| `Home.js` | — static page, no backend needed |
| `AddAsset.js` | ✅ `POST /api/assets` — Asset ID (`AST`+3 alphanumeric) generated and uniqueness-checked server-side, not trusted from the client |
| `EditAsset.js` | ✅ `PUT /api/assets/:assetId` |
| `ManageAsset.js` | ✅ `GET /api/assets` (search/filter) + `DELETE /api/assets/:assetId` |
| `AssetDetails.js` | ✅ `GET /api/assets/:assetId` — full field set (brand, model, serial, location, description, warranty, status) |
| `AssetRequest.js` | ✅ `POST /api/asset-requests` — real employee-existence check replaces the frontend's hardcoded `VALID_EMPLOYEE_IDS` list |
| `RequestApproval.js` | ✅ `GET /api/asset-requests`, `PATCH .../approve`, `PATCH .../reject` |
| `AssetAssignment.js` | ✅ `GET .../pending`, `GET .../history`, `POST /api/asset-assignments` — transaction-safe, blocks double-assignment, and adds a real `available-assets` picker to replace the current free-text placeholder field |
| `AssetInventory.js` | ✅ `GET /api/inventory` — live aggregation by asset type (total/available/assigned/under-maintenance/status), not a separate stored table |

**Verified, not just written:** every endpoint above was tested against a real
PostgreSQL instance (schema applied cleanly with zero errors, full
request→approve→assign→inventory chain run end-to-end with actual HTTP calls,
including the double-assignment guard and the RBAC 403 checks) — not just
syntax-checked. The migration from the original MySQL build was a full
rewrite (driver, placeholder syntax, transaction API, `SUM(bool)` →
`COUNT(*) FILTER`, `ON DUPLICATE KEY` → `ON CONFLICT`), not a find-and-replace.


---

## 6. Hosting the API itself (so "online DB" is actually reachable)

The database above is already online/always-on. To make the **API** publicly
reachable too (so your deployed frontend can call it), the simplest free
options that work well with this exact codebase:

- **Render.com** (Web Service, free tier): connect your GitHub repo, build
  command `npm install`, start command `npm start`, add the same `.env`
  values as Environment Variables in the Render dashboard.
- **Railway.app**: similar flow, deploy from GitHub, set the same env vars.

Either way, once deployed, set `CLIENT_ORIGIN` in the environment to your
frontend's deployed URL (e.g. `https://itams.vercel.app`) so CORS allows it.

---

## 7. Connecting the existing React frontend

Each page currently uses local `useState` + `alert()` placeholders. To wire
them to this API:

1. Create `src/api.js` in the frontend with a small `fetch` wrapper that adds
   `Authorization: Bearer <token>` from `localStorage`.
2. Replace the `alert("...")` calls in `AddEmployee.js`, `UpdateEmployee.js`,
   `EmployeeStatus.js`, `DepartmentManagement.js`, `ReportMaintenance.js`,
   and `ViewEmployeeList.js` with real `fetch`/`axios` calls to the matching
   endpoints above.
3. In `Login.js`, POST to `/api/auth/login`, store the returned token +
   `role`, and route HR → `HRManagement`, AssetManager → `AssetManagement`.
4. In `ForgotPassword.js`, wire `handleSendOTP` → send-otp,
   `handleVerifyOTP` → verify-otp, `handleResetPassword` → reset.

Happy to wire any of these pages up directly — just say which one first.
