"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  UserCog, 
  Building2, 
  Search, 
  Mail, 
  ShieldCheck, 
  UserCheck,
  MoreVertical,
  Filter
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Toast, ToastType } from "@/components/ui/Toast";

import { getUsers, createUser, deleteUserFirestore, CreateUserInput } from "@/lib/services/users";
import { getPosyandus } from "@/lib/services/posyandu";
import { UserProfile, Posyandu } from "@/types/schema";
import { cn } from "@/lib/utils";

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [posyandus, setPosyandus] = useState<Posyandu[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [formData, setFormData] = useState<CreateUserInput>({
    email: "",
    password: "",
    name: "",
    role: "kader",
    posyanduId: "",
  });

  const fetchData = async () => {
    try {
      const [usersData, posyandusData] = await Promise.all([
        getUsers(),
        getPosyandus()
      ]);
      setUsers(usersData);
      setPosyandus(posyandusData);
    } catch (err) {
      showToast("Gagal mengambil data sistem.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.role === "kader" && !formData.posyanduId) {
      showToast("Kader wajib ditugaskan di satu Posyandu!", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser(formData);
      await fetchData();
      setIsModalOpen(false);
      setFormData({ 
        email: "", password: "", name: "", role: "kader", posyanduId: "" 
      });
      showToast("Pengguna berhasil didaftarkan! ✅", "success");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        showToast("Email tersebut sudah terdaftar!", "error");
      } else {
        showToast("Gagal membuat user baru.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (uid: string, name: string) => {
    if (confirm(`Hapus akses untuk ${name}? (Akun login tetap ada, tapi akses data di SAESTU akan dicabut)`)) {
      try {
        await deleteUserFirestore(uid);
        await fetchData();
        showToast("Akses user berhasil dicabut.", "info");
      } catch (err) {
        showToast("Gagal menghapus user.", "error");
      }
    }
  };

  const getPosyanduName = (id?: string) => {
    if (!id) return "-";
    return posyandus.find(p => p.id === id)?.name || "Unknown";
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 font-sans">
      
      {/* --- HERO HEADER --- */}
      {/* Menggunakan !text-white untuk memastikan teks judul TIDAK menjadi hitam */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-700 p-8 shadow-xl shadow-indigo-900/10 text-white overflow-hidden border-b-4 border-indigo-500/30">
         <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <UserCog className="w-48 h-48 text-white transform translate-x-10 -translate-y-10" />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-3">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs font-semibold !text-white">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Management</span>
               </div>
               <h1 className="text-3xl md:text-4xl font-bold tracking-tight !text-white mb-2">
                  Manajemen Pengguna
               </h1>
               <p className="text-indigo-50 max-w-lg opacity-90 leading-relaxed">
                  Kelola hak akses untuk Petugas Puskesmas dan Kader lapangan dalam satu pintu.
               </p>
            </div>
            
            <Button 
               onClick={() => setIsModalOpen(true)}
               className="bg-white text-indigo-700 hover:bg-indigo-50 border-0 shadow-lg font-bold h-12 px-6 rounded-2xl transition-transform active:scale-95"
            >
               <Plus className="h-5 w-5 mr-2" />
               Tambah User
            </Button>
         </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 ring-indigo-500/20 transition-all">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
               placeholder="Cari berdasarkan nama atau email..." 
               className="w-full pl-10 pr-4 py-3 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="hidden sm:flex pr-4 text-xs font-bold text-slate-400 border-l border-slate-100 pl-4 uppercase tracking-widest">
            Total Users: <span className="text-indigo-600 ml-1.5">{filteredUsers.length}</span>
         </div>
      </div>

      {/* --- USER LIST --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
           <>
              {[1, 2, 3, 4].map((i) => (
                 <Card key={`skeleton-${i}`} className="h-28 animate-pulse bg-slate-100 border-slate-200" />
              ))}
           </>
        ) : filteredUsers.length === 0 ? (
           <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <UserCog className="w-10 h-10" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg">Tidak ada pengguna</h3>
              <p className="text-slate-500 text-sm mt-1">Gunakan tombol di atas untuk mendaftarkan akun baru.</p>
           </div>
        ) : (
           <>
            {filteredUsers.map((user, index) => (
               <Card 
                /* Solusi Error UNIQUE KEY: Gunakan UID atau gabungan Index */
                key={user.uid || `user-${index}`} 
                hoverable 
                className="group p-5 border-slate-100 transition-all hover:border-indigo-200"
               >
                  <div className="flex items-start gap-4">
                     {/* Avatar Inisial */}
                     <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm transition-transform group-hover:scale-110",
                        user.role === 'master' ? 'bg-indigo-100 text-indigo-700' :
                        user.role === 'puskesmas' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                     )}>
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                     </div>

                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                           <h3 className="font-bold text-slate-800 text-base truncate group-hover:text-indigo-700 transition-colors">
                              {user.name}
                           </h3>
                           <Badge 
                              variant={user.role === 'master' ? 'neutral' : user.role === 'puskesmas' ? 'default' : 'success'}
                              className="text-[9px]"
                           >
                              {user.role === 'master' ? 'Master' :
                               user.role === 'puskesmas' ? 'Puskesmas' : 'Kader'}
                           </Badge>
                        </div>
                        
                        <div className="flex flex-col gap-1.5 mt-2">
                           <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="truncate">{user.email}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span className="truncate">
                                 {user.role === 'kader' ? getPosyanduName(user.posyanduId) : "Akses Global"}
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Action Button */}
                     {user.role !== 'master' && (
                        <button 
                           onClick={() => handleDelete(user.uid, user.name)}
                           className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                           title="Hapus Akses"
                        >
                           <Trash2 className="h-5 w-5" />
                        </button>
                     )}
                  </div>
               </Card>
            ))}
           </>
        )}
      </div>

      {/* --- MODAL TAMBAH USER --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Daftarkan Pengguna Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
            <Input 
              placeholder="Contoh: Ahmad Rifai" 
              required
              className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Login</label>
              <Input 
                type="email"
                placeholder="nama@email.com" 
                required
                className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password Awal</label>
              <Input 
                type="text"
                placeholder="Min. 6 Karakter" 
                required
                className="bg-slate-50 border-transparent focus:bg-white transition-all h-11 font-mono"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="h-px bg-slate-100 my-1"></div>

          <div className="space-y-1.5">
            <Select 
              label="Jabatan / Role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value as any})}
            >
              <option value="kader">Kader Posyandu</option>
              <option value="puskesmas">Petugas Puskesmas</option>
            </Select>
          </div>

          {formData.role === "kader" && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
              <Select 
                label="Lokasi Penugasan (Posyandu)"
                value={formData.posyanduId}
                onChange={(e) => setFormData({...formData, posyanduId: e.target.value})}
                required
              >
                <option value="">-- Pilih Posyandu Tujuan --</option>
                {posyandus.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.village})</option>
                ))}
              </Select>
              <p className="text-[10px] text-slate-400 ml-1">Kader hanya akan bisa melihat data dari posyandu yang dipilih.</p>
            </div>
          )}

          <div className="pt-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" className="text-slate-500" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 px-8 shadow-lg shadow-indigo-200">
              Buat Akun
            </Button>
          </div>
        </form>
      </Modal>

      {/* Toast Notif */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
    </div>
  );
}