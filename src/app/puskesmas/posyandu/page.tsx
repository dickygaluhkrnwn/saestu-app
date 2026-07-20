"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, MapPin, Search, Building2, ChevronRight, Hash } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

// Services
import { addPosyandu, getPosyandusByPuskesmas, deletePosyandu } from "@/lib/services/posyandu";
import { Posyandu } from "@/types/schema";

export default function PuskesmasPosyanduPage() {
  const { userProfile } = useAuth();
  const [posyandus, setPosyandus] = useState<Posyandu[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "", type: "success", isVisible: false,
  });
  const showToast = (message: string, type: ToastType = "success") => setToast({ message, type, isVisible: true });

  const [formData, setFormData] = useState({
    name: "", village: "", district: "", address: "",
  });

  const fetchData = async () => {
    if (!userProfile?.puskesmasId) return;
    try {
      const data = await getPosyandusByPuskesmas(userProfile.puskesmasId);
      setPosyandus(data);
    } catch (err) {
      showToast("Gagal mengambil data posyandu", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.puskesmasId) {
        showToast("Error: Akun Anda tidak terhubung ke Puskesmas.", "error");
        return;
    }

    setIsSubmitting(true);
    try {
      await addPosyandu({
          ...formData,
          puskesmasId: userProfile.puskesmasId 
      });
      await fetchData();
      setIsModalOpen(false);
      setFormData({ name: "", village: "", district: "", address: "" });
      showToast("Posyandu berhasil ditambahkan ke wilayah Anda! ✅", "success");
    } catch (err) {
      showToast("Gagal menambah posyandu", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`PERINGATAN: Yakin ingin menghapus Posyandu ${name}? Data balita dan kader yang terkait mungkin akan kehilangan akses.`)) {
      try {
        await deletePosyandu(id);
        await fetchData();
        showToast("Data berhasil dihapus", "info");
      } catch (err) { showToast("Gagal menghapus data", "error"); }
    }
  };

  // --- SMART FILTERING ---
  const processedPosyandus = useMemo(() => {
     let result = [...posyandus];
     if (searchTerm) {
         result = result.filter(p => 
             p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.village.toLowerCase().includes(searchTerm.toLowerCase())
         );
     }
     // Auto Sort A-Z
     result.sort((a, b) => a.name.localeCompare(b.name));
     return result;
  }, [posyandus, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans pb-28 max-w-[1200px] mx-auto">
      
      {/* 1. COMPACT HERO SECTION */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 sm:p-8 shadow-lg shadow-emerald-900/20 overflow-hidden">
        
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
           <Building2 className="w-32 h-32 text-white transform rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
           <div className="space-y-2 w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                 <MapPin className="w-3 h-3" /> Manajemen Wilayah
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">Daftar Posyandu</h1>
              <p className="text-emerald-50 text-xs sm:text-sm max-w-md leading-relaxed font-medium">
                 Kelola data lokasi dan alamat titik layanan Posyandu di bawah naungan Puskesmas Anda.
              </p>
           </div>

           <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto shrink-0">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex-1 sm:flex-none">
                 <div className="bg-white/20 p-2 rounded-xl text-white">
                    <Building2 className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest">Total Titik</p>
                    <p className="text-xl font-black text-white leading-none mt-0.5">{posyandus.length}</p>
                 </div>
              </div>

              <Button 
                 className="h-auto py-3 bg-white text-emerald-700 hover:bg-emerald-50 active:scale-95 border-0 shadow-lg font-black transition-transform flex-1 sm:flex-none rounded-xl"
                 onClick={() => setIsModalOpen(true)}
              >
                 <Plus className="h-4 w-4 mr-1.5" />
                 Posyandu Baru
              </Button>
           </div>
        </div>
      </div>

      {/* 2. STICKY SEARCH BAR */}
      <div className="sticky top-[60px] md:top-0 z-20 bg-slate-50/90 backdrop-blur-xl py-3 -mx-4 px-4 sm:mx-0 sm:px-0 space-y-3 shadow-sm border-b border-slate-200/50 md:border-0 md:shadow-none md:bg-transparent">
        <div className="relative shadow-sm rounded-2xl group transition-shadow focus-within:shadow-md bg-white">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-slate-400 group-focus-within:text-emerald-600 transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <Input 
            placeholder="Cari nama posyandu atau desa..." 
            className="pl-12 h-14 rounded-2xl border-slate-200 bg-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 3. LIST CONTENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          // SKELETON LOADER
          [1, 2, 3].map((i) => (
            <Card key={i} className="flex gap-4 items-center animate-pulse border-slate-100 p-4 rounded-2xl">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded-md w-2/3"></div>
                <div className="h-3 bg-slate-100 rounded-md w-1/3"></div>
              </div>
            </Card>
          ))
        ) : processedPosyandus.length === 0 ? (
          // EMPTY STATE
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
               <Building2 className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-slate-800 font-black text-lg">Belum Ada Posyandu</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1 leading-relaxed">
              Tambahkan data Posyandu agar Kader bisa didaftarkan ke titik layanan tersebut.
            </p>
          </div>
        ) : (
          // DATA LIST (BENTO CARDS)
          processedPosyandus.map((posyandu) => (
            <Card 
                key={posyandu.id} 
                className="group flex flex-col justify-between h-full bg-white border-slate-100 shadow-sm rounded-3xl p-5 hover:border-emerald-300 transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                 <Building2 className="w-20 h-20 text-emerald-900" />
              </div>

              <div className="relative z-10">
                 <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xl shrink-0 border border-emerald-100/50">
                       {posyandu.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                       <h3 className="font-black text-base text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">{posyandu.name}</h3>
                       <div className="flex items-center gap-1 mt-1">
                          <span className="inline-flex items-center bg-slate-50 border border-slate-200 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                             Desa {posyandu.village}
                          </span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-start gap-2.5 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium leading-relaxed">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 text-emerald-500 shrink-0" />
                    <span>{posyandu.address}</span>
                 </div>
              </div>

              {/* Action Area */}
              <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center relative z-10">
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                    <Hash className="w-3 h-3" /> ID: {posyandu.id.substring(0,6)}
                 </span>
                 <button 
                   onClick={() => handleDelete(posyandu.id, posyandu.name)} 
                   className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95"
                 >
                   <Trash2 className="h-4 w-4" /> Hapus
                 </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* --- MODAL TAMBAH NATIVE STYLE --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Registrasi Posyandu Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-5 px-1 pb-1">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Posyandu</label>
            <div className="relative">
               <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
               <Input 
                 placeholder="Contoh: Posyandu Melati 1" 
                 required
                 className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-14 pl-11 rounded-2xl text-sm font-bold text-slate-800"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
               />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Desa / Kelurahan</label>
               <Input 
                 placeholder="Nama Desa" 
                 required
                 className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-14 rounded-2xl text-sm font-medium"
                 value={formData.village}
                 onChange={(e) => setFormData({...formData, village: e.target.value})}
               />
             </div>
             <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kecamatan</label>
               <Input 
                 placeholder="Nama Kec." 
                 required
                 className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-14 rounded-2xl text-sm font-medium"
                 value={formData.district}
                 onChange={(e) => setFormData({...formData, district: e.target.value})}
               />
             </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alamat Lengkap</label>
            <div className="relative">
               <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-4" />
               <textarea 
                 placeholder="Jl. Raya Desa No. 123..." 
                 required
                 rows={3}
                 className="w-full bg-slate-50 border border-slate-200 focus:bg-white transition-all py-3 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                 value={formData.address}
                 onChange={(e) => setFormData({...formData, address: e.target.value})}
               ></textarea>
            </div>
          </div>

          <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
            <Button 
               type="button" 
               variant="outline" 
               className="h-12 rounded-xl text-slate-600 border-slate-200 font-bold hover:bg-slate-50 w-full sm:w-auto" 
               onClick={() => setIsModalOpen(false)}
            >
               Batal
            </Button>
            <Button 
               type="submit" 
               isLoading={isSubmitting}
               className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white px-8 shadow-lg shadow-emerald-200 rounded-xl font-black w-full sm:w-auto"
            >
               Simpan Posyandu
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