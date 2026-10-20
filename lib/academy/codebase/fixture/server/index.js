import http from "node:http";
import { config, assertConfig } from "./config.js";
import { route } from "./router.js";

assertConfig();

const server = http.createServer((req, res) => {
  route(req, res).catch((err) => {
    console.error(`[error] ${req.method} ${req.url}: ${err.message}`);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  });
});

server.listen(config.port, () => {
  console.log(`Kobo Market API listening on http://localhost:${config.port}`);
});
