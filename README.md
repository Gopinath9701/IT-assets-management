# IT Asset Management System (ITAMS)

## Project Overview

The IT Asset Management System (ITAMS) is a web-based application for managing IT assets within an organization. It provides a centralized platform to record, assign, monitor, and maintain assets such as laptops, desktops, printers, servers, routers, and software licenses.

This repository currently contains the backend implementation of the system using Node.js, Express, PostgreSQL, and Neon.

---

##  Implementation

The backend is built with:

- Node.js
- Express.js
- PostgreSQL / Neon
- JWT authentication
- Role-based access control
- OTP-based password reset via email
- REST APIs for employees, assets, requests, assignments, and maintenance

---

## Main Features

### Asset Management
- Add, update, view, and delete assets
- Search assets by name or type
- Track asset status and assignment information

### Asset Assignment
- Assign approved assets to employees
- Prevent duplicate assignments
- Track assignment history

### Maintenance Management
- Report maintenance issues
- Track maintenance request status
- Update repair progress

### User Management
- Employee management
- Department management
- Role-based access control for HR, Asset Manager, Admin, Employee, and Technician

### Authentication
- Login using email or employee identifier
- Password reset using OTP
- JWT-based protected routes

---

## User Roles

### Admin
- Manage users and assets
- Access all system modules
- Manage approvals and assignments

### Asset Manager
- Register and manage assets
- Approve asset requests
- Assign assets to employees

### HR
- Manage employees and departments
- View employee records and status
- Submit asset requests

### Employee
- View assigned assets
- Report maintenance issues
- Request assets

### Technician
- View maintenance requests
- Update maintenance status

---

## Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Neon
- JWT
- bcryptjs
- nodemailer
- dotenv

### Database
- PostgreSQL on Neon

### DevOps Tools
- Git
- GitHub
- Jenkins
- Docker
- Kubernetes
- Prometheus
- Grafana

---

## Project Structure

```text
IT-assets-management/
├── itams-backend/
│   ├── server.js
│   ├── package.json
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   ├── sql/
│   │   ├── schema.sql
│   │   └── seed.js
│   └── README.md
├── Jenkinsfile
├── backlogs.txt
└── README.md
```

---

## Backend Setup

### 1. Install dependencies

```bash
cd itams-backend
npm install
```

### 2. Configure environment variables

Create a `.env` file in the backend folder using the values from `.env.example`.

Example:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000

JWT_SECRET=your_secure_secret

DATABASE_URL=postgresql://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require

GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
EMAIL_FROM_NAME=ITAMS Support

DEFAULT_SEED_PASSWORD=ITAMS@2026
SEED_HR_EMAIL=your.hr.email@gmail.com
SEED_ASSET_MANAGER_EMAIL=your.assetmanager.email@gmail.com
```

### 3. Create the database tables

Run the SQL from [itams-backend/sql/schema.sql](itams-backend/sql/schema.sql) in your Neon database.

### 4. Seed initial users

```bash
npm run seed
```

### 5. Start the backend

```bash
npm run dev
```

Or:

```bash
npm start
```

---

## API Overview

The backend exposes REST APIs for:

- Authentication:
  - `POST /api/login`
  - `POST /api/forgot-password/send-otp`
  - `POST /api/forgot-password/verify-otp`
  - `POST /api/forgot-password/reset`

- Employees:
  - `GET /api/employees`
  - `POST /api/employees`
  - `PUT /api/employees/:employeeId`
  - `PATCH /api/employees/:employeeId/status`

- Departments:
  - `GET /api/departments`
  - `POST /api/departments`

- Assets:
  - `GET /api/assets`
  - `POST /api/assets`
  - `PUT /api/assets/:assetId`
  - `DELETE /api/assets/:assetId`

- Asset Requests:
  - `GET /api/asset-requests`
  - `POST /api/asset-requests`
  - `PATCH /api/asset-requests/:requestId/approve`
  - `PATCH /api/asset-requests/:requestId/reject`

- Asset Assignments:
  - `GET /api/asset-assignments/pending`
  - `GET /api/asset-assignments/history`
  - `POST /api/asset-assignments`

- Maintenance:
  - `GET /api/maintenance`
  - `POST /api/maintenance`
  - `PATCH /api/maintenance/:requestId/status`

---

## Notes

- The backend is currently the main implemented part of this project.
- The project uses PostgreSQL on Neon rather than the older MySQL-based setup.
- Email sending is configured through Gmail SMTP using an app password.

---

## Future Enhancements

- Frontend integration improvements
- Mobile app support
- QR/barcode-based asset tracking
- Advanced reporting dashboards
- Notification system enhancements

---

## Authors

Team Gama

Department of Computer Science and Engineering (Data Science)

DevOps Project

2026
