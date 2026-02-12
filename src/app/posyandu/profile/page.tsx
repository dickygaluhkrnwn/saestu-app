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
  Activity
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ProfilePage() {
  const { userProfile, logout } = useAuth();
  const [posyanduName, setPosyanduName] = useState<string>("Memuat data...");

  useEffect(() => {
    const fetchPosyanduName = async () => {
      if (userProfile?.posyanduId) {
        try {
          const docRef = doc(db, "posyandus", userProfile.posyanduId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPosyanduName(docSnap.data().name);
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
    <div className="p-4 md:p-6 space-y-6 font-sans pb-24">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profil Saya</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola informasi akun dan pengaturan aplikasi.</p>
      </div>

      {/* --- PROFILE CARD --- */}
      <Card className="bg-white border-0 shadow-md overflow-hidden relative">
        {/* Background Accent */}
        <div className="h-24 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
        
        <div className="px-6 pb-6 relative">
           {/* Avatar */}
           <div className="absolute -top-12 left-6">
              <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-lg">
                 <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-black text-teal-600 border border-slate-200">
                    {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : <User className="w-10 h-10 text-slate-400" />}
                 </div>
              </div>
           </div>

           <div className="pt-14 flex justify-between items-start">
              <div>
                 <h2 className="text-xl font-bold text-slate-900">{userProfile?.name || "Nama Kader"}</h2>
                 <p className="text-slate-500 flex items-center gap-1.5 mt-1 text-sm font-medium">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {userProfile?.email || "email@contoh.com"}
                 </p>
              </div>
              <Badge variant="success" className="shadow-sm">
                 Aktif
              </Badge>
           </div>
        </div>
      </Card>

      {/* --- INFORMASI PENUGASAN --- */}
      <h3 className="font-bold text-slate-800 ml-1 text-sm uppercase tracking-wider mt-8">Informasi Penugasan</h3>
      <Card className="p-0 overflow-hidden divide-y divide-slate-100">
         <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
               <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
               <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Jabatan (Role)</p>
               <p className="font-bold text-slate-800 capitalize">{userProfile?.role || "-"}</p>
            </div>
         </div>
         <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
               <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
               <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Lokasi Tugas</p>
               <p className="font-bold text-slate-800">{posyanduName}</p>
            </div>
         </div>
      </Card>

      {/* --- PENGATURAN & BANTUAN --- */}
      <h3 className="font-bold text-slate-800 ml-1 text-sm uppercase tracking-wider mt-8">Lainnya</h3>
      <Card className="p-0 overflow-hidden divide-y divide-slate-100">
         <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-3">
               <Settings className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
               <span className="font-medium text-slate-700 group-hover:text-slate-900">Pengaturan Akun</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-1" />
         </button>
         <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-3">
               <HelpCircle className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
               <span className="font-medium text-slate-700 group-hover:text-slate-900">Pusat Bantuan & Panduan</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-1" />
         </button>
      </Card>

      {/* --- LOGOUT BUTTON --- */}
      <div className="pt-6">
         <Button 
            variant="danger" 
            size="lg" 
            className="w-full h-14 font-bold shadow-sm"
            onClick={logout}
         >
            <LogOut className="w-5 h-5 mr-2" />
            Keluar Aplikasi
         </Button>
         <p className="text-center text-xs text-slate-400 mt-4 font-medium tracking-widest uppercase">
            SAESTU App Version 2.0
         </p>
      </div>

    </div>
  );
}