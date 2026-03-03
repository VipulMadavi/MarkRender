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

## 2026-03-03 — Phase 2: Design System & Global Styles

### Conversation 3: Phase 2 Execution

**What happened:**

1. Implemented full CSS system across 4 files:
   - `base.css`: Design tokens, night-sky gradient, Inter font, global reset, scrollbars.
   - `editor.css`: CodeMirror 6 theme (dark purple, selection, cursor, token colors).
   - `preview.css`: A4 page simulation, typography (headings, blockquotes, tables), Prism colors.
   - `print.css`: White bg, black text, hidden UI components for PDF export.
2. Centralized imports in `index.css`.
3. Updated `App.jsx` with a demo layout to verify styles (toolbar, side-by-side panels).
4. Verified via browser subagent: used JS execution to check computed styles as screenshots weren't rendering gradients well.
5. Git commit: `f2f23fa`

**Key Decisions:**

- Used `backdrop-filter` for glassmorphism on the toolbar.
- Neutralized Prism colors to near-black/grey in print mode for better ink economy.

**Issues Found:**

- Headless browser screenshots struggle with complex gradients + backdrop-filters (verified manually/programmatically instead).

---

## 2026-03-03 — Phase 3: Rendering Pipeline

### Conversation 4: Phase 3 Execution

**What happened:**

1. Implemented core rendering utilities:
   - `utils/debounce.js`: Performance helper for editor updates.
   - `utils/wordCount.js`: Logic for words, characters, reading time, and page estimates.
2. Implemented Markdown plugins:
   - `markdown/frontmatter.js`: YAML parsing via `js-yaml`.
   - `markdown/math.js`: Math pre-processing via `katex`.
   - `markdown/syntaxHighlight.js`: Code highlighting via `prismjs`.
3. Integrated everything into `markdown/parser.js` using `markdown-it`.
4. Verified pipeline in `App.jsx` by rendering a complex test string (YAML + Math + Code).
5. Git commit: `15c2733`

**Key Decisions:**

- Math is pre-processed before Markdown-it to avoid escaping issues with LaTeX symbols like `\` and `_`.
- Fallback to plain text if Prism doesn't support a requested language.

**Issues Found:**

- None. KaTeX styles needed explicit import in `math.js`.

---

## 2026-03-04 — Phase 4: Editor Component (CodeMirror 6)

### Conversation 5: Phase 4 Execution

**What happened:**

1. Implemented `src/components/Editor.jsx` with CodeMirror 6:
   - `EditorView` + `EditorState` with full extension stack
   - Extensions: `markdown()` lang, `lineNumbers()`, `highlightActiveLine()`, `bracketMatching()`, `history()`, `indentWithTab`, `lineWrapping`
   - Custom Calm Night theme via `EditorView.theme()` (dark mode, transparent bg)
   - `onChange` callback fires on every doc change (uses ref pattern to avoid stale closures)
   - `useImperativeHandle` exposes `setValue(text)`, `focus()`, `getView()` for parent control
2. Installed missing `@codemirror/commands` package (was not a transitive dep)
3. Updated `App.jsx` to wire Editor component with live preview:
   - Editor `onChange` → `setMarkdown` → re-render preview via `renderMarkdown()`
   - Word count, reading time, title all update reactively
4. Verified in browser:
   - Calm Night colors, Markdown syntax highlighting (headings, bold, links, code fences)
   - Line numbers visible, typing fires onChange, preview updates live
   - Performance: 7,505 words inserted in ~43ms — zero freeze
5. Git commit: `59a3389`

**Key Decisions:**

- Used ref pattern (`onChangeRef`) to avoid stale closure in the `updateListener` — the listener is created once at mount but always calls the latest `onChange` callback.
- Added `@codemirror/commands` for `defaultKeymap`, `history`, `historyKeymap`, and `indentWithTab` — essential for undo/redo and tab behavior.
- Used `syntaxHighlighting(defaultHighlightStyle, { fallback: true })` alongside the CSS-based Calm Night theme for baseline token coloring.

**Issues Found:**

- None.

---

## 2026-03-04 — Phase 5: Live Preview + Error Boundary

### Conversation 6: Phase 5 Execution

**What happened:**

1. Implemented `src/components/Preview.jsx`:
   - Renders parsed HTML via `dangerouslySetInnerHTML`
   - Scroll position preservation across re-renders (stores `scrollTop` in a ref)
   - Resets scroll to top when content is cleared
   - Shows placeholder text ("Start writing Markdown…") when editor is empty
2. Implemented `src/components/ErrorBoundary.jsx`:
   - Class-based React error boundary wrapping `<Preview>`
   - Catches render crashes, displays structured fallback UI (icon + title + error detail + "Try Again" button)
   - `handleReset()` method clears error state to recover
   - Logs caught errors to console for debugging
3. Updated `src/App.jsx`:
   - Replaced inline `dangerouslySetInnerHTML` with `<Preview>` component
   - Wrapped `<Preview>` in `<ErrorBoundary>`
   - Added isEmpty detection for empty content handling
   - Added XSS test case (`<script>alert('xss')</script>`) to default content
4. Enhanced `src/styles/preview.css`:
   - Added `.error-fallback-inner`, `.error-fallback-icon`, `.error-fallback-title`, `.error-fallback-detail` styles
5. Verified in browser:
   - Headings, KaTeX math, Prism code blocks, tables all render correctly
   - XSS script tag does NOT execute
   - ErrorBoundary catches forced render errors, shows fallback, "Try Again" recovers
   - Scroll position preserved during typing
   - No console errors
6. Git commit: `d31a030`

**Key Decisions:**

- Used ref-based scroll position tracking (`prevScrollRef`) rather than state to avoid unnecessary re-renders during scroll events.
- ErrorBoundary includes a "Try Again" button for user-initiated recovery rather than requiring a full page reload.

**Issues Found:**

- None.

---

## 2026-03-04 — Phase 6: PDF Export + Print Settings

### Conversation 7: Phase 6 Execution

**What happened:**

1. Implemented `src/components/PrintSettings.jsx`:
   - Dropdown panel with glassmorphism styling, animated entry
   - Page size selector (A4 / Letter / A3)
   - Margins selector (Normal / Narrow / Wide)
   - PDF title input (auto-filled from YAML `title` frontmatter)
   - Export flow: sets `document.title` → injects dynamic `@page` CSS → calls `window.print()` → cleans up
   - Click-outside and Escape key close the panel
2. Updated `src/styles/base.css`:
   - Added `.print-settings` panel styles (glassmorphism, animation, dark form controls)
   - Added `.btn-export` gradient accent style
   - Added `.print-settings-field` select/input styles matching Calm Night theme
3. Updated `src/App.jsx`:
   - Added `showPrintSettings` state and toggle/close handlers
   - Wired Export button to toggle the PrintSettings dropdown
   - Wrapped PrintSettings in `.print-settings-wrapper` for absolute positioning
   - Added "PDF Export ✅" to default content table
4. `print.css` was already finalized in Phase 2 — no changes needed
5. Verified in browser:
   - Export button visible with gradient styling
   - Panel opens with all fields, title auto-filled as "MarkRender Test"
   - Cancel and ✕ both close the panel
   - No console errors
6. Git commit: `4a28c41`

**Key Decisions:**

- Used absolute positioning relative to `.print-settings-wrapper` rather than a modal overlay — keeps the export panel feeling lightweight and contextual.
- Dynamic `@page` CSS injected/removed around `window.print()` call so page size/margin changes don't persist.
- Print settings panel auto-closes after export to avoid stale state.

**Issues Found:**

- None.

## 2026-03-04 — Phase 7: App Layout, Toolbar & Features

### Conversation 8: Phase 7 Execution

**What happened:**

1. Implemented `src/utils/storage.js`:
   - `saveContent()`, `loadContent()`, `clearContent()` with try/catch safety
   - Uses constant key `markrender_content`
2. Implemented `src/hooks/useAutosave.js`:
   - Debounced 2s autosave via `debounce.js` helper
   - Returns `{ lastSaved, triggerSave }` — `lastSaved` is a `Date` timestamp
   - Uses ref pattern so debounced fn always captures latest content
   - `triggerSave()` exposed for `Ctrl+S` immediate save
3. Implemented `src/hooks/useKeyboardShortcuts.js`:
   - `Ctrl+S` → triggerSave
   - `Ctrl+Shift+E` → openExport
   - `Ctrl+Shift+V` → toggleView
   - `Ctrl+/` → focusEditor
   - `Escape` → closeModals
   - Registered via `window.addEventListener`, cleaned up on unmount
4. Implemented `src/components/Toolbar.jsx` (full replacement of stub):
   - Left: brand/document title from YAML frontmatter
   - Centre: view toggle button (SVG icon, cycles labels) + Export button (wraps PrintSettings)
   - Right: word count + reading time + pages, autosave indicator with `.autosave-visible` state
   - Wrapped in `memo()` for render performance
   - Accessible aria attributes on all interactive elements
5. Rewrote `src/App.jsx`:
   - Restored from localStorage on mount; falls back to `DEFAULT_MARKDOWN`
   - `viewMode` state: `'split' | 'editor' | 'preview'` cycled via toggle
   - Integrated `useAutosave` and `useKeyboardShortcuts`
   - `document.title` synced from frontmatter (`title — MarkRender`)
   - `main-content` gets `view-{mode}` CSS class for panel visibility
6. Updated `src/styles/base.css`:
   - `.toolbar-controls` (centre flex group)
   - `.toolbar-meta` (right flex group)
   - `.autosave-indicator.autosave-visible` (green + opacity 1)
   - `.main-content.view-editor`, `.view-preview`, `.view-split` CSS classes
   - Mobile responsive: hides word count, truncates brand title, stacks panels
7. Verified all 11 checklist items in browser — all PASS
8. Git commit: `02d941e`

**Key Decisions:**

- Used `memo()` on Toolbar to avoid re-rendering on every keystroke (stats come from parent state but the component doesn't change structure)
- Ref pattern in `useAutosave` so the debounced function always has latest `content` without being recreated on every change
- `Ctrl+Shift+V` shortcut uses uppercase `V` in the key check (`e.key === 'V'`) because shift transforms the key character
- `view-{mode}` CSS class on `.main-content` drives panel show/hide — keeps view logic entirely in CSS, no inline conditional rendering (avoids CodeMirror unmount/remount on view change)

**Issues Found:**

- None.

---

## 2026-03-04 — Phase 8: Scroll Sync, Focus Mode & Polish

### Conversation 9: Phase 8 Execution

**What happened:**

1. Implemented `src/hooks/useScrollSync.js`:
   - Proportional scroll sync between CodeMirror's `scrollDOM` and preview panel
   - Tracks `scrollTop / scrollHeight` ratio of the actively-scrolled panel
   - Applies the same ratio to the other panel
   - Uses a source-lock + 50ms debounce to prevent feedback loops
   - Passive event listeners for performance
   - Only active in split view mode (disabled in editor-only, preview-only, or focus mode)
2. Updated `src/components/Preview.jsx`:
   - Wrapped in `forwardRef` and exposed `getElement()` via `useImperativeHandle`
   - Allows scroll sync hook to access the `.preview-panel` DOM node
3. Implemented Focus / Zen Mode:
   - New state: `focusMode` + `showFocusHint` in `App.jsx`
   - Toolbar slides up and disappears (CSS `transform: translateY(-100%)`)
   - Editor fills 100% viewport height and width, preview hidden
   - "Press ESC to exit focus mode" hint overlay appears at bottom center, fades after 3s
   - Toggle via `F11` key or toolbar "Focus" button
   - `Escape` exits focus mode (and closes any open modals)
4. Updated `src/components/Toolbar.jsx`:
   - Added Focus/Zen mode button between view toggle and export
   - Uses expand/contract SVG icons, highlights when active (`.btn-focus-active`)
   - New props: `focusMode`, `onToggleFocusMode`
5. Updated `src/hooks/useKeyboardShortcuts.js`:
   - Added `F11` → `toggleFocusMode()` shortcut
   - Added `toggleFocusMode` to handler params
6. UX Polish:
   - Added `placeholder("# Start writing Markdown...")` extension to CodeMirror
   - Styled `.cm-placeholder` (dim, italic) in `editor.css`
   - Added `scroll-behavior: smooth` on `.preview-panel` in `base.css`
   - Browser tab title already synced from YAML frontmatter (Phase 7)
7. Updated `src/styles/base.css`:
   - Focus mode CSS: `.app.focus-mode .toolbar` (slide-up), `.editor-panel` (full viewport), `.preview-panel` (hidden)
   - `.btn-focus-active` highlight style
   - `.focus-hint` overlay + `.focus-hint-visible` + `kbd` styling
8. Verified all features in browser:
   - Scroll sync working in split view
   - Focus mode enters/exits correctly with toolbar animation and hint
   - Placeholder visible when editor is empty
   - No console errors
9. Git commit: `9de4564`

**Key Decisions:**

- Scroll sync uses proportional ratio (`scrollTop / maxScroll`) rather than line-based mapping — simpler, works well for documents of similar visual density
- Source-lock pattern prevents feedback loops: when one panel triggers a scroll event on the other, the second panel's handler is suppressed
- Focus mode hides preview entirely (not just the toolbar) to create a true distraction-free writing environment
- Focus hint uses fixed positioning with `opacity` transition for the 3-second fade — no layout shift

**Issues Found:**

- None.

---

## 2026-03-04 — Phase 9: Build, Deploy & Smoke Test

### Conversation 10: Phase 9 Execution

**What happened:**

1. Ran `npm run build` — Vite production build completed in 4.78s:
   - 159 modules transformed
   - Output: `dist/index.html` (0.46KB), `index.css` (48KB/12.6KB gz), `index.js` (1,169KB/394KB gz)
   - Chunk size warning for JS bundle (expected: KaTeX + Prism + CodeMirror)
   - Zero errors
2. Ran `npx vite preview --port 4174` — served production build locally
3. Full smoke test in browser — ALL PASS:
   - Page loads in < 1 second
   - Typing updates preview live
   - Heading, bold, inline code, lists, KaTeX math all render correctly
   - Word count: "20 words · 1 min · ~1 page" updates accurately
   - "✓ Autosaved" indicator appears after editing
   - View toggle cycles Split → Editor → Preview → Split
   - No console errors (only expected KaTeX display-mode warnings)
4. Updated tracker files (status.md, changelog.md, context.md)
5. Updated dev-journal.md
6. Git commit + tag `v0.1.0-web-mvp`

**Key Decisions:**

- Did not pursue PWA stretch goal — keeping scope clean for v0.1 MVP
- Chunk size warning acknowledged but not addressed — code-splitting is a v0.2 optimization
- No deployment to Vercel/Netlify in this phase — build verified locally, deployment is environment-dependent

**Issues Found:**

- None. Production build matches dev behavior exactly.

---

> **Update this file**: At the end of every conversation, append a new dated section with what was done, key decisions, and any issues found.
