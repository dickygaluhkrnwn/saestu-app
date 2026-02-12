"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Child, Measurement } from "@/types/schema";
import { 
  Baby, 
  Scale, 
  Ruler, 
  AlertCircle,
  ChevronRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Heart
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default function ParentDashboard() {
  const { userProfile, loading: authLoading } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [lastMeasurement, setLastMeasurement] = useState<Measurement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyChild = async () => {
      if (!userProfile?.uid) return;
      try {
        // Cari anak yang parentId-nya adalah UID user yang sedang login
        const childQ = query(
          collection(db, "children"), 
          where("parentId", "==", userProfile.uid),
          limit(1)
        );
        const childSnap = await getDocs(childQ);
        
        if (!childSnap.empty) {
          const childData = { id: childSnap.docs[0].id, ...childSnap.docs[0].data() } as Child;
          setChild(childData);

          const measQ = query(
            collection(db, "measurements"), 
            where("childId", "==", childData.id), 
            orderBy("date", "desc"), 
            limit(1)
          );
          const measSnap = await getDocs(measQ);
          if (!measSnap.empty) {
            setLastMeasurement({ id: measSnap.docs[0].id, ...measSnap.docs[0].data() } as Measurement);
          }
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchMyChild();
  }, [userProfile, authLoading]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* 1. WELCOME SECTION */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Aplikasi Orang Tua</h2>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Halo, Bunda {userProfile?.name?.split(' ')[0]}!</h1>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
        </div>
      </div>

      {/* 2. ANAK NOT LINKED ALERT */}
      {!child && (
        <Card className="p-8 border-dashed border-2 border-slate-200 bg-white text-center rounded-[2.5rem]">
           <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
           <h3 className="font-bold text-slate-800 text-lg">Belum Terhubung</h3>
           <p className="text-sm text-slate-500 mt-2 leading-relaxed">
             Data anak Anda belum muncul. Silakan tunjukkan akun Anda (Email: {userProfile?.email}) ke <strong>Kader Posyandu</strong> saat kunjungan berikutnya.
           </p>
        </Card>
      )}

      {/* 3. MAIN SUMMARY CARD */}
      {child && (
        <div className="space-y-6">
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-0 p-6 rounded-[2.5rem] shadow-xl text-white shadow-slate-200">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Baby className="w-32 h-32 text-white" />
                </div>
                
                <div className="relative z-10">
                    <Badge className="bg-emerald-500 text-white border-0 px-3 py-1 mb-4 font-bold text-[10px] uppercase tracking-widest">Update Terakhir</Badge>
                    <h2 className="text-3xl font-black mb-1">{child.name}</h2>
                    <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {lastMeasurement?.ageInMonths || 0} Bulan • {child.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/5">
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Berat</p>
                            <p className="text-2xl font-black">{lastMeasurement?.weight || "-"} <span className="text-xs font-medium opacity-60">kg</span></p>
                            <p className="text-[10px] mt-1 font-semibold opacity-80">{lastMeasurement?.weightStatus === 'adequate' ? '✅ Normal' : '⚠️ Perlu Pantauan'}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/5">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Tinggi</p>
                            <p className="text-2xl font-black">{lastMeasurement?.height || "-"} <span className="text-xs font-medium opacity-60">cm</span></p>
                            <p className="text-[10px] mt-1 font-semibold opacity-80">{lastMeasurement?.lengthStatus === 'adequate' ? '✅ Normal' : '⚠️ Stunting'}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 4. AI QUICK ACCESS */}
            <Link href="/parent/nutrition" className="block group">
                <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
                        <Sparkles className="w-20 h-20" />
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                                Rekomendasi Gizi AI
                            </h3>
                            <p className="text-indigo-100 text-xs opacity-90">Bunda bingung mau masak apa hari ini? Tanya AI yuk!</p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </Link>

            {/* 5. NEXT SCHEDULE */}
            <Card className="p-6 rounded-[2rem] border-slate-100 shadow-sm flex items-center gap-4 bg-white">
                <div className="bg-rose-50 p-4 rounded-3xl text-center min-w-[4rem] border border-rose-100">
                    <span className="block text-[10px] font-black text-rose-500 uppercase tracking-tighter">Bulan Ini</span>
                    <span className="block text-2xl font-black text-rose-700">15</span>
                </div>
                <div className="flex-1">
                    <h4 className="font-black text-slate-800 text-sm">Penimbangan Rutin</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Jangan lupa datang ke Posyandu ya, Bun!</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <Badge variant="neutral" className="bg-slate-50 text-slate-500 text-[10px]">Pagi 08:00 WIB</Badge>
                    </div>
                </div>
            </Card>
        </div>
      )}

    </div>
  );
}