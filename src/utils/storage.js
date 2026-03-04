// storage.js — sessionStorage read/write helpers (Phase 7)
// Uses sessionStorage so content auto-clears when the tab is closed,
// but persists across in-tab refreshes within the same session.

const KEY = "markrender_content";

/**
 * Save markdown content to sessionStorage.
 * @param {string} content
 */
export function saveContent(content) {
  try {
    sessionStorage.setItem(KEY, content);
  } catch {
    // Quota exceeded or private browsing — silently fail
  }
}

/**
 * Load previously saved markdown content from sessionStorage.
 * Returns null if nothing is stored.
 * @returns {string|null}
 */
export function loadContent() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/**
 * Clear saved content from sessionStorage.
 */
export function clearContent() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
