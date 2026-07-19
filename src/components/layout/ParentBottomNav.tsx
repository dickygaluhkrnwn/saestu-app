"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, Sparkles, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function ParentBottomNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/parent", label: "Beranda", icon: Home },
    { href: "/parent/growth", label: "Tumbuh", icon: TrendingUp },
    { href: "/parent/nutrition", label: "AI Gizi", icon: Sparkles, isSpecial: true },
    { href: "/parent/education", label: "Edukasi", icon: BookOpen },
    { href: "/parent/profile", label: "Profil", icon: User },
  ];

  return (
    // Membungkus nav dengan w-full flex justify-center agar tetap di tengah (max-w-md) walau di layar PC
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none print:hidden">
      
      <nav className="w-full max-w-md bg-white/95 backdrop-blur-xl border-t border-slate-200/60 px-6 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex justify-between items-center pointer-events-auto shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          // Render khusus untuk tombol tengah (AI Gizi) -> Floating Action Button (FAB)
          if (item.isSpecial) {
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center -mt-8 group relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-xl shadow-teal-500/30 text-white group-active:scale-95 transition-transform">
                  <item.icon className={cn("w-6 h-6", isActive && "animate-pulse")} />
                </div>
                <span className={cn(
                  "text-[10px] font-black mt-1.5 transition-colors",
                  isActive ? "text-teal-700" : "text-slate-500"
                )}>{item.label}</span>
              </Link>
            )
          }

          // Render menu reguler
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex flex-col items-center gap-1 group relative transition-all duration-300 w-12"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300",
                isActive ? "text-teal-600" : "text-slate-400 hover:text-slate-500"
              )}>
                {/* Efek icon "terisi" saat aktif */}
                <item.icon className={cn("w-[22px] h-[22px]", isActive ? "stroke-[2.5px] fill-teal-50" : "stroke-[2px]")} />
              </div>
              <span className={cn(
                "text-[9px] font-bold transition-colors duration-300",
                isActive ? "text-teal-700" : "text-slate-400"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      
    </div>
  );
}