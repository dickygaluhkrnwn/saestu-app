"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, UserCog, Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getUsers, createUser, deleteUserFirestore, CreateUserInput } from "@/lib/services/users";
import { getPosyandus } from "@/lib/services/posyandu";
import { UserProfile, Posyandu } from "@/types/schema";

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [posyandus, setPosyandus] = useState<Posyandu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
      alert("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana
    if (formData.role === "kader" && !formData.posyanduId) {
      alert("Kader wajib memilih Posyandu!");
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
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        alert("Email sudah terdaftar!");
      } else {
        alert("Gagal membuat user: " + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (uid: string, name: string) => {
    if (confirm(`Hapus akses untuk ${name}? (Akun login tetap ada, tapi akses data dicabut)`)) {
      try {
        await deleteUserFirestore(uid);
        await fetchData();
      } catch (err) {
        alert("Gagal menghapus.");
      }
    }
  };

  // Helper untuk mendapatkan nama posyandu dari ID
  const getPosyanduName = (id?: string) => {
    if (!id) return "-";
    return posyandus.find(p => p.id === id)?.name || "Unknown";
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
          <p className="text-slate-500 text-sm">Kelola akun Petugas Puskesmas & Kader</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah User
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama & Email</th>
                <th className="px-6 py-4">Jabatan (Role)</th>
                <th className="px-6 py-4">Lokasi Tugas</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr key="loading">
                  <td colSpan={4} className="px-6 py-8 text-center">Loading...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr key="empty">
                  <td colSpan={4} className="px-6 py-8 text-center">Belum ada user.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'master' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'puskesmas' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'master' ? 'Master Admin' :
                         user.role === 'puskesmas' ? 'Petugas Puskesmas' : 'Kader Posyandu'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {user.role === 'kader' ? (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3" />
                          {getPosyanduName(user.posyanduId)}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'master' && (
                        <button 
                          onClick={() => handleDelete(user.uid, user.name)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Hapus User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Daftarkan Pengguna Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Lengkap</label>
            <Input 
              placeholder="Contoh: Budi Santoso" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Login</label>
              <Input 
                type="email"
                placeholder="nama@email.com" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password Awal</label>
              <Input 
                type="text"
                placeholder="Min. 6 karakter" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Jabatan</label>
            <select 
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value as any})}
            >
              <option value="kader">Kader Posyandu</option>
              <option value="puskesmas">Petugas Puskesmas</option>
            </select>
          </div>

          {formData.role === "kader" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-medium">Tugaskan di Posyandu</label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                value={formData.posyanduId}
                onChange={(e) => setFormData({...formData, posyanduId: e.target.value})}
                required
              >
                <option value="">-- Pilih Posyandu --</option>
                {posyandus.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.village})</option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Buat Akun
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}