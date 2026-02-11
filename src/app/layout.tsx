import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Import ini

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} antialiased`}>
        {/* Bungkus children dengan Provider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}