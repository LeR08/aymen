// État de l'application
let state = {
  mode: 'deep',
  isScanning: false,
  currentScan: null,
  adsCount: 0
};

// Éléments DOM
const elements = {
  initialView: document.getElementById('initial-view'),
  scanningView: document.getElementById('scanning-view'),
  resultsView: document.getElementById('results-view'),

  modeQuick: document.getElementById('mode-quick'),
  modeDeep: document.getElementById('mode-deep'),

  adsCount: document.getElementById('ads-count'),
  estimatedTime: document.getElementById('estimated-time'),
  pageCheck: document.getElementById('page-check'),

  startScan: document.getElementById('start-scan'),
  cancelScan: document.getElementById('cancel-scan'),
  newScan: document.getElementById('new-scan'),
  viewDashboard: document.getElementById('view-dashboard'),
  openDashboard: document.getElementById('open-dashboard'),

  scanningStatus: document.getElementById('scanning-status'),
  scanningDetails: document.getElementById('scanning-details'),
  progressFill: document.getElementById('progress-fill'),
  progressCurrent: document.getElementById('progress-current'),
  progressTotal: document.getElementById('progress-total'),
  timeRemaining: document.getElementById('time-remaining'),

  resultsSummary: document.getElementById('results-summary'),
  winnersList: document.getElementById('winners-list')
};

// Initialisation
document.addEventListener('DOMContentLoaded', init);

async function init() {
  // Vérifier si on est sur Facebook Ads Library
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab && tab.url && tab.url.includes('facebook.com/ads/library')) {
    enableScan();
    detectAds(tab.id);
  } else {
    disableScan();
  }

  // Écouteurs d'événements
  elements.modeQuick.addEventListener('change', handleModeChange);
  elements.modeDeep.addEventListener('change', handleModeChange);
  elements.startScan.addEventListener('click', startScan);
  elements.cancelScan.addEventListener('click', cancelScan);
  elements.newScan.addEventListener('click', resetToInitial);
  elements.viewDashboard.addEventListener('click', openDashboard);
  elements.openDashboard.addEventListener('click', openDashboard);
}

function handleModeChange(e) {
  state.mode = e.target.value;
  updateEstimatedTime();

  // Mettre à jour les styles des cartes
  document.querySelectorAll('.mode-card').forEach(card => {
    card.classList.remove('selected');
  });
  e.target.parentElement.querySelector('.mode-card').classList.add('selected');
}

function enableScan() {
  elements.pageCheck.style.display = 'none';
  elements.startScan.disabled = false;
}

function disableScan() {
  elements.pageCheck.style.display = 'block';
  elements.startScan.disabled = true;
}

async function detectAds(tabId) {
  try {
    // Injecter un script pour compter les annonces
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const adElements = document.querySelectorAll('[data-pagelet^="AdCard"]');
        return adElements.length;
      }
    });

    if (result && result.result) {
      state.adsCount = result.result;
      elements.adsCount.textContent = result.result;
      updateEstimatedTime();
    }
  } catch (error) {
    console.error('Erreur lors de la détection des annonces:', error);
  }
}

function updateEstimatedTime() {
  if (!state.adsCount) {
    elements.estimatedTime.textContent = '-';
    return;
  }

  let timeInSeconds;
  if (state.mode === 'quick') {
    timeInSeconds = Math.ceil(state.adsCount * 0.3); // ~0.3s par annonce
  } else {
    timeInSeconds = Math.ceil(state.adsCount * 4); // ~4s par annonce
  }

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  if (minutes > 0) {
    elements.estimatedTime.textContent = `${minutes}m ${seconds}s`;
  } else {
    elements.estimatedTime.textContent = `${seconds}s`;
  }
}

async function startScan() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id) {
    alert('Erreur : impossible de détecter l\'onglet actif');
    return;
  }

  state.isScanning = true;
  state.currentScan = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    mode: state.mode,
    tabId: tab.id,
    startTime: Date.now(),
    totalAds: state.adsCount
  };

  // Passer à la vue scanning
  showView('scanning');

  // Envoyer un message au content script
  chrome.tabs.sendMessage(tab.id, {
    action: 'START_SCAN',
    mode: state.mode,
    scanId: state.currentScan.id
  });

  // Écouter les mises à jour
  chrome.runtime.onMessage.addListener(handleScanUpdate);
}

function handleScanUpdate(message, sender, sendResponse) {
  if (message.action === 'SCAN_PROGRESS') {
    updateProgress(message.data);
  } else if (message.action === 'SCAN_COMPLETE') {
    handleScanComplete(message.data);
  } else if (message.action === 'SCAN_ERROR') {
    handleScanError(message.error);
  }
}

function updateProgress(data) {
  const { current, total, advertiser } = data;

  elements.progressCurrent.textContent = current;
  elements.progressTotal.textContent = total;

  const percentage = (current / total) * 100;
  elements.progressFill.style.width = `${percentage}%`;

  if (advertiser) {
    elements.scanningDetails.textContent = `Analyse de ${advertiser}...`;
  }

  // Calculer le temps restant
  const elapsed = Date.now() - state.currentScan.startTime;
  const avgTime = elapsed / current;
  const remaining = Math.ceil((total - current) * avgTime / 1000);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  if (minutes > 0) {
    elements.timeRemaining.textContent = `${minutes}m ${seconds}s`;
  } else {
    elements.timeRemaining.textContent = `${seconds}s`;
  }
}

function handleScanComplete(data) {
  state.isScanning = false;

  // Afficher les résultats
  const { ads, topWinners, stats } = data;

  elements.resultsSummary.textContent =
    `${ads.length} annonces analysées • Score moyen : ${stats.averageScore.toFixed(1)}/100`;

  // Afficher les top winners
  displayTopWinners(topWinners);

  // Sauvegarder dans le storage
  saveScanResults(data);

  // Passer à la vue résultats
  showView('results');

  // Afficher une notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '../icons/icon128.png',
    title: 'Analyse terminée !',
    message: `${topWinners.length} produits winners trouvés 🔥`
  });
}

function displayTopWinners(winners) {
  if (!winners || winners.length === 0) {
    elements.winnersList.innerHTML = '<p style="text-align: center; color: #6B7280;">Aucun winner trouvé</p>';
    return;
  }

  const html = winners.slice(0, 3).map(ad => {
    let scoreClass = 'ok';
    let emoji = '⚠️';

    if (ad.score >= 90) {
      scoreClass = 'fire';
      emoji = '🔥';
    } else if (ad.score >= 75) {
      scoreClass = 'star';
      emoji = '⭐';
    }

    return `
      <div class="winner-item">
        <div class="winner-info">
          <div class="winner-name">${ad.advertiser}</div>
          <div class="winner-meta">${ad.duration_days}j • ${ad.variants_count} variantes</div>
        </div>
        <div class="winner-score ${scoreClass}">${emoji} ${ad.score}</div>
      </div>
    `;
  }).join('');

  elements.winnersList.innerHTML = html;
}

async function saveScanResults(data) {
  try {
    // Récupérer les scans existants
    const result = await chrome.storage.local.get('scans');
    const scans = result.scans || [];

    // Ajouter le nouveau scan
    scans.unshift({
      id: state.currentScan.id,
      date: state.currentScan.date,
      mode: state.mode,
      ads: data.ads,
      stats: data.stats,
      topWinners: data.topWinners
    });

    // Limiter à 50 scans max
    if (scans.length > 50) {
      scans.length = 50;
    }

    // Sauvegarder
    await chrome.storage.local.set({ scans });

    console.log('Résultats sauvegardés avec succès');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
}

function handleScanError(error) {
  state.isScanning = false;
  showView('initial');
  alert(`Erreur lors du scan : ${error}`);
}

function cancelScan() {
  if (confirm('Êtes-vous sûr de vouloir annuler le scan ?')) {
    state.isScanning = false;

    // Envoyer un message pour annuler
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'CANCEL_SCAN' });
      }
    });

    showView('initial');
  }
}

function resetToInitial() {
  state.isScanning = false;
  state.currentScan = null;
  showView('initial');
}

function openDashboard() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('dashboard/dashboard.html')
  });
}

function showView(viewName) {
  elements.initialView.classList.remove('active');
  elements.scanningView.classList.remove('active');
  elements.resultsView.classList.remove('active');

  switch (viewName) {
    case 'initial':
      elements.initialView.classList.add('active');
      break;
    case 'scanning':
      elements.scanningView.classList.add('active');
      break;
    case 'results':
      elements.resultsView.classList.add('active');
      break;
  }
}
