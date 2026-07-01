# scintilla — Test any idea

**Scintilla** (formerly "Hunch") is a tool for practitioners and design-thinking
students to work through *The Experimentation Field Book*'s five-step process
before they build anything. Concepts are fully your own — create, rename,
and delete them, with every box in every step editable in place, and
confirming a test in Step 3 logs it straight into the Tests tracker. Plus a
**Systems mapping** workspace (a real, editable Support Map, a causal-loop
Feedback Loops canvas, a 5Rs System Diagnostic library, and a Systems
Archetypes reference gallery) for understanding the system an idea lives in.

- **[`app/`](app/)** — the product: portfolio dashboard (2 layout variants),
  the guided 5-step workflow (storyboard frames accept image/PDF uploads), a
  Tests tracker (individually deletable, or clear all), Progress timeline, and
  **Systems maps**. A "?" help button next to every page title explains what
  that screen is for. React + TypeScript + Vite, state autosaves to
  `localStorage`. No collaboration/team features — this is a single-user tool.
- **[`guide/`](guide/)** — *"How the Scintilla app works"*, a Positron-style
  docs site covering every screen, including the systems mapping tools.

## Live

- App: https://scintilla-dashboard.netlify.app/
- Guide: https://scintilla-guide.netlify.app/

Each links to the other (sidebar "Guide" link in the app, "Open app" in the
guide's navbar).

## Running

```bash
cd app && npm install && npm run dev      # http://localhost:5173
cd ../guide && python3 -m http.server 4321 # http://localhost:4321
```

## Exporting to PDF & PNG

Every screen has an **Export PDF** button in the top bar (calls the browser's
print dialog — choose "Save as PDF"). The Guided Workflow gets a dedicated
workbook layout: a cover page followed by all five steps, each starting on
its own page, showing whatever's actually been filled in. Other screens print
their current on-screen state with app chrome (sidebar, top bar, nav) hidden
and grids reflowed to fit a portrait page.

The System Support Map, Feedback Loops, 5Rs Diagnostic, and the Concepts
screen's Value/Effort Matrix each have their own **Pop out** button for a
larger, standalone window — and that window offers **Export PNG** (a
rasterized image via `html-to-image`) alongside Export PDF.

## Sources

Scintilla adapts three published frameworks — full credit belongs to the
original authors and organizations:

- **[The Experimentation Field Book: A Step-by-Step Project Guide](https://cup.columbia.edu/book/the-experimentation-field-book/9780231214179/)**
  — Jeanne Liedtka, Elizabeth Chen, Natalie Foley & David Kester, Columbia
  Business School Publishing, 2024. Source of the five-step process, all
  fourteen numbered templates, and the four seeded case studies.
- **[Systems Support Mapping](https://rhntc.org/sites/default/files/resources/fpntc_sys_supp_2019-07_0.pdf)**
  — Family Planning National Training Center (FPNTC), 2019. Source of the
  System Support Map tool.
- **"The 5Rs Framework in the Program Cycle"** (Technical Note, Version 2.1)
  — USAID, October 2016. Source of the 5Rs System Diagnostic, whose guiding
  questions are drawn verbatim from the Note's Table 1.

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
