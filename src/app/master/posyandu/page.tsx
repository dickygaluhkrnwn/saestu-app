"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { addPosyandu, getPosyandus, deletePosyandu } from "@/lib/services/posyandu";
import { Posyandu } from "@/types/schema";

export default function PosyanduPage() {
  const [posyandus, setPosyandus] = useState<Posyandu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    village: "",
    district: "",
    address: "",
  });

  // Fetch data saat halaman dibuka
  const fetchData = async () => {
    try {
      const data = await getPosyandus();
      setPosyandus(data);
    } catch (err) {
      alert("Gagal mengambil data posyandu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Submit Tambah Posyandu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addPosyandu(formData);
      await fetchData(); // Refresh data
      setIsModalOpen(false); // Tutup modal
      setFormData({ name: "", village: "", district: "", address: "" }); // Reset form
    } catch (err) {
      alert("Gagal menambah posyandu");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus Posyandu ${name}? Data kader & anak terkait mungkin akan error.`)) {
      try {
        await deletePosyandu(id);
        await fetchData();
      } catch (err) {
        alert("Gagal menghapus");
      }
    }
  };

  // Filter Search
  const filteredPosyandus = posyandus.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Posyandu</h1>
          <p className="text-slate-500 text-sm">Daftar lokasi pelayanan kesehatan anak</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Posyandu
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Cari nama posyandu atau desa..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama Posyandu</th>
                <th className="px-6 py-4">Wilayah (Desa/Kec)</th>
                <th className="px-6 py-4">Alamat Lengkap</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Memuat data...</td>
                </tr>
              ) : filteredPosyandus.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Belum ada data posyandu.</td>
                </tr>
              ) : (
                filteredPosyandus.map((posyandu) => (
                  <tr key={posyandu.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{posyandu.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {posyandu.village}, {posyandu.district}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {posyandu.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(posyandu.id, posyandu.name)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Posyandu */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Tambah Posyandu Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Posyandu</label>
            <Input 
              placeholder="Contoh: Mawar 1" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kelurahan/Desa</label>
              <Input 
                placeholder="Nama Desa" 
                required
                value={formData.village}
                onChange={(e) => setFormData({...formData, village: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Kecamatan</label>
              <Input 
                placeholder="Nama Kecamatan" 
                required
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Alamat Lengkap</label>
            <Input 
              placeholder="Jalan, RT/RW, Patokan..." 
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}