import { lazy } from "react";
import AppRoutes from "./AppRoutes";
import About from "./pages/About";
import Home from "./pages/Home";
import { loadBlueGuardian, loadNusIss, loadWildlight } from "./routeLoaders";

const Wildlight = lazy(loadWildlight);
const BlueGuardian = lazy(loadBlueGuardian);
const NusIss = lazy(loadNusIss);

export default function App() {
  return (
    <AppRoutes
      components={{
        Home,
        About,
        Wildlight,
        BlueGuardian,
        NusIss,
      }}
    />
  );
}
