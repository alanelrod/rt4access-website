import http from "node:http";
import { Pool } from "pg";

const PORT = Number(process.env.PORT || 8080);
const ORIGINS = new Set([
  "https://rt4access.com",
  "https://www.rt4access.com",
  "http://127.0.0.1:8754",
  "http://localhost:8754",
]);
const PLANS = new Set(["free", "pro", "teams", "frontier", "frontier-plus", "enterprise", "strategic", "starter", "growth", "scale"]);
const COMPANIES = ["anduril", "anthropic", "mistral", "openai", "palantir", "xai"];
const COMPANY_SET = new Set(COMPANIES);
const hits = new Map();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && !/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL)
    ? { rejectUnauthorized: false }
    : undefined,
  max: 4,
});

function clip(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function allowedOrigin(origin) {
  return ORIGINS.has(origin) ? origin : "";
}

function send(res, status, body, origin) {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  };
  if (origin) {
    headers["access-control-allow-origin"] = origin;
    headers.vary = "Origin";
  }
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 8) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 12000) {
        reject(Object.assign(new Error("too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        reject(Object.assign(new Error("bad json"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function requestFrom(body) {
  const name = clip(body.name, 120);
  const email = clip(body.email, 160).toLowerCase();
  const organization = clip(body.organization, 160);
  const plan = clip(body.plan, 32);
  const other = clip(body.other_companies, 400);
  const companies = Array.isArray(body.companies)
    ? [...new Set(body.companies.map((item) => clip(item, 32)).filter((item) => COMPANY_SET.has(item)))]
    : [];
  if (clip(body.website, 200)) return { error: "Could not save that request." };
  if (name.length < 2) return { error: "Add your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Add a valid email." };
  if (organization.length < 2) return { error: "Add your organization." };
  if (!PLANS.has(plan)) return { error: "Choose an RT4Access plan." };
  if (!companies.length && other.length < 2) return { error: "Choose the companies for this pilot." };
  return { name, email, organization, plan, companies, other };
}

async function ready() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pilot_requests (
      id bigserial PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      name text NOT NULL,
      email text NOT NULL,
      organization text NOT NULL,
      plan text NOT NULL,
      companies text[] NOT NULL,
      other_companies text NOT NULL DEFAULT ''
    )
  `);
}

const server = http.createServer(async (req, res) => {
  const origin = allowedOrigin(req.headers.origin || "");
  const url = new URL(req.url || "/", "http://localhost");
  if (req.method === "OPTIONS" && url.pathname === "/pilots") {
    res.writeHead(204, {
      "access-control-allow-origin": origin || "https://rt4access.com",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400",
      vary: "Origin",
    });
    res.end();
    return;
  }
  if (req.method === "GET" && url.pathname === "/health") {
    send(res, 200, { ok: true }, origin);
    return;
  }
  if (req.method !== "POST" || url.pathname !== "/pilots") {
    send(res, 404, { error: "Not found." }, origin);
    return;
  }
  if (!origin) {
    send(res, 403, { error: "Could not save that request." }, "");
    return;
  }
  const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").split(",")[0].trim();
  if (limited(ip)) {
    send(res, 429, { error: "Too many requests. Try again in a few minutes." }, origin);
    return;
  }
  try {
    const parsed = requestFrom(await readBody(req));
    if (parsed.error) {
      send(res, 400, { error: parsed.error }, origin);
      return;
    }
    await pool.query(
      `INSERT INTO pilot_requests (name, email, organization, plan, companies, other_companies)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [parsed.name, parsed.email, parsed.organization, parsed.plan, parsed.companies, parsed.other]
    );
    send(res, 201, { ok: true }, origin);
  } catch (error) {
    const status = error.status || 500;
    send(res, status, { error: status === 500 ? "Could not save that request." : "Could not save that request." }, origin);
  }
});

ready()
  .then(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`pilot api listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("pilot api failed to start");
    console.error(error instanceof Error ? error.message : "unknown error");
    process.exit(1);
  });
