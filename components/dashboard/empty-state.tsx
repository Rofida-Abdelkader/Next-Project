"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { AlertCircleIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: any
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

export function EmptyState({
  icon = AlertCircleIcon,
  title,
  description,
  actionLabel,
  onAction,
  children
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center space-y-5"
    >
      <div className="w-20 h-20 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] flex items-center justify-center text-slate-700 shadow-inner">
        <HugeiconsIcon icon={icon} size={40} className="opacity-20 translate-y-1" />
      </div>
      
      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-white font-bold text-lg tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>

      {actionLabel && (
        <Button 
          onClick={onAction}
          className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-xl px-6 h-10 font-bold text-xs uppercase tracking-widest transition-all"
        >
          {actionLabel}
        </Button>
      )}

      {children}
    </motion.div>
  )
}
