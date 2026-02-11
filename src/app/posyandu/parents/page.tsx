"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Search, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getParentsByPosyandu, createParentAccount } from "@/lib/services/parents";
import { deleteUserFirestore } from "@/lib/services/users"; // Reuse fitur hapus
import { UserProfile } from "@/types/schema";

export default function ParentsPage() {
  const { userProfile } = useAuth();
  const [parents, setParents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

    setIsSubmitting(true);
    try {
      await createParentAccount(userProfile.posyanduId, formData);
      await fetchData();
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "" });
      alert("Akun Orang Tua berhasil dibuat!");
    } catch (err: any) {
      alert("Gagal: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredParents = parents.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Data Orang Tua</h1>
          <p className="text-sm text-slate-500">Daftar akun warga terdaftar</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Baru
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Cari nama ibu atau email..." 
          className="pl-10 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List Card Mobile-Friendly */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-slate-500 py-8">Memuat data...</p>
        ) : filteredParents.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border border-slate-100">
            <User className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">Belum ada data orang tua.</p>
          </div>
        ) : (
          filteredParents.map((parent) => (
            <div key={parent.uid} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                  {parent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{parent.name}</h3>
                  <p className="text-xs text-slate-500">{parent.email}</p>
                </div>
              </div>
              {/* Tombol Hapus (Optional) */}
              <button 
                onClick={async () => {
                  if(confirm("Hapus akun ini?")) {
                    await deleteUserFirestore(parent.uid);
                    fetchData();
                  }
                }}
                className="p-2 text-slate-300 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Daftarkan Orang Tua"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Lengkap (Ibu/Ayah)</label>
            <Input 
              placeholder="Contoh: Ibu Ani" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email (untuk Login)</label>
            <Input 
              type="email"
              placeholder="email@contoh.com" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <p className="text-[10px] text-slate-400">Gunakan email aktif atau buatkan email baru.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password Sementara</label>
            <Input 
              type="text"
              placeholder="Minimal 6 karakter" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={isSubmitting}>Daftarkan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}