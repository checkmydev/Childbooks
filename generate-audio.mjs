/* ============================================================================
 * generate-audio.mjs — Génère les narrations audio dans /audio.
 *
 * GRATUIT, SANS CLÉ API : utilise edge-tts (voix neuronales Microsoft).
 * Prérequis : Python + `pip install edge-tts`.
 *
 * L'app FONCTIONNE SANS ce script (elle utilise alors la voix du navigateur) ;
 * ce script "upgrade" vers une belle voix neuronale. Dès qu'un MP3 au bon nom
 * existe dans /audio, l'app le joue automatiquement.
 *
 * Utilisation :
 *   node generate-audio.mjs                 # génère les MP3 manquants
 *   node generate-audio.mjs --force         # régénère tout
 *   node generate-audio.mjs --only=dragon-page3
 *
 * Voix / rythme (modifiables via variables d'environnement) :
 *   VOICE=fr-FR-DeniseNeural   RATE=-8%
 *   (autres voix FR : fr-FR-EloiseNeural, fr-FR-VivienneMultilingualNeural,
 *    fr-FR-HenriNeural, fr-FR-RemyMultilingualNeural)
 * ==========================================================================*/
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = path.join(__dirname, "audio");
const PY = process.env.PYTHON || "python";
const VOICE = process.env.VOICE || "fr-FR-DeniseNeural";
const RATE = process.env.RATE || "-8%";

const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith("--only=")) || "").split("=")[1];
const force = args.includes("--force");

await fs.mkdir(AUDIO_DIR, { recursive: true });

function baseName(page) { return page.image.replace(/\.png$/i, ""); }

async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }

// AUDIO_LIST permet de fournir une liste [{file, text}] au lieu des histoires
// (ex: audio/phonics-audio.json pour les sons/syllabes/mots).
async function buildJobs() {
  if (process.env.AUDIO_LIST) {
    const list = JSON.parse(await fs.readFile(path.resolve(__dirname, process.env.AUDIO_LIST), "utf8"));
    return list
      .filter((e) => !only || e.file === only)
      .map((e) => ({ name: e.file, text: e.text, dest: path.join(AUDIO_DIR, `${e.file}.mp3`) }));
  }
  const storiesCode = await fs.readFile(path.join(__dirname, "js", "stories.js"), "utf8");
  const win = {};
  new Function("window", storiesCode)(win);
  const out = [];
  for (const story of win.STORIES) {
    for (const page of story.pages) {
      const name = baseName(page);
      if (only && name !== only) continue;
      out.push({ name, text: page.text, dest: path.join(AUDIO_DIR, `${name}.mp3`) });
    }
  }
  return out;
}

function synth(text, dest) {
  return new Promise((resolve, reject) => {
    // NB : --rate=-8% doit utiliser la forme "=" sinon argparse prend "-8%" pour un flag.
    const p = spawn(PY, ["-m", "edge_tts", "--voice", VOICE, `--rate=${RATE}`, "--text", text, "--write-media", dest], { stdio: "ignore" });
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`edge-tts code ${code}`))));
  });
}

const jobs = await buildJobs();

let done = 0, skipped = 0, failed = 0;
for (const j of jobs) {
  if (!force && (await exists(j.dest))) { console.log(`⏭️  ${j.name}.mp3 (existe déjà)`); skipped++; continue; }
  try {
    await synth(j.text, j.dest);
    const st = await fs.stat(j.dest);
    console.log(`🔊 ${j.name}.mp3 ✓ (${(st.size / 1024).toFixed(0)} Ko)`);
    done++;
  } catch (e) {
    console.log(`❌ ${j.name}.mp3 : ${e.message}`);
    failed++;
  }
}

console.log(`\n✅ Audio : ${done} généré(s), ${skipped} ignoré(s), ${failed} échec(s). Voix ${VOICE}.`);
