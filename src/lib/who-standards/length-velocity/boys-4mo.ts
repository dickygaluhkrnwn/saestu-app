// WHO Child Growth Standards: 4-month length increments (cm)
// Gender: BOYS
// Source: lms-length-boys-4mon-z.pdf
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

export const BOYS_4MO_LENGTH_INCREMENT_ZSCORES: Record<string, LengthZScoreData> = {
  "0-4m": { // 0 – 4 mo
    L: 1.0138, M: 13.9770, S: 0.10113,
    sd3neg: 9.7, sd2neg: 11.1, sd1neg: 12.6, median: 14.0,
    sd1: 15.4, sd2: 16.8, sd3: 18.2
  },
  "1-5m": { // 1 – 5 mo
    L: 1.0138, M: 11.4886, S: 0.12006,
    sd3neg: 7.3, sd2neg: 8.7, sd1neg: 10.1, median: 11.5,
    sd1: 12.9, sd2: 14.2, sd3: 15.6
  },
  "2-6m": { // 2 – 6 mo
    L: 1.0138, M: 9.3048, S: 0.13954,
    sd3neg: 5.4, sd2neg: 6.7, sd1neg: 8.0, median: 9.3,
    sd1: 10.6, sd2: 11.9, sd3: 13.2
  },
  "3-7m": { // 3 – 7 mo
    L: 1.0138, M: 7.7601, S: 0.15624,
    sd3neg: 4.1, sd2neg: 5.3, sd1neg: 6.5, median: 7.8,
    sd1: 9.0, sd2: 10.2, sd3: 11.4
  },
  "4-8m": { // 4 – 8 mo
    L: 1.0138, M: 6.7018, S: 0.16955,
    sd3neg: 3.3, sd2neg: 4.4, sd1neg: 5.6, median: 6.7,
    sd1: 7.8, sd2: 9.0, sd3: 10.1
  },
  "5-9m": { // 5 – 9 mo
    L: 1.0138, M: 6.0704, S: 0.17780,
    sd3neg: 2.8, sd2neg: 3.9, sd1neg: 5.0, median: 6.1,
    sd1: 7.1, sd2: 8.2, sd3: 9.3
  },
  "6-10m": { // 6 – 10 mo
    L: 1.0138, M: 5.6756, S: 0.18311,
    sd3neg: 2.5, sd2neg: 3.6, sd1neg: 4.6, median: 5.7,
    sd1: 6.7, sd2: 7.7, sd3: 8.8
  },
  "7-11m": { // 7 – 11 mo
    L: 1.0138, M: 5.3939, S: 0.18754,
    sd3neg: 2.3, sd2neg: 3.4, sd1neg: 4.4, median: 5.4,
    sd1: 6.4, sd2: 7.4, sd3: 8.4
  },
  "8-12m": { // 8 – 12 mo
    L: 1.0138, M: 5.1699, S: 0.19138,
    sd3neg: 2.2, sd2neg: 3.2, sd1neg: 4.2, median: 5.2,
    sd1: 6.2, sd2: 7.1, sd3: 8.1
  },
  "9-13m": { // 9 – 13 mo
    L: 1.0138, M: 4.9623, S: 0.19512,
    sd3neg: 2.0, sd2neg: 3.0, sd1neg: 4.0, median: 5.0,
    sd1: 5.9, sd2: 6.9, sd3: 7.9
  },
  "10-14m": { // 10 – 14 mo
    L: 1.0138, M: 4.7773, S: 0.19880,
    sd3neg: 1.9, sd2neg: 2.9, sd1neg: 3.8, median: 4.8,
    sd1: 5.7, sd2: 6.7, sd3: 7.6
  },
  "11-15m": { // 11 – 15 mo
    L: 1.0138, M: 4.6014, S: 0.20286,
    sd3neg: 1.8, sd2neg: 2.7, sd1neg: 3.7, median: 4.6,
    sd1: 5.5, sd2: 6.5, sd3: 7.4
  },
  "12-16m": { // 12 – 16 mo
    L: 1.0138, M: 4.4487, S: 0.20707,
    sd3neg: 1.7, sd2neg: 2.6, sd1neg: 3.5, median: 4.4,
    sd1: 5.4, sd2: 6.3, sd3: 7.2
  },
  "13-17m": { // 13 – 17 mo
    L: 1.0138, M: 4.3123, S: 0.21158,
    sd3neg: 1.6, sd2neg: 2.5, sd1neg: 3.4, median: 4.3,
    sd1: 5.2, sd2: 6.1, sd3: 7.0
  },
  "14-18m": { // 14 – 18 mo
    L: 1.0138, M: 4.1833, S: 0.21644,
    sd3neg: 1.5, sd2neg: 2.4, sd1neg: 3.3, median: 4.2,
    sd1: 5.1, sd2: 6.0, sd3: 6.9
  },
  "15-19m": { // 15 – 19 mo
    L: 1.0138, M: 4.0680, S: 0.22124,
    sd3neg: 1.4, sd2neg: 2.3, sd1neg: 3.2, median: 4.1,
    sd1: 5.0, sd2: 5.9, sd3: 6.8
  },
  "16-20m": { // 16 – 20 mo
    L: 1.0138, M: 3.9584, S: 0.22619,
    sd3neg: 1.3, sd2neg: 2.2, sd1neg: 3.1, median: 4.0,
    sd1: 4.9, sd2: 5.7, sd3: 6.6
  },
  "17-21m": { // 17 – 21 mo
    L: 1.0138, M: 3.8600, S: 0.23092,
    sd3neg: 1.2, sd2neg: 2.1, sd1neg: 3.0, median: 3.9,
    sd1: 4.8, sd2: 5.6, sd3: 6.5
  },
  "18-22m": { // 18 – 22 mo
    L: 1.0138, M: 3.7663, S: 0.23577,
    sd3neg: 1.1, sd2neg: 2.0, sd1neg: 2.9, median: 3.8,
    sd1: 4.7, sd2: 5.5, sd3: 6.4
  },
  "19-23m": { // 19 – 23 mo
    L: 1.0138, M: 3.6815, S: 0.24063,
    sd3neg: 1.0, sd2neg: 1.9, sd1neg: 2.8, median: 3.7,
    sd1: 4.6, sd2: 5.4, sd3: 6.3
  },
  "20-24m": { // 20 – 24 mo
    L: 1.0138, M: 3.6058, S: 0.24530,
    sd3neg: 0.9, sd2neg: 1.8, sd1neg: 2.7, median: 3.6,
    sd1: 4.5, sd2: 5.4, sd3: 6.2
  }
};