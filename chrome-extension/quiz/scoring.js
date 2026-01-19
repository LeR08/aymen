/**
 * Système de Scoring pour Quiz Couples à Distance
 * Calcule les scores, analyse les résultats et génère des insights
 */

/**
 * Dimensions psychologiques évaluées
 */
const DIMENSIONS = {
  emotional_security: {
    name: 'Sécurité Émotionnelle',
    description: 'Votre sentiment de sécurité et de stabilité dans la relation',
    icon: '🛡️'
  },
  communication: {
    name: 'Communication',
    description: 'Qualité et efficacité de vos échanges',
    icon: '💬'
  },
  trust: {
    name: 'Confiance',
    description: 'Niveau de confiance mutuelle',
    icon: '🤝'
  },
  intimacy: {
    name: 'Intimité',
    description: 'Proximité émotionnelle et connexion profonde',
    icon: '❤️'
  },
  independence: {
    name: 'Indépendance',
    description: 'Équilibre entre autonomie et relation',
    icon: '🦅'
  },
  conflict_resolution: {
    name: 'Résolution de Conflits',
    description: 'Capacité à gérer et résoudre les désaccords',
    icon: '🤹'
  },
  future_planning: {
    name: 'Planification du Futur',
    description: 'Vision commune et organisation de l\'avenir',
    icon: '🗺️'
  },
  fun_connection: {
    name: 'Connexion Ludique',
    description: 'Complicité et moments de légèreté',
    icon: '🎉'
  }
};

/**
 * Classe de calcul de scores
 */
class QuizScorer {
  constructor(quiz, answers) {
    this.quiz = quiz;
    this.answers = answers; // {questionId: answerValue}
    this.dimensionScores = {};
    this.totalScore = 0;
  }

  /**
   * Calcule tous les scores
   */
  calculateScores() {
    switch (this.quiz.scoring_method) {
      case 'dimension_based':
        return this.calculateDimensionScores();
      case 'compatibility':
        return this.calculateCompatibilityScore();
      case 'fun':
        return this.calculateFunScore();
      case 'insight':
        return this.calculateInsightScore();
      default:
        return this.calculateDimensionScores();
    }
  }

  /**
   * Calcule les scores par dimension
   */
  calculateDimensionScores() {
    const dimensionTotals = {};
    const dimensionCounts = {};

    // Initialiser
    Object.keys(DIMENSIONS).forEach(dim => {
      dimensionTotals[dim] = 0;
      dimensionCounts[dim] = 0;
    });

    // Parcourir toutes les questions et réponses
    this.quiz.questions.forEach(question => {
      const answerId = this.answers[question.id];
      if (!answerId) return;

      // Trouver la réponse sélectionnée
      const selectedAnswer = question.answers.find(a =>
        a.value === answerId || a.text === answerId
      );

      if (!selectedAnswer) return;

      // Ajouter le score à la dimension principale
      const mainDimension = question.dimension;
      dimensionTotals[mainDimension] += selectedAnswer.value || 0;
      dimensionCounts[mainDimension]++;

      // Ajouter les scores aux dimensions secondaires si présents
      if (selectedAnswer.dimension_score) {
        Object.entries(selectedAnswer.dimension_score).forEach(([dim, score]) => {
          dimensionTotals[dim] = (dimensionTotals[dim] || 0) + score;
          dimensionCounts[dim] = (dimensionCounts[dim] || 0) + 1;
        });
      }
    });

    // Calculer les moyennes (normalisées sur 100)
    const dimensionScores = {};
    Object.keys(dimensionTotals).forEach(dim => {
      if (dimensionCounts[dim] > 0) {
        const average = dimensionTotals[dim] / dimensionCounts[dim];
        // Normaliser sur 100 (supposant que les valeurs max sont 5)
        dimensionScores[dim] = {
          score: Math.round((average / 5) * 100),
          rawScore: average,
          questionCount: dimensionCounts[dim]
        };
      }
    });

    // Calculer le score total
    const scores = Object.values(dimensionScores).map(d => d.score);
    this.totalScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    this.dimensionScores = dimensionScores;

    return {
      totalScore: this.totalScore,
      dimensions: dimensionScores,
      insights: this.generateInsights(),
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Calcule le score de compatibilité (pour quiz en couple)
   */
  calculateCompatibilityScore() {
    // TODO: Implémenter la comparaison avec les réponses du partenaire
    return {
      compatibilityScore: 0,
      matches: [],
      differences: [],
      insights: []
    };
  }

  /**
   * Calcule le score pour quiz fun
   */
  calculateFunScore() {
    let matches = 0;
    let total = 0;

    this.quiz.questions.forEach(question => {
      const answer = this.answers[question.id];
      if (answer) {
        total++;
        // Dans les quiz fun, on peut avoir des comparaisons
        // Pour l'instant, on retourne juste les réponses
      }
    });

    return {
      funScore: Math.round((matches / total) * 100),
      answers: this.answers,
      insights: this.generateFunInsights()
    };
  }

  /**
   * Calcule le score pour quiz insight (thèmes vagues)
   */
  calculateInsightScore() {
    return this.calculateDimensionScores();
  }

  /**
   * Génère des insights basés sur les scores
   */
  generateInsights() {
    const insights = [];

    Object.entries(this.dimensionScores).forEach(([dimension, data]) => {
      const dimInfo = DIMENSIONS[dimension];
      const score = data.score;

      let level, message;
      if (score >= 80) {
        level = 'excellent';
        message = `Excellente ${dimInfo.name.toLowerCase()} ! Vous gérez cet aspect remarquablement bien à distance.`;
      } else if (score >= 60) {
        level = 'good';
        message = `Bonne ${dimInfo.name.toLowerCase()}. Il y a de la place pour améliorer mais vous êtes sur la bonne voie.`;
      } else if (score >= 40) {
        level = 'moderate';
        message = `${dimInfo.name} modérée. Cet aspect pourrait bénéficier d'une attention particulière.`;
      } else {
        level = 'needsWork';
        message = `${dimInfo.name} à renforcer. La distance semble peser sur cet aspect de votre relation.`;
      }

      insights.push({
        dimension,
        dimensionName: dimInfo.name,
        icon: dimInfo.icon,
        score: data.score,
        level,
        message,
        description: dimInfo.description
      });
    });

    // Trier par score (du plus bas au plus haut pour identifier les priorités)
    insights.sort((a, b) => a.score - b.score);

    return insights;
  }

  /**
   * Génère des recommandations personnalisées
   */
  generateRecommendations() {
    const recommendations = [];
    const insights = this.generateInsights();

    // Prendre les 3 dimensions les plus faibles
    const weakDimensions = insights.slice(0, 3);

    weakDimensions.forEach(insight => {
      const recommendation = this.getRecommendationForDimension(insight.dimension, insight.score);
      if (recommendation) {
        recommendations.push({
          dimension: insight.dimensionName,
          icon: insight.icon,
          priority: insight.score < 40 ? 'high' : insight.score < 60 ? 'medium' : 'low',
          ...recommendation
        });
      }
    });

    return recommendations;
  }

  /**
   * Génère des insights fun pour les quiz légers
   */
  generateFunInsights() {
    return [
      {
        type: 'fun',
        message: 'Vous avez terminé le quiz ! Comparez vos réponses avec votre partenaire.',
        emoji: '🎉'
      }
    ];
  }

  /**
   * Retourne une recommandation spécifique selon la dimension
   */
  getRecommendationForDimension(dimension, score) {
    const recommendations = {
      emotional_security: {
        title: 'Renforcer la Sécurité Émotionnelle',
        tips: [
          'Exprimez régulièrement vos sentiments et vos besoins',
          'Créez des rituels de réassurance quotidiens',
          'Partagez vos peurs et vulnérabilités',
          'Planifiez vos prochaines retrouvailles pour avoir un objectif commun'
        ],
        quiz: 'Essayez le quiz "Besoin de réassurance émotionnelle"'
      },
      communication: {
        title: 'Améliorer la Communication',
        tips: [
          'Établissez des créneaux fixes pour des appels de qualité',
          'Variez les modes de communication (texte, voix, vidéo)',
          'Pratiquez l\'écoute active sans jugement',
          'Clarifiez les malentendus immédiatement'
        ],
        quiz: 'Essayez le quiz "Ton des messages écrits"'
      },
      trust: {
        title: 'Renforcer la Confiance',
        tips: [
          'Soyez transparent(e) sur vos activités quotidiennes',
          'Respectez vos engagements et promesses',
          'Évitez les comportements qui alimentent la jalousie',
          'Discutez ouvertement de vos insécurités'
        ],
        quiz: 'Essayez le quiz "Jalousie à distance"'
      },
      intimacy: {
        title: 'Approfondir l\'Intimité',
        tips: [
          'Partagez vos pensées et rêves profonds',
          'Créez des moments intimes malgré la distance',
          'Exprimez votre amour de différentes manières',
          'Maintenez une connexion émotionnelle et physique (vidéo)'
        ],
        quiz: 'Essayez le quiz "Vos langages de l\'amour"'
      },
      independence: {
        title: 'Équilibrer Indépendance et Relation',
        tips: [
          'Respectez le besoin d\'espace de chacun',
          'Cultivez vos propres passions et amitiés',
          'Évitez la dépendance émotionnelle excessive',
          'Célébrez les accomplissements individuels'
        ],
        quiz: 'Essayez le quiz "Besoin d\'indépendance"'
      },
      conflict_resolution: {
        title: 'Améliorer la Résolution de Conflits',
        tips: [
          'Choisissez le bon moment et le bon canal pour les discussions sérieuses',
          'Utilisez le "je" au lieu du "tu" accusateur',
          'Prenez le temps de vous calmer avant de répondre',
          'Cherchez des solutions gagnant-gagnant'
        ],
        quiz: 'Essayez le quiz "Disputes à distance"'
      },
      future_planning: {
        title: 'Planifier Votre Avenir',
        tips: [
          'Discutez régulièrement de vos objectifs à long terme',
          'Créez un plan pour mettre fin à la distance',
          'Alignez vos priorités personnelles et de couple',
          'Fixez des échéances réalistes pour vos projets communs'
        ],
        quiz: 'Essayez le quiz "Objectifs de couple à long terme"'
      },
      fun_connection: {
        title: 'Renforcer la Complicité Ludique',
        tips: [
          'Planifiez des activités virtuelles ensemble (jeux, films)',
          'Créez des blagues et références internes',
          'Surprenez-vous mutuellement',
          'Ne prenez pas tout au sérieux, riez ensemble'
        ],
        quiz: 'Essayez le quiz "Qui est le plus... ?"'
      }
    };

    return recommendations[dimension] || null;
  }

  /**
   * Retourne un résumé global du quiz
   */
  getSummary() {
    const results = this.calculateScores();

    let overallAssessment;
    if (results.totalScore >= 80) {
      overallAssessment = {
        level: 'excellent',
        title: '🌟 Excellente Relation à Distance !',
        message: 'Vous gérez admirablement bien les défis de la distance. Continuez ainsi !'
      };
    } else if (results.totalScore >= 60) {
      overallAssessment = {
        level: 'good',
        title: '👍 Relation Solide',
        message: 'Votre relation à distance fonctionne bien. Quelques ajustements pourraient la rendre encore meilleure.'
      };
    } else if (results.totalScore >= 40) {
      overallAssessment = {
        level: 'moderate',
        title: '⚖️ Relation en Équilibre',
        message: 'Votre relation traverse des hauts et des bas. Il est temps de travailler sur certains aspects.'
      };
    } else {
      overallAssessment = {
        level: 'needsWork',
        title: '⚠️ Relation Fragile',
        message: 'La distance pèse sur votre relation. Une attention urgente est nécessaire sur plusieurs aspects.'
      };
    }

    return {
      quizTitle: this.quiz.title,
      quizCategory: this.quiz.category,
      completedAt: new Date().toISOString(),
      ...results,
      overallAssessment
    };
  }
}

/**
 * Classe de gestion de l'historique des résultats
 */
class ResultsHistory {
  constructor() {
    this.history = this.loadHistory();
  }

  loadHistory() {
    const stored = localStorage.getItem('quiz_results_history');
    return stored ? JSON.parse(stored) : [];
  }

  saveHistory() {
    localStorage.setItem('quiz_results_history', JSON.stringify(this.history));
  }

  addResult(result) {
    this.history.unshift(result); // Ajouter au début

    // Limiter à 50 résultats max
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
    }

    this.saveHistory();
  }

  getHistory(limit = 10) {
    return this.history.slice(0, limit);
  }

  getResultsByQuiz(quizId) {
    return this.history.filter(r => r.quiz.id === quizId);
  }

  getResultsByCategory(category) {
    return this.history.filter(r => r.quiz.category === category);
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
  }

  getProgressOverTime(dimension) {
    return this.history
      .filter(r => r.dimensions && r.dimensions[dimension])
      .map(r => ({
        date: r.completedAt,
        score: r.dimensions[dimension].score
      }))
      .reverse(); // Du plus ancien au plus récent
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    QuizScorer,
    ResultsHistory,
    DIMENSIONS
  };
}
