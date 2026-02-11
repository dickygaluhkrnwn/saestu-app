import { VelocityTable } from "../types";

// WHO Child Growth Standards: 2-month weight increments (g)
// Gender: GIRLS
// Source: lms_weight_girls_2mon_z.pdf
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
export const GIRLS_2MO_INCREMENT_ZSCORES: Record<string, ZScoreData> = {
  "0-2m": { // 0 – 2 months
    L: 0.4599, M: 2497.0406, S: 0.18000, delta: 600,
    sd3neg: 742, sd2neg: 1085, sd1neg: 1469, median: 1897,
    sd1: 2368, sd2: 2884, sd3: 3445
  },
  "1-3m": { // 1 – 3 months
    L: 0.3294, M: 2314.2285, S: 0.17612, delta: 600,
    sd3neg: 695, sd2neg: 991, sd1neg: 1330, median: 1714,
    sd1: 2146, sd2: 2630, sd3: 3167
  },
  "2-4m": { // 2 – 4 months
    L: 0.3128, M: 1907.0116, S: 0.17761, delta: 600,
    sd3neg: 465, sd2neg: 709, sd1neg: 989, median: 1307,
    sd1: 1667, sd2: 2071, sd3: 2522
  },
  "3-5m": { // 3 – 5 months
    L: 0.3560, M: 1673.5778, S: 0.18421, delta: 600,
    sd3neg: 304, sd2neg: 528, sd1neg: 783, median: 1074,
    sd1: 1400, sd2: 1766, sd3: 2172
  },
  "4-6m": { // 4 – 6 months
    L: 0.4264, M: 1482.7466, S: 0.19524, delta: 600,
    sd3neg: 156, sd2neg: 367, sd1neg: 609, median: 883,
    sd1: 1189, sd2: 1528, sd3: 1901
  },
  "5-7m": { // 5 – 7 months
    L: 0.5002, M: 1342.3734, S: 0.20864, delta: 600,
    sd3neg: 34, sd2neg: 241, sd1neg: 477, median: 742,
    sd1: 1037, sd2: 1361, sd3: 1714
  },
  "6-8m": { // 6 – 8 months
    L: 0.5699, M: 1251.4869, S: 0.22315, delta: 600,
    sd3neg: -61, sd2neg: 148, sd1neg: 386, median: 651,
    sd1: 944, sd2: 1263, sd3: 1607
  },
  "7-9m": { // 7 – 9 months
    L: 0.6268, M: 1181.4135, S: 0.23586, delta: 600,
    sd3neg: -136, sd2neg: 75, sd1neg: 315, median: 581,
    sd1: 872, sd2: 1186, sd3: 1522
  },
  "8-10m": { // 8 – 10 months
    L: 0.6730, M: 1116.8192, S: 0.24680, delta: 600,
    sd3neg: -199, sd2neg: 13, sd1neg: 253, median: 517,
    sd1: 803, sd2: 1110, sd3: 1437
  },
  "9-11m": { // 9 – 11 months
    L: 0.7102, M: 1078.3961, S: 0.25656, delta: 600,
    sd3neg: -246, sd2neg: -30, sd1neg: 212, median: 478,
    sd1: 765, sd2: 1070, sd3: 1393
  },
  "10-12m": { // 10 – 12 months
    L: 0.7382, M: 1058.4112, S: 0.26494, delta: 600,
    sd3neg: -280, sd2neg: -60, sd1neg: 188, median: 458,
    sd1: 748, sd2: 1055, sd3: 1378
  },
  "11-13m": { // 11 – 13 months
    L: 0.7605, M: 1040.8737, S: 0.27292, delta: 600,
    sd3neg: -311, sd2neg: -86, sd1neg: 167, median: 441,
    sd1: 734, sd2: 1043, sd3: 1367
  },
  "12-14m": { // 12 – 14 months
    L: 0.7762, M: 1027.9459, S: 0.28011, delta: 600,
    sd3neg: -336, sd2neg: -107, sd1neg: 150, median: 428,
    sd1: 724, sd2: 1037, sd3: 1363
  },
  "13-15m": { // 13 – 15 months
    L: 0.7864, M: 1019.6870, S: 0.28705, delta: 600,
    sd3neg: -358, sd2neg: -125, sd1neg: 137, median: 420,
    sd1: 721, sd2: 1038, sd3: 1368
  },
  "14-16m": { // 14 – 16 months
    L: 0.7913, M: 1016.4898, S: 0.29343, delta: 600,
    sd3neg: -375, sd2neg: -138, sd1neg: 128, median: 416,
    sd1: 723, sd2: 1046, sd3: 1383
  },
  "15-17m": { // 15 – 17 months
    L: 0.7922, M: 1017.5335, S: 0.29961, delta: 600,
    sd3neg: -389, sd2neg: -149, sd1neg: 123, median: 418,
    sd1: 731, sd2: 1062, sd3: 1406
  },
  "16-18m": { // 16 – 18 months
    L: 0.7902, M: 1017.2241, S: 0.30592, delta: 600,
    sd3neg: -402, sd2neg: -159, sd1neg: 117, median: 417,
    sd1: 738, sd2: 1076, sd3: 1428
  },
  "17-19m": { // 17 – 19 months
    L: 0.7866, M: 1012.8511, S: 0.31201, delta: 600,
    sd3neg: -414, sd2neg: -171, sd1neg: 108, median: 413,
    sd1: 739, sd2: 1083, sd3: 1443
  },
  "18-20m": { // 18 – 20 months
    L: 0.7827, M: 1007.2711, S: 0.31824, delta: 600,
    sd3neg: -426, sd2neg: -183, sd1neg: 99, median: 407,
    sd1: 738, sd2: 1088, sd3: 1455
  },
  "19-21m": { // 19 – 21 months
    L: 0.7795, M: 1001.8324, S: 0.32415, delta: 600,
    sd3neg: -438, sd2neg: -194, sd1neg: 89, median: 402,
    sd1: 738, sd2: 1093, sd3: 1466
  },
  "20-22m": { // 20 – 22 months
    L: 0.7771, M: 993.3265, S: 0.33014, delta: 600,
    sd3neg: -450, sd2neg: -207, sd1neg: 78, median: 393,
    sd1: 733, sd2: 1093, sd3: 1471
  },
  "21-23m": { // 21 – 23 months
    L: 0.7755, M: 980.7096, S: 0.33605, delta: 600,
    sd3neg: -462, sd2neg: -221, sd1neg: 64, median: 381,
    sd1: 722, sd2: 1085, sd3: 1466
  },
  "22-24m": { // 22 – 24 months
    L: 0.7743, M: 967.2057, S: 0.34166, delta: 600,
    sd3neg: -474, sd2neg: -234, sd1neg: 50, median: 367,
    sd1: 710, sd2: 1074, sd3: 1457
  }
};