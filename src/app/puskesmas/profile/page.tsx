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
  FileText,
  Settings,
  HelpCircle,
  ChevronRight,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default function PuskesmasProfilePage() {
  const { userProfile, logout } = useAuth();

  if (!userProfile) return null;

  // Format Tanggal Terdaftar dengan Type Guard yang sangat aman (FIX TypeScript Error)
  let joinDate = "Baru Saja";
  if (userProfile.createdAt) {
      try {
          const createdAt = userProfile.createdAt as any;
          // Cek apakah dia punya method toDate() khas Firestore Timestamp
          const dateObj = typeof createdAt.toDate === 'function' 
              ? createdAt.toDate() 
              // Jika tidak, paksa parse sebagai Date JS standar
              : new Date(createdAt);
              
          // Validasi apakah hasil parse valid
          if (!isNaN(dateObj.getTime())) {
              joinDate = dateObj.toLocaleDateString('id-ID', { dateStyle: 'long' });
          }
      } catch (e) {
          console.warn("Format tanggal tidak dikenali");
      }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 font-sans pb-28 max-w-3xl mx-auto">
      
      {/* --- HEADER TITLE (DESKTOP ONLY) --- */}
      <div className="mt-2 mb-6 hidden md:block">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Profil Administrator</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">Kelola identitas akun dan preferensi sistem Puskesmas Anda.</p>
      </div>

      {/* --- PROFILE BANNER CARD (ENTERPRISE STYLE) --- */}
      <Card className="bg-white border-0 shadow-lg shadow-slate-200/50 overflow-hidden relative rounded-3xl">
        {/* Abstract Background Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-br from-emerald-600 to-teal-800 relative overflow-hidden">
           <div className="absolute top-[-20%] right-[-5%] w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
           <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
              <ShieldCheck className="w-24 h-24 text-white transform rotate-12" />
           </div>
        </div>
        
        <div className="px-6 sm:px-8 pb-8 relative">
           
           {/* Floating Avatar */}
           <div className="absolute -top-16 sm:-top-20 left-6 sm:left-8">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] bg-white p-2 shadow-xl shadow-slate-300/50">
                 <div className="w-full h-full rounded-[1.5rem] bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-4xl sm:text-5xl font-black text-emerald-600 border border-emerald-100">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <UserCircle className="w-12 h-12 text-slate-400" />}
                 </div>
              </div>
           </div>

           {/* Profile Identity */}
           <div className="pt-16 sm:pt-20 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                       <ShieldCheck className="w-3 h-3" /> Akun Terverifikasi
                    </span>
                 </div>
                 <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{userProfile.name}</h2>
                 <p className="text-slate-500 flex items-center gap-1.5 mt-1.5 text-sm font-medium">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    {userProfile.email}
                 </p>
              </div>
           </div>
        </div>
      </Card>

      {/* --- INFORMASI DETAIL (BENTO GRID STYLE) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
         
         {/* Card: Informasi Akun */}
         <Card className="p-5 sm:p-6 border-slate-100 shadow-sm bg-white rounded-[1.5rem] hover:border-emerald-200 transition-colors">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
               <UserCircle className="w-4 h-4 text-emerald-500" />
               Detail Akun
            </h3>
            <div className="space-y-5">
               <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 shrink-0 border border-slate-100">
                     <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email Login</p>
                     <p className="font-bold text-slate-800 text-sm truncate">{userProfile.email}</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 shrink-0 border border-slate-100">
                     <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Terdaftar Sejak</p>
                     <p className="font-bold text-slate-800 text-sm">{joinDate}</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 shrink-0 border border-slate-100">
                     <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Role Akses</p>
                     <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-sm">
                        Admin Puskesmas
                     </Badge>
                  </div>
               </div>
            </div>
         </Card>

         {/* Card: Wilayah Kerja */}
         <Card className="p-5 sm:p-6 border-slate-100 shadow-sm bg-white rounded-[1.5rem] hover:border-blue-200 transition-colors flex flex-col">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
               <Building2 className="w-4 h-4 text-blue-500" />
               Otoritas Wilayah
            </h3>
            <div className="space-y-5 flex-1">
               <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-500 shrink-0 border border-blue-100">
                     <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">ID Entitas Puskesmas</p>
                     <p className="font-mono text-xs bg-slate-50 px-2 py-1.5 rounded-lg text-slate-600 border border-slate-100 break-all font-bold">
                        {userProfile.puskesmasId || "Belum ditautkan"}
                     </p>
                  </div>
               </div>
               
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-auto">
                  <div className="flex items-center gap-2.5 text-slate-600 mb-2">
                     <FileText className="w-4 h-4 text-slate-400" />
                     <span className="text-xs font-black uppercase tracking-widest">Kewenangan Sistem</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                     Akun ini memiliki hak penuh untuk melakukan agregasi data Posyandu, manajemen Kader, serta memantau status stunting di seluruh wilayah kerja.
                  </p>
               </div>
            </div>
         </Card>
      </div>

      {/* --- PENGATURAN & BANTUAN (APP STYLE MENU) --- */}
      <div className="space-y-3">
        <h3 className="font-black text-slate-800 ml-1 text-sm uppercase tracking-widest text-opacity-80">Pengaturan Sistem</h3>
        <Card className="p-2 overflow-hidden bg-white rounded-3xl shadow-sm border-slate-100">
           <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group rounded-2xl">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors text-slate-400 border border-slate-100">
                    <Settings className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                    <span className="block font-bold text-slate-700 group-hover:text-emerald-700">Pengaturan Profil</span>
                    <span className="block text-[10px] text-slate-400 font-medium mt-0.5">Ubah kata sandi dan identitas</span>
                 </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
           </button>
           
           <div className="h-px bg-slate-50 mx-4"></div>

           <Link href="#" className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group rounded-2xl">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors text-slate-400 border border-slate-100">
                    <HelpCircle className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                    <span className="block font-bold text-slate-700 group-hover:text-amber-700">Pusat Bantuan</span>
                    <span className="block text-[10px] text-slate-400 font-medium mt-0.5">Dokumentasi operasional SAESTU</span>
                 </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-600 transition-transform group-hover:translate-x-1" />
           </Link>
        </Card>
      </div>

      {/* --- LOGOUT BUTTON (NATIVE STICKY / BOTTOM) --- */}
      <div className="pt-8 mb-4">
         <Button 
            variant="danger" 
            className="w-full h-14 font-black shadow-lg shadow-rose-200 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl transition-transform active:scale-95 text-base"
            onClick={logout}
         >
            <LogOut className="w-5 h-5 mr-2" />
            Keluar dari Sistem
         </Button>
         <p className="text-center text-[10px] text-slate-400 mt-6 font-black tracking-widest uppercase flex items-center justify-center gap-2">
            <Activity className="w-3 h-3" /> SAESTU Enterprise v2.0
         </p>
      </div>

    </div>
  );
}