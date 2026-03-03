# MarkRender — Changelog

> Track every planning, execution, and decision change across conversations.

---

## 2026-03-03 — Planning Session

### Conversation 1: Initial Planning

**What happened:**
1. Read all docs (`prd.md`, `techstack.md`, `folderstruc.md`)
2. Created first phase plan (9 phases, 7-8 hours) — originally for Electron desktop app
3. User updated all docs → project changed to **React SPA** (web-first, no Electron)
4. Rewrote phase plan from scratch for web architecture (`window.print()` for PDF)
5. Added `design.md` (Calm Night Productivity theme) — new design system doc
6. Ran full analysis of all docs → produced `analysis_report.md`
7. Evaluated 13 feature proposals from user
8. Added new ✅ INCLUDE features to MVP scope:
   - CodeMirror 6 (replaces textarea)
   - Word count + reading time + page estimate
   - Autosave to localStorage
   - Keyboard shortcuts
   - YAML frontmatter support
   - Scroll sync
   - Error boundary
   - Print settings (page size, title)
   - Focus / Zen mode (stretch)
   - PWA offline (stretch)
9. Created `.tracker/` directory for cross-conversation context
10. Updated all 4 docs + phase plan with new features
11. Added `dev-journal.md` for student-style developer journaling.
12. Updated `Phase Plan.md` ground rules to mandate journal updates.

**Key Decisions:**
- Web-first SPA, not Electron
- `window.print()` for PDF — no external lib
- CodeMirror 6 upgrade accepted into MVP
- YAML frontmatter included in MVP
- Mermaid diagrams deferred to v0.2
- Version history deferred to v1.0

## 2026-03-03 — Phase 1: Project Scaffolding

### Conversation 2: Phase 1 Execution

**What happened:**
1. Vite + React project scaffolded via `npx create-vite@latest ./ -- --template react`
2. All dependencies installed (markdown-it, KaTeX, Prism.js, js-yaml, CodeMirror 6, ESLint, Prettier)
3. Cleaned Vite boilerplate (removed `App.css`, `src/assets/`, cleared `index.css`)
4. Set `base: './'` in `vite.config.js`
5. Created full folder structure with 22 placeholder files across 5 directories:
   - `src/components/` — Editor, Preview, Toolbar, ErrorBoundary, PrintSettings
   - `src/markdown/` — parser, math, syntaxHighlight, frontmatter
   - `src/hooks/` — useAutosave, useKeyboardShortcuts, useScrollSync
   - `src/styles/` — base, editor, preview, print
   - `src/utils/` — debounce, wordCount, storage
6. Verified: `npm run dev` works, page loads, all deps present, no boilerplate remaining
7. Git commit: `b391b6b`

**Key Decisions:**
- None new — followed Phase Plan exactly

**Issues Found:**
- None

---

> **Update this file**: At the end of every conversation, append a new dated section with what was done, key decisions, and any issues found.
