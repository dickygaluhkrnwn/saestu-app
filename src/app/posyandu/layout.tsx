"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// Tambahkan 'Baby' ke import, hapus 'Users' dari Data Anak dan pakai untuk Warga
import { Home, Baby, PlusCircle, User, Activity, LogOut, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function PosyanduLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { href: "/posyandu", label: "Beranda", icon: Home },
    { href: "/posyandu/children", label: "Data Anak", icon: Baby }, // Ganti jadi ikon Bayi
    { href: "/posyandu/scan", label: "Ukur", icon: PlusCircle },
    { href: "/posyandu/parents", label: "Warga", icon: Users }, // Menu Baru
    { href: "/posyandu/profile", label: "Profil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      
      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 z-40">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg">SAESTU</h1>
            <p className="text-xs text-slate-500">Kader Dashboard</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 min-w-0 relative">
        <div className="h-full pb-24 md:pb-8 md:p-8">
           <div className="w-full md:max-w-5xl md:mx-auto">
             {children}
           </div>
        </div>
      </main>

      {/* --- NAVIGASI MOBILE (5 Items) --- */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 px-2 py-2 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 group w-full p-1"
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-blue-600 text-white translate-y-[-2px] shadow-md"
                    : "text-slate-400 group-hover:text-blue-500"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "h-4 w-4")} />
              </div>
              <span
                className={cn(
                  "text-[9px] font-medium transition-colors text-center leading-none",
                  isActive ? "text-blue-600" : "text-slate-400"
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