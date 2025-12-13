# 🔥 Winner Finder – Algérie

Extension Chrome pour analyser automatiquement les annonces Facebook Ads Library et identifier les produits gagnants pour le e-commerce algérien.

## 📋 Table des matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Algorithme de scoring](#algorithme-de-scoring)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [FAQ](#faq)

## 🎯 Présentation

**Winner Finder** est une extension Chrome qui vous permet de scanner automatiquement les annonces de Facebook Ads Library pour détecter les produits qui performent le mieux sur le marché algérien.

### Pourquoi cette extension ?

- ✅ Gain de temps considérable dans la recherche de produits
- ✅ Analyse automatique et scoring sur 100 points
- ✅ Identification des tendances du marché algérien
- ✅ Dashboard complet avec filtres et exports
- ✅ Sauvegarde de l'historique des scans

## 🚀 Fonctionnalités

### 1. Deux modes de scan

#### ⚡ Mode Rapide
- Analyse superficielle (5-10 secondes)
- Extraction des données visibles uniquement
- Score approximatif
- Idéal pour un aperçu rapide

#### 🎯 Mode Approfondi (Recommandé)
- Analyse complète avec ouverture des détails
- Extraction de toutes les données disponibles
- Score précis et fiable
- Durée : 3-5 secondes par annonce

### 2. Données extraites

**Mode rapide :**
- Nom de l'annonceur
- Texte aperçu
- Type de média
- Statut (actif/inactif)
- Plateformes

**Mode approfondi (en plus) :**
- Date de début / date de fin
- Nombre de variantes
- Toutes les versions de l'annonce
- Plateformes complètes
- Pays ciblés
- Impressions (si disponibles)
- Texte complet
- Call-to-action
- URLs des médias

### 3. Algorithme de scoring intelligent

Score sur 100 points basé sur :
- **35%** - Durée de diffusion
- **25%** - Nombre de variantes
- **20%** - Multi-plateforme
- **10%** - Type de contenu
- **10%** - Mots-clés marché algérien

### 4. Dashboard complet

- 📊 Statistiques globales
- 🔍 Filtres avancés
- 📈 Tri par colonnes
- 📥 Export CSV/Excel/PDF
- 🗂️ Historique des scans

### 5. Détection marché algérien

L'extension détecte automatiquement :
- Mots-clés : Algérie, DZ, Alger, wilaya
- Termes commerciaux : Livraison gratuite, Paiement à la livraison
- Prix en Dinar (DA, DZD)
- Ciblage géographique

## 📦 Installation

### Méthode 1 : Installation manuelle (développement)

1. **Téléchargez l'extension**
   - Téléchargez ou clonez ce dépôt

2. **Ouvrez Chrome**
   - Allez sur `chrome://extensions/`

3. **Activez le mode développeur**
   - Basculez le bouton "Mode développeur" en haut à droite

4. **Chargez l'extension**
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier `chrome-extension`

5. **L'extension est installée !**
   - L'icône devrait apparaître dans la barre d'outils

### Méthode 2 : Installation depuis le Chrome Web Store

> 🚧 À venir - L'extension sera bientôt disponible sur le Chrome Web Store

## 📖 Utilisation

### 1. Scanner des annonces

1. **Ouvrez Facebook Ads Library**
   - Allez sur https://www.facebook.com/ads/library/
   - Recherchez un terme (ex: "produit", "livraison", etc.)

2. **Lancez l'extension**
   - Cliquez sur l'icône Winner Finder
   - Choisissez le mode de scan (Rapide ou Approfondi)

3. **Démarrez l'analyse**
   - Cliquez sur "Démarrer l'analyse"
   - Attendez que le scan se termine

4. **Consultez les résultats**
   - Visualisez les top winners directement dans le popup
   - Cliquez sur "Voir tous les résultats" pour le dashboard complet

### 2. Utiliser le dashboard

Le dashboard vous permet de :

- **Visualiser tous vos scans** : Sélectionnez un scan dans l'historique
- **Filtrer les résultats** :
  - Par score minimum
  - Par durée de diffusion
  - Par nombre de variantes
  - Par catégorie
  - Par nom d'annonceur

- **Trier le tableau** : Cliquez sur les en-têtes de colonnes

- **Voir les détails** : Cliquez sur "👁️ Détails" pour voir toutes les informations

- **Exporter les données** :
  - CSV : Pour Excel ou Google Sheets
  - Excel : Format .xls
  - PDF : Document imprimable (à venir)

### 3. Interpréter les scores

| Score | Catégorie | Signification |
|-------|-----------|---------------|
| 90-100 | 🔥 Winner | Excellent produit, très performant |
| 75-89 | ⭐ Prometteur | Bon potentiel, à surveiller |
| 60-74 | ⚠️ Moyen | Performance correcte |
| 0-59 | ❌ Faible | Performance insuffisante |

## 📊 Algorithme de scoring

### Détail du calcul (100 points)

#### A. Durée de diffusion (35 points)

Plus une annonce diffuse longtemps, plus elle est probablement rentable.

- 0-7 jours → 5 points
- 8-14 jours → 10 points
- 15-30 jours → 20 points
- 31-60 jours → 30 points
- 61+ jours → 35 points

#### B. Nombre de variantes (25 points)

Tester plusieurs variantes indique une optimisation active.

- 1-2 variantes → 5 points
- 3-5 variantes → 15 points
- 6-10 variantes → 20 points
- 11+ variantes → 25 points

#### C. Multi-plateforme (20 points)

Diffuser sur plusieurs plateformes = budget plus important.

- 1 plateforme → 5 points
- 2 plateformes → 10 points
- 3 plateformes → 15 points
- 4+ plateformes → 20 points

#### D. Type de contenu (10 points)

La vidéo performe généralement mieux.

- Image → 5 points
- Carrousel → 7 points
- Vidéo → 10 points

#### E. Mots-clés marché algérien (10 points)

Détection de ciblage spécifique au marché DZ.

- "Algérie", "Algeria", "DZ" → +3 points
- "Livraison gratuite" → +2 points
- "DA", "Dinar", prix en DA → +2 points
- "Paiement à la livraison" → +3 points

**Maximum : 10 points**

### Exemple de calcul

**Annonce X :**
- Durée : 45 jours → 30 points
- Variantes : 8 → 20 points
- Plateformes : Facebook, Instagram, Messenger → 15 points
- Type : Vidéo → 10 points
- Mots-clés DZ : "Algérie", "Livraison gratuite", "2500 DA" → 7 points

**Score total : 82/100 → ⭐ Prometteur**

## 📁 Structure du projet

```
chrome-extension/
├── manifest.json           # Configuration Manifest V3
├── README.md              # Documentation
│
├── icons/                 # Icônes de l'extension
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
│
├── popup/                 # Interface popup
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── dashboard/             # Dashboard complet
│   ├── dashboard.html
│   ├── dashboard.css
│   └── dashboard.js
│
├── scripts/               # Scripts de l'extension
│   ├── content.js         # Script d'extraction
│   └── background.js      # Service Worker
│
├── styles/                # Styles globaux
│   └── content.css
│
└── utils/                 # Utilitaires (si nécessaire)
```

## 🛠️ Technologies utilisées

- **Manifest V3** : Dernière version des extensions Chrome
- **Vanilla JavaScript** : Pas de framework, code optimisé
- **Chrome Storage API** : Stockage local des données
- **Chrome Notifications API** : Alertes et badges
- **CSS Grid & Flexbox** : Layout moderne et responsive
- **Tailwind-inspired CSS** : Variables CSS personnalisées

## 🎨 Design

### Palette de couleurs

- 🟢 Vert : `#10B981` (Success, Winners)
- 🔵 Bleu : `#3B82F6` (Primary, Actions)
- 🟡 Jaune : `#F59E0B` (Warning, Prometteur)
- 🔴 Rouge : `#EF4444` (Error, Faible)
- ⚫ Gris : `#6B7280` (Text, Borders)

### Police

- **Inter** : Police moderne et lisible
- Fallback : System fonts (San Francisco, Segoe UI, etc.)

## ❓ FAQ

### L'extension fonctionne-t-elle sur d'autres navigateurs ?

Non, cette extension est conçue spécifiquement pour Google Chrome et les navigateurs basés sur Chromium (Edge, Brave, Opera).

### Combien de temps prend un scan ?

- **Mode rapide** : 5-10 secondes pour 30 annonces
- **Mode approfondi** : 3-5 secondes par annonce (~3 minutes pour 30 annonces)

### Les données sont-elles sauvegardées ?

Oui, toutes les données sont sauvegardées localement dans Chrome Storage. L'historique est limité à 50 scans maximum.

### L'extension envoie-t-elle des données à un serveur ?

Non, toutes les données restent 100% locales sur votre ordinateur. Aucune donnée n'est envoyée à un serveur externe.

### Puis-je exporter mes données ?

Oui, vous pouvez exporter vos résultats en CSV ou Excel depuis le dashboard.

### L'extension respecte-t-elle les conditions d'utilisation de Facebook ?

Cette extension lit uniquement les données publiques disponibles sur Facebook Ads Library, qui est une bibliothèque publique d'annonces. Elle n'accède à aucune donnée privée.

### Comment mettre à jour l'extension ?

Si vous avez installé l'extension manuellement, téléchargez la nouvelle version et rechargez l'extension depuis `chrome://extensions/`.

### L'algorithme de scoring peut-il être personnalisé ?

Dans cette version, l'algorithme est fixe. Une future version pourrait permettre de personnaliser les poids de chaque critère.

## 🐛 Bugs connus et limitations

### Limitations actuelles

- L'extension ne fonctionne que sur Facebook Ads Library
- Certaines données (impressions, ciblage) ne sont pas toujours disponibles
- La structure HTML de Facebook peut changer et nécessiter une mise à jour
- Le mode approfondi peut être lent pour un grand nombre d'annonces

### Problèmes possibles

**Le scan ne démarre pas**
- Vérifiez que vous êtes bien sur facebook.com/ads/library
- Actualisez la page
- Vérifiez que des annonces sont visibles

**Données manquantes**
- Le mode rapide ne collecte que les données visibles
- Utilisez le mode approfondi pour des données complètes
- Certaines annonces n'ont pas toutes les données disponibles

**Erreur lors du scan**
- Facebook a peut-être modifié sa structure HTML
- Vérifiez votre connexion internet
- Essayez de réduire le nombre d'annonces à scanner

## 📝 Changelog

### Version 1.0.0 (2025-12-13)

🎉 Version initiale

**Fonctionnalités :**
- ✅ Scanner en modes rapide et approfondi
- ✅ Algorithme de scoring sur 100 points
- ✅ Dashboard complet avec filtres
- ✅ Export CSV/Excel
- ✅ Détection marché algérien
- ✅ Catégorisation automatique
- ✅ Historique des scans
- ✅ Notifications

## 📄 Licence

Cette extension est fournie "en l'état", sans garantie d'aucune sorte.

## 👨‍💻 Développeur

Développé avec ❤️ pour la communauté e-commerce algérienne

---

**Note :** Cette extension est un outil d'analyse destiné aux professionnels du e-commerce. Utilisez-la de manière responsable et éthique.

🔥 Bonne chasse aux produits winners !
