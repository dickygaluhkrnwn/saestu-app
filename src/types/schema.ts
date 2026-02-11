import { Timestamp } from "firebase/firestore";

export interface Posyandu {
  id: string;
  name: string;
  village: string;
  district: string;
  address: string;
  createdAt: Timestamp | Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "master" | "puskesmas" | "kader" | "parent";
  posyanduId?: string;
  createdAt: Timestamp | Date;
}

export interface Child {
  id: string;
  name: string;
  nik: string;
  gender: "L" | "P";
  pob: string;
  dob: Timestamp | Date;
  parentName: string;
  posyanduId: string;
  initialWeight: number;
  initialHeight: number;
  createdAt: Timestamp | Date;
}

// --- TAMBAHAN BARU ---
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
  
  weightIncrement?: number; // Kenaikan berat (gram)
  lengthIncrement?: number; // Pertambahan panjang (cm)
  
  notes?: string;         // Pesan analisis (misal: "Hati-hati, kenaikan kurang")
  createdAt: Timestamp | Date;
  createdBy: string;      // ID Kader penginput
}