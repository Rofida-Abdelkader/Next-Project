"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ShoppingBag01Icon, 
  Mail02Icon, 
  LockPasswordIcon, 
  ArrowRight01Icon,
  SparklesIcon
} from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Connection failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden relative font-sans">
      {/* Premium Shell Overlays */}
      <div className="noise fixed inset-0 z-[100] opacity-[0.02]" />
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/[0.08] blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/[0.04] blur-[120px] rounded-full" />
      
      {/* Dynamic Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)] opacity-30"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] px-6 relative z-10"
      >
        <Card className="glass-elevated border-white/[0.08] shadow-premium overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
          
          <CardHeader className="text-center pb-8 pt-12">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-indigo-700 rounded-3xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-500 rotate-3 group-hover:rotate-0">
                  <HugeiconsIcon 
                    icon={ShoppingBag01Icon} 
                    size={36} 
                    className="text-white" 
                    strokeWidth={2.5}
                  />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md flex items-center justify-center text-primary"
                >
                   <HugeiconsIcon icon={SparklesIcon} size={14} />
                </motion.div>
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-white tracking-tighter text-gradient leading-none">
              Welcome back
            </CardTitle>
            <CardDescription className="text-slate-500 mt-2 text-base font-medium tracking-tight">
              Re-establish neural link to nexus_admin.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 px-10 pb-10">
            {error && (
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-red-500/10 border border-red-500/15 text-red-500 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                {error}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">
                  Access Portal / Email
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">
                    <HugeiconsIcon icon={Mail02Icon} size={18} strokeWidth={2.5} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="id@nexus.systems"
                    required
                    className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-700 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 h-14 pl-12 rounded-2xl transition-all text-sm font-bold"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">
                  Security Key / Password
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">
                    <HugeiconsIcon icon={LockPasswordIcon} size={18} strokeWidth={2.5} />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-700 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 h-14 pl-12 rounded-2xl transition-all text-sm font-bold"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all duration-500 shadow-glow hover:translate-y-[-2px] active:scale-95 flex items-center justify-center gap-3 group text-xs uppercase tracking-[0.2em]"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Initialize Link
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-white/[0.03] py-8 bg-white/[0.01]">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
              Need authentication?{" "}
              <Link href="/register" className="text-primary hover:text-indigo-400 transition-colors ml-2">
                Create new ID
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Global Status Footer */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="px-4 py-1.5 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-glow"></div>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">All systems operational</span>
        </div>
      </div>
    </div>
  );
}
