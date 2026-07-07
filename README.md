# 🔤 Léo & les Sons

Une **PWA** (application web installable) pour **apprendre à lire** aux enfants,
selon une méthode **phonique** (inspirée du principe des Alphas) : chaque son est
incarné par un **personnage original** qui *fait* le son, puis on assemble les
sons en syllabes et en mots. 100 % en français, gratuit, hors ligne.

> ⚖️ La méthode « La Planète des Alphas » est protégée. Cette app **n'utilise
> aucun** personnage, nom ou visuel officiel : elle reprend uniquement le
> **principe pédagogique** avec des personnages entièrement originaux.

**En ligne : https://checkmydev.github.io/Childbooks/**

## ✨ Le parcours (5 étapes)

1. **🔎 Les sons** — découvre 9 personnages (a, i, o, u, s, f, m, l, r) et écoute le son que fait chacun.
2. **🔤 Les lettres** — associe chaque personnage à sa lettre (transformation son → lettre).
3. **🔗 La fusion** — mélange une consonne et une voyelle pour lire une syllabe (« sss » + « aaa » → « sa »), avec audio.
4. **📖 Les mots** — lis tes premiers mots illustrés (lama, sofa, salami, sumo, lasso, mur), syllabe par syllabe.
5. **🎮 Les jeux** — *Trouve le son* et *Lis le mot*, avec score en étoiles.

**Bonus 📖 Mes histoires** : les 4 contes illustrés d'origine, avec narration
audio, pour s'entraîner à lire une fois les sons appris.

## 🎨 Voix & images — gratuit, sans clé API

- **Voix neuronale** : edge-tts (voix Microsoft `fr-FR-DeniseNeural`).
- **Images IA** : Pollinations.ai (modèle Flux). Repli emoji/SVG si une image manque.

Régénérer / personnaliser :
```bash
# Images des personnages et mots (méthode de lecture)
PROMPTS=images/prompts-phonics.json node generate-images.mjs
# Images des histoires (bonus)
node generate-images.mjs
# Audio des sons / syllabes / mots
pip install edge-tts
AUDIO_LIST=audio/phonics-audio.json node generate-audio.mjs
# Audio des histoires (bonus)
node generate-audio.mjs
```

## 🚀 Lancer en local

Un **serveur HTTP** est nécessaire (le service worker ne marche pas en `file://`) :
```bash
python -m http.server 8000
```
Puis ouvre **http://localhost:8000**.

## 🗂️ Structure

```
index.html              # coquille + routeur
css/styles.css          # styles communs + histoires
css/phonics.css         # styles des vues d'apprentissage
js/phonics.js           # données : sons, syllabes, mots
js/app.js               # routeur, 4 activités, 2 jeux, lecteur d'histoires
js/stories.js           # les 4 contes (bonus)
js/illustrations.js     # illustrations SVG de secours (histoires)
images/                 # personnages (son-*), mots (mot-*), histoires
audio/                  # sons (son-*, pur-*), syllabes (syl-*), mots, histoires
generate-images.mjs     # génération d'images (Pollinations, gratuit)
generate-audio.mjs      # génération audio (edge-tts, gratuit)
manifest.webmanifest / service-worker.js   # PWA (installable, hors ligne)
```

## ➕ Ajouter un son / un mot

Édite `js/phonics.js` (`SOUNDS`, `WORDS`), ajoute les entrées correspondantes
dans `images/prompts-phonics.json` et `audio/phonics-audio.json`, puis relance
les scripts de génération ci-dessus.
