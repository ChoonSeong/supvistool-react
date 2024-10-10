// Import React
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
// Import the Dashboard component
import Dashboard from "./pages/Dashboard"; // Ensure the path is correct
// Import the CSS file for styling
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MapTrack from "./components/MapTrack";
import LandingPage from "./pages/LandingPage";
import HeroSection from "./components/HeroSection";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}>
          <Route index element={<HeroSection />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="maptrack" replace />} />
          <Route path="maptrack" element={<MapTrack />} />
        </Route>
        <Route path={"/*"} element={<h1>404: Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
