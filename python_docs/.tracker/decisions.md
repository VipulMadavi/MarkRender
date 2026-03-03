# MarkRender Python — Design Decisions

## 1. Shift to Python / Desktop Native

- **Date**: 2026-03-04
- **Decision**: Develop an independent, native version of MarkRender in Python.
- **Rationale**: While the React version is excellent for portability, a native Python app (using PySide6) allows for:
  - Better native file system integration (standard Save dialogs).
  - Offline-first reliability without PWA overhead.
  - Simplified PDF generation using Chromium-based `QtWebEngine` APIs.
  - Future-proofing for local AI/LLM integration.
- **Impact**: Requires maintenance of two separate codebases if both are pursued.

## 2. Using PySide6 (Qt) Over Tkinter

- **Date**: 2026-03-04
- **Decision**: Select PySide6 as the primary GUI framework.
- **Rationale**:
  - **QtWebEngine**: Provides the critical visual fidelity needed between editor and PDF.
  - **QSS Support**: Allows the "Calm Night" CSS tokens to be applied globally to the application UI.
  - **Professionalism**: Industry standard for complex desktop tools.

## 3. High Fidelity via Chromium

- **Date**: 2026-03-04
- **Decision**: Use an embedded Chromium engine (via Qt) for the preview panel.
- **Rationale**: The core value proposition of MarkRender is "What you see is what you get". Using the same rendering engine (Chromium) in the preview and the PDF export is the only way to guarantee 100% fidelity.

## 4. Single-file Executable (PyInstaller)

- **Date**: 2026-03-04
- **Decision**: Distribute as a standalone executable.
- **Rationale**: Python apps are notoriously difficult for end-users to install (handling `pip`, `venv`, etc.). Bundling everything into a single file makes the tool accessible to non-technical users.
