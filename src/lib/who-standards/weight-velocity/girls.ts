import { VelocityTable } from "../types";

// WHO Child Growth Standards: Weight increments (g) by birth-weight groups
// Gender: GIRLS
// Metric: 5th Percentile (Batas Bawah Aman - Weight Faltering Threshold)
// Source: weight_inc_birth_to_60_days_girls.pdf (Manual Entry from user data)

export const GIRLS_WV_BY_BIRTH_WEIGHT: VelocityTable = {
  // Interval 0 - 7 Hari
  "0-7": {
    "2000-2500": null, // * (n too small)
    "2500-3000": -150,
    "3000-3500": -200,
    "3500-4000": -250,
    "4000+": -200,
    "all": -200 
  },
  
  // Interval 7 - 14 Hari
  "7-14": {
    "2000-2500": null, // *
    "2500-3000": -100, 
    "3000-3500": -50,
    "3500-4000": -100,
    "4000+": 0,
    "all": -50
  },

  // Interval 14 - 28 Hari (2 Minggu)
  "14-28": {
    "2000-2500": null, // *
    "2500-3000": 300, 
    "3000-3500": 300,
    "3500-4000": 250,
    "4000+": 200,
    "all": 300
  },

  // Interval 28 - 42 Hari (1.5 Bulan)
  "28-42": {
    "2000-2500": null, // *
    "2500-3000": 300,
    "3000-3500": 250,
    "3500-4000": 200,
    "4000+": 300,
    "all": 250
  },

  // Interval 42 - 60 Hari (2 Bulan)
  "42-60": {
    "2000-2500": null, // *
    "2500-3000": 300,
    "3000-3500": 289,
    "3500-4000": 250,
    "4000+": 150,
    "all": 288
  }
};