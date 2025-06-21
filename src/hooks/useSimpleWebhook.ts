import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { convertWebhookToTask, type WebhookIncident } from './useTasks';

export function useSimpleWebhook() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const processWebhooks = () => {
      const pendingWebhooks = localStorage.getItem('pending_webhooks');
      if (pendingWebhooks) {
        try {
          const webhooks: WebhookIncident[] = JSON.parse(pendingWebhooks);
          
          webhooks.forEach((webhookData) => {
            const newTask = convertWebhookToTask(webhookData);
            
            queryClient.setQueryData(['tasks'], (oldTasks: any[] = []) => [
              newTask,
              ...oldTasks
            ]);
            
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Nova Ocorrência!', {
                body: `${newTask.title} em ${newTask.location}`,
                icon: '/favicon.ico'
              });
            }
          });
          
          localStorage.removeItem('pending_webhooks');
          
        } catch (error) {
          console.error('Erro ao processar webhooks:', error);
        }
      }
    };

    processWebhooks();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pending_webhooks' && e.newValue) {
        processWebhooks();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(processWebhooks, 2000);

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [queryClient]);
} 