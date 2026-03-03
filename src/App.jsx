import { useState, useRef, useCallback } from "react";
import { renderMarkdown } from "./markdown/parser";
import { getStats } from "./utils/wordCount";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import ErrorBoundary from "./components/ErrorBoundary";
import PrintSettings from "./components/PrintSettings";

const defaultMarkdown = `---
title: MarkRender Test
author: Student Dev
---

# Pipeline Verification

This is a **test** of the rendering pipeline.

## 1. Math
Inline: $E = mc^2$
Block:
$$
\\\\int_{0}^{\\\\infty} e^{-x^2} dx = \\\\frac{\\\\sqrt{\\\\pi}}{2}
$$

## 2. Code
\`\`\`javascript
function greet(name) {
  console.log("Hello, " + name + "!");
  return { status: "ok", timestamp: Date.now() };
}
\`\`\`

## 3. Table
| Feature | Status |
|---|---|
| Frontmatter | ✅ |
| Math | ✅ |
| Highlighting | ✅ |
| CodeMirror 6 | ✅ |
| Live Preview | ✅ |
| Error Boundary | ✅ |
| PDF Export | ✅ |

## 4. Lists
- Item one
- Item two
  - Nested item
- Item three

> **Note:** This is a blockquote with **bold** and *italic* text.

## 5. XSS Test
<script>alert('xss')</script>
`;

function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [showPrintSettings, setShowPrintSettings] = useState(false);
  const editorRef = useRef(null);

  const { html, metadata } = renderMarkdown(markdown);
  const stats = getStats(markdown);
  const isEmpty = markdown.trim().length === 0;

  const handleChange = useCallback((newContent) => {
    setMarkdown(newContent);
  }, []);

  const togglePrintSettings = useCallback(() => {
    setShowPrintSettings((prev) => !prev);
  }, []);

  const closePrintSettings = useCallback(() => {
    setShowPrintSettings(false);
  }, []);

  return (
    <div className="app">
      <div className="toolbar">
        <span className="toolbar-brand">{metadata.title || "MarkRender"}</span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button className="btn">Toggle View</button>
          <button className="btn">Focus</button>
          <div className="print-settings-wrapper">
            <button className="btn btn-export" onClick={togglePrintSettings}>
              📄 Export
            </button>
            <PrintSettings
              metadata={metadata}
              isOpen={showPrintSettings}
              onClose={closePrintSettings}
            />
          </div>
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
          <Editor
            ref={editorRef}
            value={defaultMarkdown}
            onChange={handleChange}
          />
        </div>

        <ErrorBoundary>
          <Preview html={html} isEmpty={isEmpty} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
