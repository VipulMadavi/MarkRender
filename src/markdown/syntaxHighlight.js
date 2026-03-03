import Prism from "prismjs";

// Import mandatory languages for MarkRender
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";

/**
 * Highlights a block of code using Prism.js.
 * @param {string} code - The code string.
 * @param {string} lang - The language name.
 * @returns {string} - Highlighted HTML.
 */
export function highlightCode(code, lang) {
  if (lang && Prism.languages[lang]) {
    try {
      return Prism.highlight(code, Prism.languages[lang], lang);
    } catch (err) {
      console.error("Prism highlighting error:", err);
      return code;
    }
  }
  return code; // Fallback to plain text
}
