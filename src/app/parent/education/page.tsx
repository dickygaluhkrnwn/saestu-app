"use client";

import { BookOpen, Sparkles, ChevronRight, Apple, Heart, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const ARTICLES = [
  {
    title: "Pentingnya Protein Hewani untuk Cegah Stunting",
    category: "Nutrisi",
    icon: Apple,
    color: "text-rose-500 bg-rose-50",
    readTime: "5 menit"
  },
  {
    title: "Jadwal Imunisasi Dasar Lengkap 0-24 Bulan",
    category: "Kesehatan",
    icon: ShieldCheck,
    color: "text-blue-500 bg-blue-50",
    readTime: "8 menit"
  },
  {
    title: "Mengenal Tanda Bahaya pada Bayi Baru Lahir",
    category: "Edukasi",
    icon: Heart,
    color: "text-emerald-500 bg-emerald-50",
    readTime: "10 menit"
  }
];

export default function ParentEducationPage() {
  return (
    <div className="p-6 space-y-8 font-sans">
      <header className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="text-emerald-600 w-7 h-7" /> Edukasi Bunda
        </h1>
        <p className="text-sm text-slate-500 font-medium">Panduan praktis merawat si kecil di rumah.</p>
      </header>

      {/* Featured Card */}
      <Card className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 border-0 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
           <Sparkles className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white border-0 mb-4">Tips Hari Ini</Badge>
          <h3 className="text-xl font-black mb-2">Cara Mengatasi Balita GTM (Gerakan Tutup Mulut)</h3>
          <p className="text-emerald-50 text-sm opacity-90 mb-6">Trik agar si kecil lahap makan tanpa dipaksa.</p>
          <button className="w-full py-3 bg-white text-emerald-700 font-bold rounded-2xl">Baca Selengkapnya</button>
        </div>
      </Card>

      {/* Article List */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Artikel Terbaru</h4>
        {ARTICLES.map((art, idx) => (
          <Card key={idx} hoverable className="p-4 flex items-center gap-4 border-slate-100 shadow-sm active:scale-95 transition-all cursor-pointer">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${art.color}`}>
              <art.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">{art.category}</span>
                <span className="text-[10px] text-slate-300">•</span>
                <span className="text-[10px] text-slate-400 font-medium">{art.readTime} baca</span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm truncate">{art.title}</h3>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </Card>
        ))}
      </div>
    </div>
  );
}