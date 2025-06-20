import { useState } from 'react';

/**
 * Hook para gerenciamento de estados de loading
 * Simplifica o controle de loading em componentes
 */
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [message, setMessage] = useState<string>('');

  const showLoading = (loadingMessage = 'Carregando...') => {
    setMessage(loadingMessage);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setMessage('');
  };

  const withLoading = async <T>(
    asyncFn: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T> => {
    showLoading(loadingMessage);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      hideLoading();
    }
  };

  return {
    isLoading,
    message,
    showLoading,
    hideLoading,
    withLoading,
  };
} 