import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { convertWebhookToTask, type WebhookIncident } from './useTasks';

// Hook otimizado para funcionar no Netlify
export function useNetlifyWebhook() {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🚀 Iniciando webhook do Netlify...');

    // Função para buscar webhooks pendentes da API
    const fetchPendingWebhooks = async () => {
      console.log('🔄 [FRONTEND] Verificando webhooks pendentes na API...');
      try {
        const response = await fetch('/.netlify/functions/webhook-inject', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.warn('⚠️ Erro ao buscar webhooks:', response.status);
          console.warn('❌ [FRONTEND] Falha ao buscar webhooks da API');
          return;
        }
        
        const data = await response.json();
        console.log('📋 [FRONTEND] Resposta da API recebida:', JSON.stringify(data, null, 2));
        
        if (data.success && data.webhooks.length > 0) {
          console.log(`📥 Recebidos ${data.webhooks.length} webhooks da API`);
          console.log('🔍 [FRONTEND] Webhooks recebidos da API:', JSON.stringify(data.webhooks, null, 2));
          
          data.webhooks.forEach((webhookData: WebhookIncident) => {
            // Converter webhook em task
            const newTask = convertWebhookToTask(webhookData);
            
            // Adicionar ao cache do TanStack Query
            queryClient.setQueryData(['tasks'], (oldTasks: any[] = []) => [
              newTask,
              ...oldTasks
            ]);
            
            console.log('✅ Task criada via webhook Netlify:', newTask.title);
            console.log('🎯 [FRONTEND] Nova task adicionada ao cache:', JSON.stringify(newTask, null, 2));
            
            // Notificação visual
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Nova Ocorrência!', {
                body: `${newTask.title} em ${newTask.location}`,
                icon: '/favicon.ico'
              });
            }
          });
          
          console.log(`📦 Processados ${data.webhooks.length} webhooks da API`);
          console.log('🏁 [FRONTEND] Todos os webhooks foram processados e adicionados à interface');
        }
        
      } catch (error) {
        console.error('❌ Erro ao buscar webhooks pendentes:', error);
        console.error('💥 [FRONTEND] Erro na requisição para webhook-checker:', error);
      }
    };

    // Função para processar webhooks do localStorage (fallback)
    const processLocalWebhooks = () => {
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
            
            console.log('✅ Task criada via webhook localStorage:', newTask.title);
            
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
          
          console.log(`📦 Processados ${webhooks.length} webhooks do localStorage`);
          
        } catch (error) {
          console.error('❌ Erro ao processar webhooks do localStorage:', error);
        }
      }
    };

    // Processar webhooks pendentes imediatamente
    fetchPendingWebhooks();
    processLocalWebhooks();

    // Escutar mudanças no localStorage (para múltiplas abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pending_webhooks' && e.newValue) {
        console.log('📨 Novo webhook detectado via storage event');
        processLocalWebhooks();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Polling para buscar webhooks da API (mais agressivo)
    const apiInterval = setInterval(() => {
      fetchPendingWebhooks();
    }, 2000); // A cada 2 segundos

    // Polling para localStorage (fallback)
    const localInterval = setInterval(() => {
      processLocalWebhooks();
    }, 3000); // A cada 3 segundos

    // Solicitar permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Permissão de notificação:', permission);
      });
    }

    console.log('🟢 Webhook Netlify ativo - aguardando dados...');

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(apiInterval);
      clearInterval(localInterval);
      console.log('🔴 Webhook Netlify desconectado');
    };
  }, [queryClient]);

  // Função para testar webhook manualmente
  const testWebhook = () => {
    const testData: WebhookIncident = {
      incident_id: `test-${Date.now()}`,
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

    // Adicionar ao localStorage para teste
    const existing = JSON.parse(localStorage.getItem('pending_webhooks') || '[]');
    existing.push(testData);
    localStorage.setItem('pending_webhooks', JSON.stringify(existing));
    
    console.log('🧪 Webhook de teste enviado');
  };

  return {
    testWebhook,
    isActive: true
  };
}

// Hook para verificar se estamos no Netlify
export function useIsNetlify() {
  const isNetlify = typeof window !== 'undefined' && 
    (window.location.hostname.includes('netlify.app') || 
     window.location.hostname.includes('netlify.com') ||
     !import.meta.env.DEV);
  
  return isNetlify;
} 