# P'tits Contes — PWA de livres pour enfants (5–10 ans)

Date : 2026-07-07

## Objectif
Une PWA installable et offline, en français, offrant des livres illustrés pour
enfants de 5 à 10 ans, avec texte, illustrations et narration audio.

## Stack
- HTML/CSS/JS vanilla, zéro build.
- `manifest.webmanifest` + `service-worker.js` (cache-first) → installable, offline.
- Données des histoires dans `js/stories.js` (structuré, facile à enrichir).

## Fonctionnalités
1. **Bibliothèque** : grille de couvertures, filtre par âge.
2. **Lecteur** : lecture page par page (texte + illustration), navigation ← →,
   barre de progression, retour bibliothèque.
3. **Narration audio** : Web Speech API (`speechSynthesis`), voix FR,
   Lecture/Pause/Stop, vitesse ajustable, surlignage du texte lu (`onboundary`).
4. **Illustrations — approche hybride** :
   - SVG storybook faits main (moteur `js/illustrations.js`) livrés par défaut → app complète offline.
   - Dossier `images/` + `prompts-illustrations.md` + `generate-images.mjs` pour
     upgrader vers des images IA sans toucher au code.
   - Le lecteur affiche le PNG s'il existe, sinon le SVG de secours.

## Contenu (4 histoires originales)
1. Momo la petite loutre et l'étoile tombée — 5–6 ans, entraide.
2. Le dragon qui avait peur du noir — 6–8 ans, apprivoiser ses peurs.
3. Lila et la graine magique — 7–8 ans, patience/nature.
4. Les trois inventeurs de la forêt — 9–10 ans, coopération.

## UI
Grosses zones tactiles, police généreuse, couleurs douces, accessible (alt text,
aria-labels), responsive mobile-first.

## Hors périmètre (YAGNI)
Comptes utilisateurs, backend, achats, multi-langue (FR seul pour cette version).
