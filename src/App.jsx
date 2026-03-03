import { useEffect } from "react";
import { renderMarkdown } from "./markdown/parser";
import { getStats } from "./utils/wordCount";

const testMarkdown = `---
title: MarkRender Test
author: Student Dev
---

# Pipeline Verification

This is a **test** of the rendering pipeline.

## 1. Math
Inline: $E = mc^2$
Block:
$$
\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

## 2. Code
\`\`\`javascript
function test() {
  console.log("Pipeline working!");
}
\`\`\`

## 3. Table
| Feature | Status |
|---|---|
| Frontmatter | OK |
| Math | OK |
| Highlighting | OK |
`;

function App() {
  const { html, metadata } = renderMarkdown(testMarkdown);
  const stats = getStats(testMarkdown);

  useEffect(() => {
    console.log("--- Pipeline Test Results ---");
    console.log("Metadata:", metadata);
    console.log("Stats:", stats);
    console.log("Generated HTML length:", html.length);
  }, [html, metadata, stats]);

  return (
    <div className="app">
      <div className="toolbar">
        <span className="toolbar-brand">{metadata.title || "MarkRender"}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn">Toggle View</button>
          <button className="btn">Focus</button>
          <button className="btn">Export PDF</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span className="word-count">
            {stats.words} words · {stats.readingTime} min · ~{stats.pages} pages
          </span>
          <span className="autosave-indicator">Autosaved ✓</span>
        </div>
      </div>

      <div className="main-content">
        <div className="editor-panel">
          <pre style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
            {testMarkdown}
          </pre>
        </div>

        <div className="preview-panel">
          <div
            className="preview-page"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
