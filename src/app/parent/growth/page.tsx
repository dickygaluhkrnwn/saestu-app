"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Child, Measurement } from "@/types/schema";
import { getMeasurementsByChild } from "@/lib/services/measurements";
import ChildMedicalHistory from "@/components/medical/ChildMedicalHistory";
import { TrendingUp, Activity, Info, Baby } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function ParentGrowthPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userProfile?.uid) return;
      try {
        const childQ = query(
          collection(db, "children"), 
          where("parentId", "==", userProfile.uid),
          limit(1)
        );
        const childSnap = await getDocs(childQ);
        
        if (!childSnap.empty) {
          const childData = { id: childSnap.docs[0].id, ...childSnap.docs[0].data() } as Child;
          setChild(childData);

          const history = await getMeasurementsByChild(childData.id);
          setMeasurements(history);
        }
      } catch (error) {
        console.error("Gagal memuat data pertumbuhan:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchData();
  }, [userProfile, authLoading]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 font-sans">
      <header className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="text-emerald-600 w-7 h-7" /> Pantau Tumbuh Kembang
        </h1>
        <p className="text-sm text-slate-500 font-medium">Buku KIA Digital & Grafik Pertumbuhan WHO.</p>
      </header>

      {!child ? (
        <Card className="p-10 border-dashed border-2 text-center rounded-[2.5rem]">
           <Baby className="w-12 h-12 text-slate-300 mx-auto mb-4" />
           <p className="text-slate-500 font-bold">Data anak belum terhubung.</p>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ChildMedicalHistory 
            child={child}
            measurements={measurements}
            readOnly={true} // Orang tua hanya bisa melihat, tidak bisa edit data medis
          />
          
          <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 flex gap-4">
            <Info className="w-6 h-6 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              Data di atas diinput secara resmi oleh Kader Posyandu. Jika terdapat kekeliruan angka, silakan konfirmasi saat jadwal Posyandu berikutnya.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}