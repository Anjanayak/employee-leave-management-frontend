# Admin Frontend

React + Vite starter for the Employee Leave Management System Admin Service.

## Run
1. Extract this ZIP.
2. Open a terminal in the extracted `admin-frontend` folder.
3. Run `npm.cmd install`
4. Copy `.env.example` to `.env` (optional; default API URL is `http://localhost:8083`).
5. Run `npm.cmd run dev`
6. Open `http://localhost:5173`

## Current screens
- Admin login
- Dashboard
- Employees
- Managers
- Leave requests (status filter)
- Audit logs
- CSV leave report download

## Backend assumptions to verify
This frontend uses the Admin Service endpoints already discussed:
- `POST /api/auth/login`
- `GET /api/admin/dashboard`
- `GET /api/admin/employees`
- `GET /api/admin/managers`
- `GET /api/admin/leaves`
- `GET /api/admin/audit-logs`
- `GET /api/admin/reports/leaves`

The exact login response is handled flexibly (`token`, `accessToken`, or `jwt`). If your backend returns a different field, adjust `src/services/authService.js`.
Employee/manager/leave response fields are rendered defensively. This starter focuses on viewing data and report download; it does not invent create/update/delete request bodies or Leave Service integration.
