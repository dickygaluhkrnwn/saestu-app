"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Users, Search, Mail, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

// Services
import { getKadersByPuskesmas, createUser, deleteUserFirestore, CreateUserInput } from "@/lib/services/users";
import { getPosyandusByPuskesmas } from "@/lib/services/posyandu";
import { UserProfile, Posyandu } from "@/types/schema";

export default function PuskesmasKaderPage() {
  const { userProfile } = useAuth();
  const [kaders, setKaders] = useState<UserProfile[]>([]);
  const [myPosyandus, setMyPosyandus] = useState<Posyandu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
    } catch (err) { showToast("Gagal mengambil data kader", "error"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.posyanduId) { showToast("Pilih Posyandu tugas!", "error"); return; }
    
    setIsSubmitting(true);
    try {
      await createUser({
          ...formData,
          puskesmasId: userProfile?.puskesmasId // AUTO LINK ke Puskesmas ini
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
    if (confirm(`Cabut akses kader ${name}?`)) {
      try {
        await deleteUserFirestore(uid);
        await fetchData();
        showToast("Akses kader dicabut.", "info");
      } catch (err) { showToast("Gagal menghapus.", "error"); }
    }
  };

  const getPosyanduName = (id?: string) => myPosyandus.find(p => p.id === id)?.name || "Unknown";

  return (
    <div className="space-y-8 p-6 font-sans">
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 shadow-xl text-white overflow-hidden">
         <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none"><Users className="w-48 h-48 text-white transform translate-x-10 -translate-y-10" /></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div><h1 className="text-3xl font-bold tracking-tight mb-2 !text-white">Manajemen Kader</h1><p className="text-indigo-50 max-w-lg opacity-90 !text-white">Kelola akun Kader yang bertugas di lapangan.</p></div>
            <Button onClick={() => setIsModalOpen(true)} className="bg-white text-indigo-700 hover:bg-indigo-50 border-0 shadow-lg font-bold h-12 px-6 rounded-2xl"><Plus className="h-5 w-5 mr-2" /> Tambah Kader</Button>
         </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input placeholder="Cari kader..." className="w-full pl-10 pr-4 py-3 bg-transparent outline-none text-sm text-slate-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? <p>Loading...</p> : kaders.map((kader) => (
           <Card key={kader.uid} className="p-5 border-slate-100 flex items-start gap-4 hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">{kader.name.charAt(0)}</div>
              <div className="flex-1">
                 <h3 className="font-bold text-slate-800">{kader.name}</h3>
                 <div className="text-xs text-slate-500 mt-1 flex flex-col gap-1">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {kader.email}</span>
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {getPosyanduName(kader.posyanduId)}</span>
                 </div>
              </div>
              <button onClick={() => handleDelete(kader.uid, kader.name)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl"><Trash2 className="h-5 w-5" /></button>
           </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrasi Kader Baru">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Nama Lengkap" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input type="email" placeholder="Email Login" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <Input type="text" placeholder="Password (Min. 6 Karakter)" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          
          <div className="space-y-1">
             <label className="text-xs font-bold text-slate-500 uppercase">Penugasan Posyandu</label>
             <Select value={formData.posyanduId} onChange={(e) => setFormData({...formData, posyanduId: e.target.value})} required>
                <option value="">-- Pilih Posyandu --</option>
                {myPosyandus.map(p => <option key={p.id} value={p.id}>{p.name} ({p.village})</option>)}
             </Select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">Buat Akun</Button>
          </div>
        </form>
      </Modal>
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} />
    </div>
  );
}