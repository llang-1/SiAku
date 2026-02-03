import {GoogleGenAI} from '@google/genai';
import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
    apiKey: process.env.APIKEY_GEMINI
})

const personalitySchema = {
  type: "object",
  properties: {
    profil_umum: {
      type: "object",
      properties: {
        tipe: { type: "string" },
        deskripsi: { type: "string" }
      },
      required: ["tipe", "deskripsi"]
    },

    analisis_nama: {
      type: "object",
      properties: {
        energi: { type: "string" },
        karakter: {
          type: "array",
          items: { type: "string" }
        },
        ringkasan: { type: "string" }
      },
      required: ["energi", "karakter", "ringkasan"]
    },

    analisis_hari: {
      type: "object",
      properties: {
        hari: { type: "string" },
        sifat: {
          type: "array",
          items: { type: "string" }
        },
        tantangan: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["hari", "sifat", "tantangan"]
    },

    numerologi: {
      type: "object",
      properties: {
        angka: { type: "integer" },
        makna: { type: "string" }
      },
      required: ["angka", "makna"]
    },

    rekomendasi: {
      type: "object",
      properties: {
        fokus: {
          type: "array",
          items: { type: "string" }
        },
        peringatan: { type: "string" }
      },
      required: ["fokus", "peringatan"]
    }
  },
  required: [
    "profil_umum",
    "analisis_nama",
    "analisis_hari",
    "numerologi",
    "rekomendasi"
  ]
};


export async function POST(req: NextRequest) {
    const body = await req.json()
    const {namaLengkap, hariLahir} = body;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: `Nama saya ${namaLengkap}, dan lahir saya ${hariLahir}`,
            config: {
                systemInstruction: "Kamu akan berpura-pura menjadi dukun yang bisa memperediksi kepribadian yang ada pada melalui nama orang dan dd/mm/tt tersebut, berikan jawaban yang sangat pintar, cerdas dan keren. Berikan jawaban secara singkat dan serius setiap berbeda-beda atau random. berikan file json nya saja jangan ada kata lain hanya json, dan buatkan banyak kategori ramalam kepribadiannya Output HARUS JSON VALID sesuai schema Jangan tambahkan teks di luar JSONIsi semua field. Jangan ubah struktur.",
                responseMimeType: 'application/json',
                responseSchema: personalitySchema
            }
        })

        let textJson: any = response.text

        textJson = textJson?.replace(/```json|```/g, "").trim()

        const objectResponse = JSON.parse(textJson)

        return NextResponse.json({
            data: objectResponse
        })

    } catch (e) {
        console.log(e)
    }
}
