"use client";

import { useAuth } from "@/context/AuthContext";
import { Activity, Utensils, ArrowRight, Baby } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PuskesmasDashboard() {
  const { userProfile } = useAuth();

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans">
      
      {/* Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-8 shadow-xl text-white overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
           <Activity className="w-64 h-64 text-white transform translate-x-12 -translate-y-12" />
        </div>
        
        <div className="relative z-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold mb-4 !text-white">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>Medical Dashboard</span>
           </div>
           <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 !text-white">
              Selamat Datang, Petugas.
           </h1>
           <p className="text-emerald-50 text-lg leading-relaxed max-w-xl opacity-90 !text-white">
              Ini adalah pusat kendali medis. Data yang Anda input di sini akan menjadi otak bagi AI untuk memberikan saran kepada ribuan orang tua.
           </p>
           
           <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/puskesmas/nutrition">
                 <Button className="bg-white text-emerald-800 hover:bg-emerald-50 border-0 font-bold shadow-lg">
                    <Utensils className="h-4 w-4 mr-2" />
                    Input Data Gizi (AI)
                 </Button>
              </Link>
           </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-lg mb-2">Mengapa Data Nutrisi Penting?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
               AI Gemini akan menggunakan data "Makanan Lokal" yang Anda input untuk memberikan rekomendasi yang realistis dan terjangkau bagi warga, bukan sekadar teori buku teks.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl">
               <Activity className="h-4 w-4" />
               RAG (Retrieval-Augmented Generation) System Active
            </div>
         </div>
      </div>
    </div>
  );
}