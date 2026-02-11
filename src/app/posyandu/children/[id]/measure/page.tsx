"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { addMeasurement } from "@/lib/services/measurements";
import { ArrowLeft, Save, Calendar, Weight, Ruler, Activity } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function MeasurePage() {
  const { id } = useParams();
  const router = useRouter();
  const { userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

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

      showToast("Data pengukuran berhasil disimpan! ✅", "success");
      
      // Delay sedikit agar toast terbaca sebelum redirect
      setTimeout(() => {
        router.push(`/posyandu/children/${id}`);
      }, 1500);
      
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("requires an index")) {
        showToast("⚠️ Sistem sedang update Index DB. Coba 1 menit lagi.", "info");
      } else {
        showToast("Gagal menyimpan data pengukuran.", "error");
      }
      setIsSubmitting(false); // Stop loading only on error, success will redirect
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans pb-32 md:pb-10">
        {/* Container Utama */}
        <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Header Navigasi */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => router.back()} 
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Input Pengukuran</h1>
                    <p className="text-sm text-slate-500">Pastikan data akurat sesuai timbangan</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Card Tanggal */}
                <Card className="bg-white border-slate-100 shadow-sm">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Tanggal Kunjungan
                    </label>
                    <Input 
                        type="date" 
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="h-12 text-lg bg-slate-50 border-slate-200 focus:bg-white transition-all"
                    />
                </Card>

                {/* Grid Input Utama */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card Berat Badan */}
                    <Card hoverable className="bg-blue-50/50 border-blue-100 shadow-sm relative overflow-hidden group focus-within:ring-2 ring-blue-200 transition-all">
                        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                            <Weight className="w-16 h-16 text-blue-600" />
                        </div>
                        <label className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-3">
                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                <Weight className="w-4 h-4 text-blue-600" />
                            </div>
                            Berat Badan (BB)
                        </label>
                        <div className="relative">
                            <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="0.00"
                                required
                                value={formData.weight}
                                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                className="pr-12 text-3xl font-bold h-16 bg-white border-blue-200 text-slate-800 placeholder:text-blue-200 focus:border-blue-400 focus:ring-0"
                            />
                            <Badge variant="neutral" className="absolute right-4 top-1/2 -translate-y-1/2 font-bold bg-slate-50 border-0">
                                kg
                            </Badge>
                        </div>
                    </Card>

                    {/* Card Tinggi Badan */}
                    <Card hoverable className="bg-pink-50/50 border-pink-100 shadow-sm relative overflow-hidden group focus-within:ring-2 ring-pink-200 transition-all">
                        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                            <Ruler className="w-16 h-16 text-pink-600" />
                        </div>
                        <label className="text-sm font-bold text-pink-800 flex items-center gap-2 mb-3">
                            <div className="p-1.5 bg-pink-100 rounded-lg">
                                <Ruler className="w-4 h-4 text-pink-600" />
                            </div>
                            Tinggi Badan (TB)
                        </label>
                        <div className="relative">
                            <Input 
                                type="number" 
                                step="0.1" 
                                placeholder="0.0"
                                required
                                value={formData.height}
                                onChange={(e) => setFormData({...formData, height: e.target.value})}
                                className="pr-12 text-3xl font-bold h-16 bg-white border-pink-200 text-slate-800 placeholder:text-pink-200 focus:border-pink-400 focus:ring-0"
                            />
                            <Badge variant="neutral" className="absolute right-4 top-1/2 -translate-y-1/2 font-bold bg-slate-50 border-0">
                                cm
                            </Badge>
                        </div>
                    </Card>
                </div>

                {/* Optional: Lingkar Kepala */}
                <Card className="bg-white border-slate-100 shadow-sm">
                    <label className="text-sm font-semibold text-slate-600 flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-slate-400" />
                        Lingkar Kepala (Opsional)
                    </label>
                    <div className="relative">
                        <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="0.0"
                            value={formData.headCircumference}
                            onChange={(e) => setFormData({...formData, headCircumference: e.target.value})}
                            className="pr-12 h-12 text-lg bg-slate-50 border-slate-200 focus:bg-white"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                            cm
                        </span>
                    </div>
                </Card>

                {/* Sticky Submit Button */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 md:static md:bg-transparent md:border-0 md:p-0 z-30">
                    <div className="max-w-2xl mx-auto">
                        <Button 
                            type="submit" 
                            className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/30 btn-primary rounded-2xl" 
                            isLoading={isSubmitting}
                            size="lg"
                        >
                            <Save className="mr-2 h-5 w-5" />
                            Simpan & Analisis
                        </Button>
                    </div>
                </div>

            </form>
        </div>

        {/* Toast Notification */}
        <Toast 
            message={toast.message} 
            type={toast.type} 
            isVisible={toast.isVisible} 
            onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
        />
    </div>
  );
}