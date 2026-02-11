"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, 
  ShieldCheck, 
  Stethoscope, 
  ChevronRight, 
  UserCircle2, 
  Download, 
  Smartphone, 
  HeartPulse,
  LineChart
} from "lucide-react";

// Mengimpor komponen UI yang telah kita buat sebelumnya
import { Button } from "@/components/ui/Button";

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Mencegah browser menampilkan prompt default agar kita bisa menggunakan tombol kustom
      e.preventDefault();
      // Simpan event agar bisa di-trigger saat tombol diklik
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Tampilkan prompt instalasi PWA
    deferredPrompt.prompt();
    
    // Tunggu respon dari pengguna
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    // Reset state setelah prompt ditampilkan
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center relative overflow-x-hidden font-sans">
      
      {/* --- ORNAMENTAL BACKGROUND --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-teal-100/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- NAV BAR (Minimalist) --- */}
      <nav className="w-full max-w-6xl px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-teal-500/20">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">SAESTU</span>
        </div>
        {showInstallBtn && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleInstallClick}
            className="rounded-full border-primary/20 text-primary hover:bg-primary/5 hidden sm:flex"
          >
            <Download className="h-3.5 w-3.5 mr-2" />
            Install App
          </Button>
        )}
      </nav>

      <div className="max-w-4xl w-full px-6 pt-12 pb-24 relative z-10 flex flex-col items-center">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-50"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Aplikasi Aktif & Terintegrasi</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
            Cegah <span className="text-primary italic">Stunting</span> <br />
            Sejak Dini.
          </h1>
          
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
            Sistem cerdas pemantauan gizi anak untuk membantu Kader Posyandu & Orang Tua memastikan tumbuh kembang optimal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-10 shadow-xl shadow-teal-500/30">
                Mulai Sekarang
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            {showInstallBtn && (
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={handleInstallClick}
                className="w-full sm:w-auto px-10 border-slate-200"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Unduh Aplikasi (PWA)
              </Button>
            )}
          </div>
        </div>

        {/* --- ACTION TILES (Grid) --- */}
        <div className="grid md:grid-cols-2 gap-6 w-full">
          
          {/* Card 1: Petugas (Admin/Kader) */}
          <Link href="/login" className="group block relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Stethoscope className="w-32 h-32 text-blue-600" />
            </div>
            <div className="relative space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-2xl tracking-tight">Portal Petugas</h3>
                <p className="text-slate-500 mt-2">Manajemen data balita, input penimbangan rutin, dan analisis wilayah kerja.</p>
              </div>
              <div className="pt-4 flex items-center text-blue-600 font-bold text-sm">
                Masuk sebagai Kader <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Card 2: Orang Tua */}
          <Link href="/login" className="group block relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <UserCircle2 className="w-32 h-32 text-emerald-600" />
            </div>
            <div className="relative space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                <UserCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-2xl tracking-tight">Portal Orang Tua</h3>
                <p className="text-slate-500 mt-2">Pantau grafik pertumbuhan anak secara mandiri dan dapatkan saran nutrisi harian.</p>
              </div>
              <div className="pt-4 flex items-center text-emerald-600 font-bold text-sm">
                Masuk sebagai Orang Tua <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </Link>

        </div>

        {/* --- FEATURES MINI SECTION --- */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full border-t border-slate-200 pt-12">
            <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100"><HeartPulse className="h-5 w-5 text-rose-500" /></div>
                <div><h4 className="font-bold text-slate-800 text-sm">Akurasi Medis</h4><p className="text-xs text-slate-500">Berdasarkan standar WHO 2006.</p></div>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100"><LineChart className="h-5 w-5 text-blue-500" /></div>
                <div><h4 className="font-bold text-slate-800 text-sm">Grafik Real-time</h4><p className="text-xs text-slate-500">Pantau progres tanpa menunggu.</p></div>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100"><ShieldCheck className="h-5 w-5 text-emerald-500" /></div>
                <div><h4 className="font-bold text-slate-800 text-sm">Data Aman</h4><p className="text-xs text-slate-500">Enkripsi standar keamanan data.</p></div>
            </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-24 text-center space-y-4">
          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
            Produk Inovasi &copy; 2026 SAESTU Health System
          </p>
        </div>

      </div>

      {/* Tombol Install Mengambang di Mobile */}
      {showInstallBtn && (
        <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] animate-in slide-in-from-bottom-5">
            <Button onClick={handleInstallClick} className="w-full h-14 rounded-full shadow-2xl">
                <Smartphone className="h-5 w-5 mr-2" />
                Install SAESTU Sekarang
            </Button>
        </div>
      )}
    </main>
  );
}