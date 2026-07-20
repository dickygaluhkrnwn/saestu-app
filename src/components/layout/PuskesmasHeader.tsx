"use client";

import { useState, useRef, useEffect } from "react";
import { Activity, Bell, Menu, X, Settings, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export function PuskesmasHeader() {
  const { userProfile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="md:hidden sticky top-0 z-50 flex justify-center print:hidden pointer-events-none">
      <header className="w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/50 px-5 py-3.5 flex justify-between items-center pointer-events-auto relative shadow-sm">
        
        {/* LOGO BRAND */}
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-1.5 rounded-[0.7rem] shadow-sm shadow-emerald-500/20">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-slate-900 tracking-tighter text-lg">SAESTU</span>
        </div>

        {/* AKSI KANAN (NOTIFIKASI & MENU) */}
        <div className="flex items-center gap-3">
          <button className="relative p-1.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors active:scale-95">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 text-slate-700 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors active:scale-95 flex items-center gap-2 pr-3"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black">
              {userProfile?.name?.charAt(0).toUpperCase() || "P"}
            </div>
            {isMenuOpen ? <X className="w-4 h-4 text-slate-500" /> : <Menu className="w-4 h-4 text-slate-500" />}
          </button>
        </div>

        {/* DROPDOWN MENU */}
        {isMenuOpen && (
          <div 
            ref={menuRef} 
            className="absolute top-[110%] right-5 w-56 bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-2xl p-2 animate-in slide-in-from-top-2 fade-in duration-200 z-50"
          >
            <div className="px-3 py-2 border-b border-slate-50 mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Puskesmas Panel</p>
            </div>
            
            <Link href="/puskesmas/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-colors group">
              <div className="bg-emerald-50 text-emerald-500 p-1.5 rounded-lg group-active:scale-95 transition-transform"><Settings className="w-4 h-4" /></div>
              <span className="text-sm font-bold text-slate-700 flex-1">Pengaturan Akun</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            
            <Link href="#" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-colors group">
              <div className="bg-amber-50 text-amber-500 p-1.5 rounded-lg group-active:scale-95 transition-transform"><HelpCircle className="w-4 h-4" /></div>
              <span className="text-sm font-bold text-slate-700 flex-1">Bantuan Pusat</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <div className="h-px bg-slate-50 my-1"></div>

            <button onClick={() => { setIsMenuOpen(false); logout(); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-rose-50 rounded-xl transition-colors group">
              <div className="bg-rose-50 text-rose-500 p-1.5 rounded-lg group-active:scale-95 transition-transform"><LogOut className="w-4 h-4" /></div>
              <span className="text-sm font-bold text-rose-600 flex-1 text-left">Keluar Sistem</span>
            </button>
          </div>
        )}
      </header>
    </div>
  );
}