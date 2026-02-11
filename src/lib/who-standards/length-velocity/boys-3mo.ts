// WHO Child Growth Standards: 3-month length increments (cm)
// Gender: BOYS
// Source: lms_length_boys_3mon_z.pdf
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

export const BOYS_3MO_LENGTH_INCREMENT_ZSCORES: Record<string, LengthZScoreData> = {
  "0-3m": { // 0 – 3 mo
    L: 0.8792, M: 11.4458, S: 0.11285,
    sd3neg: 7.7, sd2neg: 8.9, sd1neg: 10.2, median: 11.4,
    sd1: 12.7, sd2: 14.1, sd3: 15.4
  },
  "1-4m": { // 1 – 4 mo
    L: 0.8792, M: 9.4950, S: 0.12700,
    sd3neg: 6.0, sd2neg: 7.1, sd1neg: 8.3, median: 9.5,
    sd1: 10.7, sd2: 11.9, sd3: 13.2
  },
  "2-5m": { // 2 – 5 mo
    L: 0.8792, M: 7.6058, S: 0.15474,
    sd3neg: 4.2, sd2neg: 5.3, sd1neg: 6.4, median: 7.6,
    sd1: 8.8, sd2: 10.0, sd3: 11.2
  },
  "3-6m": { // 3 – 6 mo
    L: 0.8792, M: 6.2317, S: 0.18096,
    sd3neg: 3.0, sd2neg: 4.0, sd1neg: 5.1, median: 6.2,
    sd1: 7.4, sd2: 8.5, sd3: 9.7
  },
  "4-7m": { // 4 – 7 mo
    L: 0.8792, M: 5.3243, S: 0.20103,
    sd3neg: 2.3, sd2neg: 3.2, sd1neg: 4.3, median: 5.3,
    sd1: 6.4, sd2: 7.5, sd3: 8.6
  },
  "5-8m": { // 5 – 8 mo
    L: 0.8792, M: 4.7433, S: 0.21513,
    sd3neg: 1.8, sd2neg: 2.8, sd1neg: 3.7, median: 4.7,
    sd1: 5.8, sd2: 6.8, sd3: 7.9
  },
  "6-9m": { // 6 – 9 mo
    L: 0.8792, M: 4.3594, S: 0.22535,
    sd3neg: 1.6, sd2neg: 2.5, sd1neg: 3.4, median: 4.4,
    sd1: 5.4, sd2: 6.4, sd3: 7.4
  },
  "7-10m": { // 7 – 10 mo
    L: 0.8792, M: 4.1002, S: 0.23308,
    sd3neg: 1.4, sd2neg: 2.3, sd1neg: 3.2, median: 4.1,
    sd1: 5.1, sd2: 6.1, sd3: 7.1
  },
  "8-11m": { // 8 – 11 mo
    L: 0.8792, M: 3.9200, S: 0.23935,
    sd3neg: 1.3, sd2neg: 2.1, sd1neg: 3.0, median: 3.9,
    sd1: 4.9, sd2: 5.8, sd3: 6.8
  },
  "9-12m": { // 9 – 12 mo
    L: 0.8792, M: 3.7818, S: 0.24526,
    sd3neg: 1.2, sd2neg: 2.0, sd1neg: 2.9, median: 3.8,
    sd1: 4.7, sd2: 5.7, sd3: 6.7
  },
  "10-13m": { // 10 – 13 mo
    L: 0.8792, M: 3.6611, S: 0.25157,
    sd3neg: 1.1, sd2neg: 1.9, sd1neg: 2.8, median: 3.7,
    sd1: 4.6, sd2: 5.6, sd3: 6.5
  },
  "11-14m": { // 11 – 14 mo
    L: 0.8792, M: 3.5430, S: 0.25876,
    sd3neg: 1.0, sd2neg: 1.8, sd1neg: 2.6, median: 3.5,
    sd1: 4.5, sd2: 5.4, sd3: 6.4
  },
  "12-15m": { // 12 – 15 mo
    L: 0.8792, M: 3.4189, S: 0.26713,
    sd3neg: 0.9, sd2neg: 1.7, sd1neg: 2.5, median: 3.4,
    sd1: 4.3, sd2: 5.3, sd3: 6.3
  },
  "13-16m": { // 13 – 16 mo
    L: 0.8792, M: 3.2920, S: 0.27641,
    sd3neg: 0.7, sd2neg: 1.5, sd1neg: 2.4, median: 3.3,
    sd1: 4.2, sd2: 5.2, sd3: 6.1
  },
  "14-17m": { // 14 – 17 mo
    L: 0.8792, M: 3.1717, S: 0.28590,
    sd3neg: 0.6, sd2neg: 1.4, sd1neg: 2.3, median: 3.2,
    sd1: 4.1, sd2: 5.0, sd3: 6.0
  },
  "15-18m": { // 15 – 18 mo
    L: 0.8792, M: 3.0649, S: 0.29508,
    sd3neg: 0.6, sd2neg: 1.3, sd1neg: 2.2, median: 3.1,
    sd1: 4.0, sd2: 4.9, sd3: 5.9
  },
  "16-19m": { // 16 – 19 mo
    L: 0.8792, M: 2.9758, S: 0.30351,
    sd3neg: 0.5, sd2neg: 1.2, sd1neg: 2.1, median: 3.0,
    sd1: 3.9, sd2: 4.8, sd3: 5.8
  },
  "17-20m": { // 17 – 20 mo
    L: 0.8792, M: 2.9068, S: 0.31089,
    sd3neg: 0.4, sd2neg: 1.2, sd1neg: 2.0, median: 2.9,
    sd1: 3.8, sd2: 4.8, sd3: 5.7
  },
  "18-21m": { // 18 – 21 mo
    L: 0.8792, M: 2.8507, S: 0.31767,
    sd3neg: 0.4, sd2neg: 1.1, sd1neg: 2.0, median: 2.9,
    sd1: 3.8, sd2: 4.7, sd3: 5.7
  },
  "19-22m": { // 19 – 22 mo
    L: 0.8792, M: 2.7940, S: 0.32487,
    sd3neg: 0.3, sd2neg: 1.1, sd1neg: 1.9, median: 2.8,
    sd1: 3.7, sd2: 4.7, sd3: 5.6
  },
  "20-23m": { // 20 – 23 mo
    L: 0.8792, M: 2.7265, S: 0.33332,
    sd3neg: 0.2, sd2neg: 1.0, sd1neg: 1.8, median: 2.7,
    sd1: 3.7, sd2: 4.6, sd3: 5.6
  },
  "21-24m": { // 21 – 24 mo
    L: 0.8792, M: 2.6405, S: 0.34377,
    sd3neg: 0.2, sd2neg: 0.9, sd1neg: 1.8, median: 2.6,
    sd1: 3.6, sd2: 4.5, sd3: 5.5
  }
};