// App.jsx — Full app layout with view modes, autosave, shortcuts (Phase 7)
import { useState, useRef, useCallback, useEffect } from "react";
import { renderMarkdown } from "./markdown/parser";
import { getStats } from "./utils/wordCount";
import { loadContent } from "./utils/storage";
import { useAutosave } from "./hooks/useAutosave";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import ErrorBoundary from "./components/ErrorBoundary";
import Toolbar from "./components/Toolbar";

// ── Default content (shown when nothing is in localStorage) ──
const DEFAULT_MARKDOWN = `---
title: Welcome to MarkRender
author: You
---

# Welcome to MarkRender ✨

Write Markdown on the left, see a live preview on the right.
Export to PDF with the **Export** button — or press \`Ctrl+Shift+E\`.

## Features

| Feature | Shortcut |
|---------|----------|
| Save | \`Ctrl+S\` |
| Export PDF | \`Ctrl+Shift+E\` |
| Toggle View | \`Ctrl+Shift+V\` |
| Focus Editor | \`Ctrl+/\` |

## Math

Inline: $E = mc^2$

Block:
$$
\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

## Code

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> Autosave kicks in **2 seconds** after you stop typing. Your work is safe. 🔒
`;

// ── View mode cycle ──
const VIEW_CYCLE = ["split", "editor", "preview"];

function App() {
  // ── Restore from localStorage or use default ──
  const [markdown, setMarkdown] = useState(() => {
    return loadContent() ?? DEFAULT_MARKDOWN;
  });

  // ── View mode: 'split' | 'editor' | 'preview' ──
  const [viewMode, setViewMode] = useState("split");

  // ── Export panel ──
  const [showPrintSettings, setShowPrintSettings] = useState(false);

  const editorRef = useRef(null);

  // ── Derived state ──
  const { html, metadata } = renderMarkdown(markdown);
  const stats = getStats(markdown);
  const isEmpty = markdown.trim().length === 0;

  // ── Autosave hook ──
  const { lastSaved, triggerSave } = useAutosave(markdown);

  // ── Editor change handler ──
  const handleChange = useCallback((newContent) => {
    setMarkdown(newContent);
  }, []);

  // ── View mode toggle (cycles: split → editor → preview → split) ──
  const handleToggleView = useCallback(() => {
    setViewMode((prev) => {
      const idx = VIEW_CYCLE.indexOf(prev);
      return VIEW_CYCLE[(idx + 1) % VIEW_CYCLE.length];
    });
  }, []);

  // ── Export panel handlers ──
  const handleToggleExport = useCallback(() => {
    setShowPrintSettings((prev) => !prev);
  }, []);

  const handleCloseExport = useCallback(() => {
    setShowPrintSettings(false);
  }, []);

  // ── Focus editor handler ──
  const handleFocusEditor = useCallback(() => {
    editorRef.current?.focus();
    // If not visible in current view mode, switch to split/editor
    if (viewMode === "preview") {
      setViewMode("split");
    }
  }, [viewMode]);

  // ── Close all modals (Escape) ──
  const handleCloseModals = useCallback(() => {
    setShowPrintSettings(false);
  }, []);

  // ── Keyboard shortcuts ──
  useKeyboardShortcuts({
    triggerSave,
    openExport: handleToggleExport,
    toggleView: handleToggleView,
    focusEditor: handleFocusEditor,
    closeModals: handleCloseModals,
  });

  // ── Update document title from frontmatter ──
  useEffect(() => {
    document.title = metadata.title
      ? `${metadata.title} — MarkRender`
      : "MarkRender";
  }, [metadata.title]);

  // ── Compute CSS classes for the main content area ──
  const mainClass = `main-content view-${viewMode}`;

  return (
    <div className="app">
      <Toolbar
        title={metadata.title || null}
        metadata={metadata}
        stats={stats}
        viewMode={viewMode}
        onToggleView={handleToggleView}
        showPrintSettings={showPrintSettings}
        onToggleExport={handleToggleExport}
        onCloseExport={handleCloseExport}
        lastSaved={lastSaved}
      />

      <div className={mainClass}>
        {/* ── Editor panel ── */}
        <div className="editor-panel" aria-label="Markdown editor">
          <Editor ref={editorRef} value={markdown} onChange={handleChange} />
        </div>

        {/* ── Preview panel ── */}
        <ErrorBoundary>
          <Preview html={html} isEmpty={isEmpty} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
