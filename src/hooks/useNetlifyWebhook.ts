import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { convertWebhookToTask, type WebhookIncident } from './useTasks';

export function useNetlifyWebhook() {
  const queryClient = useQueryClient();
  const [lastCheckTimestamp, setLastCheckTimestamp] = useState<number>(Date.now());
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPendingWebhooks = async () => {
      try {
        const response = await fetch(`/.netlify/functions/webhook-inject?since=${lastCheckTimestamp}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          return;
        }
        
        const data = await response.json();
        
        if (data.current_timestamp) {
          setLastCheckTimestamp(data.current_timestamp);
        }
        
        if (data.success && data.webhooks.length > 0) {
          data.webhooks.forEach((webhookData: WebhookIncident) => {
            const webhookId = webhookData.incident_id;
            
            if (processedIds.has(webhookId)) {
              return;
            }
            
            setProcessedIds(prev => new Set(prev).add(webhookId));
            const newTask = convertWebhookToTask(webhookData);
            let taskWasAdded = false;
            
            queryClient.setQueryData(['tasks'], (oldTasks: any[] = []) => {
              const existingTask = oldTasks.find(task => task.id === newTask.id || task.incident_id === webhookId);
              if (existingTask) {
                taskWasAdded = false;
                return oldTasks;
              }
              
              taskWasAdded = true;
              return [newTask, ...oldTasks];
            });
            
            if (taskWasAdded && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('Nova Ocorrência!', {
                body: `${newTask.title} em ${newTask.location}`,
                icon: '/favicon.ico'
              });
            }
          });
        }
        
      } catch (error) {
      }
    };

    const processLocalWebhooks = () => {
      const pendingWebhooks = localStorage.getItem('pending_webhooks');
      if (pendingWebhooks) {
        try {
          const webhooks: WebhookIncident[] = JSON.parse(pendingWebhooks);
          
          webhooks.forEach((webhookData) => {
            const webhookId = webhookData.incident_id;
            
            if (processedIds.has(webhookId)) {
              return;
            }
            
            setProcessedIds(prev => new Set(prev).add(webhookId));
            const newTask = convertWebhookToTask(webhookData);
            let taskWasAdded = false;
            
            queryClient.setQueryData(['tasks'], (oldTasks: any[] = []) => {
              const existingTask = oldTasks.find(task => task.id === newTask.id || task.incident_id === webhookId);
              if (existingTask) {
                taskWasAdded = false;
                return oldTasks;
              }
              
              taskWasAdded = true;
              return [newTask, ...oldTasks];
            });
            
            if (taskWasAdded && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('Nova Ocorrência!', {
                body: `${newTask.title} em ${newTask.location}`,
                icon: '/favicon.ico'
              });
            }
          });
          
          localStorage.removeItem('pending_webhooks');
          
        } catch (error) {
        }
      }
    };

    fetchPendingWebhooks();
    processLocalWebhooks();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pending_webhooks' && e.newValue) {
        processLocalWebhooks();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const apiInterval = setInterval(() => {
      fetchPendingWebhooks();
    }, 2000);

    const localInterval = setInterval(() => {
      processLocalWebhooks();
    }, 3000);

    const cleanupInterval = setInterval(() => {
      setProcessedIds(new Set());
    }, 300000);

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(apiInterval);
      clearInterval(localInterval);
      clearInterval(cleanupInterval);
    };
  }, [queryClient]);

  const testWebhook = () => {
    const uniqueId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const testData: WebhookIncident = {
      incident_id: uniqueId,
      user_phone: '+5561999999999',
      collected_data: {
        type: 'lixo',
        description: 'Teste de webhook do Netlify',
        location: 'Brasília, DF - Teste',
        urgency: 'media',
        photos: [],
        coordinates: {
          lat: -15.7942,
          lng: -47.8822
        }
      },
      ai_analysis: {
        confidence: 95,
        priority: 'media',
        classification: 'validated'
      },
      timestamp: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('pending_webhooks') || '[]');
    existing.push(testData);
    localStorage.setItem('pending_webhooks', JSON.stringify(existing));
  };

  return {
    testWebhook,
    isActive: true
  };
}

export function useIsNetlify() {
  const isNetlify = typeof window !== 'undefined' && 
    (window.location.hostname.includes('netlify.app') || 
     window.location.hostname.includes('netlify.com') ||
     !import.meta.env.DEV);
  
  return isNetlify;
} 