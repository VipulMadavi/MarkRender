# PRD: MarkRender (Python Desktop Edition)

## 1. Executive Summary

MarkRender is a native desktop Markdown editor focused on one thing: **perfect PDF export**. It eliminates the common frustration where "Export to PDF" looks different from the editor's preview.

## 2. Target Audience

- **Students**: Creating clean, formatted study notes and assignments.
- **Technical Writers**: Documentation with math, code, and diagrams.
- **Minimalists**: People who want a distraction-free, local-only writing tool.

## 3. Core Features (MVP)

### 3.1 Dual-Pane Editor

- **Live Markdown Editor**: Native text area with syntax highlighting.
- **Real-time Preview**: Side-by-side rendering using an embedded web engine (QtWebEngine) for layout precision.

### 3.2 High-Fidelity PDF Engine

- Unlike browser-based apps, it uses a dedicated HTML-to-PDF engine (`WeasyPrint`) or native Chromium printing.
- Support for A4, Letter, and Legal formats.
- Custom margins and title properties.

### 3.3 Markdown Plus

- **Math Support**: KaTeX/MathJax integration for mathematical formulas ($E=mc^2$).
- **Syntax Highlighting**: Prism.js or Pygments for code blocks.
- **YAML Frontmatter**: Support for metadata (title, author, date) at the top of files.

### 3.4 Local Productivity

- **Autosave**: Continuous saving to a local cache/file.
- **Word/Character Count**: Real-time stats in the status bar.
- **File System Access**: Native Open/Save dialogs.

## 4. User Experience

- **Aesthetic**: "Calm Night" theme (Deep purples, soft pinks, high-contrast text).
- **Speed**: Instantaneous rendering for documents up to 50k words.
- **Shortcuts**: Full suite of shortcuts (Ctrl+S, Ctrl+E for Export, Ctrl+B for Bold, etc.).

## 5. Technical Constraints

- **Offline**: Must work 100% without an internet connection.
- **Portable**: Can be packaged into a single `.exe` or `.app`.
- **Lightweight**: Idle RAM usage < 150MB.

## 6. Future Scope (v2.0)

- Mermaid.js integration for diagrams.
- Plugin system for custom rendering logic.
- Dark/Light mode toggle.
- Batch PDF export for multiple files.
