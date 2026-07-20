"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Trash2, 
  Users, 
  Search, 
  Mail, 
  Building2,
  MapPin,
  Lock,
  User,
  Filter,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

// Services
import { getKadersByPuskesmas, createUser, deleteUserFirestore, CreateUserInput } from "@/lib/services/users";
import { getPosyandusByPuskesmas } from "@/lib/services/posyandu";
import { UserProfile, Posyandu } from "@/types/schema";

export default function PuskesmasKaderPage() {
  const { userProfile } = useAuth();
  
  // Data State
  const [kaders, setKaders] = useState<UserProfile[]>([]);
  const [myPosyandus, setMyPosyandus] = useState<Posyandu[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosyandu, setFilterPosyandu] = useState<string>("all");

  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({ message: "", type: "success", isVisible: false });
  const showToast = (message: string, type: ToastType = "success") => setToast({ message, type, isVisible: true });

  const [formData, setFormData] = useState<CreateUserInput>({
    email: "", password: "", name: "", role: "kader", posyanduId: "", puskesmasId: ""
  });

  const fetchData = async () => {
    if (!userProfile?.puskesmasId) return;
    try {
      const [kaderData, posyanduData] = await Promise.all([
        getKadersByPuskesmas(userProfile.puskesmasId),
        getPosyandusByPuskesmas(userProfile.puskesmasId)
      ]);
      setKaders(kaderData);
      setMyPosyandus(posyanduData);
    } catch (err) { 
        showToast("Gagal mengambil data kader", "error"); 
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.posyanduId) { showToast("Pilih Posyandu tugas!", "error"); return; }
    if (formData.password.length < 6) { showToast("Password minimal 6 karakter", "error"); return; }
    
    setIsSubmitting(true);
    try {
      await createUser({
          ...formData,
          puskesmasId: userProfile?.puskesmasId 
      });
      await fetchData();
      setIsModalOpen(false);
      setFormData({ email: "", password: "", name: "", role: "kader", posyanduId: "", puskesmasId: "" });
      showToast("Akun Kader berhasil dibuat! ✅", "success");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") showToast("Email sudah terdaftar!", "error");
      else showToast("Gagal membuat user.", "error");
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (uid: string, name: string) => {
    if (confirm(`PERINGATAN: Cabut akses kader ${name}? Mereka tidak akan bisa lagi mengakses data Posyandu.`)) {
      try {
        await deleteUserFirestore(uid);
        await fetchData();
        showToast("Akses kader dicabut.", "info");
      } catch (err) { showToast("Gagal menghapus.", "error"); }
    }
  };

  const getPosyanduName = (id?: string) => myPosyandus.find(p => p.id === id)?.name || "Posyandu Tidak Diketahui";

  // --- SMART FILTERING ---
  const processedKaders = useMemo(() => {
     let result = [...kaders];
     
     // 1. Search Logic
     if (searchTerm) {
         result = result.filter(k => 
             k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             k.email.toLowerCase().includes(searchTerm.toLowerCase())
         );
     }
     
     // 2. Filter Posyandu Logic
     if (filterPosyandu !== "all") {
         result = result.filter(k => k.posyanduId === filterPosyandu);
     }

     // 3. Auto Sort by Name A-Z
     result.sort((a, b) => a.name.localeCompare(b.name));

     return result;
  }, [kaders, searchTerm, filterPosyandu]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans pb-28 max-w-[1200px] mx-auto">
      
      {/* 1. COMPACT HERO SECTION */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-800 p-6 sm:p-8 shadow-lg shadow-indigo-900/20 overflow-hidden">
        
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
           <Users className="w-32 h-32 text-white transform rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
           <div className="space-y-2 w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                 <Building2 className="w-3 h-3" /> SDM Kesehatan
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">Manajemen Kader</h1>
              <p className="text-indigo-50 text-xs sm:text-sm max-w-md leading-relaxed font-medium">
                 Kelola akun relawan dan petugas lapangan (Kader) yang bertugas di posyandu wilayah kerja Anda.
              </p>
           </div>

           <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto shrink-0">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex-1 sm:flex-none">
                 <div className="bg-white/20 p-2 rounded-xl text-white">
                    <User className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest">Total Kader</p>
                    <p className="text-xl font-black text-white leading-none mt-0.5">{kaders.length}</p>
                 </div>
              </div>

              <Button 
                 className="h-auto py-3 bg-white text-indigo-700 hover:bg-indigo-50 active:scale-95 border-0 shadow-lg font-black transition-transform flex-1 sm:flex-none rounded-xl"
                 onClick={() => setIsModalOpen(true)}
              >
                 <UserPlus className="h-4 w-4 mr-2" />
                 Tambah Kader
              </Button>
           </div>
        </div>
      </div>

      {/* 2. STICKY TOOLS SECTION (SEARCH & FILTER) */}
      <div className="sticky top-[60px] md:top-0 z-20 bg-slate-50/90 backdrop-blur-xl py-3 -mx-4 px-4 sm:mx-0 sm:px-0 space-y-3 shadow-sm border-b border-slate-200/50 md:border-0 md:shadow-none md:bg-transparent">
        
        {/* Search Bar */}
        <div className="relative shadow-sm rounded-2xl group transition-shadow focus-within:shadow-md bg-white">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <Input 
            placeholder="Cari nama kader atau email..." 
            className="pl-12 h-14 rounded-2xl border-slate-200 bg-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Bar (Scrollable X on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 shrink-0 hover:bg-slate-50 transition-colors">
               <Filter className="w-4 h-4" />
               <select 
                  className="bg-transparent text-xs font-bold outline-none cursor-pointer appearance-none pr-4"
                  value={filterPosyandu}
                  onChange={(e) => setFilterPosyandu(e.target.value)}
               >
                  <option value="all">Semua Posyandu</option>
                  {myPosyandus.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
               </select>
            </div>

            {/* Total Results Badge */}
            <div className="ml-auto bg-indigo-50 text-indigo-600 px-3 py-2 rounded-xl text-xs font-black border border-indigo-100 shrink-0">
                {processedKaders.length} Kader
            </div>
        </div>
      </div>

      {/* 3. LIST CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          // SKELETON LOADER
          [1, 2, 3].map((i) => (
            <Card key={i} className="flex gap-4 items-center animate-pulse border-slate-100 p-4 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-slate-100"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded-md w-1/3"></div>
                <div className="h-3 bg-slate-100 rounded-md w-1/4"></div>
              </div>
            </Card>
          ))
        ) : processedKaders.length === 0 ? (
          // EMPTY STATE
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
               <Users className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-slate-800 font-black text-lg">Tidak Ada Data Kader</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1 leading-relaxed">
              Coba sesuaikan kata kunci atau ubah pengaturan filter Posyandu Anda.
            </p>
          </div>
        ) : (
          // DATA LIST (CONTACT STYLE CARDS)
          processedKaders.map((kader) => (
            <Card 
                key={kader.uid} 
                className="group relative flex items-center justify-between p-4 sm:p-5 transition-colors border-slate-100 hover:border-indigo-300 rounded-2xl bg-white shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl font-black text-indigo-600 shrink-0 border border-indigo-100/50">
                  {kader.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 text-sm truncate group-hover:text-indigo-700 transition-colors">
                    {kader.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{kader.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-[9px] font-bold text-slate-600 uppercase tracking-wider truncate max-w-[140px] sm:max-w-none">
                         <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />
                         {getPosyanduName(kader.posyanduId)}
                      </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 pl-2">
                 <button 
                   onClick={() => handleDelete(kader.uid, kader.name)}
                   className="p-2 sm:p-2.5 text-slate-300 hover:text-rose-600 bg-transparent hover:bg-rose-50 rounded-xl transition-colors active:scale-95"
                   title="Cabut Akses Kader"
                 >
                   <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
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
        title="Registrasi Kader Posyandu"
      >
        <form onSubmit={handleSubmit} className="space-y-5 px-1 pb-1">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
            <div className="relative">
               <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
               <Input 
                 placeholder="Contoh: Ibu Ani Rahmawati" 
                 required
                 className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-14 pl-11 rounded-2xl text-sm font-medium"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
               />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Login</label>
            <div className="relative">
               <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
               <Input 
                 type="email"
                 placeholder="email@contoh.com" 
                 required
                 className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-14 pl-11 rounded-2xl text-sm font-medium"
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
               />
            </div>
            <p className="text-[10px] text-slate-500 px-1 font-medium">Pastikan email aktif. Format rekomendasi: <span className="font-bold text-slate-700">kader.nama@posyandu.com</span></p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password Akses</label>
            <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input 
                  type="text"
                  placeholder="Minimal 6 karakter" 
                  required
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-14 pl-11 rounded-2xl font-mono text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Lokasi Penugasan</label>
             <div className="relative">
                <select 
                   className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none px-4 text-sm font-bold appearance-none cursor-pointer text-slate-700"
                   value={formData.posyanduId} 
                   onChange={(e) => setFormData({...formData, posyanduId: e.target.value})}
                   required
                >
                   <option value="">-- Pilih Posyandu --</option>
                   {myPosyandus.map(p => (
                       <option key={p.id} value={p.id}>{p.name} {p.village ? `(${p.village})` : ''}</option>
                   ))}
                </select>
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
               className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white px-8 shadow-lg shadow-indigo-200 rounded-xl font-black w-full sm:w-auto"
            >
               Buat Akun Kader
            </Button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
    </div>
  );
}