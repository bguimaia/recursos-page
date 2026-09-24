# Inbox v2: proposta (aprovada em 24/09/2026, fase 1 publicada)

> **Estado em 24/09/2026.** O `/add` só captura (link, resumo, nota); a fila e as indicações do site ficam no Worker. Rascunho, triagem e publicação acontecem na sessão "revisa o inbox" (CLAUDE.md), com `_inbox/agent.py`. Sem agente de segunda (pausado), sem tela Revisar, sem token do GitHub no Worker. O que segue abaixo é o histórico da decisão; onde divergir, vale este bloco e o CLAUDE.md.

24/09/2026. Saiu de 2 desenhos independentes (operação e rotina do Bruno) julgados contra o código real.

## O fluxo

```
Bruno: favorito "+ Recursos" / Atalho do iPhone / colar link
   → "novo" (tipo pela URL: vídeo ou link)
Visitante: 03 / Indique no site (qualquer link)
   → chave própria no KV (nunca mexe no backlog do Bruno)
   → aparece em Revisar como "Indicação"
   → triagem: Aceitar (vira "novo") | Recusar
"novo" → segunda 9h, agente local: resumo colado > legenda > créditos do YouTube
   (YouTube bloqueou? item fica "novo" e tenta de novo na semana seguinte)
   → "rascunhado" + duração → e-mail "N rascunhos, S indicações, B bloqueados"
   → segunda 14h Revisar → Aprovar
   → commit no resources.js com data de entrada, duração e crédito → site
vídeo → biblioteca (YouTube, Vimeo, Instagram, TikTok) | link → seção de ferramentas e canais
```

## Decisões

- **O app continua em workers.dev**, com resources.bgmaia.com/add redirecionando. Servir direto em /add exigiria levar o DNS do bgmaia.com pra Cloudflare, o que arrisca o e-mail do Workspace e o Adobe Portfolio.
- **O código muda de lugar, não de endereço**: `recursos-inbox` vira `recursos-page/_inbox`. Assim fica um projeto só, com histórico no git (hoje o Worker não tem nenhum), e o `_redirects` do Netlify impede que `/_inbox/` seja servido (o site é servido pelo Netlify, não pelo GitHub Pages). O deploy continua manual.
- **Biblioteca = vídeos**, de qualquer plataforma: YouTube, Vimeo, Instagram, TikTok (decidido). O card, o player e o agente passam a saber o tipo pela URL.
- **Ferramenta, canal e artigo ganham seção própria no site**, publicada pelo inbox (decidido): mesmo fluxo de triagem, rascunho e aprovação, com rascunho mais curto (nome, o que é, por que vale). Link de afiliado é sempre o do Bruno, nunca o que o visitante mandou.
- **Indicação passa por triagem antes do agente.** Texto de visitante só chega ao agente (que roda no PC do Bruno) depois do Aceitar, e marcado como dado de terceiro.
- **Nota do visitante separada da nota do Bruno** (`visitorNote`), pra não virar "Tua nota" no card nem ser lida pelo agente como sua.
- **Legenda bloqueada fica visível.** Cada rascunho leva um selo da fonte ("do teu resumo", "da legenda", "só créditos, confere"). Hoje 14 dos 66 arquivos em `_transcripts` são página de erro de 754 bytes.
- **Aprovar pode ser repetido sem estrago.** Se o commit entrou mas a rede caiu antes da resposta, aprovar de novo só marca publicado, em vez de travar o item.
- **Categorias numa fonte só** (`cats.json`). O bug do Mindset nasceu de três cópias da mesma lista.
- **Data de entrada e duração gravadas na aprovação**: `added` e `dur` no resources.js. Some o `prototipo/meta.js`.
- **Caminhos de estudo** (docs/ideias.md) são montados numa sessão do Claude Code, sem tela no inbox.

## Estados

`sugerido` (indicação do site) → `novo` (esperando rascunho) → `rascunhado` → `publicado`. Final: `rejeitado`. Cada item tem um tipo pela URL: vídeo (vai pra biblioteca) ou link (vai pra seção de ferramentas e canais).

## Fases

1. **Feita e publicada em 24/09/2026.** Além do previsto, entrou o que a revisão adversarial confirmou: limitador nativo da Cloudflare (5/min por IP, IPv6 por /64) no formulário e no login, checagem de host do YouTube, comparação exata de URL publicada, indicação guardada até a triagem, agente sem acesso a indicação não triada, e o formulário não revela o que está no backlog. Plano original: Mover pra `_inbox`, com `.gitignore` antes do primeiro commit (notas e nomes de visitantes nunca vão pro repo público). Indicações em chave própria. Aprovação idempotente. Testes e `wrangler deploy`. Na prática: Mindset passa a ser aprovável em produção e o formulário público não consegue mais apagar edições do Bruno.
2. **Antes do formulário ir ao ar.** Tipo do item pela URL (vídeo ou link), `cats.json`, agente com a nota do visitante como dado de terceiro, e-mail com a contagem de indicações. (A separação da nota do visitante já entrou na fase 1.)
3. **Antes do redesign ir ao ar.** Data de entrada e duração na aprovação, selo da fonte, detecção de legenda bloqueada, backfill das 75 entradas, protótipo lendo `r.added`/`r.dur`, spec v2. Mais: player e thumbnail pra Vimeo/Instagram/TikTok no card e no modal, e o desenho da seção de ferramentas e canais (onde fica, como se relaciona com o "Também recomendo").
4. **Quando for a hora dos caminhos de estudo.** `TRAILS` no data.js e página própria.

Só com sinal real: Turnstile (se entrar spam), publicar em lote (se passar de uns 10 itens por semana), D1 (se houver uma segunda pessoa revisando).

## Rascunho e aprovação pelo chat (decidido e feito em 24/09/2026)

O Bruno prefere rascunhar e revisar aqui no chat do Claude Code. Isso simplifica: o Worker vira só caixa de entrada (captura + indicações do site); "revisa o inbox" numa sessão puxa os itens com as legendas, rascunha, ajusta na conversa e faz o commit. Saem o agente de segunda, a tela Revisar e o token do GitHub guardado no Worker. Feito: página `/add` só de captura (link, resumo do Gemini com botão Colar, nota, categoria e título opcionais, fila com "Tirar"); rota de aprovação e token do GitHub fora do Worker; `agent.py` com pull/publish/status pra sessão; rotina no CLAUDE.md. As fases 2 e 3 acima continuam valendo onde falam do site; o que falava de tela Revisar e agente semanal caiu.

## Decidido em 24/09/2026

1. Código do inbox no repo público, em `recursos-page/_inbox`.
2. Ferramenta, canal e artigo: seção própria no site, publicada pelo inbox.
3. Vídeo fora do YouTube entra na biblioteca.
4. Deploy liberado depois da fase 1 com testes passando.
