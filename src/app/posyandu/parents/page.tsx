"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Plus, 
  Search, 
  User, 
  Trash2, 
  Users, 
  Mail, 
  MapPin,
  Lock,
  UserPlus,
  ArrowUpDown,
  Filter
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Toast, ToastType } from "@/components/ui/Toast";

import { getParentsByPosyandu, createParentAccount } from "@/lib/services/parents";
import { deleteUserFirestore } from "@/lib/services/users";
import { UserProfile } from "@/types/schema";

export default function ParentsPage() {
  const { userProfile } = useAuth();
  
  const [parents, setParents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fitur Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"nameAsc" | "nameDesc" | "newest">("newest");
  const [domainFilter, setDomainFilter] = useState<"all" | "gmail" | "posyandu">("all");

  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchData = async () => {
    if (!userProfile?.posyanduId) return;
    try {
      const data = await getParentsByPosyandu(userProfile.posyanduId);
      setParents(data);
    } catch (err) {
      console.error(err);
      showToast("Gagal memuat data orang tua.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.posyanduId) return;

    if (formData.password.length < 6) {
        showToast("Password minimal 6 karakter.", "error");
        return;
    }

    setIsSubmitting(true);
    try {
      await createParentAccount(userProfile.posyanduId, formData);
      await fetchData();
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "" });
      showToast("Akun Orang Tua berhasil dibuat! 🎉", "success");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        showToast("Email sudah terdaftar.", "error");
      } else {
        showToast("Gagal membuat akun: " + err.message, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (uid: string, name: string) => {
    if (confirm(`PERINGATAN: Hapus akun ${name}? Orang tua tidak akan bisa login lagi untuk melihat data anaknya.`)) {
        try {
            await deleteUserFirestore(uid);
            await fetchData();
            showToast("Akun berhasil dihapus.", "info");
        } catch (err) {
            showToast("Gagal menghapus akun.", "error");
        }
    }
  };

  // -------------------------------------------------------------
  // LOGIKA SMART FILTERING & SORTING (ENTERPRISE)
  // -------------------------------------------------------------
  const processedParents = useMemo(() => {
    let result = [...parents];

    // 1. Search Logic
    if (searchTerm) {
        result = result.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // 2. Domain Filter Logic
    if (domainFilter === "gmail") {
        result = result.filter(p => p.email.toLowerCase().endsWith("@gmail.com"));
    } else if (domainFilter === "posyandu") {
        result = result.filter(p => p.email.toLowerCase().endsWith("@posyandu.com"));
    }

    // 3. Sorting Logic
    if (sortBy === "nameAsc") {
        result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "nameDesc") {
        result.sort((a, b) => b.name.localeCompare(a.name));
    }
    // Jika "newest", biarkan sesuai urutan fetch (default behavior Firebase Firestore jika tanpa orderBy)

    return result;
  }, [parents, searchTerm, sortBy, domainFilter]);


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans pb-28 max-w-4xl mx-auto">
      
      {/* 1. COMPACT HERO SECTION */}
      <div className="relative rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 p-6 sm:p-8 shadow-lg shadow-orange-500/20 overflow-hidden">
        
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
           <Users className="w-32 h-32 text-white transform rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
           <div className="space-y-2 w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                 <MapPin className="w-3 h-3" /> Manajemen Akses
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">Data Orang Tua</h1>
              <p className="text-orange-50 text-xs sm:text-sm max-w-md leading-relaxed font-medium">
                 Kelola akun login orang tua agar mereka dapat memantau tumbuh kembang anaknya melalui aplikasi.
              </p>
           </div>

           <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto shrink-0">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex-1 sm:flex-none">
                 <div className="bg-white/20 p-2 rounded-xl text-white">
                    <User className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-[10px] text-orange-100 font-bold uppercase tracking-widest">Total Akun</p>
                    <p className="text-xl font-black text-white leading-none mt-0.5">{parents.length}</p>
                 </div>
              </div>

              <Button 
                 className="h-auto py-3 bg-white text-orange-700 hover:bg-orange-50 active:scale-95 border-0 shadow-lg font-black transition-transform flex-1 sm:flex-none rounded-xl"
                 onClick={() => setIsModalOpen(true)}
              >
                 <UserPlus className="h-4 w-4 mr-2" />
                 Akun Baru
              </Button>
           </div>
        </div>
      </div>

      {/* 2. STICKY TOOLS SECTION (SEARCH & FILTER) */}
      <div className="sticky top-[60px] md:top-0 z-20 bg-slate-50/90 backdrop-blur-xl py-3 -mx-4 px-4 sm:mx-0 sm:px-0 space-y-3 shadow-sm border-b border-slate-200/50 md:border-0 md:shadow-none md:bg-transparent">
        
        {/* Search Bar */}
        <div className="relative shadow-sm rounded-2xl group transition-shadow focus-within:shadow-md bg-white">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-slate-400 group-focus-within:text-orange-500 transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <Input 
            placeholder="Cari nama ibu atau email..." 
            className="pl-12 h-14 rounded-2xl border-slate-200 bg-transparent focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter & Sort Bar (Scrollable X on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 shrink-0">
               <ArrowUpDown className="w-4 h-4" />
               <select 
                  className="bg-transparent text-xs font-bold outline-none cursor-pointer appearance-none pr-4"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
               >
                  <option value="newest">Terbaru</option>
                  <option value="nameAsc">A - Z</option>
                  <option value="nameDesc">Z - A</option>
               </select>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 shrink-0">
               <Filter className="w-4 h-4" />
               <select 
                  className="bg-transparent text-xs font-bold outline-none cursor-pointer appearance-none pr-4"
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value as any)}
               >
                  <option value="all">Semua Email</option>
                  <option value="gmail">Hanya @gmail.com</option>
                  <option value="posyandu">Hanya Akun Lokal</option>
               </select>
            </div>

            {/* Total Results Badge */}
            <div className="ml-auto bg-orange-50 text-orange-600 px-3 py-2 rounded-xl text-xs font-black border border-orange-100 shrink-0 flex items-center">
                {processedParents.length} Hasil
            </div>
        </div>
      </div>

      {/* 3. LIST CONTENT */}
      <div className="space-y-3">
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
        ) : processedParents.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
               <Users className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-slate-800 font-black text-lg">Pencarian Tidak Ditemukan</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1 leading-relaxed">
              Coba sesuaikan kata kunci atau ubah pengaturan filter di atas.
            </p>
          </div>
        ) : (
          // DATA LIST (CONTACT STYLE)
          processedParents.map((parent) => (
            <Card 
                key={parent.uid} 
                className="group relative flex items-center justify-between p-3 sm:p-4 transition-colors border-slate-100 hover:border-orange-200 rounded-2xl bg-white shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-lg font-black text-orange-600 shrink-0">
                  {parent.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 text-sm truncate">
                    {parent.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{parent.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 pl-2">
                 <button 
                   onClick={() => handleDelete(parent.uid, parent.name)}
                   className="p-2 sm:p-2.5 text-slate-300 hover:text-rose-600 bg-transparent hover:bg-rose-50 rounded-xl transition-colors active:scale-95"
                   title="Hapus Akun"
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
        title="Daftarkan Orang Tua"
      >
        <form onSubmit={handleSubmit} className="space-y-5 px-1 pb-1">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
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
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Login</label>
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
            <p className="text-[10px] text-slate-500 px-1 font-medium">Pastikan email aktif. Atau gunakan format: <span className="font-bold text-slate-700">ibu.nama@posyandu.com</span></p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Password Awal</label>
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

          <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
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
               className="h-12 bg-orange-600 hover:bg-orange-700 text-white px-8 shadow-lg shadow-orange-200 rounded-xl font-black w-full sm:w-auto"
            >
               Buat Akun Sekarang
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