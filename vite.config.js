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

function shouldRewriteToHtml(req) {
  const accept = req.headers.accept || "";
  return req.method === "GET" && accept.includes("text/html");
}

// function detailsRewrite() {
//   return {
//     name: "details-rewrite",

//     configureServer(server) {
//       server.middlewares.use((req, res, next) => {
//         if (!req.url || !shouldRewriteToHtml(req)) return next();

//         const pathname = req.url.split("?")[0];

//         if (pathname.startsWith("/project-details/")) {
//           req.url = "/project-details.html";
//         }

//         if (pathname.startsWith("/product-details/")) {
//           req.url = "/product-details.html";
//         }

//         next();
//       });
//     },

//     configurePreviewServer(server) {
//       server.middlewares.use((req, res, next) => {
//         if (!req.url || !shouldRewriteToHtml(req)) return next();

//         const pathname = req.url.split("?")[0];

//         if (pathname.startsWith("/project-details/")) {
//           req.url = "/project-details.html";
//         }

//         if (pathname.startsWith("/product-details/")) {
//           req.url = "/product-details.html";
//         }

//         next();
//       });
//     },
//   };
// }

function detailsRewrite() {
  function rewriteDetailsUrl(req, res, next) {
    if (!req.url || !shouldRewriteToHtml(req)) return next();

    const cleanUrl = req.url.split("?")[0];

    if (/^\/project-details\/[^/]+\/?$/.test(cleanUrl)) {
      req.url = "/project-details.html";
      return next();
    }

    if (/^\/product-details\/[^/]+\/?$/.test(cleanUrl)) {
      req.url = "/product-details.html";
      return next();
    }

    if (/^\/product-details\.html\/[^/]+\/?$/.test(cleanUrl)) {
      req.url = "/product-details.html";
      return next();
    }

    next();
  }

  return {
    name: "details-rewrite",

    configureServer(server) {
      server.middlewares.use(rewriteDetailsUrl);
    },

    configurePreviewServer(server) {
      server.middlewares.use(rewriteDetailsUrl);
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