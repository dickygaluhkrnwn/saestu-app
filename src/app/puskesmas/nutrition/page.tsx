"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Plus, 
  Trash2, 
  Utensils, 
  Table as TableIcon,
  Search,
  Database
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast, ToastType } from "@/components/ui/Toast";

import { addMasterFoods, getMasterFoods, deleteMasterFood } from "@/lib/services/nutrition";
import { MasterFood } from "@/types/schema";

export default function NutritionPage() {
  const { userProfile } = useAuth();
  const [foods, setFoods] = useState<MasterFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "", type: "success", isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  // State Khusus untuk Tabel Input (Multiple Rows)
  const [inputRows, setInputRows] = useState<Omit<MasterFood, "id" | "createdAt" | "puskesmasId">[]>([
    { code: "", name: "", energyKJ: 0, protein: 0, fat: 0, carbs: 0 }
  ]);

  const fetchData = async () => {
    if (!userProfile?.uid) return;
    try {
      const data = await getMasterFoods(userProfile.uid);
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

  // Handler untuk Form Grid Input
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
    if (!userProfile?.uid) return;

    // Bersihkan data yang kosong (nama belum diisi)
    const validRows = inputRows.filter(row => row.name.trim() !== "");
    if (validRows.length === 0) {
      showToast("Tabel bahan makanan tidak boleh kosong!", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await addMasterFoods(validRows, userProfile.uid);
      await fetchData();
      setIsModalOpen(false);
      setInputRows([{ code: "", name: "", energyKJ: 0, protein: 0, fat: 0, carbs: 0 }]); // Reset
      showToast(`${validRows.length} Bahan makanan berhasil disimpan ke database!`, "success");
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

  const filteredFoods = foods.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Database className="w-6 h-6 text-emerald-600" />
             Master Database Gizi
          </h1>
          <p className="text-slate-500 text-sm mt-1">
             Kelola referensi bahan makanan lokal (Format Nutrisurvey) yang akan digunakan oleh AI.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          Input Data Massal
        </Button>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
               placeholder="Cari berdasarkan nama atau kode bahan (Cth: kemiri, ZIN...)" 
               className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-sm text-slate-700"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="hidden sm:block px-4 border-l border-slate-200 text-xs font-bold text-slate-400">
            Total Item: <span className="text-emerald-600">{filteredFoods.length}</span>
         </div>
      </div>

      {/* --- TABLE VIEWER --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
               <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4 font-bold w-24">Code</th>
                     <th className="px-6 py-4 font-bold">Foods (Nama Bahan)</th>
                     <th className="px-6 py-4 font-bold text-right">Energy (kJ)</th>
                     <th className="px-6 py-4 font-bold text-right text-blue-600">Protein (g)</th>
                     <th className="px-6 py-4 font-bold text-right text-amber-600">Fat (g)</th>
                     <th className="px-6 py-4 font-bold text-right text-purple-600">Carbs (g)</th>
                     <th className="px-6 py-4 font-bold text-center">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {loading ? (
                     <tr><td colSpan={7} className="text-center py-8 text-slate-400">Memuat database...</td></tr>
                  ) : filteredFoods.length === 0 ? (
                     <tr><td colSpan={7} className="text-center py-12 text-slate-400">Database masih kosong. Silakan tambah data.</td></tr>
                  ) : (
                     filteredFoods.map((food) => (
                        <tr key={food.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-3 font-mono text-slate-500 text-xs">{food.code || "-"}</td>
                           <td className="px-6 py-3 font-bold text-slate-800">{food.name}</td>
                           <td className="px-6 py-3 text-right font-medium text-slate-600">{food.energyKJ}</td>
                           <td className="px-6 py-3 text-right font-medium text-blue-600">{food.protein}</td>
                           <td className="px-6 py-3 text-right font-medium text-amber-600">{food.fat}</td>
                           <td className="px-6 py-3 text-right font-medium text-purple-600">{food.carbs}</td>
                           <td className="px-6 py-3 text-center">
                              <button 
                                 onClick={() => handleDelete(food.id, food.name)}
                                 className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
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
      </div>

      {/* --- MODAL INPUT (SPREADSHEET MODE) --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Input Database Nutrisurvey"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <p className="text-xs text-emerald-800 font-medium flex items-center gap-2">
                 <TableIcon className="w-4 h-4" />
                 Masukkan nilai per 100 gram bahan matang/mentah.
              </p>
              <Button type="button" size="sm" variant="outline" onClick={addRow} className="h-8 bg-white">
                 <Plus className="w-3 h-3 mr-1" /> Tambah Baris
              </Button>
           </div>

           <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-inner max-h-[50vh] overflow-y-auto">
              <table className="w-full text-xs text-left min-w-[700px]">
                 <thead className="bg-slate-100 text-slate-600 sticky top-0 shadow-sm">
                    <tr>
                       <th className="px-2 py-2 font-semibold w-24">Code</th>
                       <th className="px-2 py-2 font-semibold">Foods</th>
                       <th className="px-2 py-2 font-semibold w-20">kJ</th>
                       <th className="px-2 py-2 font-semibold w-20">Protein</th>
                       <th className="px-2 py-2 font-semibold w-20">Fat</th>
                       <th className="px-2 py-2 font-semibold w-20">Carbs</th>
                       <th className="px-2 py-2 font-semibold w-12 text-center"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {inputRows.map((row, index) => (
                       <tr key={index} className="hover:bg-slate-50">
                          <td className="p-1">
                             <input type="text" placeholder="ZIN..." className="w-full p-2 bg-transparent border border-slate-200 rounded focus:border-emerald-500 outline-none uppercase" value={row.code} onChange={e => handleRowChange(index, "code", e.target.value)} />
                          </td>
                          <td className="p-1">
                             <input type="text" placeholder="Nama..." required className="w-full p-2 bg-transparent border border-slate-200 rounded focus:border-emerald-500 outline-none" value={row.name} onChange={e => handleRowChange(index, "name", e.target.value)} />
                          </td>
                          <td className="p-1">
                             <input type="number" step="0.1" className="w-full p-2 bg-transparent border border-slate-200 rounded focus:border-emerald-500 outline-none text-right" value={row.energyKJ || ""} onChange={e => handleRowChange(index, "energyKJ", e.target.value)} />
                          </td>
                          <td className="p-1">
                             <input type="number" step="0.1" className="w-full p-2 bg-transparent border border-slate-200 rounded focus:border-emerald-500 outline-none text-right" value={row.protein || ""} onChange={e => handleRowChange(index, "protein", e.target.value)} />
                          </td>
                          <td className="p-1">
                             <input type="number" step="0.1" className="w-full p-2 bg-transparent border border-slate-200 rounded focus:border-emerald-500 outline-none text-right" value={row.fat || ""} onChange={e => handleRowChange(index, "fat", e.target.value)} />
                          </td>
                          <td className="p-1">
                             <input type="number" step="0.1" className="w-full p-2 bg-transparent border border-slate-200 rounded focus:border-emerald-500 outline-none text-right" value={row.carbs || ""} onChange={e => handleRowChange(index, "carbs", e.target.value)} />
                          </td>
                          <td className="p-1 text-center">
                             <button type="button" onClick={() => removeRow(index)} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded" disabled={inputRows.length === 1}>
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
             <Button type="submit" isLoading={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                Simpan ke Database
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