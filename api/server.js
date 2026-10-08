const express = require("express");
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");

const app = express();
const PORT = 3001;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Auth0 JWT validation
const checkJwt = auth({
  audience: "https://secureops-api",
  issuerBaseURL: "https://dev-msbksew370561l5b.us.auth0.com/",
});

// RBAC permission validation
const requirePermission = (permission) => {
  return (req, res, next) => {
    const permissions = req.auth?.payload?.permissions || [];

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Missing required permission: ${permission}`,
      });
    }

    next();
  };
};

// Demo incident data
const incidents = [
  {
    id: 1,
    title: "Multiple failed login attempts",
    severity: "high",
    status: "investigating",
  },
  {
    id: 2,
    title: "Suspicious PowerShell execution",
    severity: "medium",
    status: "open",
  },
  {
    id: 3,
    title: "Malware detected on workstation",
    severity: "critical",
    status: "contained",
  },
];

// GET all security incidents
app.get(
  "/api/incidents",
  checkJwt,
  requirePermission("read:incidents"),
  (req, res) => {
    res.status(200).json(incidents);
  }
);

// Close a security incident
app.patch(
  "/api/incidents/:id",
  checkJwt,
  requirePermission("close:incidents"),
  (req, res) => {
    const id = Number(req.params.id);

    const incident = incidents.find((incident) => incident.id === id);

    if (!incident) {
      return res.status(404).json({
        error: "Not Found",
        message: `Incident ${id} not found`,
      });
    }

    incident.status = "closed";

    return res.status(200).json(incident);
  }
);

// Start API server
app.listen(PORT, () => {
  console.log(`SecureOps API running on http://localhost:${PORT}`);
});