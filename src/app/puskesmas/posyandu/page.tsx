"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, Search, Building2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

// Services
import { addPosyandu, getPosyandusByPuskesmas, deletePosyandu } from "@/lib/services/posyandu";
import { Posyandu } from "@/types/schema";

export default function PuskesmasPosyanduPage() {
  const { userProfile } = useAuth();
  const [posyandus, setPosyandus] = useState<Posyandu[]>([]);
  const [loading, setLoading] = useState(true);
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
          puskesmasId: userProfile.puskesmasId // AUTO LINK
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
    if (confirm(`Yakin ingin menghapus Posyandu ${name}?`)) {
      try {
        await deletePosyandu(id);
        await fetchData();
        showToast("Data berhasil dihapus", "info");
      } catch (err) { showToast("Gagal menghapus data", "error"); }
    }
  };

  const filteredPosyandus = posyandus.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 font-sans">
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 shadow-xl text-white overflow-hidden">
         <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Building2 className="w-48 h-48 text-white transform translate-x-10 -translate-y-10" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
               <h1 className="text-3xl font-bold tracking-tight mb-2 !text-white">Manajemen Posyandu</h1>
               <p className="text-emerald-50 max-w-lg opacity-90 !text-white">Kelola titik layanan Posyandu di wilayah kerja Puskesmas Anda.</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="bg-white text-emerald-700 hover:bg-emerald-50 border-0 shadow-lg font-bold h-12 px-6 rounded-2xl">
               <Plus className="h-5 w-5 mr-2" /> Tambah Posyandu
            </Button>
         </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input placeholder="Cari posyandu atau desa..." className="w-full pl-10 pr-4 py-3 bg-transparent outline-none text-sm text-slate-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading...</p> : filteredPosyandus.map((posyandu) => (
           <Card key={posyandu.id} hoverable className="group flex flex-col justify-between h-full bg-white border-slate-100 p-5">
              <div>
                 <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">{posyandu.name.charAt(0)}</div>
                    <Badge variant="outline" className="bg-slate-50">{posyandu.village}</Badge>
                 </div>
                 <h3 className="font-bold text-lg text-slate-800 mb-1">{posyandu.name}</h3>
                 <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 text-emerald-400" />
                    <span>{posyandu.address}</span>
                 </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
                 <button onClick={() => handleDelete(posyandu.id, posyandu.name)} className="text-slate-400 hover:text-rose-600 text-xs font-bold flex items-center gap-1.5"><Trash2 className="h-3.5 w-3.5" /> Hapus</button>
              </div>
           </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Posyandu">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Nama Posyandu" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input placeholder="Desa / Kelurahan" required value={formData.village} onChange={(e) => setFormData({...formData, village: e.target.value})} />
          <Input placeholder="Kecamatan" required value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} />
          <Input placeholder="Alamat Lengkap" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">Simpan</Button>
          </div>
        </form>
      </Modal>
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} />
    </div>
  );
}