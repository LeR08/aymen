# 📘 Guide d'utilisation - Winner Finder Algérie

## Introduction

Bienvenue dans **Winner Finder**, l'extension Chrome qui va révolutionner votre recherche de produits gagnants pour le e-commerce algérien !

Ce guide vous explique pas à pas comment installer et utiliser l'extension pour maximiser vos résultats.

---

## 🚀 Installation en 5 minutes

### Étape 1 : Téléchargement

1. Téléchargez le dossier `chrome-extension`
2. Extrayez-le sur votre ordinateur (par exemple dans `Documents/Extensions`)

### Étape 2 : Installation dans Chrome

1. Ouvrez Google Chrome
2. Tapez dans la barre d'adresse : `chrome://extensions/`
3. Activez le **Mode développeur** (bouton en haut à droite)
4. Cliquez sur **"Charger l'extension non empaquetée"**
5. Sélectionnez le dossier `chrome-extension`

### Étape 3 : Vérification

✅ L'icône Winner Finder apparaît dans la barre d'outils
✅ Cliquez sur l'icône pour ouvrir le popup

**C'est prêt !** 🎉

---

## 🎯 Premier scan - Tutoriel complet

### Étape 1 : Accéder à Facebook Ads Library

1. Ouvrez un nouvel onglet
2. Allez sur : https://www.facebook.com/ads/library/
3. Dans la recherche, tapez un mot-clé (ex: "beauté", "tech", "maison")
4. Attendez que les annonces se chargent

### Étape 2 : Lancer Winner Finder

1. Cliquez sur l'icône Winner Finder (dans la barre d'outils)
2. Le popup s'ouvre et détecte automatiquement les annonces
3. Vous voyez :
   - **Annonces détectées** : nombre d'annonces sur la page
   - **Temps estimé** : durée approximative du scan

### Étape 3 : Choisir le mode de scan

#### ⚡ Mode Rapide
- **Avantages** : Très rapide (5-10 secondes)
- **Inconvénients** : Données limitées, score approximatif
- **Quand l'utiliser** : Pour un aperçu rapide

#### 🎯 Mode Approfondi (RECOMMANDÉ)
- **Avantages** : Toutes les données, score précis
- **Inconvénients** : Plus lent (3-5 min pour 30 annonces)
- **Quand l'utiliser** : Pour une analyse complète

**💡 Conseil :** Utilisez toujours le mode approfondi pour vos vraies recherches !

### Étape 4 : Démarrer l'analyse

1. Sélectionnez le mode (Approfondi par défaut)
2. Cliquez sur **"Démarrer l'analyse"**
3. L'extension commence à scanner :
   - Barre de progression
   - Nom de l'annonceur en cours
   - Temps restant

**⚠️ Ne fermez pas l'onglet pendant le scan !**

### Étape 5 : Consulter les résultats

Une fois le scan terminé :

1. **Popup de résultats** :
   - Nombre d'annonces analysées
   - Score moyen
   - Top 3 Winners affichés

2. **Notification** :
   - Badge sur l'icône
   - Notification desktop (si activée)

3. **Actions possibles** :
   - 📊 **"Voir tous les résultats"** → Ouvre le dashboard
   - 🔄 **"Nouveau scan"** → Revient au début

---

## 📊 Utiliser le Dashboard

### Vue d'ensemble

Le dashboard est divisé en 4 sections :

1. **Statistiques globales** (en haut)
2. **Sélecteur de scan** (historique)
3. **Filtres** (pour affiner les résultats)
4. **Tableau de résultats** (avec toutes les annonces)

### Section 1 : Statistiques globales

4 cartes affichent :
- 📊 **Scans effectués** : Total de tous vos scans
- 📈 **Annonces analysées** : Total d'annonces scannées
- 🔥 **Winners trouvés** : Annonces avec score ≥ 90
- ⭐ **Score moyen** : Moyenne de tous les scores

### Section 2 : Sélecteur de scan

Liste de tous vos scans passés :
- Date et heure du scan
- Mode utilisé (Rapide/Approfondi)
- Nombre d'annonces et winners

**Cliquez sur un scan pour le sélectionner**

### Section 3 : Filtres

Affinez vos résultats avec 5 filtres :

#### 1. Score minimum (slider)
- Déplacez le curseur pour filtrer par score
- Exemple : Score ≥ 75 = Voir uniquement Winners et Prometteurs

#### 2. Durée minimum (jours)
- Annonces diffusant depuis au moins X jours
- Exemple : ≥ 30 jours = Produits qui durent

#### 3. Variantes minimum
- Annonces avec au moins X variantes
- Exemple : ≥ 5 = Annonceurs qui testent activement

#### 4. Catégorie
- Filtrez par catégorie de produit
- 9 catégories disponibles

#### 5. Recherche
- Cherchez par nom d'annonceur
- Non sensible à la casse

**Boutons :**
- ✅ **Appliquer** : Active les filtres
- 🔄 **Réinitialiser** : Supprime tous les filtres

### Section 4 : Tableau de résultats

#### Colonnes disponibles :

1. **Score** : Note sur 100 avec emoji
   - 🔥 90-100 : Winner
   - ⭐ 75-89 : Prometteur
   - ⚠️ 60-74 : Moyen
   - ❌ 0-59 : Faible

2. **Annonceur** : Nom de la page Facebook

3. **Catégorie** : Classification automatique

4. **Durée** : Nombre de jours de diffusion

5. **Variantes** : Nombre de versions testées

6. **Plateformes** : Facebook, Instagram, Messenger, etc.

7. **Type** : Image, Vidéo, Carrousel

8. **Actions** :
   - 👁️ **Détails** : Ouvre le modal complet
   - 🔗 **Voir** : Ouvre l'annonce sur Facebook

#### Tri du tableau

Cliquez sur les en-têtes de colonnes pour trier :
- 1er clic : Tri descendant
- 2e clic : Tri ascendant
- Indicateur : ↕️

---

## 🔍 Analyser les détails d'une annonce

### Ouvrir le modal de détails

Cliquez sur **"👁️ Détails"** dans le tableau

### Sections du modal :

#### 1. Informations générales
- Annonceur
- Score avec badge coloré
- Catégorie
- Mode de scan

#### 2. Détails de diffusion
- Durée totale (jours)
- Date de début
- Date de fin (ou "En cours")
- Statut (Actif/Inactif)

#### 3. Performance
- Nombre de variantes
- Liste des plateformes
- Type de média
- Impressions (si disponible)

#### 4. Détail du score

Breakdown complet :
- Durée : X/35 points
- Variantes : X/25 points
- Plateformes : X/20 points
- Type média : X/10 points
- Marché DZ : X/10 points

**Total : X/100 points**

#### 5. Texte de l'annonce
- Texte complet (en mode approfondi)
- Formatage préservé

#### 6. Mots-clés algériens détectés
- Liste des termes trouvés
- Score associé à chaque terme

#### 7. Prix détectés
- Prix en Dinars (DA)
- Affichés avec badges

#### 8. Lien vers l'annonce
- Bouton **"🔗 Voir sur Facebook"**
- S'ouvre dans un nouvel onglet

---

## 📥 Exporter vos données

### 3 formats disponibles :

#### 1. CSV (Recommandé)
- Compatible Excel, Google Sheets
- Format universel
- Léger et rapide

**Utilisation :**
- Cliquez sur **"📥 CSV"**
- Le fichier `winner-finder-export.csv` se télécharge
- Ouvrez-le dans Excel ou Google Sheets

#### 2. Excel (.xls)
- Format Microsoft Excel
- Directement exploitable dans Excel
- Inclut les colonnes formatées

**Utilisation :**
- Cliquez sur **"📥 Excel"**
- Le fichier `winner-finder-export.xls` se télécharge
- Ouvrez-le dans Microsoft Excel

#### 3. PDF (À venir)
- Format imprimable
- Idéal pour les rapports
- Fonctionnalité en développement

---

## 💡 Cas d'usage et stratégies

### Cas d'usage 1 : Trouver un produit winner rapide

**Objectif :** Identifier un produit gagnant pour se lancer

**Méthode :**
1. Allez sur Facebook Ads Library
2. Cherchez une niche (ex: "beauté")
3. Lancez un scan approfondi
4. Dans le dashboard, appliquez ces filtres :
   - Score ≥ 85
   - Durée ≥ 30 jours
   - Variantes ≥ 5
5. Triez par score décroissant
6. Analysez les top 5
7. Cliquez sur "Détails" pour chaque annonce
8. Notez les patterns communs

**Résultat :** Liste de produits testés et approuvés

### Cas d'usage 2 : Analyser une niche spécifique

**Objectif :** Comprendre les tendances d'une catégorie

**Méthode :**
1. Scannez plusieurs pages de résultats (changez les mots-clés)
2. Dans le dashboard, filtrez par catégorie
3. Analysez les statistiques :
   - Score moyen de la catégorie
   - Durée moyenne
   - Nombre de variantes typique
4. Identifiez les outliers (annonces exceptionnelles)

**Résultat :** Compréhension approfondie du marché

### Cas d'usage 3 : Surveiller les concurrents

**Objectif :** Suivre l'évolution des annonces concurrentes

**Méthode :**
1. Cherchez le nom du concurrent sur Ads Library
2. Lancez un scan
3. Notez les produits actuels
4. Refaites un scan chaque semaine
5. Comparez l'historique dans le dashboard

**Résultat :** Veille concurrentielle efficace

### Cas d'usage 4 : Identifier les marchés porteurs

**Objectif :** Trouver les catégories les plus actives

**Méthode :**
1. Scannez différentes catégories
2. Comparez le nombre de winners par catégorie
3. Analysez les scores moyens
4. Identifiez les catégories avec :
   - Plus de winners
   - Scores élevés
   - Durées longues

**Résultat :** Sélection de niches rentables

---

## 🎓 Comprendre le scoring

### Pourquoi ce système de scoring ?

Le score sur 100 points combine 5 métriques clés qui indiquent qu'un produit performe bien :

### 1. Durée de diffusion (35 points)

**Logique :** Si un annonceur diffuse longtemps, c'est qu'il est rentable.

**Interprétation :**
- 0-7 jours : Test initial
- 8-14 jours : Validation
- 15-30 jours : Bon produit
- 31-60 jours : Très bon produit
- 61+ jours : Winner confirmé

**💡 Astuce :** Privilégiez les annonces de 30+ jours

### 2. Nombre de variantes (25 points)

**Logique :** Tester plusieurs versions = optimisation active = rentabilité

**Interprétation :**
- 1-2 : Débutant ou test simple
- 3-5 : Optimisation classique
- 6-10 : Optimisation avancée
- 11+ : Pro qui scale

**💡 Astuce :** Les pros testent 5+ variantes minimum

### 3. Multi-plateforme (20 points)

**Logique :** Plus de plateformes = budget plus élevé = confiance

**Interprétation :**
- 1 plateforme : Test ou budget limité
- 2 plateformes : Expansion
- 3 plateformes : Scale
- 4 plateformes : Campagne massive

**💡 Astuce :** Facebook + Instagram minimum pour un winner

### 4. Type de contenu (10 points)

**Logique :** La vidéo convertit mieux que l'image

**Classement :**
1. Vidéo (10 pts) : Meilleur engagement
2. Carrousel (7 pts) : Bon pour les variantes
3. Image (5 pts) : Standard

**💡 Astuce :** La vidéo est presque toujours préférable

### 5. Marché algérien (10 points)

**Logique :** Ciblage DZ spécifique = adapté au marché local

**Détection :**
- Géographie : "Algérie", "DZ", "Alger"
- Commerce : "Livraison gratuite", "Paiement livraison"
- Monnaie : "DA", "Dinar", prix en dinars

**💡 Astuce :** Un vrai produit DZ mentionne ces termes

### Exemple concret

**Annonce "Sérum anti-âge"**

| Critère | Valeur | Points | Max |
|---------|--------|--------|-----|
| Durée | 52 jours | 30 | 35 |
| Variantes | 7 | 20 | 25 |
| Plateformes | FB + IG + Messenger | 15 | 20 |
| Type | Vidéo | 10 | 10 |
| Marché DZ | "Algérie", "3500 DA", "Livraison" | 7 | 10 |

**Score total : 82/100 → ⭐ Prometteur**

**Conclusion :** Bon produit avec potentiel, manque un peu de durée pour être Winner.

---

## ⚙️ Paramètres et personnalisation

### Notifications

Par défaut, l'extension affiche :
- Badge sur l'icône (nombre de winners)
- Notification desktop à la fin du scan

### Stockage

- **Limite :** 50 scans maximum
- **Nettoyage auto :** Les scans les plus anciens sont supprimés
- **Bouton manuel :** "🗑️ Effacer l'historique" dans le dashboard

### Confidentialité

✅ Toutes les données restent locales
✅ Aucun serveur externe
✅ Aucune collecte de données
✅ Aucun tracking

---

## 🐛 Résolution de problèmes

### Problème : Le scan ne démarre pas

**Causes possibles :**
- Vous n'êtes pas sur facebook.com/ads/library
- Aucune annonce n'est visible
- L'extension n'est pas activée

**Solutions :**
1. Vérifiez l'URL (doit contenir "facebook.com/ads/library")
2. Actualisez la page
3. Attendez que les annonces se chargent
4. Vérifiez que l'extension est activée dans chrome://extensions/

### Problème : Données manquantes

**Causes possibles :**
- Mode rapide utilisé
- Annonce sans toutes les données
- Changement de structure Facebook

**Solutions :**
1. Utilisez le mode approfondi
2. Certaines annonces n'ont pas toutes les infos (normal)
3. Vérifiez si l'extension est à jour

### Problème : Scan très lent

**Causes possibles :**
- Trop d'annonces
- Mode approfondi (normal)
- Connexion lente

**Solutions :**
1. Réduisez le nombre d'annonces visibles (filtrez sur Facebook)
2. Mode approfondi = 3-5s par annonce (normal)
3. Vérifiez votre connexion internet

### Problème : Erreur pendant le scan

**Causes possibles :**
- Structure HTML modifiée par Facebook
- Annonce supprimée pendant le scan
- Problème réseau

**Solutions :**
1. Relancez le scan
2. Actualisez la page Facebook
3. Vérifiez votre connexion

### Problème : Export ne fonctionne pas

**Causes possibles :**
- Navigateur bloque les téléchargements
- Aucune donnée à exporter

**Solutions :**
1. Autorisez les téléchargements dans Chrome
2. Vérifiez qu'un scan est sélectionné
3. Vérifiez que des résultats sont affichés

---

## 📈 Bonnes pratiques

### 1. Scannez régulièrement
- 1 fois par semaine minimum
- Surveillez les nouvelles tendances
- Comparez l'évolution

### 2. Ciblez vos recherches
- Utilisez des mots-clés précis sur Ads Library
- Testez différentes variations
- Explorez plusieurs niches

### 3. Analysez en profondeur
- Ne vous contentez pas du score
- Lisez les textes d'annonces
- Identifiez les patterns

### 4. Exportez vos données
- Créez une base de données de winners
- Suivez l'évolution dans le temps
- Partagez avec votre équipe

### 5. Combinez avec d'autres outils
- Winner Finder = Identification
- Autres outils = Validation (recherche fournisseurs, etc.)

---

## 🎯 Checklist du parfait scan

Avant de scanner :
- [ ] Je suis sur facebook.com/ads/library
- [ ] J'ai fait une recherche pertinente
- [ ] Les annonces sont visibles
- [ ] J'ai choisi le mode approfondi

Pendant le scan :
- [ ] Je ne ferme pas l'onglet
- [ ] Je laisse le navigateur au premier plan (recommandé)
- [ ] Je surveille la progression

Après le scan :
- [ ] Je consulte les top winners
- [ ] J'ouvre le dashboard
- [ ] J'applique des filtres pertinents
- [ ] J'analyse les détails des annonces prometteuses
- [ ] J'exporte les résultats

Analyse approfondie :
- [ ] Je note les patterns communs
- [ ] Je vérifie les textes d'annonces
- [ ] Je regarde les visuels (sur Facebook)
- [ ] Je compare avec mes critères
- [ ] Je valide avec d'autres sources

---

## 🚀 Aller plus loin

### Créer une base de données personnelle

1. Exportez régulièrement en CSV
2. Consolidez dans un tableur Google Sheets
3. Ajoutez vos propres colonnes :
   - Fournisseur trouvé
   - Marge estimée
   - Intérêt personnel
   - Status (à tester, en cours, abandonné)

### Automatiser la recherche

1. Créez une routine hebdomadaire
2. Scannez les mêmes mots-clés chaque semaine
3. Comparez l'évolution
4. Identifiez les nouveaux entrants

### Partager avec votre équipe

1. Exportez les résultats
2. Partagez le fichier CSV/Excel
3. Discutez en équipe des opportunités
4. Répartissez les tests

---

## 📞 Support et mises à jour

### Obtenir de l'aide

- 📖 Relisez ce guide
- ❓ Consultez la FAQ dans le README
- 🐛 Signalez un bug (si applicable)

### Mises à jour

L'extension sera régulièrement mise à jour pour :
- S'adapter aux changements de Facebook
- Ajouter de nouvelles fonctionnalités
- Corriger les bugs
- Améliorer les performances

**Comment mettre à jour :**
1. Téléchargez la nouvelle version
2. Allez dans chrome://extensions/
3. Cliquez sur "Recharger" sous Winner Finder

---

## 🎓 Conclusion

Vous avez maintenant toutes les clés pour utiliser **Winner Finder** comme un pro !

**Rappelez-vous :**
- ✅ Utilisez le mode approfondi
- ✅ Scannez régulièrement
- ✅ Analysez en profondeur
- ✅ Exportez vos données
- ✅ Combinez avec d'autres validations

**Cette extension est un outil puissant, mais ce qui fera la différence, c'est VOTRE analyse et VOTRE action !**

🔥 Bonne chasse aux produits winners ! 🔥

---

**Winner Finder - Algérie**
*Trouvez les produits gagnants du marché algérien en quelques clics*
