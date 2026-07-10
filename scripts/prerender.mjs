import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const serverEntryPath = path.join(distDir, "server/entry-prerender.js");
const templatePath = path.join(distDir, "index.html");

const routes = [
  { url: "/", output: "index.html" },
  { url: "/about", output: "about/index.html" },
  { url: "/resume", output: "resume/index.html" },
  { url: "/projects/wildlight", output: "projects/wildlight/index.html" },
  { url: "/projects/blue-guardian", output: "projects/blue-guardian/index.html" },
  { url: "/projects/nus-iss", output: "projects/nus-iss/index.html" },
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
