
import { GoogleGenAI, Type, Blob, GenerateContentResponse, Modality } from "@google/genai";
import type { DiagnosisResult, GroundingSource } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper to parse grounding chunks from Search or Maps
const parseGroundingChunks = (response: GenerateContentResponse): GroundingSource[] => {
    const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (!chunks) return [];

    return chunks.map((chunk: any) => {
        if (chunk.web) {
            return { uri: chunk.web.uri, title: chunk.web.title || "Fuente de la Búsqueda de Google" };
        }
        if (chunk.maps) {
            return { uri: chunk.maps.uri, title: chunk.maps.title || 'Ubicación en Google Maps' };
        }
        return null;
    }).filter((source): source is GroundingSource => source !== null);
};


const diagnosisSchema = {
    type: Type.OBJECT,
    properties: {
        diagnosis: { 
            type: Type.STRING,
            description: 'The name of the disease or pest identified.' 
        },
        confidence: { 
            type: Type.NUMBER,
            description: 'A confidence score from 0.0 to 1.0.' 
        },
        severity: { 
            type: Type.STRING,
            description: 'The severity of the issue (e.g., "Baja", "Media", "Alta").' 
        },
        recommendations: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING,
                description: 'A list of actionable recommendations.' 
            },
        },
        reasoning: { 
            type: Type.STRING, 
            description: 'A brief explanation of why this diagnosis was made based on visual evidence.' 
        }
    },
    required: ["diagnosis", "confidence", "severity", "recommendations", "reasoning"]
};

export const getChatResponse = async (prompt: string): Promise<{ text: string; sources: GroundingSource[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `Eres QHAPAQ UMA, un asistente experto en la papa nativa del Perú. Tu conocimiento se basa en una base de datos del Centro Internacional de la Papa (CIP), reportes técnicos del INIA y saberes ancestrales. Responde en español, de manera clara, concisa y amigable. Utiliza el formato Markdown para mejorar la legibilidad. Si la pregunta requiere información muy reciente o fuera de tu conocimiento base, indícalo.`,
                tools: [{googleSearch: {}}],
            }
        });
        const text = response.text;
        const sources = parseGroundingChunks(response);
        return { text, sources };
    } catch (error) {
        console.error("Error fetching chat response:", error);
        return { text: "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.", sources: [] };
    }
};

export const getComplexResponse = async (prompt: string): Promise<{ text: string; sources: GroundingSource[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction: `Eres QHAPAQ UMA, un asistente experto en la papa nativa del Perú con capacidad de razonamiento profundo. Tu conocimiento se basa en una base de datos del Centro Internacional de la Papa (CIP), reportes técnicos del INIA y saberes ancestrales. Para consultas complejas, elabora respuestas detalladas, estructuradas y multifacéticas. Utiliza tu capacidad de "pensamiento" para analizar a fondo la pregunta y proporcionar una solución completa. Responde en español y usa Markdown.`,
                tools: [{googleSearch: {}}],
                thinkingConfig: { thinkingBudget: 32768 },
            }
        });
        const text = response.text;
        const sources = parseGroundingChunks(response);
        return { text, sources };
    } catch (error) {
        console.error("Error fetching complex response:", error);
        return { text: "Lo siento, ha ocurrido un error al procesar tu compleja solicitud. Por favor, intenta de nuevo más tarde.", sources: [] };
    }
};

export const getGroundedMapResponse = async (prompt: string, coords: { latitude: number; longitude: number; }): Promise<{ text: string; sources: GroundingSource[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Considerando mi ubicación actual (${coords.latitude}, ${coords.longitude}), ${prompt}`,
            config: {
                tools: [{googleMaps: {}}],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: coords.latitude,
                            longitude: coords.longitude
                        }
                    }
                }
            },
        });
        const text = response.text;
        const sources = parseGroundingChunks(response);
        return { text, sources };
    } catch (error) {
        console.error("Error fetching map response:", error);
        return { text: "Lo siento, no pude obtener una respuesta basada en la ubicación. Asegúrate de haber concedido los permisos de geolocalización.", sources: [] };
    }
};

export const getVisualDiagnosis = async (imageBase64: string, mimeType: string): Promise<DiagnosisResult> => {
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: `Analiza esta imagen de una planta de papa. Identifica la plaga o enfermedad más probable. Proporciona un diagnóstico, un nivel de confianza (0.0-1.0), la severidad y recomendaciones inmediatas. Responde en español y en formato JSON estructurado.`,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: diagnosisSchema,
            },
        });

        const jsonText = response.text;
        const result = JSON.parse(jsonText);
        return result as DiagnosisResult;

    } catch (error) {
        console.error("Error fetching visual diagnosis:", error);
        throw new Error("No se pudo obtener un diagnóstico. Asegúrate de que la imagen sea clara y vuelve a intentarlo.");
    }
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = (reader.result as string).split(',')[1];
            resolve(result);
        };
        reader.onerror = (error) => reject(error);
    });
};

export const getTextToSpeech = async (text: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // A friendly, clear male voice
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
};

// Audio processing functions for Live API
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}