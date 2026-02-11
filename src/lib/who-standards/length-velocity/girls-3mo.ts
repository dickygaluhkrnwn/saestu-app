// WHO Child Growth Standards: 3-month length increments (cm)
// Gender: GIRLS
// Source: lms_length_girls_3mon_z.pdf
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

export const GIRLS_3MO_LENGTH_INCREMENT_ZSCORES: Record<string, LengthZScoreData> = {
  "0-3m": { // 0 – 3 mo
    L: 0.8538, M: 10.5967, S: 0.11683,
    sd3neg: 7.0, sd2neg: 8.2, sd1neg: 9.4, median: 10.6,
    sd1: 11.8, sd2: 13.1, sd3: 14.4
  },
  "1-4m": { // 1 – 4 mo
    L: 0.8538, M: 8.7743, S: 0.13505,
    sd3neg: 5.3, sd2neg: 6.5, sd1neg: 7.6, median: 8.8,
    sd1: 10.0, sd2: 11.2, sd3: 12.4
  },
  "2-5m": { // 2 – 5 mo
    L: 0.8538, M: 7.1455, S: 0.15574,
    sd3neg: 3.9, sd2neg: 5.0, sd1neg: 6.0, median: 7.1,
    sd1: 8.3, sd2: 9.4, sd3: 10.6
  },
  "3-6m": { // 3 – 6 mo
    L: 0.8538, M: 5.9428, S: 0.17798,
    sd3neg: 2.9, sd2neg: 3.9, sd1neg: 4.9, median: 5.9,
    sd1: 7.0, sd2: 8.1, sd3: 9.2
  },
  "4-7m": { // 4 – 7 mo
    L: 0.8538, M: 5.1554, S: 0.19661,
    sd3neg: 2.3, sd2neg: 3.2, sd1neg: 4.2, median: 5.2,
    sd1: 6.2, sd2: 7.2, sd3: 8.3
  },
  "5-8m": { // 5 – 8 mo
    L: 0.8538, M: 4.6834, S: 0.20988,
    sd3neg: 1.9, sd2neg: 2.8, sd1neg: 3.7, median: 4.7,
    sd1: 5.7, sd2: 6.7, sd3: 7.8
  },
  "6-9m": { // 6 – 9 mo
    L: 0.8538, M: 4.3922, S: 0.21849,
    sd3neg: 1.7, sd2neg: 2.5, sd1neg: 3.4, median: 4.4,
    sd1: 5.4, sd2: 6.4, sd3: 7.4
  },
  "7-10m": { // 7 – 10 mo
    L: 0.8538, M: 4.1971, S: 0.22383,
    sd3neg: 1.5, sd2neg: 2.4, sd1neg: 3.3, median: 4.2,
    sd1: 5.2, sd2: 6.1, sd3: 7.1
  },
  "8-11m": { // 8 – 11 mo
    L: 0.8538, M: 4.0329, S: 0.22876,
    sd3neg: 1.4, sd2neg: 2.3, sd1neg: 3.1, median: 4.0,
    sd1: 5.0, sd2: 5.9, sd3: 6.9
  },
  "9-12m": { // 9 – 12 mo
    L: 0.8538, M: 3.8692, S: 0.23503,
    sd3neg: 1.3, sd2neg: 2.1, sd1neg: 3.0, median: 3.9,
    sd1: 4.8, sd2: 5.7, sd3: 6.7
  },
  "10-13m": { // 10 – 13 mo
    L: 0.8538, M: 3.7174, S: 0.24257,
    sd3neg: 1.2, sd2neg: 2.0, sd1neg: 2.8, median: 3.7,
    sd1: 4.6, sd2: 5.6, sd3: 6.5
  },
  "11-14m": { // 11 – 14 mo
    L: 0.8538, M: 3.5892, S: 0.25105,
    sd3neg: 1.1, sd2neg: 1.9, sd1neg: 2.7, median: 3.6,
    sd1: 4.5, sd2: 5.5, sd3: 6.4
  },
  "12-15m": { // 12 – 15 mo
    L: 0.8538, M: 3.4811, S: 0.25988,
    sd3neg: 1.0, sd2neg: 1.8, sd1neg: 2.6, median: 3.5,
    sd1: 4.4, sd2: 5.4, sd3: 6.3
  },
  "13-16m": { // 13 – 16 mo
    L: 0.8538, M: 3.3844, S: 0.26843,
    sd3neg: 0.9, sd2neg: 1.7, sd1neg: 2.5, median: 3.4,
    sd1: 4.3, sd2: 5.3, sd3: 6.2
  },
  "14-17m": { // 14 – 17 mo
    L: 0.8538, M: 3.2934, S: 0.27635,
    sd3neg: 0.8, sd2neg: 1.6, sd1neg: 2.4, median: 3.3,
    sd1: 4.2, sd2: 5.2, sd3: 6.2
  },
  "15-18m": { // 15 – 18 mo
    L: 0.8538, M: 3.2051, S: 0.28388,
    sd3neg: 0.7, sd2neg: 1.5, sd1neg: 2.3, median: 3.2,
    sd1: 4.1, sd2: 5.1, sd3: 6.1
  },
  "16-19m": { // 16 – 19 mo
    L: 0.8538, M: 3.1173, S: 0.29130,
    sd3neg: 0.6, sd2neg: 1.4, sd1neg: 2.2, median: 3.1,
    sd1: 4.0, sd2: 5.0, sd3: 6.0
  },
  "17-20m": { // 17 – 20 mo
    L: 0.8538, M: 3.0295, S: 0.29869,
    sd3neg: 0.6, sd2neg: 1.3, sd1neg: 2.1, median: 3.0,
    sd1: 4.0, sd2: 4.9, sd3: 5.9
  },
  "18-21m": { // 18 – 21 mo
    L: 0.8538, M: 2.9427, S: 0.30582,
    sd3neg: 0.5, sd2neg: 1.2, sd1neg: 2.1, median: 2.9,
    sd1: 3.9, sd2: 4.8, sd3: 5.8
  },
  "19-22m": { // 19 – 22 mo
    L: 0.8538, M: 2.8576, S: 0.31251,
    sd3neg: 0.4, sd2neg: 1.2, sd1neg: 2.0, median: 2.9,
    sd1: 3.8, sd2: 4.7, sd3: 5.7
  },
  "20-23m": { // 20 – 23 mo
    L: 0.8538, M: 2.7779, S: 0.31896,
    sd3neg: 0.4, sd2neg: 1.1, sd1neg: 1.9, median: 2.8,
    sd1: 3.7, sd2: 4.6, sd3: 5.6
  },
  "21-24m": { // 21 – 24 mo
    L: 0.8538, M: 2.7091, S: 0.32567,
    sd3neg: 0.3, sd2neg: 1.0, sd1neg: 1.8, median: 2.7,
    sd1: 3.6, sd2: 4.5, sd3: 5.5
  }
};