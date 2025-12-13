# 🔧 CORRECTION APPLIQUÉE - Comment recharger l'extension

## ✅ Problème corrigé

J'ai amélioré la détection des annonces avec **5 méthodes de fallback** :

1. ✅ Sélecteur `[data-pagelet^="AdCard"]` (ancien)
2. ✅ Sélecteur `[data-pagelet*="Ad"]` (nouveau)
3. ✅ Détection par aria-label
4. ✅ Détection par contenu texte ("See ad details", "Lancé le")
5. ✅ Détection par structure CSS

## 🔄 ÉTAPES POUR RECHARGER L'EXTENSION

### Étape 1 : Ouvrir Chrome Extensions
1. Tapez `chrome://extensions/` dans la barre d'adresse
2. Appuyez sur Entrée

### Étape 2 : Recharger l'extension
1. Trouvez "Produit Winner Finder – Algérie"
2. Cliquez sur le bouton **🔄 "Recharger"** (icône circulaire)
3. Attendez 2 secondes

### Étape 3 : Tester sur Facebook Ads Library

#### A. Allez sur la bonne page
1. Ouvrez un nouvel onglet
2. Allez sur : **https://www.facebook.com/ads/library/**
3. Dans "Catégorie d'annonces" sélectionnez **"Tous les types d'annonces"**
4. Tapez un mot-clé dans la recherche :
   - "beauté" ou "beauty"
   - "cosmétique"
   - "maison"
   - "tech"
5. Cliquez sur **"Rechercher"**

#### B. Attendez le chargement
- **Faites défiler la page** pour charger les annonces
- Attendez 3-5 secondes que Facebook charge le contenu
- Vous devriez voir des cartes d'annonces avec des images

#### C. Lancez Winner Finder
1. Cliquez sur l'icône **Winner Finder** dans la barre Chrome
2. Le popup s'ouvre
3. **Vérifiez le nombre d'annonces détectées**

## 🎯 Ce que vous devriez voir

### ✅ Si ça marche :
- "Annonces détectées : **X**" (nombre > 0)
- Le bouton "Démarrer l'analyse" est activé (vert)
- Temps estimé affiché

### ❌ Si ça ne marche toujours pas :

#### Vérification 1 : Ouvrez la console
1. Sur la page Facebook Ads Library, appuyez sur **F12**
2. Allez dans l'onglet **"Console"**
3. Rechargez la page (F5)
4. Cliquez sur l'extension Winner Finder
5. **Regardez les messages dans la console**

Cherchez ces messages :
- ✅ "Détecté X annonces avec..."
- ❌ "Aucune annonce détectée"

#### Vérification 2 : Langue de Facebook
- **Mettez Facebook en ANGLAIS** (l'extension fonctionne mieux en anglais)
- Allez dans Paramètres > Langue > English (US)
- Retournez sur Ads Library

#### Vérification 3 : Envoyez-moi une capture d'écran
Si ça ne marche toujours pas, envoyez-moi :
1. **Capture d'écran de la page Facebook Ads Library** (avec les annonces visibles)
2. **Capture d'écran du popup Winner Finder** (avec "0/0 annonces")
3. **Messages de la console** (F12 > Console)

## 🔍 Debug avancé

Si vous êtes à l'aise avec le code, ouvrez la console et tapez :

```javascript
// Compter les annonces manuellement
console.log('Test 1:', document.querySelectorAll('[data-pagelet^="AdCard"]').length);
console.log('Test 2:', document.querySelectorAll('[data-pagelet*="Ad"]').length);
console.log('Test 3:', document.body.innerText.match(/See ad details/g)?.length || 0);
```

Envoyez-moi les résultats de ces 3 tests.

## 💡 Conseils

1. **Faites défiler** la page avant de cliquer sur l'extension
2. **Attendez** que les images se chargent
3. Essayez sur **différents mots-clés** ("beauty", "cosmetics", "tech")
4. Assurez-vous d'être sur **facebook.com/ads/library/** (pas marketplace)

---

**Une fois que ça marche, l'extension détectera automatiquement :**
- ✅ Le nombre de variantes (duplications)
- ✅ La durée d'activité de la pub
- ✅ Toutes les données importantes pour le scoring

Le scoring priorise déjà :
- **35%** = Durée d'activité (le plus important)
- **25%** = Nombre de variantes/duplications
- **20%** = Multi-plateforme
- **10%** = Type de contenu
- **10%** = Marché algérien
