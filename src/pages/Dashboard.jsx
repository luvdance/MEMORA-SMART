import { Routes, Route } from "react-router-dom";
import Overview from "./dashboard/Overview";
import Profile from "./dashboard/Profile";
import CVBuilder from "./CVBuilder";
import DashboardLayout from "../components/DashboardLayout";
import MyWorks from "./dashboard/MyWorks";



function ComingSoon({ name }) {
  return (
    <DashboardLayout title={name} subtitle="This app is coming soon">
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🚀</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px" }}>{name} is Coming Soon</h2>
        <p style={{ color: "#888" }}>We're working hard on this. Check back soon!</p>
      </div>
    </DashboardLayout>
  );
}

export default function Dashboard() {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="my-works" element={<MyWorks />} />
      <Route path="profile" element={<Profile />} />
      <Route path="cv-builder" element={<CVBuilder />} />
      <Route path="web-builder" element={<ComingSoon name="Website Builder" />} />
      <Route path="app-builder" element={<ComingSoon name="Mobile App Builder" />} />
      <Route path="data-analysis" element={<ComingSoon name="Data Analysis" />} />
      <Route path="ai-automation" element={<ComingSoon name="AI Automation" />} />
      <Route path="settings" element={<ComingSoon name="Settings" />} />
    </Routes>
  );
}