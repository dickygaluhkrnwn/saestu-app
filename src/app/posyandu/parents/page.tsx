"use client";

import { useState, useEffect } from "react";
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
  ChevronRight
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toast, ToastType } from "@/components/ui/Toast";

import { getParentsByPosyandu, createParentAccount } from "@/lib/services/parents";
import { deleteUserFirestore } from "@/lib/services/users";
import { UserProfile } from "@/types/schema";
import { cn } from "@/lib/utils";

export default function ParentsPage() {
  const { userProfile } = useAuth();
  
  // Data State
  const [parents, setParents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  // Form State
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

    // Validasi sederhana
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

  const filteredParents = parents.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans pb-24">
      
      {/* --- MODERN HERO HEADER (Sesuai style Data Balita) --- */}
      <div className="relative rounded-3xl bg-gradient-to-r from-teal-600 to-emerald-600 p-6 md:p-8 shadow-xl shadow-teal-900/10 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
           <Users className="w-48 h-48 text-white transform translate-x-10 -translate-y-10" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 text-white text-xs font-medium">
                 <MapPin className="w-3.5 h-3.5" />
                 <span>Manajemen Akses</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Data Orang Tua</h1>
              <p className="text-emerald-50 text-sm md:text-base max-w-lg leading-relaxed opacity-90">
                 Kelola akun orang tua agar mereka dapat memantau tumbuh kembang anak secara mandiri melalui aplikasi.
              </p>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Stat Badge */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex-1 md:flex-none">
                 <div className="bg-white/20 p-2 rounded-xl text-white">
                    <User className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-xs text-emerald-100 font-medium">Total Akun</p>
                    <p className="text-xl font-bold text-white">{parents.length}</p>
                 </div>
              </div>

              <Button 
                 className="h-auto py-3 px-6 bg-white text-teal-700 hover:bg-teal-50 hover:scale-105 active:scale-95 border-0 shadow-lg font-bold transition-all"
                 onClick={() => setIsModalOpen(true)}
              >
                 <Plus className="h-5 w-5 mr-2" />
                 Akun Baru
              </Button>
           </div>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md py-2 -mx-2 px-2">
        <div className="relative shadow-sm rounded-2xl group focus-within:shadow-md transition-shadow">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
            <Search className="h-5 w-5 group-focus-within:text-emerald-600 transition-colors" />
          </div>
          <Input 
            placeholder="Cari nama ibu atau email..." 
            className="pl-10 h-12 rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all text-base shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- LIST CONTENT --- */}
      <div className="space-y-3">
        {loading ? (
          // SKELETON LOADER
          [1, 2, 3].map((i) => (
            <Card key={i} className="flex gap-4 items-center animate-pulse border-slate-100 p-4">
              <div className="w-12 h-12 rounded-full bg-slate-100"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                <div className="h-3 bg-slate-100 rounded w-1/4"></div>
              </div>
            </Card>
          ))
        ) : filteredParents.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <User className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">Belum ada akun</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
              Daftarkan orang tua agar data balita bisa terhubung.
            </p>
          </div>
        ) : (
          // DATA LIST
          filteredParents.map((parent) => (
            <Card 
                key={parent.uid} 
                hoverable 
                className="group relative flex items-center justify-between p-4 transition-all border-slate-100 hover:border-emerald-200"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-lg font-bold text-emerald-700 shadow-sm group-hover:scale-105 transition-transform">
                  {parent.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-base truncate group-hover:text-emerald-700 transition-colors">
                    {parent.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-medium">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{parent.email}</span>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button 
                onClick={() => handleDelete(parent.uid, parent.name)}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                title="Hapus Akun"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </Card>
          ))
        )}
      </div>

      {/* --- MODAL TAMBAH --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Daftarkan Orang Tua"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
            <Input 
              placeholder="Contoh: Ibu Ani" 
              required
              className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Login</label>
            <Input 
              type="email"
              placeholder="email@contoh.com" 
              required
              className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <p className="text-[10px] text-slate-400 px-1">Pastikan email aktif atau gunakan format <i>ibu.nama@posyandu.com</i></p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password Sementara</label>
            <div className="relative">
                <Input 
                type="text"
                placeholder="Minimal 6 karakter" 
                required
                className="bg-slate-50 border-transparent focus:bg-white transition-all h-11 font-mono pl-10"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
            <Button 
               type="button" 
               variant="ghost" 
               className="text-slate-500" 
               onClick={() => setIsModalOpen(false)}
            >
               Batal
            </Button>
            <Button 
               type="submit" 
               isLoading={isSubmitting}
               className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 shadow-lg shadow-emerald-200"
            >
               Buat Akun
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