"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

interface SortableSectionProps {
  id: string
}

const SECTION_ICONS: Record<string, string> = {
  Hero: "🎯",
  Features: "✨",
  Testimonials: "💬",
  CTA: "🚀",
  Footer: "📋",
}

export function SortableSection({ id }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex cursor-grab items-center gap-2 rounded-md border border-emerald-300 bg-white px-3 py-2 text-sm font-medium text-emerald-800 shadow-sm transition-all active:cursor-grabbing ${
        isDragging ? "z-50 shadow-lg ring-2 ring-emerald-400" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 text-emerald-400" />
      <span>{SECTION_ICONS[id] || "📄"}</span>
      <span>{id}</span>
    </div>
  )
}
