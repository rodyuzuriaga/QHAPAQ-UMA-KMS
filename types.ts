
export type ViewName = 'dashboard' | 'home' | 'varieties' | 'health' | 'techniques' | 'assistant' | 'graph' | 'map' | 'contributions' | 'production';

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'transcription';
  content: string;
  sources?: GroundingSource[];
}

export interface DiagnosisResult {
  diagnosis: string;
  confidence: number;
  severity: string;
  recommendations: string[];
  reasoning: string;
}

// Estructuras de datos para el KMS (Knowledge Management System)

export interface PotatoVariety {
  id: string;
  name: string;
  scientificName: string;
  commonNames?: string[];
  description: string; // Historia, origen y descripción general
  images: string[]; // URLs de imágenes
  
  characteristics: {
    mainColor: string; // Para mapeo de UI (ej. "Amarillo", "Rojo", "Morado")
    skinColor?: string;
    fleshColor?: string;
    shape?: string;
  };
  
  agronomy: {
    altitudeRange: string; // ej. "3200-3800 msnm"
    minAltitude?: number;
    maxAltitude?: number;
    regions: string[]; // Lista de departamentos/regiones
    soilType: string;
    growthCycle?: string; // ej. "120 días"
    resistance: {
      summary: string; // Resistencia clave
      specific: string[]; // Lista de resistencias específicas
    };
  };

  nutrition: {
    macros: { name: string; value: string }[];
    micros: { name: string; value: string }[];
    benefits?: string[];
  };

  culinary: {
    uses: string[]; // ej. ["Pachamanca", "Fritura"]
    texture?: string; // ej. "Harinosa"
  };

  conservation: {
    status: 'Bajo Riesgo' | 'Vulnerable' | 'En Peligro' | 'Extinto';
    efforts?: string;
  };
}

export interface PestDisease {
  id: string;
  name: string;
  scientificName: string;
  type: 'Hongo' | 'Bacteria' | 'Virus' | 'Plaga' | 'Otro';
  severity: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  description: string;
  
  symptoms: string[];
  conditions?: string[]; // Condiciones que favorecen la aparición
  
  management: {
    prevention: string[];
    organicControl: string[];
    chemicalControl?: string[];
    culturalControl?: string[];
  };

  images: string[]; // URLs de imágenes para referencia
}
