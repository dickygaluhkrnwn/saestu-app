"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  LogOut, 
  Activity,
  ChevronRight,
  Shield,
  Database // Icon untuk Seed Data
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, userProfile } = useAuth();

  const menuItems = [
    { href: "/master", label: "Dashboard", icon: LayoutDashboard },
    { href: "/master/puskesmas", label: "Data Puskesmas", icon: Building2 },
    { href: "/master/users", label: "Manajemen User", icon: Users },
    // Menu baru untuk Seed Data (Permanen untuk Development/Demo)
    { href: "/master/seed", label: "Seed Data Dummy", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-50 md:flex font-sans">
      
      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="hidden md:flex flex-col w-72 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 z-40 shadow-xl text-white">
        
        {/* Brand Header */}
        <div className="p-8 border-b border-white/10 flex items-center gap-4">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/50">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-xl tracking-tight">SAESTU</h1>
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest bg-white/10 px-1.5 py-0.5 rounded-md inline-block mt-1">Master Admin</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu Utama</p>
          
          {menuItems.map((item) => {
            const isActive = item.href === "/master" 
                ? pathname === "/master"
                : pathname.startsWith(item.href);

            // Styling khusus untuk menu Seed agar terlihat berbeda (Opsional, tapi membantu)
            const isSeedMenu = item.href === "/master/seed";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/30 translate-x-1" 
                    : isSeedMenu 
                        ? "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300" // Warna kuning untuk menu Seed
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : isSeedMenu ? "text-amber-400 group-hover:text-amber-300" : "text-slate-400 group-hover:text-white")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-blue-200" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer User Info & Logout */}
        <div className="p-6 border-t border-white/10 bg-slate-900 text-white">
          <div className="flex items-center gap-3 mb-4 px-2">
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-sm">
                <Shield className="w-5 h-5" />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{userProfile?.name || "Admin"}</p>
                <p className="text-xs text-slate-400 truncate">{userProfile?.email}</p>
             </div>
          </div>
          
          <button 
            onClick={() => logout()}
            className="flex items-center justify-center gap-2 px-4 py-3 w-full text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent rounded-xl text-sm font-semibold transition-all"
          >
            <LogOut className="h-4 w-4" />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 text-white border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
               <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">SAESTU Admin</span>
          </div>
          <button 
            onClick={() => logout()}
            className="p-2 rounded-lg hover:bg-white/10 text-rose-400"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        {/* Content Render */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          {children}
        </main>

        {/* --- MOBILE BOTTOM NAVIGATION --- */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 px-2 py-3 flex justify-around items-center z-50 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            {menuItems.map((item) => {
              const isActive = item.href === "/master" 
                ? pathname === "/master"
                : pathname.startsWith(item.href);
              
              const isSeedMenu = item.href === "/master/seed";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 w-full"
                >
                  <div className={cn(
                    "p-2 rounded-xl transition-all",
                    isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 translate-y-[-2px]" : isSeedMenu ? "text-amber-500" : "text-slate-400"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold",
                    isActive ? "text-slate-900" : "text-slate-400"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
        </nav>

      </div>
    </div>
  );
}