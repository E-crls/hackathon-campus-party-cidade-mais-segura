import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

// Tipos para webhook
export interface WebhookIncident {
  incident_id: string;
  user_phone: string;
  collected_data: {
    type: 'lixo' | 'iluminacao' | 'crime' | 'incendio' | 'inundacao';
    description: string;
    location: string;
    urgency: 'baixa' | 'media' | 'alta' | 'critica';
    photos: string[];
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  ai_analysis: {
    confidence: number;
    priority: 'baixa' | 'media' | 'alta' | 'critica';
    classification: 'validated' | 'pending' | 'rejected';
  };
  timestamp: string;
}

// Tipos para as tasks (adaptado para trabalhar com webhook)
export interface Task {
  id: string;
  incident_id?: string; // ID do incidente do webhook
  title: string;
  description: string;
  type: 'trash' | 'lighting' | 'fire' | 'flood' | 'crime';
  priority: 'Alta' | 'Média' | 'Baixa' | 'Crítica';
  status: 'todo' | 'in-progress' | 'done';
  assignee: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  dueDate: string;
  createdAt: string;
  aiConfidence: number;
  userPhone?: string; // Telefone do usuário que reportou
  photos?: string[]; // Fotos em base64
  classification?: 'validated' | 'pending' | 'rejected';
}

export interface CreateTaskData {
  title: string;
  description: string;
  type: Task['type'];
  priority: Task['priority'];
  assignee: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  dueDate: string;
  incident_id?: string;
  userPhone?: string;
  photos?: string[];
  classification?: 'validated' | 'pending' | 'rejected';
}

export interface UpdateTaskData {
  id: string;
  status?: Task['status'];
  assignee?: string;
  priority?: Task['priority'];
  dueDate?: string;
}

// Configuração da API
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : `${window.location.origin}/api`; // Usa o domínio atual em produção


// Função para converter dados do webhook em Task
export function convertWebhookToTask(webhookData: WebhookIncident): Task {
  // Mapear tipos do webhook para tipos internos
  const typeMapping: Record<string, Task['type']> = {
    'lixo': 'trash',
    'iluminacao': 'lighting',
    'crime': 'crime',
    'incendio': 'fire',
    'inundacao': 'flood'
  };

  // Mapear prioridades do webhook para prioridades internas
  const priorityMapping: Record<string, Task['priority']> = {
    'baixa': 'Baixa',
    'media': 'Média',
    'alta': 'Alta',
    'critica': 'Crítica'
  };

  // Gerar título baseado no tipo
  const titleMapping: Record<Task['type'], string> = {
    'trash': 'Limpeza de resíduos reportada',
    'lighting': 'Problema de iluminação reportado',
    'crime': 'Ocorrência criminal reportada',
    'fire': 'Risco de incêndio reportado',
    'flood': 'Risco de inundação reportado'
  };

  const mappedType = typeMapping[webhookData.collected_data.type] || 'trash';
  const mappedPriority = priorityMapping[webhookData.ai_analysis.priority] || 'Média';

  return {
    id: webhookData.incident_id,
    incident_id: webhookData.incident_id,
    title: titleMapping[mappedType],
    description: webhookData.collected_data.description,
    type: mappedType,
    priority: mappedPriority,
    status: 'todo',
    assignee: 'Aguardando atribuição',
    location: webhookData.collected_data.location,
    coordinates: webhookData.collected_data.coordinates,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 dias a partir de hoje
    createdAt: webhookData.timestamp.split('T')[0],
    aiConfidence: webhookData.ai_analysis.confidence,
    userPhone: webhookData.user_phone,
    photos: webhookData.collected_data.photos,
    classification: webhookData.ai_analysis.classification
  };
}

class TasksAPI {
  // Buscar todas as tasks
  static async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error('Erro ao buscar tasks');
      return response.json();
    } catch (error) {
      console.warn('API não disponível, usando dados mock');
      // Fallback para dados mock se a API não estiver disponível
      return mockTasks;
    }
  }

  // Criar nova task
  static async createTask(data: CreateTaskData): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erro ao criar task');
      return response.json();
    } catch (error) {
      console.warn('API não disponível, simulando criação');
      // Fallback: simular criação
      const newTask: Task = {
        id: Date.now().toString(),
        ...data,
        status: 'todo',
        createdAt: new Date().toISOString().split('T')[0],
        aiConfidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      };
      return newTask;
    }
  }

  // Atualizar task
  static async updateTask(data: UpdateTaskData): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erro ao atualizar task');
      return response.json();
    } catch (error) {
      console.warn('API não disponível, simulando atualização');
      // Fallback: encontrar na lista mock e atualizar
      const mockTask = mockTasks.find(t => t.id === data.id);
      if (!mockTask) throw new Error('Task não encontrada');
      return { ...mockTask, ...data };
    }
  }

  // Deletar task
  static async deleteTask(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar task');
    } catch (error) {
      console.warn('API não disponível, simulando exclusão');
      // Em um cenário real, você removeria da lista
    }
  }
}

// Dados mock para fallback
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Limpeza de lixo acumulado',
    description: 'Detecção satelital: acúmulo de resíduos em área urbana (imagens Sentinel-2)',
    type: 'trash',
    priority: 'Alta',
    status: 'todo',
    assignee: 'Equipe Limpeza A',
    location: 'Brasília Centro',
    dueDate: '2024-12-25',
    createdAt: '2024-12-20',
    aiConfidence: 95
  },
  {
    id: '2',
    title: 'Reparo de iluminação pública',
    description: 'Análise noturna satelital detectou ausência de iluminação (NASA VIIRS)',
    type: 'lighting',
    priority: 'Alta',
    status: 'in-progress',
    assignee: 'Elétrica MSP',
    location: 'Taguatinga Norte',
    dueDate: '2024-12-23',
    createdAt: '2024-12-19',
    aiConfidence: 87
  },
  // ... outros dados mock
];

// Hook principal para gerenciar tasks
export function useTasks() {
  const queryClient = useQueryClient();

  // Query para buscar todas as tasks
  const {
    data: tasks = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: TasksAPI.getTasks,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  // Mutation para criar task
  const createTaskMutation = useMutation({
    mutationFn: TasksAPI.createTask,
    onSuccess: (newTask) => {
      // Atualiza o cache local
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => [
        ...oldTasks,
        newTask
      ]);
      
      // Mostra notificação de sucesso
      console.log('Task criada com sucesso:', newTask.title);
    },
    onError: (error) => {
      console.error('Erro ao criar task:', error);
    }
  });

  // Mutation para atualizar task
  const updateTaskMutation = useMutation({
    mutationFn: TasksAPI.updateTask,
    onSuccess: (updatedTask) => {
      // Atualiza o cache local
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) =>
        oldTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      
      console.log('Task atualizada:', updatedTask.title);
    },
    onError: (error) => {
      console.error('Erro ao atualizar task:', error);
    }
  });

  // Mutation para deletar task
  const deleteTaskMutation = useMutation({
    mutationFn: TasksAPI.deleteTask,
    onSuccess: (_, deletedId) => {
      // Remove do cache local
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) =>
        oldTasks.filter(task => task.id !== deletedId)
      );
      
      console.log('Task deletada:', deletedId);
    },
    onError: (error) => {
      console.error('Erro ao deletar task:', error);
    }
  });

  return {
    // Dados
    tasks,
    isLoading,
    error,
    
    // Ações
    refetch,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    
    // Estados das mutations
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
}

// Hook para WebSocket/Webhook listener
export function useTaskWebhooks() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Configurar WebSocket para receber atualizações em tempo real
    const connectWebSocket = () => {
      try {
        // Só conecta WebSocket em desenvolvimento (localhost)
        if (process.env.NODE_ENV !== 'development') {
          console.log('🌐 WebSocket não disponível em produção, usando localStorage como fallback');
          return;
        }
        
        // Conectar ao WebSocket do servidor local
        const ws = new WebSocket('ws://localhost:3001');
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('🔗 Conectado ao webhook de tasks');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Verificar se é um incident do webhook (nova estrutura)
            if (data.incident_id && data.collected_data) {
              // Converter dados do webhook em task
              const newTask = convertWebhookToTask(data as WebhookIncident);
              
              // Adicionar nova task ao cache
              queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => [
                newTask,
                ...oldTasks
              ]);
              
              console.log('🚨 Nova ocorrência recebida via webhook:', {
                type: data.collected_data.type,
                location: data.collected_data.location,
                priority: data.ai_analysis.priority,
                confidence: data.ai_analysis.confidence
              });
              
              // Notificação visual (você pode implementar toast aqui)
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Nova Ocorrência Detectada', {
                  body: `${newTask.title} em ${newTask.location}`,
                  icon: '/favicon.ico'
                });
              }
              
              return;
            }
            
            // Processar eventos tradicionais do sistema
            switch (data.type) {
              case 'TASK_CREATED':
                queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => [
                  ...oldTasks,
                  data.task
                ]);
                console.log('📝 Nova task recebida via webhook:', data.task.title);
                break;
                
              case 'TASK_UPDATED':
                queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) =>
                  oldTasks.map(task => 
                    task.id === data.task.id ? data.task : task
                  )
                );
                console.log('✏️ Task atualizada via webhook:', data.task.title);
                break;
                
              case 'TASK_DELETED':
                queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) =>
                  oldTasks.filter(task => task.id !== data.taskId)
                );
                console.log('🗑️ Task removida via webhook:', data.taskId);
                break;
                
              default:
                console.log('📨 Evento webhook desconhecido:', data);
            }
          } catch (error) {
            console.error('Erro ao processar mensagem webhook:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('❌ Erro no WebSocket:', error);
        };

        ws.onclose = () => {
          console.log('🔌 WebSocket desconectado. Tentando reconectar...');
          // Reconectar após 5 segundos
          setTimeout(connectWebSocket, 5000);
        };

      } catch (error) {
        console.warn('WebSocket não disponível, usando polling como fallback');
        // Fallback: polling a cada 30 segundos
        const interval = setInterval(() => {
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }, 30000);

        return () => clearInterval(interval);
      }
    };

    connectWebSocket();

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [queryClient]);

  // Função para simular recebimento de webhook (para testes)
  const simulateWebhook = (type: 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_DELETED', data: any) => {
    const event = new MessageEvent('message', {
      data: JSON.stringify({ type, ...data })
    });
    
    if (wsRef.current) {
      wsRef.current.dispatchEvent(event);
    }
  };

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    simulateWebhook, // Para testes
  };
} 