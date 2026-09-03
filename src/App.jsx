import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CVLanding from "./cv-builder/components/CVLanding";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import CVBuilder from "./pages/CVBuilder";
import ProtectedRoute from "./components/ProtectedRoute";
import Pricing from "./pages/Pricing";
import Admin from "./pages/Admin";
import ATSChecker from "./pages/ATSChecker";
import DanielNwankwo from "./pages/Daniel-nwankwo";
import LeadMagnetExcel from "./pages/LeadMagnetExcel";
import LeadMagnetRemoteJobs from "./pages/LeadMagnetRemoteJobs";
import LeadMagnetAISideHustles from "./pages/LeadMagnetAISideHustles";
import LeadMagnetContentCreation from "./pages/LeadMagnetContentCreation";
import LeadMagnetComputerSkills from "./pages/LeadMagnetComputerSkills";
import Library from "./pages/Library";
import ProjectPilot from "./project-formatter/PilotLandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/cv-builder" element={<CVLanding />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/admin" element={<Admin />} />
      {/* Public shared CV link - no auth required to view/edit */}
      <Route path="/cv/:cvId" element={<CVBuilder />} />
      <Route path="/ats-check" element={<ATSChecker />} />
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/daniel-nwankwo" element={<DanielNwankwo />} />
      <Route path="/excel-masterclass" element={<LeadMagnetExcel />} />
      <Route path="/remote-jobs-guide" element={<LeadMagnetRemoteJobs />} />
      <Route path="/ai-side-hustles" element={<LeadMagnetAISideHustles />} />
      <Route path="/content-creation" element={<LeadMagnetContentCreation />} />
      <Route path="/digital-skills" element={<LeadMagnetComputerSkills />} />
      <Route path="/library" element={<Library />} />
      <Route path="/projectpilot" element={<ProjectPilot />} />
    </Routes>
  );
}

export default App;