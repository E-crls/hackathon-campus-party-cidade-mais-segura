import type { KPIData, Occurrence, Region, MapFilter } from '../schemas';

// 🔄 Mock Data (simulando API real)
const mockKPIs: KPIData = {
  critical: { value: 47, trend: 12 },
  monitoring: { value: 156, trend: -8 },
  resolved: { value: 289, trend: 24 },
  predictions: { value: 78, accuracy: 92 }
};

const mockOccurrences: Occurrence[] = [
  {
    id: '1',
    type: 'lighting',
    count: 45,
    priority: 'high',
    region: 'Taguatinga',
    description: 'Iluminação pública deficiente na região central',
    lat: -15.8386,
    lng: -48.0494,
    status: 'pending',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    type: 'waste',
    count: 32,
    priority: 'medium',
    region: 'Ceilândia',
    description: 'Acúmulo de lixo em pontos específicos',
    lat: -15.8159,
    lng: -48.1070,
    status: 'in_progress',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    type: 'construction',
    count: 28,
    priority: 'high',
    region: 'Sobradinho',
    description: 'Construções irregulares identificadas',
    lat: -15.6533,
    lng: -47.7869,
    status: 'pending',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '4',
    type: 'degraded',
    count: 18,
    priority: 'low',
    region: 'Plano Piloto',
    description: 'Áreas com degradação urbana',
    lat: -15.7801,
    lng: -47.9292,
    status: 'resolved',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-18'),
  },
];

const mockRegions: Region[] = [
  {
    id: '1',
    name: 'Taguatinga',
    lat: -15.8386,
    lng: -48.0494,
    occurrences: 45,
    status: 'critical',
  },
  {
    id: '2',
    name: 'Ceilândia',
    lat: -15.8159,
    lng: -48.1070,
    occurrences: 32,
    status: 'warning',
  },
  {
    id: '3',
    name: 'Sobradinho',
    lat: -15.6533,
    lng: -47.7869,
    occurrences: 28,
    status: 'warning',
  },
  {
    id: '4',
    name: 'Plano Piloto',
    lat: -15.7801,
    lng: -47.9292,
    occurrences: 18,
    status: 'normal',
  },
];

// 🤖 AI Response Templates
const aiResponses = [
  "Com base na análise dos dados, identifiquei que a região de **Taguatinga** apresenta o maior número de ocorrências críticas (45), principalmente relacionadas à iluminação pública deficiente. Recomendo priorizar ações de melhoria na infraestrutura de iluminação dessa região.",
  
  "Os dados mostram uma tendência de **aumento de 12%** nas ocorrências críticas em relação ao mês anterior. As principais causas estão relacionadas a: 1) Iluminação precária (35%), 2) Lixo acumulado (26%), 3) Construções irregulares (22%), 4) Áreas degradadas (17%).",
  
  "Para o próximo mês, nossos modelos de IA preveem um possível aumento nas ocorrências de **lixo acumulado** na região de Ceilândia, com base em padrões históricos e eventos sazonais. Sugiro implementar ações preventivas de coleta intensificada.",
  
  "**Recomendações prioritárias:**\n\n1. **Iluminação**: Instalar 150 novos pontos de luz em Taguatinga\n2. **Limpeza**: Ampliar coleta em Ceilândia em 40%\n3. **Fiscalização**: Intensificar monitoramento de construções em Sobradinho\n4. **Investimento estimado**: R$ 2,3 milhões para resolver 80% das ocorrências críticas",
];

// 🚀 API Service Class
export class OrbisAPIService {
  private static instance: OrbisAPIService;
  
  public static getInstance(): OrbisAPIService {
    if (!OrbisAPIService.instance) {
      OrbisAPIService.instance = new OrbisAPIService();
    }
    return OrbisAPIService.instance;
  }

  // 📊 Get KPIs
  async getKPIs(): Promise<KPIData> {
    // Simulate API delay
    await this.sleep(800);
    return mockKPIs;
  }

  // 🎯 Get Occurrences
  async getOccurrences(filter?: MapFilter): Promise<Occurrence[]> {
    await this.sleep(600);
    
    let filtered = [...mockOccurrences];
    
    if (filter?.type && filter.type !== 'all') {
      if (filter.type === 'critical') {
        filtered = filtered.filter(o => o.priority === 'high');
      } else {
        filtered = filtered.filter(o => o.type === filter.type);
      }
    }
    
    if (filter?.region) {
      filtered = filtered.filter(o => 
        o.region.toLowerCase().includes(filter.region!.toLowerCase())
      );
    }
    
    return filtered;
  }

  // 🗺️ Get Regions
  async getRegions(): Promise<Region[]> {
    await this.sleep(500);
    return mockRegions;
  }

  // 🤖 Ask AI
  async askAI(question: string): Promise<string> {
    await this.sleep(1500); // Simulate AI processing time
    
    // Simple keyword-based response selection
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('crítica') || lowerQuestion.includes('pior')) {
      return aiResponses[0];
    }
    
    if (lowerQuestion.includes('tendência') || lowerQuestion.includes('aumento')) {
      return aiResponses[1];
    }
    
    if (lowerQuestion.includes('previsão') || lowerQuestion.includes('próximo')) {
      return aiResponses[2];
    }
    
    if (lowerQuestion.includes('recomendação') || lowerQuestion.includes('ação')) {
      return aiResponses[3];
    }
    
    // Default response
    return "Entendi sua pergunta. Com base nos dados disponíveis, posso fornecer insights específicos sobre as desordens urbanas no Distrito Federal. Você gostaria de saber sobre algum aspecto específico como tendências, previsões ou recomendações de ação?";
  }

  // 🔧 Utility method
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const orbisAPI = OrbisAPIService.getInstance(); 