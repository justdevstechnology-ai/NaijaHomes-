// ================================
// Minimal hash router
// ================================
// Routes are matched in registration order. A route pattern uses ":param"
// segments, e.g. "/property/:id". The special route "*" is the fallback.
//
// This does not replace the existing showSection()-based navigation for the
// three original sections (home/properties/dashboard) — it is only used for
// the new full pages (property detail, post property, saved, my listings)
// so each of those gets its own shareable/back-button-friendly URL.

const routes = [];
let fallback = null;

function compile(pattern) {
  const paramNames = [];
  const regexStr = pattern
    .split('/')
    .map(seg => {
      if (seg.startsWith(':')) {
        paramNames.push(seg.slice(1));
        return '([^/]+)';
      }
      return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return { regex: new RegExp(`^${regexStr}$`), paramNames };
}

export function registerRoute(pattern, handler) {
  if (pattern === '*') {
    fallback = handler;
    return;
  }
  const { regex, paramNames } = compile(pattern);
  routes.push({ regex, paramNames, handler });
}

function currentPath() {
  // location.hash looks like "#/property/12" -> "/property/12"
  const hash = location.hash || '';
  const path = hash.startsWith('#') ? hash.slice(1) : hash;
  return path || '';
}

export function resolve() {
  const path = currentPath();
  if (!path) return false; // not a router-owned hash (e.g. "#properties")
  for (const route of routes) {
    const match = path.match(route.regex);
    if (match) {
      const params = {};
      route.paramNames.forEach((name, i) => { params[name] = decodeURIComponent(match[i + 1]); });
      route.handler(params);
      return true;
    }
  }
  if (fallback) {
    fallback();
    return true;
  }
  return false;
}

export function navigate(path) {
  location.hash = path;
}

export function back() {
  history.back();
}

export function initRouter() {
  window.addEventListener('hashchange', resolve);
}
