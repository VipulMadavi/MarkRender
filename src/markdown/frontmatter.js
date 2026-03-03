import yaml from "js-yaml";

/**
 * Parses YAML frontmatter from a markdown string.
 * @param {string} text - The raw markdown text.
 * @returns {object} { metadata, content }
 */
export function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    return { metadata: {}, content: text };
  }

  try {
    const metadata = yaml.load(match[1]) || {};
    const content = text.slice(match[0].length).trim();
    return { metadata, content };
  } catch (e) {
    console.error("YAML Frontmatter Error:", e);
    return { metadata: { error: "Invalid YAML" }, content: text };
  }
}
