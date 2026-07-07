/* ============================================================================
 * phonics.js — Données de la méthode de lecture (personnages ORIGINAUX).
 * Progression : sons -> association lettre -> fusion en syllabes -> mots.
 *
 * Fichiers assets attendus :
 *   images/son-<lettre>.png   (personnage)   — <lettre> ∈ {a,e,i,o,u,s,f,m,l,r,p,t,d,n,v,b,j,ch}
 *   images/mot-<mot>.png       (mot illustré)
 *   audio/pur-<lettre>.wav      (son enregistré par l'utilisateur)
 *   audio/syl-<cv>.mp3          (syllabe, ex: syl-cha)
 *   audio/mot-<mot>.mp3         (mot entier)
 * ==========================================================================*/

const SOUNDS = [
  // Voyelles
  { id: "a", letter: "a", type: "voyelle", perso: "Ava",   emoji: "😮", color: "#ff8a5c", desc: "la bouche grande ouverte fait « aaa »" },
  { id: "e", letter: "e", type: "voyelle", perso: "Éo",    emoji: "🙂", color: "#4fb0c4", desc: "la petite bouche dit « euh »" },
  { id: "i", letter: "i", type: "voyelle", perso: "Iri",   emoji: "🙂", color: "#5cc1ff", desc: "le grand sourire fait « iii »" },
  { id: "o", letter: "o", type: "voyelle", perso: "Oto",   emoji: "😯", color: "#ffc24a", desc: "la bouche ronde fait « ooo »" },
  { id: "u", letter: "u", type: "voyelle", perso: "Ulu",   emoji: "😙", color: "#b98cff", desc: "les lèvres en avant font « uuu »" },
  // Consonnes
  { id: "s",  letter: "s",  type: "consonne", perso: "Sissi le serpent",  emoji: "🐍", color: "#4fc47a", desc: "le serpent siffle « sssss »" },
  { id: "f",  letter: "f",  type: "consonne", perso: "Fabio la fusée",    emoji: "🚀", color: "#ff6f91", desc: "la fusée fait « fffff »" },
  { id: "m",  letter: "m",  type: "consonne", perso: "Malo le monstre",   emoji: "👾", color: "#9b7bff", desc: "le monstre gourmand fait « mmmm »" },
  { id: "l",  letter: "l",  type: "consonne", perso: "Lila la limace",    emoji: "🐌", color: "#57b894", desc: "la limace chante « llll »" },
  { id: "r",  letter: "r",  type: "consonne", perso: "Rara le robot",     emoji: "🤖", color: "#7f8cff", desc: "le robot vrombit « rrrr »" },
  { id: "p",  letter: "p",  type: "consonne", perso: "Popi le pirate",    emoji: "🏴‍☠️", color: "#e8823a", desc: "le pirate fait « p… p… p »" },
  { id: "t",  letter: "t",  type: "consonne", perso: "Tomi la trompette", emoji: "🎺", color: "#f4b400", desc: "la trompette fait « t… t… t »" },
  { id: "d",  letter: "d",  type: "consonne", perso: "Dodi le dauphin",   emoji: "🐬", color: "#43b8e8", desc: "le dauphin fait « d… d… d »" },
  { id: "n",  letter: "n",  type: "consonne", perso: "Nino le nuage",     emoji: "☁️", color: "#8fb8ff", desc: "le nuage fait « nnn »" },
  { id: "v",  letter: "v",  type: "consonne", perso: "Vava la vache",     emoji: "🐄", color: "#e86a6a", desc: "la vache fait « vvv »" },
  { id: "b",  letter: "b",  type: "consonne", perso: "Bulo le ballon",    emoji: "🎈", color: "#ff5c8a", desc: "le ballon fait « b… b… b »" },
  { id: "j",  letter: "j",  type: "consonne", perso: "Juju le lutin",     emoji: "🧝", color: "#a06bff", desc: "le lutin fait « jjj »" },
  { id: "ch", letter: "ch", type: "consonne", perso: "Chacha le chat",    emoji: "🐱", color: "#f08a3c", desc: "le chat fait « chhh »" },
];

const VOWELS = SOUNDS.filter((s) => s.type === "voyelle");
const CONSONANTS = SOUNDS.filter((s) => s.type === "consonne");

// Syllabes disponibles (consonne + voyelle) — fichiers syl-<cv>.mp3.
const SYLLABLES = [];
CONSONANTS.forEach((c) => VOWELS.forEach((v) => SYLLABLES.push(c.letter + v.letter)));

function chip(cv) { return { t: cv, a: "syl-" + cv }; } // syllabe -> morceau lisible

// Mots illustrés. `chips` = découpage lisible (chacun avec son audio).
const WORDS = [
  { word: "lama",   emoji: "🦙", chips: [chip("la"), chip("ma")] },
  { word: "sofa",   emoji: "🛋️", chips: [chip("so"), chip("fa")] },
  { word: "salami", emoji: "🍖", chips: [chip("sa"), chip("la"), chip("mi")] },
  { word: "sumo",   emoji: "🤼", chips: [chip("su"), chip("mo")] },
  { word: "lasso",  emoji: "🤠", chips: [chip("la"), { t: "sso", a: "syl-so" }] },
  { word: "mur",    emoji: "🧱", chips: [{ t: "mur", a: "mot-mur" }] },
  { word: "moto",   emoji: "🏍️", chips: [chip("mo"), chip("to")] },
  { word: "tomate", emoji: "🍅", chips: [chip("to"), chip("ma"), chip("te")] },
  { word: "banane", emoji: "🍌", chips: [chip("ba"), chip("na"), chip("ne")] },
  { word: "domino", emoji: "🎲", chips: [chip("do"), chip("mi"), chip("no")] },
  { word: "robot",  emoji: "🤖", chips: [chip("ro"), { t: "bot", a: "mot-robot" }] },
  { word: "chat",   emoji: "🐱", chips: [{ t: "chat", a: "mot-chat" }] },
  { word: "papa",   emoji: "👨", chips: [chip("pa"), chip("pa")] },
  { word: "lune",   emoji: "🌙", chips: [chip("lu"), chip("ne")] },
  { word: "vache",  emoji: "🐄", chips: [chip("va"), chip("che")] },
];

// Étapes du parcours (affichées sur l'accueil).
const JOURNEY = [
  { id: "sons",    n: 1, title: "Les sons",    icon: "🔎", sub: "Découvre les personnages et leurs sons" },
  { id: "lettres", n: 2, title: "Les lettres", icon: "🔤", sub: "Associe chaque personnage à sa lettre" },
  { id: "fusion",  n: 3, title: "La fusion",   icon: "🔗", sub: "Mélange deux sons pour lire une syllabe" },
  { id: "mots",    n: 4, title: "Les mots",    icon: "📖", sub: "Lis tes premiers mots" },
  { id: "jeux",    n: 5, title: "Les jeux",    icon: "🎮", sub: "Trouve le son, lis le mot" },
];

window.PHONICS = { SOUNDS, VOWELS, CONSONANTS, SYLLABLES, WORDS, JOURNEY };
