"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  UserCircle,
  Plus,
  Camera,
  Keyboard,
  Search,
  ChevronRight,
  Activity,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";

// Komponen & Service
import { Modal } from "@/components/ui/Modal";
import { getChildrenByPosyandu } from "@/lib/services/children";
import { Child } from "@/types/schema";

export default function PosyanduLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, userProfile } = useAuth();
  
  // --- QUICK ACTION STATE ---
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [childList, setChildList] = useState<Child[]>([]);
  const [searchChild, setSearchChild] = useState("");
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);

  // Menu Navigasi Biasa
  const menuItems = [
    { href: "/posyandu", label: "Beranda", icon: LayoutDashboard },
    { href: "/posyandu/children", label: "Data Balita", icon: Users },
    // Tombol + akan disisipkan di tengah untuk versi Mobile
    { href: "/posyandu/reports", label: "Laporan", icon: CalendarDays },
    { href: "/posyandu/profile", label: "Profil Saya", icon: UserCircle },
  ];

  // Fetch data anak saat modal Quick Action dibuka
  useEffect(() => {
    if (isQuickOpen && userProfile?.posyanduId && childList.length === 0) {
      setIsLoadingChildren(true);
      getChildrenByPosyandu(userProfile.posyanduId)
        .then(data => setChildList(data))
        .catch(err => console.error(err))
        .finally(() => setIsLoadingChildren(false));
    }
  }, [isQuickOpen, userProfile]);

  const filteredChildren = childList.filter(c => 
    c.name.toLowerCase().includes(searchChild.toLowerCase()) || 
    c.nik.includes(searchChild)
  );

  const handleQuickAction = (method: "manual" | "scan") => {
    if (!selectedChild) return;
    setIsQuickOpen(false);
    setSelectedChild(null);
    setSearchChild("");
    // Arahkan ke halaman measurement dengan query param jika metode scan
    if (method === "scan") {
      router.push(`/posyandu/children/${selectedChild.id}/measure?autoScan=true`);
    } else {
      router.push(`/posyandu/children/${selectedChild.id}/measure`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex font-sans">
      
      {/* --- SIDEBAR DESKTOP (Teal Theme) --- */}
      <aside className="hidden md:flex flex-col w-72 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 z-40 text-white">
        {/* Brand */}
        <div className="p-8 border-b border-white/10 flex items-center gap-4">
          <div className="bg-teal-500 p-2.5 rounded-xl shadow-lg shadow-teal-900/50">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-xl tracking-tight">SAESTU</h1>
            <p className="text-[10px] font-bold text-teal-300 uppercase tracking-widest mt-1">
              Kader Posyandu
            </p>
          </div>
        </div>
        
        {/* Navigation Desktop */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group", isActive ? "bg-teal-500 text-white shadow-md translate-x-1" : "text-slate-400 hover:bg-white/5 hover:text-white")}>
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}

          {/* QUICK ACTION DESKTOP */}
          <div className="pt-6 mt-6 border-t border-white/10">
            <button 
              onClick={() => setIsQuickOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-teal-900/50"
            >
              <Plus className="h-5 w-5" />
              Pengukuran Cepat
            </button>
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          {children}
        </main>

        {/* --- MOBILE BOTTOM NAVIGATION --- */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 px-6 py-2 flex justify-between items-center z-40 pb-safe shadow-[0_-4px_15px_rgba(0,0,0,0.03)]">
            
            {/* Item 1 & 2 */}
            {menuItems.slice(0, 2).map((item) => (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 w-16">
                <div className={cn("p-1.5 rounded-xl transition-all", pathname === item.href ? "text-teal-600" : "text-slate-400")}>
                  <item.icon className={cn("h-6 w-6", pathname === item.href && "fill-teal-50")} strokeWidth={pathname === item.href ? 2.5 : 2} />
                </div>
                <span className={cn("text-[10px] font-bold", pathname === item.href ? "text-teal-700" : "text-slate-400")}>{item.label}</span>
              </Link>
            ))}

            {/* FLOATING ACTION BUTTON (QUICK ACTION) */}
            <div className="relative -top-6">
               <button 
                  onClick={() => setIsQuickOpen(true)}
                  className="w-14 h-14 bg-gradient-to-tr from-teal-600 to-teal-400 rounded-full flex items-center justify-center text-white shadow-xl shadow-teal-500/30 border-4 border-slate-50 active:scale-95 transition-transform"
               >
                  <Plus className="h-7 w-7" strokeWidth={3} />
               </button>
            </div>

            {/* Item 3 & 4 */}
            {menuItems.slice(2, 4).map((item) => (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 w-16">
                <div className={cn("p-1.5 rounded-xl transition-all", pathname === item.href ? "text-teal-600" : "text-slate-400")}>
                  <item.icon className={cn("h-6 w-6", pathname === item.href && "fill-teal-50")} strokeWidth={pathname === item.href ? 2.5 : 2} />
                </div>
                <span className={cn("text-[10px] font-bold", pathname === item.href ? "text-teal-700" : "text-slate-400")}>{item.label}</span>
              </Link>
            ))}
        </nav>
      </div>

      {/* --- QUICK ACTION MODAL --- */}
      <Modal 
        isOpen={isQuickOpen} 
        onClose={() => { setIsQuickOpen(false); setSelectedChild(null); }}
        title="Pilih Anak untuk Diukur"
      >
         {!selectedChild ? (
           <div className="space-y-4">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="Cari nama balita..." 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    value={searchChild}
                    onChange={e => setSearchChild(e.target.value)}
                 />
              </div>
              
              <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-2">
                 {isLoadingChildren ? (
                    <p className="text-center text-sm text-slate-400 py-4">Memuat data anak...</p>
                 ) : filteredChildren.length === 0 ? (
                    <p className="text-center text-sm text-slate-400 py-4">Tidak ada data yang cocok.</p>
                 ) : (
                    filteredChildren.map(child => (
                       <button 
                          key={child.id}
                          onClick={() => setSelectedChild(child)}
                          className="w-full flex items-center justify-between p-3 bg-white border border-slate-100 hover:border-teal-300 hover:bg-teal-50 rounded-xl transition-all text-left group"
                       >
                          <div>
                             <p className="font-bold text-slate-800 group-hover:text-teal-700">{child.name}</p>
                             <p className="text-xs text-slate-500">Ortu: {child.parentName}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500" />
                       </button>
                    ))
                 )}
              </div>
           </div>
         ) : (
           <div className="space-y-6 animate-fade-in">
              <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target Pengukuran</p>
                 <h3 className="text-xl font-bold text-teal-600">{selectedChild.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={() => handleQuickAction("manual")}
                    className="flex flex-col items-center justify-center p-6 bg-white border-2 border-slate-100 hover:border-teal-500 hover:bg-teal-50 rounded-2xl transition-all group"
                 >
                    <div className="w-12 h-12 bg-slate-100 group-hover:bg-teal-100 rounded-full flex items-center justify-center mb-3 transition-colors">
                       <Keyboard className="w-6 h-6 text-slate-500 group-hover:text-teal-600" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-teal-700">Input Manual</span>
                    <span className="text-[10px] text-slate-400 mt-1">Ketik angka biasa</span>
                 </button>

                 <button 
                    onClick={() => handleQuickAction("scan")}
                    className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-teal-500 to-teal-600 border-2 border-teal-500 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-[1.02] rounded-2xl transition-all active:scale-95 text-white"
                 >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3">
                       <Camera className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-white">Smart Scan</span>
                    <span className="text-[10px] text-teal-100 mt-1">Gunakan Kamera AI</span>
                 </button>
              </div>

              <button 
                onClick={() => setSelectedChild(null)} 
                className="w-full text-center text-sm font-semibold text-slate-400 hover:text-slate-600 py-2"
              >
                 Kembali pilih anak
              </button>
           </div>
         )}
      </Modal>

    </div>
  );
}