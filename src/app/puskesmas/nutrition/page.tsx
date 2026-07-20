"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Plus, 
  Trash2, 
  Table as TableIcon,
  Search,
  Database,
  Loader2,
  Save,
  Utensils,
  Leaf,
  Info
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast, ToastType } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { addMasterFoods, getMasterFoods, deleteMasterFood } from "@/lib/services/nutrition";
import { MasterFood } from "@/types/schema";

// --- DATA DUMMY (SEED) ---
const DUMMY_FOODS = [
  { code: "A001", name: "Nasi Putih", energyKJ: 544, protein: 2.7, fat: 0.3, carbs: 28 },
  { code: "B001", name: "Telur Ayam Rebus", energyKJ: 649, protein: 12.6, fat: 10.6, carbs: 1.1 },
  { code: "C001", name: "Tempe Kedelai Murni", energyKJ: 800, protein: 19, fat: 11, carbs: 9 },
  { code: "C002", name: "Tahu Putih Kukus", energyKJ: 330, protein: 8, fat: 4.8, carbs: 1.9 },
  { code: "D001", name: "Ikan Lele Goreng", energyKJ: 1050, protein: 18, fat: 15, carbs: 5 },
  { code: "D002", name: "Ikan Kembung Balado", energyKJ: 850, protein: 19, fat: 8, carbs: 4 },
  { code: "E001", name: "Sayur Bayam Bening", energyKJ: 150, protein: 1.5, fat: 0.2, carbs: 3 },
  { code: "E002", name: "Tumis Kangkung", energyKJ: 250, protein: 2, fat: 4, carbs: 3 },
  { code: "F001", name: "Pisang Ambon", energyKJ: 385, protein: 1, fat: 0.2, carbs: 23 },
  { code: "F002", name: "Pepaya Potong", energyKJ: 190, protein: 0.5, fat: 0, carbs: 10 },
  { code: "G001", name: "Daging Ayam Dada Rebus", energyKJ: 600, protein: 23, fat: 1.5, carbs: 0 },
  { code: "H001", name: "Hati Ayam Rebus", energyKJ: 650, protein: 24, fat: 6, carbs: 1 },
  { code: "K001", name: "Bubur Kacang Hijau", energyKJ: 450, protein: 7, fat: 0.5, carbs: 18 },
  { code: "S001", name: "Susu Sapi Segar", energyKJ: 270, protein: 3.2, fat: 3.5, carbs: 4.5 },
  { code: "U001", name: "Ubi Jalar Rebus", energyKJ: 480, protein: 1.5, fat: 0.5, carbs: 25 },
];

export default function NutritionPage() {
  const { userProfile } = useAuth();
  const [foods, setFoods] = useState<MasterFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "", type: "success", isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const [inputRows, setInputRows] = useState<Omit<MasterFood, "id" | "createdAt" | "puskesmasId">[]>([
    { code: "", name: "", energyKJ: 0, protein: 0, fat: 0, carbs: 0 }
  ]);

  const fetchData = async () => {
    if (!userProfile?.uid) return;
    try {
      const targetId = userProfile.puskesmasId || userProfile.uid; 
      const data = await getMasterFoods(targetId);
      setFoods(data);
    } catch (err) {
      showToast("Gagal mengambil data database makanan.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userProfile]);

  const handleRowChange = (index: number, field: keyof Omit<MasterFood, "id"| "createdAt"| "puskesmasId">, value: string) => {
    const updatedRows = [...inputRows];
    if (field === "code" || field === "name") {
      updatedRows[index][field] = value;
    } else {
      updatedRows[index][field] = value === "" ? 0 : parseFloat(value);
    }
    setInputRows(updatedRows);
  };

  const addRow = () => {
    setInputRows([...inputRows, { code: "", name: "", energyKJ: 0, protein: 0, fat: 0, carbs: 0 }]);
  };

  const removeRow = (index: number) => {
    setInputRows(inputRows.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.puskesmasId) return;

    const validRows = inputRows.filter(row => row.name.trim() !== "");
    if (validRows.length === 0) {
      showToast("Tabel bahan makanan tidak boleh kosong!", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await addMasterFoods(validRows, userProfile.puskesmasId);
      await fetchData();
      setIsModalOpen(false);
      setInputRows([{ code: "", name: "", energyKJ: 0, protein: 0, fat: 0, carbs: 0 }]); 
      showToast(`${validRows.length} Bahan makanan berhasil disimpan!`, "success");
    } catch (err) {
      showToast("Gagal menyimpan data ke database.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus ${name} dari database?`)) {
      try {
        await deleteMasterFood(id);
        await fetchData();
        showToast(`${name} dihapus.`, "info");
      } catch (err) {
        showToast("Gagal menghapus data.", "error");
      }
    }
  };

  const handleSeed = async () => {
    if (!userProfile?.puskesmasId) return;
    if (!confirm("Tambahkan 15 data bahan makanan standar (Nasi, Tempe, dll) ke database Anda?")) return;

    setIsSeeding(true);
    try {
        await addMasterFoods(DUMMY_FOODS, userProfile.puskesmasId);
        await fetchData();
        showToast("Database berhasil diisi dengan data standar! 🍲", "success");
    } catch (err) {
        showToast("Gagal melakukan seeding data.", "error");
    } finally {
        setIsSeeding(false);
    }
  };

  // --- SMART FILTERING ---
  const filteredFoods = useMemo(() => {
     let result = [...foods];
     if (searchTerm) {
         result = result.filter(f => 
             f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             f.code.toLowerCase().includes(searchTerm.toLowerCase())
         );
     }
     // Sort A-Z
     result.sort((a, b) => a.name.localeCompare(b.name));
     return result;
  }, [foods, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans pb-28 max-w-[1200px] mx-auto">
      
      {/* 1. COMPACT HERO SECTION */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 sm:p-8 shadow-lg shadow-emerald-900/20 overflow-hidden">
         <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
         <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
            <Utensils className="w-32 h-32 text-white transform rotate-12" />
         </div>

         <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2 w-full">
               <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                  <Leaf className="w-3 h-3" /> Master Data Gizi
               </div>
               <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">Database Nutrisi</h1>
               <p className="text-emerald-50 text-xs sm:text-sm max-w-md leading-relaxed font-medium">
                  Kelola referensi komposisi bahan makanan lokal yang akan digunakan oleh AI untuk menyusun rekomendasi resep orang tua.
               </p>
            </div>
            
            <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto shrink-0">
                <Button 
                    onClick={handleSeed} 
                    disabled={isSeeding || loading}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-none font-bold h-12 flex-1 sm:flex-none rounded-xl"
                >
                    {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
                    Seed Standar
                </Button>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-emerald-700 hover:bg-emerald-50 active:scale-95 border-0 shadow-lg font-black h-12 transition-transform flex-1 sm:flex-none rounded-xl"
                >
                   <Plus className="h-5 w-5 mr-1" />
                   Input Data
                </Button>
            </div>
         </div>
      </div>

      {/* 2. STICKY TOOLS SECTION (SEARCH BAR) */}
      <div className="sticky top-[60px] md:top-0 z-20 bg-slate-50/90 backdrop-blur-xl py-3 -mx-4 px-4 sm:mx-0 sm:px-0 space-y-3 shadow-sm border-b border-slate-200/50 md:border-0 md:shadow-none md:bg-transparent">
         <div className="flex items-center gap-4 bg-white p-1.5 sm:p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 ring-emerald-500/20 transition-all">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
               <Input 
                  placeholder="Cari bahan makanan (Contoh: Nasi, Telur, dll)" 
                  className="w-full pl-10 pr-4 h-12 bg-transparent border-0 outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="hidden sm:flex pr-4 text-[10px] font-black text-slate-400 border-l border-slate-100 pl-4 uppercase tracking-widest">
               Total: <span className="text-emerald-600 ml-1.5 text-xs">{filteredFoods.length}</span>
            </div>
         </div>
      </div>

      {/* 3. TABLE VIEWER CARD */}
      <Card className="border-slate-100 shadow-sm overflow-hidden bg-white rounded-3xl p-0">
         <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left whitespace-nowrap min-w-[700px]">
               <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <tr>
                     <th className="px-6 py-4 w-24">Kode</th>
                     <th className="px-6 py-4">Nama Bahan</th>
                     <th className="px-6 py-4 text-right">Energi (kJ)</th>
                     <th className="px-6 py-4 text-right text-blue-600">Protein (g)</th>
                     <th className="px-6 py-4 text-right text-amber-600">Lemak (g)</th>
                     <th className="px-6 py-4 text-right text-purple-600">Karbo (g)</th>
                     <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                     <tr>
                         <td colSpan={7} className="text-center py-16 text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                               <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                               <span className="font-bold tracking-widest uppercase text-[10px]">Memuat Database...</span>
                            </div>
                         </td>
                     </tr>
                  ) : filteredFoods.length === 0 ? (
                     <tr>
                         <td colSpan={7} className="text-center py-16 text-slate-400">
                            <div className="flex flex-col items-center gap-3 opacity-50">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                                    <Utensils className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="font-bold text-sm">Database masih kosong.</p>
                                <p className="text-[10px] tracking-widest uppercase">Klik 'Seed Standar' atau 'Input Data'</p>
                            </div>
                         </td>
                     </tr>
                  ) : (
                     filteredFoods.map((food) => (
                        <tr key={food.id} className="hover:bg-slate-50/80 transition-colors group">
                           <td className="px-6 py-4 font-mono text-slate-400 text-xs font-bold group-hover:text-emerald-600 transition-colors">{food.code || "-"}</td>
                           <td className="px-6 py-4 font-black text-slate-700 group-hover:text-slate-900">{food.name}</td>
                           <td className="px-6 py-4 text-right font-bold text-slate-600">{food.energyKJ}</td>
                           <td className="px-6 py-4 text-right font-black text-blue-500 bg-blue-50/30 group-hover:bg-blue-50/50 transition-colors">{food.protein}</td>
                           <td className="px-6 py-4 text-right font-black text-amber-500 bg-amber-50/30 group-hover:bg-amber-50/50 transition-colors">{food.fat}</td>
                           <td className="px-6 py-4 text-right font-black text-purple-500 bg-purple-50/30 group-hover:bg-purple-50/50 transition-colors">{food.carbs}</td>
                           <td className="px-6 py-4 text-center">
                              <button 
                                 onClick={() => handleDelete(food.id, food.name)}
                                 className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
                                 title="Hapus Item"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </Card>

      {/* --- MODAL INPUT (SPREADSHEET MODE) --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Input Database Nutrisi"
      >
        <form onSubmit={handleSubmit} className="space-y-6 px-1 pb-1">
           {/* Informasi Banner */}
           <div className="flex flex-col gap-2 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-emerald-800 font-black uppercase tracking-widest flex items-center gap-2">
                    <TableIcon className="w-4 h-4" /> Mode Spreadsheet
                </p>
                <Button type="button" size="sm" variant="outline" onClick={addRow} className="h-9 bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-200 shadow-sm rounded-xl font-bold">
                    <Plus className="w-3 h-3 mr-1" /> Baris Baru
                </Button>
              </div>
              <p className="text-[10px] text-emerald-600 font-medium leading-relaxed">
                 Masukkan nilai gizi per <strong>100 gram</strong> bahan makanan. Sumber data bisa menggunakan Tabel Komposisi Pangan Indonesia (TKPI).
              </p>
           </div>

           {/* Interactive Table Form */}
           <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-inner">
              <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
                <table className="w-full text-xs text-left min-w-[700px]">
                    <thead className="bg-slate-100 text-slate-500 font-black uppercase tracking-widest sticky top-0 z-10 text-[9px] shadow-sm">
                        <tr>
                            <th className="px-3 py-3.5 w-24">Kode</th>
                            <th className="px-3 py-3.5 min-w-[200px]">Nama Bahan</th>
                            <th className="px-3 py-3.5 w-20 text-right">kJ</th>
                            <th className="px-3 py-3.5 w-20 text-right">Prot (g)</th>
                            <th className="px-3 py-3.5 w-20 text-right">Lemak (g)</th>
                            <th className="px-3 py-3.5 w-20 text-right">Karbo (g)</th>
                            <th className="px-3 py-3.5 w-12 text-center"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {inputRows.map((row, index) => (
                        <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="p-2">
                                <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none uppercase font-mono text-center text-sm font-bold placeholder:text-slate-300 transition-all" placeholder="ID..." value={row.code} onChange={e => handleRowChange(index, "code", e.target.value)} />
                            </td>
                            <td className="p-2">
                                <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-black text-slate-800 placeholder:text-slate-300 transition-all" placeholder="Nama Bahan..." value={row.name} onChange={e => handleRowChange(index, "name", e.target.value)} />
                            </td>
                            <td className="p-2">
                                <input type="number" step="0.1" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none text-right font-bold text-slate-600 placeholder:text-slate-300 transition-all" placeholder="0" value={row.energyKJ || ""} onChange={e => handleRowChange(index, "energyKJ", e.target.value)} />
                            </td>
                            <td className="p-2">
                                <input type="number" step="0.1" className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-right font-black text-blue-600 placeholder:text-blue-300 transition-all" placeholder="0" value={row.protein || ""} onChange={e => handleRowChange(index, "protein", e.target.value)} />
                            </td>
                            <td className="p-2">
                                <input type="number" step="0.1" className="w-full p-2.5 bg-amber-50/50 border border-amber-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none text-right font-black text-amber-600 placeholder:text-amber-300 transition-all" placeholder="0" value={row.fat || ""} onChange={e => handleRowChange(index, "fat", e.target.value)} />
                            </td>
                            <td className="p-2">
                                <input type="number" step="0.1" className="w-full p-2.5 bg-purple-50/50 border border-purple-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 outline-none text-right font-black text-purple-600 placeholder:text-purple-300 transition-all" placeholder="0" value={row.carbs || ""} onChange={e => handleRowChange(index, "carbs", e.target.value)} />
                            </td>
                            <td className="p-2 text-center">
                                <button type="button" onClick={() => removeRow(index)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent" disabled={inputRows.length === 1}>
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
              </div>
           </div>

           <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 border-t border-slate-100">
             <Button type="button" variant="outline" className="h-12 rounded-xl text-slate-600 border-slate-200 font-bold hover:bg-slate-50 w-full sm:w-auto" onClick={() => setIsModalOpen(false)}>Batal</Button>
             <Button type="submit" isLoading={isSubmitting} className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white px-8 shadow-lg shadow-emerald-200 rounded-xl font-black w-full sm:w-auto">
               <Save className="w-4 h-4 mr-2" /> Simpan Database
             </Button>
           </div>
        </form>
      </Modal>

      <Toast 
         message={toast.message} type={toast.type} isVisible={toast.isVisible} 
         onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
    </div>
  );
}