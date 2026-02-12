'use client';

import React, { useState } from 'react';
import { Child, Measurement } from '@/types/schema';
import { calculateAgeInMonths } from '@/lib/who-standards';
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

  // Helper untuk memastikan kita bekerja dengan objek Date (mengatasi isu Timestamp vs Date)
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
      case 'adequate': return 'Naik Bagus';
      case 'inadequate': return 'Kurang';
      case 'excess': return 'Berlebih';
      default: return 'Data Awal';
    }
  };

  return (
    <div className="space-y-6">
      {/* --- TAB NAVIGATION INTERNAL --- */}
      <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
        <button
          onClick={() => setActiveTab('chart')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all",
            activeTab === 'chart' 
              ? "bg-white text-emerald-600 shadow-sm" 
              : "text-slate-400 hover:text-slate-500"
          )}
        >
          <Activity className="w-3.5 h-3.5" />
          Grafik & Analisis
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all",
            activeTab === 'history' 
              ? "bg-white text-emerald-600 shadow-sm" 
              : "text-slate-400 hover:text-slate-500"
          )}
        >
          <History className="w-3.5 h-3.5" />
          Riwayat Pengukuran
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      {activeTab === 'chart' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {lastMeasurement ? (
            <Card className="bg-gradient-to-r from-emerald-50 to-white border-emerald-100 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Status Terakhir</p>
                  <h3 className="text-lg font-bold text-slate-800">
                    {ensureDate(lastMeasurement.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric'})}
                  </h3>
                </div>
                <Badge variant={getStatusVariant(lastMeasurement.weightStatus)}>
                  {getStatusLabel(lastMeasurement.weightStatus)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Weight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Berat Badan</p>
                    <p className="text-base font-bold text-slate-800">{lastMeasurement.weight} kg</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Tinggi Badan</p>
                    <p className="text-base font-bold text-slate-800">{lastMeasurement.height} cm</p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm flex items-center gap-2 border border-amber-100 italic font-medium">
              <AlertCircle className="w-5 h-5" />
              Belum ada data pengukuran. Silakan input data pertama.
            </div>
          )}

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
               <div>
                  <h3 className="font-bold text-slate-800">Kurva Pertumbuhan WHO</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Standar Medis 2006</p>
               </div>
               <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setChartType('weight')}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                      chartType === 'weight' ? "bg-white shadow-sm text-blue-600" : "text-slate-500"
                    )}
                  >
                    Berat
                  </button>
                  <button
                    onClick={() => setChartType('length')}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                      chartType === 'length' ? "bg-white shadow-sm text-pink-600" : "text-slate-500"
                    )}
                  >
                    Tinggi
                  </button>
               </div>
            </div>
            
            <div className="h-[300px]">
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
              className="w-full h-14 text-base shadow-lg shadow-emerald-200/50 bg-emerald-600 hover:bg-emerald-700 border-0 font-bold rounded-2xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Input Pengukuran Baru
            </Button>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
           {measurements.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                 <p className="text-slate-400 text-sm italic">Belum ada riwayat kunjungan.</p>
              </div>
           ) : (
             measurements.map((m) => (
                <Card key={m.id} className="relative overflow-hidden group border-slate-100 hover:border-emerald-100 transition-colors">
                   <div className={cn(
                     "absolute left-0 top-0 bottom-0 w-1 transition-colors",
                     m.weightStatus === 'adequate' ? 'bg-emerald-500' : 
                     m.weightStatus === 'inadequate' ? 'bg-rose-500' : 'bg-amber-400'
                   )} />

                   <div className="pl-3 py-2 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-sm font-bold text-slate-800">
                              {ensureDate(m.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Usia: {m.ageInMonths} Bulan</p>
                         </div>
                         
                         <div className="flex items-center gap-1">
                            <Badge variant={getStatusVariant(m.weightStatus)} className="mr-2 text-[9px] font-bold">
                              {getStatusLabel(m.weightStatus)}
                            </Badge>
                            
                            {!readOnly && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                                <button 
                                  onClick={() => onEditMeasurement?.(m)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => onDeleteMeasurement?.(m.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                         </div>
                      </div>

                      <div className="flex items-center gap-6 pb-2">
                         <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Berat</p>
                            <p className="text-base font-bold text-slate-800">{m.weight} <span className="text-[10px] font-normal text-slate-500">kg</span></p>
                            {m.weightIncrement !== undefined && (
                              <p className={cn("text-[10px] font-bold flex items-center", m.weightIncrement > 0 ? "text-emerald-600" : "text-rose-600")}>
                                <TrendingUp className="w-3 h-3 mr-0.5" /> 
                                {m.weightIncrement > 0 ? "+" : ""}{m.weightIncrement}g
                              </p>
                            )}
                         </div>
                         <div className="w-px h-8 bg-slate-100"></div>
                         <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Tinggi</p>
                            <p className="text-base font-bold text-slate-800">{m.height} <span className="text-[10px] font-normal text-slate-500">cm</span></p>
                         </div>
                      </div>
                      
                      {m.notes && (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 mb-2 mr-2">
                          <p className="text-[10px] text-slate-500 italic">"{m.notes}"</p>
                        </div>
                      )}
                   </div>
                </Card>
             ))
           )}
        </div>
      )}
    </div>
  );
}