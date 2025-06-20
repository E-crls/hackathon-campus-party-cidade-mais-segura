import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, User, Send, Sparkles, MessageCircle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

import { cn } from '../../utils/cn';
import { chatInputSchema } from '../../schemas';
import { formatDateTime } from '../../utils/format';
import { useChatWizard } from '../../hooks/useChatWizard';
import type { ChatInput, ChatMessage } from '../../schemas';

// Constantes e configurações
const WIZARD_CONFIG = {
  placeholders: {
    sidebar: 'Pergunte sobre insights...',
    fullPage: 'Digite sua pergunta sobre desordens urbanas...'
  }
} as const;

// Hook customizado para scroll automático
function useAutoScroll(messages: ChatMessage[], isTyping: boolean) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return messagesEndRef;
}

// Componente de entrada de mensagem reutilizável
interface MessageInputProps {
  onSubmit: (message: string) => void;
  isTyping: boolean;
  placeholder?: string;
  isCompact?: boolean;
}

function MessageInput({ onSubmit, isTyping, placeholder = "Digite sua pergunta...", isCompact = false }: MessageInputProps) {
  const form = useForm<ChatInput>({
    resolver: zodResolver(chatInputSchema),
    defaultValues: { message: '' },
  });

  const handleSubmit = (data: ChatInput) => {
    const message = data.message.trim();
    if (message) {
      onSubmit(message);
      form.reset();
    }
  };

  return (
    <div className="flex-shrink-0">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex space-x-2">
        <div className="relative flex-1 min-w-0">
          <input
            {...form.register('message')}
            placeholder={placeholder}
            className={cn(
              "w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-none",
              isCompact ? "text-sm h-10" : "h-12"
            )}
            disabled={isTyping}
            autoComplete="off"
          />
          {isTyping && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={isTyping || !form.watch('message')?.trim()}
          className={cn(
            "bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors flex-shrink-0",
            isCompact ? "h-10 w-10" : "h-12 px-6"
          )}
        >
          {isCompact ? (
            <Send className="h-4 w-4 flex-shrink-0" />
          ) : (
            <>
              <Send className="h-4 w-4 mr-2 flex-shrink-0" />
              Enviar
            </>
          )}
        </Button>
      </form>
      
      {form.formState.errors.message && (
        <div className="mt-1">
          <p className="text-xs text-red-500">
            {form.formState.errors.message.message}
          </p>
        </div>
      )}
    </div>
  );
}

// Componente de sugestões rápidas
interface QuickSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isCompact?: boolean;
}

function QuickSuggestions({ suggestions, onSuggestionClick, isCompact = false }: QuickSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className={cn('space-y-2', isCompact && 'space-y-1')}>
      <div className={cn(
        'flex items-center space-x-1 text-gray-500',
        isCompact ? 'text-xs' : 'text-xs'
      )}>
        <Lightbulb className={cn(isCompact ? 'h-3 w-3' : 'h-3 w-3')} />
        <span>Sugestões:</span>
      </div>
      <div className={cn(
        'flex flex-wrap',
        isCompact ? 'gap-2' : 'gap-3'
      )}>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className={cn(
              "rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors truncate max-w-[250px]",
              isCompact ? "px-3 py-1 text-xs" : "px-3 py-1.5 text-sm"
            )}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

// Componente principal do ChatWizard
interface ChatWizardProps {
  isInSidebar?: boolean;
}

export function ChatWizard({ isInSidebar = false }: ChatWizardProps) {
  const { messages, isTyping, sendMessage, clearMessages } = useChatWizard();
  const messagesEndRef = useAutoScroll(messages, isTyping);

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const placeholder = isInSidebar ? WIZARD_CONFIG.placeholders.sidebar : WIZARD_CONFIG.placeholders.fullPage;

  if (isInSidebar) {
    return <ChatWizardSidebar 
      messages={messages}
      isTyping={isTyping}
      onSubmit={sendMessage}
      onSuggestionClick={handleSuggestionClick}
      placeholder={placeholder}
      messagesEndRef={messagesEndRef}
      onClearMessages={clearMessages}
    />;
  }

  return <ChatWizardFullPage 
    messages={messages}
    isTyping={isTyping}
    onSubmit={sendMessage}
    onSuggestionClick={handleSuggestionClick}
    placeholder={placeholder}
    messagesEndRef={messagesEndRef}
    onClearMessages={clearMessages}
  />;
}

// Componente para versão sidebar
interface ChatWizardSidebarProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSubmit: (message: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  placeholder: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onClearMessages: () => void;
}

function ChatWizardSidebar({ 
  messages, 
  isTyping, 
  onSubmit, 
  onSuggestionClick, 
  placeholder, 
  messagesEndRef,
  onClearMessages 
}: ChatWizardSidebarProps) {
    return (
      <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Assistente IA</h3>
              <p className="text-xs text-gray-500">Análise inteligente</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearMessages}
            className="text-xs text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
          >
            Limpar
          </Button>
        </div>
      </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <ChatMessageBubble
              key={message.id}
              message={message}
            onSuggestionClick={onSuggestionClick}
              isCompact={true}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

      {/* Input */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <MessageInput
          onSubmit={onSubmit}
          isTyping={isTyping}
          placeholder={placeholder}
          isCompact={true}
        />
        </div>
      </div>
    );
  }

// Componente para versão full page
interface ChatWizardFullPageProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSubmit: (message: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  placeholder: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onClearMessages: () => void;
}

function ChatWizardFullPage({ 
  messages, 
  isTyping, 
  onSubmit, 
  onSuggestionClick, 
  placeholder, 
  messagesEndRef,
  onClearMessages 
}: ChatWizardFullPageProps) {
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
                <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-brand-600" />
                </div>
                <span>Chat Inteligente</span>
          </h1>
          <p className="text-gray-600">
                Converse com a IA para análise de desordens urbanas
              </p>
            </div>
            <Button
              variant="outline"
              onClick={onClearMessages}
              className="text-sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Nova Conversa
            </Button>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col bg-white shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-900">
                <div className="text-xs text-gray-500">
                  {messages.length - 1} mensagens • Chat ativo
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4 pr-2">
              {messages.map((message) => (
                <ChatMessageBubble
                  key={message.id}
                  message={message}
                  onSuggestionClick={onSuggestionClick}
                  isCompact={false}
                />
              ))}
              
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
              <MessageInput
                onSubmit={onSubmit}
                isTyping={isTyping}
                placeholder={placeholder}
                isCompact={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente de mensagem reutilizável
interface ChatMessageBubbleProps {
  message: ChatMessage;
  onSuggestionClick: (suggestion: string) => void;
  isCompact?: boolean;
}

function ChatMessageBubble({ message, onSuggestionClick, isCompact = false }: ChatMessageBubbleProps) {
  const isAI = message.sender === 'ai';
  
  return (
    <div className={cn('flex', isAI ? 'justify-start' : 'justify-end')}>
      <div className={cn(
        'flex w-full space-x-2', 
        !isAI && 'flex-row-reverse space-x-reverse',
        isCompact ? 'max-w-[98%]' : 'max-w-[95%]'
      )}>
        {/* Avatar */}
        <div className={cn(
          'flex-shrink-0 rounded-full flex items-center justify-center',
          isCompact ? 'w-6 h-6' : 'w-7 h-7',
          isAI ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-600'
        )}>
          {isAI ? (
            <Bot className={cn(isCompact ? 'h-3 w-3' : 'h-4 w-4')} />
          ) : (
            <User className={cn(isCompact ? 'h-3 w-3' : 'h-4 w-4')} />
          )}
        </div>
        
        {/* Message Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className={cn(
            'rounded-2xl shadow-sm break-words',
            isCompact ? 'px-4 py-3' : 'px-4 py-3',
            isAI 
              ? 'bg-gray-50 text-gray-900 border border-gray-100' 
              : 'bg-brand-500 text-white'
          )}>
            <p className={cn(
              'whitespace-pre-wrap leading-relaxed break-words',
              isCompact ? 'text-sm' : 'text-sm'
            )}>
              {message.content}
            </p>
          </div>
          
          {/* Timestamp */}
          <div className={cn(
            'flex items-center',
            isAI ? 'justify-start' : 'justify-end'
          )}>
            <span className={cn(
              'text-gray-500 font-medium',
              isCompact ? 'text-xs' : 'text-xs'
          )}>
            {formatDateTime(message.timestamp)}
          </span>
          </div>
          
          {/* Suggestions */}
          {message.suggestions && message.suggestions.length > 0 && (
            <div className={cn(isCompact ? 'mt-1' : 'mt-2')}>
              <QuickSuggestions 
                suggestions={message.suggestions}
                onSuggestionClick={onSuggestionClick}
                isCompact={isCompact}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente de indicador de digitação
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex space-x-2 max-w-[90%]">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
          <Bot className="h-4 w-4" />
        </div>
        <div className="bg-gray-50 text-gray-900 border border-gray-100 rounded-2xl px-3 py-2 shadow-sm">
          <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-xs text-gray-500">Pensando...</span>
          </div>
        </div>
      </div>
    </div>
  );
} 