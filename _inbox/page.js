// Shell estático da página. Nenhum dado aqui: tudo vem de /api depois do login.
// String.raw preserva as barras das regex. Regra: nada de crase nem cifrão-chave dentro do HTML.
// A página só CAPTURA. Rascunho, triagem e publicação acontecem numa sessão do Claude Code ("revisa o inbox").
export default String.raw`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0F0E0D">
<title>Inbox Recursos</title>
<style nonce="__NONCE__">
  :root { --bg:#0F0E0D; --surface:#171412; --surface2:#1F1B18; --border:#2D2B28; --text:#F4F1EA; --muted:#A6A094; --faint:#8A857B; --accent:#D4683F; --accent-text:#F08A5B; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font:400 1rem/1.5 system-ui, sans-serif; }
  main { max-width: 640px; margin: 0 auto; padding: 20px 16px calc(60px + env(safe-area-inset-bottom)); }
  h1 { font-size: 1.15rem; margin: 0 0 18px; }
  h2 { font-size: .78rem; letter-spacing: .6px; text-transform: uppercase; color: var(--faint); margin: 34px 0 8px; }
  label { display:block; font-size: .85rem; font-weight:600; color: var(--text); margin: 16px 0 6px; }
  label span { font-weight: 400; color: var(--faint); }
  input, textarea, select { width:100%; background:var(--surface); color:var(--text); border:1px solid var(--border); border-radius:8px; padding:11px 12px; font: inherit; font-size: 16px; }
  input:focus, textarea:focus, select:focus { outline: none; border-color: var(--accent); }
  textarea { min-height: 88px; resize: vertical; }
  #context { min-height: 160px; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  button { font: inherit; font-weight:600; border-radius:999px; padding:9px 18px; border:1px solid var(--border); background:transparent; color:var(--text); cursor:pointer; }
  button.primary { background: var(--accent); color:#0F0E0D; border-color: var(--accent); }
  button.small { padding: 4px 12px; font-size: .8rem; font-weight: 500; color: var(--muted); }
  button:disabled { opacity:.5; cursor: wait; }
  .labelrow { display:flex; align-items:center; justify-content:space-between; gap: 8px; margin: 16px 0 6px; }
  .labelrow label { margin: 0; }
  .row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-top:20px; }
  .msg { min-height: 1.5em; margin: 10px 0 0; color: var(--accent-text); }
  details { margin-top: 16px; }
  summary { cursor: pointer; color: var(--muted); font-size: .85rem; }
  ul { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--border); }
  li { display: grid; grid-template-columns: 1fr auto; gap: 2px 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  li a { color: var(--text); text-decoration: none; font-weight: 600; word-break: break-word; }
  li .meta { grid-column: 1; font-size: .8rem; color: var(--faint); }
  li .meta b { font-weight: 600; color: var(--accent-text); }
  li button { grid-row: 1 / span 2; grid-column: 2; align-self: center; }
  .empty { color: var(--faint); padding: 12px 0; border-bottom: 1px solid var(--border); }
  .hint { color: var(--faint); font-size: .85rem; margin-top: 8px; }
  footer { margin-top: 40px; color: var(--faint); font-size: .85rem; }
  .bm { display:inline-block; padding:4px 12px; border:1px dashed var(--accent); border-radius:999px; color:var(--accent-text); text-decoration:none; font-weight:600; }
  [hidden] { display:none !important; }
</style>
</head>
<body>
<main>
  <h1>Inbox Recursos</h1>

  <section id="login" hidden>
    <form id="loginForm">
      <label for="pw">Senha</label>
      <input id="pw" type="password" autocomplete="current-password" required>
      <div class="row"><button class="primary">Entrar</button></div>
      <p class="msg" id="loginMsg" role="status"></p>
    </form>
  </section>

  <section id="app" hidden>
    <form id="captureForm">
      <label for="url">Link</label>
      <input id="url" type="url" inputmode="url" placeholder="https://" required>

      <div class="labelrow">
        <label for="context">Resumo do Gemini ou transcript <span>o que mais ajuda no rascunho</span></label>
        <button type="button" class="small" id="paste">Colar</button>
      </div>
      <textarea id="context" placeholder="Cola o resumo do vídeo inteiro. Dica: seleciona o resumo na página antes de clicar no favorito e ele já vem preenchido."></textarea>

      <label for="note">Por que salvou? <span>opcional</span></label>
      <textarea id="note" placeholder="ex: grade aos 2:10, transição de match cut no final"></textarea>

      <details>
        <summary>Categoria e título (opcional, decido com o Claude depois)</summary>
        <label for="cat">Categoria</label>
        <select id="cat">
          <option value="">Decidir depois</option>
          <option value="referencias">Referências</option>
          <option value="tutoriais">Tutoriais</option>
          <option value="processo">Processo</option>
          <option value="mindset">Mindset</option>
        </select>
        <label for="title">Título</label>
        <input id="title" type="text" placeholder="vazio = título do vídeo">
      </details>

      <div class="row"><button class="primary">Salvar na fila</button></div>
      <p class="msg" id="captureMsg" role="status"></p>
    </form>

    <h2 id="queueTitle">Na fila</h2>
    <ul id="queue"></ul>
    <p class="hint">Pra rascunhar e publicar: abre o Claude Code no recursos-page e diz "revisa o inbox".</p>

    <footer>
      Arrasta pra barra de favoritos: <a class="bm" id="bookmarklet" href="#">+ Recursos</a>
    </footer>
  </section>
</main>

<script nonce="__NONCE__">
const $ = (s) => document.querySelector(s);

function h(tag, props, ...kids) {
  const e = Object.assign(document.createElement(tag), props || {});
  e.append(...kids);
  return e;
}

function show(view) {
  $("#login").hidden = view !== "login";
  $("#app").hidden = view !== "app";
  if (view === "login") $("#pw").focus();
}

async function api(path, method, body) {
  const r = await fetch(path, {
    method: method || "GET",
    headers: body ? { "content-type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (r.status === 401 && path !== "/login") { show("login"); throw new Error("faz login de novo"); }
  if (!r.ok) throw new Error(data.error || "erro " + r.status);
  return data;
}

const day = (iso) => (iso || "").slice(8, 10) + "/" + (iso || "").slice(5, 7);

// Fila: o que espera a próxima sessão de revisão (capturas do Bruno e indicações do site)
function row(it) {
  const who = it.origin === "site" ? "indicação" + (it.by ? " de " + it.by : "") : "você";
  const extra = [it.context ? "com resumo" : "", it.note || it.visitorNote ? "com nota" : ""].filter(Boolean).join(" · ");
  const drop = h("button", { type: "button", className: "small", textContent: "Tirar" });
  const li = h("li", null,
    h("a", { href: it.url, target: "_blank", rel: "noopener noreferrer", textContent: it.title || it.url }),
    drop,
    h("span", { className: "meta" }, h("b", { textContent: who }), " · " + day(it.createdAt) + (extra ? " · " + extra : "")));
  drop.onclick = async () => {
    if (!confirm("Tirar da fila?")) return;
    drop.disabled = true;
    try { await api("/api/items/" + it.id, "PATCH", { status: "rejeitado" }); li.remove(); count(-1); }
    catch (e) { drop.disabled = false; alert(e.message); }
  };
  return li;
}

let waiting = 0;
function count(delta) {
  waiting += delta;
  $("#queueTitle").textContent = "Na fila (" + waiting + ")";
  if (!waiting) $("#queue").replaceChildren(h("li", { className: "empty", textContent: "Fila vazia." }));
}

async function load() {
  const items = await api("/api/items");
  show("app");
  const open = items.filter((i) => ["sugerido", "novo", "rascunhado"].includes(i.status))
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  waiting = 0;
  $("#queue").replaceChildren(...open.map(row));
  count(open.length);
}

$("#loginForm").onsubmit = async (e) => {
  e.preventDefault();
  try {
    await api("/login", "POST", { password: $("#pw").value });
    $("#pw").value = "";
    await load();
  } catch (err) { $("#loginMsg").textContent = err.message; }
};

// Colar direto da área de transferência (útil no iPhone, vindo do Gemini)
$("#paste").onclick = async () => {
  try { $("#context").value = await navigator.clipboard.readText(); }
  catch { $("#captureMsg").textContent = "O navegador não deixou colar: segura no campo e cola."; }
};

// Bookmarklet e Atalho do iPhone mandam os dados no hash: não vai pro servidor nem pra log.
const hash = new URLSearchParams(location.hash.slice(1));
const isPopup = hash.get("popup") === "1";
if (hash.get("url")) {
  $("#url").value = hash.get("url");
  $("#title").value = (hash.get("title") || "").replace(/^\(\d+\)\s*/, "").replace(/ - YouTube$/, "");
  $("#context").value = hash.get("ctx") || "";
  history.replaceState(null, "", location.pathname);
}

$("#captureForm").onsubmit = async (e) => {
  e.preventDefault();
  const msg = $("#captureMsg");
  try {
    await api("/api/items", "POST", { url: $("#url").value, title: $("#title").value, note: $("#note").value, context: $("#context").value, cat: $("#cat").value });
    msg.textContent = "Salvo na fila.";
    e.target.reset();
    if (isPopup) setTimeout(() => window.close(), 700);
    else load();
  } catch (err) { msg.textContent = err.message; }
};

$("#bookmarklet").href = "javascript:(()=>{window.open('" + location.origin +
  "/#popup=1&url='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(document.title)" +
  "+'&ctx='+encodeURIComponent(String(getSelection()).slice(0,12000)),'inbox','width=480,height=820')})()";
$("#bookmarklet").onclick = (e) => e.preventDefault();

// veio do bookmarklet: cursor no primeiro campo que falta
load().then(() => { if ($("#url").value) ($("#context").value ? $("#note") : $("#context")).focus(); }).catch(() => {});
</script>
</body>
</html>`;
