'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { Measurement } from '@/types/schema';

// --- (Bagian definisi WHO_WFA_BOYS, dll. tetap dibiarkan ada di file asli jika nanti dibutuhkan kembali, 
//      tapi logika penggunaannya di dalam komponen akan dihapus agar grafik bersih) ---

// Helper: Interpolasi Linear (Tidak digunakan sementara, tapi biarkan jika nanti perlu dikembalikan)
// const getStandardValue = ... 

interface GrowthChartProps {
  measurements: Measurement[];
  gender: "L" | "P";
  type: "weight" | "length";
}

type TimeFilter = '6m' | '1y' | 'all';

export default function GrowthChart({ measurements, gender, type }: GrowthChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  // Fix Hydration Issue
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set default filter ke '6m' jika data banyak, 'all' jika sedikit
  useEffect(() => {
    if (measurements.length > 5) setTimeFilter('6m');
  }, [measurements.length]);

  const chartData = useMemo(() => {
    if (!measurements || measurements.length === 0) return [];

    // 1. Sanitasi & Convert Data
    let processedData = measurements.map(m => {
        let dateObj: Date;
        const rawDate = m.date as any;

        if (rawDate && typeof rawDate.toDate === 'function') {
            dateObj = rawDate.toDate();
        } else if (rawDate instanceof Date) {
            dateObj = rawDate;
        } else {
            dateObj = new Date(rawDate);
        }

        let rawValue = type === "weight" ? m.weight : m.height;
        let value = 0;
        
        if (typeof rawValue === 'string') {
            value = parseFloat((rawValue as string).replace(',', '.'));
        } else {
            value = Number(rawValue);
        }

        return {
            original: m,
            dateObj: dateObj,
            timestamp: !isNaN(dateObj.getTime()) ? dateObj.getTime() : 0,
            value: !isNaN(value) ? value : 0,
            age: m.ageInMonths
        };
    })
    .filter(item => item.timestamp > 0 && item.value > 0)
    .sort((a, b) => a.timestamp - b.timestamp);

    // 2. Filter Berdasarkan Waktu
    if (processedData.length > 0) {
        const latestDate = processedData[processedData.length - 1].dateObj;
        
        if (timeFilter === '6m') {
            const sixMonthsAgo = new Date(latestDate);
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            processedData = processedData.filter(d => d.dateObj >= sixMonthsAgo);
        } else if (timeFilter === '1y') {
            const oneYearAgo = new Date(latestDate);
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            processedData = processedData.filter(d => d.dateObj >= oneYearAgo);
        }
    }

    // 3. Format Data untuk Grafik (HANYA DATA ANAK)
    return processedData.map(item => ({
      ...item,
      // Display format
      displayDate: item.dateObj.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }),
      fullDate: item.dateObj.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }),
      
      status: type === "weight" ? item.original.weightStatus : item.original.lengthStatus,
      increment: type === "weight" ? item.original.weightIncrement : item.original.lengthIncrement,
      
      // HAPUS LOGIKA WHO STANDARD DARI SINI
    }));

  }, [measurements, type, timeFilter, gender]);

  const lineColor = gender === 'L' ? "#3b82f6" : "#ec4899"; // Biru/Pink
  const labelY = type === "weight" ? "Berat (kg)" : "Tinggi (cm)";
  const chartKey = JSON.stringify(chartData) + timeFilter; // Force re-render on filter change

  if (!isMounted) {
    return (
        <div className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="h-[300px] w-full bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-slate-300">
                Memuat Grafik...
            </div>
        </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span>Grafik Pertumbuhan</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${gender === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                {type === "weight" ? "Berat" : "Tinggi"}
            </span>
        </h3>

        {/* Filter Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['6m', '1y', 'all'] as TimeFilter[]).map((tf) => (
                <button
                    key={tf}
                    onClick={() => setTimeFilter(tf)}
                    className={`px-3 py-1 text-[10px] rounded-md font-medium transition-all ${
                        timeFilter === tf 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    {tf === '6m' ? '6 Bln' : tf === '1y' ? '1 Thn' : 'Semua'}
                </button>
            ))}
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="w-full relative" style={{ height: '300px', minHeight: '300px' }}>
        {chartData.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
             <p>Data tidak ditemukan untuk periode ini.</p>
           </div>
        ) : (
          <ResponsiveContainer width="99%" height="100%">
            <ComposedChart 
              key={chartKey}
              data={chartData} 
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                interval="preserveStartEnd"
                tickMargin={10}
              />
              
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                width={35}
                padding={{ top: 20, bottom: 20 }}
              />

              <Tooltip 
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    // Logic Status
                    let statusBg = "bg-slate-100 text-slate-600";
                    let statusLabel = "Data";
                    if (data.status === 'adequate') { statusBg = "bg-green-100 text-green-700"; statusLabel = "Adekuat"; }
                    else if (data.status === 'inadequate') { statusBg = "bg-red-100 text-red-700"; statusLabel = "Kurang"; }
                    else if (data.status === 'excess') { statusBg = "bg-yellow-100 text-yellow-700"; statusLabel = "Berlebih"; }

                    return (
                      <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg text-xs z-50 min-w-[150px]">
                        <p className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2">{data.fullDate}</p>
                        <div className="space-y-1.5">
                            <div className="flex justify-between"><span className="text-slate-500">Usia</span><span className="font-medium text-slate-700">{data.age} Bln</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">{labelY}</span><span className="font-bold text-blue-600">{data.value}</span></div>
                            {/* HAPUS MEDIAN WHO DARI TOOLTIP */}
                            <div className={`text-center mt-2 px-2 py-1 rounded text-[10px] font-bold ${statusBg}`}>{statusLabel}</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* HAPUS AREA & LINE WHO DARI RENDER */}

              {/* Garis Data Anak Utama */}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={lineColor} 
                strokeWidth={3}
                isAnimationActive={false} 
                connectNulls={true}
                activeDot={{ r: 6, strokeWidth: 0 }}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  if (cx === undefined || cy === undefined || isNaN(cx) || isNaN(cy)) return null;
                  
                  let fill = '#94a3b8';
                  if (payload.status === 'adequate') fill = '#22c55e';
                  else if (payload.status === 'inadequate') fill = '#ef4444';
                  else if (payload.status === 'excess') fill = '#eab308';

                  return <circle key={payload.displayDate} cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={2} />;
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend Refined (HAPUS MEDIAN WHO) */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span><span className="text-[10px] text-slate-600">Adekuat</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="text-[10px] text-slate-600">Kurang</span></div>
        {/* <div className="flex items-center gap-1.5"><span className="w-8 h-0.5 border-t border-dashed border-green-500"></span><span className="text-[10px] text-slate-400">Median WHO</span></div> */}
      </div>
    </div>
  );
}