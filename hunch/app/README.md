# Scintilla — app

A tool for practitioners and design-thinking students to work through *The
Experimentation Field Book*'s five-step process, plus a Systems mapping
workspace. Built with React + TypeScript + Vite.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run preview  # serve the production build
```

## Structure

- `src/screens/` — Dashboard, Concepts, Workspace (guided workflow), Tests,
  Progress, Systems (Support Map / Feedback Loops / Archetypes).
- `src/components/` — shared chrome (Sidebar, TopBar, Layout) and UI
  primitives (Card, Chip, SegmentBar, ThinBar).
- `src/state/AppState.tsx` — all client state (screen, dashboard variant,
  workflow step, Test Decision Flow answers, sliders, support-map notes,
  loop graphs), the `localStorage` autosave (`fb_app_state_v1`), and the Test
  Decision Flow recommendation logic.
- `src/state/loopAnalysis.ts` — cycle detection for the Feedback Loops canvas
  (finds closed loops, classifies each Reinforcing/Balancing by counting
  negative links, even/odd).
- `src/data/seed.ts`, `src/data/systemsSeed.ts`, `src/data/archetypes.ts` —
  seed data for concepts/tests/tasks, the default support map + loop graph,
  and the 8 systems archetypes.
- `src/theme.css` — design tokens, responsive breakpoints, and the
  `@media print` rules that power PDF export (every screen has an Export PDF
  button in the top bar; the Guided Workflow gets a dedicated cover page +
  five-step print layout).

See the [docs guide](../guide/) for a full walkthrough of every screen, and
[`../BRAND.md`](../BRAND.md) for logo usage.
