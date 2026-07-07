# 📖 P'tits Contes

Une **PWA** (application web installable) de livres pour enfants de **5 à 10 ans** :
histoires illustrées, à **lire** et à **écouter** (narration à voix haute).
100 % en français, fonctionne **hors ligne**.

## ✨ Fonctionnalités

- **Bibliothèque** avec 4 histoires originales, filtrables par âge.
- **Lecteur page par page** : illustration + texte, navigation ← → (clavier,
  boutons, ou glissement tactile sur mobile).
- **Illustrations IA** (générées avec Pollinations/Flux, gratuit) — repli
  automatique sur des illustrations SVG si une image manque.
- **Narration à voix neuronale** « Lis-moi ! » (voix française *Denise* via
  edge-tts, gratuit), avec **surlignage du texte lu** et **vitesse ajustable**
  (🐢 → 🐇). Passe automatiquement à la page suivante. Repli sur la voix du
  navigateur si un fichier audio manque.
- **Installable** sur téléphone/ordinateur (icône, plein écran, hors ligne).

## 📚 Les histoires

| Titre | Âge | Thème |
|---|---|---|
| Momo la petite loutre et l'étoile tombée | 5–6 | Entraide |
| Le dragon qui avait peur du noir | 6–8 | Apprivoiser ses peurs |
| Lila et la graine magique | 7–8 | Patience & nature |
| Les trois inventeurs de la forêt | 9–10 | Coopération |

## 🚀 Lancer l'application

La PWA a besoin d'un **serveur HTTP** (le service worker ne fonctionne pas en
`file://`). Depuis le dossier du projet :

```bash
# Python (déjà installé)
python -m http.server 8000
```

Puis ouvre **http://localhost:8000** dans Chrome, Edge ou Safari.
Pour l'installer : menu du navigateur → « Installer l'application », ou le
bouton « Installer l'appli » en haut à droite.

## 🎨 Régénérer les images et la voix (gratuit, sans clé API)

Les illustrations IA et les narrations sont **déjà générées** et incluses. Pour
les regénérer ou les personnaliser :

**Images** — Pollinations.ai (modèle Flux), gratuit et sans clé :
```bash
node generate-images.mjs            # génère les images manquantes dans images/
node generate-images.mjs --force    # régénère tout
```
Prompts (un par page, avec « bible » de personnages pour la cohérence) dans
[`images/prompts.json`](images/prompts.json). En cas d'absence d'un PNG, l'app
affiche une illustration **SVG** de secours (aucune dépendance).

**Voix** — edge-tts (voix neuronales Microsoft), gratuit et sans clé :
```bash
pip install edge-tts
node generate-audio.mjs             # génère les MP3 manquants dans audio/
VOICE=fr-FR-EloiseNeural node generate-audio.mjs --force   # changer de voix
```
Voir [`audio/README.md`](audio/README.md). En cas d'absence d'un MP3, l'app
utilise la synthèse vocale du navigateur.

## 🗂️ Structure

```
index.html              # coquille de l'app
css/styles.css          # styles (UI enfant, responsive, accessible)
js/stories.js           # contenu des 4 histoires
js/illustrations.js     # moteur d'illustrations SVG (scènes + personnages)
js/app.js               # bibliothèque, lecteur, narration TTS
manifest.webmanifest    # métadonnées PWA
service-worker.js       # cache hors ligne
icons/                  # icônes de l'app
images/                 # illustrations IA (PNG) + prompts.json
audio/                  # narrations MP3 (voix neuronale)
generate-images.mjs     # génération d'images IA (Pollinations, gratuit)
generate-audio.mjs      # génération des narrations (edge-tts, gratuit)
docs/…/…-design.md      # spec de conception
```

## ➕ Ajouter une histoire

Ajoute un objet dans `js/stories.js` (voir les exemples). Pour les
illustrations, réutilise une clé de scène existante de `js/illustrations.js`
ou ajoutes-en une nouvelle dans l'objet `SCENES`.

## 🔊 Note sur la voix

La qualité de la voix dépend des voix françaises installées sur l'appareil.
Sur mobile (iOS/Android) et Windows/macOS, une voix française est en général
disponible. À défaut, un message prévient que la lecture audio est indisponible.
