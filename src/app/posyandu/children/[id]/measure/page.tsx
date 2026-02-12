"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Child } from "@/types/schema";
import { addMeasurement } from "@/lib/services/measurements";
import { 
  ArrowLeft, Save, Calendar, Weight, Ruler, Activity, Camera, X, RefreshCw, Brain, ScanLine
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toast, ToastType } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

// Komponen Utama dengan Suspense Wrapper (karena useSearchParams)
export default function MeasurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><RefreshCw className="animate-spin text-teal-600" /></div>}>
      <MeasurementForm />
    </Suspense>
  );
}

function MeasurementForm() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userProfile } = useAuth();
  
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Fetch data anak untuk info header
  useEffect(() => {
    const fetchChild = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "children", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setChild({ id: docSnap.id, ...docSnap.data() } as Child);
        }
      } catch (err) {
        console.error(err);
        showToast("Gagal memuat data anak.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchChild();
  }, [id]);

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

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Deteksi autoScan dari dashboard
  useEffect(() => {
    const autoScan = searchParams.get('autoScan');
    if (autoScan === 'true') {
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
      showToast("AI sedang menganalisis foto...", "info");

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
      showToast(err.message || "Gagal membaca layar. Silakan input manual.", "error");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // INTEGRASI LOGIC BARU: Pastikan posyanduId dan kaderId masuk
    if (!userProfile?.posyanduId || !id) {
        showToast("Error: Data sesi tidak lengkap.", "error");
        return;
    }

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Sinkronisasi Data...</p>
      </div>
    </div>
  );

  if (!child) return <div className="p-8 text-center">Data tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans pb-32 md:pb-10 relative">
        <div className="max-w-2xl mx-auto space-y-6">
            
            {/* --- HEADER --- */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <button onClick={() => router.back()} className="p-2.5 rounded-2xl bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-600 transition-all">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Input Pengukuran</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="neutral" className="bg-teal-50 text-teal-700 border-0 text-[10px] font-bold uppercase py-0">{child.name}</Badge>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Posyandu Digital</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- TANGGAL --- */}
                <Card className="p-5 border-slate-100 shadow-sm rounded-3xl">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        Tanggal Kunjungan
                    </label>
                    <Input 
                        type="date" 
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="h-14 text-lg bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-teal-500/20 transition-all font-semibold"
                    />
                </Card>

                {/* --- INPUT BB & TB (GRID) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* BERAT BADAN */}
                    <Card className="bg-white border-slate-100 shadow-sm rounded-3xl overflow-hidden p-0">
                        <div className="p-5 space-y-4">
                            <label className="text-xs font-bold text-blue-700 uppercase tracking-widest flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Weight className="w-4 h-4" /></div>
                                  Berat (BB)
                                </span>
                                <button type="button" onClick={() => openCamera('weight')} disabled={isProcessingImage} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-200 transition-all active:scale-95">
                                  <ScanLine className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold">SCAN</span>
                                </button>
                            </label>
                            <div className="relative">
                                <Input 
                                    type="number" step="0.01" placeholder="0.00" required
                                    value={formData.weight}
                                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                    className="pr-12 text-3xl font-extrabold h-16 bg-slate-50 border-0 rounded-2xl text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                                />
                                <Badge variant="neutral" className="absolute right-4 top-1/2 -translate-y-1/2 font-bold bg-white border-0 shadow-sm">kg</Badge>
                            </div>
                        </div>
                    </Card>

                    {/* TINGGI BADAN */}
                    <Card className="bg-white border-slate-100 shadow-sm rounded-3xl overflow-hidden p-0">
                        <div className="p-5 space-y-4">
                            <label className="text-xs font-bold text-pink-700 uppercase tracking-widest flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                  <div className="p-1.5 bg-pink-50 rounded-lg text-pink-600"><Ruler className="w-4 h-4" /></div>
                                  Tinggi (TB)
                                </span>
                                <button type="button" onClick={() => openCamera('height')} disabled={isProcessingImage} className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-pink-200 transition-all active:scale-95">
                                  <ScanLine className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold">SCAN</span>
                                </button>
                            </label>
                            <div className="relative">
                                <Input 
                                    type="number" step="0.1" placeholder="0.0" required
                                    value={formData.height}
                                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                                    className="pr-12 text-3xl font-extrabold h-16 bg-slate-50 border-0 rounded-2xl text-slate-800 focus:ring-2 focus:ring-pink-500/20"
                                />
                                <Badge variant="neutral" className="absolute right-4 top-1/2 -translate-y-1/2 font-bold bg-white border-0 shadow-sm">cm</Badge>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* --- LINGKAR KEPALA (STYLISH) --- */}
                <Card className="bg-white border-slate-100 shadow-sm rounded-3xl p-5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Brain className="w-4 h-4 text-purple-500" />
                        Lingkar Kepala (Opsional)
                    </label>
                    <div className="relative">
                        <Input 
                            type="number" step="0.1" placeholder="0.0"
                            value={formData.headCircumference}
                            onChange={(e) => setFormData({...formData, headCircumference: e.target.value})}
                            className="pr-12 h-14 text-xl font-bold bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/10"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-300">CM</span>
                    </div>
                </Card>

                {/* --- ACTION BUTTON --- */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200 md:static md:bg-transparent md:border-0 md:p-0 z-30">
                    <div className="max-w-2xl mx-auto">
                        <Button 
                            type="submit" 
                            className="w-full h-16 text-lg font-bold shadow-2xl shadow-teal-500/30 bg-teal-600 hover:bg-teal-700 text-white rounded-3xl transition-all active:scale-[0.97]" 
                            isLoading={isSubmitting}
                        >
                            <Save className="mr-2 h-6 w-6" />
                            Simpan & Analisis AI
                        </Button>
                    </div>
                </div>
            </form>
        </div>

        {/* --- CAMERA OVERLAY (FULL SCREEN) --- */}
        {isCameraOpen && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
             <div className="p-6 pt-12 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent absolute top-0 w-full z-10">
                <div className="text-white">
                   <p className="text-[10px] font-bold text-teal-400 uppercase tracking-[0.2em] mb-1">Smart Vision AI</p>
                   <p className="text-lg font-bold">Membaca Angka {scanTarget === 'weight' ? 'BB' : 'TB'}</p>
                </div>
                <button onClick={closeCamera} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white backdrop-blur-md transition-all">
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
                
                {/* Scanning Frame */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                   <div className="w-72 h-32 border-2 border-teal-400/80 rounded-3xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-teal-400 rounded-tl-xl"></div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-teal-400 rounded-tr-xl"></div>
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-teal-400 rounded-bl-xl"></div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-teal-400 rounded-br-xl"></div>
                      
                      <div className="absolute top-0 left-0 w-full h-1 bg-teal-400/40 animate-scan-line"></div>

                      <p className="absolute -bottom-10 w-full text-center text-white text-xs font-bold bg-teal-600/80 py-1 px-3 rounded-full shadow-lg backdrop-blur-md">
                         Posisikan angka di tengah kotak
                      </p>
                   </div>
                </div>
             </div>

             <div className="p-10 pb-16 bg-black flex justify-center items-center">
                <button 
                  onClick={captureAndScan}
                  className="w-24 h-24 rounded-full border-8 border-white/20 flex items-center justify-center hover:scale-110 transition-all active:scale-95"
                >
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-white/30">
                     <Camera className="w-8 h-8 text-teal-900" />
                   </div>
                </button>
             </div>
             
             <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* --- AI PROCESSING OVERLAY --- */}
        {isProcessingImage && (
          <div className="fixed inset-0 z-[110] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
             <div className="relative">
                <div className="w-24 h-24 bg-teal-50 rounded-[2.5rem] flex items-center justify-center mb-6">
                    <RefreshCw className="w-10 h-10 text-teal-600 animate-spin" />
                </div>
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-2 rounded-full animate-bounce">
                    <Brain className="w-4 h-4" />
                </div>
             </div>
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">Menganalisis Angka</h3>
             <p className="text-slate-500 text-sm mt-1 font-medium">SAESTU AI sedang membaca foto Anda...</p>
          </div>
        )}

        <Toast 
            message={toast.message} type={toast.type} 
            isVisible={toast.isVisible} onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
        />
    </div>
  );
}