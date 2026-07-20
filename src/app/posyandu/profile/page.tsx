"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  User, 
  Mail, 
  Building2, 
  LogOut, 
  ChevronRight, 
  Shield, 
  Settings, 
  HelpCircle,
  Activity,
  MapPin
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { userProfile, logout } = useAuth();
  const [posyanduName, setPosyanduName] = useState<string>("Memuat data...");
  const [posyanduVillage, setPosyanduVillage] = useState<string>("");

  useEffect(() => {
    const fetchPosyanduName = async () => {
      if (userProfile?.posyanduId) {
        try {
          const docRef = doc(db, "posyandus", userProfile.posyanduId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPosyanduName(docSnap.data().name);
            setPosyanduVillage(docSnap.data().village || "");
          } else {
            setPosyanduName("Data Posyandu Tidak Ditemukan");
          }
        } catch (error) {
          console.error("Gagal mengambil nama posyandu:", error);
          setPosyanduName("Gagal memuat data");
        }
      } else {
        setPosyanduName("Belum ditugaskan di Posyandu manapun");
      }
    };

    fetchPosyanduName();
  }, [userProfile]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 font-sans pb-28 max-w-3xl mx-auto">
      
      {/* --- HEADER TITLE --- */}
      <div className="mt-2 mb-6 hidden md:block">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Pengaturan Profil</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">Kelola informasi akun dan preferensi aplikasi Kader Anda.</p>
      </div>

      {/* --- PROFILE BANNER CARD (ENTERPRISE STYLE) --- */}
      <Card className="bg-white border-0 shadow-lg shadow-slate-200/50 overflow-hidden relative rounded-3xl">
        {/* Abstract Background Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
           <div className="absolute top-[-20%] right-[-5%] w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
           <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
              <Activity className="w-24 h-24 text-white transform rotate-12" />
           </div>
        </div>
        
        <div className="px-6 sm:px-8 pb-8 relative">
           
           {/* Floating Avatar */}
           <div className="absolute -top-16 sm:-top-20 left-6 sm:left-8">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] bg-white p-2 shadow-xl shadow-slate-300/50">
                 <div className="w-full h-full rounded-[1.5rem] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-4xl sm:text-5xl font-black text-blue-600 border border-blue-100">
                    {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : <User className="w-12 h-12 text-slate-400" />}
                 </div>
              </div>
           </div>

           {/* Profile Identity */}
           <div className="pt-16 sm:pt-20 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase tracking-widest">Akun Aktif</span>
                 </div>
                 <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{userProfile?.name || "Nama Kader"}</h2>
                 <p className="text-slate-500 flex items-center gap-1.5 mt-1.5 text-sm font-medium">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    {userProfile?.email || "email@contoh.com"}
                 </p>
              </div>
           </div>
        </div>
      </Card>

      {/* --- INFORMASI PENUGASAN (BENTO GRID STYLE) --- */}
      <div className="space-y-3">
        <h3 className="font-black text-slate-800 ml-1 text-sm uppercase tracking-widest text-opacity-80">Informasi Penugasan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <Card className="p-5 flex items-center gap-4 hover:border-blue-200 transition-colors bg-white rounded-2xl shadow-sm border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Jabatan (Role)</p>
                  <p className="font-black text-slate-800 text-base capitalize truncate">Kader Posyandu</p>
                </div>
            </Card>

            <Card className="p-5 flex items-center gap-4 hover:border-emerald-200 transition-colors bg-white rounded-2xl shadow-sm border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Posyandu Induk</p>
                  <p className="font-black text-slate-800 text-base truncate">{posyanduName}</p>
                  {posyanduVillage && (
                    <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3" /> Desa {posyanduVillage}
                    </p>
                  )}
                </div>
            </Card>

        </div>
      </div>

      {/* --- PENGATURAN & BANTUAN --- */}
      <div className="space-y-3">
        <h3 className="font-black text-slate-800 ml-1 text-sm uppercase tracking-widest text-opacity-80">Pengaturan Lainnya</h3>
        <Card className="p-2 overflow-hidden bg-white rounded-3xl shadow-sm border-slate-100">
           <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group rounded-2xl">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors text-slate-400">
                    <Settings className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                    <span className="block font-bold text-slate-700 group-hover:text-blue-700">Pengaturan Akun</span>
                    <span className="block text-[10px] text-slate-400 font-medium mt-0.5">Ubah kata sandi dan profil</span>
                 </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
           </button>
           
           <div className="h-px bg-slate-50 mx-4"></div>

           <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group rounded-2xl">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors text-slate-400">
                    <HelpCircle className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                    <span className="block font-bold text-slate-700 group-hover:text-orange-700">Pusat Bantuan</span>
                    <span className="block text-[10px] text-slate-400 font-medium mt-0.5">Panduan penggunaan SAESTU</span>
                 </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-orange-600 transition-transform group-hover:translate-x-1" />
           </button>
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