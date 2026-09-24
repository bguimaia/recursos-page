// Gera prototipo/meta.js: { videoId: { added: "AAAA-MM-DD", dur: segundos } }
// added = primeiro commit que introduziu o id (data.js ou resources.js).
// dur   = Runtime do metadata do MarkItDown (_transcripts/<id>.md), quando existe.
// ponytail: roda uma vez pro protótipo; no site final o inbox grava `added` direto no item.
const { execSync } = require("child_process");
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");

const log = execSync('git log --reverse --format="__%cs" -p -- data.js resources.js', { cwd: root, maxBuffer: 64 << 20 }).toString();
const added = {};
let date = null;
for (const line of log.split("\n")) {
  if (line.startsWith("__")) { date = line.slice(2).trim(); continue; }
  if (!line.startsWith("+")) continue;
  for (const m of line.matchAll(/v=([\w-]{11})/g)) if (!added[m[1]]) added[m[1]] = date;
}

const iso = s => { const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(s || ""); return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : null; };
const meta = {};
for (const [id, d] of Object.entries(added)) {
  const f = path.join(root, "_transcripts", id + ".md");
  const rt = fs.existsSync(f) ? (fs.readFileSync(f, "utf8").match(/\*\*Runtime:\*\*\s*(PT\S+)/) || [])[1] : null;
  meta[id] = { added: d, dur: iso(rt) };
}
fs.writeFileSync(path.join(__dirname, "meta.js"), "const META = " + JSON.stringify(meta, null, 1) + ";\n");
const withDur = Object.values(meta).filter(m => m.dur).length;
console.log("ids:", Object.keys(meta).length, "| com duração:", withDur);
