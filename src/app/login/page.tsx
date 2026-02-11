"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Activity, AlertCircle, HeartPulse, ShieldCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Login ke Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Ambil data jabatan (role) dari Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const role = userData.role;

        // 3. Arahkan sesuai jabatan
        if (role === "master") {
          router.push("/master");
        } else if (role === "kader") {
          router.push("/posyandu");
        } else if (role === "parent") {
          router.push("/parent");
        } else {
          router.push("/"); // Default fallback
        }
      } else {
        setError("Akun valid, tapi data profil tidak ditemukan.");
        router.push("/");
      }

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        setError("Email atau password salah.");
      } else {
        setError("Terjadi kesalahan sistem. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* --- LEFT SIDE (Illustration / Brand) - Hidden on Mobile --- */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-600 to-blue-700 relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-10"></div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-lg space-y-8">
           <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
              <Activity className="h-8 w-8 text-white" />
           </div>
           
           <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight leading-tight">
                 Masa Depan Sehat <br/> Dimulai Sejak Dini
              </h1>
              <p className="text-lg text-teal-100 leading-relaxed opacity-90">
                 Sistem pemantauan tumbuh kembang anak berbasis digital untuk mendeteksi stunting lebih awal dan memberikan intervensi yang tepat sasaran.
              </p>
           </div>

           {/* Testimonial / Quote Card */}
           <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                 <ShieldCheck className="w-5 h-5 text-emerald-300" />
                 <span className="text-sm font-bold uppercase tracking-wider text-emerald-200">Trusted System</span>
              </div>
              <p className="text-sm italic opacity-80">
                 "Data yang akurat adalah kunci utama dalam penanganan stunting. SAESTU hadir untuk memastikan setiap anak terpantau dengan baik."
              </p>
           </div>
        </div>
      </div>

      {/* --- RIGHT SIDE (Login Form) --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 xl:p-24 relative bg-white">
        
        {/* Back Button (Mobile) */}
        <div className="absolute top-6 left-6 lg:hidden">
           <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 inline-flex items-center text-slate-500">
              <ChevronLeft className="w-5 h-5 mr-1" /> Kembali
           </Link>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-8">
           
           <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex lg:hidden items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-teal-600 mb-4">
                 <Activity className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Selamat Datang</h2>
              <p className="text-slate-500">Masuk ke akun Anda untuk melanjutkan.</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Email</label>
                    <Input 
                       type="email" 
                       placeholder="nama@email.com" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                       className="h-12 bg-slate-50 border-slate-200 focus:bg-white"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                       <label className="text-sm font-semibold text-slate-700">Password</label>
                       <Link href="#" className="text-xs font-medium text-teal-600 hover:text-teal-700 hover:underline">
                          Lupa password?
                       </Link>
                    </div>
                    <Input 
                       type="password" 
                       placeholder="••••••••" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                       className="h-12 bg-slate-50 border-slate-200 focus:bg-white"
                    />
                 </div>
              </div>

              {error && (
                 <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-start gap-3 animate-fade-in">
                    <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                    <span className="font-medium">{error}</span>
                 </div>
              )}

              <Button 
                 type="submit" 
                 className="w-full h-12 text-base font-bold shadow-lg shadow-teal-500/20" 
                 isLoading={loading}
              >
                 Masuk Aplikasi
              </Button>
           </form>

           <div className="pt-6 text-center">
              <p className="text-xs text-slate-400">
                 Belum punya akun? <span className="font-medium text-slate-600">Hubungi Admin Posyandu</span>
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}