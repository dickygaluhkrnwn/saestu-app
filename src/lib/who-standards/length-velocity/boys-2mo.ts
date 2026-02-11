// WHO Child Growth Standards: 2-month length increments (cm)
// Gender: BOYS
// Source: lms_length_boys_2mon_z.pdf
// Metric: -2 SD adalah batas bawah untuk risiko "Length Deceleration" (Stunting Risk)

export type LengthZScoreData = {
  L: number;
  M: number;
  S: number;
  sd3neg: number; // -3 SD (Stunted growth velocity)
  sd2neg: number; // -2 SD (Warning limit)
  sd1neg: number; // -1 SD
  median: number;
  sd1: number;
  sd2: number;
  sd3: number;
};

export const BOYS_2MO_LENGTH_INCREMENT_ZSCORES: Record<string, LengthZScoreData> = {
  "0-2m": { // 0 – 2 mo
    L: 0.9497, M: 8.4820, S: 0.13400,
    sd3neg: 5.1, sd2neg: 6.2, sd1neg: 7.3, median: 8.5,
    sd1: 9.6, sd2: 10.8, sd3: 11.9
  },
  "1-3m": { // 1 – 3 mo
    L: 0.9497, M: 6.9984, S: 0.14062,
    sd3neg: 4.1, sd2neg: 5.0, sd1neg: 6.0, median: 7.0,
    sd1: 8.0, sd2: 9.0, sd3: 10.0
  },
  "2-4m": { // 2 – 4 mo
    L: 0.9497, M: 5.5716, S: 0.17179,
    sd3neg: 2.7, sd2neg: 3.7, sd1neg: 4.6, median: 5.6,
    sd1: 6.5, sd2: 7.5, sd3: 8.5
  },
  "3-5m": { // 3 – 5 mo
    L: 0.9497, M: 4.4941, S: 0.20929,
    sd3neg: 1.7, sd2neg: 2.6, sd1neg: 3.6, median: 4.5,
    sd1: 5.4, sd2: 6.4, sd3: 7.4
  },
  "4-6m": { // 4 – 6 mo
    L: 0.9497, M: 3.7228, S: 0.24323,
    sd3neg: 1.1, sd2neg: 1.9, sd1neg: 2.8, median: 3.7,
    sd1: 4.6, sd2: 5.6, sd3: 6.5
  },
  "5-7m": { // 5 – 7 mo
    L: 0.9497, M: 3.2403, S: 0.26837,
    sd3neg: 0.7, sd2neg: 1.5, sd1neg: 2.4, median: 3.2,
    sd1: 4.1, sd2: 5.0, sd3: 5.9
  },
  "6-8m": { // 6 – 8 mo
    L: 0.9497, M: 2.9661, S: 0.28481,
    sd3neg: 0.5, sd2neg: 1.3, sd1neg: 2.1, median: 3.0,
    sd1: 3.8, sd2: 4.7, sd3: 5.5
  },
  "7-9m": { // 7 – 9 mo
    L: 0.9497, M: 2.8089, S: 0.29636,
    sd3neg: 0.4, sd2neg: 1.2, sd1neg: 2.0, median: 2.8,
    sd1: 3.6, sd2: 4.5, sd3: 5.4
  },
  "8-10m": { // 8 – 10 mo
    L: 0.9497, M: 2.6901, S: 0.30505,
    sd3neg: 0.3, sd2neg: 1.1, sd1neg: 1.9, median: 2.7,
    sd1: 3.5, sd2: 4.4, sd3: 5.2
  },
  "9-11m": { // 9 – 11 mo
    L: 0.9497, M: 2.5785, S: 0.31391,
    sd3neg: 0.2, sd2neg: 1.0, sd1neg: 1.8, median: 2.6,
    sd1: 3.4, sd2: 4.2, sd3: 5.1
  },
  "10-12m": { // 10 – 12 mo
    L: 0.9497, M: 2.4724, S: 0.32400,
    sd3neg: 0.2, sd2neg: 0.9, sd1neg: 1.7, median: 2.5,
    sd1: 3.3, sd2: 4.1, sd3: 4.9
  },
  "11-13m": { // 11 – 13 mo
    L: 0.9497, M: 2.3818, S: 0.33613,
    sd3neg: 0.1, sd2neg: 0.8, sd1neg: 1.6, median: 2.4,
    sd1: 3.2, sd2: 4.0, sd3: 4.8
  },
  "12-14m": { // 12 – 14 mo
    L: 0.9497, M: 2.2978, S: 0.34908,
    sd3neg: 0.0, sd2neg: 0.7, sd1neg: 1.5, median: 2.3,
    sd1: 3.1, sd2: 3.9, sd3: 4.8
  },
  "13-15m": { // 13 – 15 mo
    L: 0.9497, M: 2.2138, S: 0.36174,
    sd3neg: 0.0, sd2neg: 0.7, sd1neg: 1.4, median: 2.2,
    sd1: 3.0, sd2: 3.8, sd3: 4.7
  },
  "14-16m": { // 14 – 16 mo
    L: 0.9497, M: 2.1357, S: 0.37410,
    sd3neg: 0.0, sd2neg: 0.6, sd1neg: 1.3, median: 2.1,
    sd1: 2.9, sd2: 3.8, sd3: 4.6
  },
  "15-17m": { // 15 – 17 mo
    L: 0.9497, M: 2.0675, S: 0.38645,
    sd3neg: 0.0, sd2neg: 0.5, sd1neg: 1.3, median: 2.1,
    sd1: 2.9, sd2: 3.7, sd3: 4.5
  },
  "16-18m": { // 16 – 18 mo
    L: 0.9497, M: 2.0061, S: 0.39924,
    sd3neg: 0.0, sd2neg: 0.4, sd1neg: 1.2, median: 2.0,
    sd1: 2.8, sd2: 3.6, sd3: 4.5
  },
  "17-19m": { // 17 – 19 mo
    L: 0.9497, M: 1.9495, S: 0.41274,
    sd3neg: 0.0, sd2neg: 0.4, sd1neg: 1.2, median: 1.9,
    sd1: 2.8, sd2: 3.6, sd3: 4.4
  },
  "18-20m": { // 18 – 20 mo
    L: 0.9497, M: 1.8972, S: 0.42656,
    sd3neg: 0.0, sd2neg: 0.3, sd1neg: 1.1, median: 1.9,
    sd1: 2.7, sd2: 3.5, sd3: 4.4
  },
  "19-21m": { // 19 – 21 mo
    L: 0.9497, M: 1.8490, S: 0.44029,
    sd3neg: 0.0, sd2neg: 0.3, sd1neg: 1.0, median: 1.8,
    sd1: 2.7, sd2: 3.5, sd3: 4.4
  },
  "20-22m": { // 20 – 22 mo
    L: 0.9497, M: 1.8030, S: 0.45398,
    sd3neg: 0.0, sd2neg: 0.2, sd1neg: 1.0, median: 1.8,
    sd1: 2.6, sd2: 3.5, sd3: 4.3
  },
  "21-23m": { // 21 – 23 mo
    L: 0.9497, M: 1.7575, S: 0.46768,
    sd3neg: 0.0, sd2neg: 0.2, sd1neg: 0.9, median: 1.8,
    sd1: 2.6, sd2: 3.4, sd3: 4.3
  },
  "22-24m": { // 22 – 24 mo
    L: 0.9497, M: 1.7133, S: 0.48129,
    sd3neg: 0.0, sd2neg: 0.1, sd1neg: 0.9, median: 1.7,
    sd1: 2.5, sd2: 3.4, sd3: 4.3
  }
};