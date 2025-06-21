import { useState, useCallback } from 'react';
import { orbisAPI } from '../services/api';
import type { ChatMessage } from '../schemas';

interface UseChatWizardOptions {
  initialMessage?: ChatMessage;
  onError?: (error: Error) => void;
}

export function useChatWizard(options: UseChatWizardOptions = {}) {
  const defaultInitialMessage: ChatMessage = {
    id: '1',
    content: 'Olá! 👋 Sou seu assistente IA especializado em análise de desordens urbanas. \n\n🛰️ **Minhas capacidades:**\n• Análise de dados satelitais em tempo real\n• Predições de risco com IA\n• Recomendações baseadas em evidências\n• Insights de correlação entre fatores urbanos\n\n**Como posso auxiliar sua gestão urbana hoje?**',
    sender: 'ai',
    timestamp: new Date(),
    suggestions: [
      'Quais são as áreas mais críticas agora?',
      'Previsões para os próximos 30 dias',
      'Recomendações de ação imediata',
      'Como funciona a análise satelital?'
    ],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    options.initialMessage || defaultInitialMessage
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((content: string, sender: ChatMessage['sender'], suggestions?: string[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      suggestions,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([options.initialMessage || defaultInitialMessage]);
  }, [options.initialMessage]);

  const generateContextualSuggestions = useCallback((content: string): string[] => {
    const contentLower = content.toLowerCase();
    
    // Sugestões mais específicas e inteligentes baseadas no contexto
    const suggestionMap = {
      // Áreas críticas e emergenciais
      'críticas|grave|urgente|emergencial|prioritário': [
        'Como resolver rapidamente?', 
        'Qual o cronograma de ação?', 
        'Investimento necessário?', 
        'Equipes envolvidas?'
      ],
      
      // Análises e dados
      'dados|análise|estatística|números|métrica': [
        'Dados históricos detalhados', 
        'Comparação com outras regiões', 
        'Relatório técnico completo', 
        'Metodologia utilizada'
      ],
      
      // Previsões e tendências
      'previsão|futuro|próximo|tendência|aumento|padrão': [
        'Como prevenir problemas?', 
        'Ações preventivas recomendadas', 
        'Análise de cenários', 
        'Impacto a longo prazo'
      ],
      
      // Recomendações e soluções
      'recomendação|ação|sugestão|resolver|solução|plano': [
        'Cronograma de implementação', 
        'Recursos humanos necessários', 
        'Orçamento estimado', 
        'Indicadores de sucesso'
      ],
      
      // Segurança e crime
      'segurança|crime|violência|patrulhamento|policial': [
        'Mapeamento de riscos detalhado', 
        'Estratégias de prevenção', 
        'Monitoramento em tempo real', 
        'Correlação com iluminação'
      ],
      
      // Infraestrutura e iluminação
      'iluminação|energia|elétrica|poste|luz|infraestrutura': [
        'Plano de expansão', 
        'Manutenção preventiva', 
        'Tecnologias recomendadas', 
        'Cronograma de obras'
      ],
      
      // Limpeza e resíduos
      'lixo|resíduo|limpeza|coleta|ambiental': [
        'Otimização de rotas', 
        'Frequência ideal de coleta', 
        'Pontos críticos mapeados', 
        'Custos operacionais'
      ],
      
      // Construções e fiscalização
      'construção|obra|irregular|fiscalização': [
        'Processo de regularização', 
        'Multas e penalidades', 
        'Cronograma de fiscalização', 
        'Impacto urbano'
      ],
      
      // Regiões específicas
      'taguatinga|ceilândia|sobradinho|brasília|plano.piloto': [
        'Análise regional específica', 
        'Comparar com outras regiões', 
        'Histórico da área', 
        'Prioridades locais'
      ],
      
      // Metodologia e tecnologia
      'como|metodologia|algoritmo|modelo|tecnologia|satélite': [
        'Detalhes técnicos', 
        'Precisão dos modelos', 
        'Fontes de dados', 
        'Limitações do sistema'
      ],
      
      // Respostas de agradecimento
      'obrigado|obrigada|valeu|brigadão': [
        'Análise de outras áreas?', 
        'Relatório personalizado?', 
        'Acompanhamento contínuo?', 
        'Insights adicionais?'
      ],
      
      // Contexto fora do escopo
      'futebol|comida|filme|música|pessoal|amor|saúde': [
        'Análise de áreas críticas', 
        'Previsões urbanas', 
        'Recomendações de ação', 
        'Dados satelitais'
      ]
    };

    // Procurar por correspondências mais específicas primeiro
    for (const [keywords, suggestions] of Object.entries(suggestionMap)) {
      const regex = new RegExp(keywords, 'i');
      if (regex.test(contentLower)) {
        // Randomizar as sugestões para variedade
        const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3); // Retornar apenas 3 sugestões
      }
    }

    // Sugestões padrão contextuais
    const defaultSuggestions = [
      ['Explique as áreas mais críticas', 'Análise de tendências', 'Recomendações prioritárias'],
      ['Dados em tempo real', 'Previsões para próximo mês', 'Como resolver rapidamente?'],
      ['Metodologia dos modelos', 'Investimento necessário', 'Cronograma de ações'],
      ['Comparação entre regiões', 'Impacto das soluções', 'Monitoramento contínuo']
    ];
    
    const randomIndex = Math.floor(Math.random() * defaultSuggestions.length);
    return defaultSuggestions[randomIndex];
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    try {
      addMessage(message, 'user');
      setIsTyping(true);
      
      const response = await orbisAPI.askAI(message);
      const suggestions = generateContextualSuggestions(response);
      
      setIsTyping(false);
      addMessage(response, 'ai', suggestions);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setIsTyping(false);
      
      const errorMessage = 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente ou reformule sua pergunta.';
      const errorSuggestions = ['Tentar novamente', 'Ajuda com comandos', 'Falar com suporte'];
      
      addMessage(errorMessage, 'ai', errorSuggestions);
      
      if (options.onError) {
        options.onError(error as Error);
      }
    }
  }, [addMessage, generateContextualSuggestions, options]);

  return {
    messages,
    isTyping,
    sendMessage,
    addMessage,
    clearMessages,
    generateContextualSuggestions
  };
} 