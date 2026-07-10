import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import AppRoutes from "./AppRoutes";
import About from "./pages/About";
import Home from "./pages/Home";
import BlueGuardian from "./pages/projects/BlueGuardian";
import NusIss from "./pages/projects/NusIss";
import Wildlight from "./pages/projects/Wildlight";

export function render(url) {
  return renderToString(
    <StaticRouter location={url} basename="/christy26/">
      <AppRoutes
        components={{
          Home,
          About,
          Wildlight,
          BlueGuardian,
          NusIss,
        }}
      />
    </StaticRouter>,
  );
}
