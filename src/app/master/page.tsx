"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Activity, LogOut, Users, Building2, Baby, ArrowRight, ShieldCheck, Map } from "lucide-react";
import Link from "next/link";

// Services untuk data real
import { getPuskesmasEntities } from "@/lib/services/puskesmas";
import { getUsers } from "@/lib/services/users";

export default function MasterDashboard() {
  const { userProfile, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  // State untuk statistik
  const [stats, setStats] = useState({
    totalPuskesmas: 0,
    totalUsers: 0
  });
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch Data Statistik Real-time
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [puskesmasData, usersData] = await Promise.all([
          getPuskesmasEntities(),
          getUsers()
        ]);
        
        // Filter user yang role-nya petugas puskesmas agar lebih relevan
        const petugasCount = usersData.filter(u => u.role === 'puskesmas').length;

        setStats({
          totalPuskesmas: puskesmasData.length,
          totalUsers: petugasCount
        });
      } catch (error) {
        console.error("Gagal memuat statistik", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium">Memuat Master Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-6 md:p-8 font-sans">
      
      {/* --- HERO WELCOME CARD --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
           <ShieldCheck className="w-64 h-64 text-white transform translate-x-12 -translate-y-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
           <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                 <span>Super Admin Panel</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-white">
                   Halo, {userProfile?.name || "Administrator"}
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                   Selamat datang. Anda memegang kendali atas seluruh entitas Puskesmas dan akun petugas wilayah.
                </p>
              </div>
           </div>
           
           <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                 <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Server Status</p>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="font-bold text-emerald-400">Online & Stabil</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div>
         <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Ringkasan Eksekutif
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Stat Card 1: Puskesmas Entities */}
            <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                     <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase">Unit Layanan</span>
               </div>
               <div>
                  <p className="text-sm font-medium text-slate-500">Total Puskesmas</p>
                  {/* UPDATE: Menggunakan data real dari state */}
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">
                    {dataLoading ? "..." : stats.totalPuskesmas}
                  </h3>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Entitas terdaftar</span>
                  <Link href="/master/puskesmas" className="text-xs font-bold text-blue-600 flex items-center hover:underline">
                     Kelola <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
               </div>
            </div>

            {/* Stat Card 2: Petugas Admin */}
            <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                     <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase">SDM</span>
               </div>
               <div>
                  <p className="text-sm font-medium text-slate-500">Petugas Wilayah</p>
                  {/* UPDATE: Menggunakan data real dari state */}
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">
                    {dataLoading ? "..." : stats.totalUsers}
                  </h3>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Admin Puskesmas</span>
                  <Link href="/master/users" className="text-xs font-bold text-indigo-600 flex items-center hover:underline">
                     Kelola <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
               </div>
            </div>

         </div>
      </div>

      {/* --- QUICK LINKS --- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
         <h4 className="font-bold text-slate-900 mb-4">Pintasan Admin</h4>
         <div className="space-y-3">
            <Link href="/master/puskesmas" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors group">
               <span className="text-sm font-medium">Registrasi Entitas Puskesmas Baru</span>
               <div className="p-1.5 bg-white rounded-lg border border-slate-200 group-hover:border-blue-200">
                  <ArrowRight className="w-4 h-4" />
               </div>
            </Link>
            <Link href="/master/users" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
               <span className="text-sm font-medium">Buat Akun Login Petugas</span>
               <div className="p-1.5 bg-white rounded-lg border border-slate-200 group-hover:border-indigo-200">
                  <ArrowRight className="w-4 h-4" />
               </div>
            </Link>
            {/* LINK KE HALAMAN SEED (Hanya muncul jika di localhost/dev environment idealnya) */}
            <Link href="/master/seed" className="flex items-center justify-between p-3 rounded-xl bg-amber-50 hover:bg-amber-100 hover:text-amber-800 transition-colors group border border-amber-200/50">
               <span className="text-sm font-bold flex items-center gap-2">
                 <Database className="w-4 h-4" /> 
                 Seed Data Dummy
               </span>
               <div className="p-1.5 bg-white rounded-lg border border-amber-200 group-hover:border-amber-300">
                  <ArrowRight className="w-4 h-4" />
               </div>
            </Link>
         </div>
      </div>

    </div>
  );
}

// Helper icon
import { Database } from "lucide-react";