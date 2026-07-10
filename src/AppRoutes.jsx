import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RESUME_URL } from "./constants/site";
import AppShell from "./layouts/AppShell";

function ResumeRedirect() {
  if (typeof window !== "undefined") {
    window.location.replace(RESUME_URL);
  }

  return null;
}

function SuspendedRoute({ component: Component }) {
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
}

export default function AppRoutes({ components }) {
  const { Home, About, Wildlight, BlueGuardian, NusIss } = components;

  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="projects">
          <Route path="wildlight" element={<SuspendedRoute component={Wildlight} />} />
          <Route path="blue-guardian" element={<SuspendedRoute component={BlueGuardian} />} />
          <Route path="nus-iss" element={<SuspendedRoute component={NusIss} />} />
        </Route>
        <Route path="resume" element={<ResumeRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
