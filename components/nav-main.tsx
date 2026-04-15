"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignCircleIcon, Mail01Icon } from "@hugeicons/core-free-icons"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  data-active={isActive}
                  className={`
                    transition-all duration-200 rounded-lg h-10 cursor-pointer
                    ${isActive 
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 shadow-[0_0_12px_rgba(99,102,241,0.06)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }
                  `}
                >
                  <Link href={item.url} className="flex items-center gap-3 px-3">
                    <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>{item.icon}</span>
                    <span className={`text-sm font-medium ${isActive ? 'text-indigo-300' : ''}`}>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
