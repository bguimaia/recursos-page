# -*- coding: utf-8 -*-
"""Ferramenta da sessão "revisa o inbox" no Claude Code. Rascunho e aprovação acontecem no chat com o Bruno.

  python _inbox/agent.py pull                     -> fila aberta (indicações + capturas) com resumo/legenda em _agent/pending.json
  python _inbox/agent.py publish                  -> valida _agent/drafts.json, insere no ../resources.js e marca publicado
  python _inbox/agent.py status <status> <id>...  -> novo (aceitar indicação / reabrir) ou rejeitado (tirar da fila)
  python _inbox/agent.py lint                     -> confere o texto de todas as entradas do ../resources.js (antes de commitar)
  python _inbox/agent.py demo                     -> checagens

drafts.json: [{"id", "title", "description", "cat", "tags", "by"?}], só com o que o Bruno aprovou no chat.
Crédito: o que a pessoa escreveu em "seu nome ou @" no formulário vale como consentimento (o formulário promete
o crédito). "by" vem da indicação se o rascunho não disser outra coisa; "by": "" tira o crédito.
O commit e o push do resources.js ficam com a sessão, depois do ok do Bruno.
Chave da API em ~/.recursos-inbox-key (fora de qualquer repo). Regras de escrita: ../docs/voz-descricoes.md
"""
import contextlib, json, os, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

API = "https://recursos-inbox.b-gui-maia.workers.dev/api/items"
HERE = Path(__file__).parent / "_agent"
SITE_JS = Path(__file__).parent.parent / "resources.js"
TRANSCRIPTS = Path(__file__).parent.parent / "_transcripts"   # cache único de legenda (o mesmo do fluxo manual)
CATS = {"referencias", "tutoriais", "processo", "mindset"}
OPEN = ("sugerido", "novo", "rascunhado")
MAX_DESC = 300    # teto do site
MAX_CHARS = 12000   # orçamento de transcript por vídeo (~3 mil tokens), amostrado do vídeo inteiro
MIN_CONTEXT = 400   # a partir daqui o resumo colado pelo Bruno substitui o transcript
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
YT_HOST = re.compile(r"(^|\.)youtube\.com$|^youtu\.be$")


def call(url, method="GET", body=None):
    key = (Path.home() / ".recursos-inbox-key").read_text(encoding="utf-8").strip()
    req = urllib.request.Request(url, method=method, data=json.dumps(body).encode() if body else None,
                                 headers={"authorization": f"Bearer {key}", "content-type": "application/json",
                                          "user-agent": "recursos-inbox-agent"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def youtube_id(url):
    host = urllib.parse.urlparse(url).hostname or ""
    if not YT_HOST.search(host):  # host de verdade, não "youtube.com" em qualquer lugar da URL
        return None
    m = re.search(r"(?:youtu\.be/|youtube\.com/(?:watch\?(?:.*&)?v=|shorts/|embed/|live/))([\w-]{11})", url)
    return m.group(1) if m else None


def url_key(url):
    return youtube_id(url) or re.sub(r"/$", "", re.sub(r"^https?://(www\.)?", "", url.strip()))


def published(src, url):
    """Comparação exata com as entradas `url: "..."` do resources.js (substring daria falso positivo)."""
    return any(url_key(u) == url_key(url) for u in re.findall(r'url:\s*"([^"]+)"', src))


def oembed(url):
    try:
        q = "https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(url, safe="")
        with urllib.request.urlopen(q, timeout=10) as r:
            d = json.load(r)
        return f"Título: {d['title']} | Canal: {d['author_name']}"
    except Exception:
        return ""


def yt_description(url):
    """Descrição do vídeo direto da página: clipe não tem transcript, mas os créditos ficam aqui."""
    try:
        req = urllib.request.Request(url, headers={"user-agent": UA, "accept-language": "pt-BR,pt;q=0.9,en;q=0.8"})
        html = urllib.request.urlopen(req, timeout=20).read().decode("utf-8", "replace")
        m = re.search(r'"shortDescription":"((?:[^"\\]|\\.)*)"', html)
        return "Descrição no YouTube:\n" + json.loads('"' + m.group(1) + '"')[:2000] if m else ""
    except Exception:
        return ""


def sample(text):
    """Vídeo longo: começo + meio + fim em vez de só o começo, pra descrição cobrir o vídeo inteiro."""
    if len(text) <= MAX_CHARS:
        return text
    head, part = MAX_CHARS // 2, MAX_CHARS // 4
    mid = len(text) // 2
    return (text[:head] + "\n[... corte ...]\n" + text[mid - part // 2: mid + part // 2]
            + "\n[... corte ...]\n" + text[-part:])


def fetch_content(md, url):
    vid = youtube_id(url)
    cache = TRANSCRIPTS / f"{vid}.md" if vid else None
    if cache and cache.exists():
        content = cache.read_text(encoding="utf-8")
    else:
        # MarkItDown imprime páginas de erro a cada retry; o transcript de erro não entra no cache
        with open(os.devnull, "w") as nul, contextlib.redirect_stdout(nul), contextlib.redirect_stderr(nul):
            content = md.convert(url).text_content or ""
        if cache and "### Transcript" in content:
            cache.parent.mkdir(parents=True, exist_ok=True)
            cache.write_text(content, encoding="utf-8")
        time.sleep(2)  # gentil com o YouTube: repetição é o que dispara o IP-block
    if vid and "### Transcript" not in content and len(content) < 1500:
        content = ""  # clipe sem fala, vídeo restrito ou bloqueio: só o rodapé da página
    return content


def pull():
    from markitdown import MarkItDown
    items = [i for i in call(API) if i["status"] in OPEN]
    md, out = MarkItDown(), []
    for it in items:
        base = {k: it.get(k, "") for k in ("id", "url", "title", "status", "cat", "note", "context", "by", "origin", "visitorNote")}
        vid = youtube_id(it["url"])
        if len(base["context"]) >= MIN_CONTEXT:
            # o Bruno colou resumo/transcript do vídeo inteiro: é a fonte. Nem bate no YouTube.
            out.append(base | {"basis": "resumo", "content": oembed(it["url"]) if vid else ""})
            continue
        if it.get("origin") == "site" and not vid:
            # link de visitante que não é vídeo do YouTube: não busca a página antes da triagem
            out.append(base | {"basis": "nenhuma", "content": ""})
            continue
        try:
            content = fetch_content(md, it["url"])
        except Exception as e:  # IP-block, página fora do ar
            content = "" if vid else f"[conversão falhou: {str(e)[:200]}]"
        basis = "legenda" if "### Transcript" in content else ("pagina" if content else "creditos")
        if vid and not content:
            content = oembed(it["url"]) + "\n" + yt_description(it["url"])
        out.append(base | {"basis": basis, "content": sample(content)})
    HERE.mkdir(exist_ok=True)
    (HERE / "pending.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    sug = sum(1 for o in out if o["status"] == "sugerido")
    print(f"{len(out)} na fila ({sug} indicações do site, {len(out) - sug} capturas) -> _inbox/_agent/pending.json")


BY_OK = re.compile(r"^@[\w.]{1,30}$|^[^\s@/:<>][^/:<>]{0,39}$")  # @perfil ou nome curto, sem link


def check_text(d):
    """Regras de texto do docs/voz-descricoes.md que dá pra checar por máquina."""
    desc, errs = d["description"].strip(), []
    if d["cat"] not in CATS: errs.append(f"categoria inválida: {d['cat']}")
    if not d["title"].strip() or not desc: errs.append("título ou descrição vazio")
    if re.search("[\u2014\u2013]", desc + d["title"]): errs.append("travessão")  # — e –
    if "[" in desc: errs.append("colchete ou marcador interno no texto")
    if len(desc) > MAX_DESC: errs.append(f"{len(desc)} caracteres, teto {MAX_DESC}")
    if re.search(r"\b(você|voce|sua|seu|seus|suas)\b", desc, re.I): errs.append("fala com o leitor")
    if d.get("by") and not BY_OK.match(d["by"]): errs.append(f"crédito inválido: {d['by']!r} (só @perfil ou nome curto, sem link)")
    return errs


def check(d, known):
    """Trava o que a revisão humana não devia ter que pegar. Devolve a lista de problemas do rascunho."""
    errs = check_text(d)
    novas = [t for t in d["tags"] if t not in known]
    if not 2 <= len(d["tags"]) <= 4 or len(novas) > 1: errs.append(f"tags: 2 a 4, no máximo 1 nova (novas: {novas})")
    return errs


ENTRY = re.compile(r'cat:\s*"([^"]*)",\s*title:\s*("(?:[^"\\]|\\.)*"),\s*url:\s*"([^"]+)",\s*description:\s*("(?:[^"\\]|\\.)*"),'
                   r'\s*tags:\s*(\[[^\]]*\])(?:,\s*by:\s*("(?:[^"\\]|\\.)*"))?')


def entries(src):
    for m in ENTRY.finditer(src):
        yield {"cat": m[1], "title": json.loads(m[2]), "url": m[3], "description": json.loads(m[4]),
               "tags": json.loads(m[5]), "by": json.loads(m[6]) if m[6] else ""}


def lint():
    src = SITE_JS.read_text(encoding="utf-8")
    items = list(entries(src))
    problems = [(e["title"], errs) for e in items if (errs := check_text(e))]
    for title, errs in problems:
        print(f"- {title[:70]}: {'; '.join(errs)}")
    total = src.count("url:")
    if len(items) != total:
        problems.append(("", ["?"]))
        print(f"! li {len(items)} de {total} entradas: alguma saiu do formato esperado")
    sys.exit(1 if problems else print(f"ok: {len(items)} entradas"))


def entry(it, nl):
    """Mesmo formato das entradas existentes (JSON.stringify: tags sem espaço, acento cru)."""
    s = lambda v: json.dumps(v, ensure_ascii=False)
    lines = ["  {", f"    cat: {s(it['cat'])},", f"    title: {s(it['title'])},", f"    url: {s(it['url'])},",
             f"    description: {s(it['description'].strip())},",
             f"    tags: {json.dumps(it['tags'], ensure_ascii=False, separators=(',', ':'))},"]
    if it.get("by"):
        lines.append(f"    by: {s(it['by'])},")
    return nl.join(lines + ["  },", "", ""])


def insert(src, items):
    i = src.rfind("];")
    if i < 0:
        raise SystemExit("resources.js: '];' final não encontrado")
    nl = "\r\n" if "\r\n" in src else "\n"
    return src[:i] + "".join(entry(it, nl) for it in items) + src[i:]


def publish():
    drafts = json.loads((HERE / "drafts.json").read_text(encoding="utf-8"))
    pending = {p["id"]: p for p in json.loads((HERE / "pending.json").read_text(encoding="utf-8"))}
    src = SITE_JS.read_text(encoding="utf-8", newline="")
    known = set(re.findall(r'"([^"]+)"', " ".join(re.findall(r"tags: \[(.*?)\]", src))))
    problems = {}
    for d in drafts:
        if d["id"] not in pending: problems[d.get("title", d["id"])] = ["id fora do pending.json (rodar pull)"]
        elif (e := check(d, known)): problems[d["title"]] = e
    if problems:  # valida tudo antes de mexer em qualquer coisa
        sys.exit("NADA PUBLICADO. Corrija:\n" + "\n".join(f"- {t}: {'; '.join(e)}" for t, e in problems.items()))
    for d in drafts:
        if not youtube_id(pending[d["id"]]["url"]):
            sys.exit(f"NADA PUBLICADO. Não é vídeo do YouTube (a biblioteca ainda não tem seção pra isso): {pending[d['id']]['url']}")
    # URL sempre no formato canônico: youtu.be, shorts e ?si= viram watch?v=<id>
    items = [pending[d["id"]] | d | {"url": "https://www.youtube.com/watch?v=" + youtube_id(pending[d["id"]]["url"]),
                                     "by": d.get("by", pending[d["id"]].get("by", ""))} for d in drafts]
    new = [it for it in items if not published(src, it["url"])]
    SITE_JS.write_text(insert(src, new), encoding="utf-8", newline="")
    for it in items:  # já estava no site também vira publicado (idempotente)
        call(f"{API}/{it['id']}", "PATCH", {"status": "publicado"})
    print(f"{len(new)} inseridos no resources.js, {len(items)} marcados publicado. Agora: agent.py lint, mostrar o diff, commit + push com ok do Bruno.")


def status(new_status, *ids):
    if new_status not in ("novo", "rejeitado"):
        sys.exit("status: novo (aceitar/reabrir) ou rejeitado (tirar da fila)")
    for i in ids:
        call(f"{API}/{i}", "PATCH", {"status": new_status})
    print(f"{len(ids)} -> {new_status}")


def demo():
    known = {"carreira", "direção", "videoclipe"}
    ok = {"cat": "referencias", "title": "T", "description": "Clipe dirigido por Fulano.", "tags": ["videoclipe", "direção"]}
    assert check(ok, known) == []
    bad = ok | {"description": "[SEM TRANSCRIPT] Bom pra você — " + "x" * 300, "tags": ["a", "b"]}
    assert len(check(bad, known)) == 5, check(bad, known)
    long = "A" * 20000 + "M" * 20000 + "Z" * 20000
    s = sample(long)
    assert len(s) < MAX_CHARS + 100 and s[0] == "A" and "M" in s and s[-1] == "Z"
    assert sample("curto") == "curto"
    assert "travessão" in check_text(ok | {"description": "Clipe de 2 minutos \u2013 direção de Fulano."})
    assert check_text(ok | {"by": "@fulano.x"}) == [] and check_text(ok | {"by": "Maria Silva"}) == []
    assert check_text(ok | {"by": "https://spam.test"}) and check_text(ok | {"by": "@x y"})
    assert youtube_id("https://youtube.com/shorts/dQw4w9WgXcQ") == "dQw4w9WgXcQ"
    assert youtube_id("https://youtu.be/dQw4w9WgXcQ?si=abc123") == "dQw4w9WgXcQ"
    assert youtube_id("https://evil.test/youtube.com/watch?v=dQw4w9WgXcQ") is None
    assert youtube_id("https://m.youtube.com/watch?v=dQw4w9WgXcQ") == "dQw4w9WgXcQ"
    assert published('url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",', "https://youtu.be/dQw4w9WgXcQ")
    assert not published('url: "https://artlist.io/x-2",', "https://artlist.io/x")
    src = 'const RESOURCES = [\r\n  {\r\n    cat: "processo",\r\n  },\r\n\r\n];\r\n'
    out = insert(src, [{"cat": "mindset", "title": 'Aspas "duplas" e \\ barra', "url": "https://youtu.be/dQw4w9WgXcQ",
                        "description": "Ação.", "tags": ["a", "b"], "by": "@fulano"}])
    assert '    tags: ["a","b"],\r\n    by: "@fulano",\r\n  },\r\n\r\n];' in out and "\n\n" not in out.replace("\r\n", ""), out
    assert json.loads(re.search(r"title: (.*),", out).group(1)) == 'Aspas "duplas" e \\ barra'
    back = list(entries(out))
    assert len(back) == 1 and back[0]["title"] == 'Aspas "duplas" e \\ barra' and back[0]["by"] == "@fulano", back
    print("ok")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    cmd, *args = sys.argv[1:] or ["demo"]
    {"pull": pull, "publish": publish, "status": status, "lint": lint, "demo": demo}[cmd](*args)
