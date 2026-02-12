"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"; // Tambahkan deleteDoc
import { db } from "@/lib/firebase";
import { Child, Measurement } from "@/types/schema";
import { getMeasurementsByChild } from "@/lib/services/measurements";
import { deleteChild } from "@/lib/services/children"; 
import { calculateAgeInMonths } from "@/lib/who-standards";
import GrowthChart from "@/components/charts/GrowthChart";
import { 
  ArrowLeft, 
  Ruler, 
  Weight, 
  Activity, 
  Plus, 
  Calendar, 
  Baby, 
  History, 
  FileText,
  TrendingUp,
  AlertCircle,
  User,
  Trash2,
  Edit2
} from "lucide-react";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal"; 
import { Input } from "@/components/ui/Input"; 
import { Toast, ToastType } from "@/components/ui/Toast"; 

export default function ChildDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // State Data
  const [child, setChild] = useState<Child | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  // State UI
  const [activeTab, setActiveTab] = useState<"chart" | "history" | "details">("chart");
  const [chartType, setChartType] = useState<"weight" | "length">("weight");

  // Edit Biodata State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "", nik: "", pob: "", dob: "", parentName: "",
  });

  // Edit/Delete Measurement State
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [isSavingMeasurement, setIsSavingMeasurement] = useState(false);
  const [measurementFormData, setMeasurementFormData] = useState({
    id: "", date: "", weight: "", height: "", notes: ""
  });

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "", type: "success", isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  useEffect(() => {
    const init = async () => {
      if (!params.id) return;
      try {
        const childRef = doc(db, "children", params.id as string);
        const childSnap = await getDoc(childRef);
        
        if (childSnap.exists()) {
          const childData = { 
            id: childSnap.id, 
            ...childSnap.data(),
            dob: childSnap.data().dob.toDate()
          } as Child;
          setChild(childData);

          const history = await getMeasurementsByChild(childData.id);
          setMeasurements(history);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [params.id]);

  // --- HANDLER HAPUS DATA ANAK (BIODATA) ---
  const handleDeleteChild = async () => {
    if (!child) return;
    if (confirm(`PERINGATAN: Anda yakin ingin menghapus seluruh data rekam medis ${child.name}? Tindakan ini tidak bisa dibatalkan.`)) {
      try {
        await deleteChild(child.id);
        router.replace("/posyandu/children");
      } catch (err) {
        console.error(err);
        showToast("Terjadi kesalahan saat menghapus data anak.", "error");
      }
    }
  };

  // --- HANDLER EDIT BIODATA ---
  const handleOpenEdit = () => {
    if (!child) return;
    const dobDate = child.dob instanceof Date ? child.dob : new Date();
    const offset = dobDate.getTimezoneOffset();
    const localDate = new Date(dobDate.getTime() - (offset*60*1000));
    const dobString = localDate.toISOString().split('T')[0];

    setEditFormData({
      name: child.name, nik: child.nik || "", pob: child.pob || "",
      dob: dobString, parentName: child.parentName || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!child) return;
    setIsEditing(true);

    try {
      const childRef = doc(db, "children", child.id);
      const updatedDob = new Date(editFormData.dob);
      const updatePayload = {
        name: editFormData.name, nik: editFormData.nik, pob: editFormData.pob,
        dob: updatedDob, parentName: editFormData.parentName
      };

      await updateDoc(childRef, updatePayload);
      setChild({ ...child, ...updatePayload });
      setIsEditModalOpen(false);
      showToast("Biodata berhasil diperbarui!", "success");
    } catch (error) {
      showToast("Gagal memperbarui biodata.", "error");
    } finally {
      setIsEditing(false);
    }
  };

  // --- HANDLER HAPUS MEASUREMENT ---
  const handleDeleteMeasurement = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus riwayat pengukuran ini?")) {
      try {
        await deleteDoc(doc(db, "measurements", id));
        setMeasurements(measurements.filter(m => m.id !== id));
        showToast("Riwayat pengukuran berhasil dihapus.", "success");
      } catch (error) {
        showToast("Gagal menghapus riwayat pengukuran.", "error");
      }
    }
  };

  // --- HANDLER EDIT MEASUREMENT ---
  const handleOpenEditMeasurement = (m: Measurement) => {
    let dateString = "";
    if (m.date instanceof Date) {
      const offset = m.date.getTimezoneOffset();
      const localDate = new Date(m.date.getTime() - (offset*60*1000));
      dateString = localDate.toISOString().split('T')[0];
    }
    
    setMeasurementFormData({
      id: m.id,
      date: dateString,
      weight: m.weight.toString(),
      height: m.height.toString(),
      notes: m.notes || ""
    });
    setIsMeasurementModalOpen(true);
  };

  const handleMeasurementEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMeasurement(true);
    try {
      const mRef = doc(db, "measurements", measurementFormData.id);
      const updatedDate = new Date(measurementFormData.date);
      const updatedWeight = parseFloat(measurementFormData.weight);
      const updatedHeight = parseFloat(measurementFormData.height);

      await updateDoc(mRef, {
        date: updatedDate,
        weight: updatedWeight,
        height: updatedHeight,
        notes: measurementFormData.notes
      });

      // Update Local State
      setMeasurements(measurements.map(m => {
        if (m.id === measurementFormData.id) {
          return { ...m, date: updatedDate, weight: updatedWeight, height: updatedHeight, notes: measurementFormData.notes };
        }
        return m;
      }));

      setIsMeasurementModalOpen(false);
      showToast("Riwayat pengukuran berhasil dikoreksi!", "success");
    } catch (error) {
      showToast("Gagal mengoreksi riwayat pengukuran.", "error");
    } finally {
      setIsSavingMeasurement(false);
    }
  };

  // Helper status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'adequate': return 'success';
      case 'inadequate': return 'danger';
      case 'excess': return 'warning';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'adequate': return 'Naik Bagus';
      case 'inadequate': return 'Kurang';
      case 'excess': return 'Berlebih';
      default: return 'Data Awal';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium">Memuat Rekam Medis...</p>
      </div>
    </div>
  );

  if (!child) return <div className="p-8 text-center text-slate-500">Data anak tidak ditemukan.</div>;

  const currentAge = calculateAgeInMonths(child.dob as Date);
  const lastMeasurement = measurements.length > 0 ? measurements[0] : null;

  return (
    <div className="bg-background min-h-screen pb-24 md:pb-10 font-sans">
      
      {/* --- 1. HEADER NAVIGASI --- */}
      <div className="bg-surface sticky top-0 z-20 border-b border-slate-100 px-4 py-3 shadow-sm md:rounded-b-2xl md:mx-4 md:mt-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-slate-800 leading-tight">Rekam Medis</h1>
            <p className="text-xs text-slate-500">ID: {child.id.substring(0,8)}...</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        
        {/* --- 2. PROFILE HEADER CARD --- */}
        <Card className="bg-white overflow-hidden relative border-0 shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Baby className="w-32 h-32 text-primary" />
          </div>
          
          <div className="flex items-start gap-5 relative z-10">
            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg",
              child.gender === 'L' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-pink-500 to-pink-600'
            )}>
              {child.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900 truncate">{child.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="neutral" className="bg-slate-100 text-slate-600 border-0">
                  <Calendar className="w-3 h-3 mr-1" />
                  {currentAge} Bulan
                </Badge>
                <Badge 
                    variant={child.gender === 'L' ? 'default' : 'danger'} 
                    className={cn("border-0", child.gender === 'L' ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600")}
                >
                  {child.gender === 'L' ? "Laki-laki" : "Perempuan"}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Ortu: <span className="font-medium text-slate-700">{child.parentName}</span>
              </p>
            </div>
          </div>
        </Card>

        {/* --- 3. TAB NAVIGATION --- */}
        <div className="flex p-1 bg-white rounded-[1rem] border border-slate-100 shadow-sm overflow-x-auto">
          {[
            { id: "chart", label: "Grafik & Analisis", icon: Activity },
            { id: "history", label: "Riwayat Ukur", icon: History },
            { id: "details", label: "Biodata", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-md shadow-teal-200/50" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- 4. CONTENT AREA --- */}
        
        {/* === TAB 1: GRAFIK === */}
        {activeTab === "chart" && (
          <div className="space-y-6 animate-fade-in">
            {lastMeasurement ? (
               <Card className="bg-gradient-to-r from-teal-50 to-white border-teal-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Status Terakhir</p>
                      <h3 className="text-lg font-bold text-slate-800">
                        {lastMeasurement.date instanceof Date ? lastMeasurement.date.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric'}) : "-"}
                      </h3>
                    </div>
                    <Badge variant={getStatusVariant(lastMeasurement.weightStatus)}>
                      {lastMeasurement.weightStatus === 'adequate' ? "Tumbuh Normal ✅" : 
                       lastMeasurement.weightStatus === 'inadequate' ? "Perlu Perhatian ⚠️" : "Risiko Lebih ⚠️"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Weight className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Berat Badan</p>
                        <p className="text-base font-bold text-slate-800">{lastMeasurement.weight} kg</p>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                        <Ruler className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Tinggi Badan</p>
                        <p className="text-base font-bold text-slate-800">{lastMeasurement.height} cm</p>
                      </div>
                    </div>
                  </div>
               </Card>
            ) : (
              <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm flex items-center gap-2 border border-amber-100">
                <AlertCircle className="w-5 h-5" />
                Belum ada data pengukuran. Silakan input data pertama.
              </div>
            )}

            <Card>
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <h3 className="font-bold text-slate-800">Kurva Pertumbuhan</h3>
                    <p className="text-xs text-slate-400">Standar WHO 2006</p>
                 </div>
                 <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setChartType('weight')}
                      className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                        chartType === 'weight' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Berat
                    </button>
                    <button
                      onClick={() => setChartType('length')}
                      className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                        chartType === 'length' ? "bg-white shadow-sm text-pink-600" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Tinggi
                    </button>
                 </div>
              </div>
              
              <GrowthChart 
                measurements={measurements} 
                gender={child.gender} 
                type={chartType} 
              />
            </Card>

            <Button
              onClick={() => router.push(`/posyandu/children/${child.id}/measure`)} 
              className="w-full h-14 text-base shadow-lg shadow-teal-200/50"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Input Pengukuran Baru
            </Button>
          </div>
        )}

        {/* === TAB 2: RIWAYAT === */}
        {activeTab === "history" && (
          <div className="space-y-4 animate-fade-in">
             <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800">Riwayat Kunjungan</h3>
                <span className="text-xs font-medium text-slate-500">{measurements.length} Data</span>
             </div>

             {measurements.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                   <p className="text-slate-400 text-sm">Belum ada riwayat pengukuran.</p>
                </div>
             ) : (
               measurements.map((m) => (
                  <Card key={m.id} hoverable className="relative overflow-hidden group">
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-1.5 transition-colors",
                      m.weightStatus === 'adequate' ? 'bg-emerald-500' : 
                      m.weightStatus === 'inadequate' ? 'bg-rose-500' : 'bg-amber-400'
                    )} />

                    <div className="pl-3 flex flex-col gap-3">
                       <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {m.date instanceof Date ? m.date.toLocaleDateString("id-ID", { dateStyle: 'long' }) : "-"}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">Usia: {m.ageInMonths} Bulan</p>
                          </div>
                          
                          {/* --- ACTION BUTTONS (EDIT & DELETE) --- */}
                          <div className="flex items-center gap-1">
                             <Badge variant={getStatusVariant(m.weightStatus)} className="mr-2 hidden sm:inline-flex">
                               {getStatusLabel(m.weightStatus)}
                             </Badge>
                             <button 
                                onClick={() => handleOpenEditMeasurement(m)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Koreksi Data"
                             >
                                <Edit2 className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => handleDeleteMeasurement(m.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                title="Hapus Data"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </div>

                       <div className="flex items-center gap-6">
                          <div>
                             <p className="text-[10px] text-slate-400 uppercase tracking-wider">Berat</p>
                             <p className="text-lg font-bold text-slate-800">{m.weight} <span className="text-xs font-normal text-slate-500">kg</span></p>
                             {m.weightIncrement !== undefined && (
                               <p className={cn("text-[10px] flex items-center", m.weightIncrement > 0 ? "text-emerald-600" : "text-rose-600")}>
                                 <TrendingUp className="w-3 h-3 mr-0.5" /> 
                                 {m.weightIncrement > 0 ? "+" : ""}{m.weightIncrement}g
                               </p>
                             )}
                          </div>
                          <div className="w-px h-8 bg-slate-100"></div>
                          <div>
                             <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tinggi</p>
                             <p className="text-lg font-bold text-slate-800">{m.height} <span className="text-xs font-normal text-slate-500">cm</span></p>
                          </div>
                       </div>

                       {m.notes && (
                         <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                              "{m.notes}"
                            </p>
                         </div>
                       )}
                    </div>
                  </Card>
               ))
             )}
          </div>
        )}

        {/* === TAB 3: DETAIL BIODATA & ZONA BAHAYA === */}
        {activeTab === "details" && (
           <Card className="space-y-4 animate-fade-in pb-2">
              
              {/* Header Info Balita + Tombol Edit */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800">Informasi Balita</h3>
                <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={handleOpenEdit} 
                   className="h-8 text-xs bg-slate-50 hover:bg-slate-100 border-slate-200"
                >
                   <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit Biodata
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">NIK Anak</p>
                    <p className="font-medium text-slate-800">{child.nik || "-"}</p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Tanggal Lahir</p>
                    <p className="font-medium text-slate-800">
                      {child.dob instanceof Date ? child.dob.toLocaleDateString("id-ID", { dateStyle: 'full' }) : "-"}
                    </p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Berat Lahir</p>
                    <p className="font-medium text-slate-800">{child.initialWeight} kg</p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Panjang Lahir</p>
                    <p className="font-medium text-slate-800">{child.initialHeight} cm</p>
                 </div>
              </div>

              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 pt-4">Informasi Orang Tua</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Nama Ibu/Ayah</p>
                    <p className="font-medium text-slate-800">{child.parentName}</p>
                 </div>
              </div>

              {/* ACTION: DELETE (Danger Zone) */}
              <div className="mt-8 pt-6 border-t border-rose-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-rose-50/50 p-4 rounded-xl">
                 <div>
                    <p className="text-sm font-bold text-rose-800">Zona Berbahaya</p>
                    <p className="text-xs text-rose-600/80">Menghapus data akan menghilangkan seluruh riwayat rekam medis anak secara permanen.</p>
                 </div>
                 <Button 
                    variant="danger" 
                    onClick={handleDeleteChild} 
                    className="w-full md:w-auto whitespace-nowrap bg-rose-600 hover:bg-rose-700 text-white border-0"
                 >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Data Anak
                 </Button>
              </div>
           </Card>
        )}

      </div>

      {/* --- MODAL EDIT BIODATA --- */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Biodata Anak"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
           <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Nama Lengkap</label>
              <Input 
                required 
                value={editFormData.name} 
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} 
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                 <label className="text-xs font-bold text-slate-500 uppercase">NIK</label>
                 <Input 
                    value={editFormData.nik} 
                    onChange={(e) => setEditFormData({...editFormData, nik: e.target.value})} 
                 />
              </div>
              <div className="space-y-1.5">
                 <label className="text-xs font-bold text-slate-500 uppercase">Tanggal Lahir</label>
                 <Input 
                    type="date" 
                    required 
                    value={editFormData.dob} 
                    onChange={(e) => setEditFormData({...editFormData, dob: e.target.value})} 
                 />
              </div>
           </div>

           <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Tempat Lahir</label>
              <Input 
                 value={editFormData.pob} 
                 onChange={(e) => setEditFormData({...editFormData, pob: e.target.value})} 
              />
           </div>

           <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Nama Orang Tua</label>
              <Input 
                 required 
                 value={editFormData.parentName} 
                 onChange={(e) => setEditFormData({...editFormData, parentName: e.target.value})} 
              />
           </div>

           <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
             <Button type="submit" isLoading={isEditing} className="bg-primary hover:bg-primary-hover">
                Simpan Perubahan
             </Button>
           </div>
        </form>
      </Modal>

      {/* --- MODAL EDIT MEASUREMENT --- */}
      <Modal 
        isOpen={isMeasurementModalOpen} 
        onClose={() => setIsMeasurementModalOpen(false)}
        title="Koreksi Data Pengukuran"
      >
        <form onSubmit={handleMeasurementEditSubmit} className="space-y-4">
           
           <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                 Mengoreksi berat atau tinggi di sini hanya akan mengubah angka. Status kurva gizi (Naik Bagus/Kurang) tidak akan dihitung ulang secara otomatis.
              </p>
           </div>

           <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Tanggal Kunjungan</label>
              <Input 
                type="date"
                required 
                value={measurementFormData.date} 
                onChange={(e) => setMeasurementFormData({...measurementFormData, date: e.target.value})} 
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                 <label className="text-xs font-bold text-slate-500 uppercase">Berat (kg)</label>
                 <Input 
                    type="number" step="0.01"
                    required
                    value={measurementFormData.weight} 
                    onChange={(e) => setMeasurementFormData({...measurementFormData, weight: e.target.value})} 
                 />
              </div>
              <div className="space-y-1.5">
                 <label className="text-xs font-bold text-slate-500 uppercase">Tinggi (cm)</label>
                 <Input 
                    type="number" step="0.1"
                    required 
                    value={measurementFormData.height} 
                    onChange={(e) => setMeasurementFormData({...measurementFormData, height: e.target.value})} 
                 />
              </div>
           </div>

           <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Catatan Tambahan (Opsional)</label>
              <Input 
                 value={measurementFormData.notes} 
                 onChange={(e) => setMeasurementFormData({...measurementFormData, notes: e.target.value})} 
              />
           </div>

           <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => setIsMeasurementModalOpen(false)}>Batal</Button>
             <Button type="submit" isLoading={isSavingMeasurement} className="bg-blue-600 hover:bg-blue-700">
                Simpan Koreksi
             </Button>
           </div>
        </form>
      </Modal>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
    </div>
  );
}