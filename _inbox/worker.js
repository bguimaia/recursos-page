// Inbox Recursos — Worker único: página + API. Spec: ../docs/inbox-spec.md
// Binding KV: INBOX. Secrets: PASSWORD, API_KEY, SESSION_SECRET.
// Só captura e fila. Rascunho, triagem e publicação: sessão do Claude Code ("revisa o inbox"), via agent.py
// com a chave do agente; o commit no resources.js é local. O Worker não tem permissão de escrita no repo.
import PAGE from "./page.js";

const SITE_JS = "https://resources.bgmaia.com/resources.js";
const CATS = ["referencias", "tutoriais", "processo", "mindset"];
const YEAR = 31536000;
const MAX_FAILS = 5;
const LOCK_SECONDS = 900;
const MAX_CONTEXT = 30000; // resumo do Gemini ou transcript inteiro colado na captura
// Formulário "Indique" do site. localhost:3456 = protótipo rodando local.
const SITE_ORIGINS = ["https://resources.bgmaia.com", "http://localhost:3456"];
const SUGGEST_PER_HOUR = 5;   // por IP
const MAX_SUGGESTED = 100;    // teto de indicações esperando triagem: spam não enche o KV

// ── helpers puros (testados em test.mjs) ─────────────────────

const enc = new TextEncoder();

async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Compara os HMACs, não as strings: o tempo não revela onde elas divergem.
async function safeEqual(secret, a, b) {
  const [x, y] = await Promise.all([hmac(secret, String(a)), hmac(secret, String(b))]);
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return d === 0;
}

export async function signSession(secret, exp) {
  return `${exp}.${await hmac(secret, "s:" + exp)}`;
}

export async function verifySession(secret, token, now = Date.now()) {
  const [exp, sig] = String(token || "").split(".");
  if (!exp || !sig || !(Number(exp) > now)) return false;
  return safeEqual(secret, sig, await hmac(secret, "s:" + exp));
}

export function youtubeId(url) {
  let host;
  try { host = new URL(String(url)).hostname; } catch { return null; }
  if (!/(^|\.)youtube\.com$|^youtu\.be$/.test(host)) return null; // evil.test/youtube.com/watch?v=... não é YouTube
  const m = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

// Chave de duplicata: id do vídeo no YouTube, senão a URL sem protocolo, www e barra final.
export const urlKey = (url) =>
  youtubeId(url) || String(url).trim().replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// Publicado = alguma entrada `url: "..."` do resources.js tem a mesma urlKey. Comparação exata:
// substring marcaria "artlist.io/x" como publicado só porque existe "artlist.io/x-2".
export const published = (src, url) =>
  [...String(src).matchAll(/url:\s*"([^"]+)"/g)].some((m) => urlKey(m[1]) === urlKey(url));

// Chave por pessoa pros limites: IPv4 inteiro, IPv6 pelo bloco /64 (uma conexão tem o /64 todo pra trocar de endereço).
export function ipKey(req) {
  const raw = req.headers.get("cf-connecting-ip") || "?";
  if (!raw.includes(":")) return raw;
  const [a, b = ""] = raw.split("::");
  const A = a ? a.split(":") : [], B = b ? b.split(":") : [];
  return (raw.includes("::") ? [...A, ...Array(8 - A.length - B.length).fill("0"), ...B] : A).slice(0, 4).join(":");
}

// Limitador nativo da Cloudflare (binding RL no wrangler.toml): atômico, segura rajada em paralelo
// que o contador no KV (ler e depois gravar) deixa passar. Sem o binding (teste, dev), não limita.
const limited = async (env, key) => (env.RL ? !(await env.RL.limit({ key })).success : false);

// Chave KV de uma indicação: sug:<sha-256 da urlKey>. Mesma URL = mesma chave, então repetição não duplica.
export async function sugKey(url) {
  const h = await crypto.subtle.digest("SHA-256", enc.encode(urlKey(url)));
  return "sug:" + [...new Uint8Array(h)].slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── infra ────────────────────────────────────────────────────

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

const clean = (v, max) => String(v ?? "").trim().slice(0, max);

// ponytail: backlog inteiro numa chave KV. Aguenta centenas de itens e um usuário só;
// se crescer ou tiver escrita concorrente de verdade, migrar pra D1.
const load = async (env) => JSON.parse((await env.INBOX.get("items")) || "[]");
const save = (env, items) => env.INBOX.put("items", JSON.stringify(items));

function secure(res) {
  const h = new Headers(res.headers);
  if (!h.has("content-security-policy")) h.set("content-security-policy", "default-src 'none'; frame-ancestors 'none'");
  h.set("x-robots-tag", "noindex, nofollow");
  h.set("referrer-policy", "no-referrer");
  h.set("x-content-type-options", "nosniff");
  h.set("cache-control", "no-store");
  h.set("strict-transport-security", "max-age=31536000");
  return new Response(res.body, { status: res.status, headers: h });
}

function page() {
  const nonce = crypto.randomUUID().replaceAll("-", "");
  const csp =
    `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; img-src https://i.ytimg.com; ` +
    `connect-src 'self'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'`;
  return new Response(PAGE.replaceAll("__NONCE__", nonce), {
    headers: { "content-type": "text/html; charset=utf-8", "content-security-policy": csp },
  });
}

async function auth(req, env) {
  const bearer = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
  if (bearer && (await safeEqual(env.SESSION_SECRET, bearer, env.API_KEY))) return "agent";
  const c = (req.headers.get("cookie") || "").match(/(?:^|; )s=([^;]+)/);
  if (c && (await verifySession(env.SESSION_SECRET, c[1]))) return "owner";
  return null;
}

async function login(req, env) {
  const ip = ipKey(req);
  if (await limited(env, "login:" + ip)) return json({ error: "muitas tentativas, espera um minuto" }, 429);
  const failKey = "fail:" + ip;
  const fails = Number(await env.INBOX.get(failKey)) || 0;
  if (fails >= MAX_FAILS) return json({ error: "muitas tentativas, espera 15 min" }, 429);

  const body = await req.json().catch(() => null);
  if (!body || !(await safeEqual(env.SESSION_SECRET, body.password ?? "", env.PASSWORD))) {
    // ponytail: KV é eventualmente consistente, o contador pode deixar passar 1-2 a mais. Senha longa cobre.
    await env.INBOX.put(failKey, String(fails + 1), { expirationTtl: LOCK_SECONDS });
    return json({ error: "senha errada" }, 401);
  }
  const token = await signSession(env.SESSION_SECRET, Date.now() + YEAR * 1000);
  const res = json({ ok: true });
  res.headers.set("set-cookie", `s=${token}; Max-Age=${YEAR}; Path=/; HttpOnly; Secure; SameSite=Lax`);
  return res;
}

// ── API ──────────────────────────────────────────────────────

// Única edição que sobrou: o status. Dono (página): tirar da fila ou reabrir. Chave do agente
// (sessão do Claude Code com o Bruno): aceitar indicação, marcar publicado, recusar.
function applyStatus(it, b, who) {
  const allowed = who === "owner" ? ["novo", "rejeitado"] : ["novo", "publicado", "rejeitado"];
  if (!allowed.includes(b.status)) return "status não permitido";
  it.status = b.status;
  if (it.status === "publicado") { it.publishedAt = new Date().toISOString(); delete it.context; } // resumo já cumpriu o papel
  return null;
}

// Título em branco na captura (colou só o link): YouTube via oEmbed, resto via <title> da página.
// Qualquer falha devolve "" e o título sai do rascunho na sessão "revisa o inbox".
async function fetchTitle(url) {
  try {
    const opt = { signal: AbortSignal.timeout(4000), headers: { "user-agent": "Mozilla/5.0 (recursos-inbox)" } };
    if (youtubeId(url)) {
      const r = await fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(url), opt);
      return r.ok ? clean((await r.json()).title, 300) : "";
    }
    const r = await fetch(url, opt);
    if (!r.ok || !(r.headers.get("content-type") || "").includes("html")) return "";
    const m = (await r.text()).slice(0, 200000).match(/<title[^>]*>([^<]*)<\/title>/i);
    // ponytail: só as entidades comuns; título com entidade exótica sai cru e é editável na revisão
    const ents = { "&amp;": "&", "&quot;": '"', "&#39;": "'", "&#x27;": "'", "&lt;": "<", "&gt;": ">", "&nbsp;": " " };
    return m ? clean(m[1].replace(/&(amp|quot|#39|#x27|lt|gt|nbsp);/g, (e) => ents[e]).replace(/\s+/g, " "), 300) : "";
  } catch {
    return "";
  }
}

async function createItem(req, env) {
  const b = (await req.json().catch(() => null)) || {};
  const url = clean(b.url, 2000);
  let parsed;
  try { parsed = new URL(url); } catch {}
  if (!parsed || !/^https?:$/.test(parsed.protocol)) return json({ error: "URL inválida" }, 400);

  const key = urlKey(url);
  const items = await load(env);
  const dup = items.find((i) => urlKey(i.url) === key);
  if (dup) return json({ error: `já está no backlog (${dup.status})` }, 409);
  const site = await fetch(SITE_JS).then((r) => (r.ok ? r.text() : "")).catch(() => "");
  if (published(site, url)) return json({ error: "já está publicado no site" }, 409);

  const item = {
    id: crypto.randomUUID(), url, title: clean(b.title, 300) || (await fetchTitle(url)), note: clean(b.note, 2000), context: clean(b.context, MAX_CONTEXT),
    cat: CATS.includes(b.cat) ? b.cat : "", tags: [], description: "",
    status: "novo", createdAt: new Date().toISOString(),
  };
  items.push(item);
  await save(env, items);
  return json(item, 201);
}

// Indicação pública do formulário do site. Sem login: a defesa é campo-isca + limite por IP + teto de pendentes.
// Entra como "sugerido" e fica até a triagem na sessão "revisa o inbox" (aceitar = "novo", recusar = "rejeitado").
async function suggest(req, env) {
  const origin = req.headers.get("origin") || "";
  if (!SITE_ORIGINS.includes(origin)) return json({ error: "origem inválida" }, 403);
  const reply = (data, status = 200) => {
    const r = json(data, status);
    r.headers.set("access-control-allow-origin", origin);
    r.headers.set("vary", "origin");
    return r;
  };
  const ip = ipKey(req);
  if (await limited(env, "sug:" + ip)) return reply({ error: "muitas indicações seguidas, tenta de novo daqui a pouco" }, 429);
  if (Number(req.headers.get("content-length") || 0) > 8000) return reply({ error: "texto grande demais" }, 413);
  // o site manda text/plain (request simples, sem preflight de CORS); o corpo é JSON
  const text = await req.text();
  if (text.length > 8000) return reply({ error: "texto grande demais" }, 413); // corpo sem content-length
  let b = null;
  try { b = JSON.parse(text); } catch {}
  if (!b || typeof b !== "object") return reply({ error: "pedido inválido" }, 400);
  if (b.website) return reply({ ok: true }); // campo-isca invisível preenchido = bot; finge que deu certo

  const url = clean(b.url, 2000);
  let parsed;
  try { parsed = new URL(url); } catch {}
  if (!parsed || !/^https?:$/.test(parsed.protocol)) return reply({ error: "link inválido" }, 400);

  // contador por hora lido antes de qualquer list/fetch: quem estourou não gasta cota do KV
  const rlKey = "rl:" + ip;
  const sent = Number(await env.INBOX.get(rlKey)) || 0;
  if (sent >= SUGGEST_PER_HOUR) return reply({ error: "muitas indicações seguidas, tenta de novo daqui a pouco" }, 429);

  // Cada indicação vai numa chave própria (sug:<hash>) e fica lá até a triagem. A chave "items" só o Bruno
  // e o agente gravam, então uma indicação chegando nunca sobrescreve uma edição dele.
  const key = urlKey(url);
  const sk = await sugKey(url);
  const items = await load(env);
  const inBacklog = items.find((i) => urlKey(i.url) === key);
  if ((await env.INBOX.get(sk)) || inBacklog?.status === "sugerido") return reply({ ok: true, known: true });
  // no backlog com outro status (fila, rascunho, recusado): mesma resposta de indicação nova, sem revelar o backlog
  if (inBacklog) return reply({ ok: true }, 201);
  const site = await fetch(SITE_JS).then((r) => (r.ok ? r.text() : "")).catch(() => "");
  if (published(site, url)) return reply({ ok: true, published: true });
  // teto antes de gravar: com a caixa cheia, nem gasta escrita de KV
  if ((await env.INBOX.list({ prefix: "sug:" })).keys.length >= MAX_SUGGESTED) return reply({ error: "caixa de indicações cheia, tenta de novo em alguns dias" }, 503);
  await env.INBOX.put(rlKey, String(sent + 1), { expirationTtl: 3600 });

  await env.INBOX.put(sk, JSON.stringify({
    id: crypto.randomUUID(), url,
    title: youtubeId(url) ? await fetchTitle(url) : "", // só oEmbed: não busca página arbitrária a pedido de anônimo
    // visitorNote, não note: "note" é do Bruno e vai pro agente como instrução dele
    visitorNote: clean(b.note, 1000), note: "", by: clean(b.by, 60), origin: "site", context: "",
    cat: "", tags: [], description: "", status: "sugerido", createdAt: new Date().toISOString(),
  }));
  return reply({ ok: true }, 201);
}

// Traz as indicações (chaves sug:*) pra dentro de "items". A chave só some quando o item já foi triado
// (o PATCH apaga na hora); se algo falhar no meio, a indicação volta no próximo GET em vez de se perder.
// Só roda com credencial (Bruno ou agente). Best-effort: se o KV falhar, a lista abre mesmo assim.
async function absorbSuggestions(env) {
  try {
    const { keys } = await env.INBOX.list({ prefix: "sug:" });
    if (!keys.length) return load(env);
    // lê as indicações ANTES de carregar "items": a janela entre ler e gravar fica do tamanho de um PATCH
    const sugs = await Promise.all(keys.slice(0, 300).map(async ({ name }) => [name, JSON.parse((await env.INBOX.get(name)) || "null")]));
    const items = await load(env);
    const byKey = new Map(items.map((i) => [urlKey(i.url), i]));
    let changed = false;
    const triaged = [];
    for (const [name, s] of sugs) {
      if (!s) continue;
      const ex = byKey.get(urlKey(s.url));
      if (!ex) { items.push(s); byKey.set(urlKey(s.url), s); changed = true; continue; }
      // o Bruno capturou o mesmo link por conta própria: o item herda crédito e nota de quem indicou
      if (!ex.by && s.by) { ex.by = s.by; changed = true; }
      if (!ex.visitorNote && s.visitorNote) { ex.visitorNote = s.visitorNote; changed = true; }
      if (ex.status !== "sugerido") triaged.push(name);
    }
    if (changed) await save(env, items);
    await Promise.all(triaged.map((n) => env.INBOX.delete(n)));
    return items;
  } catch (e) {
    console.error("absorção de indicações falhou", e);
    return load(env);
  }
}

async function route(req, env) {
  const url = new URL(req.url);
  const p = url.pathname;
  const m = req.method;
  const sameOrigin = req.headers.get("origin") === url.origin;

  if (m === "GET" && p === "/") return page();
  if (m === "POST" && p === "/login") return sameOrigin ? login(req, env) : json({ error: "origem inválida" }, 403);
  if (m === "POST" && p === "/api/suggest") return suggest(req, env); // única rota pública da API
  if (!p.startsWith("/api/")) return new Response("not found", { status: 404 });

  const who = await auth(req, env);
  if (!who) return json({ error: "não autorizado" }, 401);
  if (who === "owner" && m !== "GET" && !sameOrigin) return json({ error: "origem inválida" }, 403);
  if (Number(req.headers.get("content-length") || 0) > MAX_CONTEXT * 4 + 20000) return json({ error: "corpo grande demais" }, 413);

  if (p === "/api/items" && m === "GET") {
    const status = url.searchParams.get("status");
    const items = await absorbSuggestions(env);
    return json(status ? items.filter((i) => i.status === status) : items);
  }
  if (p === "/api/items" && m === "POST") return createItem(req, env);

  const match = p.match(/^\/api\/items\/([\w-]{36})$/);
  if (!match) return new Response("not found", { status: 404 });
  const items = await load(env);
  const it = items.find((i) => i.id === match[1]);
  if (!it) return json({ error: "item não existe" }, 404);
  if (it.status === "publicado") return json({ error: "já publicado, edita direto no repo" }, 409);

  const b = (await req.json().catch(() => null)) || {};
  if (m === "PATCH") {
    const wasSuggestion = it.status === "sugerido";
    const err = applyStatus(it, b, who);
    if (err) return json({ error: err }, 400);
    if (wasSuggestion && it.status === "rejeitado") { delete it.visitorNote; delete it.by; } // fica só a URL, pra barrar repetição
    await save(env, items);
    if (wasSuggestion && it.status !== "sugerido") await env.INBOX.delete(await sugKey(it.url)).catch(() => {});
    return json(it);
  }
  return new Response("not found", { status: 404 });
}

export default {
  async fetch(req, env) {
    try {
      return secure(await route(req, env));
    } catch (e) {
      console.error(e);
      return secure(json({ error: "erro interno" }, 500));
    }
  },
};
