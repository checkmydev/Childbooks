# Dossier `images/` — illustrations IA (optionnel)

L'application **fonctionne sans images ici** : chaque page affiche une
illustration SVG intégrée par défaut.

Ce dossier permet d'ajouter de vraies illustrations générées par IA. Dès qu'un
fichier PNG au bon nom (voir `prompts.json`) est présent, l'app l'affiche
automatiquement à la place du SVG — sans aucune modification du code.

## Générer les images

```bash
export OPENAI_API_KEY="sk-..."      # PowerShell : $env:OPENAI_API_KEY="sk-..."
node ../generate-images.mjs
```

- `--only=loutre-page1.png` : ne génère qu'une image
- `--force` : régénère même si le fichier existe

Tu peux aussi déposer manuellement tes propres PNG en respectant les noms de
fichiers listés dans `prompts.json` (ex. `dragon-page3.png`).
