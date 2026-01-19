/**
 * Quiz Couples à Distance - Main Application
 * Gère l'interface utilisateur et les interactions
 */

// ===== APPLICATION STATE =====
const AppState = {
  currentView: 'home',
  quizzes: [],
  themes: [],
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: {},
  subscriptionManager: null,
  resultsHistory: null,
  selectedCategory: 'all',
  selectedDifficulty: 'all'
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing Quiz App...');

  // Initialize managers
  AppState.subscriptionManager = new SubscriptionManager();
  AppState.resultsHistory = new ResultsHistory();

  // Load data
  await loadData();

  // Setup UI
  setupEventListeners();
  updateSubscriptionBadge();
  renderCategories();
  renderQuizGrid();
  updateStats();

  // Show home view
  showView('home');

  console.log('✅ App initialized successfully');
});

// ===== DATA LOADING =====
async function loadData() {
  try {
    // Load quizzes
    const quizzesResponse = await fetch('./data/quizzes.json');
    const quizzesData = await quizzesResponse.json();
    AppState.quizzes = quizzesData.quizzes;
    console.log(`📚 Loaded ${AppState.quizzes.length} quizzes`);

    // Load themes
    const themesResponse = await fetch('./data/themes.json');
    const themesData = await themesResponse.json();
    AppState.themes = themesData.themes;
    console.log(`🎨 Loaded ${AppState.themes.length} themes`);
  } catch (error) {
    console.error('❌ Error loading data:', error);
    showError('Impossible de charger les données. Veuillez rafraîchir la page.');
  }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.currentTarget.dataset.view;
      if (view) {
        showView(view);
        updateNavigation(view);
      }
    });
  });

  // Back buttons
  document.getElementById('backBtn')?.addEventListener('click', () => {
    showView('home');
    updateNavigation('home');
  });

  document.getElementById('resultsBackBtn')?.addEventListener('click', () => {
    showView('home');
    updateNavigation('home');
  });

  // Quiz navigation
  document.getElementById('prevBtn')?.addEventListener('click', previousQuestion);
  document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);

  // Filters
  document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
    AppState.selectedCategory = e.target.value;
    renderQuizGrid();
  });

  document.getElementById('difficultyFilter')?.addEventListener('change', (e) => {
    AppState.selectedDifficulty = e.target.value;
    renderQuizGrid();
  });

  // Results actions
  document.getElementById('shareBtn')?.addEventListener('click', shareResults);
  document.getElementById('exportBtn')?.addEventListener('click', exportResults);
  document.getElementById('retakeBtn')?.addEventListener('click', retakeQuiz);

  // Modal
  document.getElementById('closeLockModal')?.addEventListener('click', closeLockModal);
  document.getElementById('upgradeFromModal')?.addEventListener('click', showUpgradeOptions);
  document.getElementById('upgradeBtn')?.addEventListener('click', showUpgradeOptions);
  document.getElementById('settingsBtn')?.addEventListener('click', showSettings);
}

// ===== VIEW MANAGEMENT =====
function showView(viewName) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  // Show selected view
  const view = document.getElementById(`${viewName}View`);
  if (view) {
    view.classList.add('active');
    AppState.currentView = viewName;

    // Render view content
    if (viewName === 'history') {
      renderHistory();
    }
  }
}

function updateNavigation(activeView) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.view === activeView) {
      btn.classList.add('active');
    }
  });
}

// ===== SUBSCRIPTION & STATS =====
function updateSubscriptionBadge() {
  const badge = document.getElementById('subscriptionBadge');
  if (badge) {
    const info = AppState.subscriptionManager.getSubscriptionInfo();
    const config = info.config;
    badge.textContent = config.name;

    // Add color based on level
    badge.style.background = getSubscriptionColor(info.level);
  }
}

function getSubscriptionColor(level) {
  const colors = {
    free: 'rgba(156, 163, 175, 0.2)',
    solo: 'rgba(139, 92, 246, 0.2)',
    couple: 'rgba(236, 72, 153, 0.2)',
    elite: 'rgba(245, 158, 11, 0.2)'
  };
  return colors[level] || colors.free;
}

function updateStats() {
  const history = AppState.resultsHistory.getHistory();

  // Completed quizzes
  document.getElementById('statsCompleted').textContent = history.length;

  // Average score
  if (history.length > 0) {
    const avgScore = Math.round(
      history.reduce((sum, r) => sum + r.totalScore, 0) / history.length
    );
    document.getElementById('statsAverage').textContent = avgScore;
  } else {
    document.getElementById('statsAverage').textContent = '-';
  }

  // Streak (simplified - count consecutive days)
  const streak = calculateStreak(history);
  document.getElementById('statsStreak').textContent = streak;
}

function calculateStreak(history) {
  if (history.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Simple streak: count quizzes in last 7 days
  const recentQuizzes = history.filter(r => {
    const quizDate = new Date(r.completedAt);
    quizDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - quizDate) / (1000 * 60 * 60 * 24));
    return diffDays < 7;
  });

  return recentQuizzes.length;
}

// ===== CATEGORIES =====
function renderCategories() {
  const container = document.getElementById('categoriesGrid');
  if (!container) return;

  // Get unique categories
  const categories = [...new Set(AppState.quizzes.map(q => q.category))];

  const categoryIcons = {
    'Communication': '💬',
    'Intimité & Émotions': '❤️',
    'Psychologie': '🧠',
    'Distance & Organisation': '🗺️',
    'Conflits & Résilience': '🤹',
    'Fun & Légèreté': '🎉',
    'Thèmes Vagues': '✨'
  };

  container.innerHTML = categories.map(category => {
    const count = AppState.quizzes.filter(q => q.category === category).length;
    const icon = categoryIcons[category] || '📝';

    return `
      <div class="category-card" data-category="${category}">
        <div class="category-icon">${icon}</div>
        <div class="category-name">${category}</div>
        <div class="category-count">${count} quiz</div>
      </div>
    `;
  }).join('');

  // Add category filter
  populateCategoryFilter(categories);

  // Add click handlers
  container.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const category = e.currentTarget.dataset.category;
      filterByCategory(category);
    });
  });
}

function populateCategoryFilter(categories) {
  const filter = document.getElementById('categoryFilter');
  if (!filter) return;

  filter.innerHTML = `
    <option value="all">Toutes les catégories</option>
    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
  `;
}

function filterByCategory(category) {
  AppState.selectedCategory = category;
  document.getElementById('categoryFilter').value = category;

  // Update active state
  document.querySelectorAll('.category-card').forEach(card => {
    card.classList.remove('active');
    if (card.dataset.category === category) {
      card.classList.add('active');
    }
  });

  renderQuizGrid();
}

// ===== QUIZ GRID =====
function renderQuizGrid() {
  const container = document.getElementById('quizGrid');
  if (!container) return;

  // Filter quizzes
  let filteredQuizzes = AppState.quizzes;

  if (AppState.selectedCategory !== 'all') {
    filteredQuizzes = filteredQuizzes.filter(q => q.category === AppState.selectedCategory);
  }

  if (AppState.selectedDifficulty !== 'all') {
    filteredQuizzes = filteredQuizzes.filter(q => q.difficulty === AppState.selectedDifficulty);
  }

  // Check access for each quiz
  const quizzesWithAccess = AppState.subscriptionManager.filterAccessibleQuizzes(filteredQuizzes);

  container.innerHTML = quizzesWithAccess.map(quiz => renderQuizCard(quiz)).join('');

  // Add click handlers
  container.querySelectorAll('.quiz-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const quizId = e.currentTarget.dataset.quizId;
      startQuiz(quizId);
    });
  });
}

function renderQuizCard(quiz) {
  const durationMinutes = Math.ceil(quiz.estimated_duration / 60);
  const lockBadge = !quiz.accessible ? `<span class="quiz-lock-badge">🔒 ${quiz.premium_level}</span>` : '';
  const lockedClass = !quiz.accessible ? 'locked' : '';

  return `
    <div class="quiz-card ${lockedClass}" data-quiz-id="${quiz.id}">
      <div class="quiz-card-header">
        ${lockBadge}
        <div class="quiz-card-icon">${getCategoryIcon(quiz.category)}</div>
        <h3 class="quiz-card-title">${quiz.title}</h3>
        <p class="quiz-card-description">${quiz.description}</p>
      </div>
      <div class="quiz-card-body">
        <div class="quiz-meta">
          <span class="quiz-meta-item">⏱️ ${durationMinutes} min</span>
          <span class="quiz-meta-item">❓ ${quiz.questions.length} questions</span>
          <span class="quiz-meta-item">📊 ${quiz.difficulty || 'Medium'}</span>
        </div>
        <div class="quiz-tags">
          <span class="quiz-tag">${quiz.category}</span>
          <span class="quiz-tag">${quiz.premium_level}</span>
        </div>
      </div>
    </div>
  `;
}

function getCategoryIcon(category) {
  const icons = {
    'Communication': '💬',
    'Intimité & Émotions': '❤️',
    'Psychologie': '🧠',
    'Distance & Organisation': '🗺️',
    'Conflits & Résilience': '🤹',
    'Fun & Légèreté': '🎉',
    'Thèmes Vagues': '✨'
  };
  return icons[category] || '📝';
}

// ===== QUIZ TAKING =====
function startQuiz(quizId) {
  const quiz = AppState.quizzes.find(q => q.id === quizId);
  if (!quiz) return;

  // Check access
  const access = AppState.subscriptionManager.canAccessQuiz(quiz);
  if (!access.allowed) {
    showLockModal(access.reason);
    return;
  }

  // Initialize quiz state
  AppState.currentQuiz = quiz;
  AppState.currentQuestionIndex = 0;
  AppState.answers = {};

  // Increment usage counter
  AppState.subscriptionManager.incrementQuizCount();

  // Setup quiz view
  document.getElementById('quizTitle').textContent = quiz.title;
  document.getElementById('quizDescription').textContent = quiz.description;

  const durationMinutes = Math.ceil(quiz.estimated_duration / 60);
  document.getElementById('quizTime').textContent = `⏱️ ${durationMinutes} min`;
  document.getElementById('quizDifficulty').textContent = `📊 ${quiz.difficulty || 'Medium'}`;

  // Show first question
  showQuestion(0);

  // Switch to quiz view
  showView('quiz');
}

function showQuestion(index) {
  if (!AppState.currentQuiz) return;

  const quiz = AppState.currentQuiz;
  const question = quiz.questions[index];

  if (!question) {
    // Quiz complete
    completeQuiz();
    return;
  }

  AppState.currentQuestionIndex = index;

  // Update progress
  const progress = ((index + 1) / quiz.questions.length) * 100;
  document.getElementById('progressFill').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `Question ${index + 1} sur ${quiz.questions.length}`;

  // Render question
  const container = document.getElementById('questionContainer');
  container.innerHTML = `
    <div class="question">
      <div class="question-type">${getQuestionTypeLabel(question.type)}</div>
      <h3 class="question-text">${question.text}</h3>
      ${renderAnswers(question)}
    </div>
  `;

  // Add answer handlers
  setupAnswerHandlers(question);

  // Update navigation buttons
  document.getElementById('prevBtn').disabled = index === 0;
  updateNextButton();
}

function getQuestionTypeLabel(type) {
  const labels = {
    'multiple_choice': 'Choix multiple',
    'scale': 'Échelle',
    'comparison': 'Comparaison'
  };
  return labels[type] || type;
}

function renderAnswers(question) {
  if (question.type === 'scale') {
    return renderScaleAnswers(question);
  } else {
    return renderMultipleChoiceAnswers(question);
  }
}

function renderMultipleChoiceAnswers(question) {
  const selectedAnswer = AppState.answers[question.id];

  return `
    <div class="answers">
      ${question.answers.map((answer, index) => `
        <div class="answer-option ${selectedAnswer === answer.value ? 'selected' : ''}"
             data-question-id="${question.id}"
             data-answer-value="${answer.value}">
          <div class="answer-radio"></div>
          <div class="answer-text">${answer.text}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderScaleAnswers(question) {
  const selectedAnswer = AppState.answers[question.id];
  const scaleSize = question.scale?.max || 5;
  const labels = question.scale?.labels || {};

  return `
    <div class="scale-answers">
      ${Array.from({length: scaleSize}, (_, i) => i + 1).map(value => `
        <div class="scale-option ${selectedAnswer === value ? 'selected' : ''}"
             data-question-id="${question.id}"
             data-answer-value="${value}">
          <div class="scale-value">${value}</div>
        </div>
      `).join('')}
    </div>
    <div class="scale-labels">
      <span>${labels.min || 'Pas du tout'}</span>
      <span>${labels.max || 'Tout à fait'}</span>
    </div>
  `;
}

function setupAnswerHandlers(question) {
  const options = document.querySelectorAll(`[data-question-id="${question.id}"]`);

  options.forEach(option => {
    option.addEventListener('click', (e) => {
      const questionId = e.currentTarget.dataset.questionId;
      const answerValue = e.currentTarget.dataset.answerValue;

      // Save answer (convert to number for scale questions)
      AppState.answers[questionId] = question.type === 'scale'
        ? parseInt(answerValue)
        : parseInt(answerValue);

      // Update UI
      options.forEach(opt => opt.classList.remove('selected'));
      e.currentTarget.classList.add('selected');

      // Enable next button
      updateNextButton();
    });
  });
}

function updateNextButton() {
  const nextBtn = document.getElementById('nextBtn');
  const currentQuestion = AppState.currentQuiz.questions[AppState.currentQuestionIndex];
  const hasAnswer = AppState.answers.hasOwnProperty(currentQuestion.id);

  nextBtn.disabled = !hasAnswer;

  // Change button text for last question
  if (AppState.currentQuestionIndex === AppState.currentQuiz.questions.length - 1) {
    nextBtn.textContent = 'Terminer';
  } else {
    nextBtn.textContent = 'Suivant';
  }
}

function previousQuestion() {
  if (AppState.currentQuestionIndex > 0) {
    showQuestion(AppState.currentQuestionIndex - 1);
  }
}

function nextQuestion() {
  if (AppState.currentQuestionIndex < AppState.currentQuiz.questions.length - 1) {
    showQuestion(AppState.currentQuestionIndex + 1);
  } else {
    completeQuiz();
  }
}

// ===== QUIZ COMPLETION & RESULTS =====
function completeQuiz() {
  if (!AppState.currentQuiz) return;

  // Calculate scores
  const scorer = new QuizScorer(AppState.currentQuiz, AppState.answers);
  const results = scorer.getSummary();

  // Save to history
  AppState.resultsHistory.addResult(results);

  // Update stats
  updateStats();

  // Display results
  displayResults(results);

  // Switch to results view
  showView('results');
}

function displayResults(results) {
  // Header
  document.getElementById('resultsIcon').textContent = getResultIcon(results.overallAssessment.level);
  document.getElementById('resultsTitle').textContent = results.overallAssessment.title;
  document.getElementById('resultsSubtitle').textContent = results.overallAssessment.message;

  // Score
  const scoreNumber = document.getElementById('scoreNumber');
  scoreNumber.textContent = results.totalScore;

  // Animate score circle
  const scoreCircle = document.getElementById('scoreCircle');
  const circumference = 2 * Math.PI * 65; // radius = 65
  const offset = circumference - (results.totalScore / 100) * circumference;

  setTimeout(() => {
    scoreCircle.style.strokeDashoffset = offset;
  }, 100);

  // Add gradient definition if not exists
  if (!document.querySelector('#scoreGradient')) {
    const svg = scoreCircle.closest('svg');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
      </linearGradient>
    `;
    svg.insertBefore(defs, svg.firstChild);
  }

  // Dimensions
  renderDimensions(results.dimensions);

  // Insights
  renderInsights(results.insights);

  // Recommendations
  renderRecommendations(results.recommendations);
}

function getResultIcon(level) {
  const icons = {
    excellent: '🌟',
    good: '👍',
    moderate: '⚖️',
    needsWork: '⚠️'
  };
  return icons[level] || '📊';
}

function renderDimensions(dimensions) {
  const container = document.getElementById('dimensionsGrid');
  if (!container || !dimensions) return;

  container.innerHTML = Object.entries(dimensions).map(([key, data]) => {
    const dimInfo = DIMENSIONS[key];
    if (!dimInfo) return '';

    const level = data.score >= 80 ? 'excellent' :
                  data.score >= 60 ? 'good' :
                  data.score >= 40 ? 'moderate' : 'needsWork';

    return `
      <div class="dimension-card">
        <div class="dimension-header">
          <span class="dimension-icon">${dimInfo.icon}</span>
          <span class="dimension-name">${dimInfo.name}</span>
          <span class="dimension-score">${data.score}</span>
        </div>
        <div class="dimension-bar">
          <div class="dimension-bar-fill ${level}" style="width: ${data.score}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderInsights(insights) {
  const container = document.getElementById('insightsContainer');
  if (!container || !insights) return;

  container.innerHTML = insights.slice(0, 3).map(insight => `
    <div class="insight-card">
      <div class="insight-header">
        <span class="insight-icon">${insight.icon}</span>
        <h4 class="insight-title">${insight.dimensionName}</h4>
      </div>
      <p class="insight-message">${insight.message}</p>
    </div>
  `).join('');
}

function renderRecommendations(recommendations) {
  const container = document.getElementById('recommendationsContainer');
  if (!container || !recommendations) return;

  container.innerHTML = recommendations.map(rec => `
    <div class="recommendation-card">
      <div class="recommendation-header">
        <span class="recommendation-icon">${rec.icon}</span>
        <h4 class="recommendation-title">${rec.title}</h4>
      </div>
      <ul class="recommendation-tips">
        ${rec.tips.slice(0, 3).map(tip => `<li>${tip}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// ===== RESULTS ACTIONS =====
function shareResults() {
  if (navigator.share) {
    navigator.share({
      title: 'Mes résultats de quiz',
      text: 'J\'ai terminé un quiz sur ma relation à distance !',
      url: window.location.href
    }).catch(err => console.log('Share cancelled'));
  } else {
    alert('Partage non supporté sur ce navigateur');
  }
}

function exportResults() {
  const canExport = AppState.subscriptionManager.canExportResults();

  if (!canExport) {
    showLockModal('L\'exportation des résultats nécessite un abonnement Solo ou supérieur.');
    return;
  }

  const history = AppState.resultsHistory.getHistory(1);
  if (history.length === 0) return;

  const results = history[0];
  const dataStr = JSON.stringify(results, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `quiz-results-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
}

function retakeQuiz() {
  if (AppState.currentQuiz) {
    startQuiz(AppState.currentQuiz.id);
  }
}

// ===== HISTORY =====
function renderHistory() {
  const container = document.getElementById('historyContainer');
  if (!container) return;

  const history = AppState.resultsHistory.getHistory();

  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <h3 class="empty-state-title">Aucun historique</h3>
        <p class="empty-state-text">Complétez votre premier quiz pour voir vos résultats ici.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = history.map(result => `
    <div class="history-card" data-result-id="${result.completedAt}">
      <div class="history-header">
        <div>
          <h3 class="history-title">${result.quizTitle}</h3>
          <p class="history-date">${formatDate(result.completedAt)}</p>
        </div>
        <div class="history-score">${result.totalScore}</div>
      </div>
      <div class="history-dimensions">
        ${Object.entries(result.dimensions).slice(0, 4).map(([key, data]) => {
          const dimInfo = DIMENSIONS[key];
          if (!dimInfo) return '';
          return `
            <span class="history-dimension">
              ${dimInfo.icon} ${dimInfo.name}: ${data.score}
            </span>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');

  // Add click handlers to view details
  container.querySelectorAll('.history-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const resultId = e.currentTarget.dataset.resultId;
      viewHistoryDetails(resultId);
    });
  });
}

function viewHistoryDetails(completedAt) {
  const history = AppState.resultsHistory.getHistory();
  const result = history.find(r => r.completedAt === completedAt);

  if (result) {
    displayResults(result);
    showView('results');
  }
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Aujourd\'hui';
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;

  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ===== MODALS =====
function showLockModal(message) {
  const modal = document.getElementById('lockModal');
  const messageEl = document.getElementById('lockMessage');

  if (modal && messageEl) {
    messageEl.textContent = message;
    modal.classList.add('active');
  }
}

function closeLockModal() {
  const modal = document.getElementById('lockModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function showUpgradeOptions() {
  const levels = AppState.subscriptionManager.getAllSubscriptionLevels();

  // Simple alert for now - could be a modal
  let message = 'Niveaux d\'abonnement disponibles:\n\n';

  Object.entries(levels).forEach(([key, config]) => {
    message += `${config.name} - ${config.price}€/mois\n`;
    message += config.features.slice(0, 3).map(f => `  • ${f}`).join('\n') + '\n\n';
  });

  alert(message);
}

function showSettings() {
  const info = AppState.subscriptionManager.getSubscriptionInfo();
  const usage = info.usage;

  let message = `Abonnement: ${info.config.name}\n\n`;
  message += `Quiz ce mois-ci: ${usage.quizzesTaken}`;

  if (info.config.limits.quizPerMonth !== -1) {
    message += ` / ${info.config.limits.quizPerMonth}`;
  }

  message += `\n\nDernière activité: ${usage.lastQuizDate ? formatDate(usage.lastQuizDate) : 'Aucune'}`;

  alert(message);
}

// ===== ERROR HANDLING =====
function showError(message) {
  alert(message);
}

// ===== UTILITY FUNCTIONS =====
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// ===== DEMO/DEBUG FUNCTIONS =====
if (window.location.search.includes('demo=true')) {
  // Demo mode - upgrade to Elite automatically
  setTimeout(() => {
    console.log('🎭 Demo mode activated');
    AppState.subscriptionManager.updateSubscription('elite', 30);
    updateSubscriptionBadge();
    renderQuizGrid();
  }, 1000);
}

console.log('📱 Quiz App loaded successfully');
