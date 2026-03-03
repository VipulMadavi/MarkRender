📘 Technical Stack Document
Project: Markdown-to-PDF Web Application
Version: 1.1 (Updated with MVP Feature Additions)
Status: MVP Approved
1. Technical Philosophy

The architecture is designed around one core principle:

The preview and the exported PDF must use the exact same rendering engine and styling.

The stack prioritizes:

Client-side rendering (no backend required)

Reusability for future systems

Simplicity for MVP completion

Clean separation between rendering logic and UI

Browser-native PDF generation

2. High-Level Architecture
Rendering Pipeline
Markdown Input
   ↓
YAML Frontmatter Strip (js-yaml)
   ↓
Math Pre-processing (KaTeX)
   ↓
Markdown Parser (markdown-it)
   ↓
Code Highlight (Prism.js)
   ↓
Styled DOM (CSS)
   ↓
Preview Pane
   ↓
Browser Print Engine (window.print)
   ↓
PDF Output

The browser's native print engine is responsible for generating the final PDF.

The same HTML and CSS used in preview are used for printing.

3. Application Type
Single-Page Application (SPA)

Built using React

Runs entirely in browser

No backend required for MVP

Future backend integration possible

4. Frontend Framework
Selected Framework: React
Rationale

Component-based architecture

Easy integration into future exam-prep systems

Mature ecosystem

Large community support

Reusable rendering components

5. Build Tool
Selected Tool: Vite
Rationale

Extremely fast dev server

Minimal configuration

Optimized production builds

Lightweight setup

6. Editor Component
Selected Editor: CodeMirror 6
Rationale

Lightweight and modern

Markdown syntax highlighting built-in

Line numbers and current-line highlighting

Better UX than plain textarea — feels premium

Highly extensible for future features (vim mode, autocomplete)

Good performance with large documents

Required Packages

@codemirror/view

@codemirror/state

@codemirror/lang-markdown

@codemirror/theme-one-dark (or custom Calm Night theme)

Responsibilities

Markdown editing with syntax highlighting

Cursor and selection handling

Change event propagation to preview engine (debounced)

Tab handling and keyboard shortcuts

7. Markdown Parsing Engine
Selected Library: markdown-it
Responsibilities

Parse Markdown → HTML

Support:

Headings

Lists

Tables

Code blocks

Blockquotes

Inline formatting

Rationale

Fast

Extensible

Clean HTML output

Easy plugin support

8. YAML Frontmatter Processing
Selected Library: js-yaml
Responsibilities

Detect and strip --- delimited YAML blocks

Parse title, author, date fields

Provide parsed metadata for:

PDF filename hint (document.title = title)

Future header injection

Rationale

Lightweight (~15KB)

Standard YAML parsing

No complex dependencies

9. Math Rendering
Selected Library: KaTeX
Responsibilities

Render inline math ($...$)

Render block math ($$...$$)

Rationale

Fast rendering

Lightweight

Works entirely client-side

No LaTeX installation required

Error handling: wrap broken math in .math-error span instead of throwing

10. Code Syntax Highlighting
MVP Option: Prism.js
Future Upgrade: Shiki
Rationale for MVP

Prism is lightweight

Easy to integrate

Works fully client-side

Synchronous API — simpler than Shiki's async init

11. Styling System
Technology: CSS
Structure

Base typography styles (base.css)

Preview styles (preview.css)

Print styles (print.css — @media print)

Editor styles (editor.css)

Requirements

Print CSS must define:

Page size (A4 default, configurable via dynamic @page injection)

Margins

Page breaks

Background printing

Code block wrapping rules

Table behavior

The preview layout must visually simulate print layout as closely as possible.

12. PDF Export Method
Method: window.print()
How It Works

User clicks "Export to PDF"

App sets document.title to YAML title or filename hint

App injects dynamic @page CSS for selected page size

App triggers browser print dialog

User selects "Save as PDF"

Configuration Requirements

Print-specific CSS must:

Hide editor panel

Show only preview panel

Adjust margins for PDF

Preserve background colors

Print Settings Panel (UI)

Page size: A4 / Letter / A3

Margin presets: Normal / Narrow / Wide

PDF title: from YAML or user input

Rationale

Zero external dependency

Fully browser-native

Same engine as preview

Maximum fidelity

13. State Management
MVP Approach

React local state

No Redux or global store

Single-document in-memory model

localStorage autosave (debounced writes, restore on load)

Future integration can replace this with global state or backend data sources.

14. Persistence Layer
Technology: localStorage
Responsibilities

Autosave current document content (debounced 1-2s after last edit)

Restore content on page load

Store user preferences (view mode, page size selection)

Show "Autosaved" indicator in toolbar

15. Offline Capability

The application should:

Work without backend

Bundle all libraries locally

Avoid CDN dependencies (self-host Google Fonts)

Stretch goal: PWA via vite-plugin-pwa

PWA Dependencies (Stretch)

vite-plugin-pwa — handles service worker, cache strategy, manifest

KaTeX fonts must be copied to public/ for offline math rendering

16. Performance Requirements
Metric	Target
Initial load	< 2 seconds
Preview update	< 300ms
PDF export	Stable via print engine
Document size	50+ pages supported

Debounced rendering (250ms) must be implemented to prevent excessive re-rendering.

17. Security Considerations

Since rendering user-generated Markdown:

Avoid dangerouslySetInnerHTML without sanitization

Use trusted markdown-it output (html: false)

Consider optional HTML sanitization (e.g., DOMPurify)

For MVP personal use, strict sanitization may be relaxed.

18. Development Dependencies
Core Dependencies

react

react-dom

vite

@codemirror/view

@codemirror/state

@codemirror/lang-markdown

@codemirror/theme-one-dark

markdown-it

katex

prismjs

js-yaml

Dev Dependencies

eslint

prettier

vite-plugin-pwa (stretch)

19. Deployment Strategy
MVP Deployment Options

Local development server

Static build via vite build

Deploy to:

Vercel

Netlify

GitHub Pages

Self-hosted

Since no backend is required, deployment is trivial.

20. Future Integration Strategy

The rendering logic must be:

Modular

Extractable into a reusable component

Independent of UI layout

This allows future integration into:

Exam prep builder

Admin dashboards

SaaS platforms

Desktop wrapper (Electron)

PWA installation

21. Explicitly Rejected (For MVP)

Electron (can wrap later)

Backend server

Database

Pandoc

LaTeX pipeline

Multi-format export

Mermaid.js (deferred to v0.2 — large bundle, async complexity)

Shiki (deferred — Prism.js sufficient for MVP)

22. Final Stack Summary
Layer	Technology
Framework	React
Build Tool	Vite
Editor	CodeMirror 6
Markdown Parser	markdown-it
YAML Parser	js-yaml
Math Engine	KaTeX
Syntax Highlight	Prism.js
Styling	Custom CSS (Calm Night theme)
PDF Export	Browser print engine (window.print)
Persistence	localStorage
Offline	PWA via vite-plugin-pwa (stretch)
23. Technical Decision Statement

The selected stack ensures:

Fast MVP development

Clean rendering fidelity

Future reusability

Easy deployment

Platform independence

This architecture allows the application to evolve into a rendering engine that can power larger educational systems in the future.