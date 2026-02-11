"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { addMeasurement } from "@/lib/services/measurements";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Save, Calendar, Weight, Ruler } from "lucide-react";

export default function MeasurePage() {
  const { id } = useParams();
  const router = useRouter();
  const { userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default tanggal hari ini
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    date: today,
    weight: "",
    height: "",
    headCircumference: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.posyanduId || !id) return;

    setIsSubmitting(true);
    try {
      await addMeasurement({
        childId: id as string,
        posyanduId: userProfile.posyanduId,
        kaderId: userProfile.uid,
        date: formData.date,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        headCircumference: formData.headCircumference ? parseFloat(formData.headCircumference) : undefined,
      });

      alert("Data pengukuran berhasil disimpan dan dianalisis!");
      router.push(`/posyandu/children/${id}`); // Balik ke profil anak
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("requires an index")) {
        alert("Sistem sedang menginisialisasi Index database. Mohon tunggu 1-2 menit lalu coba lagi.");
        // Tips: Buka console browser untuk klik link pembuatan index
      } else {
        alert("Gagal menyimpan data.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Navbar */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-slate-600">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="font-bold text-lg text-slate-800">Input Pengukuran</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Input Tanggal */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Tanggal Pengukuran
          </label>
          <Input 
            type="date" 
            required
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="text-lg"
          />
        </div>

        {/* Input Berat */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
          <label className="text-sm font-bold text-blue-800 flex items-center gap-2">
            <Weight className="h-5 w-5" /> Berat Badan (BB)
          </label>
          <div className="relative">
            <Input 
              type="number" 
              step="0.01" 
              placeholder="0.00"
              required
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              className="pr-12 text-2xl font-bold h-14"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">kg</span>
          </div>
        </div>

        {/* Input Tinggi */}
        <div className="p-4 bg-green-50 rounded-xl border border-green-100 space-y-3">
          <label className="text-sm font-bold text-green-800 flex items-center gap-2">
            <Ruler className="h-5 w-5" /> Panjang/Tinggi Badan (TB)
          </label>
          <div className="relative">
            <Input 
              type="number" 
              step="0.1" 
              placeholder="0.0"
              required
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
              className="pr-12 text-2xl font-bold h-14"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">cm</span>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg font-semibold shadow-xl shadow-blue-100 mt-8" 
          isLoading={isSubmitting}
        >
          <Save className="mr-2 h-5 w-5" />
          Simpan & Analisis
        </Button>

      </form>
    </div>
  );
}