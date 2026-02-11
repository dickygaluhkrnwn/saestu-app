import { VelocityTable } from "../types";

// WHO Child Growth Standards: 6-month weight increments (g)
// Gender: BOYS
// Source: lms_weight_boys_6mon_z.pdf
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
export const BOYS_6MO_INCREMENT_ZSCORES: Record<string, ZScoreData> = {
  "0-6m": { // 0 – 6 mo
    L: 0.5209, M: 4929.7718, S: 0.15679, delta: 350,
    sd3neg: 2524, sd2neg: 3151, sd1neg: 3836, median: 4580,
    sd1: 5382, sd2: 6241, sd3: 7158
  },
  "1-7m": { // 1 – 7 mo
    L: 0.4856, M: 4243.2925, S: 0.17552, delta: 350,
    sd3neg: 1960, sd2neg: 2538, sd1neg: 3182, median: 3893,
    sd1: 4672, sd2: 5518, sd3: 6432
  },
  "2-8m": { // 2 – 8 mo
    L: 0.4609, M: 3442.9150, S: 0.19228, delta: 350,
    sd3neg: 1411, sd2neg: 1905, sd1neg: 2465, median: 3093,
    sd1: 3789, sd2: 4556, sd3: 5392
  },
  "3-9m": { // 3 – 9 mo
    L: 0.4490, M: 2879.5905, S: 0.20802, delta: 350,
    sd3neg: 1035, sd2neg: 1467, sd1neg: 1965, median: 2530,
    sd1: 3163, sd2: 3867, sd3: 4642
  },
  "4-10m": { // 4 – 10 mo
    L: 0.4511, M: 2501.8054, S: 0.22426, delta: 350,
    sd3neg: 772, sd2neg: 1166, sd1neg: 1625, median: 2152,
    sd1: 2748, sd2: 3414, sd3: 4152
  },
  "5-11m": { // 5 – 11 mo
    L: 0.4660, M: 2220.6833, S: 0.24197, delta: 350,
    sd3neg: 566, sd2neg: 933, sd1neg: 1368, median: 1871,
    sd1: 2443, sd2: 3086, sd3: 3800
  },
  "6-12m": { // 6 – 12 mo
    L: 0.4895, M: 2037.9406, S: 0.26076, delta: 350,
    sd3neg: 410, sd2neg: 766, sd1neg: 1192, median: 1688,
    sd1: 2255, sd2: 2893, sd3: 3602
  },
  "7-13m": { // 7 – 13 mo
    L: 0.5168, M: 1903.1830, S: 0.27848, delta: 350,
    sd3neg: 288, sd2neg: 637, sd1neg: 1059, median: 1553,
    sd1: 2119, sd2: 2755, sd3: 3461
  },
  "8-14m": { // 8 – 14 mo
    L: 0.5442, M: 1794.7774, S: 0.29319, delta: 350,
    sd3neg: 192, sd2neg: 536, sd1neg: 954, median: 1445,
    sd1: 2006, sd2: 2636, sd3: 3333
  },
  "9-15m": { // 9 – 15 mo
    L: 0.5697, M: 1709.1588, S: 0.30394, delta: 350,
    sd3neg: 122, sd2neg: 460, sd1neg: 874, median: 1359,
    sd1: 1912, sd2: 2531, sd3: 3212
  },
  "10-16m": { // 10 – 16 mo
    L: 0.5943, M: 1651.4150, S: 0.31109, delta: 350,
    sd3neg: 73, sd2neg: 409, sd1neg: 821, median: 1301,
    sd1: 1847, sd2: 2454, sd3: 3120
  },
  "11-17m": { // 11 – 17 mo
    L: 0.6190, M: 1616.6162, S: 0.31517, delta: 350,
    sd3neg: 40, sd2neg: 377, sd1neg: 789, median: 1267,
    sd1: 1806, sd2: 2403, sd3: 3053
  },
  "12-18m": { // 12 – 18 mo
    L: 0.6428, M: 1590.6081, S: 0.31683, delta: 350,
    sd3neg: 16, sd2neg: 355, sd1neg: 766, median: 1241,
    sd1: 1772, sd2: 2357, sd3: 2990
  },
  "13-19m": { // 13 – 19 mo
    L: 0.6649, M: 1571.5549, S: 0.31675, delta: 350,
    sd3neg: 0, sd2neg: 340, sd1neg: 751, median: 1222,
    sd1: 1745, sd2: 2316, sd3: 2932
  },
  "14-20m": { // 14 – 20 mo
    L: 0.6849, M: 1557.0267, S: 0.31549, delta: 350,
    sd3neg: -11, sd2neg: 331, sd1neg: 741, median: 1207,
    sd1: 1722, sd2: 2281, sd3: 2880
  },
  "15-21m": { // 15 – 21 mo
    L: 0.7027, M: 1545.9058, S: 0.31347, delta: 350,
    sd3neg: -18, sd2neg: 326, sd1neg: 735, median: 1196,
    sd1: 1702, sd2: 2249, sd3: 2832
  },
  "16-22m": { // 16 – 22 mo
    L: 0.7187, M: 1533.6871, S: 0.31113, delta: 350,
    sd3neg: -23, sd2neg: 322, sd1neg: 728, median: 1184,
    sd1: 1681, sd2: 2215, sd3: 2783
  },
  "17-23m": { // 17 – 23 mo
    L: 0.7336, M: 1520.6160, S: 0.30878, delta: 350,
    sd3neg: -27, sd2neg: 318, sd1neg: 721, median: 1171,
    sd1: 1659, sd2: 2181, sd3: 2733
  },
  "18-24m": { // 18 – 24 mo
    L: 0.7478, M: 1508.4744, S: 0.30647, delta: 350,
    sd3neg: -31, sd2neg: 314, sd1neg: 715, median: 1158,
    sd1: 1638, sd2: 2148, sd3: 2687
  }
};