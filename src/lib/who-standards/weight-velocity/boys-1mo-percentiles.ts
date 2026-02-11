// WHO Child Growth Standards: 1-month weight increments (g) - Percentiles
// Gender: BOYS
// Source: lms_weight_boys_1mon_p.pdf
// Note: P5 (Percentile 5) adalah batas kritis untuk deteksi dini Weight Faltering.

export type PercentileData = {
  p1: number;
  p3: number;
  p5: number;  // Batas Bawah Kritis
  p15: number;
  p25: number;
  p50: number; // Median (Target Ideal)
  p75: number;
  p85: number;
  p95: number;
  p97: number;
  p99: number;
};

export const BOYS_1MO_INCREMENT_PERCENTILES: Record<string, PercentileData> = {
  // Usia 0 - 4 minggu
  "0-4w": { 
    p1: 182, p3: 369, p5: 460, p15: 681, p25: 805, 
    p50: 1023, 
    p75: 1229, p85: 1336, p95: 1509, p97: 1575, p99: 1697 
  },
  
  // Usia 4 minggu - 2 bulan
  "4w-2m": { 
    p1: 528, p3: 648, p5: 713, p15: 886, p25: 992, 
    p50: 1196, 
    p75: 1408, p85: 1524, p95: 1724, p97: 1803, p99: 1955 
  },

  // Usia 2 - 3 bulan
  "2-3m": { 
    p1: 307, p3: 397, p5: 446, p15: 577, p25: 658, 
    p50: 815, 
    p75: 980, p85: 1071, p95: 1228, p97: 1290, p99: 1410 
  },

  // Usia 3 - 4 bulan
  "3-4m": { 
    p1: 160, p3: 241, p5: 285, p15: 403, p25: 476, 
    p50: 617, 
    p75: 764, p85: 845, p95: 985, p97: 1041, p99: 1147 
  },

  // Usia 4 - 5 bulan
  "4-5m": { 
    p1: 70, p3: 150, p5: 194, p15: 311, p25: 383, 
    p50: 522, 
    p75: 666, p85: 746, p95: 883, p97: 937, p99: 1041 
  },

  // Usia 5 - 6 bulan
  "5-6m": { 
    p1: -17, p3: 61, p5: 103, p15: 217, p25: 287, 
    p50: 422, 
    p75: 563, p85: 640, p95: 773, p97: 826, p99: 927 
  },

  // Usia 6 - 7 bulan
  "6-7m": { 
    p1: -76, p3: 0, p5: 42, p15: 154, p25: 223, 
    p50: 357, 
    p75: 496, p85: 573, p95: 706, p97: 758, p99: 859 
  },

  // Usia 7 - 8 bulan
  "7-8m": { 
    p1: -118, p3: -43, p5: -1, p15: 111, p25: 181, 
    p50: 316, 
    p75: 457, p85: 535, p95: 671, p97: 724, p99: 827 
  },

  // Usia 8 - 9 bulan
  "8-9m": { 
    p1: -153, p3: -77, p5: -36, p15: 77, p25: 148, 
    p50: 285, 
    p75: 429, p85: 508, p95: 646, p97: 701, p99: 806 
  },

  // Usia 9 - 10 bulan
  "9-10m": { 
    p1: -183, p3: -108, p5: -66, p15: 48, p25: 120, 
    p50: 259, 
    p75: 405, p85: 486, p95: 627, p97: 683, p99: 790 
  },

  // Usia 10 - 11 bulan
  "10-11m": { 
    p1: -209, p3: -132, p5: -89, p15: 27, p25: 100, 
    p50: 243, 
    p75: 394, p85: 478, p95: 623, p97: 680, p99: 791 
  },

  // Usia 11 - 12 bulan
  "11-12m": { 
    p1: -229, p3: -150, p5: -106, p15: 15, p25: 91, 
    p50: 239, 
    p75: 397, p85: 484, p95: 635, p97: 695, p99: 811 
  }
};