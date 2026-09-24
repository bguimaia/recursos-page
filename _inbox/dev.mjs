// node dev.mjs — roda o Worker local com KV em memória, pra ver a página sem Cloudflare.
// Senha local: "dev".
import http from "node:http";
import worker from "./worker.js";

const PORT = 8788;
const kv = new Map();
const env = {
  PASSWORD: "dev", API_KEY: "dev-agent", SESSION_SECRET: "dev-secret",
  INBOX: {
    get: async (k) => kv.get(k) ?? null, put: async (k, v) => void kv.set(k, v), delete: async (k) => void kv.delete(k),
    list: async ({ prefix = "" } = {}) => ({ keys: [...kv.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })) }),
  },
};

http.createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const hasBody = !["GET", "HEAD"].includes(req.method);
  const out = await worker.fetch(new Request(`http://localhost:${PORT}${req.url}`, {
    method: req.method, headers: req.headers, body: hasBody ? Buffer.concat(chunks) : undefined,
  }), env);
  res.writeHead(out.status, Object.fromEntries(out.headers));
  res.end(Buffer.from(await out.arrayBuffer()));
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
