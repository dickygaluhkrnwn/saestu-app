'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '@/components/ui/Card'; // FIX: Named import

const dataWeight = [
  { name: 'Gizi Baik', value: 450, color: '#10B981' }, // Emerald-500
  { name: 'Kurang', value: 80, color: '#F59E0B' },    // Amber-500
  { name: 'Buruk', value: 25, color: '#EF4444' },     // Red-500
  { name: 'Lebih', value: 45, color: '#6366F1' },     // Indigo-500
];

const dataHeight = [
  { name: 'Normal', value: 480, color: '#10B981' },
  { name: 'Pendek (Stunted)', value: 95, color: '#EF4444' },
  { name: 'Sgt Pendek', value: 25, color: '#7F1D1D' }, // Red-900
];

export default function RegionalHealthChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Status Berat Badan */}
      <Card className="p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-1">Status Berat Badan</h3>
        <p className="text-xs text-slate-500 mb-6">Distribusi BB/U Balita</p>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWeight}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dataWeight.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Chart 2: Status Tinggi Badan */}
      <Card className="p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-1">Status Stunting</h3>
        <p className="text-xs text-slate-500 mb-6">Distribusi TB/U Balita</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataHeight}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dataHeight.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}