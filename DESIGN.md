---
name: MAIA Resources
description: Sistema visual do site (index.html). Escuro, terracota como único acento, Archivo e JetBrains Mono. Mesma família visual do dashboard MAIA Financeiro.
colors:
  bg:           "#0F0E0D"
  surface:      "#171412"
  muted:        "#1F1B18"
  border:       "#2D2B28"
  border-soft:  "#1E1D1B"
  ink:          "#F4F1EA"
  ink-strong:   "#FFFFFF"
  ink-soft:     "#A6A094"
  ink-faint:    "#8A857B"
  accent:       "#D4683F"
  accent-text:  "#F08A5B"
  on-accent:    "#0F0E0D"
typography:
  display:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize:   "clamp(40px, 4.6vw, 64px)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  section:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize:   "clamp(22px, 2.4vw, 28px)"
    fontWeight: 500
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize:   "17px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize:   "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize:   "11px"
    fontWeight: 600
    letterSpacing: "0.08em"
    textTransform: "uppercase"
    fontStretch: "125%"
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize:   "11px to 12px"
    use: "números, durações, contagens, #tags, rótulo de tipo nas recomendações"
rounded:
  pill:   "999px (botões, selos, tags)"
  thumb:  "10px (6px na lista estreita)"
  panel:  "14px (destaque, formulário)"
  modal:  "16px"
  field:  "8px (busca, segmentado, botão Tags)"
spacing:
  gutter: "clamp(20px, 4vw, 60px)"
  col:    "260px (largura mínima de coluna da grade)"
  section: "clamp(56px, 8vw, 96px)"
---

# Design System: MAIA Resources

## 1. Overview

Biblioteca de vídeos pra quem faz audiovisual. A interface serve o conteúdo e fica quieta: fundo quase preto, thumbs em preto e branco que ganham cor no hover, um único acento terracota pra o que é ação ou novidade. Vem do dashboard MAIA Financeiro (mesmos tokens) e do deck do Bruno no Figma (tipografia grande, metadados em mono, seta ↗ pra link externo).

Decisões que valem pra qualquer tela nova:
- Terracota `#D4683F` é o único acento. Nunca cor por categoria.
- Categoria é rótulo pequeno em caixa alta (`.label`), não cor.
- Números, durações e #tags em JetBrains Mono; todo o resto em Archivo.
- Header não fixo. O que fica fixo (no desktop) é a barra da biblioteca: abas, busca, ordem e tags.
- Sem números de seção. Sem título gigante.
- Texto do site nunca usa travessão.

## 2. Cores

- **bg `#0F0E0D`**: fundo. Um brilho terracota muito fraco no canto superior esquerdo (`body::before`).
- **surface `#171412`** e **muted `#1F1B18`**: campos, modal, formulário, segmentado.
- **border `#2D2B28`** e **border-soft `#1E1D1B`**: divisórias de 1px. Hierarquia vem de linha, não de sombra.
- **ink / ink-strong / ink-soft / ink-faint**: texto principal, títulos, texto secundário, metadados.
- **accent `#D4683F`**: botão principal (Enviar), play do destaque, selo "novo", aba ativa, barra de scrub, pílula "Assistir", switch ligado. **accent-text `#F08A5B`**: links de texto e rótulos monetizados (afiliado, indicação) sobre fundo escuro.

## 3. Tipografia

Archivo variável (largura 62 a 125, peso 400 a 800) e JetBrains Mono 400. Tamanhos inteiros: 11, 12, 13, 14, 15, 16, 17 e os `clamp()` de display e seção. Títulos com `text-wrap: balance`, parágrafos com `text-wrap: pretty`.

Texto de leitura acompanha o bloco onde está, não a janela: destaque, modal e a frase do Indicar são contêineres (`container-type: inline-size`) e usam `cqi` com teto e piso em `clamp()`. Sem `max-width` em `ch` nos títulos (era o que forçava quebra no meio da frase). Rótulos, mono e texto de card ficam fixos: a grade já mantém a largura dos cards numa faixa estreita. Campos de texto com 16px no celular (abaixo disso o iOS dá zoom).

## 4. Componentes

- **Header**: marca "MAIA Resources", botão ghost redondo com lupa (vai pra biblioteca e foca a busca; atalho `/`) e botão ghost "Indicar".
- **Hero**: título "Resources", subtítulo, linha mono com crédito, contagem e data. Ao lado, o destaque "Se for ver um só" (vídeo toca no lugar; título e descrição crescem com a largura da coluna via `cqi`, sem quebra forçada). Embaixo do texto, "Também recomendo" com até 4 itens (no máximo 2 monetizados) e "ver todos".
- **Card de vídeo**: thumb 16:9 (cinza, cor no hover; no toque, colorida), duração em mono, selo "novo" ou "✓ visto", rótulo de categoria, título, 2 linhas de descrição, #tags. Hover: sobe 4px, borda terracota, pílula "▶ Assistir" e scrub de 4 frames do YouTube. Sem zoom.
- **Lista estreita** (até 760px): a grade vira linhas com thumb de 112px.
- **Recém-adicionados**: uma linha só, quantos couberem; no celular vira carrossel.
- **Biblioteca**: abas de categoria com contagem, busca (tecla /), Aleatório/Recentes, painel de Tags com contagem, linha de status com "esconder vistos" e "limpar vistos" (com desfazer).
- **Modal**: `<dialog>` nativo. Barra própria com categoria, duração, posição, ← → e ✕ (nunca sobre o vídeo). Player, título, descrição, crédito, tags, Visto / Copiar link / Abrir no YouTube, "Continue explorando" com o tema em comum. No celular, abre como folha de baixo.
- **Também recomendo (lista completa)**: nome, rótulo de tipo em mono (afiliado, indicação, feito por mim, download, link) e o texto inteiro, que diz o que a pessoa ganha.
- **Indique**: texto + "Costuma entrar" à esquerda, formulário em painel à direita.
- **Rodapé**: uma linha; texto à esquerda, links com ↗ à direita.

## 5. Movimento

Entrada dos cards (`rise`, 0.45s) só na primeira pintura; filtro e busca não reanimam. Transições curtas (0.15 a 0.4s) com `cubic-bezier(.16, 1, .3, 1)`.

- **Toque**: resposta no pointer-down (`scale(.97)`, 100ms), nunca só no clique.
- **Modal no desktop**: nasce da miniatura clicada e volta pra ela ao fechar (`cubic-bezier(.32,.72,0,1)`, 0.44s na ida, 0.36s na volta); o fundo esmaece junto. Sem card visível, aparece do centro.
- **Folha no celular**: sobe de baixo, arrasta 1:1 pela alça, elástico pra cima, fecha pela velocidade ou pela projeção do impulso.
- **Interrupção**: fechar no meio de uma animação parte do ponto em que o modal está na tela.
- **`prefers-reduced-motion`**: tudo vira esmaecer curto, sem deslocamento, escala ou elástico.

## 6. Faça e não faça

Faça: linha de 1px pra separar, rótulo em caixa alta pra classificar, mono pra número, terracota só no que é ação ou novidade, ícones com `U+FE0E` (▶ ✓ ✕) pra não virarem emoji no iOS.

Não faça: cor por categoria, sombra como hierarquia, zoom no hover, header fixo, travessão em texto, foto de banco de imagem, link monetizado sem rótulo.
