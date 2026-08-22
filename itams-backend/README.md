# ITAMS Backend (Node.js + Express + PostgreSQL/Neon)

Rebuilt to match the team's written spec (login/HR requirements) as of Aug 22, 2026.

## What changed in this version

- **Login structure**: only `HR`, `AssetManager`, and `InventoryManager` are real
  login roles now. Regular employees are managed records only (`employees`
  table) — they do **not** get login accounts. (This reverses an earlier
  version that auto-created a login per employee — removed per your team's
  clarification.)
- **Employee ID**: 9 digits — `YYMMDD` (Date of Joining) + 3-digit daily serial,
  e.g. `260822001`. Generated **server-side**, checked against both
  `employees` and `users` (since HR/Asset Manager/Inventory Manager share the
  same numbering scheme) — never trusted from the client.
- **Asset ID**: 3-letter type prefix + 3-digit sequence, e.g. `MON001`,
  `KEY001`. Also generated server-side — the frontend's own ID generator uses
  `localStorage` as a counter, which cannot guarantee uniqueness across
  different browsers/devices, so the backend is the source of truth here.
- **Password policy**: 8-20 characters, at least one uppercase, one lowercase,
  one digit, one special character. Enforced on password reset.
- **Joining Date window**: must be within the past 7 days up to today.
- **Edit Asset**: `assetType` is read-only after creation — sending it in a
  PUT request is silently ignored; only `model`, `description`,
  `purchaseDate`, `warrantyExpiry` are editable.
- **Department/Head names**: letters and spaces only.

## 1. Set up Neon Postgres

1. neon.com → sign up (free) → Create a project.
2. Copy the full connection string from **Connection Details**.
3. `cp .env.example .env` and paste it into `DATABASE_URL`.

## 2. Run the schema

Paste the full contents of `sql/schema.sql` into Neon's **SQL Editor** and run it.
(19 statements: 1 function, 8 tables, 3 triggers, 7 indexes.)

## 3. Set up Gmail SMTP

Same as before: 2-Step Verification → App Password at
https://myaccount.google.com/apppasswords → put the 16-char code in
`GMAIL_APP_PASSWORD`.

Set `SEED_HR_EMAIL`, `SEED_ASSET_MANAGER_EMAIL`, and
`SEED_INVENTORY_MANAGER_EMAIL` to **real Gmail inboxes you control**.

`DEFAULT_SEED_PASSWORD` must satisfy the password policy above — the
default (`Itams@2026`) does.

## 4. Install, seed, run

```bash
npm install
npm run seed
npm run dev
```

The seed script prints each account's generated 9-digit login ID, e.g.:
```
✅ Seeded HR: login ID 260822001 | email your.hr@gmail.com | password Itams@2026
✅ Seeded AssetManager: login ID 260822002 | email your.am@gmail.com | password Itams@2026
✅ Seeded InventoryManager: login ID 260822003 | email your.im@gmail.com | password Itams@2026
```

Log in with the **email** (matches `Login.js`'s `@gmail.com` requirement) or
the numeric ID directly, if your frontend's login form accepts it.

## API summary

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | `/api/login` | public | `{employeeIdOrEmail, password}` |
| POST | `/api/forgot-password/send-otp` | public (rate-limited) | `{emailOrId}` |
| POST | `/api/forgot-password/verify-otp` | public (rate-limited) | `{emailOrId, otp}` |
| POST | `/api/forgot-password/reset` | public | `{emailOrId, otp, newPassword}` — password policy enforced |
| GET | `/api/employees` | HR, AssetManager | AssetManager is read-only |
| POST/PUT/PATCH/DELETE | `/api/employees...` | HR only | Employee ID auto-generated on POST |
| GET/POST/DELETE | `/api/departments` | HR | Letters-only name validation |
| GET/POST/PUT/DELETE | `/api/assets...` | AssetManager | Asset ID auto-generated; `assetType` read-only on edit |
| GET/POST/PATCH | `/api/asset-requests...` | HR (create), HR+AssetManager (read), AssetManager (approve/reject) | |
| GET/POST | `/api/asset-assignments...` | AssetManager | Includes `/reassign`, transaction-safe |
| GET | `/api/inventory` | AssetManager, InventoryManager | Two-level: per-type, with per-model `details` when models are recorded |
| GET/POST/PATCH | `/api/maintenance...` | HR, AssetManager, InventoryManager (status update: AssetManager only) | |

## Verified, not just written

Every endpoint above was tested against a real local PostgreSQL instance
before being handed over: schema applied cleanly (19/19 statements), all
three roles logged in successfully (via email and via raw numeric ID),
employee ID generation correctly continued the shared sequence across
`employees`/`users` (`...001/002/003` for seeded accounts → `...004` for the
first added employee), joining-date window correctly rejected both
too-old and future dates, asset ID generation produced correct type-prefixed
IDs (`MON001`, `MON002`, `KEY001`), editing an asset's `assetType` was
correctly ignored, department names with non-letter characters were
correctly rejected, Inventory Manager could read `/api/inventory` but was
correctly blocked from `/api/assets`, and a weak password was correctly
rejected on password reset.

## Known open question — not resolved in this build

Your team's written spec says employee email just needs to end in
`@gmail.com`. The **currently pushed frontend code** (`Login.js`,
`AddEmployee.js`, `UpdateEmployee.js`) instead forces email to exactly equal
`<9-digit-ID>@gmail.com` — which can't receive real mail, since nobody owns a
Gmail account named after an arbitrary 9-digit number. This backend follows
the written spec (domain-only check) since that keeps real OTP delivery
possible. If your team confirms they actually want the stricter
ID-equals-email rule, tell me and I'll change `GMAIL_REGEX` in
`validators.js` — but doing so means real email delivery stops working for
whichever accounts use that pattern.
