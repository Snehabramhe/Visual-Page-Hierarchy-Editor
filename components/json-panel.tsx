"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HierarchyState } from "@/lib/hierarchy-data"

interface JsonPanelProps {
  state: HierarchyState
  onClose: () => void
}

export function JsonPanel({ state, onClose }: JsonPanelProps) {
  return (
    <div className="w-96 border-l border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="font-semibold text-foreground">JSON Structure</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="h-[calc(100%-56px)] overflow-auto p-4">
        <pre className="rounded-lg bg-muted p-4 text-xs text-muted-foreground">{JSON.stringify(state, null, 2)}</pre>
      </div>
    </div>
  )
}
