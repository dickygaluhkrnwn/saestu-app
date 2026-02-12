"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Child } from "@/types/schema";
import { 
  User, 
  Baby, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  Calendar, 
  Settings,
  ChevronRight,
  Bell
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ParentProfilePage() {
  const { userProfile, logout } = useAuth();
  const [child, setChild] = useState<Child | null>(null);

  useEffect(() => {
    const fetchChild = async () => {
      if (!userProfile?.uid) return;
      const q = query(collection(db, "children"), where("parentId", "==", userProfile.uid), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) setChild({ id: snap.docs[0].id, ...snap.docs[0].data() } as Child);
    };
    fetchChild();
  }, [userProfile]);

  return (
    <div className="p-6 space-y-8 font-sans pb-32">
      
      {/* 1. PROFILE HEADER */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-1 shadow-xl shadow-emerald-100">
           <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-black text-emerald-600 border-4 border-white">
              {userProfile?.name?.charAt(0).toUpperCase()}
           </div>
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">{userProfile?.name}</h1>
          <p className="text-sm text-slate-500 font-medium">{userProfile?.email}</p>
        </div>
      </div>

      {/* 2. MENU SECTIONS */}
      <div className="space-y-6">
        
        {/* Child Profile Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Data Anak Terdaftar</h4>
          <Card className="p-4 flex items-center gap-4 border-emerald-100 bg-emerald-50/30">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
              <Baby className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-[10px] font-bold text-emerald-600 uppercase">Profil Balita</p>
               <h3 className="font-bold text-slate-800 truncate">{child?.name || "Belum Terhubung"}</h3>
            </div>
            <Settings className="w-5 h-5 text-slate-300" />
          </Card>
        </div>

        {/* General Settings Menu */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Pengaturan</h4>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            <ProfileMenuIcon icon={Bell} label="Notifikasi" color="text-blue-500" />
            <ProfileMenuIcon icon={ShieldCheck} label="Keamanan Akun" color="text-indigo-500" />
            <ProfileMenuIcon icon={Calendar} label="Riwayat Kunjungan" color="text-emerald-500" />
          </div>
        </div>

        {/* Logout */}
        <Button 
          onClick={logout}
          className="w-full h-14 bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <LogOut className="w-5 h-5" /> Keluar dari Akun
        </Button>
      </div>

      <div className="text-center">
         <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">Saestu Mobile v1.0.4 • 2025</p>
      </div>
    </div>
  );
}

function ProfileMenuIcon({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl bg-slate-50 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </div>
  );
}