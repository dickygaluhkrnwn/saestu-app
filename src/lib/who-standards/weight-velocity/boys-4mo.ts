import { VelocityTable } from "../types";

// WHO Child Growth Standards: 4-month weight increments (g)
// Gender: BOYS
// Source: lms_weight_boys_4mon_z.pdf
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
export const BOYS_4MO_INCREMENT_ZSCORES: Record<string, ZScoreData> = {
  "0-4m": { // 0 – 4 mo
    L: 0.7672, M: 4136.2992, S: 0.15684, delta: 500,
    sd3neg: 1807, sd2neg: 2389, sd1neg: 3000, median: 3636,
    sd1: 4297, sd2: 4979, sd3: 5681
  },
  "1-5m": { // 1 – 5 mo
    L: 0.6482, M: 3623.4564, S: 0.17439, delta: 500,
    sd3neg: 1413, sd2neg: 1940, sd1neg: 2511, median: 3123,
    sd1: 3774, sd2: 4462, sd3: 5186
  },
  "2-6m": { // 2 – 6 mo
    L: 0.5632, M: 2900.4470, S: 0.19057, delta: 500,
    sd3neg: 955, sd2neg: 1389, sd1neg: 1871, median: 2400,
    sd1: 2976, sd2: 3597, sd3: 4261
  },
  "3-7m": { // 3 – 7 mo
    L: 0.4863, M: 2424.1094, S: 0.20390, delta: 500,
    sd3neg: 673, sd2neg: 1039, sd1neg: 1456, median: 1924,
    sd1: 2444, sd2: 3017, sd3: 3641
  },
  "4-8m": { // 4 – 8 mo
    L: 0.4302, M: 2106.5547, S: 0.21598, delta: 500,
    sd3neg: 486, sd2neg: 806, sd1neg: 1179, median: 1607,
    sd1: 2090, sd2: 2631, sd3: 3231
  },
  "5-9m": { // 5 – 9 mo
    L: 0.4321, M: 1871.4914, S: 0.22766, delta: 500,
    sd3neg: 333, sd2neg: 627, sd1neg: 973, median: 1371,
    sd1: 1825, sd2: 2336, sd3: 2905
  },
  "6-10m": { // 6 – 10 mo
    L: 0.4881, M: 1711.6071, S: 0.24076, delta: 500,
    sd3neg: 202, sd2neg: 489, sd1neg: 825, median: 1212,
    sd1: 1649, sd2: 2138, sd3: 2678
  },
  "7-11m": { // 7 – 11 mo
    L: 0.5825, M: 1598.0178, S: 0.25575, delta: 500,
    sd3neg: 78, sd2neg: 371, sd1neg: 711, median: 1098,
    sd1: 1528, sd2: 2000, sd3: 2513
  },
  "8-12m": { // 8 – 12 mo
    L: 0.6678, M: 1526.3463, S: 0.27024, delta: 500,
    sd3neg: -25, sd2neg: 281, sd1neg: 633, median: 1026,
    sd1: 1457, sd2: 1921, sd3: 2418
  },
  "9-13m": { // 9 – 13 mo
    L: 0.7242, M: 1473.6287, S: 0.28350, delta: 500,
    sd3neg: -107, sd2neg: 210, sd1neg: 573, median: 974,
    sd1: 1407, sd2: 1870, sd3: 2359
  },
  "10-14m": { // 10 – 14 mo
    L: 0.7587, M: 1423.7181, S: 0.29393, delta: 500,
    sd3neg: -168, sd2neg: 154, sd1neg: 521, median: 924,
    sd1: 1356, sd2: 1815, sd3: 2297
  },
  "11-15m": { // 11 – 15 mo
    L: 0.7822, M: 1370.5468, S: 0.30204, delta: 500,
    sd3neg: -217, sd2neg: 105, sd1neg: 471, median: 871,
    sd1: 1297, sd2: 1748, sd3: 2219
  },
  "12-16m": { // 12 – 16 mo
    L: 0.7966, M: 1334.9524, S: 0.30757, delta: 500,
    sd3neg: -248, sd2neg: 73, sd1neg: 438, median: 835,
    sd1: 1258, sd2: 1702, sd3: 2166
  },
  "13-17m": { // 13 – 17 mo
    L: 0.8054, M: 1321.4376, S: 0.31114, delta: 500,
    sd3neg: -266, sd2neg: 57, sd1neg: 424, median: 821,
    sd1: 1244, sd2: 1688, sd3: 2151
  },
  "14-18m": { // 14 – 18 mo
    L: 0.8084, M: 1315.2621, S: 0.31327, delta: 500,
    sd3neg: -275, sd2neg: 49, sd1neg: 416, median: 815,
    sd1: 1239, sd2: 1684, sd3: 2146
  },
  "15-19m": { // 15 – 19 mo
    L: 0.8041, M: 1308.5472, S: 0.31429, delta: 500,
    sd3neg: -276, sd2neg: 45, sd1neg: 411, median: 809,
    sd1: 1232, sd2: 1676, sd3: 2140
  },
  "16-20m": { // 16 – 20 mo
    L: 0.7912, M: 1297.8646, S: 0.31482, delta: 500,
    sd3neg: -272, sd2neg: 43, sd1neg: 404, median: 798,
    sd1: 1219, sd2: 1663, sd3: 2128
  },
  "17-21m": { // 17 – 21 mo
    L: 0.7712, M: 1284.7539, S: 0.31520, delta: 500,
    sd3neg: -264, sd2neg: 42, sd1neg: 395, median: 785,
    sd1: 1204, sd2: 1648, sd3: 2114
  },
  "18-22m": { // 18 – 22 mo
    L: 0.7469, M: 1271.4590, S: 0.31566, delta: 500,
    sd3neg: -255, sd2neg: 41, sd1neg: 387, median: 771,
    sd1: 1188, sd2: 1633, sd3: 2102
  },
  "19-23m": { // 19 – 23 mo
    L: 0.7222, M: 1262.1643, S: 0.31628, delta: 500,
    sd3neg: -245, sd2neg: 42, sd1neg: 381, median: 762,
    sd1: 1178, sd2: 1625, sd3: 2100
  },
  "20-24m": { // 20 – 24 mo
    L: 0.6991, M: 1257.3339, S: 0.31696, delta: 500,
    sd3neg: -237, sd2neg: 44, sd1neg: 379, median: 757,
    sd1: 1174, sd2: 1625, sd3: 2107
  }
};