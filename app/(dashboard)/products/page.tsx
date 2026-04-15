"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Edit02Icon, 
  ShoppingBag01Icon,
  Sorting05Icon,
  AlertCircleIcon,
  Tick01Icon,
  Delete02Icon as Trash01Icon,
  ArchiveIcon,
  Package01Icon as PackageIcon,
  Search01Icon as SearchIcon,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/dashboard/empty-state";

type Category = { _id: string; name: string };
type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  brand: string;
  rating: number;
  numReviews: number;
  category: Category;
  status: "active" | "draft" | "archived";
  createdAt: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    brand: "",
    rating: 0,
    numReviews: 0,
    category: "",
    status: "active",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(prodData.products || []);
      setCategories(catData.categories || []);
    } catch (e: unknown) {
      toast.error("Failed to sync inventory data.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (p?: Product) => {
    if (p) {
      setForm({
        id: p._id,
        name: p.name,
        description: p.description,
        price: p.price,
        discount: p.discount,
        stock: p.stock,
        brand: p.brand || "",
        rating: p.rating || 0,
        numReviews: p.numReviews || 0,
        category: p.category?._id || "",
        status: p.status,
      });
    } else {
      setForm({
        id: "",
        name: "",
        description: "",
        price: 0,
        discount: 0,
        stock: 0,
        brand: "",
        rating: 0,
        numReviews: 0,
        category: categories.length > 0 ? categories[0]._id : "",
        status: "active",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) {
      toast.warning("Select a category first.");
      return;
    }
    setSaving(true);

    try {
      const isUpdating = !!form.id;
      const url = isUpdating ? `/api/products/${form.id}` : "/api/products";
      const method = isUpdating ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process request");

      if (isUpdating) {
        setProducts((prev) => prev.map((item) => (item._id === form.id ? data.product : item)));
        toast.success("Product updated successfully.");
      } else {
        setProducts((prev) => [data.product, ...prev]);
        toast.success("New product added to catalog.");
      }
      setShowModal(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error saving product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this product?")) return;
    const promise = fetch(`/api/products/${id}`, { method: "DELETE" });
    toast.promise(promise, {
      loading: 'Removing product...',
      success: (res) => {
        if (!res.ok) throw new Error("Delete failed");
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setSelectedIds(prev => prev.filter(sid => sid !== id));
        return 'Product has been purged.';
      },
      error: 'Failed to delete product.',
    });
  };

  const handleBatchDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    
    // In a real app, use a batch API. For now, sequential or simulated.
    toast.loading(`Purging ${selectedIds.length} assets...`);
    try {
      await Promise.all(selectedIds.map(id => fetch(`/api/products/${id}`, { method: "DELETE" })));
      setProducts(prev => prev.filter(p => !selectedIds.includes(p._id)));
      setSelectedIds([]);
      toast.dismiss();
      toast.success("Batch operation completed successfully.");
    } catch (e) {
      toast.dismiss();
      toast.error("Batch operation partially failed.");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || p.category?._id === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 glass shadow-glow rounded-2xl flex items-center justify-center text-primary border-primary/20">
            <HugeiconsIcon icon={ShoppingBag01Icon} size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Inventory Shell</h1>
            <p className="text-slate-500 font-medium">Global asset management and stock synchronization.</p>
          </div>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          className="bg-primary hover:bg-primary/90 text-white shadow-glow h-11 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:translate-y-[-2px] active:scale-95"
        >
          <PlusIcon size={18} strokeWidth={3} className="mr-2" /> 
          Archive New Asset
        </Button>
      </div>

      {/* Advanced Filters Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-3">
          <HugeiconsIcon icon={SearchIcon} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 size-4" />
          <Input
            placeholder="Scan catalog by asset name or internal SKU..."
            className="pl-12 bg-white/[0.03] border-white/10 text-white focus:ring-primary/20 focus:border-primary/50 h-14 rounded-2xl transition-all font-medium placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="bg-white/[0.03] border-white/10 text-white h-14 rounded-2xl">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={FilterIcon} className="size-4 text-slate-500" />
              <SelectValue placeholder="Department" />
            </div>
          </SelectTrigger>
          <SelectContent className="glass-elevated border-white/10 text-slate-200">
            <SelectItem value="all">All Sectors</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Table Layer */}
      <Card className="glass border-white/[0.04] shadow- premium overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.02] blur-[120px] rounded-full pointer-events-none"></div>
        <CardContent className="p-0 relative z-10">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/[0.05] hover:bg-transparent">
                <TableHead className="w-12 px-6">
                   <Checkbox 
                     checked={selectedIds.length > 0 && selectedIds.length === filteredProducts.length}
                     onCheckedChange={toggleSelectAll}
                     className="border-white/20 data-[state=checked]:bg-primary"
                   />
                </TableHead>
                <TableHead className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] py-6 px-4">Asset Cluster</TableHead>
                <TableHead className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] py-6">Sector</TableHead>
                <TableHead className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] py-6 text-center">Unit Price</TableHead>
                <TableHead className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] py-6">Status</TableHead>
                <TableHead className="text-right text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] py-6 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell colSpan={6} className="h-96 text-center">
                    <div className="flex flex-col items-center justify-center gap-6">
                      <div className="w-12 h-12 border-[3px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
                      <span className="text-slate-500 font-black tracking-[0.2em] text-[10px] uppercase animate-shimmer">Synchronizing catalogue...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell colSpan={6} className="h-96 p-0">
                    <EmptyState 
                      icon={ShoppingBag01Icon}
                      title="No Assets Found"
                      description={searchTerm ? "Your current search parameters returned no results in this sector." : "Your inventory is currently empty. Start archiving new products."}
                      actionLabel={searchTerm ? "Reset Search" : "Archive Product"}
                      onAction={searchTerm ? () => {setSearchTerm(""); setFilterCategory("all")} : () => handleOpenModal()}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((p) => (
                  <TableRow 
                    key={p._id} 
                    className={`border-white/[0.03] hover:bg-white/[0.02] transition-colors group ${selectedIds.includes(p._id) ? 'bg-primary/5' : ''}`}
                  >
                    <TableCell className="px-6">
                       <Checkbox 
                         checked={selectedIds.includes(p._id)}
                         onCheckedChange={() => toggleSelectOne(p._id)}
                         className="border-white/20 data-[state=checked]:bg-primary"
                       />
                    </TableCell>
                    <TableCell className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/[0.03] rounded-xl flex items-center justify-center text-slate-500 border border-white/[0.06] group-hover:text-primary group-hover:border-primary/20 transition-all">
                          <HugeiconsIcon icon={PackageIcon} size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-100 group-hover:text-white transition-colors tracking-tight">{p.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                             <div className="text-[10px] text-primary/80 font-black uppercase tracking-widest">{p.brand || "UNBRANDED"}</div>
                             <div className="w-1 h-1 rounded-full bg-white/10"></div>
                             <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest truncate max-w-[150px]">
                              {p.description.slice(0, 30)}...
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                        <span className="text-xs font-bold text-slate-400 capitalize">{p.category?.name || "Independent"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-black text-white text-base">${p.price.toLocaleString()}</div>
                      {p.discount > 0 && (
                        <div className="text-[9px] text-emerald-400 font-black bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-1 uppercase border border-emerald-500/10">
                          {p.discount}% Yield
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                             p.status === 'active' ? 'bg-emerald-500 shadow-glow animate-pulse' : 
                             p.status === 'draft' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
                             'bg-slate-500'
                          }`}></div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.status}</span>
                        </div>
                        <span className={`text-[10px] font-bold ${p.stock > 10 ? 'text-slate-600' : 'text-red-400'}`}>
                          {p.stock} Units Stocked
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                           <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded-md">
                              <span className="text-[9px] font-black text-amber-500">★</span>
                              <span className="text-[9px] font-black text-slate-400">{p.rating || 0}</span>
                           </div>
                           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">({p.numReviews || 0} Reviews)</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                       <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenModal(p)}
                          className="h-10 w-10 text-slate-500 hover:text-white hover:bg-white/[0.05] rounded-xl"
                        >
                          <HugeiconsIcon icon={Edit02Icon} size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(p._id)}
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
                <span className="text-sm font-bold text-white tracking-tight uppercase whitespace-nowrap">Assets Selected</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-xl font-bold text-xs uppercase tracking-widest px-4 h-10 gap-2">
                   <HugeiconsIcon icon={ArchiveIcon} size={16} /> Archive
                </Button>
                <div className="w-px h-6 bg-white/[0.08]" />
                <Button 
                  onClick={handleBatchDelete}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-bold text-xs uppercase tracking-widest px-4 h-10 gap-2"
                >
                   <HugeiconsIcon icon={Trash01Icon} size={16} /> Batch Purge
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

      {/* Modal - Pro Design Assembly */}
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
              className="w-full max-w-2xl px-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="glass-elevated border-white/10 shadow-premium overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-8 p-10">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-glow">
                        {form.id ? <HugeiconsIcon icon={Edit02Icon} size={24} /> : <PlusIcon size={24} strokeWidth={3} />}
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-black text-white tracking-tighter">
                          {form.id ? "Sync System Metadata" : "Initialize New Asset"}
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-medium text-base mt-1">
                          Define core parameters and inventory deployment specifications.
                        </CardDescription>
                      </div>
                   </div>
                </CardHeader>
                
                <CardContent className="p-10 pt-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="col-span-full space-y-3">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Asset Nomenclature</Label>
                        <Input 
                          required 
                          className="bg-white/[0.03] border-white/10 text-white h-14 rounded-2xl focus:ring-primary/20 transition-all font-bold text-lg" 
                          value={form.name} 
                          onChange={(e) => setForm({ ...form, name: e.target.value })} 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Brand Identifier</Label>
                        <Input 
                          placeholder="e.g. Nexus Corp, Archive Labs..."
                          className="bg-white/[0.03] border-white/10 text-white h-14 rounded-2xl focus:ring-primary/20 transition-all font-bold" 
                          value={form.brand} 
                          onChange={(e) => setForm({ ...form, brand: e.target.value })} 
                        />
                      </div>
                      
                      <div className="col-span-full space-y-3">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Product Manifest</Label>
                        <textarea 
                          required 
                          className="w-full min-h-[140px] bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-slate-200 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-slate-700 resize-none" 
                          placeholder="Specify exact technical details and market description..."
                          value={form.description} 
                          onChange={(e) => setForm({ ...form, description: e.target.value })} 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Allocation Sector</Label>
                        <select 
                          required 
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl h-14 px-4 text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer font-bold"
                          value={form.category} 
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                        >
                          <option value="" disabled className="bg-slate-950">Select Sector</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c._id} className="bg-slate-950">{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Lifecycle Index</Label>
                        <select 
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl h-14 px-4 text-slate-200 focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer font-bold"
                          value={form.status} 
                          onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                        >
                          <option value="active" className="bg-slate-950 text-emerald-400">√ Active (Live)</option>
                          <option value="draft" className="bg-slate-950 text-amber-500">? Staging (Draft)</option>
                          <option value="archived" className="bg-slate-950 text-slate-500">X Legacy (Archived)</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Valuation ($)</Label>
                        <Input 
                          required 
                          type="number" 
                          className="bg-white/[0.03] border-white/10 text-white h-14 rounded-2xl font-black text-xl" 
                          value={form.price} 
                          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Stock Load</Label>
                        <Input 
                          required 
                          type="number" 
                          className="bg-white/[0.03] border-white/10 text-white h-14 rounded-2xl font-black text-xl" 
                          value={form.stock} 
                          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Market Yield (%)</Label>
                        <Input 
                          type="number" 
                          className="bg-white/[0.03] border-white/10 text-emerald-400 h-14 rounded-2xl font-black text-xl focus:ring-emerald-500/20" 
                          value={form.discount} 
                          onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Initial Rating</Label>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="0"
                          max="5"
                          className="bg-white/[0.03] border-white/10 text-white h-14 rounded-2xl font-black text-xl" 
                          value={form.rating} 
                          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Total Reviews</Label>
                        <Input 
                          type="number" 
                          className="bg-white/[0.03] border-white/10 text-white h-14 rounded-2xl font-black text-xl" 
                          value={form.numReviews} 
                          onChange={(e) => setForm({ ...form, numReviews: Number(e.target.value) })} 
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-10 border-t border-white/5 mt-10">
                      <Button 
                        type="button" 
                        variant="ghost"
                        onClick={() => setShowModal(false)}
                        className="text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl px-8 h-12 font-bold uppercase tracking-widest text-xs"
                      >
                        Rollback
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90 text-white font-black rounded-2xl px-12 h-12 shadow-glow flex items-center gap-3 transition-all"
                        disabled={saving}
                      >
                        {saving ? "SYNCHRONIZING..." : "COMMIT METADATA"}
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
