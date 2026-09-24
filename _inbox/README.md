# _inbox (Worker recursos-inbox)

Worker da Cloudflare do Inbox Recursos (resources.bgmaia.com/add): só **captura e fila**. Recebe o que o Bruno salva (favorito, Atalho do iPhone, colar) e as indicações do formulário do site. Rascunho, triagem e publicação acontecem numa sessão do Claude Code: "revisa o inbox" (ver ../CLAUDE.md). O Worker não tem permissão de escrita no repo.
Spec: `../docs/inbox-spec.md`. Proposta v2 e fases: `../docs/inbox-v2-proposta.md`.

Mora no repo público. O site é servido pelo Netlify, que publicaria tudo do repo: o `_redirects` da raiz devolve 404 pra `/_inbox/*`, `/docs/*` e os `.md` internos. Não tem segredo no código: senha e chaves são secrets do Worker. O estado local do agente (`_agent/`, com notas e nomes de visitantes) e o `.wrangler/` ficam no .gitignore. Deploy é manual (`npx wrangler deploy` daqui); nunca ligar deploy automático a partir do repo.

## Arquivos

- `worker.js`: API: captura, fila, indicação pública (/api/suggest), status
- `page.js`: HTML/CSS/JS da página (shell sem dado nenhum)
- `test.mjs`: `node test.mjs` checa helpers e as travas de acesso
- `dev.mjs`: `node dev.mjs` roda local com KV em memória (senha `dev`)
- `agent.py`: ferramenta da sessão "revisa o inbox": pull, publish, status; chave em `~/.recursos-inbox-key`
- `setkey.mjs`: gera a chave do agente e grava no Worker e em `~/.recursos-inbox-key`

## Deploy (uma vez)

```bash
npx wrangler login
npx wrangler kv namespace create INBOX      # copiar o id pro wrangler.toml
npx wrangler secret put PASSWORD            # frase longa, 4+ palavras
node setkey.mjs                            # chave do agente: Worker + ~/.recursos-inbox-key juntos
npx wrangler secret put SESSION_SECRET      # openssl rand -hex 32
npx wrangler deploy
```

`add/index.html` (na raiz do repo) redireciona resources.bgmaia.com/add pra URL `*.workers.dev`.

## iPhone

Atalho na share sheet: "Abrir URL" com `https://recursos-inbox.b-gui-maia.workers.dev/#url=` + a URL compartilhada (codificada). A página já lê o link do hash.

## Trocar senha ou revogar tudo

`wrangler secret put PASSWORD` troca a senha. Trocar `SESSION_SECRET` derruba todas as sessões abertas em todos os aparelhos. `node setkey.mjs` rotaciona a chave do agente.
