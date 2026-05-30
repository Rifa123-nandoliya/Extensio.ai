import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WorkspaceProvider } from "./context/WorkspaceContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <WorkspaceProvider>
          <AppRoutes />
          <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            className: "font-sans",
          }}
          />
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
