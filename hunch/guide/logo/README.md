# Scintilla — Logo assets

**Scintilla** (Latin: *a spark*). The mark is a spark bursting from a bright
core, with two embers landing in the brand teal.

## Files
| File | Use |
|---|---|
| `scintilla-mark.svg` | Primary mark, full color, transparent bg (64×64 viewBox). Use on white/light. |
| `scintilla-mark-white.svg` | All-white mark (pale-mint embers) for dark or blue backgrounds / photos. |
| `scintilla-icon.svg` | App icon — white mark on a blue rounded tile (96×96). Favicon, app launcher, avatar. |
| `scintilla-lockup.svg` | Horizontal lockup: mark + "scintilla" wordmark. |

The mark is pure vector (no font dependency). The **lockup** sets the wordmark
in **Work Sans 800** via `<text>`; if Work Sans isn't installed it falls back —
so in product code, prefer rendering the wordmark in live text (Work Sans,
weight 800, letter-spacing ≈ -0.03em, lowercase) next to `scintilla-mark.svg`
rather than relying on the baked text.

## Colors
- Signal blue `#008ecd` (primary / rays / core)
- Idea teal `#2ea38e` (embers, accents) — pale mint `#bff0e6` on dark
- Ink `#2c2e35` (wordmark)

## Usage notes
- **Clear space:** keep at least the height of the core dot (~1/8 of the mark)
  clear on all sides.
- **Minimum size:** mark reads down to ~20 px; below that use `scintilla-icon.svg`
  (the tile keeps contrast).
- **Favicon:** export `scintilla-icon.svg` to 32×32 and 16×16 PNG.
- **Don't:** recolor the rays arbitrarily, add gradients/shadows, rotate, or
  crowd it. Keep the asymmetric ray layout as drawn — that's the "spark" energy.

## Where it goes in the app / guide
- App sidebar brand tile and the "New concept" contexts → `scintilla-icon.svg`.
- Docs-site navbar → white mark on the charcoal bar (`scintilla-mark-white.svg`).
- Browser favicon / PWA icon → `scintilla-icon.svg`.
