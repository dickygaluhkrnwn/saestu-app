"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Database, Loader2, AlertTriangle, Building2, Users } from "lucide-react";
import { addPosyandu } from "@/lib/services/posyandu";
import { createUser } from "@/lib/services/users";
import { useAuth } from "@/context/AuthContext";

// --- DATA GENERATOR ---
const POSYANDU_NAMES = ["Mawar", "Melati", "Anggrek", "Dahlia", "Kenanga"];

export default function PuskesmasSeedPage() {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleSeed = async () => {
    if (!userProfile?.puskesmasId) {
      alert("Error: Anda tidak memiliki ID Puskesmas. Pastikan login sebagai Petugas Puskesmas.");
      return;
    }

    if (!confirm(`PERINGATAN: Ini akan membuat 5 Posyandu dan 25 Akun Kader di bawah wilayah Puskesmas Anda (${userProfile.name}). Lanjutkan?`)) return;
    
    setLoading(true);
    setLogs([]);
    addLog("🚀 Memulai proses seeding wilayah...");

    try {
      for (const name of POSYANDU_NAMES) {
        const fullName = `Posyandu ${name} ${Math.floor(Math.random() * 100)}`;
        
        // 1. Buat Posyandu
        addLog(`Creating ${fullName}...`);
        const posyanduId = await addPosyandu({
          name: fullName,
          village: "Desa Contoh",
          district: "Kecamatan Sejahtera",
          address: `Jl. ${name} No. ${Math.floor(Math.random() * 50)}`,
          puskesmasId: userProfile.puskesmasId
        });
        addLog(`✅ Posyandu Created: ${fullName}`);

        // 2. Buat 5 Kader untuk Posyandu ini
        for (let i = 1; i <= 5; i++) {
          const email = `kader.${name.toLowerCase()}.${i}.${Math.floor(Math.random() * 999)}@saestu.com`;
          const password = "123456"; 
          
          addLog(`   Creating Kader ${i}: ${email}...`);
          await createUser({
            email,
            password,
            name: `Kader ${name} ${i}`,
            role: "kader",
            posyanduId: posyanduId,
            puskesmasId: userProfile.puskesmasId
          });
          
          // Delay kecil untuk menghindari rate limit Auth
          await new Promise(r => setTimeout(r, 300));
        }
        addLog(`   ✨ Selesai 5 Kader untuk ${fullName}`);
      }
      
      addLog("🎉 SEEDING SELESAI! Data dummy wilayah berhasil dibuat.");
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
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Seed Data Wilayah</h1>
            <p className="text-slate-500">Generator data dummy khusus Petugas Puskesmas.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-6 flex gap-3">
           <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
           <div className="text-sm text-amber-700">
             <p className="font-bold">Mode Pengembang</p>
             <p>Tool ini akan membuat <strong>5 Posyandu</strong> dan <strong>25 Akun Kader</strong> yang otomatis terhubung ke akun Puskesmas Anda.</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <Building2 className="text-emerald-500" />
                <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Target</p>
                    <p className="font-bold text-slate-800">5 Posyandu Baru</p>
                </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <Users className="text-blue-500" />
                <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Target</p>
                    <p className="font-bold text-slate-800">25 Akun Kader</p>
                </div>
            </div>
        </div>

        <Button 
          onClick={handleSeed} 
          isLoading={loading}
          disabled={loading || !userProfile?.puskesmasId}
          className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
        >
          {loading ? "Sedang Memproses..." : "Generate Data Wilayah"}
        </Button>

        {/* LOGS TERMINAL */}
        <div className="mt-8 bg-slate-900 rounded-xl p-6 h-64 overflow-y-auto font-mono text-xs text-emerald-400 shadow-inner border border-slate-800">
           {logs.length === 0 ? (
             <span className="text-slate-600">Menunggu perintah...</span>
           ) : (
             logs.map((log, i) => (
               <div key={i} className="mb-1 border-b border-white/5 pb-1 last:border-0">
                 <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                 {log}
               </div>
             ))
           )}
           {loading && <div className="mt-2 flex items-center gap-2 text-yellow-400"><Loader2 className="w-3 h-3 animate-spin" /> Sedang membuat data...</div>}
        </div>
      </Card>
    </div>
  );
}