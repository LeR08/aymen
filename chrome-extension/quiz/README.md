# 💕 Quiz Couples à Distance

> Système de quiz intelligent pour couples à distance - **100% sans IA en production**

## 🎯 Vue d'Ensemble

Un système complet de quiz psychologiques pour couples à distance, utilisant l'IA **uniquement pour la génération de contenu** en amont, et consommant des données statiques en production.

### ✨ Principe Fondamental

```
🤖 IA = Outil de CRÉATION (avant déploiement)
📱 App = Produit STABLE (zéro coût IA)
💰 Coûts = QUASI ZÉRO en production
📈 Scalabilité = EXCELLENTE
```

## 📊 Statistiques

| Métrique | Valeur |
|----------|--------|
| **Thèmes générés** | 100 |
| **Quiz fonctionnels** | 7 |
| **Questions totales** | ~80 |
| **Dimensions psycho** | 8 |
| **Catégories** | 7 |
| **Niveaux d'abonnement** | 4 |
| **Coût IA en prod** | 0€ |
| **Lignes de code** | ~5000 |

## 📁 Structure du Projet

```
chrome-extension/quiz/
├── data/
│   ├── schema.json          # Schéma de données (définitions)
│   ├── themes.json          # 100 thèmes organisés par catégorie
│   └── quizzes.json         # 7 quiz complets avec questions
│
├── subscription.js          # Système d'abonnement (Free/Solo/Couple/Elite)
├── scoring.js               # Calcul des scores et génération d'insights
├── quiz.html                # Interface utilisateur principale
├── generate_quizzes.py      # Script de génération de contenu
├── demo.html                # Page de démonstration interactive
└── README.md                # Ce fichier
```

## 🎨 Fonctionnalités

### ✅ Implémenté

- [x] **100 Thèmes** répartis sur 7 catégories
- [x] **7 Quiz fonctionnels** avec 10-15 questions
- [x] **Système d'abonnement** à 4 niveaux
- [x] **Scoring psychologique** sur 8 dimensions
- [x] **Génération d'insights** automatique
- [x] **Recommandations** personnalisées
- [x] **Interface HTML** moderne
- [x] **Historique** des résultats
- [x] **Comparaison** partenaire (Couple+)

### 🔄 En cours

- [ ] Finaliser CSS (quiz.css)
- [ ] Ajouter JavaScript interactif (quiz.js)
- [ ] Créateur de quiz personnalisés (Elite)
- [ ] 13 quiz supplémentaires

## 🏗️ Architecture

### Données Statiques (JSON)

```javascript
// themes.json
{
  "version": "1.0.0",
  "total_themes": 100,
  "themes": [
    {
      "id": "theme_001",
      "title": "Communication asynchrone",
      "category": "Communication",
      "premium_level": "free",
      ...
    }
  ]
}

// quizzes.json
{
  "version": "1.0.0",
  "total_quizzes": 7,
  "quizzes": [
    {
      "id": "quiz_001",
      "title": "Communication asynchrone",
      "questions": [...],
      "scoring_method": "dimension_based",
      ...
    }
  ]
}
```

### Système d'Abonnement

```javascript
const subscriptionMgr = new SubscriptionManager();

// Vérifier l'accès à un quiz
const access = subscriptionMgr.canAccessQuiz(quiz);
if (access.allowed) {
  // Lancer le quiz
} else {
  console.log(access.reason); // Message de verrouillage
}

// Mettre à jour l'abonnement
subscriptionMgr.updateSubscription('couple', 30); // 30 jours
```

### Calcul des Scores

```javascript
const scorer = new QuizScorer(quiz, answers);
const results = scorer.getSummary();

console.log(results.totalScore);        // 85
console.log(results.dimensions);         // Scores par dimension
console.log(results.insights);           // Array d'insights
console.log(results.recommendations);    // Array de recommandations
console.log(results.overallAssessment); // Évaluation globale
```

## 🧠 8 Dimensions Psychologiques

| Dimension | Description | Icône |
|-----------|-------------|-------|
| **Sécurité Émotionnelle** | Sentiment de stabilité dans la relation | 🛡️ |
| **Communication** | Qualité et efficacité des échanges | 💬 |
| **Confiance** | Niveau de confiance mutuelle | 🤝 |
| **Intimité** | Connexion profonde émotionnelle | ❤️ |
| **Indépendance** | Équilibre autonomie/relation | 🦅 |
| **Résolution de Conflits** | Capacité à gérer les désaccords | 🤹 |
| **Planification du Futur** | Vision commune de l'avenir | 🗺️ |
| **Connexion Ludique** | Complicité et moments légers | 🎉 |

## 📚 Catégories de Thèmes

1. **Communication** (15 thèmes)
   - Communication asynchrone
   - Malentendus par message
   - Appels vidéo
   - Ton des messages
   - ...

2. **Intimité & Émotions** (15 thèmes)
   - Manque de contact physique
   - Besoin de réassurance
   - Jalousie à distance
   - Moments de complicité
   - ...

3. **Psychologie** (15 thèmes)
   - Style d'attachement
   - Gestion du stress
   - Langages de l'amour
   - Intelligence émotionnelle
   - ...

4. **Distance & Organisation** (15 thèmes)
   - Fuseaux horaires
   - Planification des retrouvailles
   - Projets communs
   - Finances
   - ...

5. **Conflits & Résilience** (15 thèmes)
   - Disputes à distance
   - Non-dits
   - Gestion de la colère
   - Pardon
   - ...

6. **Fun & Légèreté** (15 thèmes)
   - Qui est le plus... ?
   - Scénarios imaginaires
   - Souvenirs communs
   - Défis
   - ...

7. **Thèmes Vagues** (10 thèmes)
   - Votre relation en ce moment
   - Ce que vous ressentez sans le dire
   - Votre équilibre à distance
   - ...

## 💎 Niveaux d'Abonnement

### 🆓 Free
- 3 quiz par mois
- Thèmes vagues et fun uniquement
- Résultats basiques
- Historique 7 jours

### 💼 Solo (4.99€)
- Quiz illimités
- Tous les thèmes précis
- Résultats détaillés + insights
- Historique complet
- Exportation

### 💑 Couple (7.99€)
- Tout du plan Solo
- Quiz synchronisés
- Comparaison des réponses
- Analyse de compatibilité
- Mode duo interactif

### 🌟 Elite (12.99€)
- Tout du plan Couple
- **Création de quiz personnalisés**
- Quiz profonds exclusifs
- Analyses avancées
- Support prioritaire
- Export PDF + graphiques

## 📝 Exemples de Quiz

### Quiz 1: Communication asynchrone
- **Niveau**: Free
- **Catégorie**: Communication
- **Questions**: 10
- **Durée**: 5 minutes
- **Dimensions**: emotional_security, trust, communication

### Quiz 2: Jalousie à distance
- **Niveau**: Couple
- **Catégorie**: Intimité & Émotions
- **Questions**: 12
- **Durée**: 8 minutes
- **Comparaison**: Oui
- **Dimensions**: trust, emotional_security, communication

### Quiz 3: Qui est le plus... ?
- **Niveau**: Free
- **Catégorie**: Fun & Légèreté
- **Questions**: 12
- **Durée**: 5 minutes
- **Type**: Fun
- **Comparaison**: Oui

## 🚀 Utilisation

### 1. Ouvrir la Démo

```bash
# Depuis le terminal
cd /home/user/aymen/chrome-extension/quiz
# Ouvrir demo.html dans un navigateur
```

### 2. Charger les Données

```javascript
// Charger les quiz
fetch('./data/quizzes.json')
  .then(res => res.json())
  .then(data => {
    console.log(`${data.total_quizzes} quiz chargés`);
    console.log(data.quizzes);
  });

// Charger les thèmes
fetch('./data/themes.json')
  .then(res => res.json())
  .then(data => {
    console.log(`${data.total_themes} thèmes chargés`);
  });
```

### 3. Prendre un Quiz

```javascript
// 1. Sélectionner un quiz
const quiz = quizzes[0];

// 2. Vérifier l'accès
const subscriptionMgr = new SubscriptionManager();
const access = subscriptionMgr.canAccessQuiz(quiz);

if (!access.allowed) {
  alert(access.reason);
  return;
}

// 3. Collecter les réponses
const answers = {
  q1: 5,
  q2: 4,
  q3: 3,
  // ...
};

// 4. Calculer le score
const scorer = new QuizScorer(quiz, answers);
const results = scorer.getSummary();

// 5. Afficher les résultats
console.log(`Score: ${results.totalScore}/100`);
console.log(`Niveau: ${results.overallAssessment.title}`);

// 6. Sauvegarder l'historique
const history = new ResultsHistory();
history.addResult(results);
```

## 🎯 Génération de Contenu

### Générer de nouveaux quiz

```python
# Utiliser le script Python
python3 generate_quizzes.py

# Ou créer manuellement selon le schéma
# Voir data/schema.json pour la structure
```

### Prompts IA pour génération

```
Génère un quiz complet pour couples à distance sur le thème "[THEME]".

Structure requise:
- 10-15 questions
- Type: multiple_choice ou scale
- Dimensions psychologiques
- Ton bienveillant et non-intrusif
- Scoring: dimension_based

Format JSON selon schema.json
```

## 🔧 Configuration

### Modifier les limites d'abonnement

```javascript
// Dans subscription.js
const SUBSCRIPTION_CONFIG = {
  free: {
    limits: {
      quizPerMonth: 3,  // Modifier ici
      historyDays: 7
    }
  },
  // ...
};
```

### Ajouter une dimension

```javascript
// Dans scoring.js
const DIMENSIONS = {
  // Ajouter ici
  new_dimension: {
    name: 'Nouvelle Dimension',
    description: 'Description...',
    icon: '🎯'
  }
};
```

## 📊 Flow de Données

```
┌─────────────────────────────────────────────┐
│  1. GÉNÉRATION (Une fois, avec IA)          │
│     ├─ Thèmes (Claude/ChatGPT)              │
│     ├─ Questions (Claude/ChatGPT)           │
│     └─ Sauvegarde JSON                      │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  2. PRODUCTION (Zéro IA, 100% local)        │
│     ├─ Chargement JSON statique             │
│     ├─ Affichage des quiz                   │
│     ├─ Réponses utilisateur                 │
│     ├─ Calcul local des scores              │
│     ├─ Génération insights (pré-calculés)   │
│     └─ Sauvegarde localStorage              │
└─────────────────────────────────────────────┘
```

## ✅ Avantages de Cette Approche

1. **Zéro coût IA en production** - Pas d'appels API récurrents
2. **Performance maximale** - Pas de latence réseau
3. **Scalabilité** - Peut gérer des millions d'utilisateurs
4. **Offline-first** - Fonctionne sans connexion
5. **Sécurité** - Données sensibles restent locales
6. **Simplicité** - Pas de backend complexe
7. **Rentabilité** - Coûts d'infrastructure minimaux

## 🛠️ Technologies

- **Vanilla JavaScript** - Pas de frameworks lourds
- **JSON** - Format de données léger
- **LocalStorage** - Stockage local des résultats
- **CSS3** - Animations et design moderne
- **HTML5** - Structure sémantique

## 📝 TODO

- [ ] Finaliser quiz.css avec tous les styles
- [ ] Ajouter quiz.js pour l'interactivité
- [ ] Implémenter le créateur de quiz personnalisés
- [ ] Générer 13 quiz supplémentaires (total 20)
- [ ] Ajouter export PDF des résultats
- [ ] Implémenter mode duo synchronisé
- [ ] Ajouter graphiques de progression
- [ ] Tests unitaires des systèmes de scoring

## 🤝 Contribution

Ce système est conçu pour être facilement extensible :

1. **Ajouter des thèmes** : Éditer `data/themes.json`
2. **Ajouter des quiz** : Éditer `data/quizzes.json`
3. **Modifier le scoring** : Éditer `scoring.js`
4. **Changer les abonnements** : Éditer `subscription.js`

## 📄 License

Propriété de Aymen - Tous droits réservés

---

**Créé avec ❤️ pour les couples à distance**

🔗 **Démo**: Ouvrir `demo.html` dans un navigateur
📊 **Données**: Voir le dossier `data/`
💻 **Code**: Voir `subscription.js` et `scoring.js`
