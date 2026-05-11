// ============================================================
//  RECURSOS — duas seções:
//
//  PINNED   → aparecem SEMPRE primeiro, na ordem definida aqui.
//             Use para links prioritários (referrals, ferramentas, etc.)
//
//  RESOURCES → embaralhados a cada visita, experiência dinâmica.
//              Use para vídeos, referências e conteúdo geral.
//
//  Tipo: auto-detectado pela URL (YouTube = vídeo, resto = link)
//         Para imagens ou downloads, adicione: type: "image" | "download"
//  Categorias: "referencias" | "tutoriais" | "processo" | "links" | "download"
// ============================================================


// ── FIXOS — sempre no topo, na ordem abaixo ─────────────────
const PINNED = [

  {
    cat: "links",
    title: "Epidemic Sound — Biblioteca de Música",
    url: "https://share.epidemicsound.com/f2rtl9",
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    description: "A melhor biblioteca de música e efeitos sonoros para criadores. Use meu link de referral para testar grátis.",
    tags: ["música", "áudio", "ferramenta"],
  },
  {
    cat: "links",
    title: "Vipz's Expression Bundle",
    url: "https://vipsz.gumroad.com/l/hsINu",
    description: "Script para After Effects do Vipz que aplica as expressões mais usadas por Motion Designers com um clique — LoopOut, Wiggle, Overshoot, Fade In/Out, Type In e Squish & Stretch.",
    tags: ["after effects", "motion design", "ferramenta"],
  },
  {
    cat: "links",
    title: "Art of the Title",
    url: "https://artofthetitle.com",
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    description: "O site definitivo para análises aprofundadas das melhores sequências de abertura do cinema e TV.",
    tags: ["títulos", "motion design", "cinematografia", "curadoria"],
  },
  {
    cat: "links",
    title: "Are.na — Art of the Title (curadoria)",
    url: "https://www.are.na/theo-marielle/art-of-the-title",
    thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    description: "Coleção curada no Are.na com referências de design de títulos e sequências de créditos cinematográficos.",
    tags: ["títulos", "motion design", "curadoria"],
  },
  {
    cat: "links",
    title: "Vimeo Staff Picks",
    url: "https://vimeo.com/channels/staffpicks",
    thumbnail: "https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=800&q=80",
    description: "Curadoria editorial do Vimeo — o melhor de short film, comercial e video art selecionado pela equipe.",
    tags: ["curadoria", "short film", "publicidade"],
  },
];


// ── ALEATÓRIOS — embaralhados a cada visita ──────────────────
const RESOURCES = [


  {
    cat: "referencias",
    title: "Lay's Chip Cam with David Beckham & Thierry Henry",
    url: "https://www.youtube.com/watch?v=LLJ38OdS_q8",
    description: "Campanha publicitária da Lay's com câmera escondida estrelando Beckham e Thierry Henry. Execução leve, timing perfeito.",
    tags: ["publicidade", "direção"],
  },
  {
    cat: "referencias",
    title: "Defy — On Spec Ad (Sony Venice + FX3 + Freefly Ember)",
    url: "https://www.youtube.com/watch?v=w0PkvfJ-uBg",
    description: "Spec ad cinematográfico rodado com Sony Venice, FX3 e drone Ember. Showcase técnico e estético de alto nível.",
    tags: ["publicidade", "cinematografia"],
  },
  {
    cat: "referencias",
    title: "ArrDee — Different ft. The Shapeshifters",
    url: "https://www.youtube.com/watch?v=6meAaX907to",
    description: "Videoclipe do rapper britânico ArrDee em parceria com The Shapeshifters. Produção visual densa e bem construída.",
    tags: ["videoclipe", "direção"],
  },
  {
    cat: "referencias",
    title: "Como produzimos 4 Reels para um restaurante em 1 dia só",
    url: "https://www.youtube.com/watch?v=T70A0yeBNLU",
    description: "Produção acelerada de conteúdo: como planejar e executar 4 reels para um cliente em um único dia de gravação.",
    tags: ["produção", "behind the scenes", "processo criativo"],
  },
  {
    cat: "referencias",
    title: "Cinematic Fashion Film — Beyond Space (Sony Venice + Leica R)",
    url: "https://www.youtube.com/watch?v=xKha-MXPKTQ",
    description: "Fashion film cinematográfico com combinação de Sony Venice e lentes Leica R. Estética limpa e atmosfera forte.",
    tags: ["fashion film", "cinematografia"],
  },
  {
    cat: "referencias",
    title: "Sempre Forza Ferrari",
    url: "https://www.youtube.com/watch?v=rvpD9e-wPBk",
    description: "Comercial emotivo em homenagem à história da Ferrari nas corridas. Direção e montagem impecáveis.",
    tags: ["publicidade", "direção", "edição"],
  },
  {
    cat: "referencias",
    title: "Young Miko — WASSUP (Official)",
    url: "https://www.youtube.com/watch?v=LEhTlLnOVDU",
    description: "Videoclipe oficial de Young Miko. Visual arrojado com referências de estética latina contemporânea.",
    tags: ["videoclipe", "direção"],
  },
  {
    cat: "referencias",
    title: "NEMZZZ — PTSD (Official Video)",
    url: "https://www.youtube.com/watch?v=oojBNXKtE9M",
    description: "Videoclipe oficial do rapper britânico NEMZZZ. Narrativa visual densa com linguagem cinematográfica marcante.",
    tags: ["videoclipe", "direção", "cinematografia"],
  },
  {
    cat: "referencias",
    title: "Kidwild — Redemption ft. Nemzzz",
    url: "https://www.youtube.com/watch?v=MYHrk_6qky8",
    description: "Videoclipe de Kidwild em feat com Nemzzz. Produção visual coesa com bom uso de locações e iluminação.",
    tags: ["videoclipe", "direção", "iluminação"],
  },
  {
    cat: "referencias",
    title: "The Next Chapter — First US Female Fitness Athlete of Red Bull",
    url: "https://www.youtube.com/watch?v=i0KBwYzivmc",
    description: "Produção documental cinematográfica da Red Bull. Storytelling atlético com direção e fotografia de alto nível.",
    tags: ["documentário", "cinematografia"],
  },
  {
    cat: "referencias",
    title: "Interplanetary Criminal — No Time feat. Sadboi (Official Video)",
    url: "https://www.youtube.com/watch?v=XVzxU5HNwtk",
    description: "Videoclipe oficial com estética visual marcante — na linha dos outros UK artists da coleção.",
    tags: ["videoclipe", "direção"],
  },

  {
    cat: "tutoriais",
    title: "How to Animate Maps Like VOX — After Effects Tutorial",
    url: "https://www.youtube.com/watch?v=8Xxxd7me-oc",
    description: "Tutorial de After Effects ensinando a animar mapas no estilo editorial do canal VOX.",
    tags: ["after effects", "motion design"],
  },
  {
    cat: "tutoriais",
    title: "A Simple Guide to Depth of Field",
    url: "https://www.youtube.com/watch?v=34jkJoN8qOI",
    description: "Guia direto e prático sobre profundidade de campo: o que é, como controlar e quando usar.",
    tags: ["cinematografia"],
  },
  {
    cat: "tutoriais",
    title: "What is Dynamic Range? — Video Tech Explained",
    url: "https://www.youtube.com/watch?v=FTXMx8ij_Nw",
    description: "Explicação clara e visual sobre alcance dinâmico em câmeras: como afeta a imagem e como aproveitar ao máximo.",
    tags: ["cinematografia"],
  },
  {
    cat: "tutoriais",
    title: "Color Spaces: Explained from the Ground Up",
    url: "https://www.youtube.com/watch?v=99v96TL-tuY",
    description: "Do básico ao avançado: como funcionam os espaços de cor em vídeo — Rec.709, Log, RAW e tudo mais.",
    tags: ["color grading"],
  },
  {
    cat: "tutoriais",
    title: "Color Theory — SULA LIVES",
    url: "https://www.youtube.com/watch?v=VbJtLQPj4go",
    description: "Fundamentos de teoria das cores aplicados à criação visual: como cores se relacionam e criam emoção.",
    tags: ["color grading"],
  },
  {
    cat: "tutoriais",
    title: "The Amazing Math Behind Colors!",
    url: "https://www.youtube.com/watch?v=gnUYoQ1pwes",
    description: "A matemática por trás da percepção de cor, espaços de cor e como os displays representam o espectro visível.",
    tags: ["color grading"],
  },
  {
    cat: "tutoriais",
    title: "Hide Your Audio Cuts With This Method in DaVinci Resolve",
    url: "https://www.youtube.com/watch?v=d2RRrqNzmWg",
    description: "Técnica para mascarar cortes bruscos de áudio no DaVinci Resolve e deixar a trilha mais fluida.",
    tags: ["davinci resolve", "áudio", "edição"],
  },
  {
    cat: "tutoriais",
    title: "How the 'Severance' Editor Cut the Finale Like a Music Video",
    url: "https://www.youtube.com/watch?v=eGkfByNEcw0",
    description: "Análise de como o editor de Severance usou ritmo e música para montar o finale como se fosse um videoclipe.",
    tags: ["análise", "edição"],
  },
  {
    cat: "tutoriais",
    title: "Beat the Compression! How to Get Better YouTube Uploads",
    url: "https://www.youtube.com/watch?v=DI1BjkmVhTg",
    description: "Como exportar e fazer upload para o YouTube com menos perda por compressão — configurações práticas.",
    tags: ["produção", "edição"],
  },
  {
    cat: "tutoriais",
    title: "Mastering Skin Tones with Balance DCTL for DaVinci Resolve",
    url: "https://www.youtube.com/watch?v=_wpinhILzgg",
    description: "Workflow para corrigir e equalizar tons de pele usando o DCTL Balance no DaVinci Resolve.",
    tags: ["davinci resolve", "color grading"],
  },
  {
    cat: "tutoriais",
    title: "Inside the Live Session: Billie Eilish — 'Birds of a Feather' com Aron Forbes",
    url: "https://www.youtube.com/watch?v=5CgR3UH1txU",
    description: "Bastidores do mix ao vivo de 'Birds of a Feather' da Billie Eilish com o mixer Aron Forbes — processo e decisões técnicas.",
    tags: ["áudio", "behind the scenes"],
  },
  {
    cat: "tutoriais",
    title: "Color Correction for Concert Lighting — Fixing Extreme Tints in Lightroom",
    url: "https://www.youtube.com/watch?v=_R2cUv61s7I",
    description: "Como corrigir dominantes de cor extremas causadas por iluminação de shows e concertos no Lightroom.",
    tags: ["color grading", "iluminação"],
  },
  {
    cat: "tutoriais",
    title: "The \"Geometry\" of Colours",
    url: "https://www.youtube.com/watch?v=7KYwi2F5Ce4",
    description: "Como a geometria dos espaços de cor define as relações entre cores — uma perspectiva matemática e visual.",
    tags: ["color grading"],
  },
  {
    cat: "tutoriais",
    title: "Why The Bear Gets In Your Head",
    url: "https://www.youtube.com/watch?v=Lca_XEoO4b8",
    description: "Análise do que torna The Bear tão impactante: edição, direção e som trabalhando juntos de forma cirúrgica.",
    tags: ["análise", "edição", "direção"],
  },
  {
    cat: "tutoriais",
    title: "How To Get a Commercial Look in DaVinci Resolve",
    url: "https://www.youtube.com/watch?v=gZXIfcm2KR8",
    description: "Workflow completo para alcançar um look publicitário limpo e polido direto no DaVinci Resolve.",
    tags: ["davinci resolve", "color grading", "publicidade"],
  },
  {
    cat: "tutoriais",
    title: "How To Edit Documentaries Like James Jani",
    url: "https://www.youtube.com/watch?v=bwz-jLZz2w8",
    description: "Como estruturar, narrar e editar documentários no estilo de James Jani — ritmo, storytelling e recursos visuais.",
    tags: ["edição", "documentário", "processo criativo"],
  },
  {
    cat: "tutoriais",
    title: "Direção de Fotografia em Publicidade, Clipes e Ficção — feat. Victor Alencar",
    url: "https://www.youtube.com/watch?v=x3s0kMgSiMY",
    description: "Conversa aprofundada sobre como a direção de fotografia se adapta a diferentes formatos audiovisuais com Victor Alencar.",
    tags: ["cinematografia", "direção", "entrevista"],
  },
  {
    cat: "tutoriais",
    title: "Why You Should Care About Lighting Ratios",
    url: "https://www.youtube.com/watch?v=U4egvCgW7qc",
    description: "Por que dominar ratios de iluminação muda completamente a qualidade e o controle sobre a sua imagem.",
    tags: ["iluminação", "cinematografia"],
  },
  {
    cat: "tutoriais",
    title: "One-Man Videographer: How to Shoot, Price & Deliver a Corporate Video",
    url: "https://www.youtube.com/watch?v=NJBznivKoTg",
    description: "Como filmar, precificar e entregar vídeo corporativo trabalhando sozinho — do orçamento à entrega.",
    tags: ["carreira", "produção", "negócios"],
  },
  {
    cat: "tutoriais",
    title: "How I Made Over $200,000 As a Filmmaker Last Year",
    url: "https://www.youtube.com/watch?v=n0Afhmb1-ag",
    description: "Relato detalhado de como um filmmaker independente faturou mais de $200k — fontes de renda, estratégias e mentalidade.",
    tags: ["carreira", "negócios"],
  },
  {
    cat: "tutoriais",
    title: "\"This Was Expensive\" — Commercial Breakdown with Oliver Millar",
    url: "https://www.youtube.com/watch?v=0hrsMdpWsBw",
    description: "O cinematógrafo Oliver Millar detalha os bastidores de um comercial de alto orçamento para a On Running com Zendaya — iluminação com SkyPanel, Sony Venice, filosofia de set e carreira.",
    tags: ["análise", "cinematografia", "publicidade", "iluminação"],
  },
  {
    cat: "tutoriais",
    title: "How IMAX 70MM Film is Projected!",
    url: "https://www.youtube.com/watch?v=7S_geBV5bLQ",
    description: "Adam Savage explora os bastidores da IMAX para mostrar o processo monumental de montar e projetar filmes em 70mm — dos rolos de centenas de quilos à cabine de projeção.",
    tags: ["cinematografia"],
  },
  {
    cat: "tutoriais",
    title: "How IMAX 70MM Film is Scanned and Printed!",
    url: "https://www.youtube.com/watch?v=SYkAWTmpTBc",
    description: "Adam Savage visita a IMAX para entender como filmes 70mm são digitalizados e reimpresos em película — mostrando como analógico e digital coexistem no cinema de alta fidelidade.",
    tags: ["cinematografia"],
  },
  {
    cat: "tutoriais",
    title: "THE CLEANEST WAY To Grade Teal & Orange — Ozark Look",
    url: "https://www.youtube.com/watch?v=SnqE7UtEErU",
    description: "Danny Gan ensina a aplicar o visual teal & orange no estilo Ozark no DaVinci Resolve usando nós paralelos — sem qualifiers, sem máscaras, com proteção limpa dos tons de pele.",
    tags: ["davinci resolve", "color grading"],
  },
  {
    cat: "tutoriais",
    title: "Lighting Spaces. Not Faces!",
    url: "https://www.youtube.com/watch?v=ptyewwtjBpo",
    description: "Blaine Westropp defende iluminar o ambiente em vez do rosto — como entender a motivação da luz no espaço resulta em imagens mais naturais, imersivas e cinematográficas.",
    tags: ["iluminação", "cinematografia"],
  },

  {
    cat: "processo",
    title: "Eduardo Marinho — Vencer, vencer, vencer, para quê?",
    url: "https://www.youtube.com/watch?v=j72UPe2qnV4",
    description: "Eduardo Marinho reflete sobre o sentido real de vencer e o que de fato importa na jornada criativa.",
    tags: ["mindset", "processo criativo", "carreira"],
  },
  {
    cat: "processo",
    title: "Behind the Scenes of Lil Yachty's \"Murda\" Music Video",
    url: "https://www.youtube.com/watch?v=uGRfuxmK6ls",
    description: "Bastidores completos da produção do videoclipe 'Murda' de Lil Yachty — decisões criativas e de set.",
    tags: ["behind the scenes", "videoclipe", "produção", "processo criativo"],
  },
  {
    cat: "processo",
    title: "Observar e Absorver — Eduardo Marinho (Documentário Completo)",
    url: "https://www.youtube.com/watch?v=I7arqW5luKc",
    description: "Documentário completo de Eduardo Marinho sobre o ato de observar o mundo como combustível para a criatividade.",
    tags: ["documentário", "mindset", "processo criativo"],
  },
  {
    cat: "processo",
    title: "How I Fixed My Attention Span",
    url: "https://www.youtube.com/watch?v=vYaNiC4kchg",
    description: "Como reconquistar foco e atenção em um mundo cheio de distrações — estratégias práticas e honestas.",
    tags: ["mindset", "processo criativo"],
  },
  {
    cat: "processo",
    title: "About Finishing What You Started",
    url: "https://www.youtube.com/watch?v=RH7VZVKTzac",
    description: "Reflexão sobre a importância de terminar o que se começa — e por que a maioria dos projetos criativos morre no meio.",
    tags: ["mindset", "processo criativo"],
  },
  {
    cat: "processo",
    title: "Navigating the Matrix",
    url: "https://www.youtube.com/watch?v=Pdp3p23P-TI",
    description: "Casey Neistat propõe uma reflexão sobre produtividade através de uma 'Matriz de Prioridades' dividida em quatro quadrantes — e por que fazer muito não significa realizar de verdade.",
    tags: ["mindset", "processo criativo", "carreira"],
  },

];
