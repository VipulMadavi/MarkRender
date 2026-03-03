// Preview.jsx — Live Markdown preview panel (Phase 5 + Phase 8 scroll sync)
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

/**
 * Preview component — renders parsed HTML in a styled panel.
 *
 * @prop {string} html — rendered HTML from the markdown pipeline
 * @prop {boolean} isEmpty — whether the source markdown is empty
 * @ref  exposes { getElement() } for scroll sync
 */
const Preview = forwardRef(function Preview({ html, isEmpty }, ref) {
  const containerRef = useRef(null);
  const prevScrollRef = useRef(0);
  const isUserScrollingRef = useRef(false);

  // Expose the DOM element for scroll sync
  useImperativeHandle(
    ref,
    () => ({
      getElement() {
        return containerRef.current;
      },
    }),
    [],
  );

  // Preserve scroll position across re-renders triggered by typing,
  // but reset to top when content is cleared or loaded fresh.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isEmpty) {
      // Content was cleared — reset scroll
      el.scrollTop = 0;
      prevScrollRef.current = 0;
    } else {
      // Restore previous position after re-render
      if (!isUserScrollingRef.current) {
        el.scrollTop = prevScrollRef.current;
      }
    }
  }, [html, isEmpty]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (el) {
      prevScrollRef.current = el.scrollTop;
    }
  };

  if (isEmpty) {
    return (
      <div className="preview-panel" ref={containerRef}>
        <div className="preview-empty">
          Start writing Markdown to see a live preview…
        </div>
      </div>
    );
  }

  return (
    <div className="preview-panel" ref={containerRef} onScroll={handleScroll}>
      <div
        className="preview-page"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
});

export default Preview;
