// WHO Growth Standards Engine - Main Controller
import { differenceInDays, differenceInMonths } from "date-fns";

// Import Semua Data Weight
import { GIRLS_1MO_INCREMENT_PERCENTILES } from "./weight-velocity/girls-1mo-percentiles";
import { BOYS_1MO_INCREMENT_PERCENTILES } from "./weight-velocity/boys-1mo-percentiles";
import { GIRLS_2MO_INCREMENT_PERCENTILES } from "./weight-velocity/girls-2mo-percentiles";
import { BOYS_2MO_INCREMENT_PERCENTILES } from "./weight-velocity/boys-2mo-percentiles";
import { GIRLS_3MO_INCREMENT_PERCENTILES } from "./weight-velocity/girls-3mo-percentiles";
import { BOYS_3MO_INCREMENT_PERCENTILES } from "./weight-velocity/boys-3mo-percentiles";
import { GIRLS_4MO_INCREMENT_PERCENTILES } from "./weight-velocity/girls-4mo-percentiles";
import { BOYS_4MO_INCREMENT_PERCENTILES } from "./weight-velocity/boys-4mo-percentiles";
import { GIRLS_6MO_INCREMENT_PERCENTILES } from "./weight-velocity/girls-6mo-percentiles";
import { BOYS_6MO_INCREMENT_PERCENTILES } from "./weight-velocity/boys-6mo-percentiles";

// Import Semua Data Length
import { GIRLS_2MO_LENGTH_INCREMENT_PERCENTILES } from "./length-velocity/girls-2mo-percentiles";
import { BOYS_2MO_LENGTH_INCREMENT_PERCENTILES } from "./length-velocity/boys-2mo-percentiles";
import { GIRLS_3MO_LENGTH_INCREMENT_PERCENTILES } from "./length-velocity/girls-3mo-percentiles";
import { BOYS_3MO_LENGTH_INCREMENT_PERCENTILES } from "./length-velocity/boys-3mo-percentiles";
import { GIRLS_4MO_LENGTH_INCREMENT_PERCENTILES } from "./length-velocity/girls-4mo-percentiles";
import { BOYS_4MO_LENGTH_INCREMENT_PERCENTILES } from "./length-velocity/boys-4mo-percentiles";
import { GIRLS_6MO_LENGTH_INCREMENT_PERCENTILES } from "./length-velocity/girls-6mo-percentiles";
import { BOYS_6MO_LENGTH_INCREMENT_PERCENTILES } from "./length-velocity/boys-6mo-percentiles";

type Gender = "L" | "P";
type MeasurementType = "weight" | "length";

export interface GrowthStatus {
  status: "adequate" | "inadequate" | "excess" | "unknown";
  targetP5: number;   // Batas Bawah (Waspada Stunting/Faltering)
  targetP50: number;  // Target Ideal (Median)
  actualIncrement: number;
  intervalUsed: string; // "1-month", "2-month", etc.
  message: string;
}

// Helper untuk menghitung usia dalam bulan (pembulatan ke bawah)
export const calculateAgeInMonths = (dob: Date, targetDate: Date = new Date()): number => {
  return differenceInMonths(targetDate, dob);
};

/**
 * Menghitung status pertumbuhan berdasarkan standar WHO Velocity
 */
export const calculateGrowthStatus = (
  gender: Gender,
  dob: Date,
  prevDate: Date,
  currDate: Date,
  prevValue: number, // kg atau cm
  currValue: number, // kg atau cm
  type: MeasurementType
): GrowthStatus => {
  
  // 1. Hitung Interval Hari
  const diffDays = differenceInDays(currDate, prevDate);
  const actualIncrement = parseFloat((currValue - prevValue).toFixed(2));

  // Konversi berat ke gram jika type='weight' (karena tabel WHO Weight dalam gram)
  const incrementToCompare = type === "weight" ? actualIncrement * 1000 : actualIncrement;

  // 2. Hitung Usia Awal (Start Age) dalam Bulan
  const ageInMonthsStart = differenceInMonths(prevDate, dob);
  
  // 3. Tentukan Interval yang Cocok ("Bucket")
  let intervalKey: "1mo" | "2mo" | "3mo" | "4mo" | "6mo" | "irregular" = "irregular";

  // Toleransi +/- 10-15 hari untuk setiap bulan
  if (diffDays >= 25 && diffDays <= 45) intervalKey = "1mo";
  else if (diffDays >= 50 && diffDays <= 75) intervalKey = "2mo";
  else if (diffDays >= 80 && diffDays <= 105) intervalKey = "3mo";
  else if (diffDays >= 110 && diffDays <= 135) intervalKey = "4mo";
  else if (diffDays >= 165 && diffDays <= 195) intervalKey = "6mo";

  // Length tidak punya data 1 bulan
  if (type === "length" && intervalKey === "1mo") {
    return {
      status: "unknown",
      targetP5: 0, targetP50: 0, actualIncrement,
      intervalUsed: "1-month (N/A for Length)",
      message: "WHO tidak menyediakan standar kecepatan tinggi badan 1 bulan. Gunakan interval minimal 2 bulan."
    };
  }

  if (intervalKey === "irregular") {
     return {
      status: "unknown",
      targetP5: 0, targetP50: 0, actualIncrement,
      intervalUsed: `${diffDays} days`,
      message: `Jarak pengukuran ${diffDays} hari tidak sesuai standar WHO (1, 2, 3, 4, 6 bulan).`
    };
  }

  // 4. Pilih Tabel yang Tepat
  let selectedTable: any = null;
  
  // --- LOGIC PEMILIHAN TABEL BERAT BADAN ---
  if (type === "weight") {
    if (intervalKey === "1mo") selectedTable = gender === "L" ? BOYS_1MO_INCREMENT_PERCENTILES : GIRLS_1MO_INCREMENT_PERCENTILES;
    if (intervalKey === "2mo") selectedTable = gender === "L" ? BOYS_2MO_INCREMENT_PERCENTILES : GIRLS_2MO_INCREMENT_PERCENTILES;
    if (intervalKey === "3mo") selectedTable = gender === "L" ? BOYS_3MO_INCREMENT_PERCENTILES : GIRLS_3MO_INCREMENT_PERCENTILES;
    if (intervalKey === "4mo") selectedTable = gender === "L" ? BOYS_4MO_INCREMENT_PERCENTILES : GIRLS_4MO_INCREMENT_PERCENTILES;
    if (intervalKey === "6mo") selectedTable = gender === "L" ? BOYS_6MO_INCREMENT_PERCENTILES : GIRLS_6MO_INCREMENT_PERCENTILES;
  }
  
  // --- LOGIC PEMILIHAN TABEL PANJANG BADAN ---
  if (type === "length") {
    if (intervalKey === "2mo") selectedTable = gender === "L" ? BOYS_2MO_LENGTH_INCREMENT_PERCENTILES : GIRLS_2MO_LENGTH_INCREMENT_PERCENTILES;
    if (intervalKey === "3mo") selectedTable = gender === "L" ? BOYS_3MO_LENGTH_INCREMENT_PERCENTILES : GIRLS_3MO_LENGTH_INCREMENT_PERCENTILES;
    if (intervalKey === "4mo") selectedTable = gender === "L" ? BOYS_4MO_LENGTH_INCREMENT_PERCENTILES : GIRLS_4MO_LENGTH_INCREMENT_PERCENTILES;
    if (intervalKey === "6mo") selectedTable = gender === "L" ? BOYS_6MO_LENGTH_INCREMENT_PERCENTILES : GIRLS_6MO_LENGTH_INCREMENT_PERCENTILES;
  }

  if (!selectedTable) return {
    status: "unknown", targetP5: 0, targetP50: 0, actualIncrement, intervalUsed: "Unknown Table", message: "Data tabel tidak ditemukan."
  };

  // 5. Generate Lookup Key
  let lookupKey = "";
  let endMonth = 0;

  if (intervalKey === "1mo") endMonth = ageInMonthsStart + 1;
  if (intervalKey === "2mo") endMonth = ageInMonthsStart + 2;
  if (intervalKey === "3mo") endMonth = ageInMonthsStart + 3;
  if (intervalKey === "4mo") endMonth = ageInMonthsStart + 4;
  if (intervalKey === "6mo") endMonth = ageInMonthsStart + 6;

  // Format key generator
  if (intervalKey === "1mo") {
    // 1-Month special cases
    if (ageInMonthsStart === 0) lookupKey = "0-4w"; 
    else if (ageInMonthsStart === 1 && diffDays < 45) lookupKey = "4w-2m"; 
    else lookupKey = `${ageInMonthsStart}-${endMonth}m`;
  } else {
    // Standard format "2-4m", "4-6m"
    lookupKey = `${ageInMonthsStart}-${endMonth}m`;
  }

  // Fallback Key Check (kadang key di file beda dikit, misal "0-2m" vs "0-2 mo")
  // Kita coba akses langsung. Jika undefined, coba cari yang mirip atau geser index.
  let standardData = selectedTable[lookupKey];
  
  if (!standardData) {
      // Coba format alternatif jika key tidak ketemu
      // Kadang di file ada yang pakai "mo" ada yang "m"
      const altKey = lookupKey.replace("m", "mo"); 
      standardData = selectedTable[altKey];
  }

  if (!standardData) {
    // Fallback logic: Jika anak usia 13 bulan, tapi tabel cuma sampai 12 bulan
    return {
      status: "unknown",
      targetP5: 0, targetP50: 0,
      actualIncrement,
      intervalUsed: intervalKey,
      message: `Data standar tidak tersedia untuk usia ${ageInMonthsStart} bln (Interval ${intervalKey}).`
    };
  }

  // 6. Tentukan Status
  const p5 = standardData.p5;   // Batas Bawah (Weight Faltering)
  const p50 = standardData.p50; // Median (Ideal)
  const p95 = standardData.p95; // Batas Atas

  let status: GrowthStatus["status"] = "adequate";
  let message = "Pertumbuhan ADEKUAT (Normal) ✅";

  if (incrementToCompare < p5) {
    status = "inadequate";
    message = type === "weight" 
      ? `⚠️ WEIGHT FALTERING: Kenaikan ${incrementToCompare.toFixed(0)}g (Min: ${p5}g)` 
      : `⚠️ LENGTH DECELERATION: Pertambahan ${incrementToCompare.toFixed(1)}cm (Min: ${p5}cm)`;
  } else if (incrementToCompare > p95) {
    status = "excess";
    message = "⚠️ Pertumbuhan di atas rata-rata (Pantau risiko obesitas)";
  } else {
    message = `✅ ADEKUAT. Naik ${incrementToCompare.toFixed(0)}${type==='weight'?'g':'cm'} (Target Median: ${p50})`;
  }

  return {
    status,
    targetP5: p5,
    targetP50: p50,
    actualIncrement: incrementToCompare,
    intervalUsed: intervalKey,
    message
  };
};