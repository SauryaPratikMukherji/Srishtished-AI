import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
import path from "path";

function injectEmittedCssPlugin() {
  return {
    name: "inject-emitted-css",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const assetsDir = path.resolve(distDir, "assets");
      const indexPath = path.resolve(distDir, "index.html");
      if (!fs.existsSync(indexPath) || !fs.existsSync(assetsDir)) return;

      const files = fs.readdirSync(assetsDir);
      const cssFiles = files.filter((f) => f.endsWith(".css"));

      let html = fs.readFileSync(indexPath, "utf8");
      cssFiles.forEach((cssFile) => {
        if (!html.includes(cssFile)) {
          const linkTag = `<link rel="stylesheet" crossorigin href="/assets/${cssFile}">`;
          html = html.replace("</head>", `  ${linkTag}\n  </head>`);
        }
      });
      fs.writeFileSync(indexPath, html);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), injectEmittedCssPlugin()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
