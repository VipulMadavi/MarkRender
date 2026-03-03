📄 Product Requirements Document (PRD)
Project: Markdown-to-PDF Web Application (MarkRender)
Version: 1.1 (Updated with MVP Feature Additions)
Status: MVP Approved
1. Product Overview
Product Type

Web-based Markdown-to-PDF application.

Primary Goal

Allow users to:

Write or paste Markdown.

See a live formatted preview.

Export exactly what is previewed into a PDF.

Core Promise

"What I preview is exactly what I export."

The preview and exported PDF must use the same rendering logic and styling to ensure layout consistency.

2. Product Vision

This application serves as:

A standalone Markdown-to-PDF web tool (MVP).

A reusable rendering engine for future integration into:

Exam preparation systems

Study material generators

Report builders

Admin export tools

SaaS platforms

The rendering pipeline must be modular and reusable across projects.

3. Problem Statement

Existing tools often:

Produce mismatched preview and PDF output.

Require heavy configuration.

Depend on LaTeX/Pandoc pipelines.

Are bloated with features unnecessary for focused writing.

This project aims to provide:

Minimal interface

Clean typography by default

Deterministic output

Zero configuration required

4. Target User

Primary:

Technical note writer

Student

Developer

Exam preparation content creator

Secondary (Future):

Admin users generating structured PDFs

Study material platforms

5. Core Features (MVP)
5.1 Markdown Editing

CodeMirror 6 editor with Markdown syntax highlighting

Line numbers and current-line highlighting

Real-time preview updates (debounced ~250ms)

Supports:

Headings (H1–H6)

Paragraphs

Lists (ordered/unordered)

Tables

Blockquotes

Code blocks (with Prism.js syntax highlighting)

Inline code

Horizontal rules

Math (KaTeX — inline and block)

YAML frontmatter (parsed via js-yaml, stripped from preview)

5.2 Live Preview

Side-by-side layout (Editor | Preview)

Preview updates on typing (debounced)

Styled output identical to export

No raw Markdown syntax in rendered view

Scroll sync between editor and preview panels

Error boundary — broken renders show friendly message, not white screen

5.3 PDF Export

One-click "Export to PDF" button

Uses browser print functionality (window.print())

Applies print-specific CSS (@media print)

Print settings panel:

Page size selection (A4 / Letter / A3)

PDF filename hint (derived from YAML title or document.title)

Margin presets

Must preserve:

Typography

Spacing

Code formatting

Tables

Math rendering

Exports current in-memory content (not dependent on file save)

Print progress indicator — subtle "Generating PDF…" toast during export

5.4 Styling System

Application must ship with a clean default style:

Typography

Clear heading hierarchy

Comfortable line-height (1.5–1.6)

Readable margins

Consistent spacing

Code Blocks

Monospace font

Subtle background

Preserved indentation

Horizontal scrolling if needed

Tables

Clean borders

Proper spacing

Avoid overflow breaking layout

5.5 Writing Productivity Features

Word count displayed in toolbar

Reading time estimate (~200 wpm)

Estimated page count (~300 words/page)

Character count (toggle)

Autosave to localStorage (debounced, with "Autosaved" indicator)

Keyboard shortcuts:

Ctrl+S — manual save/autosave trigger

Ctrl+Shift+E — export PDF

Ctrl+Shift+V — toggle view mode

Ctrl+/ — focus editor

Escape — close modals/panels

5.6 View Modes

Split view (default): Editor | Preview, 50/50

Editor only mode

Preview only mode

Focus / Zen mode: hides toolbar, maximizes editor (toggle via F11 or toolbar button)

5.7 YAML Frontmatter

Detects --- delimited YAML block at start of document

Parses title, author, date fields

Uses title as PDF filename hint

Strips frontmatter from preview rendering

5.8 Error Handling

React Error Boundary wraps Preview component

Broken math shows styled error span, not stack trace

All errors are:

Human-readable

Clear

Non-technical

Example:

Instead of: KaTeX parsing error

Use: There is a formatting issue in your math expression near line 12.

6. Non-Goals (MVP)

The following are explicitly excluded from v1:

User accounts

Cloud sync

Collaboration

Multi-document management

Plugin system

Theme marketplace

DOCX export

Database integration

Backend services

Mermaid diagrams (deferred to v0.2)

Variable font selector (deferred to v0.2)

Version history (deferred to v1.0)

7. Functional Requirements
ID	Requirement
F1	User can type Markdown with syntax highlighting
F2	Preview updates automatically (debounced)
F3	Preview matches PDF layout
F4	Export generates stable PDF via window.print()
F5	No raw Markdown appears in final PDF
F6	Works fully client-side (no backend required)
F7	Content autosaves to localStorage
F8	Word count + reading time displayed in toolbar
F9	Keyboard shortcuts for common actions
F10	YAML frontmatter parsed and stripped from preview
F11	Scroll sync between editor and preview
F12	Error boundary prevents white-screen crashes
8. Non-Functional Requirements
Category	Requirement
Performance	Preview update < 300ms
Stability	No layout shift during export
Determinism	Same content → identical PDF
Offline	Should work without internet (PWA stretch goal)
Compatibility	Modern Chromium-based browsers
Autosave	Debounced to localStorage, restores on page load
9. Rendering Architecture Requirement

The rendering pipeline must be:

Markdown
↓
YAML strip + Math pre-process
↓
HTML (via markdown-it)
↓
Styled HTML (CSS + KaTeX + Prism.js)
↓
Preview DOM
↓
Browser Print → PDF

The same HTML and CSS must power both preview and print.

10. Layout Requirements
Default Layout

Split screen:

Left: Editor (CodeMirror 6)

Right: Preview

Responsive behavior:

Stack vertically on small screens (<768px)

Focus/Zen mode: full-screen editor, toolbar hidden

11. Error Handling

Errors must be:

Human-readable

Clear

Non-technical

Example:

Instead of:

KaTeX parsing error

Use:

There is a formatting issue in your math expression near line 12.

12. Definition of Done (MVP)

The application is complete when:

I can type Markdown with syntax highlighting

I see formatted live preview

I click export → PDF matches preview

Word count and reading time are visible

Content autosaves to localStorage

Keyboard shortcuts work

YAML frontmatter is parsed

Scroll sync works between panels

It works without backend

No major rendering inconsistencies

13. Future Expansion Path
Phase 2 (v0.2)

Mermaid diagram support

Variable font selector

Drag & drop image insertion

Clipboard paste → Markdown (via Turndown)

Visual page break indicators

Markdown cheatsheet panel

Multiple style presets

Table of contents

Page numbers

Cover page option

Dark/Light theme toggle

PWA support (if not completed in MVP)

Phase 3 (v1.0+)

Version history (IndexedDB)

Integration into exam prep system

Export profiles

Template system

Backend-driven content generation

SaaS version

File System Access API (open .md files from disk)

14. Version Strategy

v0.1 → Functional Web Prototype (MVP with all core features)

v0.2 → Enhanced Web App (diagrams, images, font selection)

v1.0 → Stable Platform (version history, templates, integrations)

v2.0 → Integrated Rendering Engine for Other Platforms

15. Strategic Positioning

This project is designed as:

A reusable Markdown-to-PDF rendering core that can power future educational and productivity tools.