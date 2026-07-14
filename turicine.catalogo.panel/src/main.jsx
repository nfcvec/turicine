import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";
import { theme } from "./theme.js";
import { initKeycloak } from "./auth/keycloak.js";

const root = createRoot(document.getElementById("root"));

// Force SSO before rendering: login-required redirects to Keycloak on first load
// and only returns here once authenticated.
initKeycloak()
  .then(() => {
    root.render(
      <StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </StrictMode>,
    );
  })
  .catch((err) => {
    root.render(
      <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        No se pudo iniciar la autenticación: {String(err?.message ?? err)}
      </div>,
    );
  });
