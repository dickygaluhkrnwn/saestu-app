"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Child, Measurement, Posyandu } from "@/types/schema";
import { getMasterFoods } from "@/lib/services/nutrition";
import { calculateAgeInMonths } from "@/lib/who-standards";

import { 
  Sparkles, 
  BrainCircuit, 
  Utensils, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ChevronRight, 
  Activity, 
  Clock,
  ChefHat,
  Info,
  Apple
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Tipe data sesuai dengan respons dari route.ts kamu
interface AIRecommendation {
  statusAnalysis: string;
  recommendedFoods: { foodName: string; reason: string; portionTip: string }[];
  recipeSuggestion: { menuName: string; ingredients: string[]; instructions: string[] };
  warnings: string[];
}

export default function App() {
  const { userProfile } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [lastMeasurement, setLastMeasurement] = useState<Measurement | null>(null);
  const [loading, setLoading] = useState(true);
  
  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIRecommendation | null>(null);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    const initData = async () => {
      if (!userProfile?.uid) return;
      try {
        // 1. Cari data anak yang terhubung dengan UID orang tua ini
        const childQ = query(collection(db, "children"), where("parentId", "==", userProfile.uid), limit(1));
        const childSnap = await getDocs(childQ);
        
        if (!childSnap.empty) {
          const childData = { id: childSnap.docs[0].id, ...childSnap.docs[0].data() } as Child;
          setChild(childData);

          // 2. Cari pengukuran terakhir
          const measQ = query(
            collection(db, "measurements"), 
            where("childId", "==", childData.id), 
            orderBy("date", "desc"), 
            limit(1)
          );
          const measSnap = await getDocs(measQ);
          
          if (!measSnap.empty) {
            setLastMeasurement({ id: measSnap.docs[0].id, ...measSnap.docs[0].data() } as Measurement);
          } else {
            // SCENARIO FALLBACK: Gunakan data lahir jika belum ada timbangan rutin
            const dob = childData.dob instanceof Date ? childData.dob : (childData.dob as any).toDate();
            const ageMonths = calculateAgeInMonths(dob);
            setLastMeasurement({
              id: "initial",
              childId: childData.id,
              posyanduId: childData.posyanduId,
              date: childData.dob,
              ageInMonths: ageMonths,
              weight: childData.initialWeight,
              height: childData.initialHeight,
              weightStatus: childData.lastWeightStatus || "unknown",
              lengthStatus: childData.lastLengthStatus || "unknown",
            } as Measurement);
          }
        }
      } catch (error) {
        console.error("Gagal inisialisasi data:", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [userProfile]);

  const generateAIRecommendation = async () => {
    if (!child || !lastMeasurement) return;
    
    setAiLoading(true);
    setAiError("");

    try {
      // 1. Ambil data wilayah untuk mendapatkan Puskesmas ID
      const posyanduRef = doc(db, "posyandus", child.posyanduId);
      const posyanduSnap = await getDoc(posyanduRef);
      if (!posyanduSnap.exists()) throw new Error("Data wilayah tidak ditemukan.");
      const posyanduData = posyanduSnap.data() as Posyandu;

      // 2. Ambil Master Food milik Puskesmas tersebut
      const masterFoods = await getMasterFoods(posyanduData.puskesmasId);
      if (masterFoods.length === 0) {
        throw new Error("Puskesmas wilayah Anda belum mengisi database gizi lokal.");
      }

      // 3. Persiapkan Payload sesuai interface di route.ts kamu
      const payload = {
        childName: child.name,
        ageInMonths: lastMeasurement.ageInMonths,
        weight: lastMeasurement.weight,
        height: lastMeasurement.height,
        weightStatus: lastMeasurement.weightStatus,
        lengthStatus: lastMeasurement.lengthStatus,
        masterFoods: masterFoods
      };

      // 4. TEMBAK KE BACKEND PROXY (Sesuai kode kamu yang sudah berhasil)
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mendapatkan analisis dari server AI.");
      }

      setAiResult(data);

    } catch (err: any) {
      console.error("AI Error:", err);
      setAiError(err.message || "Terjadi kendala saat menghubungi ahli gizi digital.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 space-y-8 font-sans pb-32 max-w-3xl mx-auto">
      
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BrainCircuit className="text-indigo-600 w-8 h-8" /> Ahli Gizi AI
        </h1>
        <p className="text-sm text-slate-500 font-medium">Rekomendasi gizi cerdas untuk {child?.name}.</p>
      </div>

      {!aiResult && !aiLoading ? (
        <Card className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 border-0 shadow-2xl rounded-[2.5rem] text-white relative overflow-hidden">
             <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
             <Sparkles className="w-10 h-10 text-amber-400 mb-6 animate-bounce" />
             <h3 className="text-2xl font-black mb-3">Siap Menyusun Menu?</h3>
             <p className="text-indigo-100 text-sm leading-relaxed mb-8 opacity-90">
                Bunda Siti, AI akan menganalisis data rekam medis <strong>{child?.name}</strong> dan meracik resep MPASI bergizi dari bahan lokal yang tersedia di wilayah Anda.
             </p>
             <Button 
                onClick={generateAIRecommendation} 
                disabled={!child}
                className="w-full h-16 bg-white text-indigo-700 font-black text-lg rounded-2xl hover:bg-indigo-50 shadow-xl shadow-indigo-900/20 active:scale-95 transition-all"
             >
                Mulai Analisis Sekarang
             </Button>
             {aiError && (
                <div className="mt-4 p-4 bg-rose-500/20 rounded-2xl border border-white/10 flex gap-3 items-center">
                    <AlertTriangle className="w-5 h-5 text-rose-200" />
                    <p className="text-xs font-bold text-rose-50 leading-tight">{aiError}</p>
                </div>
             )}
        </Card>
      ) : aiLoading ? (
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center space-y-6 shadow-sm">
            <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-indigo-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="font-black text-xl text-slate-800 tracking-tight">AI Sedang Meracik Menu...</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Menganalisis rekam medis {child?.name} <br/> 
                    dan menyesuaikan dengan database pangan lokal.
                </p>
            </div>
        </div>
      ) : aiResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
            
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl flex gap-4 shadow-sm">
                <div className="p-2.5 bg-emerald-100 rounded-2xl h-fit text-emerald-600">
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">Kondisi Si Kecil</h4>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">{aiResult.statusAnalysis}</p>
                </div>
            </div>

            <Card className="bg-slate-900 text-white p-8 rounded-[2.5rem] border-0 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <ChefHat className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <Badge className="bg-emerald-500 text-white border-0 px-3 py-1 font-black text-[10px] uppercase mb-4 tracking-widest">Resep Spesial Untuknya</Badge>
                    <h3 className="text-3xl font-black mb-6 leading-tight text-white">{aiResult.recipeSuggestion.menuName}</h3>
                    
                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Utensils className="w-3 h-3 text-emerald-400" /> Bahan Utama
                            </p>
                            <ul className="grid grid-cols-1 gap-2">
                                {aiResult.recipeSuggestion.ingredients.map((ing, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                                        <div className="w-1 h-1 bg-emerald-500 rounded-full" /> {ing}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Clock className="w-3 h-3 text-emerald-400" /> Langkah Masak
                            </p>
                            <ol className="space-y-3">
                                {aiResult.recipeSuggestion.instructions.map((step, i) => (
                                    <li key={i} className="flex gap-3 text-xs text-slate-300 leading-relaxed">
                                        <span className="font-black text-emerald-500">{i + 1}.</span> {step}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-6 rounded-[2.5rem] border-slate-100 shadow-sm bg-white">
                <h4 className="font-black text-slate-800 flex items-center gap-2 mb-6 uppercase text-xs tracking-widest">
                    <Apple className="w-4 h-4 text-emerald-500" /> Nutrisi Penting
                </h4>
                <div className="space-y-5">
                    {aiResult.recommendedFoods.map((food, idx) => (
                        <div key={idx} className="flex gap-4 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                            <div className="p-2 bg-slate-50 rounded-xl text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{food.foodName}</p>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{food.reason}</p>
                                <Badge variant="neutral" className="mt-2 bg-indigo-50 text-indigo-700 border-0 text-[9px] font-bold uppercase">{food.portionTip}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {aiResult.warnings.length > 0 && (
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl shadow-sm">
                    <h4 className="font-black text-rose-800 text-sm flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4" /> Catatan Tambahan
                    </h4>
                    <ul className="space-y-2">
                        {aiResult.warnings.map((warn, i) => (
                            <li key={i} className="text-xs text-rose-700 leading-relaxed flex gap-2">
                                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 shrink-0" /> {warn}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Button 
                variant="outline" 
                onClick={() => setAiResult(null)} 
                className="w-full h-14 rounded-2xl border-slate-200 text-slate-500 font-black tracking-tight hover:bg-slate-50"
            >
                Ulangi Analisis Gizi
            </Button>
        </div>
      )}

      <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex gap-4 opacity-70">
         <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
         <p className="text-[10px] text-blue-600 font-medium leading-relaxed">
            AI SAESTU memberikan rekomendasi berdasarkan standar kesehatan nasional. Tetap konsultasikan hasil ini dengan tenaga medis ahli gizi di Puskesmas Anda.
         </p>
      </div>
    </div>
  );
}