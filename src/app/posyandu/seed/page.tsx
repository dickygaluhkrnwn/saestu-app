"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // Ditambahkan: Import useRouter
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Database, 
  Users, 
  Baby, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2,
  ArrowRight
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
  const router = useRouter(); // Ditambahkan: Inisialisasi router
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleSeed = async () => {
    if (!userProfile?.posyanduId) {
      alert("Error: Anda tidak terdeteksi sebagai Kader. Pastikan akun memiliki Posyandu ID.");
      return;
    }

    if (!confirm("Halaman ini akan membuat 10 akun Ortu dan 15 data Balita di Posyandu Anda. Lanjutkan?")) return;

    setLoading(true);
    setLogs([]);
    addLog("🚀 Memulai sinkronisasi data dummy...");

    try {
      const createdParents: { uid: string, name: string }[] = [];

      // 1. Create Parents
      addLog("--- Tahap 1: Pendaftaran Akun Orang Tua ---");
      for (const pName of PARENT_NAMES) {
        const email = `ortu.${pName.toLowerCase().replace(/\s+/g, '')}.${Math.floor(Math.random() * 1000)}@saestu.com`;
        const password = "password123";
        
        addLog(`Mendaftarkan: ${pName}...`);
        const uid = await createParentAccount(userProfile.posyanduId, {
          name: pName,
          email: email,
          password: password
        });
        
        createdParents.push({ uid, name: pName });
        addLog(`✅ Akun Berhasil: ${email}`);
        await new Promise(r => setTimeout(r, 400)); // Delay agar Firestore tidak overload
      }

      // 2. Create Children & Link to Parents
      addLog("--- Tahap 2: Input Data Balita & Relasi ---");
      for (let i = 0; i < CHILD_DATA.length; i++) {
        const childBase = CHILD_DATA[i];
        // Pilih orang tua secara acak dari yang baru dibuat
        const parent = createdParents[i % createdParents.length]; 
        
        // Generate random DOB dalam 5 tahun terakhir
        const randomDays = Math.floor(Math.random() * 1500);
        const dob = new Date();
        dob.setDate(dob.getDate() - randomDays);
        const dobString = dob.toISOString().split('T')[0];

        // Random stats
        const weight = 3 + (Math.random() * 5);
        const height = 45 + (Math.random() * 15);

        addLog(`Mendaftarkan Anak: ${childBase.name} (Ortu: ${parent.name})...`);
        
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

        addLog(`✅ Data Tersimpan: ${childBase.name}`);
        await new Promise(r => setTimeout(r, 300));
      }

      addLog("🎉 SELESAI! Posyandu Anda sekarang memiliki data yang kaya.");
    } catch (error: any) {
      console.error(error);
      addLog(`❌ ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans flex flex-col items-center">
      <Card className="w-full max-w-2xl p-8 rounded-[2rem] shadow-2xl border-0">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-teal-100 text-teal-600 rounded-[1.5rem]">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Generator Data Lokal</h1>
            <p className="text-slate-500 text-sm">Injeksi data Balita & Orang Tua untuk wilayah kerja Anda.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl mb-8 flex gap-4">
           <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
           <div className="text-sm text-amber-800">
             <p className="font-bold mb-1">Informasi Akun Dummy</p>
             <p className="opacity-80 leading-relaxed">
               Semua orang tua akan memiliki password default: <code className="bg-white px-2 py-0.5 rounded font-bold border border-amber-200">password123</code>. Gunakan akun ini untuk mengetes login di sisi Aplikasi Orang Tua.
             </p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Users className="w-5 h-5 text-blue-500 mb-2" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Ortu</p>
                <p className="text-xl font-black text-slate-800">10 Akun</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Baby className="w-5 h-5 text-pink-500 mb-2" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Balita</p>
                <p className="text-xl font-black text-slate-800">15 Data</p>
            </div>
        </div>

        <Button 
          onClick={handleSeed} 
          isLoading={loading}
          disabled={loading || !userProfile?.posyanduId}
          className="w-full h-16 rounded-2xl text-lg font-black bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-500/20 text-white"
        >
          {loading ? "Menyuntikkan Data..." : "Mulai Seeding Sekarang"}
        </Button>

        {/* LOGS WINDOW */}
        <div className="mt-10 bg-slate-900 rounded-3xl p-6 h-80 overflow-y-auto font-mono text-[10px] text-teal-400 shadow-inner border border-slate-800">
           {logs.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3">
                <CheckCircle2 className="w-8 h-8 opacity-20" />
                <span>Siap menerima perintah seeding...</span>
             </div>
           ) : (
             logs.map((log, i) => (
               <div key={i} className="mb-2 border-b border-white/5 pb-1 last:border-0 opacity-90">
                 <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                 {log}
               </div>
             ))
           )}
           {loading && <div className="mt-4 flex items-center gap-2 text-white font-bold animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> MENGHUBUNGI SERVER...</div>}
        </div>

        {logs.some(l => l.includes("🎉")) && (
            <div className="mt-6">
                <Button variant="ghost" onClick={() => router.push('/posyandu/children')} className="w-full text-teal-600 font-bold">
                    Cek Hasil di Data Balita <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        )}
      </Card>
    </div>
  );
}