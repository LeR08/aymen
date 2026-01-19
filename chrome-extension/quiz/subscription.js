/**
 * Système d'Abonnement pour Quiz Couples à Distance
 * Gère les niveaux d'accès et les fonctionnalités par abonnement
 */

// Définition des niveaux d'abonnement
const SUBSCRIPTION_LEVELS = {
  FREE: 'free',
  SOLO: 'solo',
  COUPLE: 'couple',
  ELITE: 'elite'
};

// Configuration des abonnements
const SUBSCRIPTION_CONFIG = {
  free: {
    name: 'Gratuit',
    price: 0,
    features: [
      'Accès à 3 quiz par mois',
      'Thèmes vagues et fun uniquement',
      'Résultats basiques',
      'Historique limité (7 jours)'
    ],
    limits: {
      quizPerMonth: 3,
      historyDays: 7,
      canCreateCustomQuiz: false,
      canCompareWithPartner: false,
      canExportResults: false
    },
    allowedThemeTypes: ['vague', 'fun'],
    allowedCategories: [
      'Fun & Légèreté',
      'Thèmes Vagues'
    ]
  },

  solo: {
    name: 'Solo',
    price: 4.99,
    features: [
      'Quiz illimités',
      'Tous les thèmes précis',
      'Résultats détaillés avec insights psychologiques',
      'Historique complet',
      'Analyse personnelle approfondie',
      'Exportation des résultats'
    ],
    limits: {
      quizPerMonth: -1, // illimité
      historyDays: -1, // illimité
      canCreateCustomQuiz: false,
      canCompareWithPartner: false,
      canExportResults: true
    },
    allowedThemeTypes: ['precise', 'vague', 'fun'],
    allowedCategories: 'all'
  },

  couple: {
    name: 'Couple',
    price: 7.99,
    features: [
      'Tout du plan Solo',
      'Quiz synchronisés avec partenaire',
      'Comparaison des réponses',
      'Analyse de compatibilité',
      'Suggestions personnalisées',
      'Thèmes de couple exclusifs',
      'Mode duo interactif'
    ],
    limits: {
      quizPerMonth: -1,
      historyDays: -1,
      canCreateCustomQuiz: false,
      canCompareWithPartner: true,
      canExportResults: true
    },
    allowedThemeTypes: ['precise', 'vague', 'fun'],
    allowedCategories: 'all'
  },

  elite: {
    name: 'Elite',
    price: 12.99,
    features: [
      'Tout du plan Couple',
      'Création de quiz personnalisés illimitée',
      'Quiz profonds exclusifs',
      'Analyses avancées',
      'Support prioritaire',
      'Exportation avancée (PDF, graphiques)',
      'Accès anticipé aux nouveaux quiz',
      'Session de coaching virtuel (1x/mois)'
    ],
    limits: {
      quizPerMonth: -1,
      historyDays: -1,
      canCreateCustomQuiz: true,
      canCompareWithPartner: true,
      canExportResults: true,
      maxCustomQuizzes: -1 // illimité
    },
    allowedThemeTypes: ['precise', 'vague', 'fun'],
    allowedCategories: 'all'
  }
};

/**
 * Classe de gestion des abonnements
 */
class SubscriptionManager {
  constructor() {
    this.currentSubscription = this.loadSubscription();
    this.usageStats = this.loadUsageStats();
  }

  /**
   * Charge l'abonnement actuel depuis Chrome Storage
   */
  loadSubscription() {
    // Par défaut, l'utilisateur est en free
    const stored = localStorage.getItem('quiz_subscription');
    return stored ? JSON.parse(stored) : {
      level: SUBSCRIPTION_LEVELS.FREE,
      startDate: new Date().toISOString(),
      endDate: null,
      autoRenew: false
    };
  }

  /**
   * Charge les statistiques d'utilisation
   */
  loadUsageStats() {
    const stored = localStorage.getItem('quiz_usage_stats');
    return stored ? JSON.parse(stored) : {
      currentMonth: new Date().getMonth(),
      quizzesTaken: 0,
      lastQuizDate: null,
      customQuizzesCreated: 0
    };
  }

  /**
   * Sauvegarde l'abonnement
   */
  saveSubscription() {
    localStorage.setItem('quiz_subscription', JSON.stringify(this.currentSubscription));
  }

  /**
   * Sauvegarde les stats d'utilisation
   */
  saveUsageStats() {
    localStorage.setItem('quiz_usage_stats', JSON.stringify(this.usageStats));
  }

  /**
   * Met à jour le niveau d'abonnement
   */
  updateSubscription(level, duration = 30) {
    if (!SUBSCRIPTION_CONFIG[level]) {
      throw new Error('Niveau d\'abonnement invalide');
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + duration);

    this.currentSubscription = {
      level,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      autoRenew: false
    };

    this.saveSubscription();
    return this.currentSubscription;
  }

  /**
   * Vérifie si un quiz est accessible avec l'abonnement actuel
   */
  canAccessQuiz(quiz) {
    const config = SUBSCRIPTION_CONFIG[this.currentSubscription.level];

    // Vérifier le type de thème
    if (!config.allowedThemeTypes.includes(quiz.theme_type)) {
      return {
        allowed: false,
        reason: `Ce quiz nécessite un abonnement ${quiz.premium_level}`
      };
    }

    // Vérifier la catégorie
    if (config.allowedCategories !== 'all' &&
        !config.allowedCategories.includes(quiz.category)) {
      return {
        allowed: false,
        reason: 'Cette catégorie nécessite un abonnement supérieur'
      };
    }

    // Vérifier le niveau premium du quiz
    const premiumHierarchy = ['free', 'solo', 'couple', 'elite'];
    const userLevelIndex = premiumHierarchy.indexOf(this.currentSubscription.level);
    const quizLevelIndex = premiumHierarchy.indexOf(quiz.premium_level);

    if (quizLevelIndex > userLevelIndex) {
      return {
        allowed: false,
        reason: `Ce quiz nécessite un abonnement ${quiz.premium_level}`
      };
    }

    // Vérifier les limites mensuelles (uniquement pour free)
    if (this.currentSubscription.level === SUBSCRIPTION_LEVELS.FREE) {
      if (!this.checkMonthlyLimit()) {
        return {
          allowed: false,
          reason: 'Limite mensuelle de quiz atteinte. Passez à un abonnement supérieur pour un accès illimité.'
        };
      }
    }

    return {
      allowed: true
    };
  }

  /**
   * Vérifie si la limite mensuelle est respectée
   */
  checkMonthlyLimit() {
    const currentMonth = new Date().getMonth();

    // Réinitialiser le compteur si on est dans un nouveau mois
    if (this.usageStats.currentMonth !== currentMonth) {
      this.usageStats = {
        currentMonth,
        quizzesTaken: 0,
        lastQuizDate: null,
        customQuizzesCreated: 0
      };
      this.saveUsageStats();
    }

    const config = SUBSCRIPTION_CONFIG[this.currentSubscription.level];
    const limit = config.limits.quizPerMonth;

    // -1 = illimité
    if (limit === -1) return true;

    return this.usageStats.quizzesTaken < limit;
  }

  /**
   * Incrémente le compteur de quiz pris
   */
  incrementQuizCount() {
    this.usageStats.quizzesTaken++;
    this.usageStats.lastQuizDate = new Date().toISOString();
    this.saveUsageStats();
  }

  /**
   * Vérifie si l'utilisateur peut créer des quiz personnalisés
   */
  canCreateCustomQuiz() {
    const config = SUBSCRIPTION_CONFIG[this.currentSubscription.level];
    return config.limits.canCreateCustomQuiz;
  }

  /**
   * Vérifie si l'utilisateur peut comparer avec son partenaire
   */
  canCompareWithPartner() {
    const config = SUBSCRIPTION_CONFIG[this.currentSubscription.level];
    return config.limits.canCompareWithPartner;
  }

  /**
   * Vérifie si l'utilisateur peut exporter les résultats
   */
  canExportResults() {
    const config = SUBSCRIPTION_CONFIG[this.currentSubscription.level];
    return config.limits.canExportResults;
  }

  /**
   * Retourne les informations sur l'abonnement actuel
   */
  getSubscriptionInfo() {
    const config = SUBSCRIPTION_CONFIG[this.currentSubscription.level];
    return {
      ...this.currentSubscription,
      config,
      usage: this.usageStats
    };
  }

  /**
   * Retourne tous les niveaux d'abonnement disponibles
   */
  getAllSubscriptionLevels() {
    return SUBSCRIPTION_CONFIG;
  }

  /**
   * Filtre une liste de quiz selon l'abonnement actuel
   */
  filterAccessibleQuizzes(quizzes) {
    return quizzes.map(quiz => {
      const access = this.canAccessQuiz(quiz);
      return {
        ...quiz,
        accessible: access.allowed,
        lockReason: access.reason || null
      };
    });
  }
}

// Export pour utilisation dans l'extension
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SubscriptionManager,
    SUBSCRIPTION_LEVELS,
    SUBSCRIPTION_CONFIG
  };
}
