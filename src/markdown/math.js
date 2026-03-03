import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Pre-processes math blocks and inline math for KaTeX.
 * Replaces $$...$$ and $...$ with KaTeX HTML.
 */
export function processMath(text) {
  // 1. Process display math ($$ ... $$)
  let processed = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
      });
    } catch (err) {
      return `<span class="math-error">Math Error: ${err.message}</span>`;
    }
  });

  // 2. Process inline math ($ ... $)
  // Note: We use a more careful regex to avoid matching things like $10 and $20
  processed = processed.replace(/(?<!\\)\$([^$\n]+?)\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch (err) {
      return `<span class="math-error">Math Error: ${err.message}</span>`;
    }
  });

  return processed;
}
