# SecureOps Portal
### Identity & Access Management (IAM) and SOC Incident Dashboard

SecureOps Portal is a hands-on cybersecurity project demonstrating secure authentication, token-based API authorization, and Role-Based Access Control (RBAC) within a Security Operations Center (SOC) incident management dashboard.

The application integrates **Auth0**, **React**, **Node.js**, and **Express** to simulate how SOC analysts with different permissions access and manage security incidents.

## Key Features

- **Auth0 Authentication:** Secure login and logout using OpenID Connect (OIDC) and OAuth 2.0 Authorization Code Flow with PKCE.
- **Multi-Factor Authentication (MFA):** One-time password verification enforced through Auth0.
- **JWT Validation:** Express API validates Auth0-issued access tokens, including issuer and audience.
- **Role-Based Access Control (RBAC):** Different SOC analyst roles receive different API permissions.
- **Permission-Based UI:** The React dashboard displays available actions based on the user's access token permissions.
- **Protected REST API:** Backend endpoints independently enforce authorization.
- **Incident Dashboard:** Displays incident severity, status, and summary statistics.
- **Error Handling:** Unauthorized operations return HTTP 403 Forbidden.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express |
| Identity Provider | Auth0 |
| Authentication | OAuth 2.0, OpenID Connect, PKCE, MFA |
| Authorization | RBAC, JWT permission claims |
| API Security | express-oauth2-jwt-bearer |
| Version Control | Git, GitHub |

## Role-Based Access Control

The project implements two simulated SOC analyst roles:

| Capability | SOC Analyst I | SOC Analyst II |
|---|---|---|
| Authenticate with MFA | Yes | Yes |
| View security incidents | Yes | Yes |
| Close security incidents | No | Yes |
| `read:incidents` | Granted | Granted |
| `close:incidents` | Not granted | Granted |

The frontend conditionally displays the **Close** button only when the user's access token contains `close:incidents`.

**Security principle:** The frontend is not the authorization boundary. The Express backend independently validates JWTs and enforces permissions on protected routes.

## API Endpoints

### GET /api/incidents

Retrieves the security incidents.

- Requires a valid Auth0 JWT access token.
- Requires `read:incidents`.
- Returns HTTP 200 when authorized.

### PATCH /api/incidents/:id

Changes an incident's status to `closed`.

- Requires a valid Auth0 JWT access token.
- Requires `close:incidents`.
- Returns HTTP 200 when successful.
- Returns HTTP 403 when permission is insufficient.
- Returns HTTP 404 when the incident does not exist.

Missing or invalid access tokens are rejected by the authentication middleware.

## Security Architecture

1. The user authenticates through Auth0 Universal Login.
2. Auth0 enforces MFA and issues tokens after successful authentication.
3. React requests an access token for the SecureOps API.
4. React sends requests using the `Authorization: Bearer` header.
5. Express validates the token's signature, issuer, and audience.
6. Custom authorization middleware checks the token's permissions.
7. The API returns incident information or performs authorized incident operations.

## Running the Project Locally

### Prerequisites

- Node.js and npm
- An Auth0 tenant
- An Auth0 Single Page Application
- An Auth0 API configured with RBAC

### 1. Clone the repository

```bash
git clone https://github.com/erol11/secureops-portal.git
cd secureops-portal
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd api
npm install
cd ..
```

### 4. Configure Auth0

Create an Auth0 Single Page Application and API.

Configure the API with the following permissions:

- `read:incidents`
- `close:incidents`

Enable RBAC and **Add Permissions in the Access Token**.

Create two roles with the permissions shown in the RBAC table and assign them to test users.

Configure your Auth0 SPA to allow `http://localhost:5173` as an application origin, callback URL, and logout URL.

Update `src/main.jsx` with your own Auth0 domain, SPA Client ID, and API audience. Update `api/server.js` to use the same Auth0 issuer and API audience.

Configure an appropriate MFA policy in your Auth0 tenant.

### 5. Start the backend

```bash
cd api
node server.js
```

The API runs on `http://localhost:3001`.

### 6. Start the frontend

In a separate terminal, from the project root:

```bash
npm run dev
```

Open `http://localhost:5173`.

**Note:** If Windows PowerShell blocks npm scripts, use `npm.cmd` instead of `npm`.

## Demonstrated Security Scenarios

**Scenario 1 — Authentication required**

A request without a valid access token is rejected by the Express authentication middleware.

**Scenario 2 — Insufficient permissions**

SOC Analyst I can retrieve incidents but cannot close them. The API rejects unauthorized PATCH requests with HTTP 403.

**Scenario 3 — Authorized incident response**

SOC Analyst II can retrieve and close incidents. The dashboard updates incident status and the closed-incident counter after successful API responses.

**Scenario 4 — Permission-aware interface**

Users without `close:incidents` see **View Only** rather than the Close button.

## Project Limitations

This is an educational proof-of-concept, not a production SOC platform.

- Incident data is stored in memory and resets when the API process restarts.
- Auth0 and CORS configuration currently target local development.
- The application uses simulated incidents rather than a live SIEM.
- Production deployment, persistent storage, and operational monitoring are not implemented.

## Learning Outcomes

This project demonstrates practical experience with identity and access management, OAuth 2.0/OIDC authentication, MFA, JWT-based API security, least privilege, RBAC, REST APIs, and secure frontend/backend integration.

## Author

Erol Rakaj

Cybersecurity | Identity & Access Management | Security Operations
