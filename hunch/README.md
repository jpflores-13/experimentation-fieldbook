# Hunch — Test any idea

**Hunch** is a team tool for testing any idea before you build it. It turns the
five-step experimentation process (+ its templates) into a working product and
adds a **Systems mapping** workspace for understanding the system an idea
lives in.

- **[`app/`](app/)** — the Hunch product: portfolio dashboard (3 layout
  variants), the guided 5-step workflow, a Tests tracker, Progress timeline,
  Team & comments, and **Systems maps** (Support Map, Feedback Loops,
  Archetypes). React + TypeScript + Vite, state autosaves to `localStorage`.
- **[`guide/`](guide/)** — *"How the Hunch app works"*, a Positron-style docs
  site covering every screen, including the systems mapping tools.

## Running

```bash
cd app && npm install && npm run dev      # http://localhost:5173
cd ../guide && python3 -m http.server 4321 # http://localhost:4321
```

## A note on originality

Demo content currently reuses the book's public case studies (Nike, PMI, SWR,
Whiteriver) as sample data. For a shipped product, replace these with your
own or fictional concepts, and don't reproduce the book's verbatim template
wording or illustrations.

## Design source

Built from a high-fidelity Claude Design handoff (`Hunch App.dc.html` /
`Hunch Guide.dc.html`): exact colors, type (Work Sans + Source Serif 4 +
JetBrains Mono), spacing, copy, and interaction rules, recreated faithfully
rather than shipping the design HTML directly. Shares its design language
with the sibling [Field Book](../app/) product one level up in this repo.
