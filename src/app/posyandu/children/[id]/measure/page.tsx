"use client";

import { useState, useRef, useEffect } from "react";
// Tambahkan useSearchParams
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { addMeasurement } from "@/lib/services/measurements";
import { 
  ArrowLeft, Save, Calendar, Weight, Ruler, Activity, Camera, X, RefreshCw
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function MeasurePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams(); // Membaca URL
  const { userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- SMART SCAN (VISION) STATE ---
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanTarget, setScanTarget] = useState<"weight" | "height" | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "", type: "success", isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    date: today,
    weight: "",
    height: "",
    headCircumference: "",
  });

  // --- CAMERA LOGIC ---
  const openCamera = async (target: "weight" | "height") => {
    setScanTarget(target);
    setIsCameraOpen(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Akses kamera ditolak:", err);
      showToast("Gagal mengakses kamera. Pastikan izin kamera diberikan.", "error");
      closeCamera();
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setScanTarget(null);
  };

  // Bersihkan memori kamera jika komponen ditutup
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // FITUR BARU: Deteksi jika tombol "Smart Scan" dari Jalan Pintas diklik
  useEffect(() => {
    const autoScan = searchParams.get('autoScan');
    if (autoScan === 'true') {
      // Tunggu sebentar agar animasi pindah halaman selesai, lalu buka kamera
      const timer = setTimeout(() => {
        openCamera('weight');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current || !scanTarget) return;

    setIsProcessingImage(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Image = canvas.toDataURL("image/jpeg", 0.7);
      closeCamera();
      showToast("Sedang membaca angka...", "info");

      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memproses gambar");
      }

      setFormData(prev => ({
        ...prev,
        [scanTarget]: data.value.toString()
      }));

      showToast(`Berhasil! Angka terbaca: ${data.value}`, "success");

    } catch (err: any) {
      showToast(err.message || "Gagal membaca layar. Coba input manual.", "error");
    } finally {
      setIsProcessingImage(false);
    }
  };

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
      setTimeout(() => router.push(`/posyandu/children/${id}`), 1500);
      
    } catch (err: any) {
      showToast("Gagal menyimpan data pengukuran.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans pb-32 md:pb-10 relative">
        <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Input Pengukuran</h1>
                    <p className="text-sm text-slate-500">Pastikan data akurat sesuai timbangan</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card hoverable className="bg-blue-50/50 border-blue-100 shadow-sm relative overflow-hidden group focus-within:ring-2 ring-blue-200 transition-all p-0">
                        <div className="p-5">
                            <label className="text-sm font-bold text-blue-800 flex justify-between items-center mb-3">
                                <span className="flex items-center gap-2">
                                  <div className="p-1.5 bg-blue-100 rounded-lg"><Weight className="w-4 h-4 text-blue-600" /></div>
                                  Berat Badan (BB)
                                </span>
                                <button type="button" onClick={() => openCamera('weight')} disabled={isProcessingImage} className="text-[10px] uppercase font-bold tracking-widest bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-200 transition-all">
                                  <Camera className="w-3.5 h-3.5" /> Scan
                                </button>
                            </label>
                            <div className="relative">
                                <Input 
                                    type="number" step="0.01" placeholder="0.00" required
                                    value={formData.weight}
                                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                    className="pr-12 text-3xl font-bold h-16 bg-white border-blue-200 text-slate-800 focus:border-blue-400 focus:ring-0"
                                />
                                <Badge variant="neutral" className="absolute right-4 top-1/2 -translate-y-1/2 font-bold bg-slate-50 border-0">kg</Badge>
                            </div>
                        </div>
                    </Card>

                    <Card hoverable className="bg-pink-50/50 border-pink-100 shadow-sm relative overflow-hidden group focus-within:ring-2 ring-pink-200 transition-all p-0">
                        <div className="p-5">
                            <label className="text-sm font-bold text-pink-800 flex justify-between items-center mb-3">
                                <span className="flex items-center gap-2">
                                  <div className="p-1.5 bg-pink-100 rounded-lg"><Ruler className="w-4 h-4 text-pink-600" /></div>
                                  Tinggi Badan (TB)
                                </span>
                                <button type="button" onClick={() => openCamera('height')} disabled={isProcessingImage} className="text-[10px] uppercase font-bold tracking-widest bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-pink-200 transition-all">
                                  <Camera className="w-3.5 h-3.5" /> Scan
                                </button>
                            </label>
                            <div className="relative">
                                <Input 
                                    type="number" step="0.1" placeholder="0.0" required
                                    value={formData.height}
                                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                                    className="pr-12 text-3xl font-bold h-16 bg-white border-pink-200 text-slate-800 focus:border-pink-400 focus:ring-0"
                                />
                                <Badge variant="neutral" className="absolute right-4 top-1/2 -translate-y-1/2 font-bold bg-slate-50 border-0">cm</Badge>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="bg-white border-slate-100 shadow-sm">
                    <label className="text-sm font-semibold text-slate-600 flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-slate-400" />
                        Lingkar Kepala (Opsional)
                    </label>
                    <div className="relative">
                        <Input 
                            type="number" step="0.1" placeholder="0.0"
                            value={formData.headCircumference}
                            onChange={(e) => setFormData({...formData, headCircumference: e.target.value})}
                            className="pr-12 h-12 text-lg bg-slate-50 border-slate-200 focus:bg-white"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">cm</span>
                    </div>
                </Card>

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

        {isCameraOpen && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col">
             <div className="p-6 pt-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
                <div className="text-white">
                   <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Smart Scan</p>
                   <p className="text-lg font-bold">Arahkan ke Angka Timbangan</p>
                </div>
                <button onClick={closeCamera} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md transition-colors">
                   <X className="w-6 h-6" />
                </button>
             </div>

             <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="min-w-full min-h-full object-cover"
                />
                
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                   <div className="w-64 h-24 border-2 border-primary/80 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                      <p className="absolute -bottom-8 w-full text-center text-white text-xs font-bold shadow-black drop-shadow-md">
                         Posisikan angka di dalam kotak
                      </p>
                   </div>
                </div>
             </div>

             <div className="p-8 pb-12 bg-black flex justify-center items-center">
                <button 
                  onClick={captureAndScan}
                  className="w-20 h-20 rounded-full border-4 border-slate-300 flex items-center justify-center hover:border-white transition-all active:scale-95"
                >
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                     <Camera className="w-8 h-8 text-slate-800" />
                   </div>
                </button>
             </div>
             
             <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {isProcessingImage && (
          <div className="fixed inset-0 z-[110] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse mb-4">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
             </div>
             <h3 className="text-xl font-bold text-slate-800">Menganalisis Angka...</h3>
             <p className="text-slate-500 text-sm mt-1">AI sedang membaca foto timbangan</p>
          </div>
        )}

        <Toast 
            message={toast.message} type={toast.type} 
            isVisible={toast.isVisible} onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
        />
    </div>
  );
}