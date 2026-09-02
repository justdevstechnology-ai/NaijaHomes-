import { Store } from '../storage.js';
import { $ } from '../helpers.js';
import { card } from '../renderers.js';
import { showPage } from './page-shell.js';

export function renderSavedPage() {
  const data = Store.get();
  const savedProps = data.properties.filter(p => data.saved.includes(p.id));
  const grid = $('#saved-page-grid');
  const empty = $('#saved-page-empty');
  const count = $('#saved-page-count');

  if (count) count.textContent = savedProps.length + (savedProps.length === 1 ? ' saved property' : ' saved properties');

  if (grid) {
    if (savedProps.length) {
      grid.innerHTML = savedProps.map(card).join('');
      grid.classList.remove('hidden');
      empty?.classList.add('hidden');
    } else {
      grid.innerHTML = '';
      grid.classList.add('hidden');
      empty?.classList.remove('hidden');
    }
  }

  showPage('page-saved');
}
