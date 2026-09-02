import { Store } from './storage.js';

// ================================
// Application state
// ================================
export let view = 'home';
export let filters = {
  q: '',
  purpose: 'all',
  type: 'all',
  state: 'all',
  lga: 'all',
  min: '',
  max: ''
};
export let sort = 'recommended';
export let selected = null;
export let editing = null;

// ================================
// State mutators (for reactivity)
// ================================
export function setView(newView) {
  view = newView;
}

export function setSelected(prop) {
  selected = prop;
}

export function setEditing(prop) {
  editing = prop;
}

export function setFilters(newFilters) {
  Object.assign(filters, newFilters);
}

export function resetFilters() {
  filters = { q: '', purpose: 'all', type: 'all', state: 'all', lga: 'all', min: '', max: '' };
}

export function setSort(newSort) {
  sort = newSort;
}
