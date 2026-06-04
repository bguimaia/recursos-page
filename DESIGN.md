---
name: MAIA - Recursos Criativos
description: Biblioteca de recursos curados por Maia — motion designer e diretora criativa.
colors:
  bg:          "#0d0d0d"
  surface:     "#161616"
  surface2:    "#1f1f1f"
  border:      "#2a2a2a"
  text:        "#e8e8e8"
  muted:       "#888888"
  accent:      "#FDEABF"
  accent-dim:  "#c9b78a"
  cat-ref:     "#C4907A"
  cat-tut:     "#7AB898"
  cat-color:   "#7A9EC4"
  cat-proc:    "#A48FC4"
  cat-link:    "#C4B07A"
  cat-dl:      "#7AC4AA"
typography:
  display:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize:   "clamp(1.2rem, 3vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  title:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize:   "1.05rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize:   "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize:   "0.82rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.3px"
  caption:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize:   "0.72rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.5px"
rounded:
  pill: "999px"
  card: "12px"
  modal: "16px"
  sm:   "8px"
  xs:   "4px"
spacing:
  gap:  "20px"
  page: "clamp(20px, 5vw, 60px)"
  sm:   "8px"
  md:   "16px"
  lg:   "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor:       "#111111"
    rounded:         "{rounded.sm}"
    padding:         "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  button-ghost:
    backgroundColor: "transparent"
    textColor:       "{colors.muted}"
    rounded:         "{rounded.sm}"
    padding:         "8px 16px"
  button-ghost-hover:
    textColor:       "{colors.text}"
  card:
    backgroundColor: "{colors.surface}"
    rounded:         "{rounded.card}"
    padding:         "0"
  card-hover:
    backgroundColor: "{colors.surface}"
  pill-active:
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  tag-active:
    backgroundColor: "{colors.accent}"
    textColor:       "#000000"
    rounded:         "{rounded.pill}"
    padding:         "5px 12px"
---

# Design System: MAIA - Recursos Criativos

## 1. Overview

**Creative North Star: "O Moleskine do Cineasta"**

Este sistema visual é o caderno de campo de alguém que vive o ofício. Não um catálogo genérico — uma coleção pessoal onde cada entrada tem razão de estar. O dark não é estética de moda: é o ambiente real onde criadores trabalham, onde telas brilhantes cansam os olhos e o conteúdo deve iluminar, não o chrome. O accent gold (*Luz de Ampliação*) aparece com parcimônia, exatamente como a luz quente de um ampliador fotográfico em um darkroom — rara, precisa, sinaliza atenção sem gritar.

A densidade é deliberada. A grid embaralha a cada visita porque curadoria não é hierarquia fixa — é descoberta. Tags e categorias refletem como um praticante pensa, não como um algoritmo organiza. A voz é a de quem recomenda para outro profissional, não para um iniciante.

O sistema rejeita qualquer coisa que pareça template: bio-links genéricos sem personalidade, SaaS com gradiente roxo e três colunas de features, blogs de fotografia com paleta bege/azul e tipografia segura. Cada decisão visual deve ser defensável por quem faz.

**Key Characteristics:**
- Dark como padrão intencional, não como tendência
- Accent gold usado com economia — menos de 10% da superfície
- Tipografia única (Outfit) com contraste por peso, sem famílias decorativas
- Paleta de categorias semântica e muda, nunca saturada
- Interface recua para o conteúdo; zero elementos competindo com o recurso

---

## 2. Colors: A Paleta da Câmara Escura

Monocromático profundo com um único acento quente. As cores de categoria funcionam como um segundo vocabulário semântico — muted o suficiente para classificar sem distrair.

### Primary
- **Luz de Ampliação** (`#FDEABF`): O accent único do sistema. Usado em CTAs primários, estado ativo de tags, borda inferior do tab ativo, destaque de texto numérico, borda top de cards PINNED. Nunca em segundo plano — sua raridade é o ponto.
- **Luz de Ampliação Atenuada** (`#c9b78a`): Variante do accent para texto de nota itálico, disclosure de afiliados, labels secundários que precisam de calor sem dominar.

### Neutral
- **Câmara Escura** (`#0d0d0d`): Background principal. Quase preto, não preto absoluto — mantém profundidade sem parecer gráfico.
- **Superfície Primária** (`#161616`): Background de cards, modal, header. Um degrau acima do bg.
- **Superfície Elevada** (`#1f1f1f`): Inputs, card-tags, hover states de elementos secundários.
- **Divisa** (`#2a2a2a`): Borders de cards, inputs, separadores. Perceptível mas nunca dominante.
- **Luz Difusa** (`#e8e8e8`): Texto principal. Off-white com leve calor, nunca branco puro.
- **Cinza de Trabalho** (`#888888`): Texto secundário, placeholders, labels. Contraste AA garantido sobre o bg.

### Secondary — Paleta Semântica de Categorias
Seis tons muted, cada um associado a uma categoria de conteúdo. Aplicados com 6-14% de opacidade no background, 25-50% no border, e cor sólida no texto. Nunca trocados, nunca usados fora do contexto de categoria.
- **Terracota Muted** (`#C4907A`): Referências visuais
- **Sage** (`#7AB898`): Tutoriais
- **Slate** (`#7A9EC4`): Color & Câmera
- **Lavanda** (`#A48FC4`): Processo Criativo
- **Âmbar Muted** (`#C4B07A`): Links
- **Menta** (`#7AC4AA`): Downloads

**The One Voice Rule.** O accent `#FDEABF` é usado em ≤10% de qualquer tela. Sua presença sinaliza o que importa: CTA principal, estado ativo, destaque editorial. Diluir essa raridade destrói o sistema.

**The Muted Semantic Rule.** As seis cores de categoria existem para classificar, não decorar. São idênticas em saturação e luminosidade — parecem família, não arco-íris. Proibido usar qualquer uma delas fora do contexto de categoria.

---

## 3. Typography

**Body Font:** Outfit (Google Fonts, 400/500/600/700)

Família única sem decoração adicional. Outfit é geométrica com personalidade suficiente para não parecer genérica, mas disciplinada o bastante para sumir no conteúdo. Contraste de hierarquia feito exclusivamente por tamanho e peso — sem serifa display, sem fonte decorativa.

**Character:** Direta, legível em baixa luminosidade, com personalidade sutil nos terminais arredondados. Parece técnica sem parecer fria.

### Hierarchy
- **Display** (700, `clamp(1.2rem, 3vw, 1.5rem)`, lh 1.3): Títulos de modal, futuras seções de destaque.
- **Title / Card** (700, `1.05rem`, lh 1.4): Títulos de cards de recursos e gear — âncora visual da grid.
- **Body** (400, `0.95rem`, lh 1.5): Descrições de cards, gear, modal. Max 65ch.
- **Label** (600, `0.82rem`, lh 1.4, ls 0.3px): Pills de categoria, botões do header, tab nav, stats bar. Uppercase nos filtros de categoria.
- **Caption** (600, `0.72rem`, lh 1.3, ls 0.5px): Badges de tipo (VIDEO/LINK/DOWNLOAD), card-tags, gear-links.

**The Single Family Rule.** Outfit em todos os papéis. Hierarquia por peso e tamanho, nunca por família. Proibido importar uma segunda fonte "para destaque" — isso é o que faz parecer template.

**The Scale Rule.** Cinco tamanhos: `0.72 / 0.82 / 0.95 / 1.05 / 1.2rem`. Nada fora dessa escala sem motivo documentado.

---

## 4. Elevation

O sistema é flat por padrão. Profundidade é conveida por tonal layering (bg → surface → surface2), não por sombras. Sombras aparecem apenas como resposta a estado de interação.

### Shadow Vocabulary
- **Card Hover** (`0 12px 40px rgba(0,0,0,.5)`): Aparece somente no hover de cards de recurso. Sombra escura e difusa, tintada para o bg. Nenhuma sombra em repouso.
- **Modal Overlay** (backdrop `rgba(0,0,0,.88)` + `backdrop-filter: blur(8px)`): Profundidade de modal via overlay, não via sombra no próprio componente.

**The Flat-By-Default Rule.** Superfícies em repouso são flat. Sombra é exclusiva de estado (hover de card, elevação de modal). Nunca box-shadow decorativo em elemento estático.

---

## 5. Components

Componentes são **Quentes e Editoriais** — respondem ao toque com feedback sutil, parecem curados à mão, nunca gerados. Zero gratuitidade: cada transição tem razão funcional.

### Buttons
- **Shape:** Gently curved (8px radius)
- **Primary** (Me indique algo): Background `#FDEABF`, texto `#111`, padding `8px 16px`, weight 600, `fs-sm`. Hover: `filter: brightness(1.08)` + `translateY(-1px)`.
- **Ghost** (Meu portfólio): Transparent, border `--border`, texto `--muted`. Hover: texto `--text`, border `#555`, `translateY(-1px)`.
- **Tab button**: Sem borda, sem fundo. Ativo: `color: --accent`, `border-bottom: 2px solid --accent`. Uppercase, `fs-sm`.

### Chips / Pills (Category Filters)
- **Style:** Pill (999px), uppercase, letter-spacing 0.3px, `fs-sm`, weight 600.
- **Unselected:** Background com cor semântica a 6% opacidade, border a 25% opacidade, texto na cor semântica.
- **Selected:** Background a 14% opacidade, border sólido na cor semântica, texto na cor semântica.
- Seis variantes cromáticas, uma por categoria. Nunca intercambiáveis.

### Tags (Sub-filtros)
- **Unselected:** Background `--surface2`, border `--border`, texto `--muted`, radius pill.
- **Selected:** Background `--accent`, border `--accent`, texto `#000`, weight 700.
- **Hover:** texto `--text`, border `#555`.

### Cards (Resource Grid)
- **Corner Style:** Gently curved (12px radius)
- **Background:** `--surface` (#161616)
- **Border:** 1px solid `--border` em repouso; `#444` no hover
- **Shadow Strategy:** Flat em repouso. No hover: `translateY(-4px)` + `box-shadow: 0 12px 40px rgba(0,0,0,.5)`
- **Thumbnail:** 16:9, grayscale + brightness 0.8 em repouso. Hover: saturação e brilho plenos. Transição 0.35s.
- **PINNED variant:** `border-top: 2px solid rgba(253,234,191,.4)` + ícone 📌 no canto superior esquerdo do thumb.
- **Internal Padding:** 14px top, 16px horizontal, 16px bottom no card-body.

### Gear Cards
- **Corner Style:** 12px (mesmo que resource cards)
- **Thumbnail:** 4:3 aspect ratio (melhor para produto). Mesmo tratamento grayscale → color.
- **Links:** Múltiplos botões `gear-link` inline — background `--surface2`, border `--border`, radius 6px, `fs-xs`. Hover: texto `--text`, border `#555`.

### Inputs / Fields
- **Search:** Background `--surface2`, border `--border`, radius 8px, `fs-body`. Focus: `border-color: --accent`.
- **Placeholder:** `color: --muted`.

### Navigation (Header)
- **Height:** ~56px (padding 14px vertical)
- **Background:** `rgba(13,13,13,.92)` com `backdrop-filter: blur(16px)` — sticky, frosted.
- **Structure:** Logo (esquerda) | Search centralizado | Botões (direita)
- **Mobile:** Wrap em duas linhas: linha 1 logo + search, linha 2 botões full-width.

### Modal
- **Trigger:** Click em qualquer card.
- **Overlay:** `rgba(0,0,0,.88)` + `backdrop-filter: blur(8px)`
- **Box:** `--surface`, radius 16px, max-width 900px, max-height 90vh, overflow-y auto.
- **Animation:** `scale(.92) → scale(1)`, opacity 0 → 1, `cubic-bezier(.34,1.56,.64,1)` 0.22s.
- **Action button:** Accent gold (link) ou mint outline (download).

### Gear Disclosure Banner
- **Background:** `rgba(253,234,191,.07)` — gold quente muito sutil
- **Border-bottom:** `rgba(253,234,191,.22)`
- **Texto:** `--accent`, `fs-sm`, prefixo ⚠ via `::before`

---

## 6. Do's and Don'ts

### Do:
- **Do** usar o accent `#FDEABF` com economia — reservado para CTA primário, estado ativo, destaque editorial. Raridade é o mecanismo.
- **Do** manter a paleta de categorias semântica e consistente. Terracota sempre para Referências, Sage sempre para Tutoriais. Sem variações.
- **Do** usar `translateY(-4px)` + sombra dark difusa no hover de cards. Feedback tátil sem ruidosidade visual.
- **Do** tratar thumbnails em grayscale em repouso e revelar cor no hover. Movimento editorial, não decorativo.
- **Do** usar Outfit em peso 700 para títulos de cards — é a âncora de escaneabilidade da grid.
- **Do** manter o sistema de tipo em cinco tamanhos: `0.72 / 0.82 / 0.95 / 1.05 / 1.2rem`. Hierarquia por peso e tamanho dentro dessa escala.
- **Do** garantir contraste WCAG AA em todo texto — mínimo `#888` sobre `#0d0d0d` (5.9:1).
- **Do** respeitar `prefers-reduced-motion` — eliminar `translateY`, `scale`, `filter` transitions e deixar apenas mudanças de cor.

### Don't:
- **Don't** usar gradiente de texto (`background-clip: text`). Proibido em qualquer headline ou label.
- **Don't** criar um visual que pareça Linktree ou bio-link genérico — template visual, lista de links sem curadoria, ausência de personalidade.
- **Don't** imitar SaaS genérico — gradiente roxo, três colunas de features, CTA verde. Esse sistema tem uma voz; SaaS não tem.
- **Don't** usar paleta bege/azul clara de blog de fotografia. O dark é intencional; tons claros pertencem a outro projeto.
- **Don't** adicionar uma segunda família tipográfica "para destaque". Outfit em todos os papéis, hierarquia por peso.
- **Don't** usar as cores de categoria fora do contexto de classificação. `#C4907A` não é para botões, `#7AB898` não é para links de rodapé.
- **Don't** colocar sombra em elementos em repouso. Flat-by-default; sombra é exclusiva de hover/elevação.
- **Don't** saturar a interface com o accent gold. Se aparecer em mais de 10% da superfície visível, está errado.
- **Don't** usar border-left ou border-right colorido como acento decorativo em cards ou listas. Proibido.
