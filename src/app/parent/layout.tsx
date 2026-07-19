"use client";

import { ParentHeader } from "@/components/layout/ParentHeader";
import { ParentBottomNav } from "@/components/layout/ParentBottomNav";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col print:bg-white">
      
      {/* Header dipindah ke komponen */}
      <ParentHeader />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 print:pb-0 print:bg-white">
        {children}
      </main>

      {/* Bottom Nav dipindah ke komponen */}
      <ParentBottomNav />
      
    </div>
  );
}