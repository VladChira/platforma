// Server de test pentru artifactul Pages: fișiere statice, fără fallback SPA.
const http = require("node:http");
const path = require("node:path");
const handler = require("serve-handler");
const publicDirectory = path.resolve(__dirname, "../dist-pages");
http
  .createServer((request, response) => {
    const pathname = new URL(request.url, "http://localhost").pathname;
    if (!pathname.startsWith("/platforma/")) {
      response.writeHead(404);
      response.end();
      return;
    }
    request.url = request.url.slice("/platforma".length);
    handler(request, response, {
      public: publicDirectory,
      cleanUrls: false,
      directoryListing: false,
      rewrites: [{ source: "/", destination: "/index.html" }],
    });
  })
  .listen(5174, "127.0.0.1");
