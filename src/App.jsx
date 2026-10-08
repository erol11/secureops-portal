import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import { jwtDecode } from "jwt-decode";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [apiError, setApiError] = useState("");
  const [permissions, setPermissions] = useState([]);
  const totalIncidents = incidents.length;

  const criticalIncidents = incidents.filter(
  (incident) => incident.severity === "critical"
  ).length;

  const closedIncidents = incidents.filter(
  (incident) => incident.status === "closed"
  ).length;

  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect,
    logout,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  // Load security incidents
  const loadIncidents = async () => {
    try {
      const token = await getAccessTokenSilently();
      const decodedToken = jwtDecode(token);
      
      setPermissions(decodedToken.permissions || []);
      console.log("User permissions:", decodedToken.permissions);

      const response = await fetch(
        "http://localhost:3001/api/incidents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      setIncidents(data);

      console.log("API response:", data);
    } catch (error) {
      console.error("API call failed:", error.message);
    }
  };

  // Close a security incident
  const closeIncident = async (id) => {
    try {
      setApiError("");
      const token = await getAccessTokenSilently();

      const response = await fetch(
        `http://localhost:3001/api/incidents/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Access denied: You don't have permission to close incidents."
          );
        }
        
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const updatedIncident = await response.json();

      setIncidents((currentIncidents) =>
      currentIncidents.map((incident) =>
      incident.id === updatedIncident.id
        ? updatedIncident
        : incident
  )
);

      console.log("Incident closed:", updatedIncident);
    } catch (error) {
      setApiError(error.message);
      console.error("Close incident failed:", error.message);
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Authentication Error: {error.message}</h2>;
  }

  return (
    <div className = "dashboard">
      <h1 className="dashboard-title">SecureOps Portal</h1>
      <p className="dashboard-subtitle">
        Security Operations Center
        </p>
        {isAuthenticated && apiError && (
          <div className="error-alert" role="alert">
            <strong>Security Alert:</strong> {apiError}
          </div>
        )}
      

      {isAuthenticated && (
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Incidents</p>
            <h2 className="stat-value">{totalIncidents}</h2>

          </div>
          <div className="stat-card">
            <p className="stat-label">Critical Incident</p>
            <h2 className="stat-value">{criticalIncidents}</h2> 
            
          </div>
          <div className="stat-card">
            <p className="stat-label">Closed Incidents</p>
            <h2 className="stat-value">{closedIncidents}</h2>
            </div>
          
                
      
        
        </div>
      )}
      {!isAuthenticated ? (
        <>
          <p>You are not authenticated.</p>

          <button onClick={() => loginWithRedirect()}>
            Log In
          </button>

          <button
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  screen_hint: "signup",
                },
              })
            }
          >
            Sign Up
          </button>
        </>
      ) : (
        <>
          <p>Authentication successful.</p>

          <h2>Welcome, {user?.name}</h2>
          <p>Email: {user?.email}</p>

          <h3>User Profile</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>

          <button onClick={loadIncidents}>
            Load Security Incidents
          </button>

          {incidents.length > 0 && (
            <div className="panel">
              <h3 className="panel-title">Security Incidents</h3>
            <div className="table-container">
            <table className="incident-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Incident</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>{incident.id}</td>
                    <td>{incident.title}</td>
                    <td>
                      <span
                      className={`severity-badge severity-${incident.severity}`}
                      >
                        {incident.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${incident.status}`}>
                        {incident.status}
                      </span>
                    </td>
                    <td>
                      {incident.status === "closed" ? (
                        <span style={{ color: "#22c55e"}}>
                          Closed ✓
                          </span>
                      ) : permissions.includes("close:incidents") ? (
                        <button
                        className="btn btn-danger"
                        onClick={() => closeIncident(incident.id)}
                        >
                          Close
                        </button>
                      ) : (
                        <span style={{color: "#94a3b8"}}>
                          View Only
                          </span>
                      )}
                          
                            
                          
                        
                      
                          
                          
                          
                          
                      
                        
                          
                        
                      


                    </td>

                      
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
         </div>
        )}

          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              })
            }
          >
            Log Out
          </button>
        </>
      )}
    </div>
  );
}

export default App;