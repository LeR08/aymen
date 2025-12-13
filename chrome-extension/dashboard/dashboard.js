// État de l'application
let state = {
  scans: [],
  currentScan: null,
  filteredAds: [],
  sortBy: 'score',
  sortOrder: 'desc',
  filters: {
    score: 0,
    duration: 0,
    variants: 0,
    category: 'all',
    search: ''
  }
};

// Éléments DOM
const elements = {
  totalScans: document.getElementById('total-scans'),
  totalAds: document.getElementById('total-ads'),
  totalWinners: document.getElementById('total-winners'),
  avgScore: document.getElementById('avg-score'),

  scanList: document.getElementById('scan-list'),
  resultsTbody: document.getElementById('results-tbody'),
  resultsCount: document.getElementById('results-count'),
  emptyState: document.getElementById('empty-state'),

  filterScore: document.getElementById('filter-score'),
  filterScoreValue: document.getElementById('filter-score-value'),
  filterDuration: document.getElementById('filter-duration'),
  filterVariants: document.getElementById('filter-variants'),
  filterCategory: document.getElementById('filter-category'),
  filterSearch: document.getElementById('filter-search'),

  applyFilters: document.getElementById('apply-filters'),
  resetFilters: document.getElementById('reset-filters'),

  exportCsv: document.getElementById('export-csv'),
  exportExcel: document.getElementById('export-excel'),
  exportPdf: document.getElementById('export-pdf'),

  refreshBtn: document.getElementById('refresh-btn'),
  clearBtn: document.getElementById('clear-btn'),

  detailsModal: document.getElementById('details-modal'),
  modalClose: document.getElementById('modal-close'),
  modalBody: document.getElementById('modal-body')
};

// Initialisation
document.addEventListener('DOMContentLoaded', init);

async function init() {
  await loadScans();
  updateGlobalStats();
  renderScanList();

  // Écouteurs d'événements
  elements.filterScore.addEventListener('input', (e) => {
    elements.filterScoreValue.textContent = e.target.value;
  });

  elements.applyFilters.addEventListener('click', applyFilters);
  elements.resetFilters.addEventListener('click', resetFilters);

  elements.exportCsv.addEventListener('click', () => exportData('csv'));
  elements.exportExcel.addEventListener('click', () => exportData('excel'));
  elements.exportPdf.addEventListener('click', () => exportData('pdf'));

  elements.refreshBtn.addEventListener('click', () => {
    loadScans();
    location.reload();
  });

  elements.clearBtn.addEventListener('click', clearHistory);

  elements.modalClose.addEventListener('click', closeModal);
  elements.detailsModal.querySelector('.modal-overlay').addEventListener('click', closeModal);

  // Tri du tableau
  document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => handleSort(th.dataset.sort));
  });
}

async function loadScans() {
  try {
    const result = await chrome.storage.local.get('scans');
    state.scans = result.scans || [];

    if (state.scans.length > 0) {
      state.currentScan = state.scans[0];
      state.filteredAds = state.currentScan.ads || [];
    }
  } catch (error) {
    console.error('Erreur lors du chargement des scans:', error);
  }
}

function updateGlobalStats() {
  const totalScans = state.scans.length;
  const totalAds = state.scans.reduce((sum, scan) => sum + (scan.ads?.length || 0), 0);
  const totalWinners = state.scans.reduce((sum, scan) => {
    const winners = (scan.ads || []).filter(ad => ad.score >= 90);
    return sum + winners.length;
  }, 0);

  const allAds = state.scans.flatMap(scan => scan.ads || []);
  const avgScore = allAds.length > 0
    ? (allAds.reduce((sum, ad) => sum + ad.score, 0) / allAds.length).toFixed(1)
    : 0;

  elements.totalScans.textContent = totalScans;
  elements.totalAds.textContent = totalAds;
  elements.totalWinners.textContent = totalWinners;
  elements.avgScore.textContent = avgScore;
}

function renderScanList() {
  if (state.scans.length === 0) {
    elements.scanList.innerHTML = '<p style="text-align: center; color: #6B7280;">Aucun scan disponible</p>';
    elements.emptyState.classList.add('show');
    return;
  }

  elements.emptyState.classList.remove('show');

  const html = state.scans.map((scan, index) => {
    const date = new Date(scan.date);
    const dateStr = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const adsCount = scan.ads?.length || 0;
    const winnersCount = (scan.ads || []).filter(ad => ad.score >= 90).length;
    const isActive = state.currentScan && state.currentScan.id === scan.id;

    return `
      <div class="scan-item ${isActive ? 'active' : ''}" data-scan-id="${scan.id}">
        <div class="scan-item-header">
          <span class="scan-date">${dateStr}</span>
          <span class="scan-mode ${scan.mode}">${scan.mode === 'deep' ? '🎯 Approfondi' : '⚡ Rapide'}</span>
        </div>
        <div class="scan-stats">
          ${adsCount} annonces • ${winnersCount} winners • Score moyen: ${scan.stats?.averageScore?.toFixed(1) || 0}
        </div>
      </div>
    `;
  }).join('');

  elements.scanList.innerHTML = html;

  // Ajouter les écouteurs
  document.querySelectorAll('.scan-item').forEach(item => {
    item.addEventListener('click', () => selectScan(item.dataset.scanId));
  });
}

function selectScan(scanId) {
  state.currentScan = state.scans.find(scan => scan.id === scanId);

  if (state.currentScan) {
    state.filteredAds = state.currentScan.ads || [];
    renderScanList();
    applyFilters();
  }
}

function applyFilters() {
  if (!state.currentScan) return;

  // Récupérer les valeurs des filtres
  state.filters = {
    score: parseInt(elements.filterScore.value),
    duration: parseInt(elements.filterDuration.value),
    variants: parseInt(elements.filterVariants.value),
    category: elements.filterCategory.value,
    search: elements.filterSearch.value.toLowerCase().trim()
  };

  // Filtrer les annonces
  state.filteredAds = (state.currentScan.ads || []).filter(ad => {
    // Filtre score
    if (ad.score < state.filters.score) return false;

    // Filtre durée
    if ((ad.duration_days || 0) < state.filters.duration) return false;

    // Filtre variantes
    if ((ad.variants_count || 0) < state.filters.variants) return false;

    // Filtre catégorie
    if (state.filters.category !== 'all' && ad.category !== state.filters.category) return false;

    // Filtre recherche
    if (state.filters.search && !ad.advertiser.toLowerCase().includes(state.filters.search)) return false;

    return true;
  });

  renderResults();
}

function resetFilters() {
  elements.filterScore.value = 0;
  elements.filterScoreValue.textContent = '0';
  elements.filterDuration.value = 0;
  elements.filterVariants.value = 0;
  elements.filterCategory.value = 'all';
  elements.filterSearch.value = '';

  state.filters = {
    score: 0,
    duration: 0,
    variants: 0,
    category: 'all',
    search: ''
  };

  applyFilters();
}

function handleSort(sortKey) {
  if (state.sortBy === sortKey) {
    state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    state.sortBy = sortKey;
    state.sortOrder = 'desc';
  }

  // Trier les résultats
  state.filteredAds.sort((a, b) => {
    let valueA, valueB;

    switch (sortKey) {
      case 'score':
        valueA = a.score;
        valueB = b.score;
        break;
      case 'advertiser':
        valueA = a.advertiser.toLowerCase();
        valueB = b.advertiser.toLowerCase();
        break;
      case 'category':
        valueA = a.category || '';
        valueB = b.category || '';
        break;
      case 'duration':
        valueA = a.duration_days || 0;
        valueB = b.duration_days || 0;
        break;
      case 'variants':
        valueA = a.variants_count || 0;
        valueB = b.variants_count || 0;
        break;
      case 'platforms':
        valueA = (a.platforms || []).length;
        valueB = (b.platforms || []).length;
        break;
      default:
        return 0;
    }

    if (state.sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  renderResults();
}

function renderResults() {
  if (state.filteredAds.length === 0) {
    elements.resultsTbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px; color: #6B7280;">
          Aucun résultat ne correspond aux filtres
        </td>
      </tr>
    `;
    elements.resultsCount.textContent = '0 résultat';
    return;
  }

  const html = state.filteredAds.map(ad => {
    let scoreClass = 'low';
    let emoji = '❌';

    if (ad.score >= 90) {
      scoreClass = 'fire';
      emoji = '🔥';
    } else if (ad.score >= 75) {
      scoreClass = 'star';
      emoji = '⭐';
    } else if (ad.score >= 60) {
      scoreClass = 'ok';
      emoji = '⚠️';
    }

    const platforms = (ad.platforms || []).map(p =>
      `<span class="platform-badge">${p}</span>`
    ).join('');

    const mediaIcon = {
      video: '🎥',
      carousel: '🖼️',
      image: '📷',
      unknown: '❓'
    }[ad.media_type] || '❓';

    return `
      <tr>
        <td>
          <span class="score-badge ${scoreClass}">${emoji} ${ad.score}</span>
        </td>
        <td>${ad.advertiser}</td>
        <td>
          <span class="category-tag">${ad.category || 'Autre'}</span>
        </td>
        <td>${ad.duration_days || 0} jours</td>
        <td>${ad.variants_count || 1}</td>
        <td>
          <div class="platforms-list">${platforms}</div>
        </td>
        <td>
          <div class="media-type">${mediaIcon} ${ad.media_type || 'Inconnu'}</div>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-action" onclick="viewDetails('${ad.id}')">👁️ Détails</button>
            ${ad.url ? `<button class="btn-action" onclick="openFacebookAd('${ad.url}')">🔗 Voir</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  elements.resultsTbody.innerHTML = html;
  elements.resultsCount.textContent = `${state.filteredAds.length} résultat${state.filteredAds.length > 1 ? 's' : ''}`;
}

function viewDetails(adId) {
  const ad = state.filteredAds.find(a => a.id === adId);

  if (!ad) return;

  let scoreClass = 'low';
  let emoji = '❌';

  if (ad.score >= 90) {
    scoreClass = 'fire';
    emoji = '🔥';
  } else if (ad.score >= 75) {
    scoreClass = 'star';
    emoji = '⭐';
  } else if (ad.score >= 60) {
    scoreClass = 'ok';
    emoji = '⚠️';
  }

  const html = `
    <div class="detail-section">
      <h4>Informations générales</h4>
      <div class="detail-grid">
        <div class="detail-item">
          <div class="detail-label">Annonceur</div>
          <div class="detail-value">${ad.advertiser}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Score</div>
          <div class="detail-value">
            <span class="score-badge ${scoreClass}">${emoji} ${ad.score}/100</span>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Catégorie</div>
          <div class="detail-value">${ad.category || 'Autre'}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Mode de scan</div>
          <div class="detail-value">${ad.mode === 'deep' ? '🎯 Approfondi' : '⚡ Rapide'}</div>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h4>Détails de diffusion</h4>
      <div class="detail-grid">
        <div class="detail-item">
          <div class="detail-label">Durée</div>
          <div class="detail-value">${ad.duration_days || 0} jours</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Date de début</div>
          <div class="detail-value">${ad.startDate ? new Date(ad.startDate).toLocaleDateString('fr-FR') : 'Inconnue'}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Date de fin</div>
          <div class="detail-value">${ad.endDate ? new Date(ad.endDate).toLocaleDateString('fr-FR') : 'En cours'}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Statut</div>
          <div class="detail-value">${ad.status === 'active' ? '✅ Actif' : '❌ Inactif'}</div>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h4>Performance</h4>
      <div class="detail-grid">
        <div class="detail-item">
          <div class="detail-label">Nombre de variantes</div>
          <div class="detail-value">${ad.variants_count || 1}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Plateformes</div>
          <div class="detail-value">${(ad.platforms || ['Facebook']).join(', ')}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Type de média</div>
          <div class="detail-value">${ad.media_type || 'Inconnu'}</div>
        </div>
        ${ad.impressions ? `
        <div class="detail-item">
          <div class="detail-label">Impressions</div>
          <div class="detail-value">${ad.impressions}</div>
        </div>
        ` : ''}
      </div>
    </div>

    ${ad.score_breakdown ? `
    <div class="detail-section">
      <h4>Détail du score</h4>
      <div class="detail-grid">
        <div class="detail-item">
          <div class="detail-label">Durée (35 pts)</div>
          <div class="detail-value">${ad.score_breakdown.duration}/35</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Variantes (25 pts)</div>
          <div class="detail-value">${ad.score_breakdown.variants}/25</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Plateformes (20 pts)</div>
          <div class="detail-value">${ad.score_breakdown.platforms}/20</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Type média (10 pts)</div>
          <div class="detail-value">${ad.score_breakdown.mediaType}/10</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Marché DZ (10 pts)</div>
          <div class="detail-value">${ad.score_breakdown.algerianMarket}/10</div>
        </div>
      </div>
    </div>
    ` : ''}

    ${ad.ad_text ? `
    <div class="detail-section">
      <h4>Texte de l'annonce</h4>
      <p style="color: #1F2937; line-height: 1.6; white-space: pre-wrap;">${ad.ad_text}</p>
    </div>
    ` : ''}

    ${ad.algerianKeywords && ad.algerianKeywords.length > 0 ? `
    <div class="detail-section">
      <h4>Mots-clés algériens détectés</h4>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${ad.algerianKeywords.map(kw => `<span class="platform-badge">${kw.term} (+${kw.score})</span>`).join('')}
      </div>
    </div>
    ` : ''}

    ${ad.prices && ad.prices.length > 0 ? `
    <div class="detail-section">
      <h4>Prix détectés</h4>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${ad.prices.map(price => `<span class="score-badge ok">${price.toLocaleString()} DA</span>`).join('')}
      </div>
    </div>
    ` : ''}

    ${ad.url ? `
    <div class="detail-section">
      <a href="${ad.url}" target="_blank" class="btn-primary-small" style="display: inline-block; text-decoration: none;">
        🔗 Voir sur Facebook
      </a>
    </div>
    ` : ''}
  `;

  elements.modalBody.innerHTML = html;
  elements.detailsModal.classList.add('show');
}

function openFacebookAd(url) {
  window.open(url, '_blank');
}

function closeModal() {
  elements.detailsModal.classList.remove('show');
}

function exportData(format) {
  if (!state.currentScan || state.filteredAds.length === 0) {
    alert('Aucune donnée à exporter');
    return;
  }

  switch (format) {
    case 'csv':
      exportCSV();
      break;
    case 'excel':
      exportExcel();
      break;
    case 'pdf':
      exportPDF();
      break;
  }
}

function exportCSV() {
  const headers = ['Score', 'Annonceur', 'Catégorie', 'Durée (jours)', 'Variantes', 'Plateformes', 'Type média', 'Date début', 'Date fin'];

  const rows = state.filteredAds.map(ad => [
    ad.score,
    `"${ad.advertiser}"`,
    `"${ad.category || 'Autre'}"`,
    ad.duration_days || 0,
    ad.variants_count || 1,
    `"${(ad.platforms || []).join(', ')}"`,
    ad.media_type || 'Inconnu',
    ad.startDate ? new Date(ad.startDate).toLocaleDateString('fr-FR') : '',
    ad.endDate ? new Date(ad.endDate).toLocaleDateString('fr-FR') : ''
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadFile(csv, 'winner-finder-export.csv', 'text/csv');
}

function exportExcel() {
  // Version simplifiée - génère un CSV compatible Excel
  const headers = ['Score', 'Annonceur', 'Catégorie', 'Durée (jours)', 'Variantes', 'Plateformes', 'Type média'];

  const rows = state.filteredAds.map(ad => [
    ad.score,
    ad.advertiser,
    ad.category || 'Autre',
    ad.duration_days || 0,
    ad.variants_count || 1,
    (ad.platforms || []).join(', '),
    ad.media_type || 'Inconnu'
  ]);

  const csv = [
    headers.join('\t'),
    ...rows.map(row => row.join('\t'))
  ].join('\n');

  downloadFile(csv, 'winner-finder-export.xls', 'application/vnd.ms-excel');
}

function exportPDF() {
  alert('Export PDF : Fonctionnalité à venir. Utilisez CSV ou Excel pour l\'instant.');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function clearHistory() {
  if (!confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
    return;
  }

  try {
    await chrome.storage.local.set({ scans: [] });
    state.scans = [];
    state.currentScan = null;
    state.filteredAds = [];

    updateGlobalStats();
    renderScanList();
    renderResults();

    alert('Historique effacé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'effacement:', error);
    alert('Erreur lors de l\'effacement de l\'historique');
  }
}

// Rendre les fonctions globales pour les boutons onclick
window.viewDetails = viewDetails;
window.openFacebookAd = openFacebookAd;

console.log('Dashboard chargé ✓');
