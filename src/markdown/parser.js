import MarkdownIt from "markdown-it";
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

/**
 * Standard MarkRender Pipeline:
 * 1. Parse Frontmatter
 * 2. Pre-process Math (KaTeX)
 * 3. Render Markdown (markdown-it)
 * 4. Post-process (optional)
 *
 * @param {string} rawMarkdown - The raw text from the editor.
 * @returns {object} { html, metadata }
 */
export function renderMarkdown(rawMarkdown) {
  if (!rawMarkdown) return { html: "", metadata: {} };

  // 1. Strip and parse YAML frontmatter
  const { metadata, content } = parseFrontmatter(rawMarkdown);

  // 2. Pre-process Math (KaTeX)
  // We do this before md.render to prevent markdown-it from escaping KaTeX symbols
  // But we need to be careful with markdown interference.
  const mathProcessed = processMath(content);

  // 3. Parse Markdown
  const html = md.render(mathProcessed);

  return { html, metadata };
}
