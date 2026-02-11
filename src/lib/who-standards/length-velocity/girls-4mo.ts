// WHO Child Growth Standards: 4-month length increments (cm)
// Gender: GIRLS
// Source: lms_length_girls_4mon_z.pdf
// Metric: -2 SD adalah batas bawah untuk risiko "Length Deceleration" (Stunting Risk)

export type LengthZScoreData = {
  L: number;
  M: number;
  S: number;
  sd3neg: number; // -3 SD
  sd2neg: number; // -2 SD (Warning limit)
  sd1neg: number; // -1 SD
  median: number;
  sd1: number;
  sd2: number;
  sd3: number;
};

export const GIRLS_4MO_LENGTH_INCREMENT_ZSCORES: Record<string, LengthZScoreData> = {
  "0-4m": { // 0 – 4 mo
    L: 0.8123, M: 13.0081, S: 0.10744,
    sd3neg: 9.0, sd2neg: 10.3, sd1neg: 11.6, median: 13.0,
    sd1: 14.4, sd2: 15.9, sd3: 17.3
  },
  "1-5m": { // 1 – 5 mo
    L: 0.8123, M: 10.6621, S: 0.12126,
    sd3neg: 6.9, sd2neg: 8.1, sd1neg: 9.4, median: 10.7,
    sd1: 12.0, sd2: 13.3, sd3: 14.7
  },
  "2-6m": { // 2 – 6 mo
    L: 0.8123, M: 8.7302, S: 0.13625,
    sd3neg: 5.3, sd2neg: 6.4, sd1neg: 7.6, median: 8.7,
    sd1: 9.9, sd2: 11.2, sd3: 12.4
  },
  "3-7m": { // 3 – 7 mo
    L: 0.8123, M: 7.4606, S: 0.15069,
    sd3neg: 4.2, sd2neg: 5.3, sd1neg: 6.4, median: 7.5,
    sd1: 8.6, sd2: 9.8, sd3: 11.0
  },
  "4-8m": { // 4 – 8 mo
    L: 0.8123, M: 6.5992, S: 0.16368,
    sd3neg: 3.5, sd2neg: 4.5, sd1neg: 5.5, median: 6.6,
    sd1: 7.7, sd2: 8.8, sd3: 10.0
  },
  "5-9m": { // 5 – 9 mo
    L: 0.8123, M: 6.0664, S: 0.17240,
    sd3neg: 3.1, sd2neg: 4.0, sd1neg: 5.0, median: 6.1,
    sd1: 7.1, sd2: 8.2, sd3: 9.3
  },
  "6-10m": { // 6 – 10 mo
    L: 0.8123, M: 5.7273, S: 0.17782,
    sd3neg: 2.8, sd2neg: 3.8, sd1neg: 4.7, median: 5.7,
    sd1: 6.8, sd2: 7.8, sd3: 8.9
  },
  "7-11m": { // 7 – 11 mo
    L: 0.8123, M: 5.4731, S: 0.18189,
    sd3neg: 2.7, sd2neg: 3.6, sd1neg: 4.5, median: 5.5,
    sd1: 6.5, sd2: 7.5, sd3: 8.6
  },
  "8-12m": { // 8 – 12 mo
    L: 0.8123, M: 5.2575, S: 0.18562,
    sd3neg: 2.5, sd2neg: 3.4, sd1neg: 4.3, median: 5.3,
    sd1: 6.2, sd2: 7.3, sd3: 8.3
  },
  "9-13m": { // 9 – 13 mo
    L: 0.8123, M: 5.0550, S: 0.18974,
    sd3neg: 2.4, sd2neg: 3.2, sd1neg: 4.1, median: 5.1,
    sd1: 6.0, sd2: 7.0, sd3: 8.1
  },
  "10-14m": { // 10 – 14 mo
    L: 0.8123, M: 4.8763, S: 0.19407,
    sd3neg: 2.2, sd2neg: 3.1, sd1neg: 3.9, median: 4.9,
    sd1: 5.8, sd2: 6.8, sd3: 7.9
  },
  "11-15m": { // 11 – 15 mo
    L: 0.8123, M: 4.7084, S: 0.19893,
    sd3neg: 2.1, sd2neg: 2.9, sd1neg: 3.8, median: 4.7,
    sd1: 5.7, sd2: 6.6, sd3: 7.7
  },
  "12-16m": { // 12 – 16 mo
    L: 0.8123, M: 4.5658, S: 0.20385,
    sd3neg: 2.0, sd2neg: 2.8, sd1neg: 3.7, median: 4.6,
    sd1: 5.5, sd2: 6.5, sd3: 7.5
  },
  "13-17m": { // 13 – 17 mo
    L: 0.8123, M: 4.4427, S: 0.20880,
    sd3neg: 1.9, sd2neg: 2.7, sd1neg: 3.5, median: 4.4,
    sd1: 5.4, sd2: 6.4, sd3: 7.4
  },
  "14-18m": { // 14 – 18 mo
    L: 0.8123, M: 4.3256, S: 0.21372,
    sd3neg: 1.7, sd2neg: 2.6, sd1neg: 3.4, median: 4.3,
    sd1: 5.3, sd2: 6.2, sd3: 7.2
  },
  "15-19m": { // 15 – 19 mo
    L: 0.8123, M: 4.2141, S: 0.21816,
    sd3neg: 1.7, sd2neg: 2.5, sd1neg: 3.3, median: 4.2,
    sd1: 5.2, sd2: 6.1, sd3: 7.1
  },
  "16-20m": { // 16 – 20 mo
    L: 0.8123, M: 4.0974, S: 0.22240,
    sd3neg: 1.6, sd2neg: 2.4, sd1neg: 3.2, median: 4.1,
    sd1: 5.0, sd2: 6.0, sd3: 7.0
  },
  "17-21m": { // 17 – 21 mo
    L: 0.8123, M: 3.9825, S: 0.22623,
    sd3neg: 1.5, sd2neg: 2.3, sd1neg: 3.1, median: 4.0,
    sd1: 4.9, sd2: 5.9, sd3: 6.8
  },
  "18-22m": { // 18 – 22 mo
    L: 0.8123, M: 3.8660, S: 0.22998,
    sd3neg: 1.4, sd2neg: 2.2, sd1neg: 3.0, median: 3.9,
    sd1: 4.8, sd2: 5.7, sd3: 6.7
  },
  "19-23m": { // 19 – 23 mo
    L: 0.8123, M: 3.7559, S: 0.23357,
    sd3neg: 1.3, sd2neg: 2.1, sd1neg: 2.9, median: 3.8,
    sd1: 4.7, sd2: 5.6, sd3: 6.5
  },
  "20-24m": { // 20 – 24 mo
    L: 0.8123, M: 3.6558, S: 0.23694,
    sd3neg: 1.3, sd2neg: 2.0, sd1neg: 2.8, median: 3.7,
    sd1: 4.5, sd2: 5.5, sd3: 6.4
  }
};