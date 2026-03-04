// Toolbar.jsx — App toolbar with view toggle, focus mode, export, word count (Phase 7 + Phase 8)
import { memo } from "react";
import PrintSettings from "./PrintSettings";

/**
 * Main application toolbar.
 *
 * Layout:
 *   [MarkRender / title]  |  [Toggle ▸] [Focus] [Export ▼]  |  stats  Autosaved ✓
 *
 * @prop {string}   title             — document title from YAML frontmatter
 * @prop {object}   metadata          — full parsed frontmatter metadata
 * @prop {object}   stats             — { words, readingTime, pages }
 * @prop {string}   viewMode          — 'split' | 'editor' | 'preview'
 * @prop {function} onToggleView      — cycles view mode
 * @prop {boolean}  showPrintSettings — whether export panel is open
 * @prop {function} onToggleExport    — opens/closes export panel
 * @prop {function} onCloseExport     — closes export panel
 * @prop {Date|null} lastSaved        — timestamp of last autosave
 * @prop {boolean}  focusMode         — whether focus/zen mode is active
 * @prop {function} onToggleFocusMode — toggles focus/zen mode
 * @prop {function} onNewDocument     — resets editor to default content
 */
function Toolbar({
  title,
  metadata,
  stats,
  viewMode,
  onToggleView,
  showPrintSettings,
  onToggleExport,
  onCloseExport,
  lastSaved,
  focusMode,
  onToggleFocusMode,
  onNewDocument,
}) {
  // Human-readable view mode label for the toggle button
  const viewLabels = {
    split: "Split",
    editor: "Editor",
    preview: "Preview",
  };

  return (
    <div className="toolbar" role="banner">
      {/* ── Brand / Title ── */}
      <span className="toolbar-brand" title="MarkRender — Markdown to PDF">
        {title ? title : "MarkRender"}
      </span>

      {/* ── Centre controls ── */}
      <div className="toolbar-controls">
        {/* ── New Document button ── */}
        <button
          id="btn-new-doc"
          className="btn btn-ghost"
          onClick={onNewDocument}
          title="New document"
          aria-label="Start a new document"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 1h5l4 4v8H3V1z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M8 1v4h4"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 8h2M7 7v2"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <span className="btn-label">New</span>
        </button>

        <button
          id="btn-toggle-view"
          className="btn btn-ghost"
          onClick={onToggleView}
          title="Toggle view (Ctrl+Shift+V)"
          aria-label={`Current view: ${viewLabels[viewMode]}. Click to switch.`}
        >
          {viewMode === "split" && (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="1"
                  y="1"
                  width="5"
                  height="12"
                  rx="1"
                  fill="currentColor"
                  opacity="0.6"
                />
                <rect
                  x="8"
                  y="1"
                  width="5"
                  height="12"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
              <span className="btn-label">Split</span>
            </>
          )}
          {viewMode === "editor" && (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="1"
                  y="1"
                  width="12"
                  height="12"
                  rx="1"
                  fill="currentColor"
                  opacity="0.6"
                />
              </svg>
              <span className="btn-label">Editor</span>
            </>
          )}
          {viewMode === "preview" && (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="1"
                  y="1"
                  width="12"
                  height="12"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
              <span className="btn-label">Preview</span>
            </>
          )}
        </button>

        {/* ── Focus / Zen mode button ── */}
        <button
          id="btn-focus-mode"
          className={`btn btn-ghost${focusMode ? " btn-focus-active" : ""}`}
          onClick={onToggleFocusMode}
          title="Focus mode (F11)"
          aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
          aria-pressed={focusMode}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            {focusMode ? (
              /* contract icon */
              <>
                <path
                  d="M5 1v3H1M9 1v3h4M5 13v-3H1M9 13v-3h4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              /* expand icon */
              <>
                <path
                  d="M1 5V1h4M13 5V1H9M1 9v4h4M13 9v4H9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
          </svg>
          <span className="btn-label">{focusMode ? "Exit" : "Focus"}</span>
        </button>

        {/* ── Export button + dropdown ── */}
        <div className="print-settings-wrapper">
          <button
            id="btn-export"
            className="btn btn-export"
            onClick={onToggleExport}
            title="Export to PDF (Ctrl+Shift+E)"
            aria-expanded={showPrintSettings}
            aria-haspopup="true"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 1v8M7 9l-3-3M7 9l3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 11h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="btn-label">Export</span>
          </button>

          <PrintSettings
            metadata={metadata}
            isOpen={showPrintSettings}
            onClose={onCloseExport}
          />
        </div>
      </div>

      {/* ── Stats + Autosave ── */}
      <div className="toolbar-meta">
        <span className="word-count" aria-live="polite">
          {stats.words.toLocaleString()} words · {stats.readingTime} min · ~
          {stats.pages} {stats.pages === 1 ? "page" : "pages"}
        </span>
        <span
          className={`autosave-indicator ${lastSaved ? "autosave-visible" : ""}`}
          aria-live="polite"
          title={
            lastSaved
              ? `Last saved at ${lastSaved.toLocaleTimeString()}`
              : "Not yet saved"
          }
        >
          {lastSaved ? "✓ Autosaved" : "●"}
        </span>
      </div>
    </div>
  );
}

export default memo(Toolbar);
