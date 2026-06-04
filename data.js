// ============================================================
//  data.js — PINNED + GEAR
//
//  PINNED → links fixos no topo (afiliados, parceiros, curadoria editorial).
//           Aparecem sempre primeiro, na ordem definida aqui.
//
//  GEAR   → equipamentos e ferramentas recomendados.
//           Cada item pode ter múltiplos links de compra.
//
//  RESOURCES → veja resources.js
// ============================================================


// ── FIXOS — sempre no topo, na ordem abaixo ─────────────────
const PINNED = [

  {
    cat: "links",
    title: "Epidemic Sound — Biblioteca de Música",
    url: "https://share.epidemicsound.com/f2rtl9",
    thumbnail: "https://picsum.photos/seed/epidemic-sound/800/450",
    description: "A melhor biblioteca de música e efeitos sonoros para criadores. Teste grátis pelo meu link — link de afiliado.",
    tags: ["música", "áudio", "ferramenta", "afiliado"],
  },
    {
    cat: "download",
    type: "download",
    title: "GhostSweep",
    url: "https://github.com/bguimaia/ghostsweep",
    description: "Ferramenta que criei para limpar ghost files do macOS (.DS_Store, ._*) no Windows. Script PowerShell com interface gráfica, sem instalação: escaneia pastas, mostra prévia e manda pra lixeira.",
    tags: ["windows", "utilitário", "ferramenta"],
  },
  {
    cat: "download",
    type: "download",
    title: "Vipz's Expression Bundle",
    url: "https://vipsz.gumroad.com/l/hsINu",
    description: "Script para After Effects do Vipz que aplica as expressões mais usadas por Motion Designers com um clique — LoopOut, Wiggle, Overshoot, Fade In/Out, Type In e Squish & Stretch.",
    tags: ["after effects", "motion design", "ferramenta"],
  },
  {
    cat: "links",
    title: "Vimeo Staff Picks",
    url: "https://vimeo.com/channels/staffpicks",
    thumbnail: "https://picsum.photos/seed/vimeo-staffpicks/800/450",
    description: "Curadoria editorial do Vimeo — o melhor de short film, comercial e video art selecionado pela equipe.",
    tags: ["curadoria", "short film", "publicidade"],
  },
];


// RESOURCES → ver resources.js


// ============================================================
//  GEAR — equipamentos e ferramentas que uso e recomendo.
//
//  Cada item pode ter múltiplos links de compra (links: [...]).
//  Substitua os URLs pelos seus links de afiliado antes de publicar.
//
//  Plataformas sugeridas:
//    Amazon BR  → associados.amazon.com.br
//    MercadoLivre → afiliados.mercadolivre.com.br
//    Shopee     → affiliate.shopee.com.br
//    AliExpress → portals.aliexpress.com
// ============================================================
const GEAR = [

  // ── Câmera ───────────────────────────────────────────────────
  {
    title: "Sony FX3",
    thumbnail: "https://picsum.photos/seed/sony-fx3-cinema/800/600",
    description: "Full-frame cinema line da Sony. 4K 120fps, S-Cinetone, dual native ISO, corpo compacto de 715g.",
    note: "Câmera principal que uso em todos os meus projetos.",
    tags: ["câmera", "sony"],
    links: [
      { label: "Amazon BR", url: "#" },
      { label: "MercadoLivre", url: "#" },
    ],
  },

  // ── Lentes ───────────────────────────────────────────────────
  {
    title: "Sony FE 24mm f/1.4 GM",
    thumbnail: "https://picsum.photos/seed/sony-24mm-gm/800/600",
    description: "Prime wide da linha G Master. Abertura f/1.4, levíssima (445g), bokeh suave e nitidez excepcional.",
    note: "Minha lente mais versátil — vai de making-of a fashion film.",
    tags: ["lente", "sony", "prime"],
    links: [
      { label: "Amazon BR", url: "#" },
      { label: "MercadoLivre", url: "#" },
    ],
  },
  {
    title: "Sony FE 85mm f/1.4 GM",
    thumbnail: "https://picsum.photos/seed/sony-85mm-gm/800/600",
    description: "Prime telefoto clássico para retratos e detalhe. Bokeh redondo e cremoso, rendimento incrível em baixa luz.",
    note: "Essencial para videoclipes e projetos que precisam de separação de plano.",
    tags: ["lente", "sony", "prime"],
    links: [
      { label: "Amazon BR", url: "#" },
      { label: "MercadoLivre", url: "#" },
    ],
  },

  // ── Áudio ────────────────────────────────────────────────────
  {
    title: "Rode Wireless GO II",
    thumbnail: "https://picsum.photos/seed/rode-wireless-go/800/600",
    description: "Sistema wireless compacto com dois transmissores, gravação interna e 200m de alcance.",
    note: "Indispensável para entrevistas e filmagens solo.",
    tags: ["áudio", "rode", "wireless"],
    links: [
      { label: "Amazon BR", url: "#" },
      { label: "Shopee", url: "#" },
      { label: "AliExpress", url: "#" },
    ],
  },
  {
    title: "DJI Mic 2",
    thumbnail: "https://picsum.photos/seed/dji-mic2/800/600",
    description: "Microfone wireless da DJI com case de carregamento, 250m de alcance e cancelamento de ruído.",
    note: "Ótima alternativa ao Rode — case de recarga é muito prático no dia a dia.",
    tags: ["áudio", "dji", "wireless"],
    links: [
      { label: "Amazon BR", url: "#" },
      { label: "AliExpress", url: "#" },
    ],
  },

  // ── Iluminação ───────────────────────────────────────────────
  {
    title: "Aputure Amaran 100D",
    thumbnail: "https://picsum.photos/seed/aputure-amaran-100d/800/600",
    description: "LED monolight de 100W, daylight 5600K, CRI 95+. Controle via Bluetooth pelo app Sidus Link.",
    note: "Custo-benefício excelente para key light em entrevistas e produtos.",
    tags: ["iluminação", "led", "aputure"],
    links: [
      { label: "Amazon BR", url: "#" },
      { label: "AliExpress", url: "#" },
    ],
  },
  {
    title: "Godox SL60IId",
    thumbnail: "https://picsum.photos/seed/godox-sl60iid/800/600",
    description: "LED de 60W bicolor (2800-6500K), silencioso, compatível com modificadores Bowens. Custo imbatível.",
    note: "Fill light e backlight que uso em studio. Muito mais acessível no AliExpress.",
    tags: ["iluminação", "led", "godox"],
    links: [
      { label: "Amazon BR", url: "#" },
      { label: "AliExpress", url: "#" },
      { label: "Shopee", url: "#" },
    ],
  },

  // ── Estabilização ────────────────────────────────────────────
  {
    title: "DJI RS 3",
    thumbnail: "https://picsum.photos/seed/dji-rs3-gimbal/800/600",
    description: "Gimbal de 3 eixos com estabilização OISA de segunda geração, payload de 3kg e tela touch embutida.",
    note: "Uso para planos fluidos e movimentos de câmera controlados.",
    tags: ["estabilizador", "dji"],
    links: [
      { label: "Amazon BR", url: "#" },
      { label: "MercadoLivre", url: "#" },
      { label: "AliExpress", url: "#" },
    ],
  },

  // ── Acessórios ───────────────────────────────────────────────
  {
    title: "SmallRig Cage — Sony FX3/FX30",
    thumbnail: "https://picsum.photos/seed/smallrig-cage-fx3/800/600",
    description: "Cage de alumínio para Sony FX3/FX30 com cold shoes, 1/4\" e 3/8\" threads e proteção completa do corpo.",
    note: "Essencial para montar microfone, monitor e follow focus sem improvisação.",
    tags: ["acessório", "smallrig", "rig"],
    links: [
      { label: "Amazon BR", url: "#" },
      { label: "AliExpress", url: "#" },
    ],
  },
  {
    title: "Kit ND K&F Concept (67mm)",
    thumbnail: "https://picsum.photos/seed/kf-nd-filter-kit/800/600",
    description: "Kit com ND8, ND64 e ND1000 — filtros essenciais para controlar exposição em externas com abertura aberta.",
    note: "Sem ND não tem f/1.4 à luz do dia. Kit custo-benefício no AliExpress.",
    tags: ["acessório", "filtro", "nd"],
    links: [
      { label: "Amazon BR", url: "#" },
      { label: "AliExpress", url: "#" },
      { label: "Shopee", url: "#" },
    ],
  },
  {
    title: "Samsung T7 Shield SSD",
    thumbnail: "https://picsum.photos/seed/samsung-t7-ssd/800/600",
    description: "SSD portátil com até 2TB, leitura de 1050MB/s, resistente a água e queda. USB-C.",
    note: "Drive de campo que uso para backup imediato após cada dia de filmagem.",
    tags: ["armazenamento", "ssd", "samsung"],
    links: [
      { label: "Amazon BR", url: "#" },
      { label: "MercadoLivre", url: "#" },
    ],
  },

  // ── Software & Plugins ───────────────────────────────────────
  {
    title: "AEJuice Pack Manager",
    thumbnail: "https://picsum.photos/seed/aejuice-after-effects/800/600",
    description: "Plugin gratuito para After Effects com centenas de presets, transições e elementos de motion design.",
    note: "Free e essencial — uso diariamente no workflow.",
    tags: ["after effects", "plugin", "gratuito"],
    links: [
      { label: "Baixar grátis", url: "https://aejuice.com/free-after-effects-plugins/" },
    ],
  },
  {
    title: "Video Copilot FX Console",
    thumbnail: "https://picsum.photos/seed/fx-console-ae/800/600",
    description: "Plugin gratuito que adiciona busca rápida de efeitos no After Effects e salva combinações de efeitos com atalho.",
    note: "Pequeno mas muda completamente o workflow no AE. Totalmente gratuito.",
    tags: ["after effects", "plugin", "gratuito"],
    links: [
      { label: "Baixar grátis", url: "https://www.videocopilot.net/blog/2019/03/new-plug-in-fx-console-now-available/" },
    ],
  },

];
