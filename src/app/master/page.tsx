"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Activity, LogOut, Users, Building2, Baby, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function MasterDashboard() {
  const { userProfile, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) return (
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
      {/* Tambahkan class text-white di sini untuk memaksa semua child text jadi putih */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
           <ShieldCheck className="w-64 h-64 text-white transform translate-x-12 -translate-y-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
           <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                 <span>Sistem Terpusat</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-white">
                    Halo, {userProfile?.name || "Administrator"}
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                    Selamat datang di Panel Kontrol Utama SAESTU. Anda memiliki akses penuh untuk mengelola data posyandu, pengguna, dan memantau statistik kesehatan wilayah.
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
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                 <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Region</p>
                 <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-blue-100">Indonesia (WIB)</span>
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
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Stat Card 1: Posyandu */}
            <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                     <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase">Master Data</span>
               </div>
               <div>
                  <p className="text-sm font-medium text-slate-500">Total Posyandu</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">0</h3>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Titik layanan aktif</span>
                  <Link href="/master/posyandu" className="text-xs font-bold text-blue-600 flex items-center hover:underline">
                     Kelola <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
               </div>
            </div>

            {/* Stat Card 2: Kader/Users */}
            <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                     <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase">SDM</span>
               </div>
               <div>
                  <p className="text-sm font-medium text-slate-500">Total Kader</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">0</h3>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Petugas terdaftar</span>
                  <Link href="/master/users" className="text-xs font-bold text-indigo-600 flex items-center hover:underline">
                     Kelola <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
               </div>
            </div>

            {/* Stat Card 3: Anak (Aggregated) */}
            <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                     <Baby className="h-6 w-6 text-emerald-600" />
                  </div>
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase">Penerima Manfaat</span>
               </div>
               <div>
                  <p className="text-sm font-medium text-slate-500">Total Anak</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">0</h3>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Data terpantau sistem</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                     Real-time Data
                  </span>
               </div>
            </div>

         </div>
      </div>

      {/* --- QUICK LINKS / SYSTEM INFO --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h4 className="font-bold text-slate-900 mb-4">Pintasan Admin</h4>
            <div className="space-y-3">
               <Link href="/master/posyandu" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors group">
                  <span className="text-sm font-medium">Tambah Posyandu Baru</span>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 group-hover:border-blue-200">
                     <ArrowRight className="w-4 h-4" />
                  </div>
               </Link>
               <Link href="/master/users" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
                  <span className="text-sm font-medium">Registrasi Akun Kader</span>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 group-hover:border-indigo-200">
                     <ArrowRight className="w-4 h-4" />
                  </div>
               </Link>
            </div>
         </div>

         <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
               <Activity className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="font-bold text-slate-900">System Health</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4 max-w-xs">
               Semua layanan (Database, Auth, Storage) berjalan normal. Tidak ada insiden dilaporkan.
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
               All Systems Operational
            </span>
         </div>
      </div>

    </div>
  );
}