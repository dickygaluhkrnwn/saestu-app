"use client";

import { Activity } from "lucide-react";

export function ParentHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-6 py-4 flex justify-between items-center print:hidden">
      <div className="flex items-center gap-2">
        <div className="bg-emerald-500 p-1.5 rounded-lg">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <span className="font-black text-slate-800 tracking-tighter">SAESTU</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
        ID
      </div>
    </header>
  );
}