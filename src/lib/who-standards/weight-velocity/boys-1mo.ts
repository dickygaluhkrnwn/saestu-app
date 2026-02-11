import { VelocityTable } from "../types";

// WHO Child Growth Standards: 1-month weight increments (g)
// Gender: BOYS
// Source: lms_weight_boys_1mon_z.pdf
// Metric: Menggunakan -2 SD sebagai batas "Tidak Adekuat" (Weight Faltering)

type ZScoreData = {
  L: number;
  M: number;
  S: number;
  delta: number;
  sd3neg: number; // -3 SD
  sd2neg: number; // -2 SD (Ambang Batas Bawah Normal)
  sd1neg: number; // -1 SD
  median: number;
  sd1: number;
  sd2: number;
  sd3: number;
};

// Struktur Data Z-Score Lengkap untuk Laki-laki
export const BOYS_1MO_INCREMENT_ZSCORES: Record<string, ZScoreData> = {
  "0-4w": { // 0 – 4 weeks
    L: 1.3828, M: 1423.0783, S: 0.22048, delta: 400,
    sd3neg: -160, sd2neg: 321, sd1neg: 694, median: 1023,
    sd1: 1325, sd2: 1608, sd3: 1876
  },
  "4w-2m": { // 4 weeks – 2 months
    L: 0.7241, M: 1596.3470, S: 0.19296, delta: 400,
    sd3neg: 354, sd2neg: 615, sd1neg: 897, median: 1196,
    sd1: 1512, sd2: 1844, sd3: 2189
  },
  "2-3m": { // 2 – 3 months
    L: 0.6590, M: 1215.3989, S: 0.19591, delta: 400,
    sd3neg: 178, sd2neg: 372, sd1neg: 585, median: 815,
    sd1: 1061, sd2: 1322, sd3: 1597
  },
  "3-4m": { // 3 – 4 months
    L: 0.7003, M: 1017.0488, S: 0.20965, delta: 400,
    sd3neg: 44, sd2neg: 219, sd1neg: 411, median: 617,
    sd1: 837, sd2: 1069, sd3: 1313
  },
  "4-5m": { // 4 – 5 months
    L: 0.7419, M: 921.6249, S: 0.22790, delta: 400,
    sd3neg: -45, sd2neg: 128, sd1neg: 318, median: 522,
    sd1: 738, sd2: 965, sd3: 1202
  },
  "5-6m": { // 5 – 6 months
    L: 0.7668, M: 822.1842, S: 0.24854, delta: 400,
    sd3neg: -128, sd2neg: 40, sd1neg: 224, median: 422,
    sd1: 632, sd2: 853, sd3: 1083
  },
  "6-7m": { // 6 – 7 months
    L: 0.7688, M: 756.5306, S: 0.26783, delta: 400,
    sd3neg: -183, sd2neg: -21, sd1neg: 161, median: 357,
    sd1: 565, sd2: 785, sd3: 1014
  },
  "7-8m": { // 7 – 8 months
    L: 0.7624, M: 715.6257, S: 0.28677, delta: 400,
    sd3neg: -223, sd2neg: -63, sd1neg: 118, median: 316,
    sd1: 528, sd2: 752, sd3: 987
  },
  "8-9m": { // 8 – 9 months
    L: 0.7620, M: 684.7459, S: 0.30439, delta: 400,
    sd3neg: -256, sd2neg: -98, sd1neg: 84, median: 285,
    sd1: 500, sd2: 729, sd3: 969
  },
  "9-10m": { // 9 – 10 months
    L: 0.7659, M: 658.5809, S: 0.32154, delta: 400,
    sd3neg: -286, sd2neg: -128, sd1neg: 55, median: 259,
    sd1: 478, sd2: 711, sd3: 956
  },
  "10-11m": { // 10 – 11 months
    L: 0.7713, M: 643.4374, S: 0.33882, delta: 400,
    sd3neg: -312, sd2neg: -153, sd1neg: 34, median: 243,
    sd1: 469, sd2: 710, sd3: 963
  },
  "11-12m": { // 11 – 12 months
    L: 0.7761, M: 639.4743, S: 0.35502, delta: 400,
    sd3neg: -333, sd2neg: -172, sd1neg: 22, median: 239,
    sd1: 475, sd2: 726, sd3: 990
  }
};