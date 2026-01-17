"use client"

import { useCallback, useState, useEffect } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { PageNode } from "./nodes/page-node"
import { HomeNode } from "./nodes/home-node"
import { ControlPanel } from "./control-panel"
import { JsonPanel } from "./json-panel"
import { getInitialState, createNodesAndEdges, STORAGE_KEY, type HierarchyState } from "@/lib/hierarchy-data"
import { getLayoutedElements } from "@/lib/dagre-layout"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

const nodeTypes = {
  pageNode: PageNode,
  homeNode: HomeNode,
}

export function HierarchyEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [homeSections, setHomeSections] = useState<string[]>([])
  const [showJsonPanel, setShowJsonPanel] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()

  // Initialize with default state
  useEffect(() => {
    const state = getInitialState()
    const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges(state.pages, state.homeSections)
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges)
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
    setHomeSections(state.homeSections)
    setIsInitialized(true)
  }, [setNodes, setEdges])

  // Update home node when sections change
  const updateHomeSections = useCallback(
    (newSections: string[]) => {
      setHomeSections(newSections)
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === "home") {
            return {
              ...node,
              data: {
                ...node.data,
                sections: newSections,
              },
            }
          }
          return node
        }),
      )
    },
    [setNodes],
  )

  // Save to localStorage
  const handleSave = useCallback(() => {
    const state: HierarchyState = {
      pages: getInitialState().pages,
      homeSections,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    toast({
      title: "Saved!",
      description: "Your hierarchy has been saved to localStorage.",
    })
  }, [homeSections, toast])

  // Load from localStorage
  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const state: HierarchyState = JSON.parse(saved)
        const { nodes: loadedNodes, edges: loadedEdges } = createNodesAndEdges(state.pages, state.homeSections)
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(loadedNodes, loadedEdges)
        setNodes(layoutedNodes)
        setEdges(layoutedEdges)
        setHomeSections(state.homeSections)
        toast({
          title: "Loaded!",
          description: "Your hierarchy has been loaded from localStorage.",
        })
      } catch {
        toast({
          title: "Error",
          description: "Failed to load saved data.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "No Data",
        description: "No saved hierarchy found in localStorage.",
        variant: "destructive",
      })
    }
  }, [setNodes, setEdges, toast])

  // Export as JSON
  const handleExport = useCallback(() => {
    const state: HierarchyState = {
      pages: getInitialState().pages,
      homeSections,
    }
    const json = JSON.stringify(state, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "page-hierarchy.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Exported!",
      description: "Your hierarchy has been downloaded as JSON.",
    })
  }, [homeSections, toast])

  // Toggle JSON panel
  const handleToggleJsonPanel = useCallback(() => {
    setShowJsonPanel((prev) => !prev)
  }, [])

  const getCurrentState = useCallback((): HierarchyState => {
    return {
      pages: getInitialState().pages,
      homeSections,
    }
  }, [homeSections])

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Visual Page Hierarchy Editor</h1>
            <p className="text-sm text-muted-foreground">
              Drag to reorder Home sections • Auto-layout with Dagre • React Flow
            </p>
          </div>
          <ControlPanel
            onSave={handleSave}
            onLoad={handleLoad}
            onExport={handleExport}
            onToggleJson={handleToggleJsonPanel}
            showJsonPanel={showJsonPanel}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="relative flex flex-1">
        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={1.5}
            attributionPosition="bottom-left"
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#e2e8f0" gap={20} />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const level = node.data?.level as number
                if (level === 1) return "#10b981"
                if (level === 2) return "#0ea5e9"
                return "#f59e0b"
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </div>

        {/* JSON Panel */}
        {showJsonPanel && <JsonPanel state={getCurrentState()} onClose={() => setShowJsonPanel(false)} />}
      </div>

      {/* Legend */}
      <footer className="border-t border-border bg-card px-6 py-3">
        <div className="flex items-center gap-6 text-sm">
          <span className="font-medium text-muted-foreground">Levels:</span>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Level 1 (Root)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-sky-500" />
            <span className="text-muted-foreground">Level 2 (Main Pages)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Level 3 (Subpages)</span>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}
