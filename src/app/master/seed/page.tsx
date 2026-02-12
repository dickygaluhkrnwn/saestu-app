"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Database, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { addPuskesmas } from "@/lib/services/puskesmas";
import { createUser } from "@/lib/services/users";
import { Puskesmas } from "@/types/schema";

// --- DATA DUMMY ---
const DUMMY_PUSKESMAS = [
  { name: "Puskesmas Sukajadi", district: "Sukajadi", address: "Jl. Sukajadi No. 12", headName: "Dr. Budi Santoso" },
  { name: "Puskesmas Coblong", district: "Coblong", address: "Jl. Ir. H. Juanda No. 30", headName: "Dr. Siti Aminah" },
  { name: "Puskesmas Cicendo", district: "Cicendo", address: "Jl. Pasir Kaliki No. 55", headName: "Dr. Ahmad Yani" },
  { name: "Puskesmas Andir", district: "Andir", address: "Jl. Rajawali Timur No. 10", headName: "Dr. Rina Marlina" },
  { name: "Puskesmas Sumur Bandung", district: "Sumur Bandung", address: "Jl. Tamblong No. 2", headName: "Dr. Dedi Mulyadi" },
];

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleSeed = async () => {
    if (!confirm("PERHATIAN: Ini akan menambahkan data dummy ke database LIVE. Lanjutkan?")) return;
    
    setLoading(true);
    setLogs([]);
    addLog("🚀 Memulai proses seeding...");

    try {
      for (const p of DUMMY_PUSKESMAS) {
        // 1. Buat Puskesmas
        addLog(`Creating Puskesmas: ${p.name}...`);
        const puskId = await addPuskesmas({
          name: p.name,
          district: p.district,
          address: p.address,
          headName: p.headName
        });
        addLog(`✅ Puskesmas Created ID: ${puskId}`);

        // 2. Buat User Petugas untuk Puskesmas ini
        const email = `petugas.${p.district.toLowerCase().replace(" ", "")}@saestu.com`;
        const password = "123456"; // Default password
        
        addLog(`   Creating User: ${email}...`);
        await createUser({
          email,
          password,
          name: `Admin ${p.district}`,
          role: "puskesmas",
          puskesmasId: puskId
        });
        addLog(`   ✅ User Created: ${email}`);
        
        // Delay sedikit agar tidak terkena rate limit
        await new Promise(r => setTimeout(r, 500));
      }
      
      addLog("🎉 SEEDING SELESAI! Semua data berhasil dibuat.");
    } catch (error: any) {
      console.error(error);
      addLog(`❌ ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl p-8 shadow-xl border-slate-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Database Seeder</h1>
            <p className="text-slate-500">Tool injeksi data dummy untuk testing.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-6 flex gap-3">
           <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
           <p className="text-sm text-amber-700">
             <strong>Warning:</strong> Proses ini akan membuat akun Authentication asli. Pastikan Anda menggunakan Project Firebase Development/Test, bukan Production.
           </p>
        </div>

        <Button 
          onClick={handleSeed} 
          isLoading={loading}
          className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
        >
          {loading ? "Sedang Memproses..." : "Mulai Seeding Data (5 Puskesmas + 5 User)"}
        </Button>

        {/* LOGS TERMINAL */}
        <div className="mt-8 bg-slate-900 rounded-xl p-6 h-64 overflow-y-auto font-mono text-xs text-green-400 shadow-inner border border-slate-800">
           {logs.length === 0 ? (
             <span className="text-slate-600">Waiting for command...</span>
           ) : (
             logs.map((log, i) => (
               <div key={i} className="mb-1 border-b border-white/5 pb-1 last:border-0">
                 <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                 {log}
               </div>
             ))
           )}
           {loading && <div className="mt-2 flex items-center gap-2 text-yellow-400"><Loader2 className="w-3 h-3 animate-spin" /> Processing...</div>}
        </div>
      </Card>
    </div>
  );
}