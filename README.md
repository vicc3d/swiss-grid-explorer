# Swiss Grid Explorer

Parametric grid generator for structural layout design, inspired by the Swiss / International Typographic Style tradition of Müller-Brockmann, Gerstner, Vignelli, and Tschichold.

Available as a **web app**, an **Adobe Illustrator script**, and an **Affinity script** — same tool, three environments.

**[→ Open web app](https://3dvic.com/apps/swiss-grid-explorer)** · **[Article & context](https://3dvic.com/work/swiss-grid-explorer)**

---

## Platforms

| Platform | File | Requires |
|---|---|---|
| Web | `index.html` | Any browser — no install |
| Adobe Illustrator | `scripts/illustrator/swiss_grid_explorer.jsx` | Illustrator CC or later |
| Affinity (English) | `scripts/affinity/swiss_grid_generator_en.js` | Affinity (April 2026+) with MCP |
| Affinity (Español) | `scripts/affinity/swiss_grid_generator_es.js` | Affinity (April 2026+) with MCP |

**Current versions:** Web app `v1.2` · Illustrator `v1.2` · Affinity `v1.2` · Harmonic Scale snap (Affinity) `v1.0`

---

## Web App

Open `index.html` directly in any browser. No dependencies, no build step, no server needed.

**Features:**
- Live SVG preview that updates as you adjust parameters
- 13 document formats (A0–A5, Letter, Legal, Poster, Square, Web 1440/1920, Mobile, and more)
- 5 unit systems: mm, cm, in, pt, px — switching units preserves the document's physical size
- Orientation toggle (swap width/height)
- 6 iconic historical presets (see below)
- Save, apply, and delete your own custom layouts (stored locally in the browser)
- Editable Module W / Module H — type a target module size and the margin solves for it
- **Harmonic mode:** lock margin, gutter and an optional baseline grid to a single base value and a master ratio (Phi, √2, 3:2, 4:3, 5:4, 2:1, or a custom value) — a modular scale for the grid itself
- **Harmonic Scale calculator:** generate a reference scale (font size, stroke weight, spacing) in the same ratio, with one-click copy — pairs with the companion Affinity script below
- Export as SVG with named layer groups — compatible with Illustrator, Affinity, and Inkscape
- Import / export settings as JSON
- Bilingual interface (ES / EN)

---

## Adobe Illustrator Script

### Install

Copy `scripts/illustrator/swiss_grid_explorer.jsx` to your Illustrator Scripts folder:

```
# macOS
/Applications/Adobe Illustrator [version]/Presets/en_US/Scripts/

# Windows
C:\Program Files\Adobe\Adobe Illustrator [version]\Presets\en_US\Scripts\
```

Restart Illustrator, then: **File → Scripts → swiss_grid_explorer**

**Features:**
- Parametric dialog with live canvas preview and zoom controls
- Generates vector rectangles on a locked `Swiss Grid` layer
- Generates native magnetic guides on a locked `Guides` layer
- Reuses existing layers on re-run (no duplicates)
- Import / export JSON settings
- Bilingual (ES / EN)
- Compatible with both CMYK and RGB documents

---

## Affinity Script

Two versions available — same functionality, different interface language.

### Install

1. Open Affinity (Designer, Publisher, or Photo — April 2026 or later)
2. Enable MCP: **Settings → General → AI / MCP**
3. In the Scripts panel (**Window → General → Scripts**), create at least one category
4. Ask your AI assistant (Claude) to push the script via the MCP bridge:
   - English version: `swiss_grid_generator_en.js`
   - Spanish version: `swiss_grid_generator_es.js`

**Features:**
- Native Affinity dialog with live guide preview
- Auto-detects document dimensions and DPI
- Generates native guides directly on the document (no layers or vector objects)
- 6 iconic presets that adapt proportionally to any page size
- **Harmonic mode (v1.2):** lock margin and gutter — and the baseline grid, if enabled — to a base value and a master ratio (Phi, √2, 3:2, 4:3, 5:4, or 2:1)
- Single undo step for the entire grid (`CompoundCommandBuilder`)
- Optional baseline grid

> **Master Spread note:** the Affinity SDK cannot switch to a Master Spread programmatically. To apply guides to a master, switch to that tab manually before running the script.

### Companion script: Harmonic Scale — Snap Font Size

Select text (or a text frame) and run `harmonic_scale_snap_en.js` / `harmonic_scale_snap_es.js`. It reads the current font size, computes the nearest value in a harmonic scale (base × ratio^n — Phi, √2, 3:2, 4:3, 5:4, octave, or a custom ratio typed in), and snaps the selection to it.

This does **not** create a named Text Style — the Affinity SDK has no API to register one in the Paragraph/Character Studio panels, only to apply an existing one by name. Snapping the raw font size directly is the closest equivalent achievable from a script. Same install steps as above.

---

## Iconic Presets

All presets use ratios proportional to the document's minimum dimension, preserving their original character on any page size.

| Preset | Grid | Margin | Gutter | Reference |
|---|---|---|---|---|
| Brockmann | 8 × 8 | 5.7% | 1.9% | *Grid Systems in Graphic Design*, 1981 |
| Gerstner | 6 × 6 | 4.8% | 2.4% | *Designing Programmes*, 1964 |
| Vignelli | 3 × 4 | 8.6% | 2.9% | NPS Unigrid, 1977 (spirit, not literal) |
| Tschichold | 2 × 3 | 11.9% | 3.8% | *Die neue Typographie*, 1928 |
| Digital 12 | 12 × 1 | 6.7% | 2.2% | Bootstrap / Foundation / 960gs |
| Slides | 4 × 3 | 8.3% | 3.3% | Widescreen presentation grid (16:9) |

---

## SVG Output

The exported SVG uses named `<g>` groups for cross-app compatibility:

```xml
<svg width="210mm" height="297mm" viewBox="0 0 210 297">
  <g id="document" inkscape:groupmode="layer">…</g>
  <g id="margin"   inkscape:groupmode="layer">…</g>
  <g id="grid"     inkscape:groupmode="layer">…</g>
  <g id="guides"   inkscape:groupmode="layer">…</g>
</svg>
```

- **Illustrator** — reads `id` as group names
- **Affinity** — reads `id` as layer names on import
- **Inkscape** — reads `inkscape:groupmode="layer"` as real layers
- **Figma / Sketch** — imports as named groups

---

## Repository Structure

```
swiss-grid-explorer/
├── index.html                                    ← Web app (v1.2)
├── README.md
├── LICENSE
└── scripts/
    ├── illustrator/
    │   └── swiss_grid_explorer.jsx               ← Illustrator script (v1.2)
    └── affinity/
        ├── swiss_grid_generator_en.js            ← Affinity script — English (v1.2)
        ├── swiss_grid_generator_es.js            ← Affinity script — Español (v1.2)
        ├── harmonic_scale_snap_en.js             ← Companion: snap font size — English (v1.0)
        └── harmonic_scale_snap_es.js             ← Companion: snap font size — Español (v1.0)
```

---

## Credits

**Concept, UX/UI & Design** — [Victor Crespo](https://3dvic.com)

Released under the [MIT License](LICENSE).
