import Link from "next/link";
import { Activity, ShieldCheck, Stethoscope, ChevronRight, UserCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-center relative overflow-hidden font-sans">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full mx-auto p-6 relative z-10">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center space-y-6 mb-12">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-teal-500/20 transform rotate-3 hover:rotate-0 transition-all duration-500">
            <Activity className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              SAESTU
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-[280px] mx-auto">
              Sistem Deteksi Dini Stunting & Pemantauan Gizi Anak Terintegrasi
            </p>
          </div>
        </div>

        {/* --- ACTION CARDS --- */}
        <div className="space-y-4">
          
          {/* Card 1: Petugas (Admin/Kader) */}
          <Link href="/login" className="group block relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-1 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-5 flex items-center gap-5">
              <div className="h-14 w-14 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="h-7 w-7" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">Akses Petugas</h3>
                <p className="text-sm text-slate-500">Masuk sebagai Admin, Petugas Puskesmas, atau Kader</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Card 2: Orang Tua */}
          <Link href="/login" className="group block relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-1 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-5 flex items-center gap-5">
              <div className="h-14 w-14 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                <UserCircle2 className="h-7 w-7" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">Akses Orang Tua</h3>
                <p className="text-sm text-slate-500">Pantau pertumbuhan anak & lihat riwayat kesehatan</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

        </div>

        {/* --- FOOTER --- */}
        <div className="mt-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
            <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Secure Health System</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Versi Pengembangan v0.1.0 &copy; 2026
          </p>
        </div>

      </div>
    </main>
  );
}