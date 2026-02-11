import { VelocityTable } from "../types";

// WHO Child Growth Standards: 2-month weight increments (g)
// Gender: BOYS
// Source: lms_weight_boys_2mon_z.pdf
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

// Struktur Data Z-Score Lengkap (Interval 2 Bulan)
export const BOYS_2MO_INCREMENT_ZSCORES: Record<string, ZScoreData> = {
  "0-2m": { // 0 – 2 months
    L: 0.7188, M: 2815.6120, S: 0.17422, delta: 600,
    sd3neg: 862, sd2neg: 1285, sd1neg: 1737, median: 2216,
    sd1: 2718, sd2: 3243, sd3: 3788
  },
  "1-3m": { // 1 – 3 months
    L: 0.6464, M: 2592.0761, S: 0.17025, delta: 600,
    sd3neg: 795, sd2neg: 1165, sd1neg: 1564, median: 1992,
    sd1: 2446, sd2: 2926, sd3: 3430
  },
  "2-4m": { // 2 – 4 months
    L: 0.6071, M: 2038.1036, S: 0.17559, delta: 600,
    sd3neg: 480, sd2neg: 773, sd1neg: 1093, median: 1438,
    sd1: 1808, sd2: 2202, sd3: 2619
  },
  "3-5m": { // 3 – 5 months
    L: 0.5915, M: 1744.8197, S: 0.18708, delta: 600,
    sd3neg: 282, sd2neg: 543, sd1neg: 831, median: 1145,
    sd1: 1484, sd2: 1846, sd3: 2233
  },
  "4-6m": { // 4 – 6 months
    L: 0.5891, M: 1541.3670, S: 0.20130, delta: 600,
    sd3neg: 131, sd2neg: 373, sd1neg: 644, median: 941,
    sd1: 1264, sd2: 1612, sd3: 1984
  },
  "5-7m": { // 5 – 7 months
    L: 0.5954, M: 1377.6979, S: 0.21318, delta: 600,
    sd3neg: 16, sd2neg: 242, sd1neg: 497, median: 778,
    sd1: 1084, sd2: 1414, sd3: 1769
  },
  "6-8m": { // 6 – 8 months
    L: 0.6088, M: 1272.5277, S: 0.22426, delta: 600,
    sd3neg: -64, sd2neg: 154, sd1neg: 400, median: 673,
    sd1: 970, sd2: 1292, sd3: 1636
  },
  "7-9m": { // 7 – 9 months
    L: 0.6270, M: 1201.4599, S: 0.23472, delta: 600,
    sd3neg: -126, sd2neg: 89, sd1neg: 332, median: 601,
    sd1: 896, sd2: 1213, sd3: 1553
  },
  "8-10m": { // 8 – 10 months
    L: 0.6486, M: 1143.8903, S: 0.24611, delta: 600,
    sd3neg: -181, sd2neg: 32, sd1neg: 275, median: 544,
    sd1: 837, sd2: 1153, sd3: 1491
  },
  "9-11m": { // 9 – 11 months
    L: 0.6725, M: 1101.6312, S: 0.25918, delta: 600,
    sd3neg: -233, sd2neg: -18, sd1neg: 229, median: 502,
    sd1: 799, sd2: 1119, sd3: 1459
  },
  "10-12m": { // 10 – 12 months
    L: 0.6959, M: 1077.9049, S: 0.27217, delta: 600,
    sd3neg: -278, sd2neg: -56, sd1neg: 197, median: 478,
    sd1: 783, sd2: 1110, sd3: 1458
  },
  "11-13m": { // 11 – 13 months
    L: 0.7191, M: 1057.9071, S: 0.28462, delta: 600,
    sd3neg: -318, sd2neg: -91, sd1neg: 169, median: 458,
    sd1: 771, sd2: 1105, sd3: 1459
  },
  "12-14m": { // 12 – 14 months
    L: 0.7399, M: 1037.0541, S: 0.29479, delta: 600,
    sd3neg: -353, sd2neg: -122, sd1neg: 144, median: 437,
    sd1: 754, sd2: 1092, sd3: 1448
  },
  "13-15m": { // 13 – 15 months
    L: 0.7597, M: 1014.1850, S: 0.30285, delta: 600,
    sd3neg: -383, sd2neg: -149, sd1neg: 119, median: 414,
    sd1: 732, sd2: 1069, sd3: 1424
  },
  "14-16m": { // 14 – 16 months
    L: 0.7771, M: 1000.5821, S: 0.30864, delta: 600,
    sd3neg: -405, sd2neg: -168, sd1neg: 103, median: 401,
    sd1: 719, sd2: 1057, sd3: 1410
  },
  "15-17m": { // 15 – 17 months
    L: 0.7929, M: 999.4661, S: 0.31290, delta: 600,
    sd3neg: -421, sd2neg: -179, sd1neg: 98, median: 399,
    sd1: 722, sd2: 1061, sd3: 1416
  },
  "16-18m": { // 16 – 18 months
    L: 0.8078, M: 1000.9680, S: 0.31615, delta: 600,
    sd3neg: -434, sd2neg: -187, sd1neg: 95, median: 401,
    sd1: 726, sd2: 1068, sd3: 1424
  },
  "17-19m": { // 17 – 19 months
    L: 0.8210, M: 998.4215, S: 0.31858, delta: 600,
    sd3neg: -446, sd2neg: -195, sd1neg: 90, median: 398,
    sd1: 725, sd2: 1067, sd3: 1422
  },
  "18-20m": { // 18 – 20 months
    L: 0.8335, M: 992.8040, S: 0.32058, delta: 600,
    sd3neg: -457, sd2neg: -203, sd1neg: 84, median: 393,
    sd1: 719, sd2: 1059, sd3: 1412
  },
  "19-21m": { // 19 – 21 months
    L: 0.8447, M: 986.9799, S: 0.32222, delta: 600,
    sd3neg: -467, sd2neg: -211, sd1neg: 78, median: 387,
    sd1: 712, sd2: 1051, sd3: 1401
  },
  "20-22m": { // 20 – 22 months
    L: 0.8554, M: 981.7965, S: 0.32377, delta: 600,
    sd3neg: -477, sd2neg: -218, sd1neg: 72, median: 382,
    sd1: 707, sd2: 1044, sd3: 1391
  },
  "21-23m": { // 21 – 23 months
    L: 0.8655, M: 978.4016, S: 0.32529, delta: 600,
    sd3neg: -486, sd2neg: -224, sd1neg: 68, median: 378,
    sd1: 703, sd2: 1039, sd3: 1385
  },
  "22-24m": { // 22 – 24 months
    L: 0.8748, M: 976.3696, S: 0.32673, delta: 600,
    sd3neg: -495, sd2neg: -230, sd1neg: 65, median: 376,
    sd1: 701, sd2: 1037, sd3: 1382
  }
};