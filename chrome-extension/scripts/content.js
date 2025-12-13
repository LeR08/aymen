// État du scan
let scanState = {
  isScanning: false,
  isCancelled: false,
  mode: 'deep',
  scanId: null,
  currentIndex: 0,
  totalAds: 0,
  results: []
};

// Écouter les messages du popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'START_SCAN') {
    startScan(message.mode, message.scanId);
  } else if (message.action === 'CANCEL_SCAN') {
    cancelScan();
  }
});

async function startScan(mode, scanId) {
  if (scanState.isScanning) {
    console.log('Un scan est déjà en cours');
    return;
  }

  scanState = {
    isScanning: true,
    isCancelled: false,
    mode,
    scanId,
    currentIndex: 0,
    totalAds: 0,
    results: []
  };

  try {
    console.log(`Démarrage du scan en mode ${mode}...`);

    // Détecter toutes les annonces
    const adElements = getAdElements();
    scanState.totalAds = adElements.length;

    console.log(`${scanState.totalAds} annonces détectées`);

    if (scanState.totalAds === 0) {
      throw new Error('Aucune annonce trouvée sur cette page');
    }

    // Scanner chaque annonce
    for (let i = 0; i < adElements.length; i++) {
      if (scanState.isCancelled) {
        console.log('Scan annulé par l\'utilisateur');
        return;
      }

      scanState.currentIndex = i + 1;

      const adData = await scanAd(adElements[i], mode);

      if (adData) {
        scanState.results.push(adData);
      }

      // Envoyer la progression
      sendProgress(scanState.currentIndex, scanState.totalAds, adData?.advertiser);

      // Petit délai pour éviter de surcharger la page
      await sleep(mode === 'quick' ? 100 : 500);
    }

    // Calcul des statistiques et identification des winners
    const processedResults = processResults(scanState.results);

    // Envoyer les résultats finaux
    sendComplete(processedResults);

    console.log('Scan terminé avec succès');
  } catch (error) {
    console.error('Erreur lors du scan:', error);
    sendError(error.message);
  } finally {
    scanState.isScanning = false;
  }
}

function getAdElements() {
  // Facebook Ads Library utilise des pagelets pour chaque annonce
  return Array.from(document.querySelectorAll('[data-pagelet^="AdCard"]'));
}

async function scanAd(adElement, mode) {
  try {
    if (mode === 'quick') {
      return await scanAdQuick(adElement);
    } else {
      return await scanAdDeep(adElement);
    }
  } catch (error) {
    console.error('Erreur lors du scan d\'une annonce:', error);
    return null;
  }
}

// Mode rapide : extraction des données visibles
async function scanAdQuick(adElement) {
  const data = {
    id: generateId(),
    scanned_at: new Date().toISOString(),
    mode: 'quick'
  };

  // Nom de l'annonceur
  const advertiserEl = adElement.querySelector('[role="heading"]');
  data.advertiser = advertiserEl ? advertiserEl.textContent.trim() : 'Inconnu';

  // Texte de l'annonce (aperçu)
  const textEl = adElement.querySelector('[data-ad-preview="message"]');
  data.ad_text = textEl ? textEl.textContent.trim() : '';

  // Type de média
  data.media_type = detectMediaType(adElement);

  // Statut (actif/inactif)
  data.status = detectAdStatus(adElement);

  // Plateformes
  data.platforms = extractPlatforms(adElement);

  // Extraction des mots-clés algériens
  data.algerianKeywords = extractAlgerianKeywords(data.ad_text);

  // Données estimées pour le mode rapide
  data.duration_days = estimateDuration(adElement);
  data.variants_count = estimateVariants(adElement);

  // Calcul du score (approximatif en mode rapide)
  data.score_breakdown = calculateScore(data);
  data.score = data.score_breakdown.total;
  data.category = categorizeAd(data);

  return data;
}

// Mode approfondi : clic sur "Voir les détails"
async function scanAdDeep(adElement) {
  const data = {
    id: generateId(),
    scanned_at: new Date().toISOString(),
    mode: 'deep'
  };

  // D'abord, extraire les données de base
  const advertiserEl = adElement.querySelector('[role="heading"]');
  data.advertiser = advertiserEl ? advertiserEl.textContent.trim() : 'Inconnu';

  const textEl = adElement.querySelector('[data-ad-preview="message"]');
  data.ad_text = textEl ? textEl.textContent.trim() : '';

  data.media_type = detectMediaType(adElement);
  data.status = detectAdStatus(adElement);
  data.platforms = extractPlatforms(adElement);

  // Cliquer sur "Voir les détails" pour obtenir plus d'informations
  const detailsButton = adElement.querySelector('[aria-label*="détails"], [aria-label*="details"]');

  if (detailsButton) {
    try {
      // Cliquer sur le bouton
      detailsButton.click();
      await sleep(1500); // Attendre que le modal s'ouvre

      // Extraire les données du modal
      const modal = document.querySelector('[role="dialog"]');

      if (modal) {
        // Dates
        const dates = extractDates(modal);
        data.startDate = dates.start;
        data.endDate = dates.end;
        data.duration_days = calculateDuration(dates.start, dates.end);

        // Nombre de variantes
        data.variants_count = extractVariantsCount(modal);

        // Plateformes complètes
        const fullPlatforms = extractFullPlatforms(modal);
        if (fullPlatforms.length > 0) {
          data.platforms = fullPlatforms;
        }

        // Pays ciblés
        data.countries = extractCountries(modal);

        // Impressions
        data.impressions = extractImpressions(modal);

        // Call-to-action
        data.cta = extractCTA(modal);

        // URLs médias
        data.media_urls = extractMediaUrls(modal);

        // Texte complet
        const fullText = extractFullText(modal);
        if (fullText) {
          data.ad_text = fullText;
        }

        // ID de la page
        data.pageId = extractPageId(modal);

        // URL de l'annonce
        data.url = extractAdUrl(modal);

        // Fermer le modal
        const closeButton = modal.querySelector('[aria-label*="Fermer"], [aria-label*="Close"]');
        if (closeButton) {
          closeButton.click();
          await sleep(500);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'extraction des détails:', error);
    }
  }

  // Extraction des mots-clés algériens
  data.algerianKeywords = extractAlgerianKeywords(data.ad_text);

  // Extraction des prix
  data.prices = extractPrices(data.ad_text);

  // Calcul du score final
  data.score_breakdown = calculateScore(data);
  data.score = data.score_breakdown.total;
  data.category = categorizeAd(data);

  return data;
}

// Fonctions utilitaires d'extraction

function detectMediaType(element) {
  if (element.querySelector('video')) return 'video';
  if (element.querySelector('[aria-label*="Carrousel"], [aria-label*="Carousel"]')) return 'carousel';
  if (element.querySelector('img')) return 'image';
  return 'unknown';
}

function detectAdStatus(element) {
  const statusText = element.textContent.toLowerCase();
  if (statusText.includes('actif') || statusText.includes('active')) return 'active';
  if (statusText.includes('inactif') || statusText.includes('inactive')) return 'inactive';
  return 'unknown';
}

function extractPlatforms(element) {
  const platforms = [];
  const text = element.textContent.toLowerCase();

  if (text.includes('facebook')) platforms.push('Facebook');
  if (text.includes('instagram')) platforms.push('Instagram');
  if (text.includes('messenger')) platforms.push('Messenger');
  if (text.includes('audience network')) platforms.push('Audience Network');

  return platforms.length > 0 ? platforms : ['Facebook'];
}

function extractFullPlatforms(modal) {
  const platforms = [];
  const platformsSection = modal.querySelector('[aria-label*="Plateformes"], [aria-label*="Platforms"]');

  if (platformsSection) {
    const text = platformsSection.textContent;
    if (text.includes('Facebook')) platforms.push('Facebook');
    if (text.includes('Instagram')) platforms.push('Instagram');
    if (text.includes('Messenger')) platforms.push('Messenger');
    if (text.includes('Audience Network')) platforms.push('Audience Network');
  }

  return platforms;
}

function extractDates(modal) {
  const dates = { start: null, end: null };

  // Chercher les éléments de date
  const dateElements = modal.querySelectorAll('time');

  if (dateElements.length >= 1) {
    dates.start = dateElements[0].getAttribute('datetime') || dateElements[0].textContent;
  }

  if (dateElements.length >= 2) {
    dates.end = dateElements[1].getAttribute('datetime') || dateElements[1].textContent;
  }

  // Si pas de date de fin, l'annonce est probablement active
  if (!dates.end && dates.start) {
    dates.end = new Date().toISOString();
  }

  return dates;
}

function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

function extractVariantsCount(modal) {
  // Chercher le texte indiquant le nombre de variantes
  const text = modal.textContent;
  const match = text.match(/(\d+)\s*(?:variante|version|creative)/i);

  if (match) {
    return parseInt(match[1], 10);
  }

  // Compter les aperçus visuels
  const previews = modal.querySelectorAll('[data-ad-preview]');
  return previews.length || 1;
}

function extractCountries(modal) {
  const countries = [];
  const countriesSection = modal.querySelector('[aria-label*="Pays"], [aria-label*="Countries"]');

  if (countriesSection) {
    const text = countriesSection.textContent;
    // Extraire les noms de pays (simplifié)
    if (text.includes('Algérie') || text.includes('Algeria')) countries.push('Algérie');
    if (text.includes('France')) countries.push('France');
    if (text.includes('Maroc') || text.includes('Morocco')) countries.push('Maroc');
  }

  return countries;
}

function extractImpressions(modal) {
  const text = modal.textContent;
  const match = text.match(/(\d+(?:\s*\d+)*)\s*(?:impressions?|vues?)/i);

  if (match) {
    return match[1].replace(/\s/g, '');
  }

  return null;
}

function extractCTA(modal) {
  const ctaButton = modal.querySelector('[data-ad-preview="cta"]');
  return ctaButton ? ctaButton.textContent.trim() : null;
}

function extractMediaUrls(modal) {
  const urls = [];
  const images = modal.querySelectorAll('img[src^="http"]');
  const videos = modal.querySelectorAll('video source[src^="http"]');

  images.forEach(img => {
    if (img.src && !img.src.includes('profile') && !img.src.includes('logo')) {
      urls.push(img.src);
    }
  });

  videos.forEach(video => urls.push(video.src));

  return urls;
}

function extractFullText(modal) {
  const textEl = modal.querySelector('[data-ad-preview="message"]');
  return textEl ? textEl.textContent.trim() : null;
}

function extractPageId(modal) {
  const linkEl = modal.querySelector('a[href*="facebook.com/"]');
  if (linkEl) {
    const match = linkEl.href.match(/facebook\.com\/(\d+)/);
    return match ? match[1] : null;
  }
  return null;
}

function extractAdUrl(modal) {
  const linkEl = modal.querySelector('a[href*="/ads/library/"]');
  return linkEl ? linkEl.href : window.location.href;
}

function estimateDuration(element) {
  // Estimation basique basée sur la présence de texte
  const text = element.textContent.toLowerCase();

  if (text.includes('ans') || text.includes('year')) return 365;
  if (text.includes('mois') || text.includes('month')) return 60;
  if (text.includes('semaine') || text.includes('week')) return 14;

  return 7; // Par défaut : 1 semaine
}

function estimateVariants(element) {
  // Estimation basique
  const previews = element.querySelectorAll('[data-ad-preview]');
  return previews.length || 1;
}

function extractAlgerianKeywords(text) {
  const keywords = [];
  const lowerText = text.toLowerCase();

  const algerianTerms = [
    { term: 'algérie', score: 3 },
    { term: 'algeria', score: 3 },
    { term: 'dz', score: 3 },
    { term: 'alger', score: 2 },
    { term: 'wilaya', score: 2 },
    { term: 'livraison gratuite', score: 2 },
    { term: 'da', score: 2 },
    { term: 'dinar', score: 2 },
    { term: 'paiement à la livraison', score: 3 },
    { term: 'stop desk', score: 2 }
  ];

  algerianTerms.forEach(({ term, score }) => {
    if (lowerText.includes(term)) {
      keywords.push({ term, score });
    }
  });

  return keywords;
}

function extractPrices(text) {
  const prices = [];

  // Regex pour détecter les prix en DA
  const patterns = [
    /(\d+(?:\s*\d+)*)\s*(?:da|dinar|dinars)/gi,
    /(\d+(?:\s*\d+)*)\s*(?:dzd)/gi
  ];

  patterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const price = match[1].replace(/\s/g, '');
      prices.push(parseInt(price, 10));
    }
  });

  return prices;
}

function categorizeAd(data) {
  const text = (data.ad_text || '').toLowerCase();

  const categories = {
    'Beauté & Cosmétiques': ['beauté', 'cosmétique', 'maquillage', 'parfum', 'soin', 'crème'],
    'Mode & Vêtements': ['mode', 'vêtement', 'robe', 'chaussure', 'accessoire', 'fashion'],
    'Tech & Électronique': ['tech', 'électronique', 'smartphone', 'ordinateur', 'écouteur', 'montre'],
    'Maison & Décoration': ['maison', 'décoration', 'meuble', 'cuisine', 'déco'],
    'Sport & Fitness': ['sport', 'fitness', 'musculation', 'yoga', 'running'],
    'Santé & Bien-être': ['santé', 'bien-être', 'vitamine', 'supplément', 'minceur'],
    'Alimentation': ['food', 'alimentation', 'restaurant', 'livraison', 'food'],
    'Services': ['service', 'formation', 'cours', 'coaching']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return 'Autre';
}

// Calcul du score sur 100 points
function calculateScore(data) {
  const breakdown = {
    duration: 0,
    variants: 0,
    platforms: 0,
    mediaType: 0,
    algerianMarket: 0,
    total: 0
  };

  // A. Durée de diffusion (35 points)
  const duration = data.duration_days || 0;
  if (duration >= 61) breakdown.duration = 35;
  else if (duration >= 31) breakdown.duration = 30;
  else if (duration >= 15) breakdown.duration = 20;
  else if (duration >= 8) breakdown.duration = 10;
  else breakdown.duration = 5;

  // B. Nombre de variantes (25 points)
  const variants = data.variants_count || 1;
  if (variants >= 11) breakdown.variants = 25;
  else if (variants >= 6) breakdown.variants = 20;
  else if (variants >= 3) breakdown.variants = 15;
  else breakdown.variants = 5;

  // C. Multi-plateforme (20 points)
  const platformCount = (data.platforms || []).length;
  if (platformCount >= 4) breakdown.platforms = 20;
  else if (platformCount >= 3) breakdown.platforms = 15;
  else if (platformCount >= 2) breakdown.platforms = 10;
  else breakdown.platforms = 5;

  // D. Type de contenu (10 points)
  if (data.media_type === 'video') breakdown.mediaType = 10;
  else if (data.media_type === 'carousel') breakdown.mediaType = 7;
  else breakdown.mediaType = 5;

  // E. Mots-clés marché algérien (10 points)
  const algerianKeywords = data.algerianKeywords || [];
  const algerianScore = algerianKeywords.reduce((sum, kw) => sum + kw.score, 0);
  breakdown.algerianMarket = Math.min(algerianScore, 10);

  // Total
  breakdown.total = Math.round(
    breakdown.duration +
    breakdown.variants +
    breakdown.platforms +
    breakdown.mediaType +
    breakdown.algerianMarket
  );

  return breakdown;
}

function processResults(results) {
  // Trier par score
  const sorted = results.sort((a, b) => b.score - a.score);

  // Identifier les winners (score >= 90)
  const topWinners = sorted.filter(ad => ad.score >= 90);

  // Calculer les statistiques
  const stats = {
    total: results.length,
    averageScore: results.reduce((sum, ad) => sum + ad.score, 0) / results.length,
    winners: topWinners.length,
    promising: sorted.filter(ad => ad.score >= 75 && ad.score < 90).length,
    average: sorted.filter(ad => ad.score >= 60 && ad.score < 75).length,
    low: sorted.filter(ad => ad.score < 60).length
  };

  return {
    ads: sorted,
    topWinners: topWinners.slice(0, 10),
    stats
  };
}

// Fonctions de communication

function sendProgress(current, total, advertiser) {
  chrome.runtime.sendMessage({
    action: 'SCAN_PROGRESS',
    data: { current, total, advertiser }
  });
}

function sendComplete(data) {
  chrome.runtime.sendMessage({
    action: 'SCAN_COMPLETE',
    data
  });
}

function sendError(error) {
  chrome.runtime.sendMessage({
    action: 'SCAN_ERROR',
    error
  });
}

function cancelScan() {
  scanState.isCancelled = true;
}

// Utilitaires

function generateId() {
  return `ad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('Winner Finder content script chargé ✓');
