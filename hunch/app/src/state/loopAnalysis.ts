import type { LoopGraph } from '../types';

export interface DetectedLoop {
  id: string; // 'R1', 'B1', 'R2' …
  type: 'R' | 'B';
  nodeIds: string[];
  linkIds: string[];
}

const MAX_CYCLE_LENGTH = 8;

// Finds every simple (elementary) directed cycle in the graph via DFS.
// Fine for the graph sizes this tool is meant for (a few dozen elements at most).
export function detectLoops(graph: LoopGraph): DetectedLoop[] {
  const adjacency = new Map<string, { to: string; linkId: string }[]>();
  for (const n of graph.nodes) adjacency.set(n.id, []);
  for (const l of graph.links) {
    if (!adjacency.has(l.from)) continue;
    adjacency.get(l.from)!.push({ to: l.to, linkId: l.id });
  }

  const rawCycles: { nodeIds: string[]; linkIds: string[] }[] = [];

  function dfs(start: string, current: string, path: string[], linkPath: string[], visited: Set<string>) {
    for (const { to, linkId } of adjacency.get(current) ?? []) {
      if (to === start && path.length >= 2) {
        rawCycles.push({ nodeIds: [...path], linkIds: [...linkPath, linkId] });
        continue;
      }
      if (visited.has(to) || path.length >= MAX_CYCLE_LENGTH) continue;
      visited.add(to);
      path.push(to);
      linkPath.push(linkId);
      dfs(start, to, path, linkPath, visited);
      path.pop();
      linkPath.pop();
      visited.delete(to);
    }
  }

  for (const n of graph.nodes) dfs(n.id, n.id, [n.id], [], new Set([n.id]));

  // Dedupe rotations of the same cycle (found once per starting node).
  const seen = new Set<string>();
  const uniqueCycles: { nodeIds: string[]; linkIds: string[] }[] = [];
  for (const c of rawCycles) {
    const minIdx = c.nodeIds.reduce((mi, id, i, arr) => (id < arr[mi] ? i : mi), 0);
    const sig = [...c.nodeIds.slice(minIdx), ...c.nodeIds.slice(0, minIdx)].join('>');
    if (seen.has(sig)) continue;
    seen.add(sig);
    uniqueCycles.push(c);
  }

  const linkById = new Map(graph.links.map(l => [l.id, l]));
  let rCount = 0;
  let bCount = 0;
  return uniqueCycles
    .sort((a, b) => (a.nodeIds.join() < b.nodeIds.join() ? -1 : 1))
    .map(c => {
      const negatives = c.linkIds.filter(id => linkById.get(id)?.polarity === '-').length;
      const type: 'R' | 'B' = negatives % 2 === 0 ? 'R' : 'B';
      const id = type === 'R' ? `R${++rCount}` : `B${++bCount}`;
      return { id, type, nodeIds: c.nodeIds, linkIds: c.linkIds };
    });
}

export function loopBadgeText(loops: DetectedLoop[]): string {
  return loops.length ? loops.map(l => l.id).join(' · ') : 'none yet';
}

// R (blue) wins over B (teal) when an element sits on both kinds of loop.
export function loopColors(loops: DetectedLoop[]) {
  const nodeTone = new Map<string, 'blue' | 'teal'>();
  const linkColor = new Map<string, 'blue' | 'teal'>();
  for (const loop of loops) {
    if (loop.type !== 'B') continue;
    for (const id of loop.nodeIds) if (!nodeTone.has(id)) nodeTone.set(id, 'teal');
    for (const id of loop.linkIds) if (!linkColor.has(id)) linkColor.set(id, 'teal');
  }
  for (const loop of loops) {
    if (loop.type !== 'R') continue;
    for (const id of loop.nodeIds) nodeTone.set(id, 'blue');
    for (const id of loop.linkIds) linkColor.set(id, 'blue');
  }
  return { nodeTone, linkColor };
}
