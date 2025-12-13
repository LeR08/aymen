// Background Service Worker
console.log('Winner Finder background service worker démarré');

// État global
let scanningState = {
  isActive: false,
  tabId: null,
  startTime: null
};

// Écouter l'installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installée:', details.reason);

  if (details.reason === 'install') {
    // Première installation
    initializeExtension();
  } else if (details.reason === 'update') {
    // Mise à jour
    console.log('Extension mise à jour vers la version', chrome.runtime.getManifest().version);
  }
});

async function initializeExtension() {
  // Initialiser le storage
  await chrome.storage.local.set({
    scans: [],
    settings: {
      autoNotify: true,
      soundEnabled: false,
      darkMode: false
    }
  });

  console.log('Extension initialisée avec succès');

  // Ouvrir une page de bienvenue (optionnel)
  // chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
}

// Gérer les messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'SCAN_STARTED') {
    handleScanStarted(sender.tab.id);
  } else if (message.action === 'SCAN_COMPLETE') {
    handleScanComplete(message.data, sender.tab.id);
  } else if (message.action === 'SCAN_ERROR') {
    handleScanError(message.error, sender.tab.id);
  }
});

function handleScanStarted(tabId) {
  scanningState = {
    isActive: true,
    tabId,
    startTime: Date.now()
  };

  // Mettre à jour le badge
  updateBadge('...', '#3B82F6');

  console.log('Scan démarré sur l\'onglet', tabId);
}

async function handleScanComplete(data, tabId) {
  scanningState.isActive = false;

  const duration = Date.now() - scanningState.startTime;
  console.log(`Scan terminé en ${(duration / 1000).toFixed(1)}s`);

  // Mettre à jour le badge avec le nombre de winners
  const winnersCount = data.topWinners ? data.topWinners.length : 0;
  updateBadge(winnersCount > 0 ? winnersCount.toString() : '✓', '#10B981');

  // Afficher une notification
  const settings = await getSettings();

  if (settings.autoNotify) {
    chrome.notifications.create({
      type: 'basic',
      title: '🔥 Scan terminé !',
      message: `${winnersCount} produit${winnersCount > 1 ? 's' : ''} winner${winnersCount > 1 ? 's' : ''} trouvé${winnersCount > 1 ? 's' : ''}`,
      priority: 2
    });
  }

  // Effacer le badge après 10 secondes
  setTimeout(() => {
    chrome.action.setBadgeText({ text: '' });
  }, 10000);
}

function handleScanError(error, tabId) {
  scanningState.isActive = false;

  console.error('Erreur de scan:', error);

  // Badge d'erreur
  updateBadge('!', '#EF4444');

  // Notification d'erreur
  chrome.notifications.create({
    type: 'basic',
    title: '❌ Erreur de scan',
    message: error,
    priority: 2
  });

  // Effacer le badge après 5 secondes
  setTimeout(() => {
    chrome.action.setBadgeText({ text: '' });
  }, 5000);
}

function updateBadge(text, color) {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
}

async function getSettings() {
  const result = await chrome.storage.local.get('settings');
  return result.settings || {
    autoNotify: true,
    soundEnabled: false,
    darkMode: false
  };
}

// Gérer les clics sur les notifications
chrome.notifications.onClicked.addListener((notificationId) => {
  // Ouvrir le dashboard
  chrome.tabs.create({
    url: chrome.runtime.getURL('dashboard/dashboard.html')
  });
});

// Nettoyage périodique des anciens scans (garder max 50)
chrome.alarms.create('cleanup', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'cleanup') {
    await cleanupOldScans();
  }
});

async function cleanupOldScans() {
  const result = await chrome.storage.local.get('scans');
  const scans = result.scans || [];

  if (scans.length > 50) {
    // Garder les 50 plus récents
    const cleaned = scans.slice(0, 50);
    await chrome.storage.local.set({ scans: cleaned });
    console.log(`Nettoyage: ${scans.length - 50} anciens scans supprimés`);
  }
}

// Gestion du contexte menu (optionnel)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'scan-page',
    title: 'Scanner cette page avec Winner Finder',
    contexts: ['page'],
    documentUrlPatterns: ['https://www.facebook.com/ads/library/*']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'scan-page') {
    // Ouvrir le popup ou envoyer un message
    chrome.action.openPopup();
  }
});

console.log('Background service worker prêt ✓');
