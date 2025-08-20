// src/auth/token.js
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "jwtToken";
let logoutTimer;

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  scheduleLogoutFromToken(token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  if (logoutTimer) window.clearTimeout(logoutTimer);
}

export function isExpired(token, skewMs = 5000) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded?.exp) return true;
    const expiresAt = decoded.exp * 1000;
    return Date.now() >= (expiresAt - skewMs);
  } catch {
    return true;
  }
}

export function scheduleLogoutFromToken(token) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded?.exp) return;
    const msUntilExpiry = decoded.exp * 1000 - Date.now() - 2000; // 2s early
    if (msUntilExpiry > 0) {
      if (logoutTimer) window.clearTimeout(logoutTimer);
      logoutTimer = window.setTimeout(() => {
        triggerLogout("Session expired. Please sign in again.");
      }, msUntilExpiry);
    }
  } catch {
    /* ignore */
  }
}

// Fires a global event; a listener will redirect to /login with a banner
export function triggerLogout(reason) {
  clearToken();
  window.dispatchEvent(new CustomEvent("app:logout", { detail: { reason } }));
}
