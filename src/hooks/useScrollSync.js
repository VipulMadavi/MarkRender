// useScrollSync.js — Editor ↔ Preview proportional scroll sync (Phase 8)
import { useEffect, useRef, useCallback } from "react";

const SYNC_DEBOUNCE_MS = 50;

/**
 * Synchronises scroll position between the CodeMirror editor and the preview
 * panel using a proportional ratio approach.
 *
 * - Tracks which panel the user is actively scrolling.
 * - Applies the same scrollTop/scrollHeight ratio to the other panel.
 * - Debounced at 50 ms to avoid feedback loops.
 *
 * @param {React.RefObject} editorRef  — ref to the Editor component (exposes getView())
 * @param {HTMLElement|null} previewEl — the .preview-panel DOM element
 * @param {boolean} enabled           — whether sync is active (disabled in single-pane modes)
 */
export function useScrollSync(editorRef, previewEl, enabled) {
  const scrollingSourceRef = useRef(null); // 'editor' | 'preview' | null
  const timerRef = useRef(null);

  // Clear the "who is scrolling" lock after debounce period
  const clearLock = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      scrollingSourceRef.current = null;
    }, SYNC_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const editorView = editorRef.current?.getView?.();
    if (!editorView || !previewEl) return;

    const editorScroller = editorView.scrollDOM;
    if (!editorScroller) return;

    // ── Editor → Preview ──
    function onEditorScroll() {
      if (scrollingSourceRef.current === "preview") return;
      scrollingSourceRef.current = "editor";

      const maxScroll =
        editorScroller.scrollHeight - editorScroller.clientHeight;
      if (maxScroll <= 0) return;

      const ratio = editorScroller.scrollTop / maxScroll;
      const previewMax = previewEl.scrollHeight - previewEl.clientHeight;
      previewEl.scrollTop = ratio * previewMax;

      clearLock();
    }

    // ── Preview → Editor ──
    function onPreviewScroll() {
      if (scrollingSourceRef.current === "editor") return;
      scrollingSourceRef.current = "preview";

      const maxScroll = previewEl.scrollHeight - previewEl.clientHeight;
      if (maxScroll <= 0) return;

      const ratio = previewEl.scrollTop / maxScroll;
      const editorMax =
        editorScroller.scrollHeight - editorScroller.clientHeight;
      editorScroller.scrollTop = ratio * editorMax;

      clearLock();
    }

    editorScroller.addEventListener("scroll", onEditorScroll, {
      passive: true,
    });
    previewEl.addEventListener("scroll", onPreviewScroll, { passive: true });

    return () => {
      editorScroller.removeEventListener("scroll", onEditorScroll);
      previewEl.removeEventListener("scroll", onPreviewScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [editorRef, previewEl, enabled, clearLock]);
}
