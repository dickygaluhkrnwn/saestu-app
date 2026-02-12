"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Plus, 
  Search, 
  Baby, 
  ChevronRight, 
  Filter,
  Calendar,
  User as UserIcon,
  MapPin,
  Scale
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toast, ToastType } from "@/components/ui/Toast";

// Services
import { getChildrenByPosyandu, addChild, CreateChildInput } from "@/lib/services/children";
import { getParentsByPosyandu } from "@/lib/services/parents";
import { Child, UserProfile } from "@/types/schema";
import { calculateAgeInMonths } from "@/lib/who-standards";
import { cn } from "@/lib/utils";

export default function ChildrenPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  
  // Data State
  const [children, setChildren] = useState<Child[]>([]);
  const [parents, setParents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  // Form State
  const [formData, setFormData] = useState<CreateChildInput>({
    name: "",
    nik: "",
    gender: "L",
    pob: "",
    dob: "",
    parentName: "",
    parentId: "",
    posyanduId: "",
    initialWeight: 0,
    initialHeight: 0,
  });

  const fetchData = async () => {
    if (!userProfile?.posyanduId) return;
    try {
      const [childrenData, parentsData] = await Promise.all([
        getChildrenByPosyandu(userProfile.posyanduId),
        getParentsByPosyandu(userProfile.posyanduId)
      ]);
      setChildren(childrenData);
      setParents(parentsData);
    } catch (err) {
      console.error(err);
      showToast("Gagal mengambil data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.posyanduId) return;

    setIsSubmitting(true);
    try {
      let parentName = formData.parentName;
      // Jika parentId dipilih, ambil nama dari daftar parents
      if (formData.parentId) {
        const selectedParent = parents.find(p => p.uid === formData.parentId);
        if (selectedParent) parentName = selectedParent.name;
      }

      await addChild({
        ...formData,
        posyanduId: userProfile.posyanduId,
        parentName: parentName,
      });
      
      await fetchData();
      setIsModalOpen(false);
      resetForm();
      showToast("Data Anak berhasil ditambahkan! 🎉", "success");
    } catch (err) {
      showToast("Gagal menambah data anak.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "", nik: "", gender: "L", pob: "", dob: "",
      parentName: "", parentId: "", posyanduId: "",
      initialWeight: 0, initialHeight: 0
    });
  };

  const filteredChildren = children.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nik.includes(searchTerm)
  );

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans pb-24">
      
      {/* --- MODERN HERO HEADER --- */}
      <div className="relative rounded-3xl bg-gradient-to-r from-teal-600 to-teal-500 p-6 md:p-8 shadow-xl shadow-teal-900/5 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
           <Baby className="w-48 h-48 text-white transform translate-x-10 -translate-y-10" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 text-white text-xs font-medium">
                 <MapPin className="w-3.5 h-3.5" />
                 <span>Data Wilayah Terkini</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Data Balita</h1>
              <p className="text-teal-50 text-sm md:text-base max-w-lg leading-relaxed opacity-90">
                 Kelola data tumbuh kembang anak secara digital, akurat, dan terintegrasi untuk generasi sehat.
              </p>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Stat Badge */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex-1 md:flex-none">
                 <div className="bg-white/20 p-2 rounded-xl text-white">
                    <UserIcon className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-xs text-teal-100 font-medium">Total Anak</p>
                    <p className="text-xl font-bold text-white">{children.length}</p>
                 </div>
              </div>

              <Button 
                 className="h-auto py-3 px-6 bg-white text-teal-700 hover:bg-teal-50 hover:scale-105 active:scale-95 border-0 shadow-lg font-bold transition-all"
                 onClick={() => setIsModalOpen(true)}
              >
                 <Plus className="h-5 w-5 mr-2" />
                 Anak Baru
              </Button>
           </div>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md py-2 -mx-2 px-2">
        <div className="relative shadow-sm rounded-2xl group focus-within:shadow-md transition-shadow">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
            <Search className="h-5 w-5 group-focus-within:text-primary transition-colors" />
          </div>
          <Input 
            placeholder="Cari nama anak atau NIK..." 
            className="pl-10 h-12 rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 transition-all text-base shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Filter Icon Visual */}
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
             <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* --- LIST CONTENT --- */}
      <div className="space-y-3">
        {loading ? (
          // SKELETON LOADER (Modern)
          [1, 2, 3].map((i) => (
            <Card key={i} className="flex gap-4 items-center animate-pulse border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-slate-100"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                <div className="h-3 bg-slate-100 rounded w-1/4"></div>
              </div>
            </Card>
          ))
        ) : filteredChildren.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <Baby className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">Belum ada data</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
              Data anak yang Anda tambahkan akan muncul di sini.
            </p>
          </div>
        ) : (
          // DATA LIST
          filteredChildren.map((child) => {
            const age = calculateAgeInMonths(child.dob instanceof Date ? child.dob : (child.dob as any).toDate());
            const isStunted = child.lastLengthStatus === 'inadequate';
            const isUnderweight = child.lastWeightStatus === 'inadequate';
            
            return (
              <Card 
                key={child.id} 
                hoverable
                onClick={() => router.push(`/posyandu/children/${child.id}`)}
                className="group relative cursor-pointer active:scale-[0.99] transition-all border-slate-100 hover:border-teal-200"
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Avatar Gender */}
                  <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-md transition-transform group-hover:scale-105",
                    child.gender === 'L' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-pink-600'
                  )}>
                    {child.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 text-lg truncate group-hover:text-teal-700 transition-colors">
                        {child.name}
                        </h3>
                        {(isStunted || isUnderweight) && (
                            <Badge variant="danger" className="text-[9px] px-1.5 h-5 animate-pulse">Pantau</Badge>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                      <Badge variant="neutral" className="gap-1 font-medium bg-slate-50 border-slate-100 text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {age} Bln
                      </Badge>
                      <span className="flex items-center gap-1 truncate">
                        <UserIcon className="w-3 h-3 text-slate-400" />
                        {child.parentName}
                      </span>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                           <Scale className="w-3 h-3 text-slate-400" /> {child.lastWeight || "-"} kg
                        </div>
                     </div>
                  </div>

                  {/* Action Arrow */}
                  <div className="text-slate-300 group-hover:text-teal-500 transition-colors">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* --- MODAL TAMBAH ANAK (FULL LOGIC RESTORED) --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Registrasi Anak Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section: Identitas */}
          <div className="space-y-4">
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                <Input 
                  required 
                  placeholder="Contoh: Budi Santoso"
                  className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NIK (Opsional)</label>
                   <Input 
                      placeholder="16 Digit"
                      className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
                      value={formData.nik} 
                      onChange={(e) => setFormData({...formData, nik: e.target.value})} 
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                   <div className="relative">
                      <select 
                        className="w-full h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500/20 outline-none px-3 text-sm appearance-none cursor-pointer"
                        value={formData.gender} 
                        onChange={(e) => setFormData({...formData, gender: e.target.value as "L"|"P"})}
                      >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                   </div>
                </div>
             </div>
          </div>

          <div className="h-px bg-slate-100 my-2"></div>

          {/* Section: Kelahiran */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tempat Lahir</label>
                <Input 
                   className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
                   value={formData.pob} 
                   onChange={(e) => setFormData({...formData, pob: e.target.value})} 
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tanggal Lahir</label>
                <Input 
                   type="date" 
                   required 
                   className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
                   value={formData.dob} 
                   onChange={(e) => setFormData({...formData, dob: e.target.value})} 
                />
             </div>
          </div>

          <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100 grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-700 uppercase tracking-wider ml-1">Berat Lahir (kg)</label>
                <Input 
                   type="number" step="0.01" required 
                   className="bg-white border-teal-200 text-center font-bold text-lg h-12 focus:ring-teal-500"
                   value={formData.initialWeight || ""} 
                   onChange={(e) => setFormData({...formData, initialWeight: parseFloat(e.target.value)})} 
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-700 uppercase tracking-wider ml-1">Panjang (cm)</label>
                <Input 
                   type="number" step="0.1" required 
                   className="bg-white border-teal-200 text-center font-bold text-lg h-12 focus:ring-teal-500"
                   value={formData.initialHeight || ""} 
                   onChange={(e) => setFormData({...formData, initialHeight: parseFloat(e.target.value)})} 
                />
             </div>
          </div>

          <div className="h-px bg-slate-100 my-2"></div>

          {/* Section: Orang Tua */}
          <div className="space-y-3">
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Data Orang Tua</label>
                <div className="relative">
                   <select 
                      className="w-full h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500/20 outline-none px-3 text-sm appearance-none cursor-pointer"
                      value={formData.parentId} 
                      onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                   >
                      <option value="">-- Input Manual (Belum Punya Akun) --</option>
                      {parents.map(p => <option key={p.uid} value={p.uid}>{p.name} ({p.email})</option>)}
                   </select>
                   <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
             </div>
             
             {!formData.parentId && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                   <Input 
                      required={!formData.parentId} 
                      placeholder="Nama Ibu/Ayah (Manual)"
                      className="bg-slate-50 border-transparent focus:bg-white transition-all h-11"
                      value={formData.parentName} 
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})} 
                   />
                </div>
             )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button 
               type="button" 
               variant="ghost" 
               className="text-slate-500"
               onClick={() => setIsModalOpen(false)}
            >
               Batal
            </Button>
            <Button 
               type="submit" 
               isLoading={isSubmitting}
               className="bg-teal-600 hover:bg-teal-700 px-6 text-white font-bold shadow-lg shadow-teal-200"
            >
               Simpan Data
            </Button>
          </div>
        </form>
      </Modal>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
    </div>
  );
}