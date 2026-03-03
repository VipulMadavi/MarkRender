export function getStats(text) {
  if (!text) {
    return {
      words: 0,
      characters: 0,
      readingTime: 0,
      pages: 0,
    };
  }

  const cleanText = text.trim();
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;

  return {
    words,
    characters: text.length,
    readingTime: Math.max(1, Math.ceil(words / 200)), // ~200 wpm
    pages: Math.max(1, Math.ceil(words / 300)), // ~300 words per A4 page
  };
}
