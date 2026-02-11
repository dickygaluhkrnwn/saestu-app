"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Baby, Plus, User, Activity, LogOut, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function PosyanduLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  // Konfigurasi Menu Navigasi
  const navItems = [
    { href: "/posyandu", label: "Beranda", icon: Home },
    { href: "/posyandu/children", label: "Anak", icon: Baby },
    // isFab: true menandakan tombol ini akan jadi tombol bulat besar di tengah (Mobile)
    { href: "/posyandu/scan", label: "Ukur", icon: Plus, isFab: true }, 
    { href: "/posyandu/parents", label: "Warga", icon: Users },
    { href: "/posyandu/profile", label: "Profil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background md:flex font-sans">
      
      {/* --- SIDEBAR DESKTOP (Hidden on Mobile) --- */}
      <aside className="hidden md:flex flex-col w-72 bg-surface border-r border-slate-200 h-screen sticky top-0 z-40 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
        {/* Header Logo */}
        <div className="p-8 border-b border-slate-100/50 flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-xl tracking-tight">SAESTU</h1>
            <p className="text-xs text-slate-500 font-medium">Kader Dashboard</p>
          </div>
        </div>
        
        {/* Navigation List */}
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-teal-200/50 translate-x-1" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-5 py-3.5 w-full text-left text-rose-600 hover:bg-rose-50 rounded-2xl text-sm font-semibold transition-all"
          >
            <LogOut className="h-5 w-5" />
            Keluar Aplikasi
          </button>
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 min-w-0 relative bg-background">
        {/* Padding Bottom besar di mobile agar konten tidak tertutup Bottom Nav */}
        <div className="h-full pb-32 md:pb-8 md:p-8">
           <div className="w-full md:max-w-6xl md:mx-auto">
             {children}
           </div>
        </div>
      </main>

      {/* --- NAVIGASI MOBILE (Modern Bottom Bar + FAB) --- */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface border-t border-slate-200 px-6 pb-6 pt-3 flex justify-between items-end z-50 rounded-t-[2rem] shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          // Render FAB (Tombol Tengah Besar)
          if (item.isFab) {
             return (
                <div key={item.href} className="relative -top-8 group px-2">
                    <Link
                        href={item.href}
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-teal-500/40 transition-transform active:scale-90 hover:scale-105"
                    >
                        <Plus className="h-7 w-7" strokeWidth={3} />
                    </Link>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.label}
                    </span>
                </div>
             );
          }

          // Render Normal Nav Item
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 group w-12"
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive
                    ? "text-primary"
                    : "text-slate-300 group-hover:text-slate-500"
                )}
              >
                <item.icon className={cn("h-6 w-6 transition-transform", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold transition-colors text-center leading-none",
                  isActive ? "text-primary" : "text-slate-300"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}