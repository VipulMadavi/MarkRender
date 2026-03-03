// Toolbar.jsx — App toolbar with view toggle, export, word count (Phase 7)
import { memo } from "react";
import PrintSettings from "./PrintSettings";

/**
 * Main application toolbar.
 *
 * Layout:
 *   [MarkRender / title]  |  [Toggle ▸] [Export ▼]  |  stats  Autosaved ✓
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
}) {
  // Human-readable view mode label for the toggle button
  const viewLabels = {
    split: "Split",
    editor: "Editor",
    preview: "Preview",
  };

  // Format the autosave timestamp
  const savedLabel = lastSaved
    ? `Autosaved ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "Not saved yet";

  return (
    <div className="toolbar" role="banner">
      {/* ── Brand / Title ── */}
      <span className="toolbar-brand" title="MarkRender — Markdown to PDF">
        {title ? title : "MarkRender"}
      </span>

      {/* ── Centre controls ── */}
      <div className="toolbar-controls">
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
              Split
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
              Editor
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
              Preview
            </>
          )}
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
            Export
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
