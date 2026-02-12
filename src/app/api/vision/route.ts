import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key Gemini tidak ditemukan" }, { status: 500 });
    }

    // AI butuh format Base64 murni tanpa awalan "data:image/jpeg;base64,"
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    // Prompt super ketat agar AI bertindak seperti OCR (Optical Character Recognition)
    const prompt = `
      Kamu adalah sistem pembaca layar timbangan/pengukur digital. 
      Perhatikan gambar berikut. Berapa angka desimal yang tertera di layar tersebut? 
      Abaikan pantulan cahaya, tangan, atau teks lain. 
      Balas HANYA dengan angka desimal (contoh: 6.85 atau 60.5). 
      Jika gambar buram, layar mati, atau tidak ada angka, balas persis dengan kata 'ERROR'.
    `;

    // Memanggil model Gemini 2.5 Flash (yang mendukung gambar)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } }
          ]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error?.message || "Gagal menghubungi Gemini API");

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!resultText || resultText.includes('ERROR')) {
      return NextResponse.json({ error: "Gagal membaca angka. Coba foto ulang dari jarak dekat." }, { status: 400 });
    }

    // Ekstrak angka dari teks balasan menggunakan Regex (berjaga-jaga jika AI menjawab "Angkanya 6.8")
    const match = resultText.match(/\d+(\.\d+)?/);
    const number = match ? parseFloat(match[0]) : null;

    if (number !== null) {
      return NextResponse.json({ value: number }); // Kembalikan angka ke Frontend
    } else {
      return NextResponse.json({ error: "Format angka tidak dikenali." }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Vision API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}