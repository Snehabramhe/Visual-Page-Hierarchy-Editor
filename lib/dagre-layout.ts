import dagre from "@dagrejs/dagre"
import type { Node, Edge } from "@xyflow/react"

const NODE_WIDTH = 200
const NODE_HEIGHT = 80
const HOME_NODE_HEIGHT = 280

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB",
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: direction, nodesep: 80, ranksep: 100 })

  nodes.forEach((node) => {
    const height = node.id === "home" ? HOME_NODE_HEIGHT : NODE_HEIGHT
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    const height = node.id === "home" ? HOME_NODE_HEIGHT : NODE_HEIGHT

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - height / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}
