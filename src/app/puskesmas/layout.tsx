"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Utensils, 
  LogOut, 
  Stethoscope,
  ChevronRight,
  UserCircle,
  Building2,
  Users,
  Bell // Import icon Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PuskesmasLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, userProfile } = useAuth();
  
  // Menu Updated: 5 Menu Utama sesuai permintaan
  const menuItems = [
    { href: "/puskesmas", label: "Dashboard", icon: LayoutDashboard }, // Pantau Wilayah & Intervensi masuk sini
    { href: "/puskesmas/nutrition", label: "Database Gizi", icon: Utensils },
    { href: "/puskesmas/posyandu", label: "Kelola Posyandu", icon: Building2 },
    { href: "/puskesmas/kaders", label: "Kelola Kader", icon: Users },
    { href: "/puskesmas/profile", label: "Profil", icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 md:flex font-sans">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-72 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 z-40 shadow-xl text-white">
        <div className="p-8 border-b border-white/10 flex items-center gap-4">
          <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-900/50">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-xl tracking-tight">SAESTU</h1>
            <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-900/50 px-2 py-0.5 rounded-md inline-block mt-1">
              Puskesmas
            </p>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu Utama</p>
          {menuItems.map((item) => {
            const isActive = item.href === "/puskesmas" 
              ? pathname === "/puskesmas"
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                  isActive 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30 translate-x-1" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-emerald-200" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10 bg-slate-900 text-white">
          <div className="flex items-center gap-3 mb-4 px-2">
             <div className="w-10 h-10 rounded-full bg-emerald-900/50 border border-emerald-700/50 flex items-center justify-center text-emerald-300 shadow-sm">
                <UserCircle className="w-6 h-6" />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{userProfile?.name || "Petugas"}</p>
                <p className="text-xs text-slate-400 truncate">Administrator Wilayah</p>
             </div>
          </div>
          
          {/* Logout Sidebar desktop tetap ada sebagai fallback */}
          <button 
            onClick={() => logout()}
            className="flex items-center justify-center gap-2 px-4 py-3 w-full text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent rounded-xl text-sm font-semibold transition-all"
          >
            <LogOut className="h-4 w-4" />
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* MOBILE HEADER */}
        <header className="md:hidden bg-slate-900 text-white border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
               <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Puskesmas Panel</span>
          </div>
          {/* Ganti Logout dengan Notifikasi di Mobile Header */}
          <button className="p-2 rounded-lg hover:bg-white/10 text-slate-300 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-900"></span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          {children}
        </main>

        {/* MOBILE NAV */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center z-50 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            {menuItems.map((item) => {
              const isActive = item.href === "/puskesmas" 
              ? pathname === "/puskesmas"
              : pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 w-full"
                >
                  <div className={cn(
                    "p-2 rounded-xl transition-all",
                    isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 translate-y-[-2px]" : "text-slate-400"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className={cn("text-[10px] font-bold mt-1", isActive ? "text-slate-900" : "text-slate-400")}>
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