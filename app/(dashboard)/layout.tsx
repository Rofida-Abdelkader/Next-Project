"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Command, 
  Search, 
  Settings, 
  Plus, 
  Zap, 
  LogOut,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const breadcrumbs = pathname === "/" 
    ? [{ label: "Dashboard", href: "/" }] 
    : [
        { label: "Dashboard", href: "/" },
        { label: pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2), href: pathname }
      ];

  if (!mounted) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background selection:bg-primary/20">
        {/* Ambient Noise Texture Overlay */}
        <div className="noise fixed inset-0 z-[100] opacity-[0.015]" />
        
        <AppSidebar user={user} />
        
        <SidebarInset className="bg-transparent flex flex-col relative">
          {/* Top Floating Header - Modern Shell */}
          <header className="sticky top-4 z-50 mx-4 lg:mx-8 mb-4">
            <div className="glass-elevated flex h-16 items-center justify-between gap-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              {/* Left: Trigger & Breadcrumbs */}
              <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-2 text-slate-400 hover:text-white transition-colors h-10 w-10" />
                <Separator orientation="vertical" className="h-6 bg-white/[0.08]" />
                <Breadcrumb className="hidden sm:block">
                  <BreadcrumbList>
                    {breadcrumbs.map((bc, i) => (
                      <React.Fragment key={bc.href}>
                        <BreadcrumbItem>
                          {i === breadcrumbs.length - 1 ? (
                            <BreadcrumbPage className="text-white font-bold text-sm tracking-tight">{bc.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={bc.href} className="text-slate-500 hover:text-indigo-400 transition-colors text-sm font-medium">
                              {bc.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {i < breadcrumbs.length - 1 && <BreadcrumbSeparator className="text-slate-800" />}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Center: Global AI Search Shell */}
              <div className="flex-1 max-w-lg hidden md:block">
                <button className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] rounded-xl transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <Search size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-sm text-slate-500 font-medium group-hover:text-slate-300 transition-colors">Search anything with AI...</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-white/[0.05] border border-white/[0.1] rounded-lg">
                    <Command size={10} className="text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider">K</span>
                  </div>
                </button>
              </div>

              {/* Right: Quick Actions & Profile */}
              <div className="flex items-center gap-3">
                {/* Integration Status */}
                <div className="hidden xl:flex items-center gap-2 mr-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">Live Sync</span>
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative h-10 w-10 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-xl group">
                  <Bell size={20} strokeWidth={1.5} className="group-hover:rotate-12 transition-transform" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-[#020617] shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                </Button>

                {/* Quick Add Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden sm:flex h-10 gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-xl px-4 font-bold text-xs uppercase tracking-wider transition-all">
                      <Plus size={16} strokeWidth={2.5} />
                      Action
                      <ChevronDown size={14} className="opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-elevated border-white/[0.08] p-1 rounded-xl">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="gap-3 rounded-lg py-2.5 cursor-pointer focus:bg-white/[0.06] focus:text-white">
                        <Zap size={16} className="text-amber-400" />
                        <span className="font-semibold text-sm">Add New Product</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3 rounded-lg py-2.5 cursor-pointer focus:bg-white/[0.06] focus:text-white">
                        <Settings size={16} className="text-slate-400" />
                        <span className="font-semibold text-sm">Create Category</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Context */}
                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-10 w-10 rounded-xl border border-white/[0.08] cursor-pointer hover:border-white/20 transition-all active:scale-95 shadow-lg">
                        <AvatarImage src={user.avatar} className="object-cover" />
                        <AvatarFallback className="bg-primary/20 text-primary font-black uppercase text-xs tracking-tighter">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 glass-elevated border-white/[0.08] p-2 rounded-xl mt-2">
                       <div className="flex items-center gap-3 p-2 mb-2 bg-white/[0.03] rounded-lg">
                        <Avatar className="h-10 w-10 rounded-lg">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-primary/20 text-primary font-black">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white tracking-tight">{user.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[140px] uppercase tracking-tighter">{user.email}</span>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-white/[0.08] mx-2 mb-1" />
                      <DropdownMenuGroup className="space-y-0.5">
                        <DropdownMenuItem className="gap-3 rounded-lg py-2 focus:bg-white/[0.06] font-medium text-slate-300">
                          <Zap size={14} className="text-indigo-400" /> My Account
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 rounded-lg py-2 focus:bg-white/[0.06] font-medium text-slate-300">
                          <Settings size={14} className="text-slate-500" /> System Params
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-white/[0.08] mx-2 my-1" />
                      <DropdownMenuItem onClick={handleLogout} className="gap-3 rounded-lg py-2 text-red-400 focus:bg-red-500/10 focus:text-red-400 font-bold">
                        <LogOut size={14} /> Log Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </header>

          {/* Main Dashboard Surface */}
          <main className="flex-1 px-4 lg:px-8 pb-8 relative z-10 overflow-y-auto custom-scrollbar">
            {/* Ambient Background Glows - Linear Style */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />
            <div className="fixed bottom-0 left-[20%] w-[400px] h-[400px] bg-indigo-600/[0.02] blur-[100px] rounded-full -z-10 pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mx-auto w-full max-w-7xl"
            >
              {children}
            </motion.div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
