// node test.mjs — checagem mínima: helpers puros + as travas de acesso da API.
import assert from "node:assert/strict";
import worker, { youtubeId, urlKey, signSession, verifySession, sugKey, published, ipKey } from "./worker.js";

// helpers
assert.equal(youtubeId("https://www.youtube.com/watch?v=LLJ38OdS_q8"), "LLJ38OdS_q8");
assert.equal(youtubeId("https://youtu.be/LLJ38OdS_q8?t=10"), "LLJ38OdS_q8");
assert.equal(youtubeId("https://www.youtube.com/watch?list=x&v=LLJ38OdS_q8"), "LLJ38OdS_q8");
assert.equal(youtubeId("https://youtube.com/shorts/LLJ38OdS_q8"), "LLJ38OdS_q8");
assert.equal(youtubeId("https://vimeo.com/123"), null);
assert.equal(youtubeId("https://evil.test/youtube.com/watch?v=dQw4w9WgXcQ"), null, "host tem que ser YouTube");
assert.equal(youtubeId("https://m.youtube.com/watch?v=dQw4w9WgXcQ"), "dQw4w9WgXcQ");
assert.equal(urlKey("https://www.exemplo.com/artigo/"), "exemplo.com/artigo");
assert.equal(published('url: "https://artlist.io/x-2",', "https://artlist.io/x"), false, "publicado é comparação exata");
assert.equal(published('url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",', "https://youtu.be/dQw4w9WgXcQ"), true);
const ipReq = (ip) => new Request("https://x.test", { headers: { "cf-connecting-ip": ip } });
assert.equal(ipKey(ipReq("2001:db8::1:2:3:4")), ipKey(ipReq("2001:db8::9:2:3:4")), "IPv6 comprimido: mesmo /64");
assert.equal(ipKey(ipReq("2001:db8:0:0:1:2:3:4")), "2001:db8:0:0");
assert.equal(ipKey(ipReq("1.2.3.4")), "1.2.3.4");

const tok = await signSession("segredo", Date.now() + 1000);
assert.equal(await verifySession("segredo", tok), true);
assert.equal(await verifySession("outro", tok), false);
assert.equal(await verifySession("segredo", await signSession("segredo", Date.now() - 1)), false);
assert.equal(await verifySession("segredo", "9999999999999.forjado"), false);

// API
const kv = new Map();
const env = {
  PASSWORD: "frase longa de teste", API_KEY: "chave-agente", SESSION_SECRET: "s3",
  INBOX: {
    get: async (k) => kv.get(k) ?? null, put: async (k, v) => void kv.set(k, v), delete: async (k) => void kv.delete(k),
    list: async ({ prefix = "" } = {}) => ({ keys: [...kv.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })) }),
  },
};
globalThis.fetch = async (u) => {
  u = String(u);
  if (u.includes("/oembed")) return Response.json({ title: "Título do oEmbed" });
  if (u.includes("artigo.test")) return new Response("<html><head><title>\n Artigo &amp; Cia </title></head></html>", { headers: { "content-type": "text/html" } });
  return new Response("const RESOURCES = [\n  { url: \"https://www.youtube.com/watch?v=jaPublicado1\" },\n];");
};

const O = "https://inbox.test";
const call = (path, method = "GET", body, headers = {}) =>
  worker.fetch(new Request(O + path, {
    method, body: body ? JSON.stringify(body) : undefined,
    headers: { origin: O, "cf-connecting-ip": "1.1.1.1", ...headers },
  }), env);

assert.equal((await call("/api/items")).status, 401, "API fechada sem credencial");
assert.equal((await call("/qualquer")).status, 404);
const shell = await (await call("/")).text();
assert.ok(!shell.includes("__NONCE__") && shell.includes("Inbox Recursos"));

assert.equal((await call("/login", "POST", { password: "errada" })).status, 401);
assert.equal((await call("/login", "POST", { password: env.PASSWORD }, { origin: "https://evil.test" })).status, 403, "login exige mesma origem");
const ok = await call("/login", "POST", { password: env.PASSWORD });
assert.equal(ok.status, 200);
const cookie = ok.headers.get("set-cookie").split(";")[0];
assert.match(ok.headers.get("set-cookie"), /HttpOnly; Secure; SameSite=Lax/);

const owner = { cookie };
const agent = { authorization: "Bearer chave-agente", origin: "" };

// captura do Bruno
const made = await call("/api/items", "POST", { url: "https://youtu.be/LLJ38OdS_q8", note: "N", context: "resumo do Gemini" }, owner);
assert.equal(made.status, 201);
const item = await made.json();
assert.deepEqual([item.status, item.title, item.context], ["novo", "Título do oEmbed", "resumo do Gemini"]);
assert.equal((await call("/api/items", "POST", { url: "https://www.youtube.com/watch?v=LLJ38OdS_q8" }, owner)).status, 409, "duplicata no backlog");
assert.equal((await call("/api/items", "POST", { url: "https://youtu.be/jaPublicado1" }, owner)).status, 409, "duplicata no site");
assert.equal((await call("/api/items", "POST", { url: "javascript:alert(1)" }, owner)).status, 400);
assert.equal((await (await call("/api/items", "POST", { url: "https://artigo.test/x" }, owner)).json()).title, "Artigo & Cia");
assert.equal((await call("/api/items", "POST", { url: "https://a.com/b" }, { cookie, origin: "https://evil.test" })).status, 403, "CSRF");
assert.equal((await call("/api/items", "GET", null, { authorization: "Bearer errada" })).status, 401);

// status: dono tira da fila / reabre; chave do agente (sessão no Claude Code) publica
const S = (id, status, h) => call(`/api/items/${id}`, "PATCH", { status }, h);
assert.equal((await S(item.id, "publicado", owner)).status, 400, "página não publica");
assert.equal((await S(item.id, "rejeitado", owner)).status, 200, "tirar da fila");
assert.equal((await S(item.id, "novo", owner)).status, 200, "reabrir");
assert.equal((await S(item.id, "sugerido", agent)).status, 400, "ninguém volta pra sugerido");
const pubd = await (await S(item.id, "publicado", agent)).json();
assert.deepEqual([pubd.status, pubd.context, !!pubd.publishedAt], ["publicado", undefined, true], "publicado limpa o resumo");
assert.equal((await S(item.id, "novo", agent)).status, 409, "publicado é final");
assert.equal((await call(`/api/items/${item.id}/approve`, "POST", {}, owner)).status, 404, "aprovação pelo Worker não existe mais");
assert.equal((await call(`/api/items/${item.id}`, "PATCH", { title: "x", by: "@y" }, agent)).status, 409);

// indicação pública do site: sem login, só da origem do site, cai como "sugerido"
const SITE = "https://resources.bgmaia.com";
const sug = (body, headers = {}) => worker.fetch(new Request(O + "/api/suggest", {
  method: "POST", body: JSON.stringify(body), headers: { origin: SITE, "cf-connecting-ip": "3.3.3.3", ...headers },
}), env);
const itemsRaw = kv.get("items");
const s1 = await sug({ url: "https://youtu.be/indicado001", note: "olha o grade", by: "@fulano" });
assert.equal(s1.status, 201);
assert.equal(s1.headers.get("access-control-allow-origin"), SITE);
assert.equal(kv.get("items"), itemsRaw, "indicação não mexe na chave items (só na própria)");
assert.ok(kv.has(await sugKey("https://youtu.be/indicado001")), "indicação em sug:<hash>");
assert.equal((await (await sug({ url: "https://www.youtube.com/watch?v=indicado001" })).json()).known, true, "mesma URL antes da absorção não duplica");
const all = await (await call("/api/items", "GET", null, owner)).json();
const got = all.find((i) => i.url.includes("indicado001"));
assert.deepEqual([got.status, got.by, got.visitorNote, got.note, got.title, got.origin], ["sugerido", "@fulano", "olha o grade", "", "Título do oEmbed", "site"], "nota do visitante separada da do Bruno");
assert.ok(kv.has(await sugKey("https://youtu.be/indicado001")), "chave sug: fica até a triagem (não se perde se algo falhar)");
assert.equal((await (await call("/api/items", "GET", null, agent)).json()).filter((i) => i.url.includes("indicado001")).length, 1, "GET de novo não duplica; a sessão vê as indicações");
assert.equal((await sug({ url: "https://a.com/x" }, { origin: "https://evil.test" })).status, 403, "indicação só do site");
assert.equal((await sug({ url: "javascript:alert(1)" })).status, 400);
assert.equal((await (await sug({ url: "https://youtu.be/jaPublicado1" })).json()).published, true);
const before = (await (await call("/api/items", "GET", null, owner)).json()).length;
assert.equal((await sug({ url: "https://youtu.be/isca0000001", website: "http://spam" }, { "cf-connecting-ip": "4.4.4.4" })).status, 200);
assert.equal((await (await call("/api/items", "GET", null, owner)).json()).length, before, "campo-isca não grava");
for (let i = 0; i < 5; i++) await sug({ url: `https://youtu.be/limite00${i}0` }, { "cf-connecting-ip": "5.5.5.5" });
assert.equal((await sug({ url: "https://youtu.be/limite0090" }, { "cf-connecting-ip": "5.5.5.5" })).status, 429, "limite por IP");
assert.ok(kv.has("rl:5.5.5.5") && !kv.has("sug:5.5.5.5"), "contador em rl:, sem colidir com sug:");
// teto: com 100 esperando, a próxima nem gasta contador
for (let i = 0; i < 100; i++) kv.set("sug:fake" + i, JSON.stringify({ url: "https://x.test/" + i, status: "sugerido" }));
assert.equal((await sug({ url: "https://youtu.be/tetoCheio01" }, { "cf-connecting-ip": "6.6.6.6" })).status, 503, "teto de indicações");
assert.ok(!kv.has("rl:6.6.6.6"), "teto checado antes do contador");
for (let i = 0; i < 100; i++) kv.delete("sug:fake" + i);

// triagem na sessão: aceitar apaga a chave sug:; depois disso o formulário não revela o backlog
assert.equal((await S(got.id, "novo", agent)).status, 200, "sessão aceita indicação");
assert.ok(!kv.has(await sugKey("https://youtu.be/indicado001")), "triagem apaga a chave sug:");
assert.equal((await sug({ url: "https://youtu.be/indicado001" }, { "cf-connecting-ip": "8.8.8.8" })).status, 201, "item já triado: resposta igual à de indicação nova");
assert.ok(!kv.has(await sugKey("https://youtu.be/indicado001")), "e não grava nada");
// recusar indicação descarta nota e nome de quem indicou
await sug({ url: "https://youtu.be/recusada001", by: "@x", note: "y" }, { "cf-connecting-ip": "8.8.4.4" });
const rec = (await (await call("/api/items", "GET", null, agent)).json()).find((i) => i.url.includes("recusada001"));
const recd = await (await S(rec.id, "rejeitado", agent)).json();
assert.deepEqual([recd.status, recd.by, recd.visitorNote], ["rejeitado", undefined, undefined]);

// crédito herdado quando o Bruno captura um link que alguém já indicou
await sug({ url: "https://youtu.be/herdaCredit", by: "@alguem", note: "vale o som" }, { "cf-connecting-ip": "9.9.9.1" });
kv.set("items", JSON.stringify([...JSON.parse(kv.get("items")), { id: crypto.randomUUID(), url: "https://youtu.be/herdaCredit", status: "novo", note: "" }]));
const herd = (await (await call("/api/items", "GET", null, owner)).json()).filter((i) => i.url.includes("herdaCredit"));
assert.deepEqual([herd.length, herd[0].by, herd[0].visitorNote], [1, "@alguem", "vale o som"], "captura do Bruno herda crédito da indicação");
assert.ok(!kv.has(await sugKey("https://youtu.be/herdaCredit")), "já triado: chave some");

// limitador nativo (binding RL): segura rajada no formulário e no login
let hits = 0;
env.RL = { limit: async () => ({ success: ++hits <= 2 }) };
await sug({ url: "https://youtu.be/rajada00001" }, { "cf-connecting-ip": "7.7.7.7" });
await sug({ url: "https://youtu.be/rajada00002" }, { "cf-connecting-ip": "7.7.7.7" });
assert.equal((await sug({ url: "https://youtu.be/rajada00003" }, { "cf-connecting-ip": "7.7.7.7" })).status, 429, "RL no formulário");
assert.equal((await call("/login", "POST", { password: env.PASSWORD })).status, 429, "RL no login");
delete env.RL;

for (let i = 0; i < 5; i++) await call("/login", "POST", { password: "x" }, { "cf-connecting-ip": "2.2.2.2" });
assert.equal((await call("/login", "POST", { password: env.PASSWORD }, { "cf-connecting-ip": "2.2.2.2" })).status, 429, "bloqueio após 5 erros");

console.log("ok");
