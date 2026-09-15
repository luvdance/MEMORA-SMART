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
import AcademyLanding from "./academy/pages/AcademyLanding";
import AcademyCourses from "./academy/pages/AcademyCourses";
import AcademyEnroll from "./academy/pages/AcademyEnroll";
import AcademyJobs from "./academy/pages/AcademyJobs";
import AcademyLearn from "./academy/pages/AcademyLearn";
import AcademyProfile from "./academy/pages/AcademyProfile";
import LessonPlayer from "./academy/pages/LessonPlayer";
import AcademyRoute from "./academy/components/AcademyRoute";

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

      {/* ── Memora Smart Academy ──
          Public landing, then everything behind AcademyRoute, which also
          guarantees a student record and Memora ID exist. */}
      <Route path="/academy" element={<AcademyLanding />} />
      <Route path="/academy/courses" element={<AcademyCourses />} />
      <Route
        path="/academy/enroll/:slug"
        element={
          <AcademyRoute>
            <AcademyEnroll />
          </AcademyRoute>
        }
      />
      <Route
        path="/academy/learn"
        element={
          <AcademyRoute>
            <AcademyLearn />
          </AcademyRoute>
        }
      />
      <Route
        path="/academy/learn/:slug/:lessonId"
        element={
          <AcademyRoute>
            <LessonPlayer />
          </AcademyRoute>
        }
      />
      <Route
        path="/academy/jobs"
        element={
          <AcademyRoute>
            <AcademyJobs />
          </AcademyRoute>
        }
      />
      <Route
        path="/academy/profile"
        element={
          <AcademyRoute>
            <AcademyProfile />
          </AcademyRoute>
        }
      />
    </Routes>
  );
}

export default App;