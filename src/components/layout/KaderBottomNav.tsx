"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCircle, Settings, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface KaderBottomNavProps {
  onQuickActionClick: () => void;
}

export function KaderBottomNav({ onQuickActionClick }: KaderBottomNavProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/posyandu", label: "Beranda", icon: LayoutDashboard },
    { href: "/posyandu/children", label: "Balita", icon: Users },
    { href: "action", label: "Ukur", icon: ScanLine, isSpecial: true },
    { href: "/posyandu/parents", label: "Orang Tua", icon: UserCircle },
    { href: "/posyandu/profile", label: "Profil", icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none print:hidden">
      <nav className="w-full max-w-md bg-white/95 backdrop-blur-xl border-t border-slate-200/60 px-5 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex justify-between items-center pointer-events-auto shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.isSpecial) {
            return (
              <button key={item.label} onClick={onQuickActionClick} className="flex flex-col items-center justify-center -mt-8 group relative z-10 transition-transform active:scale-95">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 text-white border-4 border-white">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black mt-1 text-slate-500">{item.label}</span>
              </button>
            )
          }

          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 group relative transition-all duration-300 w-12">
              <div className={cn("p-1.5 rounded-xl transition-all duration-300", isActive ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-500")}>
                <item.icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px] fill-blue-50" : "stroke-[2px]")} />
              </div>
              <span className={cn("text-[9px] font-bold transition-colors duration-300", isActive ? "text-blue-700" : "text-slate-400")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}