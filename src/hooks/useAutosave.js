// useAutosave.js — Debounced localStorage autosave hook (Phase 7)
import { useEffect, useRef, useState, useCallback } from "react";
import { debounce } from "../utils/debounce";
import { saveContent } from "../utils/storage";

const AUTOSAVE_DELAY_MS = 2000; // 2 second debounce

/**
 * Autosaves `content` to localStorage after 2s of inactivity.
 *
 * @param {string} content — the markdown string to persist
 * @returns {{ lastSaved: Date|null, triggerSave: () => void }}
 *   - lastSaved: timestamp of last successful save (null before first save)
 *   - triggerSave: imperative handle to force an immediate save (e.g. Ctrl+S)
 */
export function useAutosave(content) {
  const [lastSaved, setLastSaved] = useState(null);

  // Keep content in a ref so the debounced function always has the latest value
  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Build the debounced save function once
  const debouncedSave = useRef(
    debounce(() => {
      saveContent(contentRef.current);
      setLastSaved(new Date());
    }, AUTOSAVE_DELAY_MS),
  ).current;

  // Trigger the debounced save whenever content changes
  useEffect(() => {
    debouncedSave();
  }, [content, debouncedSave]);

  // Expose an immediate save for Ctrl+S
  const triggerSave = useCallback(() => {
    saveContent(contentRef.current);
    setLastSaved(new Date());
  }, []);

  return { lastSaved, triggerSave };
}
