"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Posyandu } from "@/types/schema";
// Tambahkan 'Users' ke dalam import
import { Bell, MapPin, Activity, Calendar, Users } from "lucide-react";

export default function KaderDashboard() {
  const { userProfile, loading } = useAuth();
  const [posyanduData, setPosyanduData] = useState<Posyandu | null>(null);

  // Ambil data detail Posyandu berdasarkan ID di profil user
  useEffect(() => {
    const fetchPosyandu = async () => {
      if (userProfile?.posyanduId) {
        const docRef = doc(db, "posyandus", userProfile.posyanduId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPosyanduData({ id: docSnap.id, ...docSnap.data() } as Posyandu);
        }
      }
    };
    fetchPosyandu();
  }, [userProfile]);

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat data...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header Profile */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">Selamat Pagi,</p>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            {userProfile?.name || "Kader Posyandu"}
          </h1>
        </div>
        <div className="p-2 bg-slate-50 rounded-full border border-slate-100 relative">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
        </div>
      </div>

      {/* Card Info Posyandu */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-xs font-medium mb-1">LOKASI TUGAS</p>
            <h2 className="text-lg font-bold">
              {posyanduData?.name || "Memuat Lokasi..."}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-blue-50">
              <MapPin className="h-3 w-3" />
              <span>{posyanduData?.village || "-"}</span>
            </div>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Activity className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Statistik Cepat (Placeholder) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="p-2 bg-orange-100 w-fit rounded-lg mb-3">
            <Users className="h-5 w-5 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">0</h3>
          <p className="text-xs text-slate-500">Total Balita</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="p-2 bg-green-100 w-fit rounded-lg mb-3">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Nov</h3>
          <p className="text-xs text-slate-500">Jadwal Timbang</p>
        </div>
      </div>

      {/* Today's Task Area */}
      <div>
        <h3 className="font-bold text-slate-900 mb-3">Aksi Cepat</h3>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center space-y-2">
          <p className="text-sm text-slate-500">Belum ada kegiatan hari ini.</p>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            + Tambah Jadwal Posyandu
          </button>
        </div>
      </div>
    </div>
  );
}