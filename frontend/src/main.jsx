import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Downloads from "./pages/Downloads";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>

    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/contact" element={<Contact />} />

      <Route path="/downloads" element={<Downloads />} />

      <Route path="/templates" element={<Templates />} />

      <Route path="/settings" element={<Settings />} />

    </Routes>

  </BrowserRouter>
);