'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card'; // FIX: Named import

const data = [
  { name: 'Jan', pengukuran: 400 },
  { name: 'Feb', pengukuran: 420 },
  { name: 'Mar', pengukuran: 380 },
  { name: 'Apr', pengukuran: 450 },
  { name: 'Mei', pengukuran: 460 },
  { name: 'Jun', pengukuran: 410 },
];

export default function ActivityTrendChart() {
  return (
    <Card className="p-6 border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Tren Partisipasi</h3>
          <p className="text-xs text-slate-500">Jumlah balita ditimbang 6 bulan terakhir</p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748B', fontSize: 12}} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748B', fontSize: 12}}
            />
            <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
                type="monotone" 
                dataKey="pengukuran" 
                stroke="#059669" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}