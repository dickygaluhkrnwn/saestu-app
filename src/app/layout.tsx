import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Font Modern & Friendly
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const fontSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAESTU - Deteksi Dini Stunting",
  description: "Sistem AI untuk deteksi Weight Faltering dan rekomendasi nutrisi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${fontSans.className} antialiased bg-background text-text-main`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}