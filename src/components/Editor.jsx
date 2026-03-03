// Editor.jsx — CodeMirror 6 editor component (Phase 4)
import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  EditorView,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  dropCursor,
  keymap,
} from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  bracketMatching,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
import "../styles/editor.css";

/**
 * Calm Night theme — custom CodeMirror theme built from CSS variables.
 * We keep it minimal here; the heavy styling lives in editor.css.
 */
const calmNightTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "transparent",
      height: "100%",
    },
    ".cm-scroller": {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "14px",
      lineHeight: "1.6",
    },
    ".cm-gutters": {
      backgroundColor: "transparent",
      borderRight: "1px solid rgba(255,255,255,0.06)",
    },
  },
  { dark: true },
);

/**
 * CodeMirror 6 Markdown Editor component.
 *
 * @prop {string}   value    — initial markdown text
 * @prop {function} onChange — called with new text on every doc change
 * @ref  exposes { setValue(text), focus() }
 */
const Editor = forwardRef(function Editor({ value = "", onChange }, ref) {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  // Track latest onChange to avoid stale closure issues
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // ── Bootstrap CodeMirror once on mount ──
  useEffect(() => {
    if (!containerRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && onChangeRef.current) {
        onChangeRef.current(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        // ── Core editing ──
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        drawSelection(),
        dropCursor(),
        indentOnInput(),
        bracketMatching(),
        history(),

        // ── Keybindings ──
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),

        // ── Markdown language ──
        markdown(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),

        // ── Theme / styling ──
        calmNightTheme,
        EditorView.lineWrapping,

        // ── Change listener ──
        updateListener,
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount-only

  // ── Expose imperative API for parent components ──
  useImperativeHandle(
    ref,
    () => ({
      /**
       * Replace the entire editor content programmatically
       * (e.g. when loading a file or inserting frontmatter).
       */
      setValue(text) {
        const view = viewRef.current;
        if (!view) return;
        view.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: text,
          },
        });
      },

      /** Focus the editor */
      focus() {
        viewRef.current?.focus();
      },

      /** Get the current EditorView instance (for scroll sync, etc.) */
      getView() {
        return viewRef.current;
      },
    }),
    [],
  );

  return (
    <div
      ref={containerRef}
      className="editor-codemirror-container"
      style={{ height: "100%", overflow: "hidden" }}
    />
  );
});

export default Editor;
