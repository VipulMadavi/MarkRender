# Tech Stack: MarkRender Python

## 1. Core Framework

**PySide6 (Qt for Python)**

- **Why**: Professional-grade GUI framework. High performance and includes `QtWebEngine`, which allows us to use standard web technologies (HTML/CSS) for the preview panel while keeping the app native.

## 2. Rendering Pipeline

- **Markdown Engine**: `markdown2` or `python-markdown`.
  - Robust, extensible, and supports extras like tables and code-friendly formatting.
- **Math Rendering**: `MathJax` (loaded locally in the WebEngine).
  - Standard for high-quality mathematical typesetting.
- **Syntax Highlighting**: `Pygments`.
  - The industry standard in Python for highlighting code.
- **YAML Metadata**: `PyYAML`.
  - For parsing frontmatter at the top of markdown files.

## 3. PDF Generation

- **Primary Engine**: `QtWebEngine` Print-to-PDF.
  - Ensures that the PDF looks _exactly_ like the preview, as they use the same Chromium-based rendering engine.
- **Alternative**: `WeasyPrint`.
  - If a strictly non-GUI PDF generation is needed (e.g., for a CLI mode).

## 4. UI Library & Styling

- **Theme**: Custom QSS (Qt Style Sheets).
  - Used to implement the "Calm Night" design tokens (colors, gradients, rounded corners).
- **Fonts**:
  - UI: `Inter`
  - Writing/Code: `JetBrains Mono`

## 5. Development Tools

- **Package Manager**: `pip` + `requirements.txt` or `Poetry`.
- **Linter**: `Ruff` or `Flake8`.
- **Bundler**: `PyInstaller` or `Nuitka`.
  - To package the application into a standalone executable.

## 6. Project Architecture

```text
markrender-py/
├── app/
│   ├── ui/             # QSS files and UI layouts
│   ├── core/           # Markdown & PDF logic
│   ├── components/     # Custom Qt Widgets
│   └── main.py         # Entry point
├── resources/          # Icons, Fonts
├── tests/              # Unit & Integration tests
└── requirements.txt
```
