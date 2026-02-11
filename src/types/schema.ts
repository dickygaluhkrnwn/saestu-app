import { Timestamp } from "firebase/firestore";

// --- USER & AUTH ---
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "master" | "puskesmas" | "kader" | "parent";
  posyanduId?: string; // Optional: Hanya untuk Kader
  puskesmasId?: string; // Optional: Hanya untuk Petugas Puskesmas
  createdAt: Timestamp | Date;
}

// --- MASTER DATA ---
export interface Posyandu {
  id: string;
  name: string;
  village: string;
  district: string;
  address: string;
  puskesmasId?: string; // Optional link ke Puskesmas
  createdAt: Timestamp | Date;
}

// --- DATA ANAK ---
export interface Child {
  id: string;
  name: string;
  nik: string;
  gender: "L" | "P";
  pob: string; // Place of Birth
  dob: Timestamp | Date;
  
  parentName: string;
  parentId?: string; // [BARU] Link ke UserProfile (Role: Parent) jika ortu sudah punya akun
  
  posyanduId: string;
  initialWeight: number;
  initialHeight: number;
  createdAt: Timestamp | Date;

  // [BARU] Field Denormalisasi untuk Dashboard & Performa
  // Di-update setiap kali ada pengukuran baru
  lastWeightStatus?: "adequate" | "inadequate" | "excess" | "unknown";
  lastLengthStatus?: "adequate" | "inadequate" | "unknown";
  lastMeasurementDate?: Timestamp | Date;
}

// --- PENGUKURAN (CORE LOGIC) ---
export interface Measurement {
  id: string;
  childId: string;
  posyanduId: string;
  date: Timestamp | Date; // Tanggal pengukuran
  ageInMonths: number;    // Usia saat ukur
  
  weight: number;         // Berat (kg)
  height: number;         // Tinggi/Panjang (cm)
  headCircumference?: number; // Lingkar Kepala (opsional)

  // Hasil Analisis WHO Engine
  weightStatus: "adequate" | "inadequate" | "excess" | "unknown";
  lengthStatus: "adequate" | "inadequate" | "excess" | "unknown";
  
  weightIncrement?: number; // Kenaikan berat (gram) dari pengukuran sebelumnya
  lengthIncrement?: number; // Pertambahan panjang (cm) dari pengukuran sebelumnya
  
  notes?: string;         // Pesan analisis (misal: "Hati-hati, kenaikan kurang")
  createdAt: Timestamp | Date;
  createdBy: string;      // ID Kader penginput
}