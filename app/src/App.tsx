import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

/**
 * App Router
 * Current Status: Frontend login page being built
 * 
 * Routes:
 *   /         → Home (main app, auth required via Home component)
 *   /login    → Login page
 *   *         → 404
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
