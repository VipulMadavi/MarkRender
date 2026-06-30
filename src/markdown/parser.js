import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import { parseFrontmatter } from "./frontmatter";
import { processMath } from "./math";
import { highlightCode } from "./syntaxHighlight";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    const highlighted = highlightCode(str, lang);
    return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
  },
});

// Configure DOMPurify to allow safe HTML elements used by markdown-it, KaTeX, and Prism
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  // Allow KaTeX's custom elements
  if (data.tagName === "annotation") {
    data.allowedTags["annotation"] = true;
  }
});

/**
 * Standard MarkRender Pipeline:
 * 1. Parse Frontmatter
 * 2. Pre-process Math (KaTeX)
 * 3. Render Markdown (markdown-it)
 * 4. Sanitize HTML (DOMPurify)
 *
 * @param {string} rawMarkdown - The raw text from the editor.
 * @returns {object} { html, metadata }
 */
export function renderMarkdown(rawMarkdown) {
  if (!rawMarkdown) return { html: "", metadata: {} };

  // 1. Strip and parse YAML frontmatter
  const { metadata, content } = parseFrontmatter(rawMarkdown);

  // 2. Pre-process Math (KaTeX)
  const mathProcessed = processMath(content);

  // 3. Parse Markdown
  const rawHtml = md.render(mathProcessed);

  // 4. Sanitize output to prevent XSS
  const html = DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ["annotation", "semantics", "math", "mrow", "mi", "mo", "mn", "msup", "msub", "mfrac", "mover", "munder", "mtable", "mtr", "mtd", "mtext", "mspace"],
    ADD_ATTR: ["encoding", "xmlns", "aria-hidden", "focusable", "role", "tabindex", "class"],
    ALLOW_DATA_ATTR: false,
  });

  return { html, metadata };
}
