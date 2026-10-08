# SecureOps Portal

### A Hands-On IAM and SOC Dashboard Project

## About the Project

I built SecureOps Portal to get more hands-on experience with Identity and Access Management (IAM) and understand how authentication and authorization work in a real application.

The idea was to create a simple Security Operations Center (SOC) dashboard where analysts can view security incidents, but their ability to take action depends on their assigned role.

I used **Auth0** to handle authentication and user permissions, **React** for the dashboard, and **Node.js with Express** for the backend API.

One of my main goals was to understand the difference between authenticating a user and actually authorizing them to perform an action. Rather than just hiding buttons in the frontend, I wanted the backend to enforce those permissions independently.

## What I Built

The application includes:

- **User authentication with Auth0:** Users can log in and log out through Auth0 Universal Login.
- **Multi-Factor Authentication (MFA):** An additional verification step using a one-time password.
- **JWT-protected API:** The backend validates access tokens before allowing users to retrieve or update incidents.
- **Role-Based Access Control (RBAC):** SOC analysts have different permissions depending on their roles.
- **Incident dashboard:** A React interface displaying sample security incidents, their severity, status, and incident statistics.
- **Permission-based actions:** Users only see the option to close incidents when their role allows it.
- **API error handling:** Unauthorized requests are rejected, including HTTP 403 responses when a user lacks the required permission.

## Technologies Used

| Area | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express |
| Identity Management | Auth0 |
| Authentication | OAuth 2.0, OpenID Connect, PKCE, MFA |
| Authorization | RBAC, JWT permissions |
| API Security | express-oauth2-jwt-bearer |
| Version Control | Git, GitHub |

## How Role-Based Access Control Works

For this project, I created two SOC analyst roles in Auth0.

| Permission | SOC Analyst I | SOC Analyst II |
|---|---|---|
| Log in with MFA | Yes | Yes |
| View security incidents | Yes | Yes |
| Close security incidents | No | Yes |
| `read:incidents` | Yes | Yes |
| `close:incidents` | No | Yes |

**SOC Analyst I** has read-only access. Analysts assigned this role can load and review incidents, but they cannot close them.

**SOC Analyst II** has additional permissions, allowing analysts to close incidents directly from the dashboard.

I also configured the React interface to check the permissions included in the access token. If a user doesn't have `close:incidents`, the dashboard displays **View Only** instead of a Close button.

However, hiding the button alone isn't enough for security. The Express API also checks the user's permissions before processing the request. This prevents someone from bypassing the frontend and closing an incident through a direct API call without authorization.

## Backend API

I created two protected endpoints for working with the sample incidents.

### `GET /api/incidents`

Retrieves the list of security incidents.

The user must provide a valid Auth0 access token containing the `read:incidents` permission.

### `PATCH /api/incidents/:id`

Updates an incident's status to `closed`.

This endpoint requires the `close:incidents` permission.

The API returns different HTTP responses depending on the result:

- **200 OK:** The request was successful.
- **401 Unauthorized:** The request does not contain a valid access token.
- **403 Forbidden:** The user is authenticated but doesn't have the required permission.
- **404 Not Found:** The requested incident doesn't exist.

## Authentication and Authorization Flow

Here's what happens when someone uses SecureOps Portal:

1. The user selects Log In and is redirected to Auth0 Universal Login.
2. Auth0 authenticates the user and enforces MFA.
3. After login, React requests an access token for the SecureOps API.
4. When the user loads incidents or attempts to close one, React sends the token in the `Authorization: Bearer` header.
5. The Express backend validates the token, including its signature, issuer, and audience.
6. The backend checks whether the token contains the permission required for that endpoint.
7. If the user is authorized, the API processes the request and returns the result.

This helped me better understand how OAuth 2.0, OpenID Connect, JWTs, and RBAC work together.

## Testing the Security Controls

I tested several scenarios to make sure the application behaved as expected.

**1. Accessing the API without authentication**

I tested requests without a valid access token and confirmed that the protected API rejected them.

**2. Trying to close incidents as SOC Analyst I**

With only the `read:incidents` permission, I could retrieve the incident list but couldn't close incidents. The API returned **403 Forbidden** when I attempted an unauthorized PATCH request.

**3. Closing incidents as SOC Analyst II**

After assigning the higher-privilege role and logging in again, the access token included `close:incidents`.

The Close buttons appeared in the dashboard, and I could successfully close incidents. The incident status and statistics updated after the API returned a successful response.

**4. Checking frontend permissions**

I also verified that the dashboard displayed **View Only** for SOC Analyst I and enabled Close actions for SOC Analyst II.

These tests helped demonstrate the principle of least privilege: users should only have access to the actions they need for their role.

## Running the Project Locally

### Requirements

You'll need:

- Node.js and npm
- An Auth0 account and tenant
- An Auth0 Single Page Application
- An Auth0 API with RBAC enabled

### 1. Clone the repository

```bash
git clone https://github.com/erol11/secureops-portal.git
cd secureops-portal
```

### 2. Install dependencies

Install the React frontend dependencies:

```bash
npm install
```

Then install the Express backend dependencies:

```bash
cd api
npm install
cd ..
```

### 3. Set up Auth0

In your Auth0 tenant:

1. Create a Single Page Application.
2. Create an API with an identifier of your choice.
3. Enable RBAC and **Add Permissions in the Access Token**.
4. Create the `read:incidents` and `close:incidents` permissions.
5. Create SOC Analyst I and SOC Analyst II roles and assign the appropriate permissions.
6. Assign the roles to your test users.
7. Configure MFA for your testing environment.

For local development, configure the SPA's allowed callback URLs, logout URLs, and web origins to use:

`http://localhost:5173`

Update `src/main.jsx` with your Auth0 domain, SPA Client ID, and API audience.

Update `api/server.js` with the corresponding Auth0 issuer and API audience.

### 4. Start the backend

From the `api` directory:

```bash
node server.js
```

The Express API runs on:

`http://localhost:3001`

### 5. Start the frontend

Open a separate terminal in the project root and run:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

If you're using Windows PowerShell and encounter an execution policy error, you can use `npm.cmd` instead of `npm`.

## Current Limitations

SecureOps Portal is a learning project, not a production SOC platform.

The incidents are simulated and stored in memory, so any changes are reset when the backend restarts. The application currently runs locally, and the Auth0 and CORS configurations are set up for that environment.

There is no live SIEM integration or persistent database at this stage.

## What I Learned

Building SecureOps Portal gave me practical experience beyond just reading about authentication and access control.

I worked with Auth0 Universal Login, MFA, OAuth 2.0, OpenID Connect, and JWT access tokens. I also learned how to protect Express API endpoints, assign permissions to different roles, and connect those permissions to a React interface.

One of the biggest takeaways was understanding that **authentication doesn't automatically mean authorization**. A user can be successfully logged in and still be restricted from performing certain actions.

I also gained experience troubleshooting API authorization errors, working with React state, testing HTTP responses, and using Git and GitHub to manage and publish a project.

This project gave me a better understanding of how IAM concepts can be applied in a security operations environment.

## Author

**Erol Rakaj**

M.S. Cybersecurity — Rowan University

Interested in Security Operations, Identity & Access Management, and Network Security.
