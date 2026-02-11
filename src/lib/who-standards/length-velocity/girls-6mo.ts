// WHO Child Growth Standards: 6-month length increments (cm)
// Gender: GIRLS
// Source: lms_length_girls_6mon_z.pdf
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

export const GIRLS_6MO_LENGTH_INCREMENT_ZSCORES: Record<string, LengthZScoreData> = {
  "0-6m": { // 0 – 6 mo
    L: 0.7138, M: 16.4915, S: 0.09904,
    sd3neg: 11.8, sd2neg: 13.3, sd1neg: 14.9, median: 16.5,
    sd1: 18.1, sd2: 19.8, sd3: 21.6
  },
  "1-7m": { // 1 – 7 mo
    L: 0.7138, M: 13.8733, S: 0.10884,
    sd3neg: 9.6, sd2neg: 11.0, sd1neg: 12.4, median: 13.9,
    sd1: 15.4, sd2: 17.0, sd3: 18.6
  },
  "2-8m": { // 2 – 8 mo
    L: 0.7138, M: 11.8137, S: 0.11821,
    sd3neg: 7.8, sd2neg: 9.1, sd1neg: 10.4, median: 11.8,
    sd1: 13.2, sd2: 14.7, sd3: 16.2
  },
  "3-9m": { // 3 – 9 mo
    L: 0.7138, M: 10.3499, S: 0.12639,
    sd3neg: 6.7, sd2neg: 7.8, sd1neg: 9.1, median: 10.3,
    sd1: 11.7, sd2: 13.1, sd3: 14.5
  },
  "4-10m": { // 4 – 10 mo
    L: 0.7138, M: 9.3426, S: 0.13290,
    sd3neg: 5.8, sd2neg: 7.0, sd1neg: 8.1, median: 9.3,
    sd1: 10.6, sd2: 11.9, sd3: 13.3
  },
  "5-11m": { // 5 – 11 mo
    L: 0.7138, M: 8.6770, S: 0.13782,
    sd3neg: 5.3, sd2neg: 6.4, sd1neg: 7.5, median: 8.7,
    sd1: 9.9, sd2: 11.2, sd3: 12.5
  },
  "6-12m": { // 6 – 12 mo
    L: 0.7138, M: 8.2244, S: 0.14171,
    sd3neg: 5.0, sd2neg: 6.0, sd1neg: 7.1, median: 8.2,
    sd1: 9.4, sd2: 10.6, sd3: 11.9
  },
  "7-13m": { // 7 – 13 mo
    L: 0.7138, M: 7.8787, S: 0.14512,
    sd3neg: 4.7, sd2neg: 5.7, sd1neg: 6.8, median: 7.9,
    sd1: 9.0, sd2: 10.3, sd3: 11.5
  },
  "8-14m": { // 8 – 14 mo
    L: 0.7138, M: 7.5879, S: 0.14836,
    sd3neg: 4.4, sd2neg: 5.4, sd1neg: 6.5, median: 7.6,
    sd1: 8.7, sd2: 9.9, sd3: 11.2
  },
  "9-15m": { // 9 – 15 mo
    L: 0.7138, M: 7.3259, S: 0.15166,
    sd3neg: 4.2, sd2neg: 5.2, sd1neg: 6.2, median: 7.3,
    sd1: 8.5, sd2: 9.6, sd3: 10.9
  },
  "10-16m": { // 10 – 16 mo
    L: 0.7138, M: 7.0897, S: 0.15514,
    sd3neg: 4.0, sd2neg: 5.0, sd1neg: 6.0, median: 7.1,
    sd1: 8.2, sd2: 9.4, sd3: 10.6
  },
  "11-17m": { // 11 – 17 mo
    L: 0.7138, M: 6.8778, S: 0.15880,
    sd3neg: 3.8, sd2neg: 4.8, sd1neg: 5.8, median: 6.9,
    sd1: 8.0, sd2: 9.2, sd3: 10.4
  },
  "12-18m": { // 12 – 18 mo
    L: 0.7138, M: 6.6823, S: 0.16252,
    sd3neg: 3.7, sd2neg: 4.6, sd1neg: 5.6, median: 6.7,
    sd1: 7.8, sd2: 9.0, sd3: 10.2
  },
  "13-19m": { // 13 – 19 mo
    L: 0.7138, M: 6.4984, S: 0.16617,
    sd3neg: 3.5, sd2neg: 4.4, sd1neg: 5.4, median: 6.5,
    sd1: 7.6, sd2: 8.8, sd3: 10.0
  },
  "14-20m": { // 14 – 20 mo
    L: 0.7138, M: 6.3217, S: 0.16964,
    sd3neg: 3.4, sd2neg: 4.3, sd1neg: 5.3, median: 6.3,
    sd1: 7.4, sd2: 8.6, sd3: 9.8
  },
  "15-21m": { // 15 – 21 mo
    L: 0.7138, M: 6.1484, S: 0.17287,
    sd3neg: 3.2, sd2neg: 4.1, sd1neg: 5.1, median: 6.1,
    sd1: 7.2, sd2: 8.4, sd3: 9.6
  },
  "16-22m": { // 16 – 22 mo
    L: 0.7138, M: 5.9770, S: 0.17591,
    sd3neg: 3.1, sd2neg: 4.0, sd1neg: 5.0, median: 6.0,
    sd1: 7.1, sd2: 8.2, sd3: 9.4
  },
  "17-23m": { // 17 – 23 mo
    L: 0.7138, M: 5.8083, S: 0.17884,
    sd3neg: 3.0, sd2neg: 3.8, sd1neg: 4.8, median: 5.8,
    sd1: 6.9, sd2: 8.0, sd3: 9.1
  },
  "18-24m": { // 18 – 24 mo
    L: 0.7138, M: 5.6454, S: 0.18169,
    sd3neg: 2.8, sd2neg: 3.7, sd1neg: 4.6, median: 5.6,
    sd1: 6.7, sd2: 7.8, sd3: 8.9
  }
};