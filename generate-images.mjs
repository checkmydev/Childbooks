/* ============================================================================
 * generate-images.mjs — Génère les illustrations IA dans /images.
 *
 * GRATUIT, SANS CLÉ API : utilise Pollinations.ai (modèle Flux).
 * L'app FONCTIONNE SANS ce script (illustrations SVG de secours) ; ce script
 * "upgrade" vers de vraies images IA. Dès qu'un PNG au bon nom existe,
 * l'app l'affiche automatiquement à la place du SVG.
 *
 * Utilisation :
 *   node generate-images.mjs                 # génère les images manquantes
 *   node generate-images.mjs --force         # régénère tout
 *   node generate-images.mjs --only=dragon-page3.png
 * ==========================================================================*/
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, "images");
const CFG = JSON.parse(await fs.readFile(path.join(IMG_DIR, "prompts.json"), "utf8"));

const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith("--only=")) || "").split("=")[1];
const force = args.includes("--force");

const KEYWORDS = { momo: "otter", gaston: "dragon", lila: "lila", firefly: "firefly", rabbit: "rabbit", fox: "fox", owl: "owl" };

function fullPrompt(page) {
  const chars = Object.entries(CFG.characters || {})
    .filter(([k]) => new RegExp(`\\b${KEYWORDS[k] || k}\\b`, "i").test(page.prompt))
    .map(([, desc]) => desc);
  const bible = chars.length ? ` Characters: ${chars.join("; ")}.` : "";
  return `${CFG.style}${bible} Scene: ${page.prompt}`;
}

async function fetchImage(prompt, seed) {
  const enc = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${enc}` +
    `?width=${CFG.width || 1024}&height=${CFG.height || 768}` +
    `&nologo=true&model=${CFG.model || "flux"}${seed != null ? `&seed=${seed}` : ""}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 150000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2000) throw new Error("image trop petite / vide");
    return buf;
  } finally {
    clearTimeout(t);
  }
}

async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Le niveau gratuit de Pollinations limite fortement le débit (HTTP 429).
// On envoie donc les requêtes UNE PAR UNE, avec un délai entre chaque, et un
// backoff renforcé sur 429.
const DELAY_MS = Number(process.env.DELAY_MS || 6000);

async function withRetry(fn, tries = 6) {
  let last;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); }
    catch (e) {
      last = e;
      const is429 = /429/.test(e.message);
      const wait = is429 ? Math.min(60000, 12000 * (i + 1)) : 3000 * (i + 1);
      if (i < tries - 1) await sleep(wait);
    }
  }
  throw last;
}

let done = 0, skipped = 0, failed = 0;
const pages = CFG.pages.filter((p) => !only || p.file === only);

for (const page of pages) {
  const dest = path.join(IMG_DIR, page.file);
  if (!force && (await exists(dest))) { console.log(`⏭️  ${page.file} (existe déjà)`); skipped++; continue; }
  try {
    const buf = await withRetry(() => fetchImage(fullPrompt(page), page.seed));
    await fs.writeFile(dest, buf);
    console.log(`🎨 ${page.file} ✓ (${(buf.length / 1024).toFixed(0)} Ko)`);
    done++;
  } catch (e) {
    console.log(`❌ ${page.file} : ${e.message}`);
    failed++;
  }
  await sleep(DELAY_MS); // espace les requêtes pour éviter le 429
}

console.log(`\n✅ Images : ${done} générée(s), ${skipped} ignorée(s), ${failed} échec(s).`);
