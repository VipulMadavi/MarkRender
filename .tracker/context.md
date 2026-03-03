# MarkRender — Quick Context for New Conversations

> **Read this file first** when resuming work in a new conversation.

---

## What Is This Project?

**MarkRender** is a web-based Markdown-to-PDF tool. Users write Markdown, see a live preview, and export to PDF via `window.print()`. The preview and PDF share the same rendering pipeline and CSS — guaranteeing visual fidelity.

## Architecture Summary

```
React SPA (Vite) → No backend
Markdown → markdown-it → HTML → Styled DOM → Preview
                                              ↓
                                    window.print() → PDF
```

| Layer | Technology |
|-------|-----------|
| Framework | React + Vite |
| Editor | CodeMirror 6 |
| Parser | markdown-it + plugins |
| Math | KaTeX |
| Code Highlight | Prism.js |
| YAML | js-yaml |
| PDF Export | Browser `window.print()` |
| Styling | Custom CSS (Calm Night theme) |
| State | React local state + localStorage autosave |

## Key Design Choices
- **Calm Night theme**: dark purple gradient, `#210635` → `#420D4B` → `#7B337E`
- **Glassmorphism toolbar**: `backdrop-filter: blur(10px)`
- **Print CSS**: switches to white bg + black text, hides toolbar/editor
- **No backend, no database, no accounts**

## Important Files
| File | Purpose |
|------|---------|
| `docs/prd.md` | Product requirements |
| `docs/techstack.md` | Technical stack decisions |
| `docs/design.md` | Design system (colors, typography, layout) |
| `docs/folderstruc.md` | Folder structure spec |
| `.tracker/status.md` | Current progress (check this!) |
| `.tracker/changelog.md` | History of all changes |
| `.tracker/decisions.md` | Why things were decided |
| `Phase Plan.md` | The build plan (9 phases, 7-8 hours) |

## MVP Features (v0.1)
1. CodeMirror 6 Markdown editor with syntax highlighting
2. Live preview (debounced, styled as A4 page)
3. PDF export via `window.print()`
4. Calm Night dark theme
5. Word count + reading time + estimated pages
6. Autosave to localStorage
7. Keyboard shortcuts (Ctrl+S, Ctrl+Shift+E, etc.)
8. YAML frontmatter parsing
9. Scroll sync between editor and preview
10. Error boundary for safe rendering
11. Print settings (page size, PDF title hint)
12. Focus/Zen mode (stretch)
13. PWA offline support (stretch)

## Post-MVP Roadmap (v0.2+)
- Mermaid diagrams
- Variable font selection
- Drag & drop image insertion
- Clipboard paste → Markdown via Turndown
- Visual page break indicators
- Markdown cheatsheet panel
- Version history (v1.0)

---

> **After every conversation**: Update `status.md` with current phase progress and any blockers. Append to `changelog.md` with what was done.
