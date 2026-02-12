"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Posyandu } from "@/types/schema";
import { getChildrenByPosyandu } from "@/lib/services/children";
import { getParentsByPosyandu } from "@/lib/services/parents";
import { 
  Bell, MapPin, Calendar, Users, Baby, ChevronRight, AlertCircle, CheckCircle2 
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function KaderDashboard() {
  const { userProfile, loading } = useAuth();
  const [posyandu, setPosyandu] = useState<Posyandu | null>(null);
  
  const [stats, setStats] = useState({
    totalKids: 0,
    totalParents: 0,
    measuredThisMonth: 0
  });

  useEffect(() => {
    const init = async () => {
      if (userProfile?.posyanduId) {
        try {
          const docRef = doc(db, "posyandus", userProfile.posyanduId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setPosyandu({ id: docSnap.id, ...docSnap.data() } as Posyandu);

          const [kids, parents] = await Promise.all([
            getChildrenByPosyandu(userProfile.posyanduId),
            getParentsByPosyandu(userProfile.posyanduId)
          ]);

          const currentMonth = new Date().getMonth();
          const measured = kids.filter(k => {
             if(!k.lastMeasurementDate) return false;
             const d = (k.lastMeasurementDate as any).toDate ? (k.lastMeasurementDate as any).toDate() : new Date(k.lastMeasurementDate as any);
             return d.getMonth() === currentMonth;
          }).length;

          setStats({
            totalKids: kids.length,
            totalParents: parents.length,
            measuredThisMonth: measured
          });
        } catch (e) { console.error(e); }
      }
    };
    if (!loading) init();
  }, [userProfile, loading]);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="p-5 space-y-6 pb-24">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Halo Kader,</p>
          <h1 className="text-xl font-bold text-slate-800">{userProfile?.name}</h1>
        </div>
        <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100">
           <Bell className="w-5 h-5 text-slate-600" />
        </div>
      </div>

      {/* HERO CARD */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-teal-500/20 relative overflow-hidden">
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-80">
               <MapPin className="w-3.5 h-3.5" />
               <span className="text-xs font-medium">{posyandu?.village || "Memuat..."}</span>
            </div>
            <h2 className="text-2xl font-bold mb-6">{posyandu?.name || "Posyandu"}</h2>
            
            <div className="flex gap-4">
               <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl flex-1">
                  <p className="text-[10px] uppercase font-bold opacity-70">Target Balita</p>
                  <p className="text-2xl font-bold">{stats.totalKids}</p>
               </div>
               <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl flex-1">
                  <p className="text-[10px] uppercase font-bold opacity-70">Sudah Diukur</p>
                  <p className="text-2xl font-bold flex items-center gap-2">
                     {stats.measuredThisMonth}
                     {stats.measuredThisMonth === stats.totalKids && stats.totalKids > 0 && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                  </p>
               </div>
            </div>
         </div>
         {/* Decoration */}
         <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* ACTION GRID */}
      <div className="grid grid-cols-2 gap-4">
         <Link href="/posyandu/children" className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
               <Baby className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-700 text-sm">Data Balita</span>
         </Link>
         <Link href="/posyandu/parents" className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
               <Users className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-700 text-sm">Data Ortu</span>
         </Link>
      </div>

      {/* WARNING ALERT */}
      {stats.totalKids > stats.measuredThisMonth && (
         <Card className="p-4 bg-rose-50 border-rose-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
               <h4 className="font-bold text-rose-700 text-sm">Belum Selesai</h4>
               <p className="text-xs text-rose-600/80 mt-1">
                  Masih ada <strong>{stats.totalKids - stats.measuredThisMonth} balita</strong> yang belum diukur bulan ini.
               </p>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400 self-center" />
         </Card>
      )}

      {/* SCHEDULE */}
      <div>
         <h3 className="font-bold text-slate-800 mb-3">Agenda Kegiatan</h3>
         <Card className="p-4 flex items-center gap-4 border-slate-100">
            <div className="bg-slate-100 p-3 rounded-xl text-center min-w-[3.5rem]">
               <span className="block text-xs font-bold text-rose-500">NOV</span>
               <span className="block text-xl font-bold text-slate-800">15</span>
            </div>
            <div>
               <h4 className="font-bold text-slate-800 text-sm">Penimbangan Rutin</h4>
               <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <Calendar className="w-3 h-3" /> 08:00 - 11:00 WIB
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}