"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  UserCircle,
  Plus,
  Camera,
  Keyboard,
  Search,
  ChevronRight,
  Activity,
  LogOut,
  ScanLine
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { getChildrenByPosyandu } from "@/lib/services/children";
import { Child } from "@/types/schema";

export default function PosyanduLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, userProfile } = useAuth();
  
  // State Quick Action
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [childList, setChildList] = useState<Child[]>([]);
  const [searchChild, setSearchChild] = useState("");
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);

  const menuItems = [
    { href: "/posyandu", label: "Beranda", icon: LayoutDashboard },
    { href: "/posyandu/children", label: "Balita", icon: Users },
    { href: "/posyandu/parents", label: "Orang Tua", icon: UserCircle }, // Ganti Reports jadi Parents agar lebih CRUD sentris
    { href: "/posyandu/profile", label: "Profil", icon: UserCircle },
  ];

  // Fetch children saat modal dibuka (Lazy Load)
  useEffect(() => {
    if (isQuickOpen && userProfile?.posyanduId && childList.length === 0) {
      setIsLoadingChildren(true);
      getChildrenByPosyandu(userProfile.posyanduId)
        .then(data => setChildList(data))
        .finally(() => setIsLoadingChildren(false));
    }
  }, [isQuickOpen, userProfile]);

  const filteredChildren = childList.filter(c => 
    c.name.toLowerCase().includes(searchChild.toLowerCase()) || 
    c.nik.includes(searchChild)
  );

  return (
    <div className="min-h-screen bg-slate-50 md:flex font-sans">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-72 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 z-40 text-white">
        <div className="p-8 border-b border-white/10 flex items-center gap-4">
          <div className="bg-teal-500 p-2.5 rounded-xl shadow-lg shadow-teal-900/50">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-xl tracking-tight">SAESTU</h1>
            <p className="text-[10px] font-bold text-teal-300 uppercase tracking-widest mt-1">Kader Posyandu</p>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group", isActive ? "bg-teal-600 text-white shadow-md translate-x-1" : "text-slate-400 hover:bg-white/5 hover:text-white")}>
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-6 mt-6 border-t border-white/10">
            <button onClick={() => setIsQuickOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-teal-900/50">
              <ScanLine className="h-5 w-5" /> Mulai Ukur
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-white/10">
           <button onClick={() => logout()} className="flex items-center justify-center gap-2 w-full text-rose-400 hover:text-white text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4" /> Keluar
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0 scroll-smooth">
          {children}
        </main>

        {/* MOBILE BOTTOM NAV */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 px-6 py-2 flex justify-between items-center z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            {menuItems.slice(0, 2).map((item) => (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 w-16">
                <div className={cn("p-1.5 rounded-xl transition-all", pathname === item.href ? "text-teal-600 bg-teal-50" : "text-slate-400")}>
                  <item.icon className="h-6 w-6" strokeWidth={pathname === item.href ? 2.5 : 2} />
                </div>
                <span className={cn("text-[10px] font-bold", pathname === item.href ? "text-teal-700" : "text-slate-400")}>{item.label}</span>
              </Link>
            ))}

            {/* FAB BUTTON */}
            <div className="relative -top-8">
               <button 
                  onClick={() => setIsQuickOpen(true)}
                  className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-teal-500/40 border-4 border-slate-50 active:scale-90 transition-transform"
               >
                  <ScanLine className="h-8 w-8" />
               </button>
            </div>

            {menuItems.slice(2, 4).map((item) => (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 w-16">
                <div className={cn("p-1.5 rounded-xl transition-all", pathname === item.href ? "text-teal-600 bg-teal-50" : "text-slate-400")}>
                  <item.icon className="h-6 w-6" strokeWidth={pathname === item.href ? 2.5 : 2} />
                </div>
                <span className={cn("text-[10px] font-bold", pathname === item.href ? "text-teal-700" : "text-slate-400")}>{item.label}</span>
              </Link>
            ))}
        </nav>
      </div>

      {/* QUICK ACTION MODAL */}
      <Modal isOpen={isQuickOpen} onClose={() => setIsQuickOpen(false)} title="Siapa yang mau diukur?">
         <div className="space-y-4 h-[60vh] flex flex-col">
            <div className="relative shrink-0">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
               <input 
                  autoFocus
                  type="text" 
                  placeholder="Cari nama balita..." 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  value={searchChild}
                  onChange={e => setSearchChild(e.target.value)}
               />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
               {isLoadingChildren ? (
                  <p className="text-center text-sm text-slate-400 py-10">Mengambil data...</p>
               ) : filteredChildren.length === 0 ? (
                  <div className="text-center py-10">
                     <p className="text-sm text-slate-500 font-bold">Anak tidak ditemukan.</p>
                     <button onClick={() => { setIsQuickOpen(false); router.push('/posyandu/children'); }} className="text-teal-600 text-xs mt-2 underline">Tambah Anak Baru</button>
                  </div>
               ) : (
                  filteredChildren.map(child => (
                     <div key={child.id} className="p-3 bg-white border border-slate-100 rounded-xl flex justify-between items-center hover:border-teal-500 transition-colors group">
                        <div>
                           <p className="font-bold text-slate-800">{child.name}</p>
                           <p className="text-xs text-slate-500">Ortu: {child.parentName}</p>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => { setIsQuickOpen(false); router.push(`/posyandu/children/${child.id}/measure`); }} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-teal-50 hover:text-teal-600">
                              <Keyboard className="w-5 h-5" />
                           </button>
                           <button onClick={() => { setIsQuickOpen(false); router.push(`/posyandu/children/${child.id}/measure?autoScan=true`); }} className="p-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200">
                              <Camera className="w-5 h-5" />
                           </button>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>
      </Modal>
    </div>
  );
}