import { VelocityTable } from "../types";

// WHO Child Growth Standards: 1-month weight increments (g)
// Gender: GIRLS
// Source: lms_weight_girls_1mon_z.pdf
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

// Struktur Data Z-Score Lengkap
export const GIRLS_1MO_INCREMENT_ZSCORES: Record<string, ZScoreData> = {
  "0-4w": { // 0 - 4 weeks
    L: 0.7781, M: 1279.4834, S: 0.21479, delta: 400,
    sd3neg: 123, sd2neg: 358, sd1neg: 611, median: 879,
    sd1: 1161, sd2: 1453, sd3: 1757
  },
  "4w-2m": { // 4 weeks - 2 months
    L: 0.7781, M: 1411.1075, S: 0.19384, delta: 400,
    sd3neg: 251, sd2neg: 490, sd1neg: 744, median: 1011,
    sd1: 1290, sd2: 1580, sd3: 1880
  },
  "2-3m": { // 2 - 3 months
    L: 0.7781, M: 1118.0098, S: 0.19766, delta: 400,
    sd3neg: 105, sd2neg: 297, sd1neg: 502, median: 718,
    sd1: 944, sd2: 1178, sd3: 1421
  },
  "3-4m": { // 3 - 4 months
    L: 0.7781, M: 984.8825, S: 0.20995, delta: 400,
    sd3neg: 14, sd2neg: 192, sd1neg: 383, median: 585,
    sd1: 796, sd2: 1016, sd3: 1244
  },
  "4-5m": { // 4 - 5 months
    L: 0.7781, M: 888.9803, S: 0.22671, delta: 400,
    sd3neg: -62, sd2neg: 108, sd1neg: 293, median: 489,
    sd1: 695, sd2: 911, sd3: 1134
  },
  "5-6m": { // 5 - 6 months
    L: 0.7781, M: 801.3910, S: 0.24596, delta: 400,
    sd3neg: -132, sd2neg: 31, sd1neg: 210, median: 401,
    sd1: 604, sd2: 815, sd3: 1036
  },
  "6-7m": { // 6 - 7 months
    L: 0.7781, M: 744.3023, S: 0.26515, delta: 400,
    sd3neg: -185, sd2neg: -24, sd1neg: 153, median: 344,
    sd1: 547, sd2: 760, sd3: 982
  },
  "7-8m": { // 7 - 8 months
    L: 0.7781, M: 710.6923, S: 0.28409, delta: 400,
    sd3neg: -224, sd2neg: -64, sd1neg: 116, median: 311,
    sd1: 519, sd2: 738, sd3: 967
  },
  "8-9m": { // 8 - 9 months
    L: 0.7781, M: 672.6072, S: 0.30106, delta: 400,
    sd3neg: -259, sd2neg: -101, sd1neg: 77, median: 273,
    sd1: 482, sd2: 702, sd3: 933
  },
  "9-10m": { // 9 - 10 months
    L: 0.7781, M: 644.6032, S: 0.31676, delta: 400,
    sd3neg: -286, sd2neg: -131, sd1neg: 48, median: 245,
    sd1: 456, sd2: 679, sd3: 913
  },
  "10-11m": { // 10 - 11 months
    L: 0.7781, M: 633.2166, S: 0.33208, delta: 400,
    sd3neg: -307, sd2neg: -151, sd1neg: 31, median: 233,
    sd1: 451, sd2: 682, sd3: 924
  },
  "11-12m": { // 11 - 12 months
    L: 0.7781, M: 631.7383, S: 0.34627, delta: 400,
    sd3neg: -324, sd2neg: -166, sd1neg: 22, median: 232,
    sd1: 458, sd2: 699, sd3: 953
  }
};