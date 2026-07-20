import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const serverEntryPath = path.join(distDir, "server/entry-prerender.js");
const templatePath = path.join(distDir, "index.html");
const basePath = (() => {
  const base = process.env.SITE_BASE || "/";
  if (!base || base === "/") {
    return "";
  }

  return `/${base.replace(/^\/+|\/+$/g, "")}`;
})();

const routes = [
  { url: `${basePath}/`, output: "index.html" },
  { url: `${basePath}/about`, output: "about/index.html" },
  { url: `${basePath}/resume`, output: "resume/index.html" },
  { url: `${basePath}/projects/wildlight`, output: "projects/wildlight/index.html" },
  { url: `${basePath}/projects/blue-guardian`, output: "projects/blue-guardian/index.html" },
  { url: `${basePath}/projects/nus-iss`, output: "projects/nus-iss/index.html" },
];

const { render } = await import(pathToFileURL(serverEntryPath).href);
const template = await fs.readFile(templatePath, "utf8");

for (const route of routes) {
  const appHtml = render(route.url);
  const html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  const outputPath = path.join(distDir, route.output);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, html, "utf8");
}
