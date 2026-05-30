import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import GuestRoute from "../components/GuestRoute";
import AdminRoute from "../components/AdminRoute";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Projects from "../pages/Projects";
import Contact from "../pages/Contact";
import ProjectDetails from "../pages/ProjectDetails";
import Downloads from "../pages/Downloads";
import Templates from "../pages/Templates";
import Settings from "../pages/Settings";
import Billing from "../pages/Billing";
import Workspaces from "../pages/Workspaces";
import Marketplace from "../pages/Marketplace";
import Assistant from "../pages/Assistant";
import Analytics from "../pages/Analytics";
import Admin from "../pages/Admin";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route
      path="/login"
      element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      }
    />
    <Route
      path="/register"
      element={
        <GuestRoute>
          <Register />
        </GuestRoute>
      }
    />
    <Route path="/contact" element={<Contact />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/generate"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />
    <Route
      path="/projects"
      element={
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>
      }
    />
    <Route
      path="/project/:id"
      element={
        <ProtectedRoute>
          <ProjectDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="/downloads"
      element={
        <ProtectedRoute>
          <Downloads />
        </ProtectedRoute>
      }
    />
    <Route
      path="/templates"
      element={
        <ProtectedRoute>
          <Templates />
        </ProtectedRoute>
      }
    />
    <Route
      path="/workspaces"
      element={
        <ProtectedRoute>
          <Workspaces />
        </ProtectedRoute>
      }
    />
    <Route
      path="/marketplace"
      element={
        <ProtectedRoute>
          <Marketplace />
        </ProtectedRoute>
      }
    />
    <Route
      path="/assistant"
      element={
        <ProtectedRoute>
          <Assistant />
        </ProtectedRoute>
      }
    />
    <Route
      path="/analytics"
      element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <Admin />
        </AdminRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/billing"
      element={
        <ProtectedRoute>
          <Billing />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
