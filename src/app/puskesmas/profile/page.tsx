"use client";

import { useAuth } from "@/context/AuthContext";
import { 
  UserCircle, 
  Mail, 
  Building2, 
  ShieldCheck, 
  LogOut, 
  Calendar,
  MapPin,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function PuskesmasProfilePage() {
  const { userProfile, logout } = useAuth();

  if (!userProfile) return null;

  return (
    <div className="p-6 md:p-8 font-sans max-w-4xl mx-auto space-y-8">
      
      {/* HEADER SECTION */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 shadow-2xl text-white overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldCheck className="w-64 h-64 text-white transform translate-x-12 -translate-y-12" />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-1 shadow-xl">
               <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-5xl font-bold text-emerald-400">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
               </div>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-2">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-emerald-300 mb-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Akun Terverifikasi</span>
               </div>
               <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  {userProfile.name}
               </h1>
               <p className="text-slate-400 text-lg">
                  Administrator Wilayah
               </p>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
               <Button 
                  onClick={logout}
                  className="bg-rose-600 hover:bg-rose-700 text-white border-0 shadow-lg shadow-rose-900/20 font-bold px-6 h-12 rounded-2xl w-full md:w-auto"
               >
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar Akun
               </Button>
            </div>
         </div>
      </div>

      {/* DETAIL INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Informasi Akun */}
         <Card className="p-6 border-0 shadow-lg bg-white rounded-3xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
               <UserCircle className="w-5 h-5 text-blue-600" />
               Informasi Akun
            </h3>
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                     <Mail className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Login</p>
                     <p className="font-semibold text-slate-800">{userProfile.email}</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                     <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Terdaftar Sejak</p>
                     <p className="font-semibold text-slate-800">
                        {userProfile.createdAt instanceof Date 
                           ? userProfile.createdAt.toLocaleDateString('id-ID', { dateStyle: 'long' }) 
                           : "Baru Saja"}
                     </p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                     <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role Akses</p>
                     <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 px-3 py-1 text-xs">
                        Petugas Puskesmas
                     </Badge>
                  </div>
               </div>
            </div>
         </Card>

         {/* Informasi Wilayah Kerja */}
         <Card className="p-6 border-0 shadow-lg bg-white rounded-3xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
               <Building2 className="w-5 h-5 text-indigo-600" />
               Wilayah Kerja
            </h3>
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500">
                     <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ID Entitas Puskesmas</p>
                     <p className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-600 break-all">
                        {userProfile.puskesmasId || "Belum ditautkan"}
                     </p>
                  </div>
               </div>
               
               {/* Placeholder statis, nanti bisa di-fetch real */}
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-4">
                  <div className="flex items-center gap-3 text-slate-600 mb-2">
                     <FileText className="w-4 h-4" />
                     <span className="text-sm font-semibold">Status Kewenangan</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                     Akun ini memiliki kewenangan penuh untuk mengelola data Posyandu, Kader, dan memantau status gizi anak di wilayah kerja yang terdaftar.
                  </p>
               </div>
            </div>
         </Card>
      </div>

    </div>
  );
}