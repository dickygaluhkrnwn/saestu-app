"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Database, 
  Users, 
  Baby, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2,
  ArrowRight,
  Terminal,
  Server
} from "lucide-react";

// Services
import { createParentAccount } from "@/lib/services/parents";
import { addChild } from "@/lib/services/children";

// --- DUMMY DATA GENERATOR ---
const PARENT_NAMES = [
  "Ibu Siti Fatimah", "Ibu Aminah", "Ibu Rina Lestari", "Ibu Sari Maya", 
  "Ibu Diana Putri", "Ibu Maya Sofa", "Ibu Ani Wijaya", "Ibu Wati", 
  "Ibu Nina Marlina", "Ibu Eni Rohaeni"
];

const CHILD_DATA = [
  { name: "Ahmad Fikri", gender: "L" as const },
  { name: "Siti Aisyah", gender: "P" as const },
  { name: "Budi Santoso", gender: "L" as const },
  { name: "Rani Rahmawati", gender: "P" as const },
  { name: "Dodi Hermawan", gender: "L" as const },
  { name: "Citra Lestari", gender: "P" as const },
  { name: "Eka Putra", gender: "L" as const },
  { name: "Fani Fitriani", gender: "P" as const },
  { name: "Gita Permata", gender: "P" as const },
  { name: "Hana Amelia", gender: "P" as const },
  { name: "Ivan Gunawan", gender: "L" as const },
  { name: "Jaka Tarub", gender: "L" as const },
  { name: "Kiki Rizki", gender: "L" as const },
  { name: "Lusi Safitri", gender: "P" as const },
  { name: "Maman Abdurrahman", gender: "L" as const },
];

export default function PosyanduSeedPage() {
  const { userProfile } = useAuth();
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleSeed = async () => {
    if (!userProfile?.posyanduId) {
      alert("Error: Anda tidak terdeteksi sebagai Kader. Pastikan akun memiliki Posyandu ID.");
      return;
    }

    if (!confirm("Sistem akan melakukan injeksi 10 akun Ortu dan 15 data Balita di server Posyandu Anda. Lanjutkan?")) return;

    setLoading(true);
    setIsSuccess(false);
    setLogs([]);
    addLog("🚀 Memulai inisialisasi koneksi ke server...");

    try {
      const createdParents: { uid: string, name: string }[] = [];

      // 1. Create Parents
      addLog("--- [1/2] PROSES INJEKSI AKUN ORANG TUA ---");
      for (const pName of PARENT_NAMES) {
        const email = `ortu.${pName.toLowerCase().replace(/\s+/g, '')}.${Math.floor(Math.random() * 1000)}@saestu.com`;
        const password = "password123";
        
        addLog(`[CREATE] Mendaftarkan profil: ${pName}...`);
        const uid = await createParentAccount(userProfile.posyanduId, {
          name: pName,
          email: email,
          password: password
        });
        
        createdParents.push({ uid, name: pName });
        addLog(`[OK] UID Generated. Akun Siap: ${email}`);
        await new Promise(r => setTimeout(r, 400)); 
      }

      // 2. Create Children & Link to Parents
      addLog("--- [2/2] PROSES INJEKSI DATA BALITA & RELASI ---");
      for (let i = 0; i < CHILD_DATA.length; i++) {
        const childBase = CHILD_DATA[i];
        const parent = createdParents[i % createdParents.length]; 
        
        const randomDays = Math.floor(Math.random() * 1500);
        const dob = new Date();
        dob.setDate(dob.getDate() - randomDays);
        const dobString = dob.toISOString().split('T')[0];

        const weight = 3 + (Math.random() * 5);
        const height = 45 + (Math.random() * 15);

        addLog(`[LINK] Menghubungkan ${childBase.name} -> Ortu: ${parent.name}...`);
        
        await addChild({
          name: childBase.name,
          nik: `3201${Math.floor(Math.random() * 1000000000000)}`,
          gender: childBase.gender,
          pob: "Bandung",
          dob: dobString,
          parentId: parent.uid,
          parentName: parent.name,
          posyanduId: userProfile.posyanduId,
          initialWeight: parseFloat(weight.toFixed(2)),
          initialHeight: parseFloat(height.toFixed(1)),
        });

        addLog(`[OK] Data tersimpan di Firestore: ${childBase.name}`);
        await new Promise(r => setTimeout(r, 300));
      }

      addLog("🎉 [SUCCESS] Seluruh proses injeksi data selesai tanpa error.");
      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      addLog(`❌ [FATAL ERROR]: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans pb-32 md:pb-8 max-w-4xl mx-auto">
      
      {/* 1. COMPACT HERO SECTION */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 p-6 sm:p-8 shadow-xl shadow-slate-900/20 overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
           <Database className="w-32 h-32 text-teal-400 transform rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-2 w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-teal-400 text-[10px] font-black uppercase tracking-widest">
                 <Server className="w-3 h-3" /> Dev Tools
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">Database Seeder</h1>
              <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed font-medium">
                 Modul khusus untuk menginjeksi puluhan data dummy (Balita & Orang Tua) ke dalam database Posyandu lokal secara otomatis.
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
                     Semua akun orang tua yang dihasilkan dari alat ini akan menggunakan kata sandi <code className="bg-white px-2 py-1 rounded-md font-bold border border-amber-200 text-amber-700 shadow-sm mx-1">password123</code>. Gunakan akun tersebut untuk menguji fitur aplikasi dari sisi Orang Tua.
                   </p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <Card className="p-5 bg-white border-slate-100 shadow-sm rounded-3xl hover:border-blue-200 transition-colors">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                         <Users className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Injeksi Ortu</p>
                      <p className="text-2xl font-black text-slate-800 mt-0.5">10 Akun</p>
                  </Card>
                  <Card className="p-5 bg-white border-slate-100 shadow-sm rounded-3xl hover:border-pink-200 transition-colors">
                      <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mb-4">
                         <Baby className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Injeksi Anak</p>
                      <p className="text-2xl font-black text-slate-800 mt-0.5">15 Data</p>
                  </Card>
              </div>

              {/* ACTION BUTTON (Tampil di Desktop & Mobile tanpa overlap) */}
              <div className="pt-2 pb-4">
                 <Button 
                   onClick={handleSeed} 
                   isLoading={loading}
                   disabled={loading || !userProfile?.posyanduId}
                   className="w-full h-16 rounded-[1.5rem] text-lg font-black bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-500/20 text-white transition-all active:scale-95"
                 >
                   {loading ? "Menyuntikkan Data Server..." : "Mulai Seeding Database"}
                 </Button>
                 {isSuccess && (
                     <Button variant="outline" onClick={() => router.push('/posyandu/children')} className="w-full mt-4 h-14 rounded-2xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50">
                         Lihat Hasil di Halaman Balita <ArrowRight className="ml-2 w-4 h-4" />
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
                         <Terminal className="w-3 h-3" /> posyandu-seeder.sh
                      </span>
                  </div>

                  {/* Terminal Body */}
                  <div className="p-5 flex-1 overflow-y-auto font-mono text-[10px] sm:text-xs text-teal-400 bg-slate-900 custom-scrollbar">
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
                               <span className={log.includes("ERROR") ? "text-rose-400" : log.includes("SUCCESS") ? "text-emerald-400 font-bold" : ""}>
                                 {log}
                               </span>
                             </div>
                           ))}
                           {loading && (
                               <div className="flex items-center gap-2 text-white font-bold animate-pulse pt-2">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> EXECUTING QUERY...
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