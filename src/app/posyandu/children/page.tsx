"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 1. Import Router
import { useAuth } from "@/context/AuthContext";
import { Plus, Search, Baby, Trash2, ChevronRight, Weight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getChildrenByPosyandu, addChild, deleteChild, CreateChildInput } from "@/lib/services/children";
import { getParentsByPosyandu } from "@/lib/services/parents";
import { Child, UserProfile } from "@/types/schema";
import { calculateAgeInMonths } from "@/lib/who-standards";

export default function ChildrenPage() {
  const router = useRouter(); // 2. Inisialisasi Router
  const { userProfile } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [parents, setParents] = useState<UserProfile[]>([]);
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

      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-slate-500 py-8">Memuat data...</p>
        ) : filteredChildren.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <Baby className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">Belum ada data anak.</p>
          </div>
        ) : (
          filteredChildren.map((child) => (
            <div 
              key={child.id} 
              // 3. Tambahkan fungsi onClick ini agar kartu bisa diklik
              onClick={() => router.push(`/posyandu/children/${child.id}`)}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors group"
            >
              <div className="flex gap-4 items-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${child.gender === 'L' ? 'bg-blue-400' : 'bg-pink-400'}`}>
                  {child.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">{child.name}</h3>
                  <div className="text-xs text-slate-500 flex flex-col gap-0.5">
                    <span>{calculateAgeInMonths(child.dob as Date)} Bulan</span>
                    <span className="text-slate-400">{child.parentName}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Tombol Hapus (Stop Propagation agar tidak memicu navigasi) */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    if(confirm("Hapus data anak ini?")) {
                      deleteChild(child.id).then(fetchData);
                    }
                  }}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah Anak (Form) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Tambah Data Anak"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {/* Identitas Dasar */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Lengkap Anak</label>
            <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">NIK (Opsional)</label>
              <Input value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Jenis Kelamin</label>
              <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value as "L"|"P"})}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tempat Lahir</label>
              <Input value={formData.pob} onChange={(e) => setFormData({...formData, pob: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Lahir</label>
              <Input type="date" required value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Pilih Orang Tua</label>
            <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none" value={formData.parentId} onChange={(e) => setFormData({...formData, parentId: e.target.value})}>
              <option value="">-- Manual --</option>
              {parents.map(p => <option key={p.uid} value={p.uid}>{p.name} ({p.email})</option>)}
            </select>
          </div>
          {!formData.parentId && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Orang Tua (Manual)</label>
              <Input required={!formData.parentId} value={formData.parentName} onChange={(e) => setFormData({...formData, parentName: e.target.value})} />
            </div>
          )}
           <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded">
            <div className="space-y-2">
              <label className="text-sm font-medium">Berat Lahir (kg)</label>
              <Input type="number" step="0.01" required value={formData.initialWeight || ""} onChange={(e) => setFormData({...formData, initialWeight: parseFloat(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Panjang (cm)</label>
              <Input type="number" step="0.1" required value={formData.initialHeight || ""} onChange={(e) => setFormData({...formData, initialHeight: parseFloat(e.target.value)})} />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={isSubmitting}>Simpan Data</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}