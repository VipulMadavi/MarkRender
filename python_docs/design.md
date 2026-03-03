# Design System: Calm Night (Desktop Edition)

## 1. Visual Identity

The "Calm Night" aesthetic is designed to reduce eye strain during long writing sessions. It uses deep, desaturated purples from the abyss, contrasted with soft neon highlights.

## 2. Color Palette

| Token               | Value     | Role                                   |
| :------------------ | :-------- | :------------------------------------- |
| **Abyss Purple**    | `#1A0A2E` | Main Background (Global)               |
| **Midnight Violet** | `#2D124D` | Secondary Background (Sidebar/Toolbar) |
| **Neon Orchid**     | `#D48BFF` | Primary Accent / Selection             |
| **Soft Rose**       | `#F5D5E0` | Input Text / Headings                  |
| **Stardust Gray**   | `#A99BBC` | Muted Text / Placeholders              |
| **Void Stroke**     | `#3D2E5A` | Borders and Dividers                   |

## 3. Typography

- **Editor**: `JetBrains Mono` (14pt). Ligatures enabled. Fixed-width for structural clarity.
- **Preview**: `Inter` or `Merriweather` (for a serif reading experience). Line height 1.6 for readability.
- **UI**: `Inter` (Medium, 10pt) for buttons and labels.

## 4. Components

- **Toolbar**: Translucent (Blur) background, floating above the split-view.
- **Split-View**: 1px vertical divider with a slight glow.
- **Status Bar**: Small, discrete info (Word count, Line number) pinned to the bottom right.
- **Buttons**: Rounded (radius 8px), glowing on hover.

## 5. Layout (The "Split Control")

- **Left Panel**: Writing area (Dark, minimal).
- **Right Panel**: Reading area (Paper-white or themed-dark, mimics A4 page).
- **The Page**: The preview should simulate an A4 page within the Abyss, floating with a subtle shadow.

## 6. Animations

- **Panel Slide**: Subtle 150ms ease-in-out when toggling the sidebar or editor.
- **Micro-interactions**: Subtle color shifts on buttons when hovered.
- **Cursor**: Non-blinking block or smooth-blinking line.
