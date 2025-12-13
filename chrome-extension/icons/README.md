# Icônes de l'extension

## Icônes requises

L'extension nécessite 4 tailles d'icônes :

- **icon16.png** : 16x16 pixels (favicon)
- **icon32.png** : 32x32 pixels (barre d'outils petite)
- **icon48.png** : 48x48 pixels (page extensions)
- **icon128.png** : 128x128 pixels (Chrome Web Store)

## Design recommandé

### Concept

Icône représentant un produit "winner" avec :
- 🔥 Flamme (symbole de produit chaud/gagnant)
- 🇩🇿 Couleurs algériennes (vert et rouge) OU
- 💚 Vert (#10B981) de l'extension

### Style

- Design moderne et minimaliste
- Contours nets
- Fond transparent ou blanc
- Couleurs vives pour la visibilité

## Créer les icônes

### Option 1 : Utiliser Figma/Canva

1. Créez un design 128x128px
2. Exportez en PNG à 128x128, 48x48, 32x32, 16x16
3. Nommez les fichiers : icon128.png, icon48.png, etc.
4. Placez-les dans ce dossier

### Option 2 : Utiliser un générateur en ligne

Sites recommandés :
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/
- https://www.icoconverter.com/

### Option 3 : Icône SVG temporaire

Pour tester l'extension rapidement, vous pouvez utiliser des icônes emoji ou text-based.

## Icône SVG de base (exemple)

Créez un fichier SVG et convertissez-le avec un outil en ligne :

```svg
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="24" fill="#10B981"/>
  <text x="64" y="90" font-size="80" text-anchor="middle" fill="white">🔥</text>
</svg>
```

## Placeholder temporaire

Pour tester l'extension immédiatement sans icônes :

1. Créez des images carrées de couleur unie
2. Ou utilisez des emojis convertis en PNG
3. L'extension fonctionnera sans icônes, mais Chrome affichera une icône par défaut

## Vérification

Une fois les icônes créées :
- [ ] 4 fichiers PNG présents dans ce dossier
- [ ] Tailles correctes (16, 32, 48, 128)
- [ ] Format PNG avec transparence
- [ ] Design cohérent sur toutes les tailles
- [ ] Bonne visibilité à petite taille (16px)

## Note

Si vous n'avez pas les icônes, l'extension fonctionnera quand même. Chrome utilisera simplement une icône par défaut.
