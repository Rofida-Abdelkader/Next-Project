"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Edit02Icon, 
  Layers01Icon,
  Tick01Icon,
  Calendar01Icon,
  Delete02Icon as Trash01Icon,
  Add01Icon,
  Search01Icon as SearchIcon,
  ArchiveIcon,
  FilterIcon
} from "@hugeicons/core-free-icons";
import { 
  Plus as PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/dashboard/empty-state";

type Category = { _id: string; name: string; createdAt: string };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ id: "", name: "" });
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e: unknown) {
      toast.error("Failed to synchronize departments.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setForm({ id: cat._id, name: cat.name });
    } else {
      setForm({ id: "", name: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warning("Department name cannot be empty.");
      return;
    }
    setSaving(true);

    try {
      const isUpdating = !!form.id;
      const url = isUpdating ? `/api/categories/${form.id}` : "/api/categories";
      const method = isUpdating ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Operation failed");

      if (isUpdating) {
        setCategories((prev) => prev.map((c) => (c._id === form.id ? data.category : c)));
        toast.success("Department profile updated.");
      } else {
        setCategories((prev) => [...prev, data.category]);
        toast.success("New department established.");
      }
      setShowModal(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Security protocol error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm decommissioning of this department?")) return;
    const promise = fetch(`/api/categories/${id}`, { method: "DELETE" });
    toast.promise(promise, {
      loading: 'Exiting department...',
      success: (res) => {
        if (!res.ok) throw new Error("Deletion failed");
        setCategories((prev) => prev.filter((c) => c._id !== id));
        setSelectedIds(prev => prev.filter(sid => sid !== id));
        return 'Department successfully decommissioned.';
      },
      error: 'Decommissioning failed. Ensure no active assets are linked.',
    });
  };

  const handleBatchDelete = async () => {
    if (!confirm(`Decommission ${selectedIds.length} departments?`)) return;
    toast.loading(`Purging ${selectedIds.length} sectors...`);
    try {
      await Promise.all(selectedIds.map(id => fetch(`/api/categories/${id}`, { method: "DELETE" })));
      setCategories(prev => prev.filter(c => !selectedIds.includes(c._id)));
      setSelectedIds([]);
      toast.dismiss();
      toast.success("Batch decommission completed.");
    } catch (e) {
      toast.dismiss();
      toast.error("Batch operation partially failed.");
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCategories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCategories.map(c => c._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 glass shadow-glow rounded-2xl flex items-center justify-center text-primary border-primary/20">
            <HugeiconsIcon icon={Layers01Icon} size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Department Hub</h1>
            <p className="text-slate-500 font-medium">Categorization engine and sector mapping.</p>
          </div>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          className="bg-primary hover:bg-primary/90 text-white shadow-glow h-11 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:translate-y-[-2px] active:scale-95"
        >
          <PlusIcon size={18} strokeWidth={3} className="mr-2" /> 
          Map New Sector
        </Button>
      </div>

      {/* Advanced Filter Layer */}
      <div className="relative max-w-2xl">
        <HugeiconsIcon icon={SearchIcon} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 size-4" />
        <Input
          placeholder="Filter operational sectors by designation..."
          className="pl-12 bg-white/[0.03] border-white/10 text-white focus:ring-primary/20 focus:border-primary/50 h-14 rounded-2xl transition-all font-medium placeholder:text-slate-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Data Layer */}
      <Card className="glass border-white/[0.04] shadow-premium overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.02] blur-[120px] rounded-full pointer-events-none"></div>
        <CardContent className="p-0 relative z-10">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/[0.05] hover:bg-transparent">
                <TableHead className="w-12 px-6">
                   <Checkbox 
                     checked={selectedIds.length > 0 && selectedIds.length === filteredCategories.length}
                     onCheckedChange={toggleSelectAll}
                     className="border-white/20 data-[state=checked]:bg-primary"
                   />
                </TableHead>
                <TableHead className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] py-6 px-4">Sector Designation</TableHead>
                <TableHead className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] py-6">Operational Status</TableHead>
                <TableHead className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] py-6 text-center">Protocol Date</TableHead>
                <TableHead className="text-right text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] py-6 pr-8">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell colSpan={5} className="h-96 text-center">
                    <div className="flex flex-col items-center justify-center gap-6">
                      <div className="w-12 h-12 border-[3px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
                      <span className="text-slate-500 font-black tracking-[0.2em] text-[10px] uppercase animate-shimmer">Scanning sector signals...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell colSpan={5} className="h-96 p-0">
                    <EmptyState 
                      icon={Layers01Icon}
                      title="No Sectors Detected"
                      description={searchTerm ? "Your filter parameters returned no active sectors in the nexus." : "The categorization engine is currently idle. Establish a new sector."}
                      actionLabel={searchTerm ? "Reset Filter" : "Initialize Sector"}
                      onAction={searchTerm ? () => setSearchTerm("") : () => handleOpenModal()}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((cat) => (
                  <TableRow 
                    key={cat._id} 
                    className={`border-white/[0.03] hover:bg-white/[0.02] transition-colors group ${selectedIds.includes(cat._id) ? 'bg-primary/5' : ''}`}
                  >
                    <TableCell className="px-6">
                       <Checkbox 
                         checked={selectedIds.includes(cat._id)}
                         onCheckedChange={() => toggleSelectOne(cat._id)}
                         className="border-white/20 data-[state=checked]:bg-primary"
                       />
                    </TableCell>
                    <TableCell className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-primary/40 font-black text-[10px] uppercase group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary transition-all">
                          {cat.name.slice(0, 2)}
                        </div>
                        <div className="font-bold text-slate-100 uppercase tracking-tight group-hover:text-white transition-colors">
                          {cat.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow animate-pulse"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Mission Active</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg">
                        <HugeiconsIcon icon={Calendar01Icon} size={12} className="text-slate-600" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {new Date(cat.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit'
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                       <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenModal(cat)}
                          className="h-10 w-10 text-slate-500 hover:text-white hover:bg-white/[0.05] rounded-xl"
                        >
                          <HugeiconsIcon icon={Edit02Icon} size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(cat._id)}
                          className="h-10 w-10 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                        >
                          <HugeiconsIcon icon={Trash01Icon} size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

       {/* Floating Batch Actions Bar */}
       <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-fit"
          >
            <div className="glass-elevated border-primary/30 rounded-2xl px-8 h-16 flex items-center justify-between gap-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm">
                  {selectedIds.length}
                </div>
                <span className="text-sm font-bold text-white tracking-tight uppercase whitespace-nowrap">Sectors Selected</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-xl font-bold text-xs uppercase tracking-widest px-4 h-10 gap-2">
                   <HugeiconsIcon icon={ArchiveIcon} size={16} /> Mark Inactive
                </Button>
                <div className="w-px h-6 bg-white/[0.08]" />
                <Button 
                  onClick={handleBatchDelete}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-bold text-xs uppercase tracking-widest px-4 h-10 gap-2"
                >
                   <HugeiconsIcon icon={Trash01Icon} size={16} /> Batch Decommission
                </Button>
              </div>
              <Button 
                onClick={() => setSelectedIds([])}
                variant="ghost" 
                className="text-slate-600 hover:text-slate-400 ml-2"
              >
                 Deselect All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal - Advanced Configuration Shell */}
      <AnimatePresence>
        {showModal && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="w-full max-w-sm px-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="glass-elevated border-white/10 shadow-premium overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-8 p-10">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-glow">
                        {form.id ? <HugeiconsIcon icon={Edit02Icon} size={24} /> : <HugeiconsIcon icon={Add01Icon} size={24} />}
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black text-white tracking-tighter uppercase">
                          {form.id ? "Alter Sector" : "Map New Sector"}
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-medium text-sm mt-1">
                          Configure department designation metadata.
                        </CardDescription>
                      </div>
                   </div>
                </CardHeader>
                
                <CardContent className="p-10 pt-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Sector Nomenclature</Label>
                      <Input 
                        required 
                        placeholder="e.g. HIGH_FREQUENCY_LIQUIDS"
                        className="bg-white/[0.03] border-white/10 text-white h-16 rounded-2xl focus:ring-primary/20 transition-all font-black text-xl uppercase tracking-tighter px-6" 
                        value={form.name} 
                        onChange={(e) => setForm({ ...form, name: e.target.value })} 
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-8 border-t border-white/5 mt-8">
                      <Button 
                        type="button" 
                        variant="ghost"
                        onClick={() => setShowModal(false)}
                        className="text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl px-6 h-12 font-bold uppercase tracking-widest text-xs"
                      >
                        Abort
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90 text-white font-black rounded-2xl px-10 h-12 shadow-glow flex items-center gap-3 transition-all"
                        disabled={saving}
                      >
                        {saving ? "SYNCING..." : form.id ? "UPDATE SIGNAL" : "COMMIT SECTOR"}
                        {!saving && <HugeiconsIcon icon={Tick01Icon} size={18} strokeWidth={3} />}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
