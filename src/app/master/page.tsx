"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Activity, LogOut, Users, Building2, Baby } from "lucide-react";

export default function MasterDashboard() {
  const { userProfile, logout, loading } = useAuth();
  const router = useRouter();

  // Proteksi Halaman: Jika bukan master, tendang keluar
  if (!loading && userProfile?.role !== "master") {
    // router.push("/login"); // Uncomment nanti saat production
    // Untuk testing, kita biarkan dulu biar bisa lihat walau ada delay load
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Sederhana */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900">SAESTU Master</h1>
            <p className="text-xs text-slate-500">Panel Kontrol Utama</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium hidden md:block">
            Halo, {userProfile?.name || "Admin"}
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>
      </nav>

      {/* Konten Dashboard */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Statistik 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Posyandu</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">0</h3>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">Terdaftar di sistem</p>
          </div>

          {/* Card Statistik 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Kader</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">0</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">Petugas aktif</p>
          </div>

          {/* Card Statistik 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Anak</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">0</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Baby className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">Data terpantau</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-900">Selamat Datang di Versi Awal!</h2>
          <p className="text-slate-500 mt-2">Menu manajemen posyandu dan user akan kita bangun di tahap selanjutnya.</p>
        </div>
      </main>
    </div>
  );
}