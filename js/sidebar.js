import { $, $$ } from './helpers.js';

// ================================
// Sidebar (persistent on desktop, full-page off-canvas on mobile)
// ================================
export function initSidebar() {
  const sidebar = $('#app-sidebar');
  const menuBtn = $('#menu-toggle-btn');
  const closeBtn = $('#sidebar-close-btn');
  const backdrop = $('#sidebar-backdrop');

  function openSidebar() {
    sidebar?.classList.add('sidebar-open');
    menuBtn?.setAttribute('aria-expanded', 'true');
    backdrop?.classList.add('active');
    document.body.classList.add('nav-locked');
  }

  function closeSidebar() {
    sidebar?.classList.remove('sidebar-open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    backdrop?.classList.remove('active');
    document.body.classList.remove('nav-locked');
  }

  menuBtn?.addEventListener('click', () => {
    sidebar?.classList.contains('sidebar-open') ? closeSidebar() : openSidebar();
  });
  closeBtn?.addEventListener('click', closeSidebar);
  backdrop?.addEventListener('click', closeSidebar);

  // Close the sidebar automatically whenever a link/button inside it is used
  sidebar?.addEventListener('click', e => {
    if (e.target.closest('a, button')) closeSidebar();
  });

  return { closeSidebar, openSidebar };
}

// Highlight the sidebar link matching the current view so people always
// know where they are in the app.
export function setActiveSidebarLink(view) {
  $$('#app-sidebar [data-nav-view]').forEach(el => {
    el.classList.toggle('active', el.dataset.navView === view);
  });
}
