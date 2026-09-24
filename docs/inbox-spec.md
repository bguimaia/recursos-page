# Inbox Recursos — spec v1

Status: **aguardando aprovação**. Nada construído ainda.

## Problema

Hoje: link vai pra uma aba do Notepad++ sem nota nenhuma, depois uma sessão manual no Claude Code converte, descreve e publica. Dois passos manuais, contexto perdido ("por que salvei isso?") e nada funciona fora do computador.

## Fluxo

```
capturar (qualquer aparelho, com nota)
   → backlog privado
      → segunda 9h: agente rascunha título/descrição/categoria/tags
         → e-mail "N itens prontos"
            → segunda 14h: revisar (editar, aprovar, rejeitar, adiar)
               → aprovado = commit em resources.js → GitHub Pages publica
```

## Peças

### 1. Worker (Cloudflare, plano free)

Um Worker serve a página e a API. Estado no KV (privado). Nada do backlog toca o repo, que é público.

| Rota | Faz |
|---|---|
| `GET /` | página única: abas Capturar e Revisar |
| `POST /login` | confere senha, grava cookie de 1 ano |
| `POST /api/items` | cria item (`url`, `title`, `note`, `cat?`) |
| `GET /api/items?status=` | lista |
| `PATCH /api/items/:id` | edita rascunho, muda status |
| `POST /api/items/:id/approve` | insere entrada em `resources.js` via GitHub API, marca `publicado` |

Item: `{id, url, title, note, cat, tags, description, status, createdAt}`.
Status: `novo → rascunhado → publicado | rejeitado`. "Adiar" só mantém em `rascunhado`.

Duplicata: `POST` recusa URL que já está no backlog ou em `resources.js`.

### 2. Captura

- **Desktop (Firefox, Orion):** bookmarklet. Abre popup de `/` com URL e título da aba preenchidos. Escreve nota, enter, fecha.
- **iPhone:** Atalho na share sheet, abre a mesma tela preenchida.
- **Qualquer lugar:** abrir o link e colar.

Nota é livre e opcional, mas é o campo que mais importa: "salvei pelo grade aos 2:10" vale mais pro rascunho que o transcript inteiro.

### 3. Agente semanal (segunda 9h, horário de SP)

1. `GET /api/items?status=novo`. Vazio → encerra.
2. YouTube: MarkItDown (mesmo caminho do `_transcripts/convert.py`), lote único com pausa. Outros links: lê a página.
3. Uma passada por item: título, descrição, categoria, tags. Regras de voz lidas do `PRODUCT.md` (fonte única, a mesma das sessões manuais). Sem travessão.
4. `PATCH` com o rascunho, status `rascunhado`.
5. E-mail pra bruno.maia@bgmaia.com com contagem e link da revisão.

Consumo: plano Claude atual, sem API paga. Modelo Sonnet. Transcript truncado (início + metadata). O rascunho é escrito uma vez; a edição na revisão é o texto final, ninguém reescreve depois.

### 4. Revisão (segunda 14h)

Cards: thumb, rascunho editável, a nota original ao lado. Aprovar / rejeitar / adiar. Visual segue `DESIGN.md` (dark). Status com rótulo de texto, nunca só cor.

## Endereço

`resources.bgmaia.com/add` é o link de entrada: uma página estática mínima no Pages que só redireciona pro Worker (`*.workers.dev`). O app em si mora no Worker.

Por que não servir o app direto em `/add`: rota de Worker em domínio próprio exige mover o DNS inteiro de `bgmaia.com` pra Cloudflare (mexe em e-mail do Workspace e no Adobe Portfolio). Risco desproporcional pra um atalho. E origem separada é mais segura: o cookie de sessão fica fora do domínio do site público, longe do script do GA4.

## Modelo de segurança

Premissa: o repo é público e bots varrem tudo, então a URL **não** é segredo. A proteção é autenticação, não esconderijo.

- Sem cookie ou chave válida, o Worker devolve só a tela de senha. Nenhum dado, contagem ou título vai no HTML; tudo vem da API depois do login.
- Toda rota `/api/*` responde 401 sem credencial. Qualquer caminho fora da tabela de rotas responde 404.
- Senha longa (frase), comparação em tempo constante, 5 erros por IP = bloqueio de 15 min.
- `X-Robots-Tag: noindex`, CSP restrita, zero script de terceiros na página.
- Segredos (senha, chave de API, token GitHub) só como secrets do Worker. Nunca no repo, nunca no chat.
- Pior caso, se tudo vazar: alguém lê uma lista de links com notas e consegue commitar no repo do site. Reversível com `git revert` + revogar o token. O token não alcança nenhum outro repo.

## Acesso

- Senha única, guardada como secret do Worker (fora do código).
- Digitada uma vez por aparelho; cookie `HttpOnly; Secure; SameSite=Lax` de 1 ano.
- Bookmarklet, Atalho e agente usam uma chave de API separada, só com permissão de criar/listar/editar item. Aprovar exige o cookie.
- `noindex`, URL não linkada em lugar nenhum, bloqueio após 5 senhas erradas por IP.
- Token do GitHub: fine-grained, só `contents:write` no repo `recursos-page`.

## Onde o agente roda: local (testado em 17/09/2026)

Rotina cloud não alcança o YouTube: o proxy de saída do ambiente devolve `403 Forbidden` no túnel pra `www.youtube.com`, nas duas URLs de teste e na chamada direta da `youtube-transcript-api`. Nem chega no IP-block do YouTube.

Decisão: o agente semanal roda como tarefa agendada local no desktop (IP residencial, mesmo caminho que o Markitor já usa hoje). Mesmo desenho, muda só onde executa. PC desligado na segunda 9h = roda quando ligar.

## Fora do v1

Extensão de navegador, resumo do Gemini, comentários em thread, captura de imagem/download, aba Gear. Entram se o uso real pedir.

## Pendências do Bruno

1. Criar conta Cloudflare (free).
2. Gerar o token fine-grained do GitHub.
3. Escolher a senha (entra direto como secret, não passa pelo chat).

## Ordem de construção

1. Teste do IP-block (decide onde o agente roda).
2. Worker + KV + página Capturar + bookmarklet. Já substitui o Notepad++.
3. Agente semanal.
4. Tela Revisar + aprovação com commit.
5. Atalho do iPhone.
