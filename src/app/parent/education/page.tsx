"use client";

import React, { useState, useMemo } from "react";
import { 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  Apple, 
  Heart, 
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Stethoscope,
  Users,
  Baby,
  Clock
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// --- MOCK DATA ENTERPRISE ---
// Di masa depan, data ini akan di-fetch dari Firestore koleksi 'educations'
const CATEGORIES = ["Semua", "Nutrisi", "Kesehatan", "Tumbuh Kembang", "Parenting"];

const ARTICLES = [
  {
    id: 1,
    title: "Pentingnya Protein Hewani untuk Cegah Stunting Sejak Dini",
    category: "Nutrisi",
    icon: Apple,
    color: "text-rose-500 bg-rose-50",
    readTime: "5 mnt",
    author: "Ahli Gizi Puskesmas",
    authorRole: "puskesmas", // penanda badge biru (Resmi)
    date: "Hari ini",
    isFeatured: true,
  },
  {
    id: 2,
    title: "Jadwal Imunisasi Dasar Lengkap 0-24 Bulan (Update 2026)",
    category: "Kesehatan",
    icon: ShieldCheck,
    color: "text-blue-500 bg-blue-50",
    readTime: "8 mnt",
    author: "Bidan Desa",
    authorRole: "puskesmas",
    date: "Kemarin",
    isFeatured: false,
  },
  {
    id: 3,
    title: "Cara Menghadapi Balita Fase GTM Tanpa Emosi",
    category: "Parenting",
    icon: Heart,
    color: "text-amber-500 bg-amber-50",
    readTime: "10 mnt",
    author: "Kader Siti",
    authorRole: "kader", // penanda badge hijau (Komunitas)
    date: "12 Ags",
    isFeatured: false,
  },
  {
    id: 4,
    title: "Stimulasi Motorik Kasar untuk Anak Usia 1 Tahun",
    category: "Tumbuh Kembang",
    icon: Baby,
    color: "text-indigo-500 bg-indigo-50",
    readTime: "4 mnt",
    author: "Kader Posyandu Melati",
    authorRole: "kader",
    date: "10 Ags",
    isFeatured: false,
  }
];

export default function ParentEducationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  // --- LOGIKA FILTER & PENCARIAN ---
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((art) => {
      const matchSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === "Semua" || art.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, activeCategory]);

  const featuredArticle = filteredArticles.find(art => art.isFeatured) || filteredArticles[0];
  const regularArticles = filteredArticles.filter(art => art.id !== featuredArticle?.id);

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans pb-28 max-w-md mx-auto">
      
      {/* 1. HEADER */}
      <header className="space-y-1 mt-2">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="text-emerald-600 w-7 h-7 sm:w-8 sm:h-8" /> Edukasi Bunda
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">Panduan praktis dan terpercaya merawat si kecil.</p>
      </header>

      {/* 2. SEARCH BAR (MOBILE OPTIMIZED) */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Cari tips nutrisi, imunisasi..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-emerald-500 focus:border-emerald-500 block pl-11 pr-4 py-3.5 shadow-sm transition-all outline-none placeholder:text-slate-400 font-medium"
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          <button className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
             <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. HORIZONTAL CATEGORY SCROLL (PILLS) */}
      <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeCategory === cat 
                ? "bg-slate-800 text-white shadow-md shadow-slate-200" 
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TAMPILAN JIKA PENCARIAN KOSONG */}
      {filteredArticles.length === 0 ? (
         <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-sm">Artikel tidak ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci lain atau pilih kategori "Semua".</p>
         </div>
      ) : (
         <div className="space-y-6">
            
            {/* 4. FEATURED ARTICLE (HERO CARD) */}
            {featuredArticle && searchQuery === "" && activeCategory === "Semua" && (
                <Card className="p-5 sm:p-6 bg-gradient-to-br from-emerald-600 to-teal-700 border-0 rounded-[2rem] text-white shadow-xl shadow-emerald-200 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="w-24 h-24" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-md">Tips Utama</Badge>
                        <span className="text-[10px] font-bold text-emerald-100 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {featuredArticle.readTime}
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-black mb-3 leading-snug">{featuredArticle.title}</h3>
                    
                    {/* Author Tag (Enterprise Detail) */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                              {featuredArticle.authorRole === "puskesmas" ? <Stethoscope className="w-4 h-4 text-white" /> : <Users className="w-4 h-4 text-white" />}
                           </div>
                           <div>
                              <p className="text-[10px] text-emerald-100 font-medium">Ditulis oleh</p>
                              <p className="text-xs font-bold text-white">{featuredArticle.author}</p>
                           </div>
                        </div>
                        <div className="bg-white text-emerald-700 p-2 rounded-full shadow-sm">
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                  </div>
                </Card>
            )}

            {/* 5. ARTICLE LIST (MODERN LIST VIEW) */}
            <div className="space-y-4">
              <div className="flex justify-between items-end ml-1">
                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    {searchQuery ? "Hasil Pencarian" : "Artikel Lainnya"}
                 </h4>
                 <span className="text-[10px] font-bold text-emerald-600">{regularArticles.length} Artikel</span>
              </div>

              <div className="space-y-3">
                  {regularArticles.map((art) => (
                    <Card key={art.id} className="p-3 sm:p-4 flex items-center gap-3 border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer bg-white rounded-2xl hover:border-emerald-200">
                      
                      {/* Thumbnail Icon */}
                      <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${art.color}`}>
                        <art.icon className="w-7 h-7" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 py-1">
                        {/* Meta Tags */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${art.color.split(' ')[1]} ${art.color.split(' ')[0]}`}>
                              {art.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{art.readTime}</span>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 pr-2">{art.title}</h3>
                        
                        {/* Author Info Small */}
                        <div className="flex items-center gap-1.5 mt-2">
                           {art.authorRole === "puskesmas" ? (
                              <Stethoscope className="w-3 h-3 text-blue-500" />
                           ) : (
                              <Users className="w-3 h-3 text-emerald-500" />
                           )}
                           <span className="text-[10px] font-semibold text-slate-500 truncate">{art.author}</span>
                           <span className="text-[10px] text-slate-300 mx-1">•</span>
                           <span className="text-[10px] text-slate-400">{art.date}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>

         </div>
      )}

    </div>
  );
}