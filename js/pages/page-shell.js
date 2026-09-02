// ================================
// Full-page view shell
// ================================
// The app has two layers of content:
//   1. The original in-page sections (home / properties / dashboard)
//   2. Full-page views (property detail, post property, saved, my listings)
//      that used to be modals — these now behave like real app screens:
//      they cover the whole content area, have their own header with a
//      back button, and get their own URL via the router.
//
// Only one full page is ever visible at a time, and opening one hides the
// section content behind it (it reappears once the page is closed).

const PAGE_IDS = ['page-property-detail', 'page-post-property', 'page-saved', 'page-my-listings'];

export function hideAllPages() {
  PAGE_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('page-active');
  });
  document.body.classList.remove('page-open');
}

export function showPage(id) {
  hideAllPages();
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('page-active');
  document.body.classList.add('page-open');
  el.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

export function isPageOpen() {
  return document.body.classList.contains('page-open');
}

export function closeActivePageToHash(hash) {
  hideAllPages();
  location.hash = hash;
}
