import type { Node, Edge } from "@xyflow/react"

export interface PageNode {
  id: string
  label: string
  level: number
  parentId?: string
  sections?: string[]
}

export interface HierarchyState {
  pages: PageNode[]
  homeSections: string[]
}

export const DEFAULT_HOME_SECTIONS = ["Hero", "Features", "Testimonials", "CTA", "Footer"]

export const DEFAULT_PAGES: PageNode[] = [
  // Level 1 - Root
  { id: "home", label: "Home", level: 1 },

  // Level 2 - Main Pages
  { id: "about", label: "About", level: 2, parentId: "home" },
  { id: "services", label: "Services", level: 2, parentId: "home" },
  { id: "blog", label: "Blog", level: 2, parentId: "home" },
  { id: "contact", label: "Contact", level: 2, parentId: "home" },

  // Level 3 - Subpages
  { id: "service-detail-1", label: "Service Detail 1", level: 3, parentId: "services" },
  { id: "service-detail-2", label: "Service Detail 2", level: 3, parentId: "services" },
  { id: "blog-post-1", label: "Blog Post 1", level: 3, parentId: "blog" },
  { id: "blog-post-2", label: "Blog Post 2", level: 3, parentId: "blog" },
  { id: "author-page", label: "Author Page", level: 3, parentId: "blog" },
  { id: "location-info", label: "Location Info", level: 3, parentId: "contact" },
  { id: "support-page", label: "Support Page", level: 3, parentId: "contact" },
]

export const LEVEL_COLORS: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: "bg-emerald-100", border: "border-emerald-500", text: "text-emerald-800" },
  2: { bg: "bg-sky-100", border: "border-sky-500", text: "text-sky-800" },
  3: { bg: "bg-amber-100", border: "border-amber-500", text: "text-amber-800" },
}

export const STORAGE_KEY = "page-hierarchy-editor"

export function getInitialState(): HierarchyState {
  return {
    pages: DEFAULT_PAGES,
    homeSections: DEFAULT_HOME_SECTIONS,
  }
}

export function createNodesAndEdges(pages: PageNode[], homeSections: string[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = pages.map((page) => ({
    id: page.id,
    type: page.id === "home" ? "homeNode" : "pageNode",
    data: {
      label: page.label,
      level: page.level,
      sections: page.id === "home" ? homeSections : undefined,
    },
    position: { x: 0, y: 0 },
  }))

  const edges: Edge[] = pages
    .filter((page) => page.parentId)
    .map((page) => ({
      id: `${page.parentId}-${page.id}`,
      source: page.parentId!,
      target: page.id,
      type: "smoothstep",
      animated: false,
      style: { stroke: "#94a3b8", strokeWidth: 2 },
    }))

  return { nodes, edges }
}
