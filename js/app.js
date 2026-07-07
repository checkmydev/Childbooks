/* ============================================================================
 * app.js — Logique de P'tits Contes : bibliothèque, lecteur, narration.
 * Narration : joue un MP3 neuronal (dossier /audio) s'il existe, sinon
 * bascule sur la synthèse vocale du navigateur.
 * ==========================================================================*/
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const els = {
    library: $("#library"),
    shelf: $("#shelf"),
    reader: $("#reader"),
    readerTitle: $("#readerTitle"),
    illustration: $("#illustration"),
    pageText: $("#pageText"),
    prevBtn: $("#prevBtn"),
    nextBtn: $("#nextBtn"),
    readBtn: $("#readBtn"),
    readLabel: $("#readLabel"),
    speed: $("#speed"),
    progressFill: $("#progressFill"),
    pageCount: $("#pageCount"),
    ttsWarn: $("#ttsWarn"),
    backBtn: $("#backBtn"),
  };

  const state = { story: null, page: 0, speaking: false, audioEl: null };

  /* ================= Bibliothèque ================= */
  function ageMatches(story, filter) {
    if (filter === "all") return true;
    const f = parseInt(filter, 10);
    return story.age[0] <= f + 1 && story.age[1] >= f;
  }

  function renderShelf(filter = "all") {
    els.shelf.innerHTML = "";
    const list = STORIES.filter((s) => ageMatches(s, filter));
    list.forEach((story) => {
      const card = document.createElement("button");
      card.className = "book-card";
      card.style.setProperty("--book-color", story.color);
      card.setAttribute("aria-label", `Ouvrir : ${story.title}`);
      card.innerHTML = `
        <div class="book-cover">${Illustrations.renderScene(story.cover)}
          <span class="book-emoji" aria-hidden="true">${story.emoji}</span>
        </div>
        <div class="book-meta">
          <span class="book-title">${story.title}</span>
          <span class="book-sub">${story.subtitle}</span>
          <span class="book-age">${story.age[0]}–${story.age[1]} ans · ${story.pages.length} pages</span>
        </div>`;
      card.addEventListener("click", () => openStory(story));
      els.shelf.appendChild(card);
    });
    if (!list.length) {
      els.shelf.innerHTML = `<p class="empty">Aucune histoire pour cet âge… pour l'instant&nbsp;!</p>`;
    }
  }

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderShelf(chip.dataset.age);
    });
  });

  /* ================= Lecteur ================= */
  function openStory(story) {
    stopSpeaking();
    state.story = story;
    state.page = 0;
    els.readerTitle.textContent = story.title;
    els.library.hidden = true;
    els.reader.hidden = false;
    window.scrollTo(0, 0);
    renderPage();
  }

  function closeStory() {
    stopSpeaking();
    els.reader.hidden = true;
    els.library.hidden = false;
    state.story = null;
  }

  function renderPage() {
    const story = state.story;
    const page = story.pages[state.page];
    stopSpeaking();

    setIllustration(page);
    els.pageText.textContent = page.text;
    els.pageText.setAttribute("aria-label", page.alt || "");

    const total = story.pages.length;
    const n = state.page + 1;
    els.pageCount.textContent = `Page ${n} sur ${total}`;
    els.progressFill.style.width = `${(n / total) * 100}%`;
    els.prevBtn.disabled = state.page === 0;
    els.nextBtn.disabled = state.page === total - 1;

    els.illustration.classList.remove("flip");
    void els.illustration.offsetWidth;
    els.illustration.classList.add("flip");
  }

  function setIllustration(page) {
    els.illustration.innerHTML = Illustrations.renderScene(page.scene);
    if (!page.image) return;
    const img = new Image();
    img.src = `images/${page.image}`;
    img.alt = page.alt || "";
    img.className = "ai-image";
    img.addEventListener("load", () => {
      if (state.story && state.story.pages[state.page] === page) {
        els.illustration.innerHTML = "";
        els.illustration.appendChild(img);
      }
    });
  }

  function go(delta) {
    const total = state.story.pages.length;
    const next = state.page + delta;
    if (next < 0 || next >= total) return;
    state.page = next;
    renderPage();
  }

  els.prevBtn.addEventListener("click", () => go(-1));
  els.nextBtn.addEventListener("click", () => go(1));
  els.backBtn.addEventListener("click", closeStory);

  document.addEventListener("keydown", (e) => {
    if (els.reader.hidden) return;
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "Escape") closeStory();
    if (e.key === " ") { e.preventDefault(); toggleSpeak(); }
  });

  let touchX = null;
  els.reader.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  els.reader.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });

  /* ================= Narration ================= */
  const synth = window.speechSynthesis;
  const ttsSupported = !!synth && typeof SpeechSynthesisUtterance !== "undefined";
  let frVoice = null;

  function pickVoice() {
    if (!ttsSupported) return;
    const voices = synth.getVoices();
    frVoice =
      voices.find((v) => /fr[-_]FR/i.test(v.lang) && /female|femme|virginie|amelie|audrey|julie|denise/i.test(v.name)) ||
      voices.find((v) => /^fr/i.test(v.lang)) ||
      voices.find((v) => /fr/i.test(v.lang)) ||
      null;
  }
  if (ttsSupported) {
    pickVoice();
    synth.addEventListener("voiceschanged", pickVoice);
  }

  function rate() {
    const r = parseFloat(els.speed.value);
    return isFinite(r) ? r : 1;
  }

  function audioUrl(page) {
    return page.image ? `audio/${page.image.replace(/\.png$/i, "")}.mp3` : null;
  }

  function toggleSpeak() {
    if (state.speaking) { stopSpeaking(); return; }
    speakCurrentPage();
  }

  function speakCurrentPage() {
    const page = state.story.pages[state.page];
    prepareHighlight(page.text);
    const url = audioUrl(page);
    if (url) playAudio(url, page);
    else speakTTS(page);
  }

  // --- Chemin 1 : MP3 neuronal (préféré) ---
  function playAudio(url, page) {
    const a = new Audio(url);
    a.preservesPitch = true;
    a.playbackRate = rate();
    state.audioEl = a;
    let started = false;

    a.addEventListener("playing", () => { started = true; setSpeakingUI(true); });
    a.addEventListener("timeupdate", () => karaoke(a));
    a.addEventListener("ended", () => { setSpeakingUI(false); clearHighlight(); state.audioEl = null; autoAdvance(); });
    a.addEventListener("error", () => { if (!started) fallbackToTTS(page); });
    a.play().catch(() => { if (!started) fallbackToTTS(page); });
  }

  function fallbackToTTS(page) {
    state.audioEl = null;
    speakTTS(page);
  }

  // --- Chemin 2 : synthèse vocale du navigateur (secours) ---
  function speakTTS(page) {
    if (!ttsSupported) { els.ttsWarn.hidden = false; setSpeakingUI(false); clearHighlight(); return; }
    const u = new SpeechSynthesisUtterance(page.text);
    u.lang = "fr-FR";
    if (frVoice) u.voice = frVoice;
    u.rate = rate();
    u.pitch = 1.05;
    u.onboundary = (ev) => { if (!ev.name || ev.name === "word") highlightAt(ev.charIndex); };
    u.onstart = () => setSpeakingUI(true);
    u.onend = () => { setSpeakingUI(false); clearHighlight(); autoAdvance(); };
    u.onerror = () => { setSpeakingUI(false); clearHighlight(); };
    synth.cancel();
    synth.speak(u);
  }

  function stopSpeaking() {
    if (ttsSupported) synth.cancel();
    if (state.audioEl) { try { state.audioEl.pause(); } catch (_) {} state.audioEl = null; }
    setSpeakingUI(false);
    clearHighlight();
  }

  function setSpeakingUI(on) {
    state.speaking = on;
    els.readBtn.classList.toggle("playing", on);
    els.readLabel.textContent = on ? "Stop" : "Lis-moi !";
    els.readBtn.querySelector(".read-icon").textContent = on ? "⏹" : "🔊";
  }

  function autoAdvance() {
    if (state.story && state.page < state.story.pages.length - 1) {
      go(1);
      setTimeout(() => { if (!els.reader.hidden) speakCurrentPage(); }, 600);
    }
  }

  els.readBtn.addEventListener("click", toggleSpeak);
  els.speed.addEventListener("input", () => {
    if (state.audioEl) { state.audioEl.playbackRate = rate(); return; } // ajuste en direct
    if (state.speaking) { const p = state.story.pages[state.page]; synth.cancel(); speakTTS(p); }
  });

  /* ---------- Surlignage du texte lu ---------- */
  let wordSpans = [];
  function prepareHighlight(text) {
    wordSpans = [];
    const frag = document.createDocumentFragment();
    const regex = /\S+\s*/g;
    let m;
    while ((m = regex.exec(text)) !== null) {
      const span = document.createElement("span");
      span.textContent = m[0];
      span.dataset.start = m.index;
      span.className = "word";
      frag.appendChild(span);
      wordSpans.push(span);
    }
    els.pageText.innerHTML = "";
    els.pageText.appendChild(frag);
  }

  function highlightAt(charIndex) {
    let target = null;
    for (const span of wordSpans) {
      if (parseInt(span.dataset.start, 10) <= charIndex) target = span;
      else break;
    }
    highlightSpan(target);
  }

  function karaoke(a) {
    if (!a.duration || !isFinite(a.duration) || !wordSpans.length) return;
    const idx = Math.min(wordSpans.length - 1, Math.floor((a.currentTime / a.duration) * wordSpans.length));
    highlightSpan(wordSpans[idx]);
  }

  function highlightSpan(target) {
    wordSpans.forEach((s) => s.classList.remove("reading"));
    if (target) target.classList.add("reading");
  }

  function clearHighlight() {
    if (!wordSpans.length) return;
    const page = state.story && state.story.pages[state.page];
    if (page) els.pageText.textContent = page.text;
    wordSpans = [];
  }

  // Chrome coupe la synthèse après ~15s : on la relance.
  if (ttsSupported) {
    setInterval(() => {
      if (state.speaking && !state.audioEl && synth.paused) synth.resume();
    }, 5000);
  }

  /* ================= PWA ================= */
  let deferredPrompt = null;
  const installBtn = $("#installBtn");
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.hidden = false;
  });
  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn.hidden = true;
    });
  }
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    });
  }

  /* ================= Démarrage ================= */
  renderShelf("all");
})();
