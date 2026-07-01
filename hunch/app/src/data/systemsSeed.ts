import type { SupportMap, LoopGraph } from '../types';

// Keyed by concept id. Only one map exists today ('default') since the app
// doesn't yet have a concept switcher for the systems workspace — the shape
// is per-concept so real concept records can each get their own map later.
export const ACTIVE_MAP_ID = 'default';

export const defaultSupportMaps: Record<string, SupportMap> = {
  [ACTIVE_MAP_ID]: {
    title: 'New-customer onboarding',
    notes: [
      { id: 'role', ring: 'role', text: 'Onboarding Lead', x: 50, y: 50 },
      { id: 'resp-1', ring: 'responsibility', text: 'Run welcome calls', x: 26, y: 39 },
      { id: 'resp-2', ring: 'responsibility', text: 'Keep help docs current', x: 66, y: 63 },
      { id: 'need-1', ring: 'need', text: 'Up-to-date product docs', x: 63, y: 22 },
      { id: 'need-2', ring: 'need', text: 'Analytics access', x: 34, y: 74 },
      { id: 'res-1', ring: 'resource', text: 'Help center', x: 74, y: 9, star: 'helpful' },
      { id: 'res-2', ring: 'resource', text: 'Legacy LMS', x: 20, y: 88, star: 'unhelpful' },
      { id: 'wish-1', ring: 'wish', text: 'Self-serve setup', x: 16, y: 2 },
      { id: 'wish-2', ring: 'wish', text: 'Shared activation dashboard', x: 76, y: 93 },
    ],
  },
};

export const defaultLoopGraphs: Record<string, LoopGraph> = {
  [ACTIVE_MAP_ID]: {
    nodes: [
      { id: 'signups', label: 'New signups', x: 250, y: 55 },
      { id: 'active', label: 'Active users', x: 475, y: 150 },
      { id: 'wom', label: 'Word of mouth', x: 335, y: 325 },
      { id: 'support', label: 'Support load', x: 130, y: 345 },
      { id: 'onboarding', label: 'Onboarding quality', x: 92, y: 170 },
    ],
    links: [
      { id: 'l1', from: 'signups', to: 'active', polarity: '+' },
      { id: 'l2', from: 'active', to: 'wom', polarity: '+' },
      { id: 'l3', from: 'wom', to: 'signups', polarity: '+' },
      { id: 'l4', from: 'active', to: 'support', polarity: '+' },
      { id: 'l5', from: 'support', to: 'onboarding', polarity: '-' },
      { id: 'l6', from: 'onboarding', to: 'active', polarity: '+' },
    ],
  },
};
