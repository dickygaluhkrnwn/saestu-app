import Link from "next/link";
import { Activity, ShieldCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8">
        
        <div className="space-y-2">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            SAESTU
          </h1>
          <p className="text-slate-500">
            Sistem Deteksi Dini Stunting & Pemantauan Gizi Anak
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Tombol Login Kader / Admin */}
          <Link href="/login" className="block">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-400 transition cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Users className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900">Login Petugas</h3>
                  <p className="text-xs text-slate-500">Master Admin, Puskesmas & Kader</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Tombol Login Orang Tua (Sementara diarahkan ke login yang sama) */}
          <Link href="/login" className="block">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-green-400 transition cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-600 transition-colors">
                  <ShieldCheck className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900">Login Orang Tua</h3>
                  <p className="text-xs text-slate-500">Pantau pertumbuhan anak</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <p className="text-xs text-slate-400 mt-8">
          Versi Pengembangan v0.1.0
        </p>
      </div>
    </main>
  );
}