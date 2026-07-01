# Experimentation Fieldbook — products

Two related products built from the same design system, each turning
*The Experimentation Field Book*'s five-step process into a working tool.

1. **[Field Book](app/) / [its guide](guide/)** — the original: a portfolio
   dashboard and guided five-step workflow, seeded with the book's four case
   studies (Easykicks, Welcome Host, Career Navigator, ER Fast-Track).
2. **[Scintilla](hunch/)** — the same five-step product for practitioners and
   design-thinking students (formerly "Hunch," still living in the `hunch/`
   folder), plus a **Systems mapping** workspace — a real, editable Support
   Map and Feedback Loops canvas, and a Systems Archetypes reference gallery.
   Every screen exports to PDF. See [`hunch/README.md`](hunch/README.md) and
   [`hunch/BRAND.md`](hunch/BRAND.md) for the brand system.

Each product is a self-contained React + TypeScript + Vite app (state
autosaves to `localStorage`, no backend) paired with a static Positron-style
docs site.

## Running

```bash
# Field Book
cd app && npm install && npm run dev        # http://localhost:5173
cd guide && python3 -m http.server 4321     # http://localhost:4321

# Scintilla
cd hunch/app && npm install && npm run dev  # http://localhost:5173
cd hunch/guide && python3 -m http.server 4321
```

## Design source

Exact colors, type
(Work Sans + Source Serif 4 + JetBrains Mono), spacing, copy, and interaction
rules, recreated faithfully in each target stack rather than shipping the
design HTML directly. Shared palette: ink `#2c2e35` · primary blue `#008ecd`
· teal `#2ea38e` · slate `#5b6b7a` · app bg `#eef1f4`.
