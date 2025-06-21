import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';


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


export interface Task {
  id: string;
  incident_id?: string;
  source: 'population' | 'satellite';
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
  userPhone?: string;
  photos?: string[];
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
  source?: 'population' | 'satellite';
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


const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3001/api'
  : `${window.location.origin}/api`;



export function convertWebhookToTask(webhookData: WebhookIncident): Task {

  const typeMapping: Record<string, Task['type']> = {
    'lixo': 'trash',
    'iluminacao': 'lighting',
    'crime': 'crime',
    'incendio': 'fire',
    'inundacao': 'flood'
  };


  const priorityMapping: Record<string, Task['priority']> = {
    'baixa': 'Baixa',
    'media': 'Média',
    'alta': 'Alta',
    'critica': 'Crítica'
  };


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
    source: 'population',
    title: titleMapping[mappedType],
    description: webhookData.collected_data.description,
    type: mappedType,
    priority: mappedPriority,
    status: 'todo',
    assignee: 'Aguardando atribuição',
    location: webhookData.collected_data.location,
    coordinates: webhookData.collected_data.coordinates,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: webhookData.timestamp.split('T')[0],
    aiConfidence: webhookData.ai_analysis.confidence,
    userPhone: webhookData.user_phone,
    photos: webhookData.collected_data.photos,
    classification: webhookData.ai_analysis.classification
  };
}

class TasksAPI {
  static async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error('Erro ao buscar tasks');
      return response.json();
    } catch (error) {
      console.warn('API não disponível, usando dados mock');
      return mockTasks;
    }
  }

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
      const newTask: Task = {
        id: Date.now().toString(),
        ...data,
        source: data.source || 'satellite',
        status: 'todo',
        createdAt: new Date().toISOString().split('T')[0],
        aiConfidence: Math.floor(Math.random() * 30) + 70,
      };
      return newTask;
    }
  }

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
      const mockTask = mockTasks.find(t => t.id === data.id);
      if (!mockTask) throw new Error('Task não encontrada');
      return { ...mockTask, ...data };
    }
  }

  static async deleteTask(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar task');
    } catch (error) {
      console.warn('API não disponível, simulando exclusão');
    }
  }
}

const mockTasks: Task[] = [
  {
    id: '1',
    source: 'satellite',
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
    source: 'satellite',
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
];

export function useTasks() {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: TasksAPI.getTasks,
    staleTime: 1000 * 60 * 2,
  });

  const createTaskMutation = useMutation({
    mutationFn: TasksAPI.createTask,
    onSuccess: (newTask) => {
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => [
        ...oldTasks,
        newTask
      ]);


    },
    onError: (error) => {
      console.error('Erro ao criar task:', error);
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: TasksAPI.updateTask,
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) =>
        oldTasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );


    },
    onError: (error) => {
      console.error('Erro ao atualizar task:', error);
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: TasksAPI.deleteTask,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) =>
        oldTasks.filter(task => task.id !== deletedId)
      );


    },
    onError: (error) => {
      console.error('Erro ao deletar task:', error);
    }
  });

  return {
    tasks,
    isLoading,
    error,

    refetch,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,

    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
}

export function useTaskWebhooks() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        if (!import.meta.env.DEV) {
          return;
        }

        const ws = new WebSocket('ws://localhost:3001');
        wsRef.current = ws;

        ws.onopen = () => {

        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.incident_id && data.collected_data) {
              const newTask = convertWebhookToTask(data as WebhookIncident);

              queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => [
                newTask,
                ...oldTasks
              ]);



              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Nova Ocorrência Detectada', {
                  body: `${newTask.title} em ${newTask.location}`,
                  icon: '/favicon.ico'
                });
              }

              return;
            }

            switch (data.type) {
              case 'TASK_CREATED':
                queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => [
                  ...oldTasks,
                  data.task
                ]);

                break;

              case 'TASK_UPDATED':
                queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) =>
                  oldTasks.map(task =>
                    task.id === data.task.id ? data.task : task
                  )
                );

                break;

              case 'TASK_DELETED':
                queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) =>
                  oldTasks.filter(task => task.id !== data.taskId)
                );

                break;

              default:

            }
          } catch (error) {
            console.error('Erro ao processar mensagem webhook:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('Erro no WebSocket:', error);
        };

        ws.onclose = () => {
          setTimeout(connectWebSocket, 5000);
        };

      } catch (error) {
        const interval = setInterval(() => {
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }, 30000);

        return () => clearInterval(interval);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [queryClient]);

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
    simulateWebhook,
  };
} 