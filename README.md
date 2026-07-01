# Field Book — Experimentation OS

A team-based web app that turns *The Experimentation Field Book*'s five-step
process and fourteen templates into a working product, plus a documentation
site that explains how it's built.

This repo has two parts:

1. **[`app/`](app/)** — the Field Book product: a portfolio dashboard (three
   layout variants) and a guided five-step workflow (Frame → Evidence →
   Select test → Prototype → Execute), seeded with the book's four case
   studies (Easykicks, Welcome Host, Career Navigator, ER Fast-Track).
   React + TypeScript + Vite, no backend — state autosaves to
   `localStorage`.
2. **[`guide/`](guide/)** — a Positron/Quarto-style docs site, *"How the
   Field Book app works,"* that walks through every screen and component.
   Static HTML/CSS/JS with sticky nav, scroll-spy, and a component
   reference.

## Running the app

```bash
cd app
npm install
npm run dev       # http://localhost:5173
```

Other scripts: `npm run build` (typecheck + production build),
`npm run preview` (serve the build).

## Viewing the guide

The guide has no build step — open it directly or serve it statically:

```bash
cd guide
python3 -m http.server 4321   # http://localhost:4321
```

## Design source

Both were built from a high-fidelity Claude Design handoff
(`Experimentation Fieldbook Dashboard.zip`): exact colors, type (Work Sans +
Source Serif 4 + JetBrains Mono), spacing, copy, and interaction rules,
recreated faithfully in each target stack rather than shipping the design
HTML directly. Shared palette: ink `#2c2e35` · primary blue `#008ecd` · teal
`#2ea38e` · slate `#5b6b7a` · app bg `#eef1f4`.
