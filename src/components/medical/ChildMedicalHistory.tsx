'use client';

import React, { useState } from 'react';
import { Child, Measurement } from '@/types/schema';
import GrowthChart from '@/components/charts/GrowthChart';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { 
  Weight, 
  Ruler, 
  Activity, 
  History, 
  Plus, 
  TrendingUp, 
  AlertCircle,
  Edit2,
  Trash2,
  Calendar
} from 'lucide-react';

interface ChildMedicalHistoryProps {
  child: Child;
  measurements: Measurement[];
  readOnly?: boolean;
  onEditMeasurement?: (m: Measurement) => void;
  onDeleteMeasurement?: (id: string) => void;
  onAddMeasurement?: () => void;
}

export default function ChildMedicalHistory({
  child,
  measurements,
  readOnly = false,
  onEditMeasurement,
  onDeleteMeasurement,
  onAddMeasurement
}: ChildMedicalHistoryProps) {
  const [activeTab, setActiveTab] = useState<'chart' | 'history'>('chart');
  const [chartType, setChartType] = useState<'weight' | 'length'>('weight');

  // Helper Date Safety
  const ensureDate = (date: any): Date => {
    if (date instanceof Date) return date;
    if (date && typeof date.toDate === 'function') return date.toDate();
    return new Date(date);
  };

  const lastMeasurement = measurements.length > 0 ? measurements[0] : null;

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
      case 'adequate': return 'Normal';
      case 'inadequate': return 'Risiko/Kurang';
      case 'excess': return 'Berlebih';
      default: return 'Data Awal';
    }
  };

  return (
    <div className="space-y-6">
      {/* --- TABS NAVIGATION --- */}
      <div className="flex p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-inner">
        <button
          onClick={() => setActiveTab('chart')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300",
            activeTab === 'chart' 
              ? "bg-white text-emerald-700 shadow-md translate-y-[-1px]" 
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Activity className="w-3.5 h-3.5" />
          Grafik Pertumbuhan
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300",
            activeTab === 'history' 
              ? "bg-white text-emerald-700 shadow-md translate-y-[-1px]" 
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <History className="w-3.5 h-3.5" />
          Log Riwayat
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="min-h-[500px]">
        {activeTab === 'chart' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* 1. Last Status Overview */}
            {lastMeasurement ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-1 p-5 bg-white border-slate-200 shadow-sm flex flex-col justify-between rounded-3xl">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Update Terakhir</p>
                    <h3 className="text-sm font-bold text-slate-700">
                      {ensureDate(lastMeasurement.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric'})}
                    </h3>
                  </div>
                  <div className="mt-4">
                    <Badge variant={getStatusVariant(lastMeasurement.weightStatus)} className="w-full justify-center py-1 rounded-lg text-[10px] font-black uppercase">
                      {getStatusLabel(lastMeasurement.weightStatus)}
                    </Badge>
                  </div>
                </Card>

                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100 flex items-center gap-4">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-2xl shadow-sm">
                      <Weight className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-blue-600/70 font-black uppercase tracking-widest">Berat</p>
                      <p className="text-xl font-black text-slate-800">{lastMeasurement.weight}<span className="text-xs ml-0.5 font-bold text-slate-400">kg</span></p>
                    </div>
                  </div>
                  <div className="bg-pink-50/50 p-4 rounded-3xl border border-pink-100 flex items-center gap-4">
                    <div className="p-2.5 bg-pink-100 text-pink-600 rounded-2xl shadow-sm">
                      <Ruler className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-pink-600/70 font-black uppercase tracking-widest">Tinggi</p>
                      <p className="text-xl font-black text-slate-800">{lastMeasurement.height}<span className="text-xs ml-0.5 font-bold text-slate-400">cm</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold text-sm">Belum ada riwayat pengukuran.</p>
              </div>
            )}

            {/* 2. Main Chart Card */}
            <Card className="p-0 border-slate-200 shadow-sm rounded-[2rem] overflow-visible bg-white">
              <div className="p-6 pb-2 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div>
                    <h3 className="font-black text-slate-800 tracking-tight">Tren Pertumbuhan</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Persentil WHO Standard</p>
                 </div>
                 <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    <button
                      onClick={() => setChartType('weight')}
                      className={cn(
                        "px-4 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase",
                        chartType === 'weight' ? "bg-white shadow-sm text-blue-600" : "text-slate-50"
                      )}
                    >
                      Berat
                    </button>
                    <button
                      onClick={() => setChartType('length')}
                      className={cn(
                        "px-4 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase",
                        chartType === 'length' ? "bg-white shadow-sm text-pink-600" : "text-slate-50"
                      )}
                    >
                      Tinggi
                    </button>
                 </div>
              </div>
              
              {/* PERBAIKAN TATA LETAK:
                1. pb-14: Memberi ruang sangat luas di bawah untuk label bulan.
                2. mt-[-10px]: Menarik chart sedikit ke atas agar lebih rapat ke header card.
                3. h-[450px]: Memberi ruang vertikal yang cukup agar tidak tertekan.
              */}
              <div className="px-2 sm:px-6 pt-2 pb-14 bg-white h-[450px] w-full relative overflow-visible mt-[-10px]">
                <GrowthChart 
                  measurements={measurements} 
                  gender={child.gender} 
                  type={chartType} 
                />
              </div>
            </Card>

            {!readOnly && onAddMeasurement && (
              <Button
                onClick={onAddMeasurement} 
                className="w-full h-16 text-lg shadow-xl shadow-emerald-200/50 bg-emerald-600 hover:bg-emerald-700 border-0 font-black rounded-[2rem] transition-all active:scale-95"
              >
                <Plus className="w-6 h-6 mr-2 stroke-[3px]" />
                Input Timbangan Baru
              </Button>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 pb-20">
             {measurements.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                   <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                   <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Belum ada riwayat</p>
                </div>
             ) : (
               measurements.map((m) => (
                  <Card key={m.id} className="relative overflow-hidden group border-slate-100 hover:border-emerald-200 transition-all rounded-3xl p-0 shadow-sm">
                     <div className={cn(
                       "absolute left-0 top-0 bottom-0 w-1.5 transition-colors",
                       m.weightStatus === 'adequate' ? 'bg-emerald-500' : 
                       m.weightStatus === 'inadequate' ? 'bg-rose-500' : 'bg-amber-400'
                     )} />

                     <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-50 rounded-xl">
                                 <Calendar className="w-4 h-4 text-slate-400" />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-800">
                                   {ensureDate(m.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                 </p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Usia: {m.ageInMonths} Bulan</p>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-2">
                              <Badge variant={getStatusVariant(m.weightStatus)} className="text-[9px] font-black uppercase px-2 py-0.5 border-0">
                                {getStatusLabel(m.weightStatus)}
                              </Badge>
                              
                              {!readOnly && (
                                <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => onEditMeasurement?.(m)}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => onDeleteMeasurement?.(m.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Berat</span>
                              <div className="text-right">
                                <p className="text-sm font-black text-slate-800">{m.weight} kg</p>
                                {m.weightIncrement !== undefined && (
                                  <p className={cn("text-[9px] font-black flex items-center justify-end", m.weightIncrement > 0 ? "text-emerald-600" : "text-rose-600")}>
                                    {m.weightIncrement > 0 ? "+" : ""}{m.weightIncrement}g
                                  </p>
                                )}
                              </div>
                           </div>
                           <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tinggi</span>
                              <p className="text-sm font-black text-slate-800">{m.height} cm</p>
                           </div>
                        </div>
                        
                        {m.notes && (
                          <div className="mt-4 p-3 bg-amber-50/50 rounded-2xl border border-amber-100 flex gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-amber-700 italic leading-relaxed">"{m.notes}"</p>
                          </div>
                        )}
                     </div>
                  </Card>
               ))
             )}
          </div>
        )}
      </div>
    </div>
  );
}