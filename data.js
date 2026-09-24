// ============================================================
//  data.js: PINNED ("Também recomendo") e GEAR (equipamento).
//
//  PINNED: links fixos, na ordem definida aqui. Rótulo pelas tags:
//          "afiliado" = rende dinheiro, "indicação" = rende crédito.
//          Os dois saem com rel="sponsored" e o texto diz o que a pessoa ganha.
//
//  RESOURCES (vídeos): ver resources.js
// ============================================================

const PINNED = [

  {
    cat: "links",
    title: "Epidemic Sound: Biblioteca de Música",
    url: "https://share.epidemicsound.com/f2rtl9",
    description: "Música e efeitos sonoros pra vídeo. Link de indicação: se você assinar depois do teste grátis, eu ganho créditos.",
    tags: ["música", "áudio", "ferramenta", "indicação"],
  },
  {
    cat: "links",
    title: "Husky: Receber do Exterior",
    url: "https://www.husky.io?ref=ntllnwu",
    description: "Conta que uso pra receber de clientes de fora do Brasil. Link de afiliado: seu primeiro recebimento sai sem taxa e eu ganho comissão.",
    tags: ["finanças", "freelance", "ferramenta", "afiliado"],
  },
  {
    cat: "download",
    type: "download",
    title: "GhostSweep",
    url: "https://github.com/bguimaia/ghostsweep",
    mine: true,
    description: "Ferramenta que criei para limpar ghost files do macOS (.DS_Store, ._*) no Windows. Script PowerShell com interface gráfica, sem instalação: escaneia pastas, mostra prévia e manda pra lixeira.",
    tags: ["windows", "utilitário", "ferramenta"],
  },
  {
    cat: "download",
    type: "download",
    title: "Vipz's Expression Bundle",
    url: "https://vipsz.gumroad.com/l/hsINu",
    description: "Script para After Effects do Vipz que aplica as expressões mais usadas por Motion Designers com um clique: LoopOut, Wiggle, Overshoot, Fade In/Out, Type In e Squish & Stretch.",
    tags: ["after effects", "motion design", "ferramenta"],
  },
  {
    cat: "links",
    title: "Vimeo Staff Picks",
    url: "https://vimeo.com/channels/staffpicks",
    description: "Curadoria editorial do Vimeo: o melhor de short film, comercial e video art selecionado pela equipe.",
    tags: ["curadoria", "short film", "publicidade"],
  },
];


// Vídeo em destaque no topo ("Se for ver um só"): id do YouTube. Trocar aqui, sem mexer no HTML.
const FEATURED = "1GEqDZ3hQSo";


// Equipamento: vazio até existirem os links reais (Amazon Associados e Mercado Livre, por produto).
// A lista antiga (dormente, com textos provisórios) está no histórico do git. O site hoje não usa GEAR.
const GEAR = [];
