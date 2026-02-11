import { VelocityTable } from "../types";

// WHO Child Growth Standards: 3-month weight increments (g)
// Gender: BOYS
// Source: lms_weight_boys_3mon_z.pdf
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
export const BOYS_3MO_INCREMENT_ZSCORES: Record<string, ZScoreData> = {
  "0-3m": { // 0 – 3 months
    L: 0.6854, M: 3638.8730, S: 0.15801, delta: 650,
    sd3neg: 1401, sd2neg: 1899, sd1neg: 2428, median: 2989,
    sd1: 3578, sd2: 4194, sd3: 4836
  },
  "1-4m": { // 1 – 4 months
    L: 0.6503, M: 3215.1010, S: 0.16539, delta: 650,
    sd3neg: 1116, sd2neg: 1565, sd1neg: 2049, median: 2565,
    sd1: 3112, sd2: 3688, sd3: 4293
  },
  "2-5m": { // 2 – 5 months
    L: 0.5884, M: 2661.5629, S: 0.17708, delta: 650,
    sd3neg: 758, sd2neg: 1139, sd1neg: 1558, median: 2012,
    sd1: 2500, sd2: 3022, sd3: 3576
  },
  "3-6m": { // 3 – 6 months
    L: 0.5368, M: 2231.9042, S: 0.18850, delta: 650,
    sd3neg: 488, sd2neg: 815, sd1neg: 1180, median: 1582,
    sd1: 2021, sd2: 2496, sd3: 3007
  },
  "4-7m": { // 4 – 7 months
    L: 0.4999, M: 1939.0717, S: 0.19877, delta: 650,
    sd3neg: 305, sd2neg: 595, sd1neg: 923, median: 1289,
    sd1: 1694, sd2: 2137, sd3: 2618
  },
  "5-8m": { // 5 – 8 months
    L: 0.4819, M: 1745.5952, S: 0.20848, delta: 650,
    sd3neg: 179, sd2neg: 446, sd1neg: 751, median: 1096,
    sd1: 1479, sd2: 1902, sd3: 2365
  },
  "6-9m": { // 6 – 9 months
    L: 0.4866, M: 1611.6464, S: 0.21853, delta: 650,
    sd3neg: 82, sd2neg: 336, sd1neg: 629, median: 962,
    sd1: 1334, sd2: 1745, sd3: 2197
  },
  "7-10m": { // 7 – 10 months
    L: 0.5135, M: 1514.8958, S: 0.22940, delta: 650,
    sd3neg: -2, sd2neg: 248, sd1neg: 537, median: 865,
    sd1: 1232, sd2: 1637, sd3: 2081
  },
  "8-11m": { // 8 – 11 months
    L: 0.5582, M: 1442.6013, S: 0.24108, delta: 650,
    sd3neg: -79, sd2neg: 173, sd1neg: 464, median: 793,
    sd1: 1159, sd2: 1561, sd3: 1998
  },
  "9-12m": { // 9 – 12 months
    L: 0.6092, M: 1387.8840, S: 0.25261, delta: 650,
    sd3neg: -148, sd2neg: 109, sd1neg: 405, median: 738,
    sd1: 1105, sd2: 1506, sd3: 1938
  },
  "10-13m": { // 10 – 13 months
    L: 0.6580, M: 1346.3553, S: 0.26315, delta: 650,
    sd3neg: -208, sd2neg: 56, sd1neg: 358, median: 696,
    sd1: 1066, sd2: 1466, sd3: 1893
  },
  "11-14m": { // 11 – 14 months
    L: 0.7000, M: 1314.9304, S: 0.27214, delta: 650,
    sd3neg: -258, sd2neg: 13, sd1neg: 322, median: 665,
    sd1: 1037, sd2: 1435, sd3: 1858
  },
  "12-15m": { // 12 – 15 months
    L: 0.7323, M: 1291.3726, S: 0.27922, delta: 650,
    sd3neg: -297, sd2neg: -20, sd1neg: 295, median: 641,
    sd1: 1015, sd2: 1412, sd3: 1832
  },
  "13-16m": { // 13 – 16 months
    L: 0.7550, M: 1273.8860, S: 0.28446, delta: 650,
    sd3neg: -326, sd2neg: -44, sd1neg: 275, median: 624,
    sd1: 998, sd2: 1395, sd3: 1811
  },
  "14-17m": { // 14 – 17 months
    L: 0.7695, M: 1261.0053, S: 0.28821, delta: 650,
    sd3neg: -346, sd2neg: -61, sd1neg: 260, median: 611,
    sd1: 986, sd2: 1382, sd3: 1797
  },
  "15-18m": { // 15 – 18 months
    L: 0.7769, M: 1251.6296, S: 0.29074, delta: 650,
    sd3neg: -358, sd2neg: -73, sd1neg: 250, median: 602,
    sd1: 977, sd2: 1372, sd3: 1786
  },
  "16-19m": { // 16 – 19 months
    L: 0.7781, M: 1244.9248, S: 0.29231, delta: 650,
    sd3neg: -365, sd2neg: -79, sd1neg: 244, median: 595,
    sd1: 970, sd2: 1366, sd3: 1779
  },
  "17-20m": { // 17 – 20 months
    L: 0.7740, M: 1240.2027, S: 0.29311, delta: 650,
    sd3neg: -366, sd2neg: -82, sd1neg: 239, median: 590,
    sd1: 965, sd2: 1361, sd3: 1775
  },
  "18-21m": { // 18 – 21 months
    L: 0.7663, M: 1235.8993, S: 0.29350, delta: 650,
    sd3neg: -365, sd2neg: -83, sd1neg: 236, median: 586,
    sd1: 960, sd2: 1357, sd3: 1772
  },
  "19-22m": { // 19 – 22 months
    L: 0.7569, M: 1229.8975, S: 0.29388, delta: 650,
    sd3neg: -363, sd2neg: -85, sd1neg: 232, median: 580,
    sd1: 954, sd2: 1350, sd3: 1767
  },
  "20-23m": { // 20 – 23 months
    L: 0.7475, M: 1220.6029, S: 0.29460, delta: 650,
    sd3neg: -362, sd2neg: -89, sd1neg: 225, median: 571,
    sd1: 943, sd2: 1339, sd3: 1756
  },
  "21-24m": { // 21 – 24 months
    L: 0.7393, M: 1206.8517, S: 0.29591, delta: 650,
    sd3neg: -365, sd2neg: -96, sd1neg: 214, median: 557,
    sd1: 927, sd2: 1322, sd3: 1738
  }
};