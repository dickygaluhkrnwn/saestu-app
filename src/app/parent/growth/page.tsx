"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Child, Measurement } from "@/types/schema";
import { getMeasurementsByChild } from "@/lib/services/measurements";
import ChildMedicalHistory from "@/components/medical/ChildMedicalHistory";
import { 
  TrendingUp, 
  Activity, 
  Info, 
  Baby, 
  CalendarDays, 
  Scale, 
  Ruler, 
  Clock,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function ParentGrowthPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userProfile?.uid) return;
      try {
        const childQ = query(
          collection(db, "children"), 
          where("parentId", "==", userProfile.uid),
          limit(1)
        );
        const childSnap = await getDocs(childQ);
        
        if (!childSnap.empty) {
          const childData = { id: childSnap.docs[0].id, ...childSnap.docs[0].data() } as Child;
          setChild(childData);

          // Ambil riwayat pengukuran lengkap
          const history = await getMeasurementsByChild(childData.id);
          // Pastikan data terurut dari yang terbaru (descending)
          const sortedHistory = history.sort((a, b) => {
             const dateA = a.date instanceof Date ? a.date.getTime() : (a.date as any).toMillis();
             const dateB = b.date instanceof Date ? b.date.getTime() : (b.date as any).toMillis();
             return dateB - dateA;
          });
          setMeasurements(sortedHistory);
        }
      } catch (error) {
        console.error("Gagal memuat data pertumbuhan:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchData();
  }, [userProfile, authLoading]);

  // Ekstrak pengukuran terbaru untuk Dashboard Metrik
  const latestMeas = measurements.length > 0 ? measurements[0] : null;

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans pb-28 max-w-md mx-auto">
      
      {/* 1. HEADER (MOBILE OPTIMIZED) */}
      <header className="space-y-1 mt-2">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="text-emerald-600 w-7 h-7 sm:w-8 sm:h-8" /> Tumbuh Kembang
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">Buku KIA Digital & Grafik Pertumbuhan WHO.</p>
      </header>

      {!child ? (
        // 2. EMPTY STATE (ENTERPRISE LOOK)
        <Card className="p-8 border-dashed border-2 border-slate-200 text-center rounded-[2rem] bg-white mt-8">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Baby className="w-10 h-10 text-slate-300" />
           </div>
           <h3 className="font-bold text-slate-800 text-lg mb-2">Belum Terhubung</h3>
           <p className="text-slate-500 text-xs leading-relaxed">
              Data rekam medis anak Anda belum ditautkan. Beritahu Bidan atau Kader Posyandu email Anda untuk menghubungkan data.
           </p>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 3. EXECUTIVE SUMMARY DASHBOARD (METRIK CEPAT) */}
          {latestMeas && (
            <div className="space-y-4">
                <div className="flex items-center justify-between ml-1">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Kondisi Terkini
                   </h4>
                   <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {latestMeas.date instanceof Date 
                          ? latestMeas.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
                          : new Date((latestMeas.date as any).toMillis()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                      }
                   </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {/* Metrik Usia */}
                    <Card className="p-3 sm:p-4 bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center text-center hover:border-indigo-200 transition-colors">
                        <div className="bg-indigo-50 p-2 rounded-xl text-indigo-500 mb-2">
                            <CalendarDays className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Usia</p>
                        <p className="font-black text-slate-800 text-base sm:text-lg leading-none">
                            {latestMeas.ageInMonths} <span className="text-[10px] font-bold text-slate-500">Bln</span>
                        </p>
                    </Card>

                    {/* Metrik Berat */}
                    <Card className="p-3 sm:p-4 bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center text-center hover:border-emerald-200 transition-colors">
                        <div className="bg-emerald-50 p-2 rounded-xl text-emerald-500 mb-2">
                            <Scale className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Berat</p>
                        <p className="font-black text-slate-800 text-base sm:text-lg leading-none">
                            {latestMeas.weight} <span className="text-[10px] font-bold text-slate-500">kg</span>
                        </p>
                    </Card>

                    {/* Metrik Tinggi */}
                    <Card className="p-3 sm:p-4 bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center text-center hover:border-blue-200 transition-colors">
                        <div className="bg-blue-50 p-2 rounded-xl text-blue-500 mb-2">
                            <Ruler className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tinggi</p>
                        <p className="font-black text-slate-800 text-base sm:text-lg leading-none">
                            {latestMeas.height} <span className="text-[10px] font-bold text-slate-500">cm</span>
                        </p>
                    </Card>
                </div>

                {/* Status Alert Banner */}
                {latestMeas.weightStatus === 'adequate' && latestMeas.lengthStatus === 'adequate' ? (
                   <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center gap-3">
                       <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                       <p className="text-[11px] sm:text-xs text-emerald-700 font-bold leading-tight">
                           Pertumbuhan {child.name} optimal! Pertahankan pola asuh dan gizi seimbangnya, Bun.
                       </p>
                   </div>
                ) : (
                   <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl flex items-start gap-3">
                       <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                       <div>
                           <p className="text-[11px] sm:text-xs text-amber-800 font-bold leading-tight mb-1">
                               Butuh Perhatian Khusus
                           </p>
                           <p className="text-[10px] text-amber-700 leading-relaxed">
                               Grafik pertumbuhan menunjukkan indikator waspada. Gunakan fitur AI Gizi untuk rekomendasi, atau konsultasi ke Puskesmas.
                           </p>
                       </div>
                   </div>
                )}
            </div>
          )}
          
          {/* 4. MAIN MEDICAL HISTORY COMPONENT (CHART & TABEL) */}
          <div className="pt-2">
             <div className="flex items-center gap-2 mb-4 ml-1">
                <Activity className="w-4 h-4 text-slate-400" />
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Detail & Grafik Riwayat</h4>
             </div>
             
             {/* Component bawaan kita bungkus agar menyesuaikan margin */}
             <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <ChildMedicalHistory 
                  child={child}
                  measurements={measurements}
                  readOnly={true} // Orang tua hanya bisa melihat
                />
             </div>
          </div>
          
          {/* 5. DISCLAIMER (ENTERPRISE FOOTNOTE) */}
          <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200 flex gap-3 opacity-90 mt-8">
            <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
              Data riwayat ini direkam secara resmi oleh Kader Posyandu atau Bidan Desa. Jika terdapat kekeliruan pencatatan angka, silakan sampaikan saat jadwal kunjungan Posyandu berikutnya.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}