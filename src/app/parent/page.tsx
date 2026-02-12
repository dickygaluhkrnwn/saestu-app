"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Child, Measurement } from "@/types/schema";
import { getAllMasterFoods } from "@/lib/services/nutrition";

import { 
  Baby, 
  Sparkles, 
  Activity, 
  Scale, 
  Ruler, 
  AlertTriangle,
  ChevronRight,
  Utensils,
  CheckCircle2,
  BrainCircuit,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Tipe data untuk menampung respons JSON dari Gemini
interface AIRecommendation {
  statusAnalysis: string;
  recommendedFoods: { foodName: string; reason: string; portionTip: string }[];
  recipeSuggestion: { menuName: string; ingredients: string[]; instructions: string[] };
  warnings: string[];
}

export default function ParentDashboard() {
  const { userProfile, logout } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [lastMeasurement, setLastMeasurement] = useState<Measurement | null>(null);
  const [loading, setLoading] = useState(true);
  
  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIRecommendation | null>(null);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    const fetchChildData = async () => {
      if (!userProfile?.uid) return;
      try {
        // Ambil data anak yang terkait dengan Parent ID
        const childQ = query(collection(db, "children"), limit(1)); // Dummy limit 1 untuk demo
        const childSnap = await getDocs(childQ);
        
        if (!childSnap.empty) {
          const childData = { id: childSnap.docs[0].id, ...childSnap.docs[0].data() } as Child;
          setChild(childData);

          // Ambil pengukuran terakhir anak tersebut
          const measQ = query(collection(db, "measurements"), where("childId", "==", childData.id), orderBy("date", "desc"), limit(1));
          const measSnap = await getDocs(measQ);
          if (!measSnap.empty) {
            setLastMeasurement({ id: measSnap.docs[0].id, ...measSnap.docs[0].data() } as Measurement);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data anak:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildData();
  }, [userProfile]);

  const generateAIRecommendation = async () => {
    if (!child || !lastMeasurement) return;
    setAiLoading(true);
    setAiError("");

    try {
      // 1. Ambil Database Makanan Lokal (RAG Data)
      const masterFoods = await getAllMasterFoods();

      if (masterFoods.length === 0) {
        throw new Error("Database makanan puskesmas masih kosong. AI tidak memiliki referensi lokal.");
      }

      // 2. Persiapkan Payload Medis
      const payload = {
        childName: child.name,
        ageInMonths: lastMeasurement.ageInMonths,
        weight: lastMeasurement.weight,
        height: lastMeasurement.height,
        weightStatus: lastMeasurement.weightStatus,
        lengthStatus: lastMeasurement.lengthStatus,
        masterFoods: masterFoods
      };

      // 3. Tembak ke API Engine Gemini kita
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mendapatkan analisis AI.");
      }

      setAiResult(data);

    } catch (err: any) {
      setAiError(err.message || "Terjadi kesalahan saat memanggil AI.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Activity className="w-8 h-8 text-emerald-500 animate-spin" /></div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      
      {/* --- HEADER --- */}
      <header className="bg-emerald-600 text-white p-6 rounded-b-[2.5rem] shadow-lg shadow-emerald-900/10">
         <div className="max-w-3xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Baby className="w-6 h-6 text-white" />
               </div>
               <div>
                  <h1 className="font-bold text-xl leading-tight">Halo, Ibu/Bapak!</h1>
                  <p className="text-emerald-100 text-sm">Pantau Tumbuh Kembang Si Kecil</p>
               </div>
            </div>
            <button onClick={logout} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
               <LogOut className="w-5 h-5" />
            </button>
         </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 -mt-6">
         
         {/* --- RAPORT CARD --- */}
         {!child ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-slate-200">
               <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
               <h3 className="font-bold text-slate-800">Data Anak Belum Terhubung</h3>
               <p className="text-sm text-slate-500 mt-2">Silakan hubungi Kader Posyandu untuk menautkan akun Anda dengan data anak.</p>
            </div>
         ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                     <h2 className="text-2xl font-black text-slate-900">{child.name}</h2>
                     <p className="text-sm text-slate-500 font-medium mt-1">
                        Usia saat ini: <span className="text-emerald-600">{lastMeasurement?.ageInMonths || 0} Bulan</span>
                     </p>
                  </div>
                  {child.gender === 'L' ? (
                     <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full uppercase tracking-wider">Laki-laki</span>
                  ) : (
                     <span className="px-3 py-1 bg-rose-100 text-rose-700 font-bold text-xs rounded-full uppercase tracking-wider">Perempuan</span>
                  )}
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-2 divide-x divide-slate-100 bg-slate-50">
                  <div className="p-6 text-center">
                     <Scale className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Berat Badan Terakhir</p>
                     <p className="text-3xl font-black text-slate-800">{lastMeasurement?.weight || 0} <span className="text-base font-medium text-slate-500">kg</span></p>
                     <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 shadow-sm text-slate-600">
                        {lastMeasurement?.weightStatus === 'adequate' ? '🟢 Normal' : lastMeasurement?.weightStatus === 'inadequate' ? '🔴 Faltering / Kurang' : '🟡 Berlebih'}
                     </div>
                  </div>
                  <div className="p-6 text-center">
                     <Ruler className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Tinggi Badan Terakhir</p>
                     <p className="text-3xl font-black text-slate-800">{lastMeasurement?.height || 0} <span className="text-base font-medium text-slate-500">cm</span></p>
                     <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 shadow-sm text-slate-600">
                        {lastMeasurement?.lengthStatus === 'adequate' ? '🟢 Normal' : '🔴 Stunting'}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* --- AI SECTION --- */}
         {child && lastMeasurement && (
            <div className="mt-8 space-y-6">
               
               {/* Call to Action Card */}
               {!aiResult && !aiLoading && (
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border border-indigo-100 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <BrainCircuit className="w-32 h-32 text-indigo-900" />
                     </div>
                     <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
                        <div className="text-center md:text-left">
                           <h3 className="text-xl font-bold text-indigo-900 flex items-center justify-center md:justify-start gap-2">
                              <Sparkles className="w-5 h-5 text-amber-500" />
                              Rekomendasi Menu MPASI (AI)
                           </h3>
                           <p className="text-indigo-700 text-sm mt-2 max-w-sm">
                              Dapatkan saran menu bergizi yang disusun oleh AI berdasarkan rekam medis {child.name} dan ketersediaan bahan pangan lokal dari puskesmas.
                           </p>
                        </div>
                        <Button 
                           onClick={generateAIRecommendation}
                           className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 font-bold w-full md:w-auto"
                        >
                           Tanya Ahli Gizi AI
                        </Button>
                     </div>
                     {aiError && <p className="text-xs text-rose-500 font-bold mt-4 text-center">{aiError}</p>}
                  </div>
               )}

               {/* Loading State */}
               {aiLoading && (
                  <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-sm">
                     <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                        <div className="relative bg-indigo-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
                           <Sparkles className="w-8 h-8 text-white animate-pulse" />
                        </div>
                     </div>
                     <h3 className="font-bold text-xl text-slate-800">AI Sedang Menganalisis...</h3>
                     <p className="text-slate-500 mt-2">Membaca rekam medis anak dan mencocokkan dengan ratusan bahan makanan lokal.</p>
                  </div>
               )}

               {/* --- AI RESULT CARD --- */}
               {aiResult && !aiLoading && (
                  <div className="space-y-6 animate-fade-in">
                     
                     {/* Analysis Alert */}
                     <div className={`p-5 rounded-2xl border flex items-start gap-4 ${lastMeasurement.weightStatus === 'adequate' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                        <div className={`p-2 rounded-full mt-0.5 ${lastMeasurement.weightStatus === 'adequate' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                           <Activity className="w-5 h-5" />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900 mb-1">Analisis Medis Otomatis</h4>
                           <p className="text-sm text-slate-700 leading-relaxed">{aiResult.statusAnalysis}</p>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-6">
                        {/* Selected Local Foods */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                           <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
                              <Utensils className="w-5 h-5 text-emerald-500" />
                              Bahan Rekomendasi
                           </h4>
                           <ul className="space-y-4">
                              {aiResult.recommendedFoods.map((food, idx) => (
                                 <li key={idx} className="flex gap-3 items-start">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                       <p className="font-bold text-slate-800 text-sm">{food.foodName}</p>
                                       <p className="text-xs text-slate-500 mt-0.5"><span className="font-semibold text-slate-600">Alasan:</span> {food.reason}</p>
                                       <p className="text-[10px] font-bold text-indigo-600 mt-1 uppercase tracking-wider">{food.portionTip}</p>
                                    </div>
                                 </li>
                              ))}
                           </ul>
                        </div>

                        {/* Recipe Box */}
                        <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-10"><Utensils className="w-32 h-32" /></div>
                           <div className="relative z-10">
                              <span className="px-2 py-1 bg-white/10 text-emerald-300 text-[10px] font-bold uppercase tracking-widest rounded-md">Ide Menu Spesial</span>
                              {/* FIX: Menambahkan text-white di sini agar terbaca jelas */}
                              <h4 className="text-white font-black text-2xl mt-3 mb-4">{aiResult.recipeSuggestion.menuName}</h4>
                              
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">Bahan-bahan</p>
                              <ul className="list-disc list-inside text-sm text-slate-200 mb-4 space-y-1">
                                 {aiResult.recipeSuggestion.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                              </ul>

                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">Cara Membuat</p>
                              <ol className="list-decimal list-inside text-sm text-slate-200 space-y-2">
                                 {aiResult.recipeSuggestion.instructions.map((step, i) => <li key={i}>{step}</li>)}
                              </ol>
                           </div>
                        </div>
                     </div>

                     {/* Warnings */}
                     {aiResult.warnings.length > 0 && (
                        <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl">
                           <h4 className="font-bold text-rose-800 text-sm flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4" /> Catatan Penting
                           </h4>
                           <ul className="list-disc list-inside text-sm text-rose-700 space-y-1">
                              {aiResult.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                           </ul>
                        </div>
                     )}

                  </div>
               )}
            </div>
         )}
      </div>
    </main>
  );
}