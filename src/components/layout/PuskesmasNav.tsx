'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  Siren, 
  Utensils, 
  Building2 
} from 'lucide-react';

const menuItems = [
  {
    name: 'Beranda',
    href: '/puskesmas',
    icon: LayoutDashboard,
  },
  {
    name: 'Pantau Wilayah',
    href: '/puskesmas/regional', // Nanti kita buat pagenya
    icon: Map,
  },
  {
    name: 'Intervensi',
    href: '/puskesmas/intervention', // Nanti kita buat pagenya
    icon: Siren,
  },
  {
    name: 'Database Gizi',
    href: '/puskesmas/nutrition',
    icon: Utensils,
  },
  {
    name: 'Profil',
    href: '/puskesmas/profile', // Nanti kita buat pagenya
    icon: Building2,
  },
];

export default function PuskesmasNav() {
  const pathname = usePathname();

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-blue-600">SAESTU</h1>
          <p className="text-xs text-gray-500 font-medium tracking-wider mt-1">PUSKESMAS PANEL</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/puskesmas' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
            <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-blue-600 font-semibold mb-1">Status Sistem</p>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-gray-600">Online & Terhubung</span>
                </div>
            </div>
        </div>
      </aside>

      {/* --- MOBILE BOTTOM BAR (Hidden on Desktop) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <nav className="flex justify-around items-center h-16">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/puskesmas' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-blue-50' : ''}`}>
                    <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}