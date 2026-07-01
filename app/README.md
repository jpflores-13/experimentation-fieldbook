# Field Book — app

The Experimentation Field Book product: a portfolio dashboard and a guided
five-step workflow, built with React + TypeScript + Vite.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run preview  # serve the production build
```

## Structure

- `src/screens/` — the six top-level screens (Dashboard, Concepts, Workspace,
  Tests, Progress, Team).
- `src/components/` — shared chrome (Sidebar, TopBar, Layout) and small UI
  primitives (Card, Avatar, Chip, SegmentBar, ThinBar).
- `src/state/AppState.tsx` — the app's entire client state (current screen,
  dashboard variant, active workflow step, Test Decision Flow answers,
  sliders) plus the `localStorage` autosave (`fb_app_state_v1`) and the
  Test Decision Flow recommendation logic.
- `src/data/seed.ts` — typed seed data for the four book case studies
  (Easykicks, Welcome Host, Career Navigator, ER Fast-Track) plus two
  additional concepts, tests, members, comments, and activity — swap for
  real records without touching the UI.
- `src/theme.css` — design tokens (colors, fonts, radii), responsive
  breakpoints, and hover/animation utility classes.

See the [docs guide](../guide/) for a full walkthrough of every screen.
