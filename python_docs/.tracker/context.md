# MarkRender (Python) — Quick Context

> **Read this file first** when starting or resuming work on the Python edition.

---

## What Is This Project?

**MarkRender Python** is a native desktop Markdown-to-PDF tool. It is an independent sister project to the React web app, redesigned as a high-performance Python application. It uses a native GUI (PySide6) and a Chromium-based rendering engine (QtWebEngine) to ensure that the writing preview is identical to the final PDF export.

## Architecture Summary

```
Python (PySide6) Native App → No Cloud dependency
Markdown → Python-Markdown → HTML (+ CSS/JS) → QtWebEngine → Preview
                                                    ↓
                                            Print to PDF → PDF
```

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Framework        | Python + PySide6 (Qt)                   |
| Editor           | QPlainTextEdit + QSyntaxHighlighter     |
| Rendering Engine | QtWebEngine (Chromium)                  |
| Parser           | Python-Markdown / Markdown2             |
| Math             | MathJax (Local injection)               |
| Code Highlight   | Pygments                                |
| YAML             | PyYAML                                  |
| PDF Export       | QtWebEngine Print APIs                  |
| Styling          | QSS (Qt Style Sheets) + CSS for Preview |

## Key Design Choices

- **Calm Night theme**: deep purple palette, custom QSS styling for native widgets.
- **Native GUI Features**: Proper file system integration (Open/Save dialogs), native menubars, and system tray support.
- **Zero-Latency Preview**: Optimized rendering loop within the Qt event thread.
- **Privacy-Centric**: 100% offline, local-only processing.

## Important Files (Python Docs)

| File                                | Purpose                           |
| ----------------------------------- | --------------------------------- |
| `python_docs/prd.md`                | Product requirements for Python   |
| `python_docs/techstack.md`          | Python technical choices          |
| `python_docs/design.md`             | Design system adapted for Desktop |
| `python_docs/phase_plan.md`         | The 7-Phase Build Plan            |
| `python_docs/.tracker/status.md`    | Current implementation progress   |
| `python_docs/.tracker/changelog.md` | History of dev work in Python     |

## MVP Features (v0.1 Python)

1. Native window with QSplitter layout (Editor/Preview)
2. Custom QSyntaxHighlighter for Markdown in the editor
3. Real-time HTML preview using QWebEngine
4. PDF export with page size controls
5. Calm Night dark theme via QSS
6. Status bar with Word/Character count
7. Native File Open/Save/Save As
8. YAML frontmatter parsing and display
9. Scroll synchronization (Editor ↔ Preview)
10. Portable packaging (PyInstaller)

---

> **Guideline**: Maintain this tracker independently of the React project. Update `status.md` and `changelog.md` specifically for progress in the Python codebase.
