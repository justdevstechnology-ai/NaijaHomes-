// ================================
// App-icon splash screen
// ================================
// Shows once per browser tab session (not on every reload within the same
// tab navigation, so it doesn't get annoying if the page is refreshed a lot
// during a single visit — but it will show again in a brand new tab).
const SEEN_KEY = 'naijahomes_splash_seen';

export function initSplash() {
  const splash = document.getElementById('app-splash');
  if (!splash) return;

  if (sessionStorage.getItem(SEEN_KEY)) {
    splash.remove();
    return;
  }

  const dismiss = () => {
    splash.classList.add('splash-hide');
    sessionStorage.setItem(SEEN_KEY, 'true');
    setTimeout(() => splash.remove(), 400);
  };

  // Auto-dismiss shortly after load, or immediately on tap/click
  const timer = setTimeout(dismiss, 1300);
  splash.addEventListener('click', () => {
    clearTimeout(timer);
    dismiss();
  });
}
