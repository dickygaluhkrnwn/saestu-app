// WHO Child Growth Standards: 6-month length increments (cm)
// Gender: BOYS
// Source: lms_length_boys_6mon_z.pdf
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

export const BOYS_6MO_LENGTH_INCREMENT_ZSCORES: Record<string, LengthZScoreData> = {
  "0-6m": { // 0 – 6 mo
    L: 0.9027, M: 17.6547, S: 0.09452,
    sd3neg: 12.7, sd2neg: 14.3, sd1neg: 16.0, median: 17.7,
    sd1: 19.3, sd2: 21.0, sd3: 22.7
  },
  "1-7m": { // 1 – 7 mo
    L: 0.9027, M: 14.7110, S: 0.10935,
    sd3neg: 10.0, sd2neg: 11.5, sd1neg: 13.1, median: 14.7,
    sd1: 16.3, sd2: 18.0, sd3: 19.6
  },
  "2-8m": { // 2 – 8 mo
    L: 0.9027, M: 12.3097, S: 0.12383,
    sd3neg: 7.8, sd2neg: 9.3, sd1neg: 10.8, median: 12.3,
    sd1: 13.8, sd2: 15.4, sd3: 17.0
  },
  "3-9m": { // 3 – 9 mo
    L: 0.9027, M: 10.5768, S: 0.13570,
    sd3neg: 6.4, sd2neg: 7.7, sd1neg: 9.2, median: 10.6,
    sd1: 12.0, sd2: 13.5, sd3: 15.0
  },
  "4-10m": { // 4 – 10 mo
    L: 0.9027, M: 9.4000, S: 0.14407,
    sd3neg: 5.4, sd2neg: 6.7, sd1neg: 8.1, median: 9.4,
    sd1: 10.8, sd2: 12.1, sd3: 13.5
  },
  "5-11m": { // 5 – 11 mo
    L: 0.9027, M: 8.6282, S: 0.14919,
    sd3neg: 4.9, sd2neg: 6.1, sd1neg: 7.4, median: 8.6,
    sd1: 9.9, sd2: 11.2, sd3: 12.6
  },
  "6-12m": { // 6 – 12 mo
    L: 0.9027, M: 8.1114, S: 0.15162,
    sd3neg: 4.5, sd2neg: 5.7, sd1neg: 6.9, median: 8.1,
    sd1: 9.3, sd2: 10.6, sd3: 11.9
  },
  "7-13m": { // 7 – 13 mo
    L: 0.9027, M: 7.7366, S: 0.15255,
    sd3neg: 4.3, sd2neg: 5.4, sd1neg: 6.6, median: 7.7,
    sd1: 8.9, sd2: 10.1, sd3: 11.3
  },
  "8-14m": { // 8 – 14 mo
    L: 0.9027, M: 7.4335, S: 0.15299,
    sd3neg: 4.1, sd2neg: 5.2, sd1neg: 6.3, median: 7.4,
    sd1: 8.6, sd2: 9.7, sd3: 10.9
  },
  "9-15m": { // 9 – 15 mo
    L: 0.9027, M: 7.1621, S: 0.15364,
    sd3neg: 3.9, sd2neg: 5.0, sd1neg: 6.1, median: 7.2,
    sd1: 8.3, sd2: 9.4, sd3: 10.5
  },
  "10-16m": { // 10 – 16 mo
    L: 0.9027, M: 6.9165, S: 0.15479,
    sd3neg: 3.8, sd2neg: 4.8, sd1neg: 5.9, median: 6.9,
    sd1: 8.0, sd2: 9.1, sd3: 10.2
  },
  "11-17m": { // 11 – 17 mo
    L: 0.9027, M: 6.6927, S: 0.15649,
    sd3neg: 3.6, sd2neg: 4.6, sd1neg: 5.7, median: 6.7,
    sd1: 7.7, sd2: 8.8, sd3: 9.9
  },
  "12-18m": { // 12 – 18 mo
    L: 0.9027, M: 6.4830, S: 0.15863,
    sd3neg: 3.5, sd2neg: 4.5, sd1neg: 5.5, median: 6.5,
    sd1: 7.5, sd2: 8.6, sd3: 9.6
  },
  "13-19m": { // 13 – 19 mo
    L: 0.9027, M: 6.2862, S: 0.16108,
    sd3neg: 3.3, sd2neg: 4.3, sd1neg: 5.3, median: 6.3,
    sd1: 7.3, sd2: 8.3, sd3: 9.4
  },
  "14-20m": { // 14 – 20 mo
    L: 0.9027, M: 6.1061, S: 0.16362,
    sd3neg: 3.2, sd2neg: 4.1, sd1neg: 5.1, median: 6.1,
    sd1: 7.1, sd2: 8.1, sd3: 9.2
  },
  "15-21m": { // 15 – 21 mo
    L: 0.9027, M: 5.9431, S: 0.16610,
    sd3neg: 3.1, sd2neg: 4.0, sd1neg: 5.0, median: 5.9,
    sd1: 6.9, sd2: 7.9, sd3: 9.0
  },
  "16-22m": { // 16 – 22 mo
    L: 0.9027, M: 5.7899, S: 0.16861,
    sd3neg: 2.9, sd2neg: 3.9, sd1neg: 4.8, median: 5.8,
    sd1: 6.8, sd2: 7.8, sd3: 8.8
  },
  "17-23m": { // 17 – 23 mo
    L: 0.9027, M: 5.6425, S: 0.17124,
    sd3neg: 2.8, sd2neg: 3.7, sd1neg: 4.7, median: 5.6,
    sd1: 6.6, sd2: 7.6, sd3: 8.6
  },
  "18-24m": { // 18 – 24 mo
    L: 0.9027, M: 5.5018, S: 0.17392,
    sd3neg: 2.7, sd2neg: 3.6, sd1neg: 4.6, median: 5.5,
    sd1: 6.5, sd2: 7.4, sd3: 8.4
  }
};