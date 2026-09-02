import { Store } from '../storage.js';
import { $, esc, money } from '../helpers.js';
import { showPage } from './page-shell.js';

function row(p) {
  return `
    <div class="listing-row">
      <img src="${esc(p.image)}" alt="${esc(p.title)}">
      <div class="listing-row-info">
        <strong>${esc(p.title)}</strong>
        <small class="muted">⌖ ${esc(p.location)}</small>
        <small class="listing-row-price">${p.purpose === 'rent' ? money(p.price) + ' / year' : money(p.price)}</small>
      </div>
      <div class="listing-row-actions">
        <button class="btn btn-small btn-secondary" data-edit="${p.id}">Edit</button>
        <button class="btn btn-small btn-danger" data-delete="${p.id}">Delete</button>
      </div>
    </div>
  `;
}

export function renderMyListingsPage() {
  const data = Store.get();
  const mine = data.properties.filter(p => p.ownerId === 'demo');
  const list = $('#my-listings-page-list');
  const empty = $('#my-listings-page-empty');
  const count = $('#my-listings-page-count');

  if (count) count.textContent = mine.length + (mine.length === 1 ? ' listing' : ' listings');

  if (list) {
    if (mine.length) {
      list.innerHTML = mine.map(row).join('');
      list.classList.remove('hidden');
      empty?.classList.add('hidden');
    } else {
      list.innerHTML = '';
      list.classList.add('hidden');
      empty?.classList.remove('hidden');
    }
  }

  showPage('page-my-listings');
}
