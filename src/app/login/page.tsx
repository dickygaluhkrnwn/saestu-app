"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Tambahan import
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Activity, AlertCircle } from "lucide-react";

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
          router.push("/posyandu"); // Nanti kita buat
        } else if (role === "parent") {
          router.push("/parent"); // Nanti kita buat
        } else {
          router.push("/"); // Default fallback
        }
      } else {
        // Kasus langka: User ada di Auth tapi tidak ada di Database
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
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-sm space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Login SAESTU</h1>
          <p className="text-sm text-slate-500">Masuk untuk mengelola data posyandu</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input 
              type="email" 
              placeholder="nama@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={loading}>
            Masuk
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Aplikasi Private (Tertutup).<br/>Hubungi Admin untuk akses.
        </p>
      </div>
    </div>
  );
}