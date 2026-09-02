import { Store } from './storage.js';
import { $, $$, toast } from './helpers.js';
import { filters, sort, setView, setSelected, resetFilters, setSort } from './state.js';
import { renderPropertyGrid, renderLocations, renderDashboard } from './renderers.js';
import { getStates, getLGAs, getStateLabel } from './data/nigeria.js';
import { registerRoute, resolve, navigate } from './router.js';
import { hideAllPages } from './pages/page-shell.js';
import { renderPropertyDetailPage, syncPropertyDetailSaveButton } from './pages/property-detail.js';
import { renderPostPropertyPage, submitPostPropertyForm, initPostPropertyForm } from './pages/post-property.js';
import { renderSavedPage } from './pages/saved-properties.js';
import { renderMyListingsPage } from './pages/my-listings.js';
import { initSidebar, setActiveSidebarLink } from './sidebar.js';
import { initSplash } from './splash.js';

// ================================
// DOM element references
// ================================
const sections = {
  home: $('#home'),
  properties: $('#properties'),
  dashboard: $('#dashboard'),
  howItWorks: $('#how-it-works')
};

const modals = {
  inquiry: $('#inquiry-modal'),
  confirm: $('#confirm-modal')
};

// Fallback hash to return to when a full page is opened directly (deep
// link) and there's no real browser history to go back to.
const BACK_FALLBACK = {
  properties: '#properties',
  dashboard: '#dashboard',
  home: '#home',
  'my-listings': '#/my-listings',
  saved: '#/saved'
};

// ================================
// Helpers: show/hide sections
// ================================
function showSection(id) {
  Object.entries(sections).forEach(([key, el]) => {
    if (el) el.style.display = (key === id) ? 'block' : 'none';
  });
  const isHome = id === 'home';
  const locationsSection = $('#locations');
  const ctaSection = $('#cta-section');
  if (locationsSection) locationsSection.style.display = isHome ? 'block' : 'none';
  if (ctaSection) ctaSection.style.display = isHome ? 'block' : 'none';
}

// ================================
// Navigation (section-based: home / properties / dashboard)
// ================================
function navigateTo(view) {
  hideAllPages();
  setView(view);
  setSelected(null);
  const map = { home: 'home', properties: 'properties', dashboard: 'dashboard' };
  const sectionKey = map[view] || 'home';
  showSection(sectionKey);
  refreshData();
  setActiveSidebarLink(view);
  const scrollTarget = sections[sectionKey];
  scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ================================
// Data refresh
// ================================
function refreshData() {
  const all = Store.properties();
  let filtered = all.filter(p =>
    (filters.purpose === 'all' || p.purpose === filters.purpose) &&
    (filters.type === 'all' || p.type === filters.type) &&
    (filters.state === 'all' || p.state === filters.state) &&
    (filters.lga === 'all' || p.lga === filters.lga) &&
    (!filters.min || p.price >= +filters.min) &&
    (!filters.max || p.price <= +filters.max) &&
    (!filters.q || `${p.title} ${p.location} ${p.state} ${p.lga || ''}`.toLowerCase().includes(filters.q.toLowerCase()))
  );

  if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);

  renderPropertyGrid(filtered);

  const heroCount = $('#hero-property-count');
  if (heroCount) heroCount.textContent = all.length;

  renderDashboard(Store.get());

  const purposeSelect = $('#filter-purpose');
  const typeSelect = $('#filter-type');
  const stateSelect = $('#filter-state');
  const sortSelect = $('#filter-sort');
  const searchInput = $('#property-search');
  if (purposeSelect) purposeSelect.value = filters.purpose;
  if (typeSelect) typeSelect.value = filters.type;
  if (stateSelect) stateSelect.value = filters.state;
  if (sortSelect) sortSelect.value = sort;
  if (searchInput) searchInput.value = filters.q;
}

// ================================
// Modal helpers (inquiry + confirm only — everything else is a full page)
// ================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// ================================
// State -> LGA cascading select helper (used by both the hero search and
// the property filter bar)
// ================================
function fillStateSelect(select, allLabel) {
  if (!select || select.dataset.filled) return;
  select.innerHTML = `<option value="all">${allLabel}</option>` +
    getStates().map(s => `<option value="${s}">${getStateLabel(s)}</option>`).join('');
  select.dataset.filled = 'true';
}

function fillLgaSelect(select, state, allLabel) {
  if (!select) return;
  const isAll = !state || state === 'all';
  select.disabled = isAll;
  select.innerHTML = isAll
    ? `<option value="all">${allLabel}</option>`
    : `<option value="all">${allLabel}</option>` + getLGAs(state).map(l => `<option value="${l}">${l}</option>`).join('');
}

function wireStateLgaPair(stateSelect, lgaSelect, allLgaLabel, onChange) {
  if (!stateSelect || !lgaSelect) return;
  lgaSelect.addEventListener('change', () => onChange && onChange());
  stateSelect.addEventListener('change', () => {
    fillLgaSelect(lgaSelect, stateSelect.value, allLgaLabel);
    onChange && onChange();
  });
}

// ================================
// Back-navigation for full pages
// ================================
function goBackFrom(fallbackKey) {
  hideAllPages();
  if (history.length > 1) {
    history.back();
  } else {
    navigate(BACK_FALLBACK[fallbackKey] || '#home');
  }
}

// ================================
// Router wiring for full-page views
// ================================
function setupRoutes() {
  registerRoute('/property/:id', ({ id }) => {
    renderPropertyDetailPage(id);
    setActiveSidebarLink('properties');
  });
  registerRoute('/post-property', () => {
    renderPostPropertyPage(null);
    setActiveSidebarLink('my-listings');
  });
  registerRoute('/post-property/:id', ({ id }) => {
    const prop = Store.properties().find(p => p.id === id);
    renderPostPropertyPage(prop || null);
    setActiveSidebarLink('my-listings');
  });
  registerRoute('/saved', () => {
    renderSavedPage();
    setActiveSidebarLink('saved');
  });
  registerRoute('/my-listings', () => {
    renderMyListingsPage();
    setActiveSidebarLink('my-listings');
  });

  window.addEventListener('hashchange', () => {
    const handled = resolve();
    if (handled) return;
    // Not a router path — treat it as a plain section hash (or nothing)
    hideAllPages();
    const raw = (location.hash || '').replace('#', '');
    if (raw === 'how-it-works') {
      showSection('howItWorks');
      $('#how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSidebarLink('how-it-works');
    } else if (['home', 'properties', 'dashboard'].includes(raw)) {
      navigateTo(raw);
    }
  });
}

// ================================
// Initial render
// ================================
function init() {
  // Popular locations: every state + FCT, not just a handful of cities
  renderLocations(getStates());

  // Filter bar: State -> LGA cascade
  const filterState = $('#filter-state');
  const filterLga = $('#filter-lga');
  fillStateSelect(filterState, 'All locations');
  fillLgaSelect(filterLga, 'all', 'All LGAs');
  wireStateLgaPair(filterState, filterLga, 'All LGAs', () => {
    filters.state = filterState.value;
    filters.lga = filterLga.value;
    refreshData();
  });

  // Hero search: State -> LGA cascade
  const heroState = $('#hero-state');
  const heroLga = $('#hero-lga');
  fillStateSelect(heroState, 'Any state');
  fillLgaSelect(heroLga, 'all', 'Any LGA');
  wireStateLgaPair(heroState, heroLga, 'Any LGA', () => {});

  // Prime the post-property page's own State -> LGA selects
  initPostPropertyForm();

  showSection('home');
  refreshData();
  setActiveSidebarLink('home');
  setupRoutes();

  // If the page was opened on a direct link to a full page (e.g. a
  // bookmark to #/property/3), render it immediately.
  resolve();

  initSidebar();
  initSplash();

  // Sidebar quick actions that aren't plain nav links
  $('#sidebar-post-btn')?.addEventListener('click', () => navigate('/post-property'));
}

// ================================
// Event Listeners
// ================================
document.addEventListener('click', e => {

  // --- Navigation links (plain section hashes) ---
  const link = e.target.closest('a[href^="#"]:not([href^="#/"])');
  if (link) {
    const href = link.getAttribute('href');
    const targetId = href.replace('#', '');
    if (targetId === 'home') { navigateTo('home'); return; }
    if (targetId === 'properties') { navigateTo('properties'); return; }
    if (targetId === 'dashboard') { navigateTo('dashboard'); return; }
    if (targetId === 'how-it-works') {
      hideAllPages();
      showSection('howItWorks');
      setActiveSidebarLink('how-it-works');
      return;
    }
    return;
  }

  // --- Full-page back buttons ---
  const backBtn = e.target.closest('[data-page-back]');
  if (backBtn) {
    goBackFrom(backBtn.dataset.pageBack);
    return;
  }

  // --- Save / unsave ---
  const saveBtn = e.target.closest('[data-save]');
  if (saveBtn) {
    const id = saveBtn.dataset.save;
    Store.toggleSaved(id);
    toast(Store.saved().includes(id) ? 'Property saved' : 'Removed from saved');
    refreshData();
    syncPropertyDetailSaveButton(id);
    if (document.getElementById('page-saved')?.classList.contains('page-active')) renderSavedPage();
    return;
  }

  // --- View detail (full page) ---
  const detailBtn = e.target.closest('[data-detail]');
  if (detailBtn) {
    navigate(`/property/${detailBtn.dataset.detail}`);
    return;
  }

  // --- Clear filters ---
  const clearBtn = e.target.closest('[data-clear]');
  if (clearBtn) {
    resetFilters();
    const filterLga = $('#filter-lga');
    fillLgaSelect(filterLga, 'all', 'All LGAs');
    refreshData();
    return;
  }

  // --- Location grid (homepage "Search by state") ---
  const locBtn = e.target.closest('[data-location]');
  if (locBtn) {
    filters.state = locBtn.dataset.location;
    filters.lga = 'all';
    navigateTo('properties');
    const stateSelect = $('#filter-state');
    const lgaSelect = $('#filter-lga');
    if (stateSelect) stateSelect.value = filters.state;
    fillLgaSelect(lgaSelect, filters.state, 'All LGAs');
    return;
  }

  // --- Edit / Delete (My listings page + dashboard mini list) ---
  const editBtn = e.target.closest('[data-edit]');
  if (editBtn) {
    navigate(`/post-property/${editBtn.dataset.edit}`);
    return;
  }

  const delBtn = e.target.closest('[data-delete]');
  if (delBtn) {
    const id = delBtn.dataset.delete;
    if (modals.confirm) {
      $('#confirm-message').textContent = 'Delete this property permanently?';
      $('#confirm-ok').dataset.deleteId = id;
      openModal('confirm-modal');
    }
    return;
  }

  // --- Inquiry ---
  const inqBtn = e.target.closest('[data-inquiry]');
  if (inqBtn) {
    const prop = Store.properties().find(p => p.id === inqBtn.dataset.inquiry);
    if (prop) {
      $('#inquiry-property-id').value = prop.id;
      $('#inquiry-property-name').textContent = prop.title;
      openModal('inquiry-modal');
    }
    return;
  }

  // --- Close modal (data-close-modal) ---
  const closeBtn = e.target.closest('[data-close-modal]');
  if (closeBtn) {
    closeModal(closeBtn.dataset.closeModal);
    return;
  }

  // --- Close modal by clicking backdrop ---
  const backdrop = e.target.closest('.modal-backdrop');
  if (backdrop && !e.target.closest('.modal')) {
    closeModal(backdrop.id);
    return;
  }

  // --- Confirm modal actions ---
  if (e.target.id === 'confirm-cancel') {
    closeModal('confirm-modal');
    return;
  }
  if (e.target.id === 'confirm-ok') {
    const id = e.target.dataset.deleteId;
    if (id) {
      Store.deleteProperty(id);
      toast('Listing deleted');
      closeModal('confirm-modal');
      refreshData();
      if (document.getElementById('page-my-listings')?.classList.contains('page-active')) renderMyListingsPage();
      if (document.getElementById('page-saved')?.classList.contains('page-active')) renderSavedPage();
    }
    return;
  }

  // --- "Post / List a property" buttons (now a full page, not a modal) ---
  const listBtns = ['open-listing-btn', 'dashboard-list-btn', 'cta-list-btn', 'footer-list-btn', 'my-listings-page-post-btn', 'my-listings-post-btn'];
  if (listBtns.includes(e.target.id)) {
    navigate('/post-property');
    return;
  }

  // --- "View all saved" / "My listings" (now full pages) ---
  if (e.target.id === 'view-saved-btn' || e.target.id === 'footer-saved-btn') {
    navigate('/saved');
    return;
  }
  if (e.target.id === 'view-listings-btn') {
    navigate('/my-listings');
    return;
  }

  // --- Browse properties from the empty-saved state ---
  if (e.target.id === 'saved-page-browse-btn') {
    hideAllPages();
    navigateTo('properties');
    return;
  }

  if (e.target.id === 'show-all-btn') {
    navigateTo('properties');
    return;
  }
});

// ================================
// Filter change events
// ================================
document.addEventListener('change', e => {
  const target = e.target;
  if (target.id === 'filter-purpose') {
    filters.purpose = target.value;
    refreshData();
  } else if (target.id === 'filter-type') {
    filters.type = target.value;
    refreshData();
  } else if (target.id === 'filter-sort') {
    setSort(target.value);
    refreshData();
  } else if (target.id === 'property-search') {
    filters.q = target.value;
    refreshData();
  }
});

// ================================
// Form submissions
// ================================
document.addEventListener('submit', e => {
  // Hero search
  if (e.target.id === 'hero-search-form') {
    e.preventDefault();
    const purpose = $('#hero-purpose').value;
    const type = $('#hero-type').value;
    const state = $('#hero-state').value;
    const lga = $('#hero-lga').value;
    filters.purpose = purpose;
    filters.type = type;
    filters.state = state;
    filters.lga = lga;
    filters.q = '';
    const purposeSelect = $('#filter-purpose');
    const typeSelect = $('#filter-type');
    const stateSelect = $('#filter-state');
    const lgaSelect = $('#filter-lga');
    if (purposeSelect) purposeSelect.value = purpose;
    if (typeSelect) typeSelect.value = type;
    if (stateSelect) stateSelect.value = state;
    fillLgaSelect(lgaSelect, state, 'All LGAs');
    if (lgaSelect) lgaSelect.value = lga;
    navigateTo('properties');
    return;
  }

  // Post property form (full page)
  if (e.target.id === 'post-property-form') {
    e.preventDefault();
    const saved = submitPostPropertyForm();
    if (saved) navigate('/my-listings');
    return;
  }

  // Inquiry form
  if (e.target.id === 'inquiry-form') {
    e.preventDefault();
    const data = {
      propertyId: $('#inquiry-property-id').value,
      name: $('#inquiry-name').value,
      phone: $('#inquiry-phone').value,
      message: $('#inquiry-message').value,
      id: Date.now()
    };
    Store.addInquiry(data);
    toast('Inquiry sent');
    closeModal('inquiry-modal');
    refreshData();
    return;
  }
});

// ================================
// Start
// ================================
init();
