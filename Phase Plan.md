# MarkRender — Build Plan (Final)
> **Product**: Markdown-to-PDF Web App (React SPA)
> **Stack**: React · Vite · CodeMirror 6 · markdown-it · KaTeX · Prism.js · js-yaml · CSS
> **PDF**: Browser `window.print()` | **Deploy**: Static (Vercel / Netlify)

---

## Ground Rules

> [!IMPORTANT]
> **Git Checkpoint**: Every phase ends with `git add . && git commit`. Clean restore point.

> [!IMPORTANT]
> **Verify, Don't Fix**: Run the checklist after each phase. If broken — **note it and stop**. No fixes without review + permission.

> [!IMPORTANT]
> **Tracker Update**: After each phase, update `.tracker/status.md` with current progress and any issues found.

---

## ☕ Dev Journal (Added Rule)

> [!TIP]
> **Personal Note**: After every phase, add 2-3 lines to `dev-journal.md`. Keep it informal, messy, and "student-like"—just a raw dump of how it went, any frustrations, or "a-ha!" moments. This is for the human side of things.


---

## Time Budget

| # | Phase | Time | New Features Included |
|---|-------|------|-----------------------|
| 1 | Project Scaffolding | 0:00 – 0:30 | — |
| 2 | Design System & Global Styles | 0:30 – 1:30 | Editor theme tokens |
| 3 | Markdown Pipeline | 1:30 – 3:00 | YAML frontmatter |
| 4 | Editor (CodeMirror 6) | 3:00 – 4:00 | Syntax highlighting |
| 5 | Live Preview + Error Boundary | 4:00 – 5:00 | Error boundary |
| 6 | PDF Export + Print Settings | 5:00 – 6:00 | Page size, title hint |
| 7 | App Layout, Toolbar & Features | 6:00 – 7:15 | Word count, autosave, shortcuts |
| 8 | Scroll Sync, Focus Mode & Polish | 7:15 – 8:15 | Scroll sync, zen mode |
| 9 | Build, Deploy & Smoke Test | 8:15 – 9:00 | PWA (stretch) |

**Total: ~8–9 hours** (expanded from 7–8 to accommodate new features)

---

## Phase 1 — Project Scaffolding
**Duration: ~30 min** | `0:00 – 0:30`

### Goal
Bootstrap Vite + React, install all dependencies, set up folder structure.

### Steps
1. `npm create vite@latest ./ -- --template react`
2. Install all dependencies:
   ```bash
   npm install markdown-it katex prismjs js-yaml
   npm install @codemirror/view @codemirror/state @codemirror/lang-markdown @codemirror/theme-one-dark
   npm install -D eslint prettier
   ```
3. Clean Vite boilerplate (remove `App.css`, clear `index.css`)
4. Set `base: './'` in `vite.config.js`
5. Create folder structure:
   ```
   src/
   ├── components/    Editor.jsx  Preview.jsx  Toolbar.jsx  ErrorBoundary.jsx  PrintSettings.jsx
   ├── markdown/      parser.js  math.js  syntaxHighlight.js  frontmatter.js
   ├── hooks/         useAutosave.js  useKeyboardShortcuts.js  useScrollSync.js
   ├── styles/        base.css  editor.css  preview.css  print.css
   ├── utils/         debounce.js  wordCount.js  storage.js
   ├── App.jsx
   └── main.jsx
   ```

### ✅ Verify
- [ ] `npm run dev` — no errors, blank React page visible
- [ ] All dependencies installed (check `node_modules/`)
- [ ] Folder structure matches above layout
- [ ] No boilerplate files remaining

### 🔖 Git Checkpoint
```bash
git add .
git commit -m "phase-1: vite + react scaffolding, all deps installed, folder structure"
```

---

## Phase 2 — Design System & Global Styles
**Duration: ~60 min** | `0:30 – 1:30`

### Goal
Implement the full Calm Night design system. Every component will inherit this foundation.

### Files
```
src/styles/base.css     ← tokens, fonts, gradient, global reset
src/styles/editor.css   ← CodeMirror theme overrides
src/styles/preview.css  ← document typography, A4 page simulation
src/styles/print.css    ← @media print skeleton
```

### `base.css` — Tokens & Foundation
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap');

:root {
  --bg-primary: #210635;  --bg-secondary: #420D4B;
  --accent: #6667AB;      --accent-hover: #7B337E;
  --text-body: #EDEAF4;   --text-heading: #F5D5E0;
  --success: #4CAF50;     --error: #FF6B6B;
  --space-xs: 4px; --space-s: 8px; --space-m: 16px;
  --space-l: 24px; --space-xl: 32px;
}
```

### `editor.css` — CodeMirror Calm Night
```css
.cm-editor {
  background: transparent;
  color: var(--text-body);
  font-family: 'JetBrains Mono', monospace;
}
.cm-activeLine { background: rgba(255,255,255,0.03); }
.cm-selectionBackground { background: rgba(102,103,171,0.3) !important; }
.cm-cursor { border-left-color: var(--text-heading); }
```

### `preview.css` — A4 Page Feel
- `.preview-page { max-width: 800px; margin: 0 auto; padding: var(--space-xl); }`
- `h1 { font-size: 2rem; color: var(--text-heading); }`
- `pre { background: rgba(255,255,255,0.05); border-radius: 8px; box-shadow: 0 0 15px rgba(102,103,171,0.2); }`
- Tables: borders + alternating rows
- `.math-error { color: var(--error); background: rgba(255,107,107,0.1); border-radius: 4px; }`

### `print.css` — Print Skeleton
```css
@media print {
  @page { size: A4; margin: 2cm 2.5cm; }
  body { background: white; color: black; }
  .toolbar, .editor-panel { display: none; }
  .preview-panel { display: block; width: 100%; }
}
```

### ✅ Verify
- [ ] Gradient background visible
- [ ] CSS custom properties accessible in devtools
- [ ] Google Fonts load (no 404 in Network tab)
- [ ] `Ctrl+P` → print preview shows white bg, no toolbar
- [ ] Note any font loading or color issues

### 🔖 Git Checkpoint
```bash
git add .
git commit -m "phase-2: calm night design system — base, editor, preview, print CSS"
```

---

## Phase 3 — Markdown Rendering Pipeline
**Duration: ~90 min** | `1:30 – 3:00`

### Goal
Build the single rendering pipeline shared by preview and PDF. Includes YAML frontmatter support.

### Files
```
src/markdown/parser.js          ← markdown-it + plugins + exports renderMarkdown()
src/markdown/math.js            ← KaTeX pre-processing
src/markdown/syntaxHighlight.js ← Prism.js fence override
src/markdown/frontmatter.js     ← YAML strip + parse
src/utils/debounce.js           ← debounce helper
src/utils/wordCount.js          ← word/char/reading time/page estimates
```

### `frontmatter.js`
```js
import yaml from 'js-yaml';
export function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { metadata: {}, content: text };
  const metadata = yaml.load(match[1]) || {};
  const content = text.slice(match[0].length).trim();
  return { metadata, content };
}
```

### `parser.js`
- Strip frontmatter → pre-process math → parse via markdown-it → highlight via Prism
- Export: `renderMarkdown(text) → { html, metadata }`

### `math.js`
- Replace `$$...$$` and `$...$` with KaTeX HTML
- Errors → `<span class="math-error">` (no throw)

### `syntaxHighlight.js`
- Prism fence override, fallback to plain `<code>` for unknown langs

### `wordCount.js`
```js
export function getStats(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return {
    words,
    characters: text.length,
    readingTime: Math.max(1, Math.ceil(words / 200)),
    pages: Math.max(1, Math.ceil(words / 300)),
  };
}
```

### ✅ Verify
- [ ] `renderMarkdown("# Hello\n$E=mc^2$")` → KaTeX HTML in output
- [ ] YAML block `---\ntitle: Test\n---\n# Content` → metadata parsed, content clean
- [ ] Fenced code block → Prism token spans
- [ ] Broken math `$\wrong` → `.math-error` span, no exception
- [ ] `getStats("hello world")` → `{ words: 2, readingTime: 1, pages: 1 }`
- [ ] Note any Prism/KaTeX issues

### 🔖 Git Checkpoint
```bash
git add .
git commit -m "phase-3: rendering pipeline — markdown-it, KaTeX, Prism, YAML, word count"
```

---

## Phase 4 — Editor Component (CodeMirror 6)
**Duration: ~60 min** | `3:00 – 4:00`

### Goal
Premium Markdown editor with syntax highlighting using CodeMirror 6.

### File
```
src/components/Editor.jsx
```

### Implementation
- `EditorView` + `EditorState` from `@codemirror/view` and `@codemirror/state`
- Extensions: `markdown()` lang, `lineNumbers()`, custom Calm Night theme, `EditorView.lineWrapping`
- On doc change → call `onChange(content)` prop
- Expose `setValue(content)` via `useImperativeHandle` for frontmatter load
- Import `editor.css`

### Props
```jsx
<Editor value={string} onChange={(content) => void} ref={editorRef} />
```

### ✅ Verify
- [ ] CodeMirror renders with Calm Night colors
- [ ] Markdown headings/bold/links highlighted
- [ ] Line numbers visible
- [ ] Typing fires `onChange`
- [ ] Paste 5,000 words — no freeze
- [ ] Tab key behavior (note if unexpected, don't fix)

### 🔖 Git Checkpoint
```bash
git add .
git commit -m "phase-4: CodeMirror 6 editor with calm night theme"
```

---

## Phase 5 — Live Preview + Error Boundary
**Duration: ~60 min** | `4:00 – 5:00`

### Goal
Render parsed HTML in a styled panel. Protect against render crashes.

### Files
```
src/components/Preview.jsx
src/components/ErrorBoundary.jsx
```

### `Preview.jsx`
```jsx
<div className="preview-panel">
  <div className="preview-page" dangerouslySetInnerHTML={{ __html: html }} />
</div>
```
- Keep scroll position on typing updates
- Reset scroll to top on file load / content clear

### `ErrorBoundary.jsx`
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="error-fallback">Something went wrong rendering the preview.</div>;
    return this.props.children;
  }
}
```
- Wraps `<Preview>` in `App.jsx`

### ✅ Verify
- [ ] `# Hello` renders as `<h1>` with correct color
- [ ] Math renders as KaTeX, not raw LaTeX
- [ ] Code blocks show Prism syntax colors
- [ ] Table renders with borders
- [ ] `<script>alert('xss')</script>` in Markdown → does NOT execute
- [ ] Force a render error → ErrorBoundary shows fallback (not white screen)

### 🔖 Git Checkpoint
```bash
git add .
git commit -m "phase-5: live preview + error boundary"
```

---

## Phase 6 — PDF Export + Print Settings
**Duration: ~60 min** | `5:00 – 6:00`

### Goal
Wire up `window.print()` with configurable page settings and PDF title hint.

### Files
```
src/components/PrintSettings.jsx
src/styles/print.css (finalize)
```

### `PrintSettings.jsx`
- Dropdown: Page size (A4 / Letter / A3)
- Dropdown: Margins (Normal / Narrow / Wide)
- Input: PDF title (auto-filled from YAML `title` field)
- Export button

### Export Flow
```js
const handleExport = ({ pageSize, margins, title }) => {
  // 1. Set document.title for PDF filename hint
  document.title = title || 'MarkRender';
  
  // 2. Inject dynamic @page CSS
  const style = document.createElement('style');
  style.id = 'dynamic-print';
  style.textContent = `@page { size: ${pageSize}; margin: ${margins}; }`;
  document.head.appendChild(style);
  
  // 3. Print
  window.print();
  
  // 4. Cleanup
  document.head.removeChild(style);
  document.title = 'MarkRender';
};
```

### `print.css` — Finalize
- Hide `.toolbar`, `.editor-panel`, `.print-settings`
- Show `.preview-panel` full width
- Code: `white-space: pre-wrap`
- Tables: `page-break-inside: avoid`

### ✅ Verify
- [ ] Export → print dialog opens
- [ ] PDF filename matches YAML title
- [ ] Switching page size actually changes PDF dimensions
- [ ] PDF: no toolbar, no editor, only preview content
- [ ] PDF: white bg, black text, correct margins
- [ ] If PDF blank or wrong — note, do not fix

### 🔖 Git Checkpoint
```bash
git add .
git commit -m "phase-6: PDF export with print settings, dynamic @page CSS"
```

---

## Phase 7 — App Layout, Toolbar & Features
**Duration: ~75 min** | `6:00 – 7:15`

### Goal
Assemble the full app: split view, toolbar, autosave, word count, keyboard shortcuts.

### Files
```
src/App.jsx
src/components/Toolbar.jsx
src/hooks/useAutosave.js
src/hooks/useKeyboardShortcuts.js
src/utils/storage.js
```

### `App.jsx` — State & Layout
```
┌──────────────────────────────────────┐
│  Toolbar (glassmorphism)             │
├───────────────────┬──────────────────┤
│   Editor (50%)    │   Preview (50%)  │
└───────────────────┴──────────────────┘
```
- State: `{ markdown, viewMode, metadata }`
- On markdown change: `{ html, metadata } = renderMarkdown(markdown)`
- `viewMode: 'split' | 'editor' | 'preview'`

### `Toolbar.jsx` — Layout
```
[MarkRender]  |  [Toggle View] [Focus] [Export ▼]  |  1,243 words · 6 min · ~4 pages  Autosaved ✓
```

### `useAutosave.js`
```js
// Debounced save to localStorage every 2s after edit
// Restore on mount
// Expose `lastSaved` timestamp for indicator
```

### `useKeyboardShortcuts.js`
| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Manual autosave trigger |
| `Ctrl+Shift+E` | Open print settings / export |
| `Ctrl+Shift+V` | Toggle view mode |
| `Ctrl+/` | Focus editor |
| `Escape` | Close modals |

### Responsive
- Desktop (≥768px): side-by-side
- Mobile (<768px): stacked

### ✅ Verify
- [ ] Split view: 50/50 on desktop
- [ ] Toggle cycles: Split → Editor → Preview → Split
- [ ] Word count + reading time display in toolbar
- [ ] Autosave fires after 2s pause → "Autosaved ✓" indicator
- [ ] Page refresh restores content from localStorage
- [ ] `Ctrl+Shift+E` opens export, `Ctrl+Shift+V` toggles view
- [ ] Responsive: stacks on mobile width
- [ ] Note any layout, shortcut, or state issues

### 🔖 Git Checkpoint
```bash
git add .
git commit -m "phase-7: app layout, toolbar, autosave, word count, keyboard shortcuts"
```

---

## Phase 8 — Scroll Sync, Focus Mode & Polish
**Duration: ~60 min** | `7:15 – 8:15`

### Goal
Add scroll sync, focus mode, polish UX, test edge cases.

### Files
```
src/hooks/useScrollSync.js
```

### `useScrollSync.js`
- Track `scrollTop / scrollHeight` ratio of active panel
- Apply same ratio to the other panel
- Debounced (50ms) to avoid feedback loops
- Disable sync while user is actively scrolling the target panel

### Focus / Zen Mode
- `F11` or toolbar button → toggle focus mode
- Hide toolbar (slide up, 200ms)
- Editor fills 100% width
- Subtle hint: "Press ESC to exit" — fades after 3s

### UX Polish
- [ ] Browser tab title: `MarkRender`
- [ ] Placeholder in empty editor: `# Start writing Markdown...` (dim)
- [ ] Error messages are human-readable
- [ ] `scroll-behavior: smooth` on preview

### Edge Cases
- [ ] Empty document → Export produces valid PDF
- [ ] Wide table → Check PDF (note overflow, don't fix)
- [ ] Broken math → `.math-error` span, export not blocked
- [ ] Long code block → wraps in PDF
- [ ] Unicode + emoji → renders in both preview and PDF
- [ ] Rapid typing → debounced, no jitter
- [ ] All 6 heading levels → clear hierarchy

### Acceptance Criteria (PRD §12)
- [ ] Type Markdown with syntax highlighting ✓
- [ ] Live preview ✓
- [ ] Export → PDF matches preview ✓
- [ ] Word count visible ✓
- [ ] Autosave works ✓
- [ ] Keyboard shortcuts work ✓
- [ ] YAML frontmatter parsed ✓
- [ ] Scroll sync works ✓
- [ ] No backend needed ✓
- [ ] No rendering inconsistencies ✓

> [!CAUTION]
> If any acceptance criterion fails — **stop and report**. Do not fix without review.

### 🔖 Git Checkpoint
```bash
git add .
git commit -m "phase-8: scroll sync, focus mode, polish, edge cases verified"
```

---

## Phase 9 — Build, Deploy & Smoke Test
**Duration: ~45 min** | `8:15 – 9:00`

### Goal
Production build, deploy, final verification. PWA stretch goal.

### Steps
1. Production build:
   ```bash
   npm run build
   ```
2. Local preview:
   ```bash
   npm run preview
   ```
3. Deploy:
   ```bash
   npx vercel --prod
   # OR: git push origin main (if Vercel/Netlify connected)
   ```

### PWA Stretch Goal (if time allows)
```bash
npm install vite-plugin-pwa
```
- Add to `vite.config.js`
- Copy KaTeX fonts to `public/`
- Self-host Google Fonts
- Test offline after deploy

### ✅ Final Smoke Test
- [ ] `npm run build` — no errors
- [ ] `npm run preview` — app works identically to dev
- [ ] Deployed URL opens in Chrome/Edge
- [ ] Type → preview updates
- [ ] Export → PDF matches
- [ ] No console errors
- [ ] Page loads < 2 seconds
- [ ] Note any build/deploy issues — do not fix without review

### 🔖 Final Git Checkpoint
```bash
git add .
git commit -m "phase-9: production build verified, deployed"
git tag v0.1.0-web-mvp
```

---

## Risks & Notes

> [!WARNING]
> **`window.print()` UX**: Browser print dialog is unavoidable. User must manually select "Save as PDF".

> [!WARNING]
> **Print CSS sync**: Preview ≠ PDF is the #1 bug risk. Keep `preview.css` and `print.css` aligned at all times.

> [!NOTE]
> **KaTeX fonts**: For offline/PWA, copy from `node_modules/katex/dist/fonts/` to `public/fonts/katex/`.

> [!TIP]
> **Build order**: Phase 3 (pipeline) is the foundation. Test `renderMarkdown()` in console before wiring UI. This makes Phases 4–5 trivially fast.
