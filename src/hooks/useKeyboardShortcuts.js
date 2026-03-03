// useKeyboardShortcuts.js — Global keyboard shortcut handler (Phase 7 + Phase 8)
import { useEffect } from "react";

/**
 * Registers global keyboard shortcuts for the app.
 *
 * Shortcuts:
 *   Ctrl+S            → triggerSave()
 *   Ctrl+Shift+E      → openExport()
 *   Ctrl+Shift+V      → toggleView()
 *   Ctrl+/            → focusEditor()
 *   F11               → toggleFocusMode()
 *   Escape            → closeModals() (also exits focus mode)
 *
 * @param {{ triggerSave, openExport, toggleView, focusEditor, closeModals, toggleFocusMode }} handlers
 */
export function useKeyboardShortcuts({
  triggerSave,
  openExport,
  toggleView,
  focusEditor,
  closeModals,
  toggleFocusMode,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+S — save
      if (ctrl && !e.shiftKey && e.key === "s") {
        e.preventDefault();
        triggerSave?.();
        return;
      }

      // Ctrl+Shift+E — export / print settings
      if (ctrl && e.shiftKey && e.key === "E") {
        e.preventDefault();
        openExport?.();
        return;
      }

      // Ctrl+Shift+V — toggle view mode
      if (ctrl && e.shiftKey && e.key === "V") {
        e.preventDefault();
        toggleView?.();
        return;
      }

      // Ctrl+/ — focus editor
      if (ctrl && !e.shiftKey && e.key === "/") {
        e.preventDefault();
        focusEditor?.();
        return;
      }

      // F11 — toggle focus / zen mode
      if (e.key === "F11") {
        e.preventDefault();
        toggleFocusMode?.();
        return;
      }

      // Escape — close modals (+ exit focus mode via closeModals)
      if (e.key === "Escape") {
        closeModals?.();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    triggerSave,
    openExport,
    toggleView,
    focusEditor,
    closeModals,
    toggleFocusMode,
  ]);
}
