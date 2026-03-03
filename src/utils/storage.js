// storage.js — localStorage read/write helpers (Phase 7)

const KEY = "markrender_content";

/**
 * Save markdown content to localStorage.
 * @param {string} content
 */
export function saveContent(content) {
  try {
    localStorage.setItem(KEY, content);
  } catch {
    // Quota exceeded or private browsing — silently fail
  }
}

/**
 * Load previously saved markdown content from localStorage.
 * Returns null if nothing is stored.
 * @returns {string|null}
 */
export function loadContent() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/**
 * Clear saved content from localStorage.
 */
export function clearContent() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
