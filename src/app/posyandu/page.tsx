"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Posyandu } from "@/types/schema";
import { getChildrenByPosyandu } from "@/lib/services/children"; // Import Service Anak
import { getParentsByPosyandu } from "@/lib/services/parents";   // Import Service Ortu
import { 
  Bell, 
  MapPin, 
  Activity, 
  Calendar, 
  Users, 
  Baby, 
  ChevronRight, 
  ClipboardList 
} from "lucide-react";
import Link from "next/link";

export default function KaderDashboard() {
  const { userProfile, loading } = useAuth();
  const [posyanduData, setPosyanduData] = useState<Posyandu | null>(null);
  
  // State untuk menyimpan angka statistik
  const [stats, setStats] = useState({
    childrenCount: 0,
    parentsCount: 0,
    riskCount: 0 // Untuk status 'inadequate'
  });

  useEffect(() => {
    const initDashboard = async () => {
      if (userProfile?.posyanduId) {
        try {
          // 1. Ambil Data Detail Posyandu
          const docRef = doc(db, "posyandus", userProfile.posyanduId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPosyanduData({ id: docSnap.id, ...docSnap.data() } as Posyandu);
          }

          // 2. Ambil Data Statistik Real-time
          const [childrenRes, parentsRes] = await Promise.all([
            getChildrenByPosyandu(userProfile.posyanduId),
            getParentsByPosyandu(userProfile.posyanduId)
          ]);

          // Hitung Ringkasan
          // Catatan: riskCount bergantung pada field 'lastWeightStatus' di data anak. 
          // Jika belum di-update di logic pengukuran, mungkin masih 0.
          const risky = childrenRes.filter(c => 
            c.lastWeightStatus === 'inadequate' || c.lastLengthStatus === 'inadequate'
          ).length;

          setStats({
            childrenCount: childrenRes.length,
            parentsCount: parentsRes.length,
            riskCount: risky
          });

        } catch (error) {
          console.error("Gagal memuat data dashboard:", error);
        }
      }
    };

    if (!loading) {
      initDashboard();
    }
  }, [userProfile, loading]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium">Memuat Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 font-sans pb-24">
      
      {/* --- 1. HEADER SECTION --- */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-0.5">Selamat Pagi, Pahlawan! 👋</p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {userProfile?.name || "Kader Posyandu"}
          </h1>
        </div>
        <button className="relative p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-2.5 right-3 h-2 w-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* --- 2. HERO CARD POSYANDU --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 md:p-8 text-white shadow-xl shadow-blue-900/10">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
           <Activity className="w-40 h-40 text-white transform translate-x-8 -translate-y-8" />
        </div>
        
        <div className="relative z-10">
           <div className="flex items-start justify-between">
              <div>
                 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs font-semibold mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Lokasi Tugas</span>
                 </div>
                 <h2 className="text-3xl font-bold tracking-tight mb-1">
                    {posyanduData?.name || "Posyandu Mawar"}
                 </h2>
                 <p className="text-blue-100 text-sm opacity-90">
                    {posyanduData?.address || "Memuat alamat..."} • {posyanduData?.village}
                 </p>
              </div>
           </div>

           <div className="mt-8 pt-6 border-t border-white/10 flex gap-6 md:gap-12">
              <div>
                 <p className="text-xs text-blue-200 font-medium uppercase tracking-wider mb-1">Status Operasional</p>
                 <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="font-semibold text-white text-sm">Aktif Melayani</span>
                 </div>
              </div>
              <div>
                 <p className="text-xs text-blue-200 font-medium uppercase tracking-wider mb-1">Jadwal Berikutnya</p>
                 <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-200" />
                    <span className="font-semibold text-white text-sm">15 November 2025</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* --- 3. QUICK STATS GRID --- */}
      <div>
         <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Ringkasan Data
         </h3>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat Item 1: Total Balita */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
               <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                  <Baby className="w-5 h-5" />
               </div>
               <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Balita</p>
               <h4 className="text-2xl font-bold text-slate-900 mt-1">
                  {stats.childrenCount} <span className="text-sm font-normal text-slate-400">Anak</span>
               </h4>
            </div>

            {/* Stat Item 2: Orang Tua */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
               <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
               </div>
               <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Orang Tua</p>
               <h4 className="text-2xl font-bold text-slate-900 mt-1">
                  {stats.parentsCount} <span className="text-sm font-normal text-slate-400">Akun</span>
               </h4>
            </div>

            {/* Stat Item 3: Perlu Pantauan */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
               <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-3 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
               </div>
               <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Perlu Pantauan</p>
               <h4 className="text-2xl font-bold text-slate-900 mt-1">
                  {stats.riskCount} <span className="text-sm font-normal text-slate-400">Kasus</span>
               </h4>
            </div>

            {/* Stat Item 4 (Action) */}
            <Link href="/posyandu/scan" className="bg-primary/5 p-5 rounded-2xl border border-primary/10 hover:bg-primary/10 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group">
               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm mb-2 group-hover:scale-110 transition-transform">
                  <ChevronRight className="w-5 h-5" />
               </div>
               <span className="text-primary font-bold text-sm">Mulai Kegiatan</span>
               <span className="text-primary/60 text-xs">Input Data Baru</span>
            </Link>

         </div>
      </div>

      {/* --- 4. ACTIVITY FEED AREA (Static Placeholder for V2) --- */}
      <div className="grid md:grid-cols-2 gap-6">
         {/* Jadwal / Agenda */}
         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-800">Agenda Posyandu</h3>
               <button className="text-xs text-primary font-bold hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="bg-white p-2 rounded-lg text-center min-w-[50px] shadow-sm">
                     <span className="block text-xs font-bold text-rose-500 uppercase">NOV</span>
                     <span className="block text-lg font-bold text-slate-800">15</span>
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-800 text-sm">Penimbangan Balita Rutin</h4>
                     <p className="text-xs text-slate-500 mt-0.5">08:00 - 11:00 WIB • Balai Desa</p>
                  </div>
               </div>
               {/* Empty State jika tidak ada jadwal lain */}
               <div className="text-center py-4 text-slate-400 text-xs italic">
                  Tidak ada agenda lain bulan ini.
               </div>
            </div>
         </div>

         {/* Quick Tips / Edukasi Kader */}
         <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6 relative overflow-hidden">
            <div className="relative z-10">
               <h3 className="font-bold text-amber-900 mb-2">Tips Kader Cerdas 💡</h3>
               <p className="text-sm text-amber-800/80 leading-relaxed mb-4">
                  "Pastikan balita tidak memakai jaket tebal atau popok basah saat ditimbang untuk hasil yang akurat."
               </p>
               <button className="px-4 py-2 bg-white text-amber-700 text-xs font-bold rounded-lg shadow-sm hover:bg-amber-100 transition-colors">
                  Baca Panduan Pengukuran
               </button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-200/50 rounded-full blur-xl"></div>
         </div>
      </div>

    </div>
  );
}