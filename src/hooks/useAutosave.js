// useAutosave.js — Debounced sessionStorage autosave hook (Phase 7)
import { useEffect, useRef, useState, useCallback } from "react";
import { debounce } from "../utils/debounce";
import { saveContent } from "../utils/storage";

const AUTOSAVE_DELAY_MS = 2000; // 2 second debounce

/**
 * Autosaves content to sessionStorage after 2s of inactivity.
 * Warns the user before leaving the page if there are unsaved changes.
 *
 * @param {string} content — the markdown string to persist
 * @returns {{ lastSaved: Date|null, triggerSave: () => void }}
 *   - lastSaved: timestamp of last successful save (null before first save)
 *   - triggerSave: imperative handle to force an immediate save (e.g. Ctrl+S)
 */
export function useAutosave(content) {
  const [lastSaved, setLastSaved] = useState(null);

  // Track whether the editor has unsaved changes
  const dirtyRef = useRef(false);

  // Keep content in a ref so the debounced function always has the latest value
  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
    dirtyRef.current = true; // content changed, mark dirty
  }, [content]);

  // Persist the debounced function in a ref so it's created once
  const debouncedSaveRef = useRef(null);

  // Initialize the debounced save in an effect (avoids ref access during render)
  useEffect(() => {
    debouncedSaveRef.current = debounce(() => {
      saveContent(contentRef.current);
      dirtyRef.current = false;
      setLastSaved(new Date());
    }, AUTOSAVE_DELAY_MS);
  }, []);

  // Trigger the debounced save whenever content changes
  useEffect(() => {
    debouncedSaveRef.current?.();
  }, [content]);

  // Expose an immediate save for Ctrl+S
  const triggerSave = useCallback(() => {
    saveContent(contentRef.current);
    dirtyRef.current = false;
    setLastSaved(new Date());
  }, []);

  // ── Warn before leaving if there are unsaved changes ──
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!dirtyRef.current) return;

      // Last-ditch save attempt
      saveContent(contentRef.current);

      // Trigger the browser's "Leave site?" confirmation dialog
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return { lastSaved, triggerSave };
}
