"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  LogOut, 
  Menu,
  Activity
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, userProfile } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { href: "/master", label: "Dashboard", icon: LayoutDashboard },
    { href: "/master/posyandu", label: "Data Posyandu", icon: Building2 },
    { href: "/master/users", label: "Manajemen User", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-lg">SAESTU</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-slate-800">SAESTU</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6 text-slate-600" />
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {isSidebarOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 absolute top-16 left-0 right-0 z-10 shadow-lg">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <button 
              onClick={() => logout()}
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 font-medium"
            >
              <LogOut className="h-5 w-5" />
              Keluar
            </button>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}