"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import { Measurement } from '@/types/schema';
import { useMemo, useState, useEffect } from 'react';

// --- WHO CHILD GROWTH STANDARDS (0-24 Months) ---
// Sumber: WHO Multicentre Growth Reference Study Group
// Data ini adalah Weight-for-Age (WFA) dan Length-for-Age (LFA)
// Digunakan untuk background curves (KMS Digital), BUKAN untuk hitungan velocity.

const WHO_WFA_BOYS = [
  { age: 0, p3: 2.5, p50: 3.3, p97: 4.4 }, { age: 1, p3: 3.4, p50: 4.5, p97: 5.8 },
  { age: 2, p3: 4.3, p50: 5.6, p97: 7.1 }, { age: 3, p3: 5.0, p50: 6.4, p97: 8.0 },
  { age: 4, p3: 5.6, p50: 7.0, p97: 8.7 }, { age: 5, p3: 6.0, p50: 7.5, p97: 9.3 },
  { age: 6, p3: 6.4, p50: 7.9, p97: 9.8 }, { age: 7, p3: 6.7, p50: 8.3, p97: 10.3 },
  { age: 8, p3: 6.9, p50: 8.6, p97: 10.7 }, { age: 9, p3: 7.1, p50: 8.9, p97: 11.0 },
  { age: 10, p3: 7.4, p50: 9.2, p97: 11.4 }, { age: 11, p3: 7.6, p50: 9.4, p97: 11.7 },
  { age: 12, p3: 7.7, p50: 9.6, p97: 12.0 }, { age: 13, p3: 7.9, p50: 9.9, p97: 12.3 },
  { age: 14, p3: 8.1, p50: 10.1, p97: 12.6 }, { age: 15, p3: 8.3, p50: 10.3, p97: 12.8 },
  { age: 16, p3: 8.4, p50: 10.5, p97: 13.1 }, { age: 17, p3: 8.6, p50: 10.7, p97: 13.4 },
  { age: 18, p3: 8.8, p50: 10.9, p97: 13.7 }, { age: 19, p3: 8.9, p50: 11.1, p97: 13.9 },
  { age: 20, p3: 9.1, p50: 11.3, p97: 14.2 }, { age: 21, p3: 9.2, p50: 11.5, p97: 14.5 },
  { age: 22, p3: 9.4, p50: 11.8, p97: 14.8 }, { age: 23, p3: 9.5, p50: 12.0, p97: 15.0 },
  { age: 24, p3: 9.7, p50: 12.2, p97: 15.3 }
];

const WHO_WFA_GIRLS = [
  { age: 0, p3: 2.4, p50: 3.2, p97: 4.2 }, { age: 1, p3: 3.2, p50: 4.2, p97: 5.5 },
  { age: 2, p3: 3.9, p50: 5.1, p97: 6.6 }, { age: 3, p3: 4.5, p50: 5.8, p97: 7.5 },
  { age: 4, p3: 5.0, p50: 6.4, p97: 8.2 }, { age: 5, p3: 5.4, p50: 6.9, p97: 8.7 },
  { age: 6, p3: 5.7, p50: 7.3, p97: 9.3 }, { age: 7, p3: 6.0, p50: 7.6, p97: 9.8 },
  { age: 8, p3: 6.3, p50: 7.9, p97: 10.2 }, { age: 9, p3: 6.5, p50: 8.2, p97: 10.5 },
  { age: 10, p3: 6.7, p50: 8.5, p97: 10.9 }, { age: 11, p3: 6.9, p50: 8.7, p97: 11.2 },
  { age: 12, p3: 7.0, p50: 8.9, p97: 11.5 }, { age: 13, p3: 7.2, p50: 9.2, p97: 11.8 },
  { age: 14, p3: 7.4, p50: 9.4, p97: 12.1 }, { age: 15, p3: 7.6, p50: 9.6, p97: 12.4 },
  { age: 16, p3: 7.7, p50: 9.8, p97: 12.6 }, { age: 17, p3: 7.9, p50: 10.0, p97: 12.9 },
  { age: 18, p3: 8.1, p50: 10.2, p97: 13.2 }, { age: 19, p3: 8.2, p50: 10.4, p97: 13.5 },
  { age: 20, p3: 8.4, p50: 10.6, p97: 13.7 }, { age: 21, p3: 8.6, p50: 10.9, p97: 14.0 },
  { age: 22, p3: 8.7, p50: 11.1, p97: 14.3 }, { age: 23, p3: 8.9, p50: 11.3, p97: 14.6 },
  { age: 24, p3: 9.0, p50: 11.5, p97: 14.8 }
];

const WHO_LFA_BOYS = [
  { age: 0, p3: 46.1, p50: 49.9, p97: 53.7 }, { age: 1, p3: 50.8, p50: 54.7, p97: 58.6 },
  { age: 2, p3: 54.4, p50: 58.4, p97: 62.4 }, { age: 3, p3: 57.3, p50: 61.4, p97: 65.5 },
  { age: 4, p3: 59.7, p50: 63.9, p97: 68.0 }, { age: 5, p3: 61.7, p50: 65.9, p97: 70.1 },
  { age: 6, p3: 63.3, p50: 67.6, p97: 71.9 }, { age: 7, p3: 64.8, p50: 69.2, p97: 73.5 },
  { age: 8, p3: 66.2, p50: 70.6, p97: 75.0 }, { age: 9, p3: 67.5, p50: 72.0, p97: 76.5 },
  { age: 10, p3: 68.7, p50: 73.3, p97: 77.9 }, { age: 11, p3: 69.9, p50: 74.5, p97: 79.2 },
  { age: 12, p3: 71.0, p50: 75.7, p97: 80.5 }, { age: 13, p3: 72.1, p50: 76.9, p97: 81.8 },
  { age: 14, p3: 73.1, p50: 78.0, p97: 83.0 }, { age: 15, p3: 74.1, p50: 79.1, p97: 84.2 },
  { age: 16, p3: 75.0, p50: 80.2, p97: 85.4 }, { age: 17, p3: 76.0, p50: 81.2, p97: 86.5 },
  { age: 18, p3: 76.9, p50: 82.3, p97: 87.7 }, { age: 19, p3: 77.7, p50: 83.2, p97: 88.8 },
  { age: 20, p3: 78.6, p50: 84.2, p97: 89.8 }, { age: 21, p3: 79.4, p50: 85.1, p97: 90.9 },
  { age: 22, p3: 80.2, p50: 86.0, p97: 91.9 }, { age: 23, p3: 81.0, p50: 86.9, p97: 92.9 },
  { age: 24, p3: 81.7, p50: 87.8, p97: 93.9 }
];

const WHO_LFA_GIRLS = [
  { age: 0, p3: 45.4, p50: 49.1, p97: 52.9 }, { age: 1, p3: 49.8, p50: 53.7, p97: 57.6 },
  { age: 2, p3: 53.2, p50: 57.1, p97: 61.1 }, { age: 3, p3: 55.8, p50: 59.8, p97: 64.0 },
  { age: 4, p3: 58.0, p50: 62.1, p97: 66.4 }, { age: 5, p3: 59.9, p50: 64.0, p97: 68.5 },
  { age: 6, p3: 61.2, p50: 65.7, p97: 70.3 }, { age: 7, p3: 62.7, p50: 67.3, p97: 71.9 },
  { age: 8, p3: 64.0, p50: 68.7, p97: 73.5 }, { age: 9, p3: 65.3, p50: 70.1, p97: 75.0 },
  { age: 10, p3: 66.5, p50: 71.5, p97: 76.4 }, { age: 11, p3: 67.7, p50: 72.8, p97: 77.8 },
  { age: 12, p3: 68.9, p50: 74.0, p97: 79.2 }, { age: 13, p3: 70.0, p50: 75.2, p97: 80.5 },
  { age: 14, p3: 71.0, p50: 76.4, p97: 81.7 }, { age: 15, p3: 72.0, p50: 77.5, p97: 83.0 },
  { age: 16, p3: 73.0, p50: 78.6, p97: 84.2 }, { age: 17, p3: 74.0, p50: 79.7, p97: 85.4 },
  { age: 18, p3: 74.9, p50: 80.7, p97: 86.6 }, { age: 19, p3: 75.8, p50: 81.7, p97: 87.8 },
  { age: 20, p3: 76.7, p50: 82.7, p97: 88.9 }, { age: 21, p3: 77.5, p50: 83.7, p97: 90.0 },
  { age: 22, p3: 78.4, p50: 84.6, p97: 91.0 }, { age: 23, p3: 79.2, p50: 85.5, p97: 92.0 },
  { age: 24, p3: 80.0, p50: 86.4, p97: 93.0 }
];

// Helper: Interpolasi Linear
const getStandardValue = (age: number, gender: "L" | "P", type: "weight" | "length", key: "p3" | "p50" | "p97") => {
  let data;
  if (type === "weight") {
    data = gender === 'L' ? WHO_WFA_BOYS : WHO_WFA_GIRLS;
  } else {
    data = gender === 'L' ? WHO_LFA_BOYS : WHO_LFA_GIRLS;
  }
  
  // Jika usia > 24 bulan, gunakan nilai terakhir (batas data di code ini 24 bln)
  if (age > 24) {
      return data[data.length - 1][key];
  }

  // Cari titik referensi
  const lowerIndex = Math.floor(age);
  const upperIndex = Math.ceil(age);

  const lower = data[lowerIndex] || data[0];
  const upper = data[upperIndex] || data[data.length - 1];

  if (lowerIndex === upperIndex) return lower[key];

  // Interpolasi
  const fraction = age - lowerIndex;
  return lower[key] + (fraction * (upper[key] - lower[key]));
};

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

    // 3. Tambahkan Data Standar WHO (Untuk Garis Background)
    return processedData.map(item => ({
      ...item,
      // Display format
      displayDate: item.dateObj.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }),
      fullDate: item.dateObj.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }),
      
      status: type === "weight" ? item.original.weightStatus : item.original.lengthStatus,
      increment: type === "weight" ? item.original.weightIncrement : item.original.lengthIncrement,
      
      // WHO Reference Values (Resolusi Tinggi)
      stdP3: getStandardValue(item.age, gender, type, 'p3'),
      stdP50: getStandardValue(item.age, gender, type, 'p50'),
      stdP97: getStandardValue(item.age, gender, type, 'p97'),
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
                            <div className="flex justify-between border-t border-dashed border-slate-100 pt-1 mt-1">
                                <span className="text-slate-400">Standard Median</span>
                                <span className="text-slate-600">{data.stdP50.toFixed(1)}</span>
                            </div>
                            <div className={`text-center mt-2 px-2 py-1 rounded text-[10px] font-bold ${statusBg}`}>{statusLabel}</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* AREA KMS (Garis Referensi) */}
              {/* Area Hijau (Aman): Antara Median dan P97 */}
              <Area 
                type="monotone" 
                dataKey="stdP97" 
                stroke="none" 
                fill="#ecfdf5" // Green-50
                fillOpacity={0.5} 
              />
              <Area 
                type="monotone" 
                dataKey="stdP3" 
                stroke="none" 
                fill="#fff" // Tutup area bawah P3
                fillOpacity={1} 
              />
              
              {/* Garis-garis Standar */}
              <Line type="monotone" dataKey="stdP97" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" dot={false} activeDot={false} />
              <Line type="monotone" dataKey="stdP50" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="5 5" dot={false} activeDot={false} />
              <Line type="monotone" dataKey="stdP3" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" dot={false} activeDot={false} />

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

      {/* Legend Refined */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span><span className="text-[10px] text-slate-600">Adekuat</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="text-[10px] text-slate-600">Kurang</span></div>
        <div className="flex items-center gap-1.5"><span className="w-8 h-0.5 border-t border-dashed border-green-500"></span><span className="text-[10px] text-slate-400">Median WHO</span></div>
      </div>
    </div>
  );
}