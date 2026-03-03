// PrintSettings.jsx — Page size, margins, PDF title config (Phase 6)
import { useState, useEffect, useRef } from "react";

/**
 * Page size presets — CSS @page size values.
 */
const PAGE_SIZES = [
  { label: "A4", value: "A4" },
  { label: "Letter", value: "Letter" },
  { label: "A3", value: "A3" },
];

/**
 * Margin presets — CSS margin values for @page.
 */
const MARGINS = [
  { label: "Normal", value: "2cm 2.5cm" },
  { label: "Narrow", value: "1cm 1.5cm" },
  { label: "Wide", value: "3cm 3.5cm" },
];

/**
 * PrintSettings — dropdown panel for PDF export configuration.
 *
 * @prop {object} metadata — frontmatter metadata (auto-fills title)
 * @prop {boolean} isOpen — whether the panel is visible
 * @prop {function} onClose — callback to close the panel
 */
function PrintSettings({ metadata, isOpen, onClose }) {
  const [pageSize, setPageSize] = useState("A4");
  const [margins, setMargins] = useState("2cm 2.5cm");
  const [title, setTitle] = useState("");
  const panelRef = useRef(null);

  // Auto-fill title from YAML frontmatter when metadata changes
  useEffect(() => {
    if (metadata?.title) {
      setTitle(metadata.title);
    }
  }, [metadata?.title]);

  // Close panel on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    // Delay listener to avoid catching the click that opened the panel
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleExport = () => {
    // 1. Set document.title for PDF filename hint
    const originalTitle = document.title;
    document.title = title || "MarkRender";

    // 2. Inject dynamic @page CSS
    const existingStyle = document.getElementById("dynamic-print");
    if (existingStyle) existingStyle.remove();

    const style = document.createElement("style");
    style.id = "dynamic-print";
    style.textContent = `@page { size: ${pageSize}; margin: ${margins}; }`;
    document.head.appendChild(style);

    // 3. Print (opens browser print dialog)
    window.print();

    // 4. Cleanup — restore original title and remove injected style
    document.title = originalTitle;
    const cleanup = document.getElementById("dynamic-print");
    if (cleanup) cleanup.remove();

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="print-settings" ref={panelRef}>
      <div className="print-settings-header">
        <span className="print-settings-title">Export to PDF</span>
        <button
          className="print-settings-close"
          onClick={onClose}
          aria-label="Close print settings"
        >
          ✕
        </button>
      </div>

      <div className="print-settings-body">
        {/* Page Size */}
        <div className="print-settings-field">
          <label htmlFor="ps-page-size">Page Size</label>
          <select
            id="ps-page-size"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          >
            {PAGE_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Margins */}
        <div className="print-settings-field">
          <label htmlFor="ps-margins">Margins</label>
          <select
            id="ps-margins"
            value={margins}
            onChange={(e) => setMargins(e.target.value)}
          >
            {MARGINS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* PDF Title */}
        <div className="print-settings-field">
          <label htmlFor="ps-title">PDF Title</label>
          <input
            id="ps-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="MarkRender"
          />
        </div>
      </div>

      <div className="print-settings-footer">
        <button className="btn btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-export" onClick={handleExport}>
          📄 Export PDF
        </button>
      </div>
    </div>
  );
}

export default PrintSettings;
