import { createServer } from "node:http";
import { handler } from "./router.js";
import { loadEnv } from "vite";
Object.assign(process.env, loadEnv("development", process.cwd(), ""));
process.env.APP_ORIGIN ||= "http://127.0.0.1:8080";
createServer(handler).listen(8081, "127.0.0.1", () =>
  console.log(
    "MekWeb API: http://127.0.0.1:8081 (real integrations only; no demo data)",
  ),
);
