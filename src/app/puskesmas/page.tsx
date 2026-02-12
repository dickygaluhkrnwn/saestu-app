"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Activity, 
  Utensils, 
  Baby, 
  Users, 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  ClipboardList,
  ChevronRight,
  Siren,
  Search
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import RegionalHealthChart from "@/components/charts/RegionalHealthChart";
import ActivityTrendChart from "@/components/charts/ActivityTrendChart";

// Services
import { getPosyandusByPuskesmas } from "@/lib/services/posyandu";
import { getAllChildren } from "@/lib/services/children";
import { getKadersByPuskesmas } from "@/lib/services/users";

// Tipe data lokal untuk dashboard
interface DashboardStats {
  totalBalita: number;
  totalPengukuran: number;
  totalStunting: number;
  totalKader: number;
  posyanduCount: number;
}

export default function PuskesmasDashboard() {
  const { userProfile, loading: authLoading } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalBalita: 0,
    totalPengukuran: 0,
    totalStunting: 0,
    totalKader: 0,
    posyanduCount: 0
  });
  
  const [highRiskChildren, setHighRiskChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "intervention">("overview");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userProfile?.puskesmasId) return;

      try {
        // 1. Ambil Posyandu milik Puskesmas ini
        const myPosyandus = await getPosyandusByPuskesmas(userProfile.puskesmasId);
        const myPosyanduIds = myPosyandus.map(p => p.id);

        // 2. Ambil Data Anak & Kader
        const [allChildren, myKaders] = await Promise.all([
            getAllChildren(),
            getKadersByPuskesmas(userProfile.puskesmasId)
        ]);

        // 3. Filter Data Anak berdasarkan Posyandu ID
        const myChildren = allChildren.filter(c => myPosyanduIds.includes(c.posyanduId));
        
        // 4. Identifikasi Anak Berisiko Tinggi (Intervensi)
        const riskList = myChildren.filter(c => 
            c.lastLengthStatus === 'inadequate' || c.lastWeightStatus === 'inadequate'
        ).map(child => {
            // Mapping nama posyandu untuk display
            const posyanduName = myPosyandus.find(p => p.id === child.posyanduId)?.name || "Unknown";
            return { ...child, posyanduName };
        });

        // 5. Hitung Statistik
        const currentMonth = new Date().getMonth();
        const activeMeasurementCount = myChildren.filter(c => {
            if (!c.lastMeasurementDate) return false;
            const d = (c.lastMeasurementDate as any).toDate ? (c.lastMeasurementDate as any).toDate() : new Date(c.lastMeasurementDate as any);
            return d.getMonth() === currentMonth;
        }).length;

        setStats({
            totalBalita: myChildren.length,
            totalPengukuran: activeMeasurementCount,
            totalStunting: riskList.length,
            totalKader: myKaders.length,
            posyanduCount: myPosyandus.length
        });

        setHighRiskChildren(riskList);

      } catch (error) {
        console.error("Gagal memuat dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
        fetchDashboardData();
    }
  }, [userProfile, authLoading]);

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Memuat Dashboard...</p>
        </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans bg-slate-50/50 min-h-screen">
      
      {/* 1. HERO HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
         <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="neutral" className="bg-emerald-50 text-emerald-700 border-emerald-100 py-1 px-3">
                    <Activity className="w-3 h-3 mr-1.5 animate-pulse" /> Live Monitoring
                </Badge>
                <span className="text-xs text-slate-400 font-medium">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Halo, {userProfile?.name || "Petugas Puskesmas"}
            </h1>
            <p className="text-slate-500 text-sm max-w-xl">
                Pantau kesehatan balita di <strong>{stats.posyanduCount} Posyandu</strong> wilayah kerja Anda. 
                Prioritaskan penanganan pada kasus berisiko tinggi.
            </p>
         </div>
         
         <div className="flex gap-3">
            <Link href="/puskesmas/nutrition">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-lg font-bold h-11 px-5 rounded-xl transition-all">
                    <Utensils className="h-4 w-4 mr-2" />
                    Database Gizi
                </Button>
            </Link>
         </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
            title="Total Balita" 
            value={stats.totalBalita} 
            icon={Baby} 
            color="blue"
            trend="+2.5%" 
            trendUp={true}
        />
        <StatsCard 
            title="Pengukuran Bulan Ini" 
            value={stats.totalPengukuran} 
            icon={Activity} 
            color="emerald"
            trend="Aktif" 
            trendUp={true}
        />
        <StatsCard 
            title="Kasus Berisiko" 
            value={stats.totalStunting} 
            icon={AlertTriangle} 
            color="rose"
            trend="Perlu Tindakan" 
            trendUp={false}
            highlight={stats.totalStunting > 0}
        />
        <StatsCard 
            title="Petugas Lapangan" 
            value={stats.totalKader} 
            icon={Users} 
            color="indigo"
            trend="Kader Aktif" 
            trendUp={true}
        />
      </div>

      {/* 3. TABS NAVIGATION (OVERVIEW vs INTERVENTION) */}
      <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-full md:w-fit">
         <button 
            onClick={() => setActiveTab("overview")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "overview" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
         >
            <TrendingUp className="w-4 h-4" /> Overview Wilayah
         </button>
         <button 
            onClick={() => setActiveTab("intervention")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "intervention" ? "bg-rose-600 text-white shadow-md shadow-rose-200" : "text-slate-500 hover:bg-slate-50"}`}
         >
            <Siren className="w-4 h-4" /> 
            Intervensi ({stats.totalStunting})
         </button>
      </div>

      {/* 4. TAB CONTENT */}
      {activeTab === "overview" ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left: Charts */}
            <div className="xl:col-span-2 space-y-6">
                <RegionalHealthChart />
            </div>

            {/* Right: Activity Trend & Info */}
            <div className="xl:col-span-1 space-y-6">
                <ActivityTrendChart />
                
                <Card className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-0 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Users className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2">Kelola Tim Lapangan</h3>
                        <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                            Pastikan setiap Posyandu memiliki Kader yang cukup untuk melayani penimbangan balita secara optimal.
                        </p>
                        <Link href="/puskesmas/kaders">
                            <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 border-0 font-bold">
                                Manajemen Kader
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Intervention Header */}
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                        <Siren className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-rose-900">Zona Prioritas Penanganan</h3>
                        <p className="text-rose-700 text-sm mt-1">
                            Daftar berikut menampilkan anak dengan indikasi <strong>Stunting</strong> atau <strong>Gizi Kurang</strong>. Segera lakukan validasi lapangan.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-rose-100 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                    <span className="text-sm font-bold text-rose-700">{highRiskChildren.length} Kasus Aktif</span>
                </div>
            </div>

            {/* Intervention List Table */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Nama Balita</th>
                                <th className="px-6 py-4">Posyandu</th>
                                <th className="px-6 py-4">Status Gizi</th>
                                <th className="px-6 py-4 text-center">Pengukuran Terakhir</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {highRiskChildren.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center opacity-40">
                                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
                                            <p className="font-bold text-slate-500">Tidak ada kasus berisiko saat ini.</p>
                                            <p className="text-xs text-slate-400">Wilayah Anda dalam kondisi aman.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                highRiskChildren.map((child) => (
                                    <tr key={child.id} className="hover:bg-rose-50/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                                                    {child.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{child.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">NIK: {child.nik}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                {child.posyanduName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                {child.lastLengthStatus === 'inadequate' && (
                                                    <Badge variant="danger" className="w-fit text-[9px] px-2 py-0.5 border-0">STUNTING</Badge>
                                                )}
                                                {child.lastWeightStatus === 'inadequate' && (
                                                    <Badge variant="warning" className="w-fit text-[9px] px-2 py-0.5 border-0 bg-amber-100 text-amber-700">GIZI KURANG</Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-xs space-y-1">
                                                <p className="font-bold text-slate-700">BB: {child.lastWeight} kg</p>
                                                <p className="font-bold text-slate-700">TB: {child.lastHeight} cm</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/puskesmas/regional/child/${child.id}`}>
                                                <Button size="sm" variant="outline" className="border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 text-xs h-8">
                                                    Tinjau <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
      )}

    </div>
  );
}

// Reusable Stats Card Component
function StatsCard({ title, value, icon: Icon, color, trend, trendUp, highlight }: any) {
    const colorStyles: any = {
        emerald: "bg-emerald-50 text-emerald-600",
        blue: "bg-blue-50 text-blue-600",
        rose: "bg-rose-50 text-rose-600",
        indigo: "bg-indigo-50 text-indigo-600",
    };

    return (
        <Card className={`p-5 border shadow-sm transition-all hover:shadow-md ${highlight ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 bg-white'}`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {trend}
                </div>
            </div>
            <div>
                <h4 className="text-3xl font-bold text-slate-900 mb-1">{value}</h4>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
            </div>
        </Card>
    );
}