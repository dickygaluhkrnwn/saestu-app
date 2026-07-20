'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/Card'; 

// 1. Mendefinisikan Tipe Data yang Diharapkan
interface ChartData {
  name: string;
  value: number;
  color: string;
}

// 2. Mendefinisikan Props untuk Komponen Ini
interface RegionalHealthChartProps {
  weightData?: ChartData[];
  heightData?: ChartData[];
  totalBalita?: number;
}

// 3. Fallback dummy jika Props kosong
const defaultWeightData = [
  { name: 'Normal', value: 450, color: '#10b981' }, 
  { name: 'Risiko', value: 80, color: '#f59e0b' },  
  { name: 'Buruk', value: 25, color: '#f43f5e' },   
  { name: 'Lebih', value: 45, color: '#6366f1' },   
];

const defaultHeightData = [
  { name: 'Normal', value: 480, color: '#10b981' },
  { name: 'Pendek', value: 95, color: '#f59e0b' },
  { name: 'Stunting', value: 25, color: '#f43f5e' }, 
];

// Helper untuk menampilkan Custom Legend secara manual
const CustomLegend = ({ data }: { data: ChartData[] }) => (
  <div className="grid grid-cols-2 gap-y-2 gap-x-1 mt-4">
    {data.map((item, index) => (
      <div key={index} className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-wider truncate">{item.name}</p>
        <p className="text-xs font-bold text-slate-800 ml-auto">{item.value}</p>
      </div>
    ))}
  </div>
);

// 4. Menerapkan Props ke Komponen
export default function RegionalHealthChart({ 
  weightData = defaultWeightData, 
  heightData = defaultHeightData, 
  totalBalita = 600 
}: RegionalHealthChartProps) {

  // Pastikan data tidak benar-benar kosong agar PieChart Recharts tidak crash
  const finalWeightData = weightData && weightData.length > 0 && !weightData.every(d => d.value === 0) 
        ? weightData 
        : [{ name: 'Belum Ada Data', value: 1, color: '#e2e8f0' }];

  const finalHeightData = heightData && heightData.length > 0 && !heightData.every(d => d.value === 0) 
        ? heightData 
        : [{ name: 'Belum Ada Data', value: 1, color: '#e2e8f0' }];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      
      {/* Chart 1: Status Berat Badan */}
      <Card className="p-5 sm:p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
        <h3 className="text-base font-black text-slate-900 tracking-tight mb-0.5">BB/U (Berat Usia)</h3>
        <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-4">Distribusi Gizi Balita</p>
        
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={finalWeightData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {finalWeightData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                 itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Angka Total di Tengah Donat */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-5px]">
             <span className="text-2xl font-black text-slate-800">{totalBalita}</span>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Balita</span>
          </div>
        </div>
        
        <CustomLegend data={weightData && !weightData.every(d => d.value === 0) ? weightData : defaultWeightData} />
      </Card>

      {/* Chart 2: Status Tinggi Badan */}
      <Card className="p-5 sm:p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
        <h3 className="text-base font-black text-slate-900 tracking-tight mb-0.5">TB/U (Tinggi Usia)</h3>
        <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-4">Pemantauan Stunting</p>

        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={finalHeightData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {finalHeightData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                 itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
           {/* Angka Total di Tengah Donat */}
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-5px]">
             <span className="text-2xl font-black text-slate-800">{totalBalita}</span>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Balita</span>
          </div>
        </div>
        
        <CustomLegend data={heightData && !heightData.every(d => d.value === 0) ? heightData : defaultHeightData} />
      </Card>
      
    </div>
  );
}