import type { KnowledgeNode } from '../data/knowledge-map'

export const NODE_WIDTH = 176
export const NODE_HEIGHT = 50
const COLUMN_GAP = 228
const ROW_GAP = 78
const MARGIN = 32

export interface PlacedNode {
  node: KnowledgeNode
  depth: number
  x: number
  y: number
}

export interface MapLayout {
  nodes: PlacedNode[]
  edges: [PlacedNode, PlacedNode][]
  width: number
  height: number
}

export function layoutMap(root: KnowledgeNode, expanded: ReadonlySet<string>): MapLayout {
  const nodes: PlacedNode[] = []
  const edges: [PlacedNode, PlacedNode][] = []
  let row = 0

  function visit(node: KnowledgeNode, depth: number, parent?: PlacedNode): PlacedNode {
    const placed: PlacedNode = { node, depth, x: MARGIN + depth * COLUMN_GAP, y: 0 }
    nodes.push(placed)
    if (parent) edges.push([parent, placed])

    const children = expanded.has(node.id) ? node.children ?? [] : []
    if (children.length === 0) {
      placed.y = MARGIN + row++ * ROW_GAP
    } else {
      const visibleChildren = children.map((child) => visit(child, depth + 1, placed))
      placed.y = (visibleChildren[0].y + visibleChildren.at(-1)!.y) / 2
    }
    return placed
  }

  visit(root, 0)
  const depth = Math.max(...nodes.map((node) => node.depth))
  return {
    nodes,
    edges,
    width: MARGIN * 2 + depth * COLUMN_GAP + NODE_WIDTH,
    height: Math.max(240, MARGIN * 2 + (row - 1) * ROW_GAP + NODE_HEIGHT)
  }
}

export function edgePath(source: PlacedNode, target: PlacedNode) {
  const x1 = source.x + NODE_WIDTH
  const x2 = target.x
  const y1 = source.y + NODE_HEIGHT / 2
  const y2 = target.y + NODE_HEIGHT / 2
  const middle = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${middle} ${y1}, ${middle} ${y2}, ${x2} ${y2}`
}
