"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Database, 
  Loader2, 
  AlertTriangle, 
  Building2, 
  Users,
  CheckCircle2,
  Terminal,
  Server,
  ArrowRight
} from "lucide-react";
import { addPosyandu } from "@/lib/services/posyandu";
import { createUser } from "@/lib/services/users";
import { useAuth } from "@/context/AuthContext";

// --- DATA GENERATOR ---
const POSYANDU_NAMES = ["Mawar", "Melati", "Anggrek", "Dahlia", "Kenanga"];

export default function PuskesmasSeedPage() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleSeed = async () => {
    if (!userProfile?.puskesmasId) {
      alert("Error: Anda tidak memiliki ID Puskesmas. Pastikan login sebagai Petugas Puskesmas.");
      return;
    }

    if (!confirm(`PERINGATAN: Sistem akan menginjeksi 5 Posyandu dan 25 Akun Kader di bawah wilayah Puskesmas Anda (${userProfile.name}). Lanjutkan?`)) return;
    
    setLoading(true);
    setIsSuccess(false);
    setLogs([]);
    addLog("🚀 Memulai inisialisasi koneksi ke server...");

    try {
      addLog("--- [1/2] PROSES INJEKSI DATA POSYANDU ---");
      for (const name of POSYANDU_NAMES) {
        const fullName = `Posyandu ${name} ${Math.floor(Math.random() * 100)}`;
        
        // 1. Buat Posyandu
        addLog(`[CREATE] Registrasi Posyandu: ${fullName}...`);
        const posyanduId = await addPosyandu({
          name: fullName,
          village: "Desa Contoh",
          district: "Kecamatan Sejahtera",
          address: `Jl. ${name} No. ${Math.floor(Math.random() * 50)}`,
          puskesmasId: userProfile.puskesmasId
        });
        addLog(`[OK] UID Generated. Posyandu Siap: ${fullName}`);

        // 2. Buat 5 Kader untuk Posyandu ini
        addLog(`--- [2/2] GENERATING KADER UNTUK ${fullName.toUpperCase()} ---`);
        for (let i = 1; i <= 5; i++) {
          const email = `kader.${name.toLowerCase()}.${i}.${Math.floor(Math.random() * 999)}@saestu.com`;
          const password = "123456"; 
          
          addLog(`  [LINK] Membuat Akun Kader ${i}: ${email}...`);
          await createUser({
            email,
            password,
            name: `Kader ${name} ${i}`,
            role: "kader",
            posyanduId: posyanduId,
            puskesmasId: userProfile.puskesmasId
          });
          
          // Delay kecil untuk menghindari rate limit Auth Firestore
          await new Promise(r => setTimeout(r, 300));
        }
        addLog(`  ✨ [SUCCESS] 5 Akun Kader untuk ${fullName} berhasil dibuat.`);
      }
      
      addLog("🎉 [FINISH] SEEDING SELESAI! Seluruh hierarki wilayah berhasil dibangun.");
      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      addLog(`❌ [FATAL ERROR]: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans pb-28 max-w-4xl mx-auto">
      
      {/* 1. COMPACT HERO SECTION */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 p-6 sm:p-8 shadow-xl shadow-slate-900/20 overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
           <Database className="w-32 h-32 text-emerald-400 transform rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-2 w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                 <Server className="w-3 h-3" /> Dev Tools
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">Database Seeder</h1>
              <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed font-medium">
                 Modul khusus bagi Puskesmas untuk menginjeksi struktur data wilayah (Posyandu & Kader) ke dalam *database* secara instan.
              </p>
           </div>
        </div>
      </div>

      {/* 2. INFORMATION & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-6">
              
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl flex gap-4 shadow-sm">
                 <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                 <div className="text-sm text-amber-900">
                   <p className="font-black mb-1.5 text-base">Autentikasi Akun Dummy</p>
                   <p className="font-medium leading-relaxed opacity-80">
                     Semua akun kader yang dihasilkan dari alat ini akan menggunakan kata sandi <code className="bg-white px-2 py-1 rounded-md font-bold border border-amber-200 text-amber-700 shadow-sm mx-1">123456</code>. Gunakan akun tersebut untuk menguji fitur aplikasi dari sisi Kader Posyandu.
                   </p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <Card className="p-5 bg-white border-slate-100 shadow-sm rounded-3xl hover:border-emerald-200 transition-colors">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100/50">
                         <Building2 className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Posyandu</p>
                      <p className="text-2xl font-black text-slate-800 mt-0.5">5 Titik</p>
                  </Card>
                  <Card className="p-5 bg-white border-slate-100 shadow-sm rounded-3xl hover:border-blue-200 transition-colors">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4 border border-blue-100/50">
                         <Users className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Akun Kader</p>
                      <p className="text-2xl font-black text-slate-800 mt-0.5">25 Akun</p>
                  </Card>
              </div>

              {/* ACTION BUTTON (Tampil di Desktop & Mobile tanpa overlap) */}
              <div className="pt-2 pb-4">
                 <Button 
                   onClick={handleSeed} 
                   isLoading={loading}
                   disabled={loading || !userProfile?.puskesmasId}
                   className="w-full h-16 rounded-[1.5rem] text-lg font-black bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 text-white transition-all active:scale-95"
                 >
                   {loading ? "Membangun Wilayah Server..." : "Mulai Seeding Database"}
                 </Button>
                 {isSuccess && (
                     <Button variant="outline" onClick={() => router.push('/puskesmas/posyandu')} className="w-full mt-4 h-14 rounded-2xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50">
                         Lihat Hasil di Daftar Posyandu <ArrowRight className="ml-2 w-4 h-4" />
                     </Button>
                 )}
              </div>
          </div>

          {/* 3. TERMINAL LOG WINDOW */}
          <div className="md:col-span-5 relative">
              <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[400px]">
                  
                  {/* Mac Window Header */}
                  <div className="bg-slate-950 px-4 py-3 flex items-center gap-2 border-b border-slate-800 shrink-0">
                      <div className="flex gap-1.5">
                         <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                         <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                         <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      </div>
                      <span className="ml-2 text-[10px] text-slate-500 font-mono font-bold flex items-center gap-1.5">
                         <Terminal className="w-3 h-3" /> puskesmas-seeder.sh
                      </span>
                  </div>

                  {/* Terminal Body */}
                  <div className="p-5 flex-1 overflow-y-auto font-mono text-[10px] sm:text-xs text-emerald-400 bg-slate-900 custom-scrollbar">
                     {logs.length === 0 ? (
                       <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3 opacity-50">
                          <CheckCircle2 className="w-8 h-8" />
                          <span className="font-bold tracking-widest uppercase">System Ready...</span>
                       </div>
                     ) : (
                       <div className="space-y-1.5 pb-8">
                           {logs.map((log, i) => (
                             <div key={i} className="opacity-90">
                               <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
                               <span className={log.includes("ERROR") ? "text-rose-400" : log.includes("SUCCESS") || log.includes("FINISH") ? "text-emerald-400 font-bold" : ""}>
                                 {log}
                               </span>
                             </div>
                           ))}
                           {loading && (
                               <div className="flex items-center gap-2 text-white font-bold animate-pulse pt-2">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> EXECUTING HIERARCHY...
                               </div>
                           )}
                       </div>
                     )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}