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
  LineChart,
  BrainCircuit,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efek Scroll untuk Sticky Navbar Shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // PWA Install Prompt Logic
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') console.log('User accepted the install prompt');
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden selection:bg-teal-200 selection:text-teal-900">
      
      {/* --- ENTERPRISE STICKY NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-3" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-2 rounded-xl shadow-lg shadow-teal-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">SAESTU</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 font-bold text-sm text-slate-600">
             <a href="#fitur" className="hover:text-teal-600 transition-colors">Fitur Sistem</a>
             <a href="#portal" className="hover:text-teal-600 transition-colors">Portal Akses</a>
             <a href="#tentang" className="hover:text-teal-600 transition-colors">Tentang Kami</a>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            {showInstallBtn && (
              <Button 
                variant="outline" 
                onClick={handleInstallClick}
                className="hidden lg:flex rounded-full border-teal-200 text-teal-700 hover:bg-teal-50 font-bold"
              >
                <Download className="h-4 w-4 mr-2" /> Install App
              </Button>
            )}
            <Link href="/login">
               <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold px-6 shadow-lg shadow-slate-900/10">
                  Masuk <ChevronRight className="w-4 h-4 ml-1" />
               </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (DESKTOP OPTIMIZED 2-COLUMNS) --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Ornaments */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-200/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-[-10%] w-[40%] h-[60%] bg-blue-200/30 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Hero Text (Left) */}
          <div className="flex-1 text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-teal-100 shadow-sm shadow-teal-100 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
              <span className="text-[11px] font-black text-teal-700 uppercase tracking-widest">Sistem Pintar Posyandu v2.0</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[1.05]">
              Cegah <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500">Stunting</span> <br className="hidden lg:block" />
              Sejak Dini.
            </h1>
            
            <p className="text-slate-500 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              SAESTU memadukan rekam medis buku KIA Digital dengan <strong className="text-slate-700">Kecerdasan Buatan (AI)</strong> untuk mendeteksi dini risiko perlambatan berat badan *(Weight Faltering)* dan meracik rekomendasi gizi dari bahan lokal.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 h-14 text-lg bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-600/20 rounded-full font-black">
                  Mulai Akses Portal
                </Button>
              </Link>
              {showInstallBtn && (
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto px-8 h-14 text-lg bg-white border-slate-200 hover:bg-slate-50 rounded-full font-bold shadow-sm"
                >
                  <Smartphone className="h-5 w-5 mr-2 text-slate-500" />
                  Install (PWA)
                </Button>
              )}
            </div>
          </div>

          {/* Hero Visual / Abstract Dashboard (Right) */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
             <div className="relative rounded-[2.5rem] bg-slate-900 p-2 shadow-2xl shadow-slate-900/20 rotate-1 hover:rotate-0 transition-transform duration-500 border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-[2.5rem] blur-xl -z-10"></div>
                <div className="bg-slate-950 rounded-[2rem] p-6 border border-slate-800 overflow-hidden">
                   {/* Mockup UI Component */}
                   <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
                      <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center">
                         <BrainCircuit className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                         <div className="w-24 h-2 bg-slate-700 rounded-full mb-2"></div>
                         <div className="w-32 h-2 bg-slate-800 rounded-full"></div>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="w-full h-24 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4">
                         <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                            <Activity className="w-6 h-6 text-emerald-400" />
                         </div>
                         <div className="space-y-2 w-full">
                            <div className="w-1/2 h-2 bg-emerald-500/40 rounded-full"></div>
                            <div className="w-3/4 h-2 bg-emerald-500/20 rounded-full"></div>
                         </div>
                      </div>
                      <div className="w-full h-12 bg-slate-800 rounded-xl"></div>
                      <div className="w-2/3 h-12 bg-slate-800 rounded-xl"></div>
                   </div>
                </div>
             </div>

             {/* Floating Badge */}
             <div className="absolute -left-6 lg:-left-12 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce">
                <div className="bg-amber-100 p-2 rounded-full text-amber-600"><ShieldCheck className="w-5 h-5" /></div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistem Aman</p>
                   <p className="text-sm font-bold text-slate-800">Standar Medis WHO</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="fitur" className="py-24 bg-white relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Teknologi di Balik SAESTU</h2>
              <p className="text-slate-500 font-medium">Bukan sekadar pencatatan digital, kami menghadirkan asisten cerdas untuk membantu pengambilan keputusan gizi.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-teal-200 transition-colors group">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6 group-hover:scale-110 transition-transform">
                    <HeartPulse className="w-7 h-7 text-rose-500" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Deteksi Dini Akurat</h3>
                 <p className="text-slate-500 leading-relaxed text-sm">Algoritma otomatis mendeteksi tanda *Weight Faltering* (perlambatan berat) sebelum stunting terjadi, berdasarkan grafik z-score WHO.</p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-teal-200 transition-colors group">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6 group-hover:scale-110 transition-transform">
                    <BrainCircuit className="w-7 h-7 text-indigo-500" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Ahli Gizi AI Generatif</h3>
                 <p className="text-slate-500 leading-relaxed text-sm">Bunda akan mendapatkan resep MPASI Spesial yang diracik langsung oleh AI menyesuaikan dengan ketersediaan bahan pangan lokal di wilayah Puskesmas.</p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-teal-200 transition-colors group">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6 group-hover:scale-110 transition-transform">
                    <LineChart className="w-7 h-7 text-teal-500" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Rekam Medis Real-time</h3>
                 <p className="text-slate-500 leading-relaxed text-sm">Orang tua dan Petugas dapat memantau grafik tumbuh kembang secara *real-time* kapan saja, menggantikan fungsi buku KIA fisik yang mudah rusak.</p>
              </div>
           </div>
        </div>
      </section>

      {/* --- PORTAL ACCESS (SPLIT CARDS) --- */}
      <section id="portal" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight">Satu Aplikasi, Multi Portal</h2>
              <p className="text-slate-400 font-medium">Akses disesuaikan dengan wewenang Anda untuk menjaga keamanan dan privasi data medis.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 w-full">
            
            {/* Card 1: Petugas */}
            <Link href="/login" className="group block relative overflow-hidden rounded-[2.5rem] bg-slate-800 border border-slate-700 p-8 lg:p-12 hover:border-teal-500 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Stethoscope className="w-48 h-48 text-teal-400" />
              </div>
              <div className="relative space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-black text-white text-3xl tracking-tight">Portal Petugas Medis</h3>
                  <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-md">Khusus untuk Bidan Puskesmas dan Kader Posyandu untuk manajemen data balita dan input rekam ukur bulanan.</p>
                </div>
                <div className="pt-4 flex items-center text-teal-400 font-bold">
                  Masuk sebagai Petugas <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Card 2: Orang Tua */}
            <Link href="/login" className="group block relative overflow-hidden rounded-[2.5rem] bg-slate-800 border border-slate-700 p-8 lg:p-12 hover:border-emerald-500 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <UserCircle2 className="w-48 h-48 text-emerald-400" />
              </div>
              <div className="relative space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  <UserCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-black text-white text-3xl tracking-tight">Portal Orang Tua</h3>
                  <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-md">Bunda dapat memantau grafik anak, melihat histori medis, dan berkonsultasi dengan Ahli Gizi AI secara mandiri.</p>
                </div>
                <div className="pt-4 flex items-center text-emerald-400 font-bold">
                  Masuk sebagai Orang Tua <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* --- ENTERPRISE FOOTER --- */}
      <footer id="tentang" className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              
              {/* Brand Col */}
              <div className="md:col-span-2 space-y-6">
                 <div className="flex items-center gap-2">
                    <div className="bg-slate-900 p-1.5 rounded-lg">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-black text-xl text-slate-900 tracking-tight">SAESTU</span>
                 </div>
                 <p className="text-slate-500 max-w-sm leading-relaxed">
                    Menghadirkan teknologi kecerdasan buatan untuk membantu Puskesmas dan Orang Tua mencetak generasi masa depan yang sehat dan bebas stunting.
                 </p>
              </div>

              {/* Links Col 1 */}
              <div>
                 <h4 className="font-black text-slate-900 mb-6 tracking-tight">Platform</h4>
                 <ul className="space-y-4 text-slate-500 font-medium text-sm">
                    <li><a href="#fitur" className="hover:text-teal-600 transition-colors">Fitur Kami</a></li>
                    <li><Link href="/login" className="hover:text-teal-600 transition-colors">Portal Kader</Link></li>
                    <li><Link href="/login" className="hover:text-teal-600 transition-colors">Portal Orang Tua</Link></li>
                 </ul>
              </div>

              {/* Links Col 2 */}
              <div>
                 <h4 className="font-black text-slate-900 mb-6 tracking-tight">Dukungan</h4>
                 <ul className="space-y-4 text-slate-500 font-medium text-sm">
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Pusat Bantuan</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Kebijakan Privasi</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Syarat & Ketentuan</a></li>
                 </ul>
              </div>
           </div>

           <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400">
              <p>&copy; {new Date().getFullYear()} SAESTU Health System. Hak Cipta Dilindungi.</p>
              <p>Dibangun untuk Indonesia Sehat.</p>
           </div>
        </div>
      </footer>

      {/* Tombol Install Mengambang di Mobile (Bila PWA Aktif) */}
      {showInstallBtn && (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] animate-in slide-in-from-bottom-5">
            <Button onClick={handleInstallClick} className="w-full h-14 rounded-full shadow-2xl bg-teal-600 hover:bg-teal-700 font-black">
                <Smartphone className="h-5 w-5 mr-2" />
                Install SAESTU ke Layar Utama
            </Button>
        </div>
      )}
    </main>
  );
}