# scintilla — Test any idea

**Scintilla** (formerly "Hunch") is a tool for practitioners and design-thinking
students to work through *The Experimentation Field Book*'s five-step process
before they build anything — plus a **Systems mapping** workspace (a real,
editable Support Map and causal-loop Feedback Loops canvas, and a Systems
Archetypes reference gallery) for understanding the system an idea lives in.

- **[`app/`](app/)** — the product: portfolio dashboard (3 layout variants),
  the guided 5-step workflow, a Tests tracker, Progress timeline, and
  **Systems maps**. React + TypeScript + Vite, state autosaves to
  `localStorage`. No collaboration/team features — this is a single-user tool.
- **[`guide/`](guide/)** — *"How the Scintilla app works"*, a Positron-style
  docs site covering every screen, including the systems mapping tools.

## Running

```bash
cd app && npm install && npm run dev      # http://localhost:5173
cd ../guide && python3 -m http.server 4321 # http://localhost:4321
```

## Exporting to PDF

Every screen has an **Export PDF** button in the top bar (calls the browser's
print dialog — choose "Save as PDF"). The Guided Workflow gets a dedicated
workbook layout: a cover page followed by all five steps, each starting on
its own page, showing whatever's actually been filled in. Other screens print
their current on-screen state with app chrome (sidebar, top bar, nav) hidden
and grids reflowed to fit a portrait page.

## A note on originality

Demo content currently reuses the book's public case studies (Nike, PMI, SWR,
Whiteriver) as sample data. For a shipped product, replace these with your
own or fictional concepts, and don't reproduce the book's verbatim template
wording or illustrations.

## Brand

Logo assets and usage rules are in [`BRAND.md`](BRAND.md) (mark, wordmark,
color tokens, clear space, minimum sizes).

## Design source

Built from a high-fidelity Claude Design handoff (`Hunch App.dc.html` /
`Hunch Guide.dc.html` — pre-rebrand filenames): exact colors, type (Work Sans
+ Source Serif 4 + JetBrains Mono), spacing, copy, and interaction rules,
recreated faithfully rather than shipping the design HTML directly. Shares
its design language with the sibling [Field Book](../app/) product one level
up in this repo.
