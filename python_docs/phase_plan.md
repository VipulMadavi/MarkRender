# Build Plan: MarkRender Python

## Phase 1: Environment & Window Setup

**Duration: 45m**

- Initialize Python virtual environment.
- Install `PySide6`.
- Create the main `MainWindow` subclass.
- Setup basic 2-pane QSplitter layout.

## Phase 2: The Core Pipeline

**Duration: 1.5h**

- Integrate `markdown2`.
- Create a `MarkdownProcessor` class that handles YAML frontmatter and math strings.
- Implement the "HTML construction" logic (combining CSS, MathJax, and Markdown output).

## Phase 3: The Editor (Writing Experience)

**Duration: 1.5h**

- Customize `QPlainTextEdit`.
- Write a `QSyntaxHighlighter` for Markdown syntax (Headers, Bold, Code blocks).
- Implement basic auto-indentation and tab-handling.

## Phase 4: The Preview Panel (WebEngine)

**Duration: 1h**

- Initialize `QWebEngineView`.
- Wire the Editor's `textChanged` signal to the `WebEngineView`.
- Implement a debouncer to prevent excessive re-renders.

## Phase 5: PDF Export & File IO

**Duration: 1.5h**

- Implement `File -> Open` and `File -> Save`.
- Wire the PDF Export button using `QWebEngineView.page().printToPdf()`.
- Add a settings dialog for PDF Page Size and Margins.

## Phase 6: Design Polish & Shortcuts

**Duration: 1h**

- Apply the "Calm Night" QSS theme.
- Add keyboard shortcuts (Ctrl+S, Ctrl+P, Ctrl+B, etc.).
- Add word count and status indicators.

## Phase 7: Packaging

**Duration: 45m**

- Setup `PyInstaller` configuration.
- Bundle assets (fonts, icons).
- Create a standalone executable.

---

**Total Estimated Time: 8 Hours**
