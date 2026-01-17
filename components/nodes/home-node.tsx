"use client"

import { memo, useCallback } from "react"
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableSection } from "./sortable-section"
import { LEVEL_COLORS } from "@/lib/hierarchy-data"
import { Home } from "lucide-react"

interface HomeNodeData {
  label: string
  level: number
  sections: string[]
}

export const HomeNode = memo(function HomeNode({ id, data }: NodeProps<{ data: HomeNodeData }>) {
  const { label, level, sections } = data as unknown as HomeNodeData
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS[1]
  const { setNodes } = useReactFlow()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = sections.indexOf(active.id as string)
        const newIndex = sections.indexOf(over.id as string)
        const newSections = arrayMove(sections, oldIndex, newIndex)

        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === id) {
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
      }
    },
    [id, sections, setNodes],
  )

  return (
    <div
      className={`min-w-[200px] rounded-lg border-2 ${colors.border} ${colors.bg} p-4 shadow-lg transition-shadow hover:shadow-xl`}
    >
      <Handle type="target" position={Position.Top} className="!h-3 !w-3 !border-2 !border-slate-400 !bg-white" />

      <div className="mb-3 flex items-center gap-2">
        <Home className={`h-5 w-5 ${colors.text}`} />
        <span className={`text-lg font-bold ${colors.text}`}>{label}</span>
      </div>

      <div className={`mb-2 text-xs ${colors.text} opacity-70`}>Level {level} • Drag to reorder sections</div>

      <div className="space-y-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections} strategy={verticalListSortingStrategy}>
            {sections.map((section) => (
              <SortableSection key={section} id={section} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <Handle type="source" position={Position.Bottom} className="!h-3 !w-3 !border-2 !border-slate-400 !bg-white" />
    </div>
  )
})
