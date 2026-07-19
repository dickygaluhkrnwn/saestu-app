"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Child, Posyandu } from "@/types/schema";
import { 
  User, 
  Baby, 
  ShieldCheck, 
  LogOut, 
  Calendar, 
  Settings,
  ChevronRight,
  Bell,
  MapPin,
  HelpCircle,
  Stethoscope
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ParentProfilePage() {
  const { userProfile, logout } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [posyanduName, setPosyanduName] = useState<string>("");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userProfile?.uid) return;
      
      // 1. Ambil data anak
      const q = query(collection(db, "children"), where("parentId", "==", userProfile.uid), limit(1));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const childData = { id: snap.docs[0].id, ...snap.docs[0].data() } as Child;
        setChild(childData);

        // 2. Ambil nama Posyandu tempat anak terdaftar
        try {
           const posyanduRef = doc(db, "posyandus", childData.posyanduId);
           const posyanduSnap = await getDoc(posyanduRef);
           if (posyanduSnap.exists()) {
              setPosyanduName(posyanduSnap.data().name);
           }
        } catch (error) {
           console.error("Gagal mengambil data Posyandu", error);
        }
      }
    };
    fetchProfileData();
  }, [userProfile]);

  return (
    <div className="p-4 sm:p-6 space-y-8 font-sans pb-32 max-w-md mx-auto">
      
      {/* 1. PROFILE HEADER (HERO SECTION) */}
      <div className="flex flex-col items-center text-center space-y-4 mt-4">
        <div className="relative">
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-600 p-1 shadow-lg shadow-emerald-200">
               <div className="w-full h-full rounded-[1.8rem] bg-white flex items-center justify-center text-4xl font-black text-emerald-600 border-[3px] border-white">
                  {userProfile?.name?.charAt(0).toUpperCase()}
               </div>
            </div>
            {/* Badge Verified */}
            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                <ShieldCheck className="w-4 h-4" />
            </div>
        </div>
        
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
            {userProfile?.name}
          </h1>
          <p className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full inline-block">
            {userProfile?.email}
          </p>
        </div>
      </div>

      {/* 2. MENU SECTIONS */}
      <div className="space-y-6">
        
        {/* A. Info Medis & Anak */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5" /> Rekam Medis
          </h4>
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Kartu Anak */}
              <div className="p-4 flex items-center gap-4 bg-emerald-50/50 hover:bg-emerald-50 cursor-pointer transition-colors active:bg-emerald-100">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Profil Balita</p>
                   <h3 className="font-black text-slate-800 text-base truncate">{child?.name || "Belum Terhubung"}</h3>
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-300" />
              </div>

              {/* Lokasi Posyandu */}
              <div className="px-4 py-3 border-t border-slate-50 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                          <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Terdaftar di</p>
                          <p className="text-xs font-bold text-slate-700">{posyanduName || "Belum ada Posyandu"}</p>
                      </div>
                  </div>
                  <Badge variant="neutral" className="bg-blue-50 text-blue-600 border-0 text-[9px]">Aktif</Badge>
              </div>
          </div>
        </div>

        {/* B. Pengaturan Akun */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-1.5">
             <Settings className="w-3.5 h-3.5" /> Pengaturan
          </h4>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            <ProfileMenuIcon icon={Bell} label="Notifikasi" color="text-amber-500 bg-amber-50" />
            <ProfileMenuIcon icon={Calendar} label="Jadwal Posyandu" color="text-indigo-500 bg-indigo-50" />
            <ProfileMenuIcon icon={Stethoscope} label="Konsultasi Bidan" color="text-teal-500 bg-teal-50" />
            <ProfileMenuIcon icon={HelpCircle} label="Pusat Bantuan" color="text-slate-500 bg-slate-50" />
          </div>
        </div>

        {/* C. Tombol Keluar (Logout) */}
        <div className="pt-4">
            <Button 
              onClick={logout}
              className="w-full h-14 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <LogOut className="w-5 h-5" /> Keluar dari Aplikasi
            </Button>
        </div>
      </div>

      {/* FOOTER VERSI */}
      <div className="text-center pt-8 pb-4 opacity-50">
         <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4"></div>
         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sistem SAESTU Mobile</p>
         <p className="text-[9px] text-slate-400 font-medium mt-1">Versi 2.1.0 (Enterprise Build)</p>
      </div>

    </div>
  );
}

// Sub-komponen Menu List
function ProfileMenuIcon({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors active:bg-slate-100 group first:rounded-t-3xl last:rounded-b-3xl">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl transition-transform group-active:scale-95 ${color}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
    </div>
  );
}