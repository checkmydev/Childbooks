/* ============================================================================
 * phonics.js — Données de la méthode de lecture (inspirée du principe des Alphas).
 * Personnages ORIGINAUX : chaque son est incarné par un personnage qui fait le
 * son. Progression : sons → association lettre → fusion en syllabes → mots.
 *
 * Fichiers assets attendus :
 *   images/son-<lettre>.png   (personnage)
 *   images/mot-<mot>.png       (mot illustré)
 *   audio/son-<lettre>.mp3      ("aaaa… comme dans lama.")
 *   audio/pur-<lettre>.mp3      (son pur allongé, pour la fusion)
 *   audio/syl-<cv>.mp3          (syllabe, ex: syl-sa)
 *   audio/mot-<mot>.mp3         (mot entier)
 * ==========================================================================*/

const SOUNDS = [
  { id: "a", letter: "a", type: "voyelle", perso: "Ava",   emoji: "😮", color: "#ff8a5c", desc: "la bouche grande ouverte fait « aaa »" },
  { id: "i", letter: "i", type: "voyelle", perso: "Iri",   emoji: "🙂", color: "#5cc1ff", desc: "le petit sourire fait « iii »" },
  { id: "o", letter: "o", type: "voyelle", perso: "Oto",   emoji: "😯", color: "#ffc24a", desc: "la bouche ronde et surprise fait « ooo »" },
  { id: "u", letter: "u", type: "voyelle", perso: "Ulu",   emoji: "😙", color: "#b98cff", desc: "les lèvres en avant font « uuu »" },
  { id: "s", letter: "s", type: "consonne", perso: "Sissi le serpent", emoji: "🐍", color: "#4fc47a", desc: "le serpent siffle « sssss »" },
  { id: "f", letter: "f", type: "consonne", perso: "Fabio la fusée",    emoji: "🚀", color: "#ff6f91", desc: "la fusée fait « fffff »" },
  { id: "m", letter: "m", type: "consonne", perso: "Malo le monstre",   emoji: "👾", color: "#9b7bff", desc: "le monstre gourmand fait « mmmm »" },
  { id: "l", letter: "l", type: "consonne", perso: "Lila la limace",    emoji: "🐌", color: "#57b894", desc: "la limace chante « llll »" },
  { id: "r", letter: "r", type: "consonne", perso: "Rara le robot",     emoji: "🤖", color: "#7f8cff", desc: "le robot vrombit « rrrr »" },
];

const VOWELS = SOUNDS.filter((s) => s.type === "voyelle");
const CONSONANTS = SOUNDS.filter((s) => s.type === "consonne");

// Syllabes disponibles (consonne + voyelle) — fichiers syl-<cv>.mp3.
const SYLLABLES = [];
CONSONANTS.forEach((c) => VOWELS.forEach((v) => SYLLABLES.push(c.letter + v.letter)));

// Mots illustrés. `chips` = découpage en morceaux lisibles, chacun avec son audio.
const WORDS = [
  { word: "lama",   emoji: "🦙", chips: [c("la"), c("ma")] },
  { word: "sofa",   emoji: "🛋️", chips: [c("so"), c("fa")] },
  { word: "salami", emoji: "🍖", chips: [c("sa"), c("la"), c("mi")] },
  { word: "sumo",   emoji: "🤼", chips: [c("su"), c("mo")] },
  { word: "lasso",  emoji: "🤠", chips: [c("la"), { t: "sso", a: "syl-so" }] },
  { word: "mur",    emoji: "🧱", chips: [{ t: "mur", a: "mot-mur" }] },
];

function c(cv) { return { t: cv, a: "syl-" + cv }; } // helper: syllabe -> chip

// Étapes du parcours (affichées sur l'accueil).
const JOURNEY = [
  { id: "sons",   n: 1, title: "Les sons",        icon: "🔎", sub: "Découvre les personnages et leurs sons" },
  { id: "lettres",n: 2, title: "Les lettres",     icon: "🔤", sub: "Associe chaque personnage à sa lettre" },
  { id: "fusion", n: 3, title: "La fusion",       icon: "🔗", sub: "Mélange deux sons pour lire une syllabe" },
  { id: "mots",   n: 4, title: "Les mots",        icon: "📖", sub: "Lis tes premiers mots" },
  { id: "jeux",   n: 5, title: "Les jeux",        icon: "🎮", sub: "Trouve le son, lis le mot" },
];

window.PHONICS = { SOUNDS, VOWELS, CONSONANTS, SYLLABLES, WORDS, JOURNEY };
