export interface GlyphSpec {
  c1Fill: string; c1Stroke: string;
  c2Fill: string; c2Stroke: string;
  topColor: 'blue' | 'teal';
  bottomColor: 'blue' | 'teal';
}

export interface Archetype {
  id: string;
  name: string;
  cardBadge: string;
  badge: string;
  summary: string;
  watch: string;
  pattern: string;
  leverage: string;
  glyph: GlyphSpec;
  // SVG polyline points (viewBox 0 0 240 90) sketching this archetype's actual
  // qualitative behavior-over-time shape — every archetype produces a
  // different curve, so this should not be a single shared shape.
  behaviorPoints: string;
}

const neutral = { fill: '#f4f8fb', stroke: '#cfd6dc' };
const blueTint = { fill: '#eef7fc', stroke: '#a9d4ef' };
const tealTint = { fill: '#eef6f3', stroke: '#a9dbcf' };

export const archetypes: Archetype[] = [
  {
    id: 'fixes', name: 'Fixes that Fail', cardBadge: 'B + R', badge: 'B + R',
    summary: 'A quick fix eases the symptom now but quietly makes the real problem worse later.',
    watch: 'A quick fix eases the symptom now but quietly makes the real problem worse later.',
    pattern: 'A problem symptom triggers a fix (a balancing loop) that works short-term — but sets off an unintended consequence (a reinforcing loop, often delayed) that feeds the symptom back stronger.',
    leverage: 'Resist the quick fix. Name the delayed side-effect out loud and redirect effort to the fundamental cause.',
    glyph: { c1Fill: neutral.fill, c1Stroke: neutral.stroke, c2Fill: neutral.fill, c2Stroke: neutral.stroke, topColor: 'blue', bottomColor: 'teal' },
    behaviorPoints: '18,58 55,38 90,30 125,50 160,68 195,72 225,74',
  },
  {
    id: 'burden', name: 'Shifting the Burden', cardBadge: 'B + B', badge: 'B + B',
    summary: 'A convenient fix keeps getting used, and the real solution atrophies.',
    watch: 'A convenient symptomatic fix keeps getting used, and the real solution atrophies.',
    pattern: 'Two balancing loops compete: a symptomatic fix and a fundamental one. Leaning on the quick fix creates a side-effect that erodes the ability to apply the fundamental solution — an addiction-like drift.',
    leverage: 'Invest in the fundamental solution even when the symptomatic one is tempting; reduce dependence on the quick fix.',
    glyph: { c1Fill: neutral.fill, c1Stroke: neutral.stroke, c2Fill: neutral.fill, c2Stroke: neutral.stroke, topColor: 'teal', bottomColor: 'teal' },
    behaviorPoints: '18,40 60,38 100,42 140,50 180,60 225,70',
  },
  {
    id: 'limits', name: 'Limits to Growth', cardBadge: 'R + B', badge: 'R + B',
    summary: 'Fast early growth mysteriously slows despite doing more of what worked.',
    watch: 'Fast early growth mysteriously slows or stalls despite doing more of what worked.',
    pattern: 'A reinforcing engine drives growth until it bumps into a limiting condition, which activates a balancing loop that caps the very growth that triggered it.',
    leverage: "Don't push harder on the engine. Find and relieve the constraint before it bites.",
    glyph: { c1Fill: blueTint.fill, c1Stroke: blueTint.stroke, c2Fill: tealTint.fill, c2Stroke: tealTint.stroke, topColor: 'blue', bottomColor: 'teal' },
    behaviorPoints: '18,70 55,50 90,32 125,22 160,20 195,19 225,19',
  },
  {
    id: 'commons', name: 'Tragedy of the Commons', cardBadge: 'R·R·B', badge: 'R + R + B',
    summary: 'A shared resource everyone draws on quietly degrades until it fails for all.',
    watch: 'A shared resource everyone draws on quietly degrades until it fails for all.',
    pattern: "Each actor's individually rational gain (reinforcing) adds up to total activity that exhausts a shared resource, cutting the per-actor payoff for everyone.",
    leverage: 'Make the total load visible and govern the commons — quotas, shared incentives, or a steward.',
    glyph: { c1Fill: neutral.fill, c1Stroke: neutral.stroke, c2Fill: neutral.fill, c2Stroke: neutral.stroke, topColor: 'blue', bottomColor: 'blue' },
    behaviorPoints: '18,66 55,46 90,28 125,20 160,34 195,58 225,74',
  },
  {
    id: 'escalation', name: 'Escalation', cardBadge: 'R', badge: 'R',
    summary: 'Two sides keep one-upping each other and the whole thing spirals.',
    watch: 'Two sides keep one-upping each other and the whole thing spirals.',
    pattern: "Each party's move to get ahead threatens the other, who responds in kind — two balancing loops interlock into one reinforcing arms race.",
    leverage: 'Break the tit-for-tat: change the goal from "relative advantage" to a shared win, or unilaterally de-escalate.',
    glyph: { c1Fill: neutral.fill, c1Stroke: neutral.stroke, c2Fill: neutral.fill, c2Stroke: neutral.stroke, topColor: 'blue', bottomColor: 'blue' },
    behaviorPoints: '18,74 60,62 100,48 140,32 180,18 225,8',
  },
  {
    id: 'success', name: 'Success to the Successful', cardBadge: 'R + R', badge: 'R + R',
    summary: 'Early winners keep getting resources, so they keep winning — regardless of merit.',
    watch: 'Early winners keep getting the resources, so they keep winning — regardless of merit.',
    pattern: "Whoever gets an early edge is allocated more resources, reinforcing their success while starving the alternative of the chance to prove itself.",
    leverage: 'Decouple the two; allocate on merit and give the underfunded option a fair, protected shot.',
    glyph: { c1Fill: blueTint.fill, c1Stroke: blueTint.stroke, c2Fill: neutral.fill, c2Stroke: neutral.stroke, topColor: 'blue', bottomColor: 'blue' },
    behaviorPoints: '18,68 60,58 100,44 140,32 180,22 225,14',
  },
  {
    id: 'drifting', name: 'Drifting Goals', cardBadge: 'B + B', badge: 'B + B',
    summary: 'When performance lags, the target quietly gets lowered instead of the gap closed.',
    watch: 'Whenever performance lags, the target quietly gets lowered instead of the gap being closed.',
    pattern: 'A gap between goal and reality can be closed two ways: improve performance (slow) or lower the goal (easy). Repeatedly lowering the goal erodes standards over time.',
    leverage: 'Anchor the goal to an external, non-negotiable reference; close the gap by acting on performance.',
    glyph: { c1Fill: neutral.fill, c1Stroke: neutral.stroke, c2Fill: neutral.fill, c2Stroke: neutral.stroke, topColor: 'teal', bottomColor: 'teal' },
    behaviorPoints: '18,20 70,20 71,34 120,34 121,48 170,48 171,60 225,60',
  },
  {
    id: 'underinvest', name: 'Growth & Underinvestment', cardBadge: 'R·B·B', badge: 'R + B + B',
    summary: 'Growth stalls because capacity was never expanded to meet demand.',
    watch: 'Growth stalls because capacity was never expanded to meet rising demand.',
    pattern: 'A Limits-to-Growth where the limit is capacity you control — but investment lags (delays, low standards), so performance dips and "justifies" not investing.',
    leverage: 'Invest ahead of demand; hold capacity standards firm rather than letting eroding performance excuse underinvestment.',
    glyph: { c1Fill: blueTint.fill, c1Stroke: blueTint.stroke, c2Fill: tealTint.fill, c2Stroke: tealTint.stroke, topColor: 'blue', bottomColor: 'teal' },
    behaviorPoints: '18,70 50,50 80,58 110,40 140,50 170,44 200,56 225,64',
  },
];

export const archetypeById = (id: string) => archetypes.find(a => a.id === id);
