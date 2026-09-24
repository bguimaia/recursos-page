// node setkey.mjs — gera a chave do agente, salva em ~/.recursos-inbox-key e grava no Worker.
// A chave nunca aparece na tela. Rodar de novo = rotacionar.
import { randomBytes } from "node:crypto";
import { writeFileSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const file = join(homedir(), ".recursos-inbox-key");
const key = randomBytes(32).toString("hex");

// primeiro o Worker, depois o arquivo: se o upload falhar, agente e Worker continuam com a chave antiga
const config = join(dirname(fileURLToPath(import.meta.url)), "wrangler.toml");
execSync(`npx wrangler secret put API_KEY -c "${config}"`, { input: key, stdio: ["pipe", "inherit", "inherit"] });

writeFileSync(file, key, { encoding: "utf8" });
if (readFileSync(file, "utf8") !== key) throw new Error("arquivo gravado não confere: " + file);
console.log("chave salva em " + file);
