# MarkRender — Design Decisions Log

> Record every significant decision, why it was made, and what was considered.

---

## D-001: Web SPA over Electron
**Date**: 2026-03-03
**Decision**: Build as React SPA, not Electron desktop app
**Rationale**: Simpler deployment (Vercel/Netlify), no native deps, browser-native PDF via `window.print()`, future PWA support
**Trade-off**: Lose native file dialogs and auto-save to disk. Mitigated by localStorage autosave.

## D-002: `window.print()` over external PDF lib
**Date**: 2026-03-03
**Decision**: Use browser print engine instead of jsPDF/Puppeteer/etc.
**Rationale**: Zero dependency, same Chromium engine renders preview and PDF, maximum fidelity guarantee
**Trade-off**: User sees browser print dialog (can't skip it). Custom page size limited to `@page` CSS.

## D-003: CodeMirror 6 over plain textarea
**Date**: 2026-03-03
**Decision**: Upgrade editor from `<textarea>` to CodeMirror 6
**Rationale**: Syntax highlighting, line numbers, better UX. The design doc demands "premium" feel — textarea is too basic.
**Trade-off**: Adds ~1 hour to Phase 4 and increases bundle size. Worth it for editor UX.

## D-004: Prism.js for MVP, Shiki for future
**Date**: 2026-03-03
**Decision**: Use Prism.js for code syntax highlighting in v0.1
**Rationale**: Lighter weight, simpler sync API. Shiki requires async init and is heavier.
**Trade-off**: Lower quality highlighting than Shiki. Upgrade path is clean — just swap the fence renderer.

## D-005: YAML frontmatter in MVP
**Date**: 2026-03-03
**Decision**: Support `---` YAML blocks in Markdown, strip before rendering, parse metadata
**Rationale**: Standard in Obsidian/Hugo/Jekyll workflows. Title can be used as PDF filename hint.
**Trade-off**: Adds `js-yaml` dependency (~30 min effort). Very small cost.

## D-006: KaTeX over MathJax
**Date**: 2026-03-03
**Decision**: KaTeX for math rendering
**Rationale**: Faster, lighter, fully client-side. MathJax is more complete but heavier.
**Trade-off**: Some advanced LaTeX constructs may not render. Acceptable for study notes.

## D-007: Mermaid deferred to v0.2
**Date**: 2026-03-03
**Decision**: Do not include Mermaid.js diagrams in MVP
**Rationale**: Large library (~600KB), async rendering, PDF timing issues. Too risky for 7-8 hour build.
**Trade-off**: No diagram support in v0.1. Architecture supports clean addition later.

---

> **Update this file**: When a new significant decision is made, add a new entry with date, decision, rationale, and trade-offs.
