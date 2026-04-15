"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  DashboardSquare01Icon, 
  Database01Icon, 
  Folder01Icon, 
  Analytics01Icon,
  ChartBarLineIcon,
  Settings05Icon, 
  UserCircle02Icon,
  HelpCircleIcon, 
  ShoppingBag01Icon
} from "@hugeicons/core-free-icons"

const data = {
  core: [
    {
      title: "Dashboard",
      url: "/",
      icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} size={18} />,
    },
    {
      title: "Products",
      url: "/products",
      icon: <HugeiconsIcon icon={Database01Icon} strokeWidth={2} size={18} />,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} size={18} />,
    },
  ],
  analytics: [
    {
      title: "Insights",
      url: "#",
      icon: <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} size={18} />,
    },
    {
      title: "Reports",
      url: "#",
      icon: <HugeiconsIcon icon={ChartBarLineIcon} strokeWidth={2} size={18} />,
    },
  ],
  settings: [
    {
      title: "Account",
      url: "#",
      icon: <HugeiconsIcon icon={UserCircle02Icon} strokeWidth={2} size={18} />,
    },
    {
      title: "System",
      url: "#",
      icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} size={18} />,
    },
  ],
  support: [
    {
      title: "Help Center",
      url: "#",
      icon: <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} size={16} />,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string
    email: string
    avatar: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const defaultUser = {
    name: user?.name || "Admin User",
    email: user?.email || "admin@nexus.app",
    avatar: user?.avatar || "https://github.com/shadcn.png",
  }

  return (
    <Sidebar 
      collapsible="icon" 
      {...props} 
      className="border-r border-white/[0.04] bg-background relative overflow-hidden"
    >
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/[0.04] blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-32 h-32 bg-indigo-500/[0.03] blur-[60px] rounded-full pointer-events-none" />
      
      <SidebarHeader className="h-20 flex items-center border-b border-white/[0.04] px-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent active:bg-transparent px-0"
            >
              <a href="/" className="flex items-center gap-3 group">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)] group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-500">
                  <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={2.5} className="size-5" />
                </div>
                <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-black text-white text-base tracking-tight">nexus.</span>
                  <span className="truncate text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Inventory OS</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6 space-y-8 custom-scrollbar">
        {/* Core Section */}
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">Core</p>
          <NavMain items={data.core} />
        </div>

        {/* Analytics Section */}
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">Analytics</p>
          <NavMain items={data.analytics} />
        </div>

        {/* Settings Section */}
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">Settings</p>
          <NavMain items={data.settings} />
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/[0.04] p-4 bg-white/[0.01]">
        <NavUser user={defaultUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
