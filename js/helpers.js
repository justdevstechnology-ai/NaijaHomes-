import { getStateLabel } from './data/nigeria.js';

// ================================
// DOM shortcuts
// ================================
export const $ = s => document.querySelector(s);
export const $$ = s => [...document.querySelectorAll(s)];

// ================================
// Currency formatter
// ================================
export const money = n => '₦' + Number(n).toLocaleString('en-NG');

// ================================
// HTML escaping
// ================================
export const esc = s => String(s ?? '')
  .replace(/[&<>"']/g, c =>
    ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c])
  );

// ================================
// Consistent "Area, LGA, State" formatting for a property
// ================================
export function formatLocation(p) {
  const area = String(p.location || '').split(',')[0].trim();
  const parts = [area];
  if (p.lga) parts.push(p.lga);
  if (p.state) parts.push(getStateLabel(p.state));
  return parts.filter(Boolean).join(', ');
}

// ================================
// Toast notification
// ================================
export function toast(msg) {
  const container = $('#toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.append(el);
  setTimeout(() => el.remove(), 2600);
}