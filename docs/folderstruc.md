📁 Project Folder Structure Document
Project: Markdown-to-PDF Web Application (MarkRender)
Version: 1.1 (Updated for Web-First Architecture)
1. Project Root Structure
MarkRender/
│
├── package.json
├── vite.config.js
├── index.html
├── README.md
├── Phase Plan.md
│
├── public/
│   └── fonts/          ← Self-hosted Inter, JetBrains Mono, KaTeX fonts
│
├── docs/
│   ├── prd.md
│   ├── techstack.md
│   ├── design.md
│   └── folderstruc.md
│
├── .tracker/
│   ├── status.md
│   ├── changelog.md
│   ├── decisions.md
│   └── context.md
│
├── src/
│   ├── components/
│   ├── markdown/
│   ├── hooks/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
└── dist/ (generated after build)
2. Folder Responsibilities
📦 Root Files
package.json

Dependencies

Scripts (dev, build, preview)

vite.config.js

Vite configuration

React plugin setup

PWA plugin (stretch)

Build settings (base: './')

index.html

Entry HTML file

Meta tags, font links

README.md

Setup instructions

Development guide

Build steps

Phase Plan.md

9-phase build plan with verification checklists

3. /public Directory

Static assets that are copied directly to build output.

public/
└── fonts/
    ├── inter/          ← Inter font files (self-hosted)
    ├── jetbrains-mono/  ← JetBrains Mono font files
    └── katex/           ← KaTeX math fonts

4. /docs Directory

All project documentation.

docs/
├── prd.md            ← Product requirements
├── techstack.md      ← Technology stack decisions
├── design.md         ← Design system (Calm Night theme)
└── folderstruc.md    ← This file

5. /.tracker Directory

Cross-conversation persistent tracking files.

.tracker/
├── status.md         ← Current project state, phase progress
├── changelog.md      ← Log of all changes across conversations
├── decisions.md      ← Design/architecture decision log
└── context.md        ← Quick-start context for new conversations

Update these files at the end of every work session.

6. /src Directory

All application logic lives here.

src/
├── components/
├── markdown/
├── hooks/
├── styles/
├── utils/
├── App.jsx
└── main.jsx

7. /src/components (React Components)

components/
├── Editor.jsx
├── Preview.jsx
├── Toolbar.jsx
├── ErrorBoundary.jsx
└── PrintSettings.jsx

Editor.jsx

CodeMirror 6 setup with Calm Night theme

Markdown syntax highlighting

Emits debounced onChange

Preview.jsx

Renders parsed HTML

Applies preview.css styling

Wrapped in ErrorBoundary

Scroll sync with editor

Toolbar.jsx

Export PDF button

Toggle view mode button

Focus/Zen mode button

Word count + reading time + page estimate display

Autosave indicator

ErrorBoundary.jsx

React Error Boundary component

Catches render errors in Preview

Shows friendly fallback message

PrintSettings.jsx

Page size selector (A4 / Letter / A3)

Margin presets (Normal / Narrow / Wide)

PDF title input

8. /src/markdown (Rendering Pipeline)

Keeps rendering logic separate from UI.

markdown/
├── parser.js
├── math.js
├── syntaxHighlight.js
└── frontmatter.js

parser.js

markdown-it setup

Plugins and fence override

Converts markdown → HTML

Exposes renderMarkdown(text) → htmlString

math.js

KaTeX integration

Pre-processes $...$ and $$...$$ before parsing

Error handling for broken math

syntaxHighlight.js

Prism.js integration

Fence renderer override

frontmatter.js

Detects --- YAML blocks

Parses via js-yaml

Returns { metadata, content } — stripped content for rendering

9. /src/hooks (Custom React Hooks)

hooks/
├── useAutosave.js
├── useKeyboardShortcuts.js
└── useScrollSync.js

useAutosave.js

Debounced write to localStorage

Restore on mount

Trigger "Autosaved" indicator

useKeyboardShortcuts.js

Registers global keyboard shortcuts

Ctrl+S, Ctrl+Shift+E, Ctrl+Shift+V, Ctrl+/, Escape, F11

Cleanup on unmount

useScrollSync.js

Sync scroll position between editor and preview panels

Proportional scroll ratio mapping

Debounced to avoid feedback loops

10. /src/styles (CSS)

Keeps styling clean and modular.

styles/
├── base.css
├── editor.css
├── preview.css
└── print.css

base.css

CSS custom properties (color tokens, spacing tokens)

Font imports (self-hosted)

Global reset

Gradient background

editor.css

CodeMirror theme overrides (Calm Night)

Editor panel layout

Cursor and selection colors

preview.css

Preview panel styles

Document typography (headings, code, tables, blockquotes)

A4 page simulation (max-width, padding)

Math error styling

print.css

@media print rules

@page size and margins

Hide toolbar and editor

Code block wrapping

Table page-break behavior

White background, black text

Important:
Preview must visually match print CSS as closely as possible.

11. /src/utils (Utility Functions)

Small reusable helpers.

utils/
├── debounce.js
├── wordCount.js
└── storage.js

debounce.js

Used for:

Delayed preview rendering (250ms)

Delayed autosave (1-2s)

Preventing excessive re-renders

wordCount.js

Word count, reading time, character count, page estimate

Pure functions, no side effects

storage.js

localStorage get/set/clear helpers

JSON serialization

Key management

12. What This Structure Avoids (Intentionally)

No Redux

No global state library

No plugin system

No themes folder

No multi-document management

No unnecessary abstraction

No Electron/main/preload folders (web-first)

Keep it simple for MVP.

13. Build Output

After build:

dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── fonts/
└── (sw.js if PWA enabled)

Generated automatically via vite build.

Deployable to any static host (Vercel, Netlify, GitHub Pages).

14. Architectural Principles Reflected in Structure

Clear separation:

Rendering logic (markdown/) → independent of UI

UI components (components/) → independent of rendering

Styling (styles/) → centralized, modular

Hooks (hooks/) → reusable state logic

Utils (utils/) → pure functions

Minimal file depth

Easy to navigate

Every file under 200 lines with single responsibility

15. Development Simplicity Rule

If a file:

Is under 200 lines

Has a single responsibility

Is easy to find

Then the structure is correct.

If you feel lost navigating folders — it's too complex.