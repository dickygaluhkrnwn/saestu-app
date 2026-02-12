"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, Search, Activity, Building2, User } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toast, ToastType } from "@/components/ui/Toast";

// Import Service Baru
import { addPuskesmas, getPuskesmasEntities, deletePuskesmas } from "@/lib/services/puskesmas"; // Asumsi fungsi delete ada
import { Puskesmas } from "@/types/schema";

export default function PuskesmasManagementPage() {
  const [puskesmasList, setPuskesmasList] = useState<Puskesmas[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "", type: "success", isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district: "",
    headName: "",
  });

  const fetchData = async () => {
    try {
      const data = await getPuskesmasEntities();
      setPuskesmasList(data);
    } catch (err) {
      showToast("Gagal mengambil data puskesmas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addPuskesmas(formData);
      await fetchData();
      setIsModalOpen(false);
      setFormData({ name: "", address: "", district: "", headName: "" });
      showToast("Puskesmas berhasil ditambahkan! ✅", "success");
    } catch (err) {
      showToast("Gagal menambah puskesmas", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus Puskesmas ${name}? Data terkait mungkin akan error.`)) {
      try {
        await deletePuskesmas(id);
        await fetchData();
        showToast("Data berhasil dihapus", "info");
      } catch (err) {
        showToast("Gagal menghapus data", "error");
      }
    }
  };

  const filteredPuskesmas = puskesmasList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 font-sans">
      
      {/* HERO HEADER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-xl shadow-blue-900/10 text-white overflow-hidden border-b-4 border-blue-500/30">
         <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Building2 className="w-48 h-48 text-white transform translate-x-10 -translate-y-10" />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs font-semibold mb-3 !text-white">
                  <Activity className="w-4 h-4" />
                  <span>Master Data</span>
               </div>
               <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 !text-white">
                  Manajemen Puskesmas
               </h1>
               <p className="text-blue-50 max-w-lg opacity-90 !text-white">
                  Kelola entitas Puskesmas di seluruh wilayah. Ini adalah induk dari semua Posyandu.
               </p>
            </div>
            
            <Button 
               onClick={() => setIsModalOpen(true)}
               className="bg-white text-blue-700 hover:bg-blue-50 border-0 shadow-lg font-bold h-12 px-6 rounded-2xl"
            >
               <Plus className="h-5 w-5 mr-2" />
               Tambah Puskesmas
            </Button>
         </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 ring-blue-500/20 transition-all">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
               placeholder="Cari nama puskesmas atau kecamatan..." 
               className="w-full pl-10 pr-4 py-3 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="hidden sm:flex pr-4 text-xs font-bold text-slate-400 border-l border-slate-100 pl-4 uppercase tracking-widest">
            Total: <span className="text-blue-600 ml-1.5">{filteredPuskesmas.length}</span>
         </div>
      </div>

      {/* LIST CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <>
              {[1, 2, 3].map((i) => (
                 <Card key={`skeleton-pusk-${i}`} className="h-40 animate-pulse bg-slate-100 border-slate-200" />
              ))}
           </>
        ) : filteredPuskesmas.length === 0 ? (
           <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <Building2 className="w-10 h-10" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg">Tidak ada data Puskesmas</h3>
              <p className="text-slate-500 text-sm mt-1">Silakan tambahkan unit Puskesmas baru.</p>
           </div>
        ) : (
           <>
            {filteredPuskesmas.map((pusk, index) => (
               <Card 
                  key={pusk.id || `pusk-${index}`} 
                  hoverable 
                  className="group flex flex-col justify-between h-full bg-white border-slate-100 transition-all hover:border-blue-200"
               >
                  <div className="p-5">
                     <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg group-hover:scale-110 transition-transform">
                           {pusk.name ? pusk.name.charAt(0) : 'P'}
                        </div>
                        <Badge variant="outline" className="bg-slate-50 text-[10px] uppercase font-bold">
                           {pusk.district}
                        </Badge>
                     </div>
                     
                     <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">
                        {pusk.name}
                     </h3>
                     <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1">
                        <User className="w-3 h-3" /> Kepala: {pusk.headName || "-"}
                     </p>
                     
                     <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-400" />
                        <span className="line-clamp-2">{pusk.address}</span>
                     </div>
                  </div>

                  <div className="px-5 py-4 border-t border-slate-50 flex justify-end">
                     <button 
                        onClick={() => handleDelete(pusk.id, pusk.name)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                     >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                     </button>
                  </div>
               </Card>
            ))}
           </>
        )}
      </div>

      {/* MODAL TAMBAH */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Tambah Puskesmas Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Puskesmas</label>
            <Input 
              placeholder="Contoh: Puskesmas Sukajadi" 
              required
              className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Kepala Puskesmas</label>
             <Input 
               placeholder="Dr. Budi Santoso" 
               required
               className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
               value={formData.headName}
               onChange={(e) => setFormData({...formData, headName: e.target.value})}
             />
          </div>

          <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kecamatan</label>
             <Input 
               placeholder="Nama Kecamatan Wilayah Kerja" 
               required
               className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
               value={formData.district}
               onChange={(e) => setFormData({...formData, district: e.target.value})}
             />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Alamat Lengkap</label>
            <Input 
              placeholder="Jalan, No, Kelurahan..." 
              required
              className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" className="text-slate-500" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="bg-blue-600 hover:bg-blue-700 px-8 shadow-lg shadow-blue-200">
              Simpan Data
            </Button>
          </div>
        </form>
      </Modal>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
    </div>
  );
}