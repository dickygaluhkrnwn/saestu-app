import { VelocityTable } from "../types";

// WHO Child Growth Standards: Weight velocity (g/day) by birth-weight groups
// Gender: GIRLS
// Metric: 5th Percentile (Batas Bawah Laju Pertumbuhan Harian)
// Source: weight_vel_birth_to_60_days_girls.pdf & User Data

export const GIRLS_DAILY_VELOCITY_BY_BW: VelocityTable = {
  // Interval 0 - 7 Hari (g/hari)
  "0-7": {
    "2000-2500": null, // *
    "2500-3000": -21,  // Boleh turun 21g per hari
    "3000-3500": -29,
    "3500-4000": -36,
    "4000+": -29,
    "all": -29 
  },
  
  // Interval 7 - 14 Hari (g/hari)
  "7-14": {
    "2000-2500": null, // *
    "2500-3000": -12, 
    "3000-3500": -7,
    "3500-4000": -14,
    "4000+": 0,    // Bayi besar harus stabil (0g/hari minimal)
    "all": -7
  },

  // Interval 14 - 28 Hari (g/hari)
  "14-28": {
    "2000-2500": null, // *
    "2500-3000": 21,   // Mulai naik pesat (Catch-up)
    "3000-3500": 21,
    "3500-4000": 18,
    "4000+": 17,
    "all": 21
  },

  // Interval 28 - 42 Hari (g/hari)
  "28-42": {
    "2000-2500": null, // *
    "2500-3000": 21,
    "3000-3500": 18,
    "3500-4000": 15,
    "4000+": 21,
    "all": 18
  },

  // Interval 42 - 60 Hari (g/hari)
  "42-60": {
    "2000-2500": null, // *
    "2500-3000": 17,
    "3000-3500": 15,
    "3500-4000": 13,
    "4000+": 9,    // Laju melambat untuk bayi besar (Normal)
    "all": 15
  }
};