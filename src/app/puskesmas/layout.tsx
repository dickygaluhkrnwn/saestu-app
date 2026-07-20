"use client";

import { PuskesmasHeader } from "@/components/layout/PuskesmasHeader";
import { PuskesmasSidebar } from "@/components/layout/PuskesmasSidebar";
import { PuskesmasBottomNav } from "@/components/layout/PuskesmasBottomNav";

export default function PuskesmasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex font-sans">
      
      {/* 1. SIDEBAR DESKTOP (Otomatis Sembunyi di HP) */}
      <PuskesmasSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        
        {/* 2. HEADER MOBILE (Otomatis Sembunyi di Desktop) */}
        <PuskesmasHeader />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 scroll-smooth print:bg-white">
          {children}
        </main>

        {/* 3. BOTTOM NAV MOBILE (Otomatis Sembunyi di Desktop) */}
        <PuskesmasBottomNav />
      </div>
      
    </div>
  );
}