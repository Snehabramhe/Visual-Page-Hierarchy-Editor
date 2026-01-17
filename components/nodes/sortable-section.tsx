"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

interface SortableSectionProps {
  id: string
}

const SECTION_DATA: Record<string, { icon: string; description: string }> = {
  Hero: {
    icon: "🎯",
    description: "Main banner with headline and CTA",
  },
  Features: {
    icon: "✨",
    description: "Showcase key product features",
  },
  Testimonials: {
    icon: "💬",
    description: "Customer reviews and quotes",
  },
  CTA: {
    icon: "🚀",
    description: "Call-to-action with signup form",
  },
  Footer: {
    icon: "📋",
    description: "Links, contact info, copyright",
  },
}

export function SortableSection({ id }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const sectionData = SECTION_DATA[id] || { icon: "📄", description: "Custom section content" }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex cursor-grab items-center gap-3 rounded-md border border-emerald-300 bg-white px-3 py-2.5 text-sm shadow-sm transition-all active:cursor-grabbing ${
        isDragging ? "z-50 shadow-lg ring-2 ring-emerald-400" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-emerald-400" />
      <span className="text-base">{sectionData.icon}</span>
      <div className="flex flex-col gap-0.5 overflow-hidden">
        <span className="font-semibold text-emerald-800">{id}</span>
        <span className="truncate text-xs text-emerald-600/70">{sectionData.description}</span>
      </div>
    </div>
  )
}
