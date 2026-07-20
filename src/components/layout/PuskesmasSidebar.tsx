"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Utensils, Building2, Users, UserCircle, LogOut, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function PuskesmasSidebar() {
  const pathname = usePathname();
  const { logout, userProfile } = useAuth();

  const menuItems = [
    { href: "/puskesmas", label: "Dashboard", icon: LayoutDashboard },
    { href: "/puskesmas/nutrition", label: "Database Gizi", icon: Utensils },
    { href: "/puskesmas/posyandu", label: "Kelola Posyandu", icon: Building2 },
    { href: "/puskesmas/kaders", label: "Manajemen Kader", icon: Users },
    { href: "/puskesmas/profile", label: "Profil Puskesmas", icon: UserCircle },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-slate-950 border-r border-slate-900 h-screen sticky top-0 z-40 text-white print:hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 flex items-center gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-900/50 border border-emerald-400/20">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-black text-white text-2xl tracking-tight">SAESTU</h1>
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">Admin Puskesmas</p>
        </div>
      </div>
      
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2">Menu Utama</p>
        {menuItems.map((item) => {
          const isActive = item.href === "/puskesmas" ? pathname === "/puskesmas" : pathname.startsWith(item.href);
          return (
            <Link 
                key={item.href} 
                href={item.href} 
                className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group", 
                    isActive ? "bg-emerald-600 text-white shadow-md translate-x-1" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 bg-slate-900/50">
         <div className="flex items-center gap-3 mb-5 px-2">
             <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 border border-emerald-800">
                {userProfile?.name?.charAt(0).toUpperCase() || "P"}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{userProfile?.name || "Petugas"}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest truncate mt-0.5">Administrator</p>
             </div>
         </div>
         <button onClick={() => logout()} className="flex items-center justify-center gap-2 w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 py-3 rounded-xl text-sm font-bold transition-colors">
            <LogOut className="w-4 h-4" /> Keluar Sistem
         </button>
      </div>
    </aside>
  );
}