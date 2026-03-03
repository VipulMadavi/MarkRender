🎨 Design System Document
Project: Markdown-to-PDF Web Application
Version: 1.1 (Updated with MVP Feature Additions)
Design Philosophy: Calm Night Productivity
1. Design Vision

The application must feel:

Calm

Focused

Minimal

Premium but not flashy

Study-friendly

Distraction-free

The design language is inspired by:

Night sky themes

Soft gradients

Gentle glows

Clean typography

Spacious layouts

This is a writing tool, not a marketing website.

2. Core Design Principles

Minimal UI chrome

Clear content hierarchy

Strong typography focus

Soft but deep color contrast

Zero clutter

Consistent spacing rhythm

Print-friendly layout alignment

3. Color System
3.1 Primary Background Gradient

Main background:

background: linear-gradient(
  135deg,
  #210635 0%,
  #420D4B 50%,
  #7B337E 100%
);

Creates night-depth effect.

3.2 Surface Colors
Purpose	Color
Primary Background	#210635
Secondary Background	#420D4B
Accent Surface	#7B337E
Highlight Accent	#6667AB
Soft Highlight	#F5D5E0
Text Body	#EDEAF4
Success/Autosave	#4CAF50 (subtle green)
Error	#FF6B6B (soft red)
3.3 Usage Rules

Editor panel: dark plum (#210635)

Preview panel: slightly lighter (#420D4B)

Buttons: #6667AB

Hover state: lighter purple glow

Headings: soft blush (#F5D5E0)

Body text: #EDEAF4 (soft near-white)

Success indicators (autosave, word count): subtle green or dim text

Error spans (.math-error): soft red with border

Avoid pure white.

4. Typography System
4.1 Headings

Recommended fonts:

"Playfair Display" (elegant serif)
OR

"Inter" (clean modern sans)

MVP safe option:

Inter (Google Font — self-hosted for offline)

Heading Styling
h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #F5D5E0;
}

h2 {
  font-size: 1.6rem;
  font-weight: 500;
}
4.2 Body Text
body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: #EDEAF4;
}
4.3 Code Blocks
pre {
  background: rgba(255,255,255,0.05);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

Subtle glow effect:

box-shadow: 0 0 15px rgba(102,103,171,0.2);

4.4 Editor Font (CodeMirror)

font-family: 'JetBrains Mono', 'Fira Code', monospace;
font-size: 14px;
line-height: 1.5;

CodeMirror theme should inherit Calm Night colors:

Background: transparent (inherits panel bg)
Text: var(--text-body)
Active line: rgba(255,255,255,0.03)
Selection: rgba(102,103,171,0.3)
Cursor: var(--text-heading)

5. Layout System
5.1 App Layout

Split View (default):

---------------------------------------
| Toolbar                             |
---------------------------------------
| Editor        |      Preview        |
| (50%)         |      (50%)          |
---------------------------------------

Focus/Zen Mode:

---------------------------------------
|          Editor (100%)              |
|          (toolbar hidden)           |
---------------------------------------

Responsive:

Desktop → split

Mobile → stacked

5.2 Spacing Scale

Use consistent spacing:

Token	Value
XS	4px
S	8px
M	16px
L	24px
XL	32px

Never random margins.

6. Toolbar Design

Minimal horizontal bar.

Background:

rgba(0,0,0,0.2)
backdrop-filter: blur(10px);

Button Style:

background: #6667AB;
border-radius: 6px;
padding: 8px 16px;
transition: 0.2s ease;

Hover:

background: #7B337E;
box-shadow: 0 0 12px rgba(102,103,171,0.5);

6.1 Toolbar Layout

Left:
  MarkRender (logo/brand, non-interactive)

Center:
  Toggle View button
  Focus Mode button
  Export PDF button

Right:
  Word count · Reading time · ~Pages (dim text, small font)
  Autosave indicator ("Autosaved ✓" — fades in/out)

6.2 Autosave Indicator

Appears briefly when autosave fires

Style: dim green text, small font, fades after 2s

.autosave-indicator {
  color: rgba(76, 175, 80, 0.7);
  font-size: 0.75rem;
  transition: opacity 0.5s ease;
}

6.3 Word Count Display

Style: dim, non-distracting, right-aligned

.word-count {
  color: rgba(237, 234, 244, 0.4);
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

Shows: "1,243 words · 6 min · ~4 pages"

7. Editor Panel Design

Dark surface

No heavy borders

Subtle inner padding

CodeMirror inherits Calm Night theme

.editor-panel {
  background: var(--bg-primary);
  padding: var(--space-m);
  overflow-y: auto;
  height: calc(100vh - toolbar-height);
}

8. Preview Panel Design

Slightly lighter surface than editor

Soft padding

Clean reading width

.preview-panel {
  background: var(--bg-secondary);
  overflow-y: auto;
  height: calc(100vh - toolbar-height);
}

.preview-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-xl);
}

Avoid full-width text.

9. Error Display Design

Math errors:

.math-error {
  color: #FF6B6B;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.85rem;
}

Error boundary fallback:

Centered message in preview panel
"Something went wrong rendering the preview."
Subtle, not alarming

10. Print Design Alignment

When printing:

Remove gradient

Use white background

Use dark text

Preserve typography hierarchy

Keep spacing consistent

@media print {
  body {
    background: white;
    color: black;
  }
  .toolbar, .editor-panel { display: none; }
  .preview-panel { width: 100%; }
}

Preview must visually simulate print spacing.

11. Focus / Zen Mode Design

Toolbar hidden (slide up animation, 200ms)

Editor fills full width

Subtle ESC hint at top: "Press ESC or F11 to exit focus mode" — fades after 3s

No distracting elements visible

12. Visual Enhancements (Optional)

Subtle background noise pattern (very light).

Tiny star dots in background (very subtle opacity).

Do NOT overdo animation.

No floating particles.

No distracting motion.

13. What To Avoid (Anti-Vibe Rules)

❌ Random border radius values
❌ Multiple accent colors
❌ Neon glow overload
❌ Inconsistent padding
❌ Gradient inside content
❌ Fancy UI elements
❌ Overuse of shadows
❌ Bright success/error colors at full opacity

14. UI Tone

This app should feel like:

Notion at night

Calm Obsidian theme

Minimal academic writing tool

Not a SaaS landing page

15. Future Design Expansion

Later you can add:

Light theme toggle

Multiple preset themes

Typography presets (Academic / Modern / Compact)

Soft animation transitions

Font selector UI

But not in MVP.

16. Design Definition of Done

The design is correct when:

The UI feels calm

Nothing feels random

Colors are consistent

Spacing is predictable

Typography feels intentional

Word count and autosave indicators are unobtrusive

Focus mode feels truly distraction-free

It does NOT look hacked together