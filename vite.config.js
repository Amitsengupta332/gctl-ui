import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { readdirSync } from "fs";

function getRootHtmlInputs() {
  const root = process.cwd();

  return readdirSync(root)
    .filter((file) => file.endsWith(".html"))
    .reduce((inputs, file) => {
      const name = file.replace(".html", "");
      inputs[name] = resolve(root, file);
      return inputs;
    }, {});
}

function detailsRewrite() {
  function rewrite(req, res, next) {
    if (!req.url) return next();

    const pathname = req.url.split("?")[0];

    if (pathname.startsWith("/product-details/")) {
      req.url = "/product-details.html";
    }

    if (pathname.startsWith("/project-details/")) {
      req.url = "/project-details.html";
    }

    next();
  }

  return {
    name: "details-rewrite",
    enforce: "pre",

    configureServer(server) {
      server.middlewares.use(rewrite);
    },

    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

export default defineConfig({
  appType: "mpa",

  plugins: [tailwindcss(), detailsRewrite()],

  build: {
    rollupOptions: {
      input: getRootHtmlInputs(),
    },
  },
});