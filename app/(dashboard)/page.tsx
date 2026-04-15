"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package01Icon, 
  AlertCircleIcon, 
  Tag01Icon, 
  Analytics01Icon,
  DashboardSquare01Icon,
  Sorting05Icon,
  DatabaseIcon,
  ZapIcon,
  SparklesIcon,
  Clock01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, Variants } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/dashboard/sparkline";
import { EmptyState } from "@/components/dashboard/empty-state";

type StatsData = {
  totalProducts: number;
  outOfStock: number;
  totalCategories: number;
  avgRating: number;
  totalReviews: number;
  productsByCategory: Array<{ name: string; count: number }>;
  brandDistribution: Array<{ _id: string; count: number }>;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function DashboardHomePage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load stats", err);
        setLoading(false);
      });
  }, []);

  // Realistic AI Insights based on local data
  const aiInsights = useMemo(() => {
    if (!stats) return [];
    
    const insights = [];
    
    if (stats.outOfStock > 0) {
      insights.push({
        title: "Inventory Alert",
        description: `${stats.outOfStock} items are currently out of stock. Consider restocking soon.`,
        type: "warning",
        icon: AlertCircleIcon
      });
    } else {
      insights.push({
        title: "Stock Healthy",
        description: "All catalogue items are currently in stock. No urgent action required.",
        type: "success",
        icon: ZapIcon
      });
    }

    if (stats.totalCategories === 0) {
      insights.push({
        title: "Organization Tip",
        description: "You haven't created any categories yet. Grouping products improves discoverability.",
        type: "info",
        icon: Tag01Icon
      });
     } else if (stats.totalProducts > 0 && stats.totalCategories > 0) {
        insights.push({
         title: "Distribution Analyzed",
         description: `Your ${stats.totalProducts} listings are distributed across ${stats.totalCategories} active sectors.`,
         type: "success",
         icon: Analytics01Icon
       });
     }

     if (stats.brandDistribution.length > 0) {
       const topBrand = stats.brandDistribution[0]._id;
       insights.push({
         title: "Brand Authority",
         description: `"${topBrand}" is currently your most dominant identifier in the system.`,
         type: "info",
         icon: DatabaseIcon
       });
     }

     if (stats.avgRating >= 4.5) {
        insights.push({
         title: "Peak Sentiment",
         description: `System-wide rating is at ${stats.avgRating}. Customer trust levels are optimized.`,
         type: "success",
         icon: SparklesIcon
       });
     }

    return insights;
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-20 h-20 border-[3px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
               >
                 <HugeiconsIcon icon={SparklesIcon} size={24} className="text-primary" />
               </motion.div>
            </div>
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-white font-black text-xl tracking-tighter">nexus_intelligence</h2>
            <p className="text-slate-500 text-sm font-medium animate-pulse">Synchronizing architectural layers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <EmptyState 
        title="Intelligence Offline" 
        description="We couldn't establish a link with the analytics core. Check your server connection."
        actionLabel="Retry Link"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-12"
    >
      {/* Page Hero Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse"></div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Operational Neural Link</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter text-gradient leading-none">
            Welcome back, Admin.
          </h1>
          <p className="text-slate-500 text-lg font-medium tracking-tight">Here's what's happening in your commerce ecosystem today.</p>
        </div>
      </motion.div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Stats Bento Row */}
        <motion.div variants={itemVariants} className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Inventory Scale - Hero Card */}
          <Card className="premium-card p-8 md:col-span-2 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
              <HugeiconsIcon icon={Package01Icon} size={180} />
            </div>
            <div className="flex flex-col h-full justify-between relative z-10">
              <div>
                <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Core Assets</CardTitle>
                <div className="flex items-end gap-4">
                  <div className="text-7xl font-black text-white tracking-tighter leading-none">{stats.totalProducts}</div>
                  <div className="mb-2 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/10 rounded-full h-fit">
                    <TrendingUp size={14} className="text-emerald-400" />
                    <span className="text-xs font-black text-emerald-400">+12.4%</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white/90 mt-2 tracking-tight">Active Product Listings</h3>
              </div>
              
              <div className="mt-8 flex items-center justify-between border-t border-white/[0.05] pt-8">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Growth Forecast</p>
                    <Sparkline data={[20, 40, 30, 70, 50, 90, 80]} color="#818cf8" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Market Sentiment</p>
                    <div className="flex items-center gap-2">
                       <HugeiconsIcon icon={ZapIcon} className="text-amber-400 size-4" />
                       <span className="text-sm font-bold text-slate-300 tracking-tight">Optimistic</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="text-slate-400 hover:text-white group/btn">
                  Full Audit <ChevronRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Secondary Bento Items */}
          <Card className="premium-card p-6 h-full flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/10 text-red-400 group-hover:scale-110 transition-transform">
                <HugeiconsIcon icon={AlertCircleIcon} size={24} />
              </div>
              <Sparkline data={[10, 5, 8, 3, 12, 15, 5]} color="#f87171" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Inventory Gap</p>
              <div className="text-4xl font-black text-white">{stats.outOfStock}</div>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-tighter">Out of Stock Assets</p>
            </div>
          </Card>

          <Card className="premium-card p-6 h-full flex flex-col justify-between group">
             <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <HugeiconsIcon icon={SparklesIcon} size={24} />
              </div>
              <div className="px-3 py-1 bg-white/[0.05] rounded-lg border border-white/[0.08] text-[10px] font-black text-slate-400 tracking-widest">SENTIMENT</div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Customer Sentiment</p>
              <div className="flex items-center gap-3">
                 <div className="text-4xl font-black text-white">{stats.avgRating}</div>
                 <div className="text-amber-500 text-xl font-black">★</div>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-tighter">Based on {stats.totalReviews} reviews</p>
            </div>
          </Card>

          <Card className="premium-card p-6 h-full flex flex-col justify-between group">
             <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <HugeiconsIcon icon={DatabaseIcon} size={24} />
              </div>
              <div className="px-3 py-1 bg-white/[0.05] rounded-lg border border-white/[0.08] text-[10px] font-black text-slate-400 tracking-widest">MARKET</div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Architecture</p>
              <div className="text-4xl font-black text-white">{stats.brandDistribution.length}</div>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-tighter">Active Strategic Brands</p>
            </div>
          </Card>

        </motion.div>

        {/* AI Insight Panel & Activity Shell */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          
          {/* AI Insights Panel */}
          <Card className="glass-elevated border-primary/20 p-8 overflow-hidden relative min-h-[300px]">
            <div className="absolute top-0 right-0 p-4">
               <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               >
                 <HugeiconsIcon icon={SparklesIcon} className="text-primary/20" size={100} />
               </motion.div>
            </div>
            
            <div className="relative z-10 space-y-6 h-full flex flex-col">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-lg font-black text-white tracking-tighter uppercase">Nexus_AI</h3>
              </div>

              <div className="flex-1 space-y-4">
                {aiInsights.map((insight, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                       <div className={`p-2 rounded-xl mt-1 ${
                          insight.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 
                          insight.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                          'bg-indigo-500/10 text-indigo-400'
                       }`}>
                          <HugeiconsIcon icon={insight.icon} size={16} />
                       </div>
                       <div>
                          <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-1 leading-none group-hover:text-primary transition-colors">{insight.title}</p>
                          <p className="text-sm font-medium text-slate-300 tracking-tight leading-snug">{insight.description}</p>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/[0.05]">
                 <p className="text-[10px] font-bold text-slate-500 text-center tracking-widest animate-pulse">PROCESSED BY ARCH_01 NEURAL ENGINE</p>
              </div>
            </div>
          </Card>

          {/* Recent Activity Timeline */}
          <Card className="glass border-white/[0.04] p-6 h-full">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Clock01Icon} className="text-slate-500 size-4" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">Network Activity</h3>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow"></div>
             </div>
             
             <div className="space-y-6">
                {[
                  { title: "Catalog Synchronized", time: "2 min ago", icon: DatabaseIcon },
                  { title: "Inventory Refined", time: "14 min ago", icon: Sorting05Icon },
                  { title: "New Sector mapped", time: "1 hour ago", icon: Tag01Icon }
                ].map((act, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:border-primary/20 transition-all">
                      <HugeiconsIcon icon={act.icon} size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-300 tracking-tight leading-none mb-1 group-hover:text-white transition-colors">{act.title}</p>
                      <p className="text-xs font-medium text-slate-600 uppercase tracking-tighter">{act.time}</p>
                    </div>
                  </div>
                ))}
             </div>
          </Card>

        </motion.div>
      </div>

      {/* Primary Chart Visualization */}
      <motion.div variants={itemVariants}>
        <Card className="premium-card p-0 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <div className="p-8 border-b border-white/[0.03]">
             <div className="flex items-center justify-between">
                <div>
                   <CardTitle className="text-xl font-black text-white tracking-tighter">Sectoral Distribution</CardTitle>
                   <CardDescription className="text-slate-500 font-medium tracking-tight">Real-time analytical breakdown per operational department.</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                      <Activity size={12} className="text-primary" />
                      <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Live Telemetry</span>
                   </div>
                </div>
             </div>
          </div>

          <CardContent className="p-8">
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.productsByCategory}>
                   <defs>
                    <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#334155" 
                    fontSize={10} 
                    fontWeight={900} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#64748b', dy: 10 }}
                    style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                  <YAxis 
                    stroke="#334155" 
                    fontSize={10} 
                    fontWeight={900} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#64748b', dx: -10 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.03)' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(2, 6, 23, 0.95)', 
                      borderColor: 'rgba(255, 255, 255, 0.08)', 
                      borderRadius: '16px', 
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 40px -12px rgba(0,0,0,0.8)',
                      borderWidth: '1px'
                    }}
                    itemStyle={{ color: '#818cf8', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
                    labelStyle={{ color: '#fff', fontWeight: 900, marginBottom: '8px', fontSize: '12px' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#premiumGradient)" 
                    radius={[12, 12, 0, 0]} 
                    maxBarSize={60}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
