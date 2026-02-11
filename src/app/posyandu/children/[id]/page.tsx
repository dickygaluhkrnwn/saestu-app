"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Child, Measurement } from "@/types/schema";
import { getMeasurementsByChild } from "@/lib/services/measurements";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Ruler, Weight, Activity, Plus } from "lucide-react";
import { calculateAgeInMonths } from "@/lib/who-standards"; // Helper sederhana

export default function ChildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [child, setChild] = useState<Child | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!params.id) return;
      try {
        // Ambil Data Anak
        const childRef = doc(db, "children", params.id as string);
        const childSnap = await getDoc(childRef);
        
        if (childSnap.exists()) {
          const childData = { 
            id: childSnap.id, 
            ...childSnap.data(),
            dob: childSnap.data().dob.toDate()
          } as Child;
          setChild(childData);

          // Ambil Riwayat Pengukuran
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

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat profil...</div>;
  if (!child) return <div className="p-8 text-center">Data tidak ditemukan.</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 sticky top-0 z-10 border-b border-slate-200 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-slate-600">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="font-bold text-lg text-slate-800">Profil Balita</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Card Profil */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md ${child.gender === 'L' ? 'bg-blue-500' : 'bg-pink-500'}`}>
            {child.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{child.name}</h2>
            <div className="text-sm text-slate-500 mt-1 space-y-1">
              <p>Usia: <span className="font-medium text-slate-700">{calculateAgeInMonths(child.dob as Date)} Bulan</span></p>
              <p>Ortu: {child.parentName}</p>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <Button 
          className="w-full h-12 text-lg shadow-blue-200 shadow-lg" 
          onClick={() => router.push(`/posyandu/children/${child.id}/measure`)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Input Pengukuran Baru
        </Button>

        {/* Riwayat Pengukuran */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Riwayat Pertumbuhan
          </h3>
          
          {measurements.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
              Belum ada data pengukuran.
            </div>
          ) : (
            measurements.map((m) => (
              <div key={m.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                {/* Status Indicator Strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  m.weightStatus === 'adequate' ? 'bg-green-500' : 
                  m.weightStatus === 'inadequate' ? 'bg-red-500' : 'bg-yellow-400'
                }`} />
                
                <div className="pl-3 flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-400 mb-1">
                      {m.date instanceof Date ? m.date.toLocaleDateString("id-ID", { dateStyle: 'full' }) : "Tanggal Invalid"}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <Weight className="h-4 w-4 text-slate-400" />
                        <span className="font-bold text-lg">{m.weight} <span className="text-xs font-normal">kg</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-slate-400" />
                        <span className="font-bold text-lg">{m.height} <span className="text-xs font-normal">cm</span></span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Badge Status */}
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    m.weightStatus === 'adequate' ? 'bg-green-100 text-green-700' : 
                    m.weightStatus === 'inadequate' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {m.weightStatus === 'adequate' ? 'Naik Bagus' : 
                     m.weightStatus === 'inadequate' ? 'Kurang' : 'Data Awal'}
                  </div>
                </div>
                
                {m.notes && (
                   <p className="pl-3 mt-3 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                     Output: {m.notes}
                   </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}