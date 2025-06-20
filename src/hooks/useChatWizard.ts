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
    content: 'Olá! Sou seu assistente IA especializado em análise de desordens urbanas. Posso ajudar você a entender dados de satélites, gerar insights preditivos e recomendar ações. Como posso ajudar?',
    sender: 'ai',
    timestamp: new Date(),
    suggestions: [
      'Explique as áreas mais críticas',
      'Previsões para próximo mês',
      'Recomendações de ação',
      'Análise de tendências'
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
    
    const suggestionMap = {
      'críticas|risco|urgente': ['Como resolver rapidamente?', 'Qual o investimento necessário?', 'Definir prioridades'],
      'previsão|aumento|tendência': ['Como prevenir?', 'Quais ações preventivas?', 'Análise de padrões'],
      'recomendações|sugestões': ['Cronograma de implementação', 'Recursos necessários', 'Análise de impacto'],
      'dados|estatísticas': ['Mostre dados históricos', 'Análise comparativa', 'Relatório detalhado'],
      'segurança|crime': ['Mapeamento de riscos', 'Estratégias de prevenção', 'Monitoramento'],
      'iluminação|infraestrutura': ['Plano de manutenção', 'Orçamento necessário', 'Cronograma de obras'],
      'lixo|resíduos': ['Otimização de rotas', 'Frequência de coleta', 'Pontos críticos']
    };

    for (const [keywords, suggestions] of Object.entries(suggestionMap)) {
      const regex = new RegExp(keywords, 'i');
      if (regex.test(contentLower)) {
        return suggestions;
      }
    }

    return ['Explique mais detalhes', 'Mostre exemplos práticos', 'Análise complementar'];
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