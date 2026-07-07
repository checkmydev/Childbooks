/* ============================================================================
 * app.js — Léo & les Sons. Application d'apprentissage de la lecture
 * (méthode phonique inspirée du principe des Alphas, personnages originaux).
 * Routeur de vues + 4 activités + 2 jeux + bibliothèque d'histoires (bonus).
 * ==========================================================================*/
(function () {
  "use strict";

  const { SOUNDS, VOWELS, CONSONANTS, WORDS, JOURNEY } = window.PHONICS;
  const V = document.getElementById("view");
  const ttsWarn = document.getElementById("ttsWarn");
  const homeBtn = document.getElementById("homeBtn");

  /* ---------- utils ---------- */
  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const soundById = (id) => SOUNDS.find((s) => s.id === id);
  const imgTag = (file, emoji, cls) =>
    `<span class="imgwrap ${cls || ""}"><span class="emoji-fallback">${emoji}</span>` +
    `<img src="images/${file}.png" alt="" onload="this.parentNode.classList.add('has-img')" onerror="this.remove()"></span>`;

  /* ---------- audio ---------- */
  const synth = window.speechSynthesis;
  const ttsSupported = !!synth && typeof SpeechSynthesisUtterance !== "undefined";
  let current = null; // Audio en cours

  function stopAudio() {
    if (current) { try { current.pause(); } catch (_) {} current = null; }
    if (ttsSupported) synth.cancel();
  }

  function speakText(text, onend) {
    if (!ttsSupported) { ttsWarn.hidden = false; if (onend) onend(); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR"; u.rate = 0.9; u.pitch = 1.1;
    if (onend) u.onend = onend;
    synth.cancel(); synth.speak(u);
  }

  // Joue une URL audio ; à défaut, prononce `fallbackText` (ou appelle onend).
  function playUrl(url, fallbackText, onend) {
    stopAudio();
    const a = new Audio(url);
    current = a;
    const done = () => { current = null; if (onend) onend(); };
    a.onended = done;
    a.onerror = () => { current = null; if (fallbackText) speakText(fallbackText, onend); else done(); };
    a.play().catch(() => { current = null; if (fallbackText) speakText(fallbackText, onend); else done(); });
  }

  // Joue audio/<file>.mp3 (syllabes, mots…) ; à défaut, prononce `fallbackText`.
  function play(file, fallbackText, onend) { playUrl(`audio/${file}.mp3`, fallbackText, onend); }

  // Joue le son d'une lettre enregistré par l'utilisateur (audio/pur-<lettre>.wav).
  // Pas de repli parlé pour les consonnes (éviterait de dire le NOM de la lettre) :
  // tant que l'enregistrement n'existe pas, on reste silencieux et on enchaîne.
  function playPhoneme(letter, onend) { playUrl(`audio/pur-${letter}.wav`, null, onend); }

  const bounce = (node) => { if (!node) return; node.classList.remove("pop"); void node.offsetWidth; node.classList.add("pop"); };

  /* ================= ROUTEUR ================= */
  function show(node) { stopAudio(); V.innerHTML = ""; V.appendChild(node); window.scrollTo(0, 0); }
  homeBtn.addEventListener("click", renderHome);

  /* ================= ACCUEIL ================= */
  function renderHome() {
    const cards = JOURNEY.map((j) => `
      <button class="journey-card" data-go="${j.id}">
        <span class="jc-num">${j.n}</span>
        <span class="jc-icon">${j.icon}</span>
        <span class="jc-body"><span class="jc-title">${j.title}</span><span class="jc-sub">${j.sub}</span></span>
        <span class="jc-arrow">→</span>
      </button>`).join("");
    const node = el(`<div class="home">
      <p class="hero">Bienvenue ! Apprends à lire pas à pas, en écoutant les sons. 🎧</p>
      <div class="journey">${cards}</div>
      <button class="bonus-btn" data-go="biblio">📖 Mes histoires <small>(pour s'entraîner à lire)</small></button>
    </div>`);
    node.addEventListener("click", (e) => {
      const go = e.target.closest("[data-go]");
      if (!go) return;
      const r = go.dataset.go;
      if (r === "sons") renderSons();
      else if (r === "lettres") renderLettres();
      else if (r === "fusion") renderFusion();
      else if (r === "mots") renderMots();
      else if (r === "jeux") renderJeux();
      else if (r === "biblio") renderBiblio();
    });
    show(node);
  }

  /* ================= 1) LES SONS (découverte) ================= */
  function renderSons() {
    const grid = SOUNDS.map((s) => `
      <button class="sound-card" data-id="${s.id}" style="--c:${s.color}">
        ${imgTag("son-" + s.letter, s.emoji, "round")}
        <span class="sound-letter">${s.letter}</span>
      </button>`).join("");
    const node = el(`<div class="page">
      <h2 class="page-h">🔎 Les sons — clique sur un personnage pour l'écouter</h2>
      <div class="sound-grid">${grid}</div>
    </div>`);
    node.addEventListener("click", (e) => {
      const card = e.target.closest(".sound-card");
      if (card) renderSonDetail(card.dataset.id);
    });
    show(node);
  }

  function renderSonDetail(id) {
    const idx = SOUNDS.findIndex((s) => s.id === id);
    const s = SOUNDS[idx];
    const node = el(`<div class="page detail" style="--c:${s.color}">
      <button class="back" data-back>← Les sons</button>
      <div class="detail-card">
        ${imgTag("son-" + s.letter, s.emoji, "big round")}
        <div class="detail-letter">${s.letter} <span class="min-maj">${s.letter.toUpperCase()}</span></div>
        <p class="detail-name">${s.perso}</p>
        <p class="detail-desc">${s.desc}</p>
        <button class="play-big" data-play>🔊 Écouter le son</button>
      </div>
      <div class="detail-nav">
        <button class="nav-round" data-prev ${idx === 0 ? "disabled" : ""}>◀</button>
        <span>${idx + 1} / ${SOUNDS.length}</span>
        <button class="nav-round" data-next ${idx === SOUNDS.length - 1 ? "disabled" : ""}>▶</button>
      </div>
    </div>`);
    node.querySelector("[data-back]").onclick = renderSons;
    node.querySelector("[data-play]").onclick = (e) => { bounce(node.querySelector(".imgwrap")); playPhoneme(s.letter); bounce(e.currentTarget); };
    node.querySelector("[data-prev]").onclick = () => renderSonDetail(SOUNDS[idx - 1].id);
    node.querySelector("[data-next]").onclick = () => renderSonDetail(SOUNDS[idx + 1].id);
    show(node);
    setTimeout(() => playPhoneme(s.letter), 300); // joue à l'ouverture
  }

  /* ================= 2) LES LETTRES (association + transformation) ================= */
  let lettresRound = 0;
  function renderLettres() {
    lettresRound = 0;
    nextLettre();
  }
  function nextLettre() {
    const s = shuffle(SOUNDS)[0];
    const options = shuffle([s, ...shuffle(SOUNDS.filter((o) => o.id !== s.id)).slice(0, 2)]);
    const node = el(`<div class="page" style="--c:${s.color}">
      <button class="back" data-home>← Accueil</button>
      <h2 class="page-h">🔤 Quelle est la lettre de ce personnage ?</h2>
      <div class="quiz-visual">${imgTag("son-" + s.letter, s.emoji, "big round")}</div>
      <div class="options">${options.map((o) => `<button class="opt letter-opt" data-pick="${o.id}">${o.letter}</button>`).join("")}</div>
      <p class="feedback" data-fb></p>
    </div>`);
    node.querySelector("[data-home]").onclick = renderHome;
    const fb = node.querySelector("[data-fb]");
    playPhoneme(s.letter);
    node.querySelectorAll("[data-pick]").forEach((b) => {
      b.onclick = () => {
        if (b.dataset.pick === s.id) {
          b.classList.add("good"); bounce(b);
          fb.textContent = `Bravo ! ${s.perso} devient la lettre « ${s.letter} ».`;
          node.querySelector(".quiz-visual").innerHTML =
            `<div class="transform"><span class="tr-letter" style="color:${s.color}">${s.letter}</span></div>`;
          playPhoneme(s.letter);
          node.querySelectorAll("[data-pick]").forEach((x) => (x.disabled = true));
          setTimeout(() => { lettresRound++; nextLettre(); }, 1800);
        } else {
          b.classList.add("bad"); bounce(b);
          fb.textContent = "Essaie encore 🙂";
        }
      };
    });
    show(node);
  }

  /* ================= 3) LA FUSION (syllabes) ================= */
  function renderFusion() {
    const state = { c: null, v: null };
    const node = el(`<div class="page fusion">
      <button class="back" data-home>← Accueil</button>
      <h2 class="page-h">🔗 Mélange une consonne et une voyelle</h2>
      <div class="fusion-row">
        <div class="pick-col"><span class="pick-label">Consonne</span>
          <div class="pick-list">${CONSONANTS.map((c) => `<button class="pick pick-c" data-c="${c.letter}" style="--c:${c.color}">${c.letter}</button>`).join("")}</div>
        </div>
        <div class="pick-col"><span class="pick-label">Voyelle</span>
          <div class="pick-list">${VOWELS.map((v) => `<button class="pick pick-v" data-v="${v.letter}" style="--c:${v.color}">${v.letter}</button>`).join("")}</div>
        </div>
      </div>
      <div class="fusion-stage">
        <span class="fs-c">?</span><span class="fs-plus">+</span><span class="fs-v">?</span>
        <span class="fs-eq">=</span><span class="fs-syl">?</span>
      </div>
      <button class="play-big" data-play disabled>🔊 Écouter la syllabe</button>
    </div>`);
    node.querySelector("[data-home]").onclick = renderHome;
    const fsC = node.querySelector(".fs-c"), fsV = node.querySelector(".fs-v"), fsSyl = node.querySelector(".fs-syl");
    const playBtn = node.querySelector("[data-play]");

    function refresh() {
      fsC.textContent = state.c || "?";
      fsV.textContent = state.v || "?";
      if (state.c && state.v) {
        const syl = state.c + state.v;
        fsSyl.textContent = syl; bounce(fsSyl);
        playBtn.disabled = false;
        playFusion(state.c, state.v);
      } else { fsSyl.textContent = "?"; playBtn.disabled = true; }
    }
    function playFusion(c, v) {
      // son consonne (enregistré) -> son voyelle (enregistré) -> syllabe (TTS)
      playPhoneme(c, () => playPhoneme(v, () => play("syl-" + c + v, c + v)));
    }
    node.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => {
      node.querySelectorAll("[data-c]").forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel"); state.c = b.dataset.c; refresh();
    });
    node.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => {
      node.querySelectorAll("[data-v]").forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel"); state.v = b.dataset.v; refresh();
    });
    playBtn.onclick = () => { if (state.c && state.v) playFusion(state.c, state.v); };
    show(node);
  }

  /* ================= 4) LES MOTS ================= */
  function renderMots() {
    const grid = WORDS.map((w, i) => `
      <button class="word-card" data-i="${i}">
        ${imgTag("mot-" + w.word, w.emoji, "")}
        <span class="word-label">${w.word}</span>
      </button>`).join("");
    const node = el(`<div class="page">
      <button class="back" data-home>← Accueil</button>
      <h2 class="page-h">📖 Clique sur un mot pour le lire</h2>
      <div class="word-grid">${grid}</div>
    </div>`);
    node.querySelector("[data-home]").onclick = renderHome;
    node.addEventListener("click", (e) => {
      const card = e.target.closest(".word-card");
      if (card) renderMotDetail(parseInt(card.dataset.i, 10));
    });
    show(node);
  }

  function renderMotDetail(i) {
    const w = WORDS[i];
    const chips = w.chips.map((ch) => `<button class="syl-chip" data-a="${ch.a}" data-t="${ch.t}">${ch.t}</button>`).join("");
    const node = el(`<div class="page detail">
      <button class="back" data-back>← Les mots</button>
      <div class="detail-card">
        ${imgTag("mot-" + w.word, w.emoji, "big")}
        <div class="word-big" data-word>${w.word}</div>
        <div class="chips">${chips}</div>
        <button class="play-big" data-play>🔊 Lire le mot</button>
      </div>
    </div>`);
    node.querySelector("[data-back]").onclick = renderMots;
    node.querySelector("[data-play]").onclick = () => { bounce(node.querySelector("[data-word]")); play("mot-" + w.word, w.word); };
    node.querySelectorAll(".syl-chip").forEach((chip) => chip.onclick = () => { bounce(chip); play(chip.dataset.a, chip.dataset.t); });
    show(node);
    setTimeout(() => play("mot-" + w.word, w.word), 300);
  }

  /* ================= 5) LES JEUX ================= */
  function renderJeux() {
    const node = el(`<div class="page">
      <button class="back" data-home>← Accueil</button>
      <h2 class="page-h">🎮 Choisis un jeu</h2>
      <div class="game-menu">
        <button class="game-tile" data-g="son">🔊<span>Trouve le son</span></button>
        <button class="game-tile" data-g="mot">🔤<span>Lis le mot</span></button>
      </div>
    </div>`);
    node.querySelector("[data-home]").onclick = renderHome;
    node.querySelector('[data-g="son"]').onclick = () => gameSon({ score: 0, round: 0 });
    node.querySelector('[data-g="mot"]').onclick = () => gameMot({ score: 0, round: 0 });
    show(node);
  }

  const TOTAL_ROUNDS = 5;

  function gameSon(g) {
    if (g.round >= TOTAL_ROUNDS) return gameOver(g, gameSon);
    const s = shuffle(SOUNDS)[0];
    const opts = shuffle([s, ...shuffle(SOUNDS.filter((o) => o.id !== s.id)).slice(0, 3)]);
    const node = el(`<div class="page game">
      <div class="game-top"><button class="back" data-jeux>← Jeux</button><span class="score">⭐ ${g.score}</span></div>
      <h2 class="page-h">Écoute… puis clique sur le bon personnage !</h2>
      <button class="play-big" data-replay>🔊 Réécouter</button>
      <div class="options grid2">${opts.map((o) => `<button class="opt img-opt" data-pick="${o.id}" style="--c:${o.color}">${imgTag("son-" + o.letter, o.emoji, "round")}<b>${o.letter}</b></button>`).join("")}</div>
      <p class="feedback" data-fb></p>
    </div>`);
    node.querySelector("[data-jeux]").onclick = renderJeux;
    const rep = () => playPhoneme(s.letter);
    node.querySelector("[data-replay]").onclick = rep;
    const fb = node.querySelector("[data-fb]");
    node.querySelectorAll("[data-pick]").forEach((b) => b.onclick = () => {
      const ok = b.dataset.pick === s.id;
      b.classList.add(ok ? "good" : "bad"); bounce(b);
      node.querySelectorAll("[data-pick]").forEach((x) => (x.disabled = true));
      if (ok) { g.score++; fb.textContent = "Bravo ! ⭐"; }
      else { fb.textContent = `C'était « ${s.letter} ».`; }
      setTimeout(() => { g.round++; gameSon(g); }, 1400);
    });
    show(node);
    setTimeout(rep, 350);
  }

  function gameMot(g) {
    if (g.round >= TOTAL_ROUNDS) return gameOver(g, gameMot);
    const w = shuffle(WORDS)[0];
    const opts = shuffle([w, ...shuffle(WORDS.filter((o) => o.word !== w.word)).slice(0, 2)]);
    const node = el(`<div class="page game">
      <div class="game-top"><button class="back" data-jeux>← Jeux</button><span class="score">⭐ ${g.score}</span></div>
      <h2 class="page-h">Quel mot correspond à l'image ?</h2>
      <div class="quiz-visual">${imgTag("mot-" + w.word, w.emoji, "big")}</div>
      <div class="options">${opts.map((o) => `<button class="opt word-opt" data-pick="${o.word}">${o.word}</button>`).join("")}</div>
      <p class="feedback" data-fb></p>
    </div>`);
    node.querySelector("[data-jeux]").onclick = renderJeux;
    const fb = node.querySelector("[data-fb]");
    node.querySelectorAll("[data-pick]").forEach((b) => b.onclick = () => {
      const ok = b.dataset.pick === w.word;
      b.classList.add(ok ? "good" : "bad"); bounce(b);
      node.querySelectorAll("[data-pick]").forEach((x) => (x.disabled = true));
      play("mot-" + w.word, w.word);
      if (ok) { g.score++; fb.textContent = "Bravo ! ⭐"; }
      else { fb.textContent = `C'était « ${w.word} ».`; }
      setTimeout(() => { g.round++; gameMot(g); }, 1500);
    });
    show(node);
  }

  function gameOver(g, again) {
    const stars = "⭐".repeat(g.score) + "☆".repeat(TOTAL_ROUNDS - g.score);
    const node = el(`<div class="page game-over">
      <h2 class="page-h">Terminé ! 🎉</h2>
      <p class="big-score">${g.score} / ${TOTAL_ROUNDS}</p>
      <p class="stars">${stars}</p>
      <div class="options">
        <button class="opt" data-again>🔁 Rejouer</button>
        <button class="opt" data-jeux>🎮 Autres jeux</button>
      </div>
    </div>`);
    node.querySelector("[data-again]").onclick = () => again({ score: 0, round: 0 });
    node.querySelector("[data-jeux]").onclick = renderJeux;
    show(node);
  }

  /* ================= BONUS : Bibliothèque + Lecteur d'histoires ================= */
  const story = { cur: null, page: 0, audioEl: null, speaking: false, wordSpans: [] };

  function renderBiblio() {
    const cards = window.STORIES.map((s, i) => `
      <button class="book-card" data-i="${i}" style="--book-color:${s.color}">
        <div class="book-cover">${Illustrations.renderScene(s.cover)}<span class="book-emoji">${s.emoji}</span></div>
        <div class="book-meta"><span class="book-title">${s.title}</span><span class="book-sub">${s.subtitle}</span>
          <span class="book-age">${s.age[0]}–${s.age[1]} ans · ${s.pages.length} pages</span></div>
      </button>`).join("");
    const node = el(`<div class="page"><button class="back" data-home>← Accueil</button>
      <h2 class="page-h">📖 Mes histoires</h2><div class="shelf">${cards}</div></div>`);
    node.querySelector("[data-home]").onclick = renderHome;
    node.addEventListener("click", (e) => {
      const card = e.target.closest(".book-card");
      if (card) openStory(parseInt(card.dataset.i, 10));
    });
    show(node);
  }

  function openStory(i) { story.cur = window.STORIES[i]; story.page = 0; renderStoryPage(); }

  function renderStoryPage() {
    stopStory();
    const s = story.cur, p = s.pages[story.page], total = s.pages.length, n = story.page + 1;
    const node = el(`<div class="reader">
      <div class="reader-bar">
        <button class="round-btn" data-back>← Livres</button>
        <span class="reader-title">${s.title}</span>
        <div class="progress"><span class="progress-fill" style="width:${(n / total) * 100}%"></span></div>
      </div>
      <div class="page-view">
        <figure class="illustration" data-illu></figure>
        <div class="text-panel"><p class="page-text" data-text></p></div>
      </div>
      <div class="controls">
        <button class="nav-btn" data-prev ${story.page === 0 ? "disabled" : ""}>◀</button>
        <button class="read-btn" data-read><span class="read-icon">🔊</span> <span data-readlabel>Lis-moi&nbsp;!</span></button>
        <button class="nav-btn" data-next ${story.page === total - 1 ? "disabled" : ""}>▶</button>
      </div>
      <p class="page-count">Page ${n} sur ${total}</p>
    </div>`);
    // illustration : image IA sinon SVG
    const illu = node.querySelector("[data-illu]");
    illu.innerHTML = Illustrations.renderScene(p.scene);
    if (p.image) {
      const im = new Image(); im.src = "images/" + p.image; im.className = "ai-image";
      im.onload = () => { illu.innerHTML = ""; illu.appendChild(im); };
    }
    node.querySelector("[data-text]").textContent = p.text;
    node.querySelector("[data-back]").onclick = renderBiblio;
    node.querySelector("[data-prev]").onclick = () => { if (story.page > 0) { story.page--; renderStoryPage(); } };
    node.querySelector("[data-next]").onclick = () => { if (story.page < total - 1) { story.page++; renderStoryPage(); } };
    node.querySelector("[data-read]").onclick = () => toggleStoryAudio(node);
    show(node);
  }

  function toggleStoryAudio(node) {
    if (story.speaking) { stopStory(); updateReadUI(node, false); return; }
    const p = story.cur.pages[story.page];
    const label = node.querySelector("[data-readlabel]"); const textEl = node.querySelector("[data-text]");
    prepareStoryHighlight(textEl, p.text);
    const url = p.image ? "audio/" + p.image.replace(/\.png$/i, "") + ".mp3" : null;
    if (url) {
      const a = new Audio(url); a.preservesPitch = true; story.audioEl = a; let started = false;
      a.addEventListener("playing", () => { started = true; story.speaking = true; updateReadUI(node, true); });
      a.addEventListener("timeupdate", () => karaoke(a));
      a.addEventListener("ended", () => { stopStory(); updateReadUI(node, false); autoNext(node); });
      a.addEventListener("error", () => { if (!started) storyTTS(node, p.text); });
      a.play().catch(() => { if (!started) storyTTS(node, p.text); });
    } else storyTTS(node, p.text);
  }
  function storyTTS(node, text) {
    if (!ttsSupported) { ttsWarn.hidden = false; return; }
    const u = new SpeechSynthesisUtterance(text); u.lang = "fr-FR"; u.rate = 0.95; u.pitch = 1.05;
    u.onboundary = (e) => { if (!e.name || e.name === "word") highlightAt(e.charIndex); };
    u.onstart = () => { story.speaking = true; updateReadUI(node, true); };
    u.onend = () => { stopStory(); updateReadUI(node, false); autoNext(node); };
    synth.cancel(); synth.speak(u);
  }
  function updateReadUI(node, on) {
    const lbl = node.querySelector("[data-readlabel]"), btn = node.querySelector("[data-read]");
    if (!lbl) return;
    lbl.textContent = on ? "Stop" : "Lis-moi !";
    btn.classList.toggle("playing", on);
    btn.querySelector(".read-icon").textContent = on ? "⏹" : "🔊";
  }
  function autoNext(node) {
    if (story.cur && story.page < story.cur.pages.length - 1) { story.page++; renderStoryPage(); setTimeout(() => { const b = document.querySelector("[data-read]"); if (b) toggleStoryAudio(b.closest(".reader")); }, 600); }
  }
  function stopStory() {
    if (ttsSupported) synth.cancel();
    if (story.audioEl) { try { story.audioEl.pause(); } catch (_) {} story.audioEl = null; }
    story.speaking = false;
    clearStoryHighlight();
  }
  // surlignage
  function prepareStoryHighlight(textEl, text) {
    story.wordSpans = []; story.textEl = textEl;
    const frag = document.createDocumentFragment(); const re = /\S+\s*/g; let m;
    while ((m = re.exec(text)) !== null) { const sp = document.createElement("span"); sp.textContent = m[0]; sp.dataset.start = m.index; sp.className = "word"; frag.appendChild(sp); story.wordSpans.push(sp); }
    textEl.innerHTML = ""; textEl.appendChild(frag);
  }
  function highlightAt(ci) { let t = null; for (const sp of story.wordSpans) { if (+sp.dataset.start <= ci) t = sp; else break; } hl(t); }
  function karaoke(a) { if (!a.duration || !isFinite(a.duration) || !story.wordSpans.length) return; const idx = Math.min(story.wordSpans.length - 1, Math.floor((a.currentTime / a.duration) * story.wordSpans.length)); hl(story.wordSpans[idx]); }
  function hl(t) { story.wordSpans.forEach((s) => s.classList.remove("reading")); if (t) t.classList.add("reading"); }
  function clearStoryHighlight() { if (story.textEl && story.wordSpans.length) { const p = story.cur && story.cur.pages[story.page]; if (p) story.textEl.textContent = p.text; } story.wordSpans = []; }

  /* ================= PWA ================= */
  let deferredPrompt = null;
  const installBtn = document.getElementById("installBtn");
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredPrompt = e; if (installBtn) installBtn.hidden = false; });
  if (installBtn) installBtn.addEventListener("click", async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; installBtn.hidden = true; });
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));

  /* ================= START ================= */
  renderHome();
})();
