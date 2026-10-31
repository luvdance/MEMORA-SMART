import { Navigate, Route, Routes } from "react-router-dom";
import { MeProvider } from "./Shell";
import Landing from "./pages/Landing";
import Jobs from "./pages/Jobs";
import Passport from "./pages/Passport";
import Check from "./pages/Check";
import Tracker from "./pages/Tracker";
import PublicPassport from "./pages/PublicPassport";
import Hire, { HireJob, HirePost, HireTalent } from "./pages/Hire";

/**
 * Memotify's routes, under /memotify/* in App.jsx. Lazy-loaded from there, so
 * a CV Builder visitor on mobile data never downloads any of this.
 */
export default function MemotifyApp() {
  return (
    <MeProvider>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<Jobs />} />
        <Route path="passport" element={<Passport />} />
        <Route path="check/:skill" element={<Check />} />
        <Route path="tracker" element={<Tracker />} />
        <Route path="p/:id" element={<PublicPassport />} />
        <Route path="hire" element={<Hire />} />
        <Route path="hire/post" element={<HirePost />} />
        <Route path="hire/job/:id" element={<HireJob />} />
        <Route path="hire/talent" element={<HireTalent />} />
        <Route path="*" element={<Navigate to="/memotify" replace />} />
      </Routes>
    </MeProvider>
  );
}
