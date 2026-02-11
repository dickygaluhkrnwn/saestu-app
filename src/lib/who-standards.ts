// Tabel Standar Kenaikan Berat Badan (Weight Increment) WHO 2006
// Menggunakan batas bawah (5th Percentile) dalam satuan gram untuk interval 1 bulan.
// Sumber: WHO Child Growth Standards

type WhoStandard = {
  [ageRange: string]: number; // "0-1": 800
};

// Standar untuk Laki-laki (Boys)
export const WHO_WEIGHT_INCREMENT_BOYS: WhoStandard = {
  "0-1": 800,
  "1-2": 900,
  "2-3": 600,
  "3-4": 450,
  "4-5": 350,
  "5-6": 250,
  "6-7": 200,
  "7-8": 150,
  "8-9": 100,
  "9-10": 50,
  "10-11": 50,
  "11-12": 50,
  // Di atas 12 bulan kenaikan melambat, kita pakai estimasi aman
  "12-24": 150, 
};

// Standar untuk Perempuan (Girls)
export const WHO_WEIGHT_INCREMENT_GIRLS: WhoStandard = {
  "0-1": 800,
  "1-2": 800,
  "2-3": 500,
  "3-4": 400,
  "4-5": 300,
  "5-6": 250,
  "6-7": 200,
  "7-8": 150,
  "8-9": 100,
  "9-10": 50,
  "10-11": 50,
  "11-12": 50,
  "12-24": 150,
};

// Fungsi Utama: Cek Status Pertumbuhan
export const checkGrowthStatus = (
  gender: "L" | "P",
  ageInMonths: number, // Usia saat ini (bulan)
  weightIncrementGram: number // Kenaikan berat (gram) dari bulan lalu
): { status: "adequate" | "inadequate"; minIncrement: number } => {
  
  // Normalisasi range usia (karena tabel pakai format "0-1", "1-2")
  // Jika usia 1 bulan, berarti dia baru saja melewati fase 0-1 bulan.
  // Kita ambil standar bulan sebelumnya.
  let targetRange = "";
  
  if (ageInMonths <= 1) targetRange = "0-1";
  else if (ageInMonths <= 2) targetRange = "1-2";
  else if (ageInMonths <= 3) targetRange = "2-3";
  else if (ageInMonths <= 4) targetRange = "3-4";
  else if (ageInMonths <= 5) targetRange = "4-5";
  else if (ageInMonths <= 6) targetRange = "5-6";
  else if (ageInMonths <= 7) targetRange = "6-7";
  else if (ageInMonths <= 8) targetRange = "7-8";
  else if (ageInMonths <= 9) targetRange = "8-9";
  else if (ageInMonths <= 10) targetRange = "9-10";
  else if (ageInMonths <= 11) targetRange = "10-11";
  else targetRange = "11-12"; // Default max setahun pertama

  const table = gender === "L" ? WHO_WEIGHT_INCREMENT_BOYS : WHO_WEIGHT_INCREMENT_GIRLS;
  const minIncrement = table[targetRange] || 100; // Fallback 100g

  if (weightIncrementGram >= minIncrement) {
    return { status: "adequate", minIncrement };
  } else {
    return { status: "inadequate", minIncrement };
  }
};

// Helper: Hitung Usia dalam Bulan
export const calculateAgeInMonths = (dob: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dob.getTime());
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Rata-rata hari per bulan
  return diffMonths;
};