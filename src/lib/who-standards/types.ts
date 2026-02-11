// Tipe untuk rentang berat lahir (Birth Weight Groups)
export type BirthWeightGroup = 
  | "2000-2500" 
  | "2500-3000" 
  | "3000-3500" 
  | "3500-4000" 
  | "4000+" 
  | "all"; // Fallback jika berat lahir tidak diketahui

// Struktur Tabel Velocity per Interval Waktu
export type VelocityTable = {
  [intervalDays: string]: { // Contoh key: "0-7", "7-14"
    [bwGroup in BirthWeightGroup]: number | null; // null jika datanya "*" (tidak tersedia)
  }
};

// Interface untuk Output Kalkulasi
export interface GrowthCheckResult {
  status: "adequate" | "inadequate" | "unknown";
  targetIncrement: number;
  actualIncrement: number;
  notes: string;
}