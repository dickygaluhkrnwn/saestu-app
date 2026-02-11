import { VelocityTable } from "../types";

// WHO Child Growth Standards: 6-month weight increments (g)
// Gender: GIRLS
// Source: lms_weight_girls_6mon_z.pdf
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

// Struktur Data Z-Score Lengkap (Interval 6 Bulan)
export const GIRLS_6MO_INCREMENT_ZSCORES: Record<string, ZScoreData> = {
  "0-6m": { // 0 – 6 mo
    L: -0.1223, M: 4528.9831, S: 0.15945, delta: 450,
    sd3neg: 2395, sd2neg: 2862, sd1neg: 3417, median: 4079,
    sd1: 4870, sd2: 5820, sd3: 6964
  },
  "1-7m": { // 1 – 7 mo
    L: -0.0280, M: 3911.9319, S: 0.17265, delta: 450,
    sd3neg: 1889, sd2neg: 2324, sd1neg: 2843, median: 3462,
    sd1: 4201, sd2: 5085, sd3: 6141
  },
  "2-8m": { // 2 – 8 mo
    L: 0.0799, M: 3327.7315, S: 0.18755, delta: 450,
    sd3neg: 1421, sd2neg: 1824, sd1neg: 2305, median: 2878,
    sd1: 3559, sd2: 4366, sd3: 5320
  },
  "3-9m": { // 3 – 9 mo
    L: 0.1942, M: 2853.3800, S: 0.20514, delta: 450,
    sd3neg: 1032, sd2neg: 1411, sd1neg: 1864, median: 2403,
    sd1: 3039, sd2: 3784, sd3: 4653
  },
  "4-10m": { // 4 – 10 mo
    L: 0.3097, M: 2501.5063, S: 0.22466, delta: 450,
    sd3neg: 725, sd2neg: 1092, sd1neg: 1532, median: 2052,
    sd1: 2658, sd2: 3360, sd3: 4164
  },
  "5-11m": { // 5 – 11 mo
    L: 0.4246, M: 2248.5880, S: 0.24383, delta: 450,
    sd3neg: 486, sd2neg: 852, sd1neg: 1288, median: 1799,
    sd1: 2386, sd2: 3053, sd3: 3802
  },
  "6-12m": { // 6 – 12 mo
    L: 0.5250, M: 2068.2742, S: 0.25997, delta: 450,
    sd3neg: 308, sd2neg: 677, sd1neg: 1114, median: 1618,
    sd1: 2189, sd2: 2825, sd3: 3527
  },
  "7-13m": { // 7 – 13 mo
    L: 0.6042, M: 1939.2944, S: 0.27156, delta: 450,
    sd3neg: 182, sd2neg: 554, sd1neg: 992, median: 1489,
    sd1: 2044, sd2: 2652, sd3: 3311
  },
  "8-14m": { // 8 – 14 mo
    L: 0.6644, M: 1850.4715, S: 0.27943, delta: 450,
    sd3neg: 93, sd2neg: 470, sd1neg: 908, median: 1400,
    sd1: 1941, sd2: 2526, sd3: 3153
  },
  "9-15m": { // 9 – 15 mo
    L: 0.7065, M: 1793.3361, S: 0.28481, delta: 450,
    sd3neg: 34, sd2neg: 415, sd1neg: 855, median: 1343,
    sd1: 1875, sd2: 2444, sd3: 3049
  },
  "10-16m": { // 10 – 16 mo
    L: 0.7288, M: 1758.5512, S: 0.28870, delta: 450,
    sd3neg: -2, sd2neg: 381, sd1neg: 822, median: 1309,
    sd1: 1835, sd2: 2397, sd3: 2991
  },
  "11-17m": { // 11 – 17 mo
    L: 0.7317, M: 1738.3567, S: 0.29175, delta: 450,
    sd3neg: -20, sd2neg: 362, sd1neg: 802, median: 1288,
    sd1: 1815, sd2: 2376, sd3: 2969
  },
  "12-18m": { // 12 – 18 mo
    L: 0.7206, M: 1725.0429, S: 0.29439, delta: 450,
    sd3neg: -26, sd2neg: 352, sd1neg: 789, median: 1275,
    sd1: 1803, sd2: 2368, sd3: 2967
  },
  "13-19m": { // 13 – 19 mo
    L: 0.7016, M: 1713.8691, S: 0.29696, delta: 450,
    sd3neg: -27, sd2neg: 345, sd1neg: 778, median: 1264,
    sd1: 1795, sd2: 2366, sd3: 2974
  },
  "14-20m": { // 14 – 20 mo
    L: 0.6812, M: 1703.1167, S: 0.29971, delta: 450,
    sd3neg: -26, sd2neg: 338, sd1neg: 768, median: 1253,
    sd1: 1787, sd2: 2365, sd3: 2984
  },
  "15-21m": { // 15 – 21 mo
    L: 0.6643, M: 1691.6943, S: 0.30278, delta: 450,
    sd3neg: -30, sd2neg: 330, sd1neg: 756, median: 1242,
    sd1: 1779, sd2: 2364, sd3: 2993
  },
  "16-22m": { // 16 – 22 mo
    L: 0.6534, M: 1677.6772, S: 0.30619, delta: 450,
    sd3neg: -38, sd2neg: 317, sd1neg: 742, median: 1228,
    sd1: 1768, sd2: 2358, sd3: 2995
  },
  "17-23m": { // 17 – 23 mo
    L: 0.6489, M: 1659.9660, S: 0.30991, delta: 450,
    sd3neg: -51, sd2neg: 301, sd1neg: 724, median: 1210,
    sd1: 1752, sd2: 2345, sd3: 2986
  },
  "18-24m": { // 18 – 24 mo
    L: 0.6476, M: 1640.7438, S: 0.31376, delta: 450,
    sd3neg: -66, sd2neg: 283, sd1neg: 705, median: 1191,
    sd1: 1733, sd2: 2328, sd3: 2972
  }
};