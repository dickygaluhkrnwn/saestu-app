import { NextResponse } from "next/server";

// Mendefinisikan Tipe Data yang Diharapkan dari Frontend
interface Payload {
  childName: string;
  ageInMonths: number;
  weight: number;
  height: number;
  weightStatus: string; // adequate, inadequate, excess
  lengthStatus: string;
  masterFoods: any[];
}

export async function POST(req: Request) {
  try {
    const payload: Payload = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key Gemini tidak ditemukan di Server" },
        { status: 500 }
      );
    }

    // 1. SYSTEM INSTRUCTION (Membentuk Persona AI)
    const systemInstruction = `
      Anda adalah Ahli Gizi Anak dan Dokter Spesialis Anak terkemuka dari Indonesia.
      Tugas Anda adalah memberikan rekomendasi Pemberian Makanan Tambahan (PMT) lokal untuk balita.
      Gunakan data "Database Makanan Lokal" yang diberikan untuk menyusun menu.
      Selalu gunakan bahasa Indonesia yang ramah, empatik, dan mudah dimengerti oleh Ibu/Orang Tua.
    `;

    // 2. USER PROMPT (Konteks Medis & Database RAG)
    const promptText = `
      Analisis kondisi balita berikut dan berikan rekomendasi gizi berdasarkan ketersediaan bahan lokal:
      
      [PROFIL ANAK]
      - Nama: ${payload.childName}
      - Usia: ${payload.ageInMonths} Bulan
      - Berat Badan: ${payload.weight} kg (Status: ${payload.weightStatus})
      - Tinggi Badan: ${payload.height} cm (Status: ${payload.lengthStatus})

      [DATABASE MAKANAN LOKAL (Per 100g)]
      ${JSON.stringify(payload.masterFoods.map(f => ({ name: f.name, protein: f.protein, fat: f.fat, carbs: f.carbs })), null, 2)}

      [INSTRUKSI KETAT]
      1. Jika weightStatus "inadequate" (Faltering/Risiko Stunting), wajib rekomendasikan menu padat kalori dengan Double Protein Hewani (DPH) dan lemak tambahan dari database.
      2. Jika weightStatus "adequate" (Gizi Baik), rekomendasikan menu gizi seimbang biasa.
      3. Hanya rekomendasikan bahan makanan yang ADA di [DATABASE MAKANAN LOKAL] di atas.

      Kamu WAJIB merespon HANYA dengan format JSON yang valid persis seperti skema berikut tanpa blok kode markdown markdown tambahan:
      {
        "statusAnalysis": "Penjelasan singkat (2-3 kalimat) tentang status gizi anak saat ini dengan nada positif dan ramah.",
        "recommendedFoods": [
          { "foodName": "Nama Bahan dari Database", "reason": "Alasan singkat mengapa bagus untuk anak ini", "portionTip": "Tips takaran/porsi" }
        ],
        "recipeSuggestion": {
          "menuName": "Nama Resep Menarik",
          "ingredients": ["Bahan 1", "Bahan 2"],
          "instructions": ["Langkah 1", "Langkah 2"]
        },
        "warnings": ["Peringatan 1 (misal: hindari gula pasir)", "Peringatan 2"]
      }
    `;

    // 3. MENEMBAK GOOGLE GEMINI API (REST API Method)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          responseMimeType: "application/json", // Memaksa output JSON murni
          temperature: 0.3 // Rendah agar lebih medis/akurat, tidak halusinasi
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Gagal menghubungi Gemini API");
    }

    // 4. PARSING HASIL
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) throw new Error("Format respons Gemini tidak dikenali");

    // Mengembalikan JSON langsung ke Frontend
    return NextResponse.json(JSON.parse(resultText));

  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}