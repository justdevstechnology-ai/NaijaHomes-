import { Store } from './storage.js';
import { $, $$, money, esc, formatLocation } from './helpers.js';
import { view, filters, sort, selected, editing } from './state.js';
import { getStateLabel } from './data/nigeria.js';

// ------------------------------
// Card HTML (uses new classes)
// ------------------------------
export function card(p) {
  const saved = Store.saved().includes(p.id);
  return `
    <article class="card">
      <div class="card-img">
        <img src="${esc(p.image)}" alt="${esc(p.title)}">
        <span class="tag">${p.purpose === 'rent' ? 'For Rent' : 'For Sale'}</span>
        <button class="heart ${saved ? 'saved' : ''}" data-save="${p.id}">♥</button>
      </div>
      <div class="card-body">
        <b class="price">${p.purpose === 'rent' ? money(p.price) + ' / year' : money(p.price)}</b>
        <h3>${esc(p.title)}</h3>
        <p class="muted">⌖ ${esc(formatLocation(p))}</p>
        <div class="facts">
          <span>🛏 ${p.beds} beds</span>
          <span>♨ ${p.baths} baths</span>
          <span>▧ ${esc(p.area || 'N/A')}</span>
        </div>
        <button class="btn btn-secondary full" data-detail="${p.id}">View details</button>
      </div>
    </article>
  `;
}

// ------------------------------
// Page renderers (now return only the grid/list content, not full pages)
// The static sections are already in the HTML, so we only update dynamic parts.
// ------------------------------
export function renderPropertyGrid(items) {
  const grid = $('#property-grid');
  const empty = $('#property-empty');
  const count = $('#results-count');
  if (!grid) return;

  if (items.length) {
    grid.innerHTML = items.map(card).join('');
    grid.classList.remove('hidden');
    empty?.classList.add('hidden');
  } else {
    grid.innerHTML = '';
    grid.classList.add('hidden');
    empty?.classList.remove('hidden');
  }
  if (count) count.textContent = items.length + ' properties';
}

// We'll also need functions to populate locations and dashboard lists.
// `states` is an array of state keys (e.g. "Lagos", "FCT") from the Nigeria
// states dataset — all 36 states + FCT are shown here so people can browse
// by any part of the country, not just a handful of major cities.
export function renderLocations(states) {
  const container = $('#location-grid');
  if (!container) return;
  container.innerHTML = states.map(state => `
    <button data-location="${state}">
      <strong>${esc(getStateLabel(state))}</strong>
      <small>Explore properties</small>
    </button>
  `).join('');
}

export function renderDashboard(data) {
  // Update stats
  const savedCount = $('#saved-count');
  const listingCount = $('#listing-count');
  const inquiryCount = $('#inquiry-count');
  const activeCount = $('#active-count');
  if (savedCount) savedCount.textContent = data.saved.length;
  if (listingCount) listingCount.textContent = data.properties.filter(p => p.ownerId === 'demo').length;
  if (inquiryCount) inquiryCount.textContent = data.inquiries.length;
  if (activeCount) activeCount.textContent = data.properties.filter(p => p.ownerId === 'demo' && p.purpose === 'rent').length; // example

  // Saved list
  const savedList = $('#saved-list');
  if (savedList) {
    const savedProps = data.properties.filter(p => data.saved.includes(p.id));
    savedList.innerHTML = savedProps.slice(0, 3).map(p => `
      <div class="mini-item">
        <img src="${esc(p.image)}">
        <div><strong>${esc(p.title)}</strong><small>${esc(formatLocation(p))}</small></div>
      </div>
    `).join('') || '<p class="muted">No saved properties</p>';
  }

  // My listings
  const myListings = $('#my-listings');
  if (myListings) {
    const mine = data.properties.filter(p => p.ownerId === 'demo');
    myListings.innerHTML = mine.slice(0, 3).map(p => `
      <div class="mini-item">
        <img src="${esc(p.image)}">
        <div><strong>${esc(p.title)}</strong><small>${esc(formatLocation(p))}</small></div>
        <button class="btn btn-small btn-secondary" data-edit="${p.id}">Edit</button>
      </div>
    `).join('') || '<p class="muted">No listings yet</p>';
  }
}
