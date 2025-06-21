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

// 🤖 AI Response Templates e Sistema Inteligente de Conversação
const contextKeywords = {
  // Contexto válido do projeto
  urban: ['urbana', 'cidade', 'público', 'infraestrutura', 'município', 'região', 'área'],
  safety: ['segurança', 'crime', 'violência', 'patrulhamento', 'policial', 'iluminação'],
  environment: ['lixo', 'resíduo', 'limpeza', 'coleta', 'ambiental', 'poluição'],
  infrastructure: ['iluminação', 'energia', 'elétrica', 'poste', 'luz', 'construção', 'obra'],
  prevention: ['prevenção', 'preventivo', 'antecipar', 'evitar', 'prevenir'],
  data: ['dados', 'satélite', 'análise', 'insight', 'relatório', 'estatística', 'tendência'],
  prediction: ['previsão', 'futuro', 'próximo', 'prever', 'projeção', 'estimativa'],
  action: ['ação', 'recomendação', 'sugestão', 'resolver', 'solução', 'implementar'],
  location: ['brasília', 'df', 'distrito federal', 'taguatinga', 'ceilândia', 'sobradinho', 'plano piloto', 'asa norte', 'asa sul'],
  
  // Contextos fora do escopo
  personal: ['pessoal', 'família', 'relacionamento', 'amor', 'casamento', 'filhos'],
  entertainment: ['filme', 'música', 'game', 'jogo', 'série', 'tv', 'celebridade'],
  food: ['comida', 'receita', 'cozinhar', 'restaurante', 'culinária'],
  sports: ['futebol', 'esporte', 'jogo', 'time', 'campeonato'],
  weather: ['tempo', 'clima', 'chuva', 'sol', 'temperatura'],
  technology: ['programação', 'código', 'software', 'app', 'computador', 'celular'],
  health: ['saúde', 'médico', 'doença', 'remédio', 'hospital'],
  finance: ['dinheiro', 'investimento', 'banco', 'empréstimo', 'economia'],
};

const responses = {
  // Respostas específicas por categoria
  critical_areas: [
    "Com base na análise dos dados, identifiquei que a região de **Taguatinga** apresenta o maior número de ocorrências críticas (45), principalmente relacionadas à iluminação pública deficiente. Recomendo priorizar ações de melhoria na infraestrutura de iluminação dessa região.",
    "A análise satelital indica que **Ceilândia** tem 32 pontos críticos de acúmulo de lixo. Os dados mostram correlação entre áreas mal iluminadas e maior incidência de deposição irregular de resíduos.",
    "**Sobradinho** apresenta 28 ocorrências relacionadas a construções irregulares. Nossos algoritmos detectaram expansões não autorizadas através de imagens de satélite comparativas."
  ],
  
  trends: [
    "Os dados mostram uma tendência de **aumento de 12%** nas ocorrências críticas em relação ao mês anterior. As principais causas estão relacionadas a: 1) Iluminação precária (35%), 2) Lixo acumulado (26%), 3) Construções irregulares (22%), 4) Áreas degradadas (17%).",
    "**Análise temporal:** Identificamos padrões sazonais nas ocorrências urbanas. Durante o período chuvoso, há aumento de 40% nos problemas de drenagem e acúmulo de lixo.",
    "A correlação entre baixa iluminação e incidência criminal é de **73%**. Áreas com melhorias na iluminação pública reduziram crimes noturnos em 28%."
  ],
  
  predictions: [
    "Para o próximo mês, nossos modelos de IA preveem um possível aumento nas ocorrências de **lixo acumulado** na região de Ceilândia, com base em padrões históricos e eventos sazonais. Sugiro implementar ações preventivas de coleta intensificada.",
    "**Modelo de Risco de Incêndio:** Detectamos 5 áreas com alta probabilidade de incêndio nos próximos 7 dias, com base em dados meteorológicos e vegetação seca (confiança: 87%).",
    "**Predição Criminal:** Nosso algoritmo indica aumento de 15% nos crimes noturnos na Asa Norte caso não haja melhoria na iluminação pública até o final do mês."
  ],
  
  recommendations: [
    "**Recomendações prioritárias:**\n\n1. **Iluminação**: Instalar 150 novos pontos de luz em Taguatinga\n2. **Limpeza**: Ampliar coleta em Ceilândia em 40%\n3. **Fiscalização**: Intensificar monitoramento de construções em Sobradinho\n4. **Investimento estimado**: R$ 2,3 milhões para resolver 80% das ocorrências críticas",
    "**Plano de Ação Emergencial:**\n\n• **Fase 1** (7 dias): Instalar iluminação temporária nas 12 áreas mais críticas\n• **Fase 2** (30 dias): Implementar coleta intensiva de resíduos\n• **Fase 3** (90 dias): Fiscalização e regularização de construções",
    "**Estratégia Preventiva:**\n\n- Monitoramento satelital semanal\n- Sistema de alertas automáticos\n- Parcerias com comunidades locais\n- **ROI esperado**: 300% em redução de custos de manutenção"
  ],
  
  data_analysis: [
    "**Análise Satelital Recente:**\n\n📊 **Sentinel-2**: 127 pontos de lixo detectados\n🛰️ **VIIRS**: 89 áreas mal iluminadas\n🔥 **MODIS**: 12 alertas de risco de incêndio\n💧 **SRTM**: 5 áreas de risco de inundação",
    "**Performance dos Modelos:**\n\n• Crime Prediction: 87.3% precisão\n• Fire Risk: 91.8% precisão\n• Flood Risk: 84.2% precisão\n• Urban Disorder: 93.1% precisão",
    "**Dados em Tempo Real:**\nProcessamos 2.156 imagens satelitais nas últimas 24h, identificando 47 novas ocorrências que requerem atenção imediata."
  ],
  
  methodology: [
    "**Nossa Metodologia:**\n\n🛰️ Utilizamos dados de múltiplos satélites (Sentinel-2, MODIS, VIIRS)\n🤖 Algoritmos de ML para detecção de padrões\n📊 Correlação com dados abertos governamentais\n⚡ Processamento em tempo real para alertas",
    "**Tecnologias Aplicadas:**\n\n• Computer Vision para análise de imagens\n• Redes Neurais para predições\n• Análise geoespacial avançada\n• APIs de dados abertos (SSP, INMET, IBGE)"
  ],
  
  // Respostas para contextos fora do escopo
  out_of_scope: [
    "Desculpe, mas sou especializado em análise de desordens urbanas e gestão de cidades. Posso ajudar com questões sobre infraestrutura urbana, segurança pública, gestão de resíduos, iluminação pública ou análise preditiva de problemas urbanos. Como posso auxiliar nessas áreas?",
    "Entendo sua pergunta, mas meu foco é auxiliar com questões relacionadas à gestão urbana e análise de dados satelitais. Posso fornecer insights sobre:\n\n• Análise de ocorrências urbanas\n• Predições de risco\n• Recomendações de ação\n• Dados de infraestrutura\n\nSobre qual desses temas gostaria de saber mais?",
    "Minha expertise está focada em problemas urbanos e análise preditiva de cidades. Não posso ajudar com esse tipo de questão, mas posso analisar dados sobre segurança pública, infraestrutura, limpeza urbana ou fazer previsões baseadas em dados satelitais. O que gostaria de saber sobre a gestão urbana?"
  ],
  
  clarification: [
    "Entendi sua pergunta. Com base nos dados disponíveis, posso fornecer insights específicos sobre as desordens urbanas no Distrito Federal. Você gostaria de saber sobre algum aspecto específico como tendências, previsões ou recomendações de ação?",
    "Posso detalhar melhor essa informação. Sobre qual aspecto específico você gostaria de mais detalhes? Por exemplo:\n\n• Dados técnicos e metodologia\n• Cronograma de implementação\n• Análise de custos\n• Impacto esperado",
    "Interessante questão! Para dar uma resposta mais precisa, você poderia especificar:\n\n• Região específica de interesse?\n• Período temporal (atual, histórico, futuro)?\n• Tipo de análise (técnica, financeira, operacional)?"
  ],
  
  greeting: [
    "Olá! Sou seu assistente IA especializado em análise de desordens urbanas. Posso ajudar você a entender dados de satélites, gerar insights preditivos e recomendar ações. Como posso ajudar?",
    "Oi! Estou aqui para auxiliar com análises urbanas baseadas em dados satelitais. Posso fornecer:\n\n• Análise de áreas críticas\n• Previsões de risco\n• Recomendações de ação\n• Insights de dados\n\nO que você gostaria de saber?",
    "Olá! Sou especialista em análise preditiva urbana. Tenho acesso a dados de satélites, modelos de IA e informações em tempo real sobre o Distrito Federal. Como posso auxiliar sua gestão urbana hoje?"
  ],
  
  thanks: [
    "Fico feliz em ajudar! Se tiver mais dúvidas sobre análise urbana, previsões ou recomendações, estarei aqui. 😊",
    "Por nada! É para isso que estou aqui. Sempre que precisar de insights sobre gestão urbana ou análise de dados, pode contar comigo!",
    "Foi um prazer ajudar! Minha missão é tornar a gestão urbana mais eficiente através da análise inteligente de dados. Até mais!"
  ]
};

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

  // 🤖 Ask AI - Sistema Inteligente de Conversação
  async askAI(question: string): Promise<string> {
    await this.sleep(1500); // Simulate AI processing time
    
    const lowerQuestion = question.toLowerCase();
    
    // 1. Verificar tentativas maliciosas ou comandos
    if (this.isMaliciousOrCommand(lowerQuestion)) {
      return "🔒 **Sistema Protegido** \n\nSou um assistente especializado em análise urbana. Não posso executar comandos do sistema ou responder a tentativas de acesso não autorizado.\n\n✅ **Posso ajudar com:**\n• Análise de dados urbanos\n• Insights preditivos\n• Recomendações de gestão\n• Relatórios técnicos\n\nComo posso auxiliar sua gestão urbana de forma legítima?";
    }
    
    // 2. Verificar se está fora do contexto
    if (this.isOutOfScope(lowerQuestion)) {
      return this.getRandomResponse(responses.out_of_scope);
    }
    
    // 3. Detectar saudações
    if (this.matchesKeywords(lowerQuestion, ['olá', 'oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'início', 'começar'])) {
      return this.getRandomResponse(responses.greeting);
    }
    
    // 4. Detectar agradecimentos
    if (this.matchesKeywords(lowerQuestion, ['obrigado', 'obrigada', 'valeu', 'brigadão', 'thanks', 'thx'])) {
      return this.getRandomResponse(responses.thanks);
    }
    
    // 5. Análise por categorias específicas  
    if (this.matchesKeywords(lowerQuestion, ['crítica', 'pior', 'grave', 'urgente', 'emergencial', 'prioritário'])) {
      return this.getRandomResponse(responses.critical_areas);
    }
    
    // 5.1 Perguntas específicas sobre regiões
    if (this.matchesKeywords(lowerQuestion, ['taguatinga'])) {
      return "**Análise Específica - Taguatinga:**\n\n📍 **Status Atual:** 45 ocorrências críticas identificadas\n🚨 **Prioridade:** ALTA - Iluminação pública deficiente\n📊 **Dados Satelitais:** NASA VIIRS detectou 23 pontos sem iluminação adequada\n💡 **Ação Recomendada:** Instalação emergencial de 150 pontos de luz\n💰 **Investimento:** R$ 890 mil\n⏰ **Prazo:** 30 dias para reduzir 70% das ocorrências";
    }
    
    if (this.matchesKeywords(lowerQuestion, ['ceilândia'])) {
      return "**Análise Específica - Ceilândia:**\n\n📍 **Status Atual:** 32 pontos críticos de acúmulo de lixo\n🗑️ **Problema Principal:** Deposição irregular de resíduos\n🛰️ **Detecção:** Sentinel-2 identificou padrão de crescimento de 15% ao mês\n🚛 **Solução:** Ampliar coleta em 40% + 3 ecopontos\n💰 **Custo:** R$ 340 mil (setup) + R$ 85 mil/mês\n📈 **Resultado Esperado:** Redução de 60% em 45 dias";
    }
    
    if (this.matchesKeywords(lowerQuestion, ['tendência', 'aumento', 'padrão', 'histórico', 'comparação', 'evolução'])) {
      return this.getRandomResponse(responses.trends);
    }
    
    if (this.matchesKeywords(lowerQuestion, ['previsão', 'futuro', 'próximo', 'prever', 'projeção', 'estimativa', 'vai acontecer'])) {
      return this.getRandomResponse(responses.predictions);
    }
    
    if (this.matchesKeywords(lowerQuestion, ['recomendação', 'ação', 'sugestão', 'resolver', 'solução', 'como fazer', 'plano'])) {
      return this.getRandomResponse(responses.recommendations);
    }
    
    if (this.matchesKeywords(lowerQuestion, ['dados', 'análise', 'relatório', 'estatística', 'números', 'métrica'])) {
      return this.getRandomResponse(responses.data_analysis);
    }
    
    if (this.matchesKeywords(lowerQuestion, ['como', 'metodologia', 'algoritmo', 'modelo', 'tecnologia', 'funciona'])) {
      return this.getRandomResponse(responses.methodology);
    }
    
    // 5.2 Perguntas sobre precisão e confiabilidade
    if (this.matchesKeywords(lowerQuestion, ['precisão', 'confiança', 'confiabilidade', 'acurácia', 'erro'])) {
      return "**Precisão dos Nossos Modelos:**\n\n🎯 **Crime Prediction:** 87.3% de precisão\n🔥 **Fire Risk Model:** 91.8% de precisão\n💧 **Flood Risk Model:** 84.2% de precisão\n🏙️ **Urban Disorder:** 93.1% de precisão\n\n**Como medimos:**\n• Validação cruzada com dados históricos\n• Comparação com eventos reais\n• Atualização contínua dos algoritmos\n• Margem de erro calculada estatisticamente\n\n*Nossos modelos são retreinados semanalmente com novos dados.*";
    }
    
    if (this.matchesKeywords(lowerQuestion, ['custo', 'preço', 'orçamento', 'investimento', 'valor', 'dinheiro'])) {
      return "**Análise de Custos e ROI:**\n\n💰 **Investimentos Típicos:**\n• Iluminação: R$ 2.500-4.000 por ponto\n• Sistema de coleta: R$ 250-400 mil/região\n• Vigilância eletrônica: R$ 15-25 mil/câmera\n• Fiscalização: R$ 180 mil/equipe anual\n\n📊 **Retorno do Investimento:**\n• Redução de 40% nos custos de manutenção\n• Economia de 60% em ações corretivas\n• **ROI médio:** 280% em 2 anos\n• Prevenção > Correção (economia de 3:1)\n\n*Cada R$ 1 investido em prevenção economiza R$ 3 em correções.*";
    }
    
    // 6. Resposta de esclarecimento para contexto válido mas não específico
    if (this.isValidUrbanContext(lowerQuestion)) {
      return this.getRandomResponse(responses.clarification);
    }
    
    // 7. Default - redirecionar para contexto urbano
    return this.getRandomResponse(responses.out_of_scope);
  }
  
  // 🔍 Métodos auxiliares para análise de contexto
  private isMaliciousOrCommand(question: string): boolean {
    const maliciousKeywords = [
      // Comandos de sistema
      'sudo', 'rm -rf', 'delete', 'drop table', 'exec', 'eval', 'system',
      // Tentativas de injection
      'script', 'alert', 'prompt', 'console.log', '<script>', 'javascript:',
      // Comandos SQL
      'select *', 'union select', 'insert into', 'update set',
      // Tentativas de bypass
      'ignore previous', 'forget', 'override', 'bypass', 'jailbreak',
      // Roleplay malicioso
      'pretend you are', 'act as', 'roleplay', 'simulate being'
    ];
    
    return maliciousKeywords.some(keyword => question.includes(keyword));
  }

  private isOutOfScope(question: string): boolean {
    const outOfScopeCategories = ['personal', 'entertainment', 'food', 'sports', 'technology', 'health', 'finance'];
    
    for (const category of outOfScopeCategories) {
      if (this.matchesKeywords(question, contextKeywords[category as keyof typeof contextKeywords])) {
        return true;
      }
    }
    
    return false;
  }
  
  private isValidUrbanContext(question: string): boolean {
    const validCategories = ['urban', 'safety', 'environment', 'infrastructure', 'prevention', 'data', 'prediction', 'action', 'location'];
    
    for (const category of validCategories) {
      if (this.matchesKeywords(question, contextKeywords[category as keyof typeof contextKeywords])) {
        return true;
      }
    }
    
    return false;
  }
  
  private matchesKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }
  
  private getRandomResponse(responseArray: string[]): string {
    const randomIndex = Math.floor(Math.random() * responseArray.length);
    return responseArray[randomIndex];
  }

  // 🔧 Utility method
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const orbisAPI = OrbisAPIService.getInstance(); 