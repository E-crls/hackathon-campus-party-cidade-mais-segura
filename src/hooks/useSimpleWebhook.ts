import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { convertWebhookToTask, type WebhookIncident } from './useTasks';

export function useSimpleWebhook() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Função para processar webhooks pendentes
    const processWebhooks = () => {
      const pendingWebhooks = localStorage.getItem('pending_webhooks');
      if (pendingWebhooks) {
        try {
          const webhooks: WebhookIncident[] = JSON.parse(pendingWebhooks);
          
          webhooks.forEach((webhookData) => {
            // Converter webhook em task
            const newTask = convertWebhookToTask(webhookData);
            
            // Adicionar ao cache do TanStack Query
            queryClient.setQueryData(['tasks'], (oldTasks: any[] = []) => [
              newTask,
              ...oldTasks
            ]);
            
            console.log('✅ Task criada via webhook:', newTask.title);
            
            // Notificação visual
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Nova Ocorrência!', {
                body: `${newTask.title} em ${newTask.location}`,
                icon: '/favicon.ico'
              });
            }
          });
          
          // Limpar webhooks processados
          localStorage.removeItem('pending_webhooks');
          
        } catch (error) {
          console.error('Erro ao processar webhooks:', error);
        }
      }
    };

    // Processar webhooks pendentes imediatamente
    processWebhooks();

    // Escutar mudanças no localStorage (para múltiplas abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pending_webhooks' && e.newValue) {
        processWebhooks();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Polling a cada 2 segundos para verificar novos webhooks
    const interval = setInterval(processWebhooks, 2000);

    // Solicitar permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [queryClient]);
} 