import { Store } from '../storage.js';
import { $, money, esc, toast } from '../helpers.js';
import { getStateLabel } from '../data/nigeria.js';
import { showPage } from './page-shell.js';

function heartLabel(saved) {
  return saved ? '♥ Saved' : '♡ Save property';
}

export function renderPropertyDetailPage(id) {
  const prop = Store.properties().find(p => p.id === id);
  const container = $('#property-detail-page-content');
  const titleEl = $('#property-detail-page-title');
  if (!container) return;

  if (!prop) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⌂</div>
        <h3>Property not found</h3>
        <p>It may have been removed.</p>
        <button class="btn btn-secondary" data-page-back>Go back</button>
      </div>
    `;
    if (titleEl) titleEl.textContent = 'Property details';
    showPage('page-property-detail');
    return;
  }

  if (titleEl) titleEl.textContent = prop.title;
  const saved = Store.saved().includes(prop.id);
  const locationLine = prop.lga ? `${prop.location}, ${prop.lga}, ${getStateLabel(prop.state)}` : `${prop.location}, ${getStateLabel(prop.state)}`;

  container.innerHTML = `
    <div class="detail-hero">
      <img src="${esc(prop.image)}" alt="${esc(prop.title)}">
      <span class="tag">${prop.purpose === 'rent' ? 'For Rent' : 'For Sale'}</span>
    </div>

    <div class="detail-body">
      <span class="eyebrow">${esc(prop.type)}</span>
      <h2>${esc(prop.title)}</h2>
      <p class="muted">⌖ ${esc(locationLine)}</p>
      <b class="bigprice">${prop.purpose === 'rent' ? money(prop.price) + ' / year' : money(prop.price)}</b>

      <div class="detailfacts">
        <span>🛏 ${prop.beds} bedrooms</span>
        <span>♨ ${prop.baths} bathrooms</span>
        <span>▧ ${esc(prop.area || 'N/A')}</span>
      </div>

      <h3>About this property</h3>
      <p>${esc(prop.description)}</p>

      <h3>Amenities</h3>
      <div class="amenities">
        ${(prop.amenities || []).map(x => `<span>✓ ${esc(x)}</span>`).join('') || '<span class="muted">No amenities listed</span>'}
      </div>

      <div class="detail-actions">
        <button class="btn btn-primary" data-inquiry="${prop.id}">Send inquiry</button>
        <button class="btn btn-secondary" data-save="${prop.id}" data-detail-save-btn>${heartLabel(saved)}</button>
      </div>
    </div>
  `;

  showPage('page-property-detail');
}

// Keep the full page's save button in sync whenever a save/unsave happens
// anywhere else in the app (grid card, dashboard mini-list, etc.)
export function syncPropertyDetailSaveButton(id) {
  const btn = document.querySelector('#property-detail-page-content [data-detail-save-btn]');
  if (btn && btn.dataset.save === id) {
    btn.textContent = heartLabel(Store.saved().includes(id));
  }
}
