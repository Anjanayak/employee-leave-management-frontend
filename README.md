# ELMS Manager Frontend

React 18 + Vite + Bootstrap 5 frontend for the Manager Service.

## Run
1. Install Node.js 20+.
2. Copy `.env.example` to `.env` and adjust values.
3. From this folder run:
   ```bash
   npm install
   npm run dev
   ```
4. Open http://localhost:5174

Build: `npm run build`

## Backend integration
Default API base URL: `http://localhost:8082`
Default manager ID: `301` (override with `VITE_MANAGER_ID`).

Implemented backend calls based on the Manager Service API contract:
- `GET /api/manager/decisions/pending/{managerId}`
- `POST /api/manager/decisions`
- `GET /api/manager/decisions/manager/{managerId}`

The API helper accepts either a response body or the common wrapper `{ "data": ... }`.
Pending leave objects are expected to include:
`leaveRequestId, employeeId, employeeName, leaveType, startDate, endDate, reason, status`.

The decision POST sends:
```json
{
  "leaveRequestId": 1001,
  "managerId": 301,
  "decision": "APPROVED",
  "reason": "Approved"
}
```
If your `ManagerDecisionRequest` uses different property names, update `src/services/managerApi.js` in one place.

Notifications are currently presented from decision activity stored in the browser because a confirmed manager-owned notifications API contract was not available. Connect a real endpoint in `managerApi.js` when the backend route is finalized.

## Authentication

Manager login uses Employee Service authentication.

Endpoint:
POST http://localhost:8081/api/auth/login

Request:
{
  "email": "manager@example.com",
  "password": "password"
}

Employee Service verifies the credentials using its users table
and returns a JWT token.

The Manager Frontend stores the token in localStorage and sends:

Authorization: Bearer <token>

to Manager Service running on port 8082.
## Main screens
- Dashboard overview
- Pending leave requests with search/filter
- Leave detail and approve/reject dialog
- Decision history
- Notifications/activity
- Profile and sign-out

## Troubleshooting
- `ERR_CONNECTION_REFUSED`: start Manager Service and confirm `VITE_API_BASE_URL`.
- `401`: check token expiry, issuer/signature configuration, and Manager Service JWT filter.
- `403`: verify the token has the manager role.
- `404`: compare endpoint paths with your controller mappings.
- `503`: inspect Manager Service -> Employee Service Feign connectivity.
- Set `VITE_USE_MOCK_DATA=true` to run the UI without the backend.
