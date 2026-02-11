import { VelocityTable } from "../types";

// WHO Child Growth Standards: Weight increments (g) by birth-weight groups
// Gender: BOYS
// Metric: 5th Percentile (Batas Bawah Aman)
// Source: weight_inc_birth_to_60_days_boys.pdf & User Data

export const BOYS_WV_BY_BIRTH_WEIGHT: VelocityTable = {
  // Interval 0 - 7 Hari
  "0-7": {
    "2000-2500": null, // *
    "2500-3000": -200, // Toleransi turun lebih besar dibanding perempuan (-150)
    "3000-3500": -250,
    "3500-4000": -300,
    "4000+": -250,
    "all": -250 
  },
  
  // Interval 7 - 14 Hari
  "7-14": {
    "2000-2500": null, // *
    "2500-3000": -100, 
    "3000-3500": -50,
    "3500-4000": -50,
    "4000+": -100,
    "all": -50
  },

  // Interval 14 - 28 Hari (2 Minggu)
  "14-28": {
    "2000-2500": null, // *
    "2500-3000": 450, // Laju tumbuh kejar tinggi
    "3000-3500": 350,
    "3500-4000": 350,
    "4000+": 400,
    "all": 350
  },

  // Interval 28 - 42 Hari (1.5 Bulan)
  "28-42": {
    "2000-2500": null, // *
    "2500-3000": 300,
    "3000-3500": 300,
    "3500-4000": 300,
    "4000+": 300, // Sangat merata di semua grup
    "all": 300
  },

  // Interval 42 - 60 Hari (2 Bulan)
  "42-60": {
    "2000-2500": null, // *
    "2500-3000": 450,
    "3000-3500": 350,
    "3500-4000": 350,
    "4000+": 217, // Angka spesifik dari tabel (217g)
    "all": 350
  }
};