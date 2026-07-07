# Dossier `audio/` — narrations (voix neuronale)

Contient un fichier MP3 par page (ex. `dragon-page3.mp3`), généré avec
**edge-tts** (voix neuronales Microsoft, **gratuit, sans clé API**).

Quand un MP3 au bon nom est présent, l'app le joue automatiquement à la place
de la voix du navigateur (avec surlignage du texte). S'il manque, l'app
retombe sur la synthèse vocale du navigateur.

## (Re)générer les narrations

Prérequis : `pip install edge-tts`, puis depuis la racine du projet :

```bash
node generate-audio.mjs                 # génère les MP3 manquants
node generate-audio.mjs --force         # régénère tout
VOICE=fr-FR-EloiseNeural node generate-audio.mjs --force   # autre voix
```

Voix FR disponibles : `fr-FR-DeniseNeural` (défaut, douce), `fr-FR-EloiseNeural`,
`fr-FR-VivienneMultilingualNeural`, `fr-FR-HenriNeural`, `fr-FR-RemyMultilingualNeural`.
Rythme réglable via `RATE` (ex. `RATE=-8%`).
