import { VelocityTable } from "../types";

// WHO Child Growth Standards: 4-month weight increments (g)
// Gender: GIRLS
// Source: lms_weight_girls_4mon_z.pdf
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

// Struktur Data Z-Score Lengkap (Interval 4 Bulan)
export const GIRLS_4MO_INCREMENT_ZSCORES: Record<string, ZScoreData> = {
  "0-4m": { // 0 – 4 mo
    L: 0.0891, M: 4009.5248, S: 0.15636, delta: 800,
    sd3neg: 1683, sd2neg: 2120, sd1neg: 2625, median: 3210,
    sd1: 3883, sd2: 4658, sd3: 5548
  },
  "1-5m": { // 1 – 5 mo
    L: -0.0491, M: 3541.1498, S: 0.16054, delta: 800,
    sd3neg: 1400, sd2neg: 1775, sd1neg: 2218, median: 2741,
    sd1: 3360, sd2: 4094, sd3: 4965
  },
  "2-6m": { // 2 – 6 mo
    L: -0.0362, M: 3002.2985, S: 0.16706, delta: 800,
    sd3neg: 1027, sd2neg: 1354, sd1neg: 1742, median: 2202,
    sd1: 2750, sd2: 3402, sd3: 4179
  },
  "3-7m": { // 3 – 7 mo
    L: 0.0557, M: 2616.8194, S: 0.17682, delta: 800,
    sd3neg: 727, sd2neg: 1031, sd1neg: 1391, median: 1817,
    sd1: 2320, sd2: 2914, sd3: 3614
  },
  "4-8m": { // 4 – 8 mo
    L: 0.1899, M: 2331.5089, S: 0.18968, delta: 800,
    sd3neg: 477, sd2neg: 773, sd1neg: 1122, median: 1532,
    sd1: 2009, sd2: 2563, sd3: 3202
  },
  "5-9m": { // 5 – 9 mo
    L: 0.3154, M: 2118.7222, S: 0.20292, delta: 800,
    sd3neg: 278, sd2neg: 572, sd1neg: 918, median: 1319,
    sd1: 1779, sd2: 2304, sd3: 2898
  },
  "6-10m": { // 6 – 10 mo
    L: 0.4069, M: 1963.5334, S: 0.21481, delta: 800,
    sd3neg: 130, sd2neg: 424, sd1neg: 768, median: 1164,
    sd1: 1613, sd2: 2117, sd3: 2680
  },
  "7-11m": { // 7 – 11 mo
    L: 0.4873, M: 1855.0205, S: 0.22441, delta: 800,
    sd3neg: 20, sd2neg: 318, sd1neg: 663, median: 1055,
    sd1: 1495, sd2: 1984, sd3: 2521
  },
  "8-12m": { // 8 – 12 mo
    L: 0.5659, M: 1780.1251, S: 0.23120, delta: 800,
    sd3neg: -62, sd2neg: 241, sd1neg: 589, median: 980,
    sd1: 1412, sd2: 1884, sd3: 2396
  },
  "9-13m": { // 9 – 13 mo
    L: 0.6483, M: 1726.3407, S: 0.23622, delta: 800,
    sd3neg: -132, sd2neg: 182, sd1neg: 536, median: 926,
    sd1: 1351, sd2: 1807, sd3: 2293
  },
  "10-14m": { // 10 – 14 mo
    L: 0.7201, M: 1691.6549, S: 0.23980, delta: 800,
    sd3neg: -186, sd2neg: 139, sd1neg: 500, median: 892,
    sd1: 1310, sd2: 1754, sd3: 2220
  },
  "11-15m": { // 11 – 15 mo
    L: 0.7759, M: 1668.6291, S: 0.24275, delta: 800,
    sd3neg: -229, sd2neg: 107, sd1neg: 475, median: 869,
    sd1: 1284, sd2: 1719, sd3: 2172
  },
  "12-16m": { // 12 – 16 mo
    L: 0.8064, M: 1655.3840, S: 0.24522, delta: 800,
    sd3neg: -257, sd2neg: 87, sd1neg: 460, median: 855,
    sd1: 1271, sd2: 1702, sd3: 2149
  },
  "13-17m": { // 13 – 17 mo
    L: 0.8111, M: 1648.5922, S: 0.24757, delta: 800,
    sd3neg: -271, sd2neg: 75, sd1neg: 451, median: 849,
    sd1: 1266, sd2: 1700, sd3: 2148
  },
  "14-18m": { // 14 – 18 mo
    L: 0.7924, M: 1643.8520, S: 0.25015, delta: 800,
    sd3neg: -274, sd2neg: 69, sd1neg: 444, median: 844,
    sd1: 1265, sd2: 1705, sd3: 2162
  },
  "15-19m": { // 15 – 19 mo
    L: 0.7577, M: 1638.7127, S: 0.25299, delta: 800,
    sd3neg: -270, sd2neg: 66, sd1neg: 437, median: 839,
    sd1: 1265, sd2: 1715, sd3: 2185
  },
  "16-20m": { // 16 – 20 mo
    L: 0.7139, M: 1631.2189, S: 0.25623, delta: 800,
    sd3neg: -265, sd2neg: 62, sd1neg: 429, median: 831,
    sd1: 1264, sd2: 1725, sd3: 2210
  },
  "17-21m": { // 17 – 21 mo
    L: 0.6699, M: 1621.0212, S: 0.25952, delta: 800,
    sd3neg: -261, sd2neg: 57, sd1neg: 419, median: 821,
    sd1: 1259, sd2: 1731, sd3: 2233
  },
  "18-22m": { // 18 – 22 mo
    L: 0.6227, M: 1607.4454, S: 0.26290, delta: 800,
    sd3neg: -257, sd2neg: 50, sd1neg: 406, median: 807,
    sd1: 1251, sd2: 1733, sd3: 2253
  },
  "19-23m": { // 19 – 23 mo
    L: 0.5732, M: 1591.7399, S: 0.26613, delta: 800,
    sd3neg: -253, sd2neg: 44, sd1neg: 393, median: 792,
    sd1: 1239, sd2: 1733, sd3: 2272
  },
  "20-24m": { // 20 – 24 mo
    L: 0.5249, M: 1576.2729, S: 0.26914, delta: 800,
    sd3neg: -249, sd2neg: 37, sd1neg: 379, median: 776,
    sd1: 1228, sd2: 1732, sd3: 2290
  }
};