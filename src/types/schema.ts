import { Timestamp } from "firebase/firestore";

// --- USER & AUTH ---
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "master" | "puskesmas" | "kader" | "parent";
  posyanduId?: string; 
  puskesmasId?: string; 
  createdAt: Timestamp | Date;
}

// --- MASTER DATA POSYANDU ---
export interface Posyandu {
  id: string;
  name: string;
  village: string;
  district: string;
  address: string;
  puskesmasId?: string; 
  createdAt: Timestamp | Date;
}

// --- DATA ANAK ---
export interface Child {
  id: string;
  name: string;
  nik: string;
  gender: "L" | "P";
  pob: string; 
  dob: Timestamp | Date;
  
  parentName: string;
  parentId?: string; 
  
  posyanduId: string;
  initialWeight: number;
  initialHeight: number;
  createdAt: Timestamp | Date;

  lastWeightStatus?: "adequate" | "inadequate" | "excess" | "unknown";
  lastLengthStatus?: "adequate" | "inadequate" | "unknown";
  lastMeasurementDate?: Timestamp | Date;
}

// --- PENGUKURAN (CORE LOGIC) ---
export interface Measurement {
  id: string;
  childId: string;
  posyanduId: string;
  date: Timestamp | Date; 
  ageInMonths: number;    
  
  weight: number;         
  height: number;         
  headCircumference?: number; 

  weightStatus: "adequate" | "inadequate" | "excess" | "unknown";
  lengthStatus: "adequate" | "inadequate" | "excess" | "unknown";
  
  weightIncrement?: number; 
  lengthIncrement?: number; 
  
  notes?: string;         
  createdAt: Timestamp | Date;
  createdBy: string;      
}

// --- [BARU] DATABASE MAKANAN LOKAL (NUTRISURVEY FORMAT) ---
export interface MasterFood {
  id: string;
  code: string;       // Kode (cth: ZIN0001)
  name: string;       // Foods (cth: kemiri, beras merah)
  energyKJ: number;   // kJ
  protein: number;    // protein (g)
  fat: number;        // fat (g)
  carbs: number;      // carbohydr. (g)
  puskesmasId: string; // Penanda siapa yang menginput data ini
  createdAt: Timestamp | Date;
}