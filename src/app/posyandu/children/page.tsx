"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Search, Baby, Ruler, Weight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getChildrenByPosyandu, addChild, deleteChild, CreateChildInput } from "@/lib/services/children";
import { getParentsByPosyandu } from "@/lib/services/parents";
import { Child, UserProfile } from "@/types/schema";
import { calculateAgeInMonths } from "@/lib/who-standards";

export default function ChildrenPage() {
  const { userProfile } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [parents, setParents] = useState<UserProfile[]>([]); // Untuk dropdown orang tua
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [formData, setFormData] = useState<CreateChildInput>({
    name: "",
    nik: "",
    gender: "L",
    pob: "",
    dob: "",
    parentName: "",
    parentId: "",
    posyanduId: "",
    initialWeight: 0,
    initialHeight: 0,
  });

  const fetchData = async () => {
    if (!userProfile?.posyanduId) return;
    try {
      const [childrenData, parentsData] = await Promise.all([
        getChildrenByPosyandu(userProfile.posyanduId),
        getParentsByPosyandu(userProfile.posyanduId)
      ]);
      setChildren(childrenData);
      setParents(parentsData);
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
      // Cari nama orang tua dari ID jika dipilih dari dropdown
      let parentName = formData.parentName;
      if (formData.parentId) {
        const selectedParent = parents.find(p => p.uid === formData.parentId);
        if (selectedParent) parentName = selectedParent.name;
      }

      await addChild({
        ...formData,
        posyanduId: userProfile.posyanduId,
        parentName: parentName,
      });
      
      await fetchData();
      setIsModalOpen(false);
      resetForm();
      alert("Data Anak berhasil ditambahkan!");
    } catch (err) {
      alert("Gagal menambah data anak.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "", nik: "", gender: "L", pob: "", dob: "",
      parentName: "", parentId: "", posyanduId: "",
      initialWeight: 0, initialHeight: 0
    });
  };

  const filteredChildren = children.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nik.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Data Balita</h1>
          <p className="text-sm text-slate-500">Daftar anak di posyandu ini</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Anak Baru
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Cari nama anak atau NIK..." 
          className="pl-10 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <p className="text-center text-slate-500 py-8">Memuat data...</p>
        ) : filteredChildren.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <Baby className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">Belum ada data anak.</p>
          </div>
        ) : (
          filteredChildren.map((child) => (
            <div key={child.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
              <div className="flex gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-white ${child.gender === 'L' ? 'bg-blue-400' : 'bg-pink-400'}`}>
                  {child.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{child.name}</h3>
                  <div className="text-xs text-slate-500 flex flex-col gap-1 mt-1">
                    <span>Usia: {calculateAgeInMonths(child.dob as Date)} Bulan</span>
                    <span>Ortu: {child.parentName}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end gap-2">
                <button 
                  onClick={async () => {
                    if(confirm("Hapus data anak ini?")) {
                      await deleteChild(child.id);
                      fetchData();
                    }
                  }}
                  className="p-1 text-slate-300 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah Anak */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Tambah Data Anak"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          
          {/* Identitas Dasar */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Lengkap Anak</label>
            <Input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">NIK (Opsional)</label>
              <Input 
                value={formData.nik}
                onChange={(e) => setFormData({...formData, nik: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Jenis Kelamin</label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value as "L"|"P"})}
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tempat Lahir</label>
              <Input 
                value={formData.pob}
                onChange={(e) => setFormData({...formData, pob: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Lahir</label>
              <Input 
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
              />
            </div>
          </div>

          {/* Data Orang Tua */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase">Data Orang Tua</p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pilih Akun Orang Tua (Jika Ada)</label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                value={formData.parentId}
                onChange={(e) => setFormData({...formData, parentId: e.target.value})}
              >
                <option value="">-- Manual (Tidak Punya Akun) --</option>
                {parents.map(p => (
                  <option key={p.uid} value={p.uid}>{p.name} ({p.email})</option>
                ))}
              </select>
            </div>
            
            {!formData.parentId && (
              <div className="space-y-2 animate-in fade-in">
                <label className="text-sm font-medium">Nama Ibu/Ayah (Manual)</label>
                <Input 
                  required={!formData.parentId}
                  placeholder="Masukkan nama orang tua..."
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                />
              </div>
            )}
          </div>

          {/* Data Awal */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-3">
            <p className="text-xs font-bold text-blue-600 uppercase">Kondisi Lahir</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Berat Lahir (kg)</label>
                <div className="relative">
                  <Input 
                    type="number" step="0.01"
                    required
                    className="pr-8"
                    value={formData.initialWeight || ""}
                    onChange={(e) => setFormData({...formData, initialWeight: parseFloat(e.target.value)})}
                  />
                  <Weight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Panjang (cm)</label>
                <div className="relative">
                  <Input 
                    type="number" step="0.1"
                    required
                    className="pr-8"
                    value={formData.initialHeight || ""}
                    onChange={(e) => setFormData({...formData, initialHeight: parseFloat(e.target.value)})}
                  />
                  <Ruler className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={isSubmitting}>Simpan Data</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}