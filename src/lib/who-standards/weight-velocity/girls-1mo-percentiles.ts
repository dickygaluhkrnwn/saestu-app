// WHO Child Growth Standards: 1-month weight increments (g) - Percentiles
// Gender: GIRLS
// Source: lms_weight_girls_1mon_p.pdf
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

export const GIRLS_1MO_INCREMENT_PERCENTILES: Record<string, PercentileData> = {
  // Usia 0 - 4 minggu
  "0-4w": { 
    p1: 280, p3: 388, p5: 446, p15: 602, p25: 697, 
    p50: 879, 
    p75: 1068, p85: 1171, p95: 1348, p97: 1418, p99: 1551 
  },
  
  // Usia 4 minggu - 2 bulan
  "4w-2m": { 
    p1: 410, p3: 519, p5: 578, p15: 734, p25: 829, 
    p50: 1011, 
    p75: 1198, p85: 1301, p95: 1476, p97: 1545, p99: 1677 
  },

  // Usia 2 - 3 bulan
  "2-3m": { 
    p1: 233, p3: 321, p5: 369, p15: 494, p25: 571, 
    p50: 718, 
    p75: 869, p85: 952, p95: 1094, p97: 1150, p99: 1256 
  },

  // Usia 3 - 4 bulan
  "3-4m": { 
    p1: 133, p3: 214, p5: 259, p15: 376, p25: 448, 
    p50: 585, 
    p75: 726, p85: 804, p95: 937, p97: 990, p99: 1090 
  },

  // Usia 4 - 5 bulan
  "4-5m": { 
    p1: 51, p3: 130, p5: 172, p15: 286, p25: 355, 
    p50: 489, 
    p75: 627, p85: 703, p95: 833, p97: 885, p99: 983 
  },

  // Usia 5 - 6 bulan
  "5-6m": { 
    p1: -24, p3: 52, p5: 93, p15: 203, p25: 271, 
    p50: 401, 
    p75: 537, p85: 611, p95: 739, p97: 790, p99: 886 
  },

  // Usia 6 - 7 bulan
  "6-7m": { 
    p1: -79, p3: -4, p5: 37, p15: 146, p25: 214, 
    p50: 344, 
    p75: 480, p85: 555, p95: 684, p97: 734, p99: 832 
  },

  // Usia 7 - 8 bulan
  "7-8m": { 
    p1: -119, p3: -44, p5: -2, p15: 109, p25: 178, 
    p50: 311, 
    p75: 450, p85: 526, p95: 659, p97: 711, p99: 811 
  },

  // Usia 8 - 9 bulan
  "8-9m": { 
    p1: -155, p3: -81, p5: -40, p15: 70, p25: 139, 
    p50: 273, 
    p75: 412, p85: 489, p95: 623, p97: 675, p99: 776 
  },

  // Usia 9 - 10 bulan
  "9-10m": { 
    p1: -184, p3: -110, p5: -70, p15: 41, p25: 110, 
    p50: 245, 
    p75: 385, p85: 464, p95: 598, p97: 652, p99: 754 
  },

  // Usia 10 - 11 bulan
  "10-11m": { 
    p1: -206, p3: -131, p5: -89, p15: 24, p25: 95, 
    p50: 233, 
    p75: 378, p85: 459, p95: 598, p97: 653, p99: 759 
  },

  // Usia 11 - 12 bulan
  "11-12m": { 
    p1: -222, p3: -145, p5: -102, p15: 15, p25: 88, 
    p50: 232, 
    p75: 383, p85: 467, p95: 612, p97: 670, p99: 781 
  }
};