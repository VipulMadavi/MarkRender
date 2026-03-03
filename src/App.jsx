// App.jsx — Full app layout with scroll sync, focus mode (Phase 7 + Phase 8)
import { useState, useRef, useCallback, useEffect } from "react";
import { renderMarkdown } from "./markdown/parser";
import { getStats } from "./utils/wordCount";
import { loadContent } from "./utils/storage";
import { useAutosave } from "./hooks/useAutosave";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useScrollSync } from "./hooks/useScrollSync";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import ErrorBoundary from "./components/ErrorBoundary";
import Toolbar from "./components/Toolbar";

import DEFAULT_MARKDOWN from "./content/default.md?raw";

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

  // ── Focus / Zen mode ──
  const [focusMode, setFocusMode] = useState(false);
  const [showFocusHint, setShowFocusHint] = useState(false);

  const editorRef = useRef(null);
  const previewRef = useRef(null);

  // ── Derived state ──
  const { html, metadata } = renderMarkdown(markdown);
  const stats = getStats(markdown);
  const isEmpty = markdown.trim().length === 0;

  // ── Autosave hook ──
  const { lastSaved, triggerSave } = useAutosave(markdown);

  // ── Scroll sync — only active in split view and not in focus mode ──
  const [previewEl, setPreviewEl] = useState(null);

  useEffect(() => {
    // Get the DOM element once preview mounts
    const el = previewRef.current?.getElement?.();
    setPreviewEl(el || null);
  });

  useScrollSync(editorRef, previewEl, viewMode === "split" && !focusMode);

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

  // ── Focus / Zen mode toggle ──
  const handleToggleFocusMode = useCallback(() => {
    setFocusMode((prev) => {
      const entering = !prev;
      if (entering) {
        // Show the "Press ESC to exit" hint then fade it after 3s
        setShowFocusHint(true);
        setTimeout(() => setShowFocusHint(false), 3000);
      }
      return entering;
    });
  }, []);

  // ── Close all modals (Escape) — also exits focus mode ──
  const handleCloseModals = useCallback(() => {
    setShowPrintSettings(false);
    setFocusMode(false);
    setShowFocusHint(false);
  }, []);

  // ── Keyboard shortcuts ──
  useKeyboardShortcuts({
    triggerSave,
    openExport: handleToggleExport,
    toggleView: handleToggleView,
    focusEditor: handleFocusEditor,
    closeModals: handleCloseModals,
    toggleFocusMode: handleToggleFocusMode,
  });

  // ── Update document title from frontmatter ──
  useEffect(() => {
    document.title = metadata.title
      ? `${metadata.title} — MarkRender`
      : "MarkRender";
  }, [metadata.title]);

  // ── Compute CSS classes ──
  const mainClass = `main-content view-${viewMode}`;
  const appClass = `app${focusMode ? " focus-mode" : ""}`;

  return (
    <div className={appClass}>
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
        focusMode={focusMode}
        onToggleFocusMode={handleToggleFocusMode}
      />

      <div className={mainClass}>
        {/* ── Editor panel ── */}
        <div className="editor-panel" aria-label="Markdown editor">
          <Editor ref={editorRef} value={markdown} onChange={handleChange} />
        </div>

        {/* ── Preview panel ── */}
        <ErrorBoundary>
          <Preview ref={previewRef} html={html} isEmpty={isEmpty} />
        </ErrorBoundary>
      </div>

      {/* ── Focus mode hint ── */}
      {focusMode && (
        <div
          className={`focus-hint${showFocusHint ? " focus-hint-visible" : ""}`}
          aria-live="polite"
        >
          Press <kbd>ESC</kbd> to exit focus mode
        </div>
      )}
    </div>
  );
}

export default App;
