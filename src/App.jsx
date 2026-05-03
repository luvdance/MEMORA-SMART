import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CVLanding from "./cv-builder/components/CVLanding";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import CVBuilder from "./pages/CVBuilder";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/cv-builder" element={<CVLanding />} />
      {/* Public shared CV link - no auth required to view/edit */}
      <Route path="/cv/:cvId" element={<CVBuilder />} />
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;