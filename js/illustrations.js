/* ============================================================================
 * illustrations.js — Moteur d'illustrations SVG "storybook" (style flat).
 * Chaque scène renvoie une chaîne SVG (viewBox 0 0 800 600), 100% offline.
 * Les histoires référencent une scène par sa clé (voir SCENES en bas).
 * ==========================================================================*/

/* ---------- Helpers ---------- */
const rnd = (seed) => {
  // Générateur pseudo-aléatoire déterministe (pour des positions stables).
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

function gradient(id, stops, dir = "v") {
  const coords = dir === "v"
    ? 'x1="0" y1="0" x2="0" y2="1"'
    : 'x1="0" y1="0" x2="1" y2="0"';
  const s = stops.map((c, i) =>
    `<stop offset="${(i / (stops.length - 1) * 100).toFixed(0)}%" stop-color="${c}"/>`
  ).join("");
  return `<linearGradient id="${id}" ${coords}>${s}</linearGradient>`;
}

function stars(seed, count = 40, maxY = 320) {
  const r = rnd(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = (r() * 800).toFixed(0);
    const y = (r() * maxY).toFixed(0);
    const rad = (r() * 1.6 + 0.6).toFixed(1);
    const o = (r() * 0.6 + 0.4).toFixed(2);
    out += `<circle cx="${x}" cy="${y}" r="${rad}" fill="#fff" opacity="${o}"/>`;
  }
  return out;
}

function hills(y, color, wobble = 60) {
  return `<path d="M0 ${y} Q 200 ${y - wobble} 400 ${y} T 800 ${y} V600 H0 Z" fill="${color}"/>`;
}

function tree(x, y, s = 1, trunk = "#8a5a3b", leaf = "#4faa5a", leaf2 = "#3c8f4a") {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-9" y="0" width="18" height="60" rx="8" fill="${trunk}"/>
    <circle cx="0" cy="-30" r="52" fill="${leaf}"/>
    <circle cx="-38" cy="0" r="40" fill="${leaf2}"/>
    <circle cx="38" cy="0" r="40" fill="${leaf2}"/>
    <circle cx="0" cy="10" r="46" fill="${leaf}"/>
  </g>`;
}

function pineTree(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-8" y="40" width="16" height="40" rx="6" fill="#7a4f34"/>
    <polygon points="0,-70 -46,20 46,20" fill="#2f7d4f"/>
    <polygon points="0,-40 -54,50 54,50" fill="#3a8f5a"/>
  </g>`;
}

function flower(x, y, s = 1, petal = "#ff7eb6", center = "#ffd94a") {
  const p = [0, 72, 144, 216, 288].map(a =>
    `<ellipse cx="0" cy="-20" rx="10" ry="18" fill="${petal}" transform="rotate(${a})"/>`
  ).join("");
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-3" y="0" width="6" height="60" rx="3" fill="#4faa5a"/>
    <g transform="translate(0 0)">${p}<circle r="12" fill="${center}"/></g>
  </g>`;
}

function bigStar(x, y, s = 1, color = "#ffe066") {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 40 : 17;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle r="55" fill="${color}" opacity="0.25"/>
    <polygon points="${pts.join(" ")}" fill="${color}" stroke="#f4b400" stroke-width="2"/>
  </g>`;
}

function moon(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle r="46" fill="#fdf6c8"/>
    <circle cx="-14" cy="-8" r="8" fill="#f0e7a8"/>
    <circle cx="10" cy="12" r="6" fill="#f0e7a8"/>
    <circle cx="16" cy="-14" r="4" fill="#f0e7a8"/>
  </g>`;
}

function sun(x, y, s = 1) {
  let rays = "";
  for (let i = 0; i < 12; i++) {
    const a = (i * 30) * Math.PI / 180;
    rays += `<line x1="${Math.cos(a) * 58}" y1="${Math.sin(a) * 58}" x2="${Math.cos(a) * 82}" y2="${Math.sin(a) * 82}" stroke="#ffcf40" stroke-width="7" stroke-linecap="round"/>`;
  }
  return `<g transform="translate(${x} ${y}) scale(${s})">${rays}<circle r="48" fill="#ffd94a"/></g>`;
}

function cloud(x, y, s = 1, color = "#ffffff") {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="46" ry="30" fill="${color}"/>
    <ellipse cx="-40" cy="8" rx="34" ry="24" fill="${color}"/>
    <ellipse cx="40" cy="8" rx="34" ry="24" fill="${color}"/>
  </g>`;
}

function face(happy = true, eyeColor = "#2b2b2b") {
  const mouth = happy
    ? `<path d="M-10 6 Q 0 18 10 6" stroke="#7a3b2b" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M-9 12 Q 0 4 9 12" stroke="#7a3b2b" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return `<circle cx="-9" cy="-4" r="4" fill="${eyeColor}"/>
          <circle cx="9" cy="-4" r="4" fill="${eyeColor}"/>
          <circle cx="-14" cy="6" r="5" fill="#ff9db0" opacity="0.6"/>
          <circle cx="14" cy="6" r="5" fill="#ff9db0" opacity="0.6"/>${mouth}`;
}

/* ---------- Personnages ---------- */
function otter(x, y, s = 1, happy = true) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="70" rx="46" ry="30" fill="#8a5a3b"/>
    <ellipse cx="0" cy="20" rx="40" ry="46" fill="#9a6a45"/>
    <ellipse cx="0" cy="34" rx="26" ry="30" fill="#c99a6a"/>
    <circle cx="0" cy="-24" r="34" fill="#9a6a45"/>
    <ellipse cx="0" cy="-14" rx="22" ry="18" fill="#c99a6a"/>
    <circle cx="-22" cy="-46" r="12" fill="#8a5a3b"/>
    <circle cx="22" cy="-46" r="12" fill="#8a5a3b"/>
    <ellipse cx="0" cy="-10" rx="8" ry="6" fill="#5a3a26"/>
    <g transform="translate(0 -26)">${face(happy)}</g>
  </g>`;
}

function dragon(x, y, s = 1, happy = false, color = "#7bc47f") {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M40 40 Q 90 20 96 70 Q 70 66 60 50 Z" fill="${color}"/>
    <ellipse cx="0" cy="40" rx="52" ry="40" fill="${color}"/>
    <ellipse cx="0" cy="52" rx="34" ry="26" fill="#d8f0c0"/>
    <circle cx="0" cy="-20" r="40" fill="${color}"/>
    <polygon points="-30,-48 -22,-70 -14,-48" fill="#5aa060"/>
    <polygon points="30,-48 22,-70 14,-48" fill="#5aa060"/>
    <polygon points="-6,-52 0,-78 6,-52" fill="#5aa060"/>
    <ellipse cx="0" cy="-8" rx="20" ry="14" fill="#d8f0c0"/>
    <circle cx="-9" cy="-4" r="6" fill="#ffffff"/><circle cx="-9" cy="-4" r="3" fill="#2b2b2b"/>
    <circle cx="9" cy="-4" r="6" fill="#ffffff"/><circle cx="9" cy="-4" r="3" fill="#2b2b2b"/>
    <circle cx="-6" cy="-2" r="2" fill="#2b2b2b"/><circle cx="6" cy="-2" r="2" fill="#2b2b2b"/>
    ${happy
      ? `<path d="M-10 6 Q 0 16 10 6" stroke="#3a6b3f" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="0" cy="10" rx="6" ry="8" fill="#3a6b3f"/>`}
  </g>`;
}

function girl(x, y, s = 1, happy = true, dress = "#ff7eb6") {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-30 90 L-24 30 Q0 8 24 30 L30 90 Z" fill="${dress}"/>
    <rect x="-30" y="30" width="14" height="46" rx="7" fill="#f0c9a8"/>
    <rect x="16" y="30" width="14" height="46" rx="7" fill="#f0c9a8"/>
    <circle cx="0" cy="-14" r="30" fill="#f0c9a8"/>
    <path d="M-30 -18 Q -34 -50 0 -46 Q 34 -50 30 -18 Q 22 -34 0 -34 Q -22 -34 -30 -18 Z" fill="#6b4a2b"/>
    <path d="M-30 -18 Q -40 20 -30 40 L-22 36 Q -28 8 -24 -16 Z" fill="#6b4a2b"/>
    <path d="M30 -18 Q 40 20 30 40 L22 36 Q 28 8 24 -16 Z" fill="#6b4a2b"/>
    <g transform="translate(0 -12)">${face(happy)}</g>
  </g>`;
}

function critter(x, y, s = 1, type = "fox") {
  const cfg = {
    fox: { body: "#e8823a", belly: "#fff3e6", ear: "#c9662a" },
    rabbit: { body: "#d8d4d0", belly: "#ffffff", ear: "#c8c2bc" },
    owl: { body: "#8a6a4a", belly: "#e6d3b8", ear: "#6e523a" },
  }[type];
  const ears = type === "owl"
    ? `<polygon points="-24,-40 -30,-64 -12,-44" fill="${cfg.ear}"/><polygon points="24,-40 30,-64 12,-44" fill="${cfg.ear}"/>`
    : type === "rabbit"
      ? `<ellipse cx="-14" cy="-58" rx="9" ry="26" fill="${cfg.ear}"/><ellipse cx="14" cy="-58" rx="9" ry="26" fill="${cfg.ear}"/>`
      : `<polygon points="-30,-30 -40,-58 -14,-40" fill="${cfg.ear}"/><polygon points="30,-30 40,-58 14,-40" fill="${cfg.ear}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="40" rx="40" ry="42" fill="${cfg.body}"/>
    <ellipse cx="0" cy="50" rx="24" ry="28" fill="${cfg.belly}"/>
    ${ears}
    <circle cx="0" cy="-16" r="34" fill="${cfg.body}"/>
    <g transform="translate(0 -12)">${face(true)}</g>
  </g>`;
}

function firefly(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle r="16" fill="#fff3a0" opacity="0.35"/>
    <circle r="7" fill="#fff3a0"/>
    <circle r="3.5" fill="#fffde0"/>
  </g>`;
}

/* ---------- Décors de fond ---------- */
function skyDay(a = "#8fd3ff", b = "#d9f4ff") {
  return `<defs>${gradient("sd", [a, b])}</defs><rect width="800" height="600" fill="url(#sd)"/>`;
}
function skyNight(a = "#0f1b4c", b = "#3b2c6b") {
  return `<defs>${gradient("sn", [a, b])}</defs><rect width="800" height="600" fill="url(#sn)"/>${stars(7)}`;
}
function skySunset(a = "#ff9e6d", b = "#ffd98a") {
  return `<defs>${gradient("su", [a, "#ffb27a", b])}</defs><rect width="800" height="600" fill="url(#su)"/>`;
}

/* ---------- SCÈNES ---------- */
const SCENES = {
  /* --- Histoire 1 : Momo la loutre --- */
  loutre_riviere: () => `${skyDay()}${sun(120, 110, 0.9)}${cloud(560, 120, 1)}
    ${hills(360, "#a7e08a")}${tree(690, 250, 1.1)}
    <path d="M0 440 Q 400 400 800 440 V600 H0 Z" fill="#5fb3e0"/>
    <path d="M0 470 Q 200 455 400 470 T 800 470" stroke="#bfe6f7" stroke-width="4" fill="none" opacity="0.7"/>
    ${otter(360, 380, 1.2)}`,

  loutre_etoile: () => `${skyNight()}${moon(650, 110, 1)}
    ${bigStar(300, 250, 1.4)}
    <path d="M470 90 Q 380 180 320 230" stroke="#ffe066" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>
    ${hills(420, "#22315e")}${otter(400, 440, 1.1)}`,

  loutre_amis: () => `${skyDay("#a7dcff", "#e7f7ff")}${cloud(180, 100, 0.8)}${cloud(600, 140, 1)}
    ${hills(380, "#8fd67a")}
    ${otter(250, 400, 1)}${critter(430, 430, 0.9, "rabbit")}${critter(600, 420, 0.95, "fox")}
    ${bigStar(400, 150, 0.7)}`,

  loutre_maison: () => `${skySunset()}${sun(150, 130, 1)}
    ${hills(400, "#c98a5a")}${tree(120, 300, 0.9, "#7a4f34", "#e0a45a", "#c98a4a")}${tree(680, 320, 1, "#7a4f34", "#e0a45a", "#c98a4a")}
    <path d="M0 470 Q 400 440 800 470 V600 H0 Z" fill="#5fa0c0"/>
    ${otter(400, 420, 1.1)}`,

  /* --- Histoire 2 : Le dragon qui avait peur du noir --- */
  dragon_grotte_jour: () => `${skyDay("#9fd6ff", "#e7f6ff")}${sun(680, 110, 0.9)}
    ${hills(380, "#7db86a")}
    <path d="M120 600 L120 340 Q 260 200 400 340 L400 600 Z" fill="#6b5a4a"/>
    <ellipse cx="260" cy="420" rx="90" ry="120" fill="#2b2320"/>
    ${dragon(500, 380, 1, true)}`,

  dragon_noir: () => `<rect width="800" height="600" fill="#0a1226"/>
    <ellipse cx="400" cy="300" rx="420" ry="320" fill="#111c3a"/>
    ${dragon(400, 320, 1.3, false)}
    <text x="400" y="120" text-anchor="middle" font-size="40" fill="#33406a">?</text>`,

  dragon_luciole: () => `${skyNight("#101a3a", "#2a2456")}
    ${firefly(300, 240, 1.4)}${firefly(520, 200, 1)}${firefly(430, 320, 0.8)}${firefly(600, 300, 0.9)}
    ${hills(430, "#1a2348")}${dragon(360, 400, 1.1, true)}`,

  dragon_courage: () => `${skySunset("#ff8e5d", "#ffe08a")}${sun(650, 150, 1.1)}
    ${hills(420, "#3a6b3f")}${pineTree(120, 380, 1)}${pineTree(700, 400, 0.9)}
    ${dragon(400, 380, 1.2, true)}
    ${firefly(560, 240, 1)}`,

  /* --- Histoire 3 : Lila et la graine magique --- */
  lila_jardin: () => `${skyDay("#a7e0ff", "#eafaff")}${sun(120, 110, 1)}${cloud(560, 120, 0.9)}
    ${hills(400, "#8fd67a")}
    ${flower(140, 400, 1)}${flower(660, 410, 0.9, "#ff9db0")}
    ${girl(400, 360, 1.1)}
    <ellipse cx="400" cy="470" rx="14" ry="8" fill="#6b4a2b"/>`,

  lila_pluie: () => `${skyDay("#8aa0c8", "#c5d4e8")}${cloud(300, 110, 1.1, "#e8eef7")}${cloud(560, 90, 0.9, "#e8eef7")}
    ${(() => { const r = rnd(11); let s = ""; for (let i = 0; i < 40; i++) { const x = (r() * 800).toFixed(0); const y = (140 + r() * 260).toFixed(0); s += `<line x1="${x}" y1="${y}" x2="${x - 6}" y2="${+y + 18}" stroke="#9fc0e0" stroke-width="3" stroke-linecap="round"/>`; } return s; })()}
    ${hills(430, "#6fbf6a")}
    <g transform="translate(400 340)"><rect x="-4" y="-30" width="8" height="90" rx="4" fill="#4faa5a"/><path d="M0 -30 Q 30 -40 26 -12" stroke="#4faa5a" stroke-width="8" fill="none"/><ellipse cx="26" cy="-12" rx="10" ry="16" fill="#5cc46a"/></g>`,

  lila_pousse: () => `${skyDay()}${sun(660, 120, 1)}
    ${hills(410, "#7fce72")}
    ${girl(220, 360, 0.95)}
    <g transform="translate(520 330)">
      <rect x="-5" y="-10" width="10" height="80" rx="5" fill="#4faa5a"/>
      <ellipse cx="-26" cy="-6" rx="22" ry="12" fill="#5cc46a" transform="rotate(-20 -26 -6)"/>
      <ellipse cx="26" cy="-14" rx="22" ry="12" fill="#5cc46a" transform="rotate(20 26 -14)"/>
      ${flower(0, -60, 0.9, "#ffb04a", "#ff7a3a")}
    </g>`,

  lila_arbre: () => `${skySunset("#ffb06a", "#ffe6a0")}${sun(150, 140, 1)}
    ${hills(430, "#3a8f4a")}
    ${tree(400, 210, 2.2, "#7a4f34", "#4faa5a", "#3c8f4a")}
    ${girl(600, 400, 0.9)}
    ${flower(160, 440, 1)}${flower(260, 460, 0.8, "#ff9db0")}`,

  /* --- Histoire 4 : Les trois inventeurs de la forêt --- */
  invent_foret: () => `${skyDay("#9fd6ff", "#eafaff")}${cloud(180, 100, 0.9)}${sun(680, 110, 0.9)}
    ${hills(400, "#5fae55")}${pineTree(110, 330, 1.1)}${pineTree(700, 350, 1)}${tree(560, 340, 0.9)}
    ${critter(260, 400, 0.9, "fox")}${critter(400, 410, 0.9, "rabbit")}${critter(540, 400, 0.9, "owl")}`,

  invent_probleme: () => `${skyDay("#a7dcff", "#e7f7ff")}
    ${hills(360, "#5fae55")}
    <path d="M0 440 Q 400 400 800 440 V600 H0 Z" fill="#5fb3e0"/>
    <rect x="330" y="360" width="140" height="20" rx="8" fill="#8a5a3b"/>
    <text x="400" y="200" text-anchor="middle" font-size="60">🌊</text>
    ${critter(180, 400, 0.85, "fox")}${critter(620, 400, 0.85, "rabbit")}`,

  invent_machine: () => `${skyDay("#bfe6ff", "#f0fbff")}
    ${hills(410, "#5fae55")}
    <g transform="translate(400 300)">
      <rect x="-90" y="-40" width="180" height="120" rx="16" fill="#c98a4a"/>
      <circle cx="-50" cy="90" r="34" fill="#5a3a26"/><circle cx="-50" cy="90" r="12" fill="#c99a6a"/>
      <circle cx="50" cy="90" r="34" fill="#5a3a26"/><circle cx="50" cy="90" r="12" fill="#c99a6a"/>
      <rect x="-14" y="-70" width="28" height="34" rx="6" fill="#7a4f34"/>
      <circle cx="0" cy="-10" r="26" fill="#ffd94a"/>
      <path d="M-12 -10 L12 -10 M0 -22 L0 2" stroke="#c98a1a" stroke-width="5" stroke-linecap="round"/>
    </g>
    ${critter(120, 420, 0.8, "owl")}${critter(680, 420, 0.8, "fox")}`,

  invent_fete: () => `${skySunset("#ff9e6d", "#ffe6a0")}${sun(150, 140, 1)}
    ${hills(420, "#3a8f4a")}${pineTree(110, 380, 1)}${pineTree(700, 400, 0.9)}
    ${critter(260, 420, 0.9, "fox")}${critter(400, 430, 0.9, "rabbit")}${critter(540, 420, 0.9, "owl")}
    ${(() => { const r = rnd(21); let s = ""; const cols = ["#ff7eb6", "#ffd94a", "#7bc47f", "#8fd3ff", "#c78fff"]; for (let i = 0; i < 30; i++) { const x = (r() * 800).toFixed(0); const y = (r() * 240).toFixed(0); s += `<rect x="${x}" y="${y}" width="8" height="14" rx="2" fill="${cols[i % cols.length]}" transform="rotate(${(r() * 90).toFixed(0)} ${x} ${y})"/>`; } return s; })()}`,

  /* --- Couvertures --- */
  cover_loutre: () => `${skyNight("#12224f", "#3b2c6b")}${moon(640, 120, 0.9)}${bigStar(220, 220, 1.2)}
    <path d="M470 100 Q 360 200 260 250" stroke="#ffe066" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>
    ${hills(440, "#1c2b57")}${otter(400, 450, 1.1)}`,
  cover_dragon: () => `${skyNight("#101a3a", "#2a2456")}${firefly(220, 200, 1.2)}${firefly(600, 240, 1)}
    ${hills(430, "#1a2348")}${dragon(400, 380, 1.2, true)}`,
  cover_lila: () => `${skyDay("#a7e0ff", "#eafaff")}${sun(650, 120, 1)}${hills(430, "#7fce72")}
    ${tree(600, 250, 1.4)}${girl(300, 380, 1.1)}${flower(140, 440, 1)}`,
  cover_invent: () => `${skyDay("#9fd6ff", "#eafaff")}${sun(120, 110, 0.9)}${hills(420, "#5fae55")}${pineTree(660, 330, 1.1)}
    ${critter(250, 410, 0.95, "fox")}${critter(400, 420, 0.95, "rabbit")}${critter(550, 410, 0.95, "owl")}`,
};

/**
 * Renvoie le markup SVG complet d'une scène.
 * @param {string} key clé de scène
 * @returns {string} balise <svg> ... </svg>
 */
function renderScene(key) {
  const body = (SCENES[key] || SCENES.loutre_riviere)();
  return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img">${body}</svg>`;
}

window.Illustrations = { renderScene, SCENES };
