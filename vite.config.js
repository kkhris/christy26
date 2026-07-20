import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function normalizeBase(base) {
  if (!base || base === "/") {
    return "/";
  }

  return `/${base.replace(/^\/+|\/+$/g, "")}/`;
}

function trailingSlashRedirect() {
  const directoryRoutes = new Set([
    "/about",
    "/resume",
    "/projects/wildlight",
    "/projects/blue-guardian",
    "/projects/nus-iss",
  ]);

  return {
    name: "directory-trailing-slash-redirect",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && directoryRoutes.has(req.url)) {
          res.statusCode = 302;
          res.setHeader("Location", `${req.url}/`);
          res.end();
          return;
        }

        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && directoryRoutes.has(req.url)) {
          res.statusCode = 302;
          res.setHeader("Location", `${req.url}/`);
          res.end();
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  base: normalizeBase(process.env.SITE_BASE || "/"),
  appType: "spa",
  plugins: [react(), trailingSlashRedirect()],
});
