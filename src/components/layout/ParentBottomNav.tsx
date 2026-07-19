"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  TrendingUp, 
  Sparkles, 
  BookOpen, 
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ParentBottomNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/parent", label: "Beranda", icon: Home },
    { href: "/parent/growth", label: "Tumbuh", icon: TrendingUp },
    { href: "/parent/nutrition", label: "AI Gizi", icon: Sparkles },
    { href: "/parent/education", label: "Tips", icon: BookOpen },
    { href: "/parent/profile", label: "Profil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-4 py-3 flex justify-around items-center z-50 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)] print:hidden">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="flex flex-col items-center gap-1 group relative transition-all duration-300"
          >
            <div className={cn(
              "p-2 rounded-2xl transition-all duration-300",
              isActive ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 -translate-y-1" : "text-slate-400"
            )}>
              <item.icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
            </div>
            <span className={cn(
              "text-[10px] font-bold transition-colors duration-300",
              isActive ? "text-emerald-700" : "text-slate-400"
            )}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 bg-emerald-600 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}