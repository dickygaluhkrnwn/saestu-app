import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// Konfigurasi Font
const fontSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Konfigurasi Metadata Lengkap (Termasuk Ikon & PWA)
export const metadata: Metadata = {
  title: "SAESTU - Deteksi Dini Stunting",
  description: "Sistem AI untuk deteksi Weight Faltering dan rekomendasi nutrisi.",
  manifest: "/manifest.json",
  themeColor: "#0d9488",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  
  // Suntikkan Ikon ke Metadata
  icons: {
    icon: "/icons/icon-192x192.png", // Ikon standar browser
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png", // Ikon untuk iOS/Apple
  },

  // Pengaturan khusus untuk Apple Web App (iOS)
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SAESTU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Suntikan manual link ikon sebagai fallback tambahan */}
        <link rel="icon" href="/icons/icon-192x192.png" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* Pengaturan Meta PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${fontSans.className} antialiased bg-background text-text-main`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}