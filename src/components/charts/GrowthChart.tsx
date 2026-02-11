"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { Measurement } from '@/types/schema';

interface GrowthChartProps {
  measurements: Measurement[];
  gender: "L" | "P";
  type: "weight" | "length";
}

export default function GrowthChart({ measurements, gender, type }: GrowthChartProps) {
  // 1. Urutkan data dari yang terlama ke terbaru
  const sortedData = [...measurements].sort((a, b) => 
    new Date(a.date.toString()).getTime() - new Date(b.date.toString()).getTime()
  );

  // 2. Format data
  const chartData = sortedData.map(m => ({
    age: m.ageInMonths,
    displayDate: new Date(m.date.toString()).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }),
    value: type === "weight" ? m.weight : m.height,
    status: type === "weight" ? m.weightStatus : m.lengthStatus,
    notes: m.notes
  }));

  const lineColor = gender === 'L' ? "#3b82f6" : "#ec4899"; // Biru/Pink

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      {/* Header Grafik */}
      <h3 className="text-sm font-bold text-slate-700 mb-6 text-center">
        Grafik {type === "weight" ? "Berat Badan (kg)" : "Tinggi Badan (cm)"}
      </h3>
      
      {/* Container Grafik dengan Tinggi Pasti (Fixed Height) */}
      <div className="h-[250px] w-full">
        {chartData.length === 0 ? (
           <div className="h-full flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-lg">
             Belum ada data pengukuran.
           </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData} 
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                interval="preserveStartEnd"
              />
              
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                width={30}
              />
              
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    
                    // Logic Warna & Label Tooltip yang Lebih Akurat
                    let statusColor = "bg-slate-100 text-slate-600";
                    let statusText = "Data Awal / Info";

                    if (data.status === 'adequate') {
                        statusColor = "bg-green-100 text-green-700";
                        statusText = "✅ Naik Bagus";
                    } else if (data.status === 'inadequate') {
                        statusColor = "bg-red-100 text-red-700";
                        statusText = "⚠️ Kurang";
                    } else if (data.status === 'excess') {
                        statusColor = "bg-yellow-100 text-yellow-700";
                        statusText = "⚠️ Berlebih";
                    }

                    return (
                      <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg text-xs z-50 min-w-[120px]">
                        <p className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-1">{label}</p>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-500">Usia</span>
                            <span className="font-medium text-slate-700">{data.age} bln</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-500">Nilai</span>
                            <span className="font-bold text-blue-600 text-sm">
                                {data.value} {type === 'weight' ? 'kg' : 'cm'}
                            </span>
                        </div>
                        <div className={`text-center px-2 py-1 rounded text-[10px] font-bold ${statusColor}`}>
                          {statusText}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={lineColor} 
                strokeWidth={3}
                isAnimationActive={false} 
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  
                  // Warna Titik: Hijau, Merah, Kuning, atau Abu-abu
                  let fill = '#94a3b8'; // Default (Unknown/Start)
                  if (payload.status === 'adequate') fill = '#22c55e';
                  else if (payload.status === 'inadequate') fill = '#ef4444';
                  else if (payload.status === 'excess') fill = '#eab308';

                  return (
                    <circle key={payload.displayDate} cx={cx} cy={cy} r={5} fill={fill} stroke="#fff" strokeWidth={2} />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="flex justify-center gap-3 mt-4 flex-wrap">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-[10px] text-slate-500">Adekuat</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span className="text-[10px] text-slate-500">Kurang</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          <span className="text-[10px] text-slate-500">Berlebih</span>
        </div>
      </div>
    </div>
  );
}