import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import AppRoutes from "./AppRoutes";
import About from "./pages/About";
import Home from "./pages/Home";
import BlueGuardian from "./pages/projects/BlueGuardian";
import NusIss from "./pages/projects/NusIss";
import Wildlight from "./pages/projects/Wildlight";

const basePath = (() => {
  const base = process.env.SITE_BASE || "/";
  if (!base || base === "/") {
    return "/";
  }

  return `/${base.replace(/^\/+|\/+$/g, "")}/`;
})();

export function render(url) {
  return renderToString(
    <StaticRouter location={url} basename={basePath}>
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
