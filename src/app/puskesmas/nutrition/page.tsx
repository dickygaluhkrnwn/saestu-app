"use client";

import { useState, useEffect } from "react";
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
  Leaf
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast, ToastType } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card"; // Added Card import

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

  const filteredFoods = foods.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 font-sans">
      
      {/* --- HERO HEADER (New Design) --- */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 shadow-xl text-white overflow-hidden">
         <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Utensils className="w-48 h-48 text-white transform translate-x-10 -translate-y-10" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs font-semibold mb-3 !text-white">
                  <Leaf className="w-4 h-4" />
                  <span>Master Data Gizi</span>
               </div>
               <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 !text-white">
                  Database Nutrisi
               </h1>
               <p className="text-emerald-50 max-w-lg opacity-90 !text-white">
                  Kelola referensi bahan makanan lokal yang akan digunakan oleh AI untuk rekomendasi menu.
               </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                    onClick={handleSeed} 
                    disabled={isSeeding || loading}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-none font-semibold h-12 px-5 rounded-2xl"
                >
                    {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
                    Seed Standar
                </Button>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-emerald-700 hover:bg-emerald-50 border-0 shadow-lg font-bold h-12 px-6 rounded-2xl"
                >
                   <Plus className="h-5 w-5 mr-2" />
                   Input Data
                </Button>
            </div>
         </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 ring-emerald-500/20 transition-all">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
               placeholder="Cari bahan makanan (Contoh: Beras, Telur, ZIN...)" 
               className="w-full pl-10 pr-4 py-3 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="hidden sm:flex pr-4 text-xs font-bold text-slate-400 border-l border-slate-100 pl-4 uppercase tracking-widest">
            Total Item: <span className="text-emerald-600 ml-1.5">{filteredFoods.length}</span>
         </div>
      </div>

      {/* --- TABLE VIEWER (Styled Card) --- */}
      <Card className="border-0 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
               <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
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
               <tbody className="divide-y divide-slate-100 bg-white">
                  {loading ? (
                     <tr><td colSpan={7} className="text-center py-12 text-slate-400 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                        Memuat data...
                     </td></tr>
                  ) : filteredFoods.length === 0 ? (
                     <tr><td colSpan={7} className="text-center py-16 text-slate-400">
                        <div className="flex flex-col items-center gap-3 opacity-50">
                            <Utensils className="h-12 w-12" />
                            <p className="font-medium">Database kosong.</p>
                        </div>
                     </td></tr>
                  ) : (
                     filteredFoods.map((food) => (
                        <tr key={food.id} className="hover:bg-slate-50/80 transition-colors group">
                           <td className="px-6 py-4 font-mono text-slate-400 text-xs group-hover:text-emerald-600 transition-colors">{food.code || "-"}</td>
                           <td className="px-6 py-4 font-bold text-slate-700 group-hover:text-slate-900">{food.name}</td>
                           <td className="px-6 py-4 text-right font-medium text-slate-600">{food.energyKJ}</td>
                           <td className="px-6 py-4 text-right font-bold text-blue-600/80 group-hover:text-blue-600">{food.protein}</td>
                           <td className="px-6 py-4 text-right font-bold text-amber-600/80 group-hover:text-amber-600">{food.fat}</td>
                           <td className="px-6 py-4 text-right font-bold text-purple-600/80 group-hover:text-purple-600">{food.carbs}</td>
                           <td className="px-6 py-4 text-center">
                              <button 
                                 onClick={() => handleDelete(food.id, food.name)}
                                 className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
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

      {/* --- MODAL INPUT --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Input Database Nutrisurvey"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="flex flex-col gap-2 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <div className="flex justify-between items-center">
                <p className="text-xs text-emerald-800 font-bold uppercase tracking-widest flex items-center gap-2">
                    <TableIcon className="w-4 h-4" /> Mode Spreadsheet
                </p>
                <Button type="button" size="sm" variant="outline" onClick={addRow} className="h-8 bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-200 shadow-sm">
                    <Plus className="w-3 h-3 mr-1" /> Baris Baru
                </Button>
              </div>
              <p className="text-[10px] text-emerald-600 leading-relaxed">
                 Masukkan nilai gizi per <strong>100 gram</strong> bahan makanan. Gunakan data dari Tabel Komposisi Pangan Indonesia (TKPI) atau label kemasan.
              </p>
           </div>

           <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-inner">
              <div className="max-h-[40vh] overflow-y-auto">
                <table className="w-full text-xs text-left min-w-[600px]">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                        <tr>
                        <th className="px-3 py-3 w-20">Kode</th>
                        <th className="px-3 py-3">Nama Bahan</th>
                        <th className="px-3 py-3 w-16 text-right">kJ</th>
                        <th className="px-3 py-3 w-16 text-right">Prot</th>
                        <th className="px-3 py-3 w-16 text-right">Fat</th>
                        <th className="px-3 py-3 w-16 text-right">Carb</th>
                        <th className="px-3 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {inputRows.map((row, index) => (
                        <tr key={index} className="group hover:bg-slate-50 transition-colors">
                            <td className="p-2">
                                <input className="w-full p-2 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none uppercase font-mono text-center placeholder:text-slate-300" placeholder="A..." value={row.code} onChange={e => handleRowChange(index, "code", e.target.value)} />
                            </td>
                            <td className="p-2">
                                <input className="w-full p-2 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-medium placeholder:text-slate-300" placeholder="Nama..." value={row.name} onChange={e => handleRowChange(index, "name", e.target.value)} />
                            </td>
                            <td className="p-2">
                                <input type="number" className="w-full p-2 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-right placeholder:text-slate-300" placeholder="0" value={row.energyKJ || ""} onChange={e => handleRowChange(index, "energyKJ", e.target.value)} />
                            </td>
                            <td className="p-2">
                                <input type="number" className="w-full p-2 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-right placeholder:text-slate-300" placeholder="0" value={row.protein || ""} onChange={e => handleRowChange(index, "protein", e.target.value)} />
                            </td>
                            <td className="p-2">
                                <input type="number" className="w-full p-2 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-right placeholder:text-slate-300" placeholder="0" value={row.fat || ""} onChange={e => handleRowChange(index, "fat", e.target.value)} />
                            </td>
                            <td className="p-2">
                                <input type="number" className="w-full p-2 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-right placeholder:text-slate-300" placeholder="0" value={row.carbs || ""} onChange={e => handleRowChange(index, "carbs", e.target.value)} />
                            </td>
                            <td className="p-2 text-center">
                                <button type="button" onClick={() => removeRow(index)} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" disabled={inputRows.length === 1}>
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
              </div>
           </div>

           <div className="pt-2 flex justify-end gap-3">
             <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
             <Button type="submit" isLoading={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 px-6">
               <Save className="w-4 h-4 mr-2" /> Simpan Data
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