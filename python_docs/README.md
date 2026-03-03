# MarkRender — Python Edition 🐍

A powerful, high-fidelity Markdown-to-PDF deskop application built entirely in Python.

## Overview

MarkRender Python is a desktop-first rewrite of the original web concept. It leverages Python's robust ecosystem for document processing and native GUI capabilities to provide a professional-grade writing environment.

### Core Philosophy

- **High Fidelity**: What you see in the editor's live preview is exactly what you get in the PDF.
- **Privacy First**: Completely local. No cloud, no tracking, just your files.
- **Power Features**: Native file system access, integrated PDF generation, and extensible plugin architecture.

## Documents

This directory contains the full independent specification for the Python version of the project:

- [PRD (Product Requirements Document)](./prd.md) — Feature set and goals.
- [Tech Stack](./techstack.md) — The Python libraries and architecture.
- [Design Spec](./design.md) — The "Calm Night" aesthetic adapted for Desktop.
- [Phase Plan](./phase_plan.md) — The step-by-step build guide.

## Quick Start (Conceptual)

```bash
# Setup environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install core dependencies
pip install PySide6 markdown2 pygments WeasyPrint
```

---

_Note: This documentation is maintained independently of the React-based MarkRender project._
