import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-msbksew370561l5b.us.auth0.com"
      clientId="mySAFf9iw4b077bbYjT78uBiqNd4Tg8h"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://secureops-api",
        scope: "openid profile email read:incidents",
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
);