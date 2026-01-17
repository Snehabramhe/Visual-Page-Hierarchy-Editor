"use client"

import { Button } from "@/components/ui/button"
import { Save, Download, Upload, Code } from "lucide-react"

interface ControlPanelProps {
  onSave: () => void
  onLoad: () => void
  onExport: () => void
  onToggleJson: () => void
  showJsonPanel: boolean
}

export function ControlPanel({ onSave, onLoad, onExport, onToggleJson, showJsonPanel }: ControlPanelProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onSave} variant="default" size="sm" className="gap-2">
        <Save className="h-4 w-4" />
        Save
      </Button>
      <Button onClick={onLoad} variant="outline" size="sm" className="gap-2 bg-transparent">
        <Upload className="h-4 w-4" />
        Load
      </Button>
      <Button onClick={onExport} variant="outline" size="sm" className="gap-2 bg-transparent">
        <Download className="h-4 w-4" />
        Export JSON
      </Button>
      <Button onClick={onToggleJson} variant={showJsonPanel ? "secondary" : "outline"} size="sm" className="gap-2">
        <Code className="h-4 w-4" />
        {showJsonPanel ? "Hide JSON" : "View JSON"}
      </Button>
    </div>
  )
}
