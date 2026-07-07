/* ============================================================================
 * readers.js — Histoires DÉCODABLES (l'enfant lit lui-même).
 * Vocabulaire limité aux sons appris. Chaque mot est soit :
 *   - décodable : découpé en syllabes (chips), colorées et cliquables
 *   - mot-outil (sight) : lu en entier, affiché autrement
 * Audio : mot entier -> audio/mot-<mot>.mp3 ; syllabe -> audio/syl-<cv>.mp3
 *         voyelle seule -> audio/pur-<v>.wav ; phrase -> audio/phr-<s>-<n>.mp3
 * ==========================================================================*/

// mot décodable : t = texte, chips = [{t, a}], tail = lettre muette éventuelle
function d(t, chips, tail) { return { t, chips, tail: tail || "" }; }
// mot-outil (sight word)
function o(t) { return { t, sight: true, a: "mot-" + t }; }
// raccourcis chips
function sy(cv) { return { t: cv, a: "syl-" + cv }; }           // syllabe consonne+voyelle
function vo(v) { return { t: v, a: "pur-" + v }; }              // voyelle seule (son enregistré)

const READERS = [
  {
    id: "moto", title: "La moto de papa", emoji: "🏍️", color: "#ff8a5c",
    sentences: [
      [d("papa", [sy("pa"), sy("pa")]), o("a"), o("une"), d("moto", [sy("mo"), sy("to")])],
      [d("papa", [sy("pa"), sy("pa")]), d("va", [sy("va")]), d("vite", [sy("vi"), sy("te")])],
      [d("sami", [sy("sa"), sy("mi")]), d("va", [sy("va")]), d("vite", [sy("vi"), sy("te")])],
    ],
  },
  {
    id: "chat", title: "Le chat de Nina", emoji: "🐱", color: "#f08a3c",
    sentences: [
      [d("nina", [sy("ni"), sy("na")]), o("a"), o("un"), d("chat", [sy("cha")], "t")],
      [o("le"), d("chat", [sy("cha")], "t"), d("va", [sy("va")]), o("sur"), o("le"), d("sofa", [sy("so"), sy("fa")])],
      [o("le"), d("chat", [sy("cha")], "t"), o("a"), o("un"), d("ami", [vo("a"), sy("mi")])],
    ],
  },
  {
    id: "banane", title: "Mamie et la banane", emoji: "🍌", color: "#ffc24a",
    sentences: [
      [d("mamie", [sy("ma"), sy("mi")]), o("a"), o("une"), d("banane", [sy("ba"), sy("na"), sy("ne")])],
      [d("mila", [sy("mi"), sy("la")]), o("a"), o("une"), d("tomate", [sy("to"), sy("ma"), sy("te")])],
      [d("papa", [sy("pa"), sy("pa")]), o("a"), o("un"), d("salami", [sy("sa"), sy("la"), sy("mi")])],
    ],
  },
];

// Identifiant audio d'une phrase : phr-<storyIndex+1>-<sentenceIndex+1>
function sentenceSnd(si, ni) { return `phr-${si + 1}-${ni + 1}`; }

window.READERS = READERS;
window.sentenceSnd = sentenceSnd;
