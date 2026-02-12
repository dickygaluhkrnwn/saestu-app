"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc, query, collection, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Child, Measurement } from "@/types/schema";
import { getMeasurementsByChild } from "@/lib/services/measurements";
import { deleteChild } from "@/lib/services/children"; 
import { calculateAgeInMonths } from "@/lib/who-standards";
import ChildMedicalHistory from "@/components/medical/ChildMedicalHistory";
import { 
  ArrowLeft, 
  Baby, 
  Calendar, 
  User,
  Trash2,
  Edit2,
  AlertCircle,
  FileText,
  Activity,
  Info,
  MapPin,
  Scale
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
  
  // --- STATE DATA ---
  const [child, setChild] = useState<Child | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATE UI ---
  const [activeTab, setActiveTab] = useState<"medical" | "details">("medical");

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

  // Helper Date Safety
  const ensureDate = (date: any): Date => {
    if (date instanceof Date) return date;
    if (date && typeof date.toDate === 'function') return date.toDate();
    return new Date(date);
  };

  const initData = async () => {
    if (!params.id) return;
    try {
      const childRef = doc(db, "children", params.id as string);
      const childSnap = await getDoc(childRef);
      
      if (childSnap.exists()) {
        const childData = { 
          id: childSnap.id, 
          ...childSnap.data(),
          dob: ensureDate(childSnap.data().dob)
        } as Child;
        setChild(childData);

        const history = await getMeasurementsByChild(childData.id);
        setMeasurements(history);
      }
    } catch (err) {
      console.error(err);
      showToast("Gagal memuat rekam medis.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, [params.id]);

  // --- SINKRONISASI DATA TERAKHIR KE DOKUMEN ANAK ---
  const syncChildLastStatus = async (childId: string) => {
    const mRef = collection(db, "measurements");
    const q = query(mRef, where("childId", "==", childId), orderBy("date", "desc"), limit(1));
    const snap = await getDocs(q);
    
    const childRef = doc(db, "children", childId);
    if (!snap.empty) {
      const last = snap.docs[0].data() as Measurement;
      await updateDoc(childRef, {
        lastWeight: last.weight,
        lastHeight: last.height,
        lastWeightStatus: last.weightStatus,
        lastLengthStatus: last.lengthStatus,
        lastMeasurementDate: last.date
      });
    } else {
      await updateDoc(childRef, {
        lastWeight: null,
        lastHeight: null,
        lastWeightStatus: "unknown",
        lastLengthStatus: "unknown",
        lastMeasurementDate: null
      });
    }
  };

  // --- HANDLER HAPUS DATA ANAK ---
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
    const dobDate = ensureDate(child.dob);
    const dobString = dobDate.toISOString().split('T')[0];

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
        name: editFormData.name, 
        nik: editFormData.nik, 
        pob: editFormData.pob,
        dob: updatedDob, 
        parentName: editFormData.parentName
      };

      await updateDoc(childRef, updatePayload);
      setChild({ ...child, ...updatePayload });
      setIsEditModalOpen(false);
      showToast("Biodata berhasil diperbarui! ✅", "success");
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
        showToast("Riwayat pengukuran dihapus.", "success");
        await syncChildLastStatus(params.id as string);
        initData(); 
      } catch (error) {
        showToast("Gagal menghapus riwayat.", "error");
      }
    }
  };

  // --- HANDLER EDIT MEASUREMENT ---
  const handleOpenEditMeasurement = (m: Measurement) => {
    const d = ensureDate(m.date);
    const dateString = d.toISOString().split('T')[0];
    
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

      setIsMeasurementModalOpen(false);
      showToast("Koreksi data berhasil disimpan! ✅", "success");
      await syncChildLastStatus(params.id as string);
      initData(); 
    } catch (error) {
      showToast("Gagal mengoreksi data.", "error");
    } finally {
      setIsSavingMeasurement(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Sinkronisasi Data...</p>
      </div>
    </div>
  );

  if (!child) return <div className="p-8 text-center text-slate-500 font-medium">Rekam medis tidak ditemukan.</div>;

  const currentAge = calculateAgeInMonths(ensureDate(child.dob));

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      
      {/* HEADER NAVIGASI */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()} 
            className="p-2.5 rounded-2xl bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-600 transition-all"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-extrabold text-lg text-slate-800 leading-tight">Rekam Medis</h1>
            <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest flex items-center gap-1">
               <Info className="w-3 h-3" /> Panel Kader Digital
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        
        {/* PROFILE HEADER CARD */}
        <Card className="bg-white overflow-hidden relative border-slate-100 shadow-sm p-6 rounded-[2rem]">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Baby className="w-32 h-32 text-teal-900" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 text-center md:text-left">
            <div className={cn(
              "w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-slate-200",
              child.gender === 'L' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-pink-600'
            )}>
              {child.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-black text-slate-900 truncate tracking-tight uppercase">{child.name}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge variant="neutral" className="bg-slate-50 text-slate-500 border-slate-100 py-1 rounded-xl font-bold">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-teal-500" /> {currentAge} Bulan
                </Badge>
                <Badge variant="neutral" className="bg-slate-50 text-slate-500 border-slate-100 py-1 rounded-xl font-bold">
                  <User className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> {child.parentName}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
               <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOpenEdit}
                className="rounded-2xl border-slate-200 bg-white hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-all font-bold px-5"
               >
                 <Edit2 className="w-4 h-4 mr-2" /> Edit Biodata
               </Button>
            </div>
          </div>
        </Card>

        {/* TABS UTAMA */}
        <div className="flex p-1.5 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm">
           <button 
            onClick={() => setActiveTab("medical")}
            className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-[1rem] text-sm font-bold transition-all duration-300",
                activeTab === "medical" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
            )}
           >
              <Activity className="w-4 h-4" /> Medis & Grafik
           </button>
           <button 
            onClick={() => setActiveTab("details")}
            className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-[1rem] text-sm font-bold transition-all duration-300",
                activeTab === "details" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
            )}
           >
              <FileText className="w-4 h-4" /> Detail Biodata
           </button>
        </div>

        {/* MEDICAL HISTORY TAB */}
        {activeTab === "medical" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ChildMedicalHistory 
                child={child}
                measurements={measurements}
                onAddMeasurement={() => router.push(`/posyandu/children/${child.id}/measure`)}
                onEditMeasurement={handleOpenEditMeasurement}
                onDeleteMeasurement={handleDeleteMeasurement}
            />
          </div>
        )}

        {/* DETAILS TAB */}
        {activeTab === "details" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="p-8 space-y-8 rounded-[2rem] border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                   <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl shadow-sm shadow-teal-100"><Info className="w-6 h-6" /></div>
                   <div>
                      <h3 className="font-bold text-slate-800 text-lg">Informasi Identitas</h3>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Data kependudukan & kelahiran</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <InfoItem label="NIK Anak" value={child.nik || "Tidak tersedia"} icon={FileText} />
                    <InfoItem label="Tempat Lahir" value={child.pob || "Tidak tersedia"} icon={MapPin} />
                    <InfoItem label="Tanggal Lahir" value={ensureDate(child.dob).toLocaleDateString('id-ID', { dateStyle: 'full' })} icon={Calendar} />
                    <InfoItem label="Nama Orang Tua" value={child.parentName} icon={User} />
                    <InfoItem label="Berat Lahir" value={`${child.initialWeight} kg`} icon={Scale} />
                    <InfoItem label="Panjang Lahir" value={`${child.initialHeight} cm`} icon={Activity} />
                </div>

                <div className="mt-8 pt-8 border-t border-rose-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-rose-50/30 p-8 rounded-[2rem]">
                    <div className="space-y-1">
                        <p className="text-sm font-black text-rose-800 flex items-center gap-2 uppercase tracking-widest">
                           <AlertCircle className="w-5 h-5" /> Zona Berbahaya
                        </p>
                        <p className="text-xs text-rose-600/80 font-medium leading-relaxed max-w-sm">Tindakan ini akan menghapus seluruh data rekam medis secara permanen.</p>
                    </div>
                    <Button 
                        variant="danger" 
                        onClick={handleDeleteChild}
                        className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white border-0 font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-rose-200 transition-all hover:scale-105 active:scale-95"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Hapus Rekam Medis
                    </Button>
                </div>
            </Card>
          </div>
        )}
      </div>

      {/* --- MODAL EDIT BIODATA --- */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Biodata Anak">
        <form onSubmit={handleEditSubmit} className="space-y-5 p-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
            <Input required value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="rounded-xl border-slate-200 focus:ring-2 focus:ring-teal-500/20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">NIK</label>
                <Input value={editFormData.nik} onChange={(e) => setEditFormData({...editFormData, nik: e.target.value})} className="rounded-xl border-slate-200" />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tgl Lahir</label>
                {/* FIX: Menggunakan setEditFormData (State setter yang benar) */}
                <Input type="date" required value={editFormData.dob} onChange={(e) => setEditFormData({...editFormData, dob: e.target.value})} className="rounded-xl border-slate-200" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tempat Lahir</label>
            <Input value={editFormData.pob} onChange={(e) => setEditFormData({...editFormData, pob: e.target.value})} className="rounded-xl border-slate-200" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Orang Tua</label>
            <Input required value={editFormData.parentName} onChange={(e) => setEditFormData({...editFormData, parentName: e.target.value})} className="rounded-xl border-slate-200" />
          </div>
          <div className="pt-4 flex gap-3 border-t border-slate-50 mt-4">
            <Button type="button" variant="ghost" className="flex-1 rounded-xl" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={isEditing} className="flex-1 bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-100">Simpan Perubahan</Button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL KOREKSI MEASUREMENT --- */}
      <Modal isOpen={isMeasurementModalOpen} onClose={() => setIsMeasurementModalOpen(false)} title="Koreksi Data Pengukuran">
        <form onSubmit={handleMeasurementEditSubmit} className="space-y-5 p-4">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4 mb-2">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 font-bold uppercase leading-relaxed">
              Peringatan: Perubahan angka akan memicu perhitungan ulang status gizi dan tren kurva pertumbuhan secara otomatis.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tanggal Kunjungan</label>
            <Input type="date" required value={measurementFormData.date} onChange={(e) => setMeasurementFormData({...measurementFormData, date: e.target.value})} className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 text-blue-600">Berat (kg)</label>
                <Input type="number" step="0.01" required value={measurementFormData.weight} onChange={(e) => setMeasurementFormData({...measurementFormData, weight: e.target.value})} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 text-pink-600">Tinggi (cm)</label>
                <Input type="number" step="0.1" required value={measurementFormData.height} onChange={(e) => setMeasurementFormData({...measurementFormData, height: e.target.value})} className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Catatan Tambahan</label>
            <Input value={measurementFormData.notes} onChange={(e) => setMeasurementFormData({...measurementFormData, notes: e.target.value})} className="rounded-xl" />
          </div>
          <div className="pt-4 flex gap-3 border-t border-slate-50 mt-4">
            <Button type="button" variant="ghost" className="flex-1 rounded-xl" onClick={() => setIsMeasurementModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={isSavingMeasurement} className="flex-1 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100">Perbarui Angka</Button>
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

function InfoItem({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
    return (
        <div className="flex items-start gap-4 group">
            <div className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100 group-hover:text-teal-500 group-hover:bg-teal-50 transition-colors">
                <Icon className="w-4 h-4" />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
                <p className="text-sm font-extrabold text-slate-800 leading-tight uppercase">{value}</p>
            </div>
        </div>
    )
}
