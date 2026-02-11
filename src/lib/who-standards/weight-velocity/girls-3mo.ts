import { VelocityTable } from "../types";

// WHO Child Growth Standards: 3-month weight increments (g)
// Gender: GIRLS
// Source: lms_weight_girls_3mon_z.pdf
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

// Struktur Data Z-Score Lengkap (Interval 3 Bulan)
export const GIRLS_3MO_INCREMENT_ZSCORES: Record<string, ZScoreData> = {
  "0-3m": { // 0 – 3 months
    L: 0.2298, M: 3403.9240, S: 0.16227, delta: 800,
    sd3neg: 1231, sd2neg: 1629, sd1neg: 2085, median: 2604,
    sd1: 3192, sd2: 3855, sd3: 4600
  },
  "1-4m": { // 1 – 4 months
    L: 0.0924, M: 3054.3512, S: 0.15958, delta: 800,
    sd3neg: 1072, sd2neg: 1409, sd1neg: 1801, median: 2254,
    sd1: 2779, sd2: 3383, sd3: 4079
  },
  "2-5m": { // 2 – 5 months
    L: 0.0599, M: 2618.6440, S: 0.16338, delta: 800,
    sd3neg: 792, sd2neg: 1083, sd1neg: 1422, median: 1819,
    sd1: 2281, sd2: 2819, sd3: 3445
  },
  "3-6m": { // 3 – 6 months
    L: 0.1300, M: 2277.5681, S: 0.16990, delta: 800,
    sd3neg: 544, sd2neg: 809, sd1neg: 1118, median: 1478,
    sd1: 1894, sd2: 2376, sd3: 2931
  },
  "4-7m": { // 4 – 7 months
    L: 0.2404, M: 2030.2917, S: 0.17960, delta: 800,
    sd3neg: 340, sd2neg: 594, sd1neg: 890, median: 1230,
    sd1: 1621, sd2: 2065, sd3: 2570
  },
  "5-8m": { // 5 – 8 months
    L: 0.3580, M: 1855.0162, S: 0.19157, delta: 800,
    sd3neg: 175, sd2neg: 429, sd1neg: 721, median: 1055,
    sd1: 1433, sd2: 1856, sd3: 2328
  },
  "6-9m": { // 6 – 9 months
    L: 0.4576, M: 1724.5802, S: 0.20334, delta: 800,
    sd3neg: 43, sd2neg: 300, sd1neg: 593, median: 925,
    sd1: 1295, sd2: 1704, sd3: 2153
  },
  "7-10m": { // 7 – 10 months
    L: 0.5317, M: 1624.4588, S: 0.21350, delta: 800,
    sd3neg: -58, sd2neg: 201, sd1neg: 495, median: 824,
    sd1: 1189, sd2: 1587, sd3: 2019
  },
  "8-11m": { // 8 – 11 months
    L: 0.5891, M: 1552.7117, S: 0.22168, delta: 800,
    sd3neg: -132, sd2neg: 129, sd1neg: 424, median: 753,
    sd1: 1112, sd2: 1502, sd3: 1921
  },
  "9-12m": { // 9 – 12 months
    L: 0.6373, M: 1506.4120, S: 0.22796, delta: 800,
    sd3neg: -186, sd2neg: 79, sd1neg: 378, median: 706,
    sd1: 1064, sd2: 1448, sd3: 1857
  },
  "10-13m": { // 10 – 13 months
    L: 0.6806, M: 1476.5227, S: 0.23285, delta: 800,
    sd3neg: -228, sd2neg: 43, sd1neg: 346, median: 677,
    sd1: 1033, sd2: 1413, sd3: 1815
  },
  "11-14m": { // 11 – 14 months
    L: 0.7211, M: 1455.9527, S: 0.23682, delta: 800,
    sd3neg: -262, sd2neg: 16, sd1neg: 323, median: 656,
    sd1: 1012, sd2: 1388, sd3: 1784
  },
  "12-15m": { // 12 – 15 months
    L: 0.7527, M: 1442.0871, S: 0.24040, delta: 800,
    sd3neg: -290, sd2neg: -6, sd1neg: 306, median: 642,
    sd1: 999, sd2: 1374, sd3: 1766
  },
  "13-16m": { // 13 – 16 months
    L: 0.7679, M: 1434.2381, S: 0.24403, delta: 800,
    sd3neg: -311, sd2neg: -22, sd1neg: 295, median: 634,
    sd1: 994, sd2: 1371, sd3: 1764
  },
  "14-17m": { // 14 – 17 months
    L: 0.7642, M: 1431.1099, S: 0.24794, delta: 800,
    sd3neg: -323, sd2neg: -33, sd1neg: 287, median: 631,
    sd1: 996, sd2: 1379, sd3: 1779
  },
  "15-18m": { // 15 – 18 months
    L: 0.7482, M: 1429.1551, S: 0.25198, delta: 800,
    sd3neg: -331, sd2neg: -41, sd1neg: 281, median: 629,
    sd1: 1000, sd2: 1392, sd3: 1802
  },
  "16-19m": { // 16 – 19 months
    L: 0.7267, M: 1425.3256, S: 0.25598, delta: 800,
    sd3neg: -337, sd2neg: -49, sd1neg: 274, median: 625,
    sd1: 1002, sd2: 1403, sd3: 1824
  },
  "17-20m": { // 17 – 20 months
    L: 0.7032, M: 1418.4764, S: 0.25989, delta: 800,
    sd3neg: -342, sd2neg: -57, sd1neg: 265, median: 618,
    sd1: 1001, sd2: 1409, sd3: 1841
  },
  "18-21m": { // 18 – 21 months
    L: 0.6782, M: 1409.2288, S: 0.26384, delta: 800,
    sd3neg: -347, sd2neg: -67, sd1neg: 254, median: 609,
    sd1: 996, sd2: 1412, sd3: 1856
  },
  "19-22m": { // 19 – 22 months
    L: 0.6522, M: 1398.1693, S: 0.26792, delta: 800,
    sd3neg: -352, sd2neg: -77, sd1neg: 242, median: 598,
    sd1: 990, sd2: 1414, sd3: 1868
  },
  "20-23m": { // 20 – 23 months
    L: 0.6262, M: 1385.3711, S: 0.27191, delta: 800,
    sd3neg: -358, sd2neg: -87, sd1neg: 228, median: 585,
    sd1: 981, sd2: 1412, sd3: 1878
  },
  "21-24m": { // 21 – 24 months
    L: 0.6013, M: 1370.5464, S: 0.27539, delta: 800,
    sd3neg: -363, sd2neg: -98, sd1neg: 214, median: 571,
    sd1: 968, sd2: 1406, sd3: 1880
  }
};