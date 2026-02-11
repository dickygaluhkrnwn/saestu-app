// WHO Child Growth Standards: 2-month length increments (cm)
// Gender: GIRLS
// Source: lms_length_girls_2mon_z.pdf
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

export const GIRLS_2MO_LENGTH_INCREMENT_ZSCORES: Record<string, LengthZScoreData> = {
  "0-2m": { // 0 – 2 mo
    L: 0.9918, M: 7.9023, S: 0.14123,
    sd3neg: 4.6, sd2neg: 5.7, sd1neg: 6.8, median: 7.9,
    sd1: 9.0, sd2: 10.1, sd3: 11.3
  },
  "1-3m": { // 1 – 3 mo
    L: 0.9918, M: 6.3775, S: 0.15004,
    sd3neg: 3.5, sd2neg: 4.5, sd1neg: 5.4, median: 6.4,
    sd1: 7.3, sd2: 8.3, sd3: 9.3
  },
  "2-4m": { // 2 – 4 mo
    L: 0.9918, M: 5.1574, S: 0.17732,
    sd3neg: 2.4, sd2neg: 3.3, sd1neg: 4.2, median: 5.2,
    sd1: 6.1, sd2: 7.0, sd3: 7.9
  },
  "3-5m": { // 3 – 5 mo
    L: 0.9918, M: 4.2877, S: 0.21092,
    sd3neg: 1.6, sd2neg: 2.5, sd1neg: 3.4, median: 4.3,
    sd1: 5.2, sd2: 6.1, sd3: 7.0
  },
  "4-6m": { // 4 – 6 mo
    L: 0.9918, M: 3.5965, S: 0.23941,
    sd3neg: 1.0, sd2neg: 1.9, sd1neg: 2.7, median: 3.6,
    sd1: 4.5, sd2: 5.3, sd3: 6.2
  },
  "5-7m": { // 5 – 7 mo
    L: 0.9918, M: 3.1827, S: 0.25995,
    sd3neg: 0.7, sd2neg: 1.5, sd1neg: 2.4, median: 3.2,
    sd1: 4.0, sd2: 4.8, sd3: 5.7
  },
  "6-8m": { // 6 – 8 mo
    L: 0.9918, M: 3.0000, S: 0.27597,
    sd3neg: 0.5, sd2neg: 1.3, sd1neg: 2.2, median: 3.0,
    sd1: 3.8, sd2: 4.7, sd3: 5.5
  },
  "7-9m": { // 7 – 9 mo
    L: 0.9918, M: 2.8764, S: 0.28638,
    sd3neg: 0.4, sd2neg: 1.2, sd1neg: 2.1, median: 2.9,
    sd1: 3.7, sd2: 4.5, sd3: 5.4
  },
  "8-10m": { // 8 – 10 mo
    L: 0.9918, M: 2.7444, S: 0.29192,
    sd3neg: 0.4, sd2neg: 1.1, sd1neg: 1.9, median: 2.7,
    sd1: 3.5, sd2: 4.3, sd3: 5.2
  },
  "9-11m": { // 9 – 11 mo
    L: 0.9918, M: 2.6284, S: 0.29751,
    sd3neg: 0.3, sd2neg: 1.1, sd1neg: 1.8, median: 2.6,
    sd1: 3.4, sd2: 4.2, sd3: 5.0
  },
  "10-12m": { // 10 – 12 mo
    L: 0.9918, M: 2.5303, S: 0.30553,
    sd3neg: 0.2, sd2neg: 1.0, sd1neg: 1.8, median: 2.5,
    sd1: 3.3, sd2: 4.1, sd3: 4.9
  },
  "11-13m": { // 11 – 13 mo
    L: 0.9918, M: 2.4425, S: 0.31612,
    sd3neg: 0.1, sd2neg: 0.9, sd1neg: 1.7, median: 2.4,
    sd1: 3.2, sd2: 4.0, sd3: 4.8
  },
  "12-14m": { // 12 – 14 mo
    L: 0.9918, M: 2.3621, S: 0.32828,
    sd3neg: 0.1, sd2neg: 0.8, sd1neg: 1.6, median: 2.4,
    sd1: 3.1, sd2: 3.9, sd3: 4.7
  },
  "13-15m": { // 13 – 15 mo
    L: 0.9918, M: 2.2879, S: 0.34112,
    sd3neg: 0.1, sd2neg: 0.7, sd1neg: 1.5, median: 2.3,
    sd1: 3.1, sd2: 3.9, sd3: 4.6
  },
  "14-16m": { // 14 – 16 mo
    L: 0.9918, M: 2.2236, S: 0.35425,
    sd3neg: 0.1, sd2neg: 0.7, sd1neg: 1.4, median: 2.2,
    sd1: 3.0, sd2: 3.8, sd3: 4.6
  },
  "15-17m": { // 15 – 17 mo
    L: 0.9918, M: 2.1684, S: 0.36737,
    sd3neg: 0.1, sd2neg: 0.6, sd1neg: 1.4, median: 2.2,
    sd1: 3.0, sd2: 3.8, sd3: 4.6
  },
  "16-18m": { // 16 – 18 mo
    L: 0.9918, M: 2.1113, S: 0.38003,
    sd3neg: 0.1, sd2neg: 0.5, sd1neg: 1.3, median: 2.1,
    sd1: 2.9, sd2: 3.7, sd3: 4.5
  },
  "17-19m": { // 17 – 19 mo
    L: 0.9918, M: 2.0470, S: 0.39199,
    sd3neg: 0.1, sd2neg: 0.4, sd1neg: 1.2, median: 2.0,
    sd1: 2.9, sd2: 3.7, sd3: 4.5
  },
  "18-20m": { // 18 – 20 mo
    L: 0.9918, M: 1.9822, S: 0.40358,
    sd3neg: 0.1, sd2neg: 0.4, sd1neg: 1.2, median: 2.0,
    sd1: 2.8, sd2: 3.6, sd3: 4.4
  },
  "19-21m": { // 19 – 21 mo
    L: 0.9918, M: 1.9225, S: 0.41519,
    sd3neg: 0.1, sd2neg: 0.3, sd1neg: 1.1, median: 1.9,
    sd1: 2.7, sd2: 3.5, sd3: 4.3
  },
  "20-22m": { // 20 – 22 mo
    L: 0.9918, M: 1.8682, S: 0.42686,
    sd3neg: 0.0, sd2neg: 0.3, sd1neg: 1.1, median: 1.9,
    sd1: 2.7, sd2: 3.5, sd3: 4.3
  },
  "21-23m": { // 21 – 23 mo
    L: 0.9918, M: 1.8192, S: 0.43859,
    sd3neg: 0.0, sd2neg: 0.2, sd1neg: 1.0, median: 1.8,
    sd1: 2.6, sd2: 3.4, sd3: 4.2
  },
  "22-24m": { // 22 – 24 mo
    L: 0.9918, M: 1.7750, S: 0.45033,
    sd3neg: 0.0, sd2neg: 0.2, sd1neg: 1.0, median: 1.8,
    sd1: 2.6, sd2: 3.4, sd3: 4.2
  }
};