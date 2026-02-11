import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Font Modern & Friendly
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// Konfigurasi Font
const fontSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Konfigurasi Metadata PWA
export const metadata: Metadata = {
  title: "SAESTU - Deteksi Dini Stunting",
  description: "Sistem AI untuk deteksi Weight Faltering dan rekomendasi nutrisi.",
  manifest: "/manifest.json", // Menghubungkan ke file manifest
  themeColor: "#0d9488",      // Warna tema teal sesuai desain kita
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SAESTU",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
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
        {/* Link tambahan untuk memastikan PWA dikenali di berbagai browser */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${fontSans.className} antialiased bg-background text-text-main`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}