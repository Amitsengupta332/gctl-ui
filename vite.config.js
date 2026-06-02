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
  return {
    name: "details-rewrite",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        if (req.url.startsWith("/project-details/")) {
          req.url = "/project-details.html";
        }

        if (
          req.url.startsWith("/product-details/") ||
          req.url.startsWith("/product-details.html/")
        ) {
          req.url = "/product-details.html";
        }

        next();
      });
    },

    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        if (req.url.startsWith("/project-details/")) {
          req.url = "/project-details.html";
        }

        if (
          req.url.startsWith("/product-details/") ||
          req.url.startsWith("/product-details.html/")
        ) {
          req.url = "/product-details.html";
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), detailsRewrite()],

  build: {
    rollupOptions: {
      input: getRootHtmlInputs(),
    },
  },
});