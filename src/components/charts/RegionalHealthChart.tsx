'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/Card'; 

const dataWeight = [
  { name: 'Normal', value: 450, color: '#10b981' }, 
  { name: 'Risiko', value: 80, color: '#f59e0b' },  
  { name: 'Buruk', value: 25, color: '#f43f5e' },   
  { name: 'Lebih', value: 45, color: '#6366f1' },   
];

const dataHeight = [
  { name: 'Normal', value: 480, color: '#10b981' },
  { name: 'Pendek', value: 95, color: '#f59e0b' },
  { name: 'Stunting', value: 25, color: '#f43f5e' }, 
];

// Helper untuk menampilkan Custom Legend secara manual agar lebih rapi di HP
const CustomLegend = ({ data }: { data: any[] }) => (
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

export default function RegionalHealthChart() {
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
                data={dataWeight}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {dataWeight.map((entry, index) => (
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
             <span className="text-2xl font-black text-slate-800">600</span>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Balita</span>
          </div>
        </div>
        <CustomLegend data={dataWeight} />
      </Card>

      {/* Chart 2: Status Tinggi Badan */}
      <Card className="p-5 sm:p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
        <h3 className="text-base font-black text-slate-900 tracking-tight mb-0.5">TB/U (Tinggi Usia)</h3>
        <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-4">Pemantauan Stunting</p>

        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataHeight}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {dataHeight.map((entry, index) => (
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
             <span className="text-2xl font-black text-slate-800">600</span>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Balita</span>
          </div>
        </div>
        <CustomLegend data={dataHeight} />
      </Card>
      
    </div>
  );
}