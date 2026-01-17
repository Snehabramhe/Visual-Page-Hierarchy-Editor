"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { LEVEL_COLORS } from "@/lib/hierarchy-data"
import { FileText, Plus, Sparkles } from "lucide-react"

interface PageNodeData {
  label: string
  level: number
}

export const PageNode = memo(function PageNode({ data }: NodeProps<{ data: PageNodeData }>) {
  const { label, level } = data as unknown as PageNodeData
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS[3]

  const showActions = level === 2 || level === 3

  return (
    <div
      className={`min-w-[180px] rounded-lg border-2 ${colors.border} ${colors.bg} px-4 py-3 shadow-md transition-shadow hover:shadow-lg`}
    >
      <Handle type="target" position={Position.Top} className="!h-3 !w-3 !border-2 !border-slate-400 !bg-white" />

      <div className="flex items-center gap-2">
        <FileText className={`h-4 w-4 ${colors.text}`} />
        <span className={`font-semibold ${colors.text}`}>{label}</span>
      </div>

      <div className={`mt-1 text-xs ${colors.text} opacity-70`}>Level {level}</div>

      {showActions && (
        <div className="nodrag mt-3 flex flex-col gap-2">
          <button
            className={`flex items-center justify-center gap-1.5 rounded-md border ${colors.border} bg-white px-3 py-1.5 text-xs font-medium ${colors.text} transition-colors hover:bg-opacity-80`}
            onClick={() => {
              // Placeholder for add section functionality
              console.log(`Add section to ${label}`)
            }}
          >
            <Plus className="h-3 w-3" />
            Add Section
          </button>
          <button
            className={`flex items-center justify-center gap-1.5 rounded-md border ${colors.border} bg-white px-3 py-1.5 text-xs font-medium ${colors.text} transition-colors hover:bg-opacity-80`}
            onClick={() => {
              // Placeholder for generate page functionality
              console.log(`Generate page under ${label}`)
            }}
          >
            <Sparkles className="h-3 w-3" />
            Generate Page
          </button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!h-3 !w-3 !border-2 !border-slate-400 !bg-white" />
    </div>
  )
})
