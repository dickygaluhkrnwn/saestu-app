import { VelocityTable } from "../types";

// WHO Child Growth Standards: Weight velocity (g/day) by birth-weight groups
// Gender: BOYS
// Metric: 5th Percentile (Batas Bawah Laju Pertumbuhan Harian)
// Source: weight_vel_birth_to_60_days_boys.pdf & User Data

export const BOYS_DAILY_VELOCITY_BY_BW: VelocityTable = {
  // Interval 0 - 7 Hari (g/hari)
  "0-7": {
    "2000-2500": null, // *
    "2500-3000": -29,
    "3000-3500": -36,
    "3500-4000": -43,
    "4000+": -36,
    "all": -36
  },
  
  // Interval 7 - 14 Hari (g/hari)
  "7-14": {
    "2000-2500": null, // *
    "2500-3000": -14, 
    "3000-3500": -7,
    "3500-4000": -7,
    "4000+": -14,
    "all": -7
  },

  // Interval 14 - 28 Hari (g/hari)
  "14-28": {
    "2000-2500": null, // *
    "2500-3000": 32,
    "3000-3500": 25,
    "3500-4000": 23,
    "4000+": 29,
    "all": 25
  },

  // Interval 28 - 42 Hari (g/hari)
  "28-42": {
    "2000-2500": null, // *
    "2500-3000": 21,
    "3000-3500": 21,
    "3500-4000": 21,
    "4000+": 21,
    "all": 21
  },

  // Interval 42 - 60 Hari (g/hari)
  "42-60": {
    "2000-2500": null, // *
    "2500-3000": 24,
    "3000-3500": 17,
    "3500-4000": 19,
    "4000+": 14,
    "all": 18
  }
};