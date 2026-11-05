import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import AcademyRoute from "./academy/components/AcademyRoute";
import PageLoader from "./components/PageLoader";
import lazyPage from "./utils/lazyPage";
import MemotifyLoader from "./memotify/Loader";
import SupportCenter from "./support/SupportCenter";

// Every page except Home loads on demand. This bundle used to carry the whole
// site, every Academy course included (11 MB of JavaScript), before the first
// pixel of any page. Home stays eager because it is the busiest entry point.
const CVLanding = lazyPage(() => import("./cv-builder/components/CVLanding"));
const AuthPage = lazyPage(() => import("./pages/AuthPage"));
const Dashboard = lazyPage(() => import("./pages/Dashboard"));
const CVBuilder = lazyPage(() => import("./pages/CVBuilder"));
const Pricing = lazyPage(() => import("./pages/Pricing"));
const Admin = lazyPage(() => import("./pages/Admin"));
const AdminCVEditor = lazyPage(() => import("./pages/admin/AdminCVEditor"));
const ATSChecker = lazyPage(() => import("./pages/ATSChecker"));
const DanielNwankwo = lazyPage(() => import("./pages/Daniel-nwankwo"));
const LeadMagnetExcel = lazyPage(() => import("./pages/LeadMagnetExcel"));
const LeadMagnetRemoteJobs = lazyPage(() => import("./pages/LeadMagnetRemoteJobs"));
const LeadMagnetAISideHustles = lazyPage(() => import("./pages/LeadMagnetAISideHustles"));
const LeadMagnetContentCreation = lazyPage(() => import("./pages/LeadMagnetContentCreation"));
const LeadMagnetComputerSkills = lazyPage(() => import("./pages/LeadMagnetComputerSkills"));
const Library = lazyPage(() => import("./pages/Library"));
const ProjectPilot = lazyPage(() => import("./project-formatter/PilotLandingPage"));
const AcademyLanding = lazyPage(() => import("./academy/pages/AcademyLanding"));
const AcademyCourses = lazyPage(() => import("./academy/pages/AcademyCourses"));
const AcademyEnroll = lazyPage(() => import("./academy/pages/AcademyEnroll"));
const AcademyEnrollChoose = lazyPage(() => import("./academy/pages/AcademyEnrollChoose"));
const AcademyLearn = lazyPage(() => import("./academy/pages/AcademyLearn"));
const AcademyProfile = lazyPage(() => import("./academy/pages/AcademyProfile"));
const LessonPlayer = lazyPage(() => import("./academy/pages/LessonPlayer"));
const FinalExam = lazyPage(() => import("./academy/pages/FinalExam"));
const TypingDojo = lazyPage(() => import("./academy/pages/TypingDojo"));
// Nobody on the CV Builder should pay for Memotify's bundle.
const MemotifyApp = lazyPage(() => import("./memotify/MemotifyApp"));

function App() {
  return (
    <>
    {/* Help launcher + support dialog for every app (openSupport() opens it). */}
    <SupportCenter />
    <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/cv-builder" element={<CVLanding />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/cv/:cvId" element={<AdminCVEditor />} />
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

      <Route
        path="/memotify/*"
        element={
          <Suspense fallback={<MemotifyLoader page label="Loading Memotify" />}>
            <MemotifyApp />
          </Suspense>
        }
      />

      {/* ── Memora Smart Academy ──
          Public landing, then everything behind AcademyRoute, which also
          guarantees a student record and Memora ID exist. */}
      <Route path="/academy" element={<AcademyLanding />} />
      <Route path="/academy/courses" element={<AcademyCourses />} />
      {/* The chooser. Declared BEFORE /academy/enroll/:slug so the bare
          path resolves here rather than being read as a slug. */}
      {/* Public on purpose: a visitor picks a course BEFORE being asked to
          create an account. Requiring sign-in here would put the signup wall
          in front of the choice, which is the flow this page replaced. */}
      <Route path="/academy/enroll" element={<AcademyEnrollChoose />} />
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
        path="/academy/exam"
        element={
          <AcademyRoute>
            <FinalExam />
          </AcademyRoute>
        }
      />
      {/* One certification exam per course. The bare path above stays the
          Data Analysis exam, so existing links keep working. */}
      <Route
        path="/academy/exam/:slug"
        element={
          <AcademyRoute>
            <FinalExam />
          </AcademyRoute>
        }
      />
      {/* The touch-typing tutor. A skill every course leans on, so it sits
          beside the courses rather than inside one. */}
      <Route
        path="/academy/typing"
        element={
          <AcademyRoute>
            <TypingDojo />
          </AcademyRoute>
        }
      />
      {/* Jobs moved to Memotify. Kept so that old links still land somewhere. */}
      <Route path="/academy/jobs" element={<Navigate to="/memotify/jobs" replace />} />
      <Route
        path="/academy/profile"
        element={
          <AcademyRoute>
            <AcademyProfile />
          </AcademyRoute>
        }
      />
    </Routes>
    </Suspense>
    </>
  );
}

export default App;