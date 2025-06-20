import { useState } from 'react';
import type { DragEvent } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Calendar,
  MapPin,
  AlertTriangle,
  Trash2,
  Lightbulb,
  Flame,
  Droplets,
  Shield,
  Clock,
  X,
  Save,
  User,
  FileText,
  Wifi,

  Settings,
  Phone,
  Image,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

import { WebhookInfo } from '../../components/ui/WebhookInfo';
import { cn } from '../../utils/cn';
import { useTasks, type Task, type CreateTaskData } from '../../hooks/useTasks';
import { useSimpleWebhook } from '../../hooks/useSimpleWebhook';

const columns = [
  { id: 'todo', title: 'A Fazer', color: 'bg-brand-100' },
  { id: 'in-progress', title: 'Fazendo', color: 'bg-yellow-100' },
  { id: 'done', title: 'Concluído', color: 'bg-green-100' }
];

export function KanbanBoard() {
  // Hooks do TanStack Query
  const { 
    tasks, 
    isLoading, 
    error, 
    createTask, 
    updateTask,
    isCreating,
    isUpdating,
    refetch
  } = useTasks();
  
  // Hook para escutar webhooks simples
  useSimpleWebhook();

  // Estados locais
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState<string | null>(null);
  const [showWebhookInfo, setShowWebhookInfo] = useState(false);
  const [newTask, setNewTask] = useState<Partial<CreateTaskData>>({
    title: '',
    description: '',
    type: 'trash',
    priority: 'Média',
    assignee: '',
    location: '',
    dueDate: '',
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || task.type === filterType;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const moveTask = (taskId: string, newStatus: string) => {
    updateTask({
      id: taskId,
      status: newStatus as Task['status']
    });
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, newStatus: string) => {
    e.preventDefault();
    if (draggedTask) {
      moveTask(draggedTask, newStatus);
      setDraggedTask(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleCreateTask = () => {
    if (newTask.title && newTask.description) {
      const taskData: CreateTaskData = {
        title: newTask.title,
        description: newTask.description,
        type: newTask.type as Task['type'],
        priority: newTask.priority as Task['priority'],
        assignee: newTask.assignee || 'Não atribuído',
        location: newTask.location || 'Local não especificado',
        dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      };
      
      createTask(taskData);
      setNewTask({
        title: '',
        description: '',
        type: 'trash',
        priority: 'Média',
        assignee: '',
        location: '',
        dueDate: '',
      });
      setShowNewTaskModal(false);
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    const icons = {
      trash: Trash2,
      lighting: Lightbulb,
      fire: Flame,
      flood: Droplets,
      crime: Shield,
    };
    return icons[type];
  };

  const getTypeColor = (type: Task['type']) => {
    const colors = {
      trash: 'text-green-600',
      lighting: 'text-brand-600',
      fire: 'text-red-600',
      flood: 'text-brand-600',
      crime: 'text-brand-600',
    };
    return colors[type];
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      'Crítica': 'bg-red-100 text-red-700',
      'Alta': 'bg-orange-100 text-orange-700',
      'Média': 'bg-yellow-100 text-yellow-700',
      'Baixa': 'bg-blue-100 text-blue-700',
    };
    return colors[priority];
  };

  // Função para simular webhook (para demonstração)
  const handleSimulateWebhook = () => {
    const sampleWebhookData = {
      incident_id: `incident-${Date.now()}`,
      user_phone: "+5561999999999",
      collected_data: {
        type: "lixo" as const,
        description: "Acúmulo de lixo na calçada reportado via app móvel",
        location: "Rua das Flores, 123 - Brasília/DF",
        urgency: "media" as const,
        photos: ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."],
        coordinates: {
          lat: -15.7942,
          lng: -47.8822
        }
      },
      ai_analysis: {
        confidence: 87,
        priority: "media" as const,
        classification: "validated" as const
      },
      timestamp: new Date().toISOString()
    };
    
    // Salvar no localStorage para simular webhook
    const existing = JSON.parse(localStorage.getItem('pending_webhooks') || '[]');
    existing.push(sampleWebhookData);
    localStorage.setItem('pending_webhooks', JSON.stringify(existing));
  };

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 p-4 overflow-hidden flex flex-col relative">
        {/* Interface base (desfocada) */}
        <div className="w-full flex flex-col h-full opacity-30 blur-sm">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Gestão de Tarefas</h1>
              <p className="text-sm text-gray-600">Carregando dados...</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 h-full">
              {columns.map((column) => (
                <div key={column.id} className="flex flex-col">
                  <div className="h-full flex flex-col bg-white shadow-sm border border-gray-200 rounded-lg">
                    <div className="p-4 pb-3">
                      <div className="flex items-center space-x-2">
                        <div className={cn('w-3 h-3 rounded-full', column.color)}></div>
                        <span className="text-base font-semibold">{column.title}</span>
                      </div>
                    </div>
                    <div className="flex-1 px-3 pb-3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay de Loading */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 text-center">
            <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-sm font-medium text-gray-900 mb-2">
              Carregando Tarefas
            </div>
            <div className="text-xs text-gray-500">
              Sincronizando dados em tempo real...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar tarefas</h2>
          <p className="text-gray-600 mb-4">Não foi possível conectar com o servidor</p>
          <Button onClick={() => refetch()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 p-4 overflow-hidden flex flex-col">
      <div className="w-full flex flex-col h-full">
        
        {/* Header - Compacto */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center space-x-3">
              <span>Gestão de Tarefas</span>
              {(isCreating || isUpdating) && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-600"></div>
                  <span className="text-sm text-brand-600">Sincronizando...</span>
                </div>
              )}
            </h1>
            <p className="text-sm text-gray-600">
              Tarefas identificadas automaticamente via satélites • {tasks.length} tarefas
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Status do webhook */}
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">Webhook ativo</span>
            </div>
            
            {/* Botão de configuração do webhook */}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowWebhookInfo(true)}
              className="text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              Webhook
            </Button>
            
            {/* Botão para simular webhook (apenas para demonstração) */}
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleSimulateWebhook}
              className="text-xs"
            >
              Simular Webhook
            </Button>
            
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>20 de dezembro de 2024</span>
            </div>
          </div>
        </div>

        {/* Filters and Search - Compacto */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex-1 min-w-48">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm text-sm"
          >
            <option value="all">Tipos</option>
            <option value="trash">Lixo</option>
            <option value="lighting">Iluminação</option>
            <option value="fire">Incêndio</option>
            <option value="flood">Inundação</option>
            <option value="crime">Crime</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm text-sm"
          >
            <option value="all">Prioridades</option>
            <option value="Crítica">Crítica</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>

          <Button 
            size="sm" 
            className="bg-brand-500 hover:bg-brand-600 text-white"
            onClick={() => setShowNewTaskModal(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Nova</span>
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-3 gap-4 h-full">
            {columns.map((column) => (
              <div 
                key={column.id} 
                className="flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <Card className="h-full flex flex-col bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-gray-900 flex items-center space-x-2">
                        <div className={cn('w-3 h-3 rounded-full', column.color)}></div>
                        <span>{column.title}</span>
                        <span className="text-sm font-normal text-gray-500">
                          ({getTasksByStatus(column.id).length})
                        </span>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-y-auto space-y-2 px-3 pb-3">
                    {getTasksByStatus(column.id).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onMove={moveTask}
                        getTypeIcon={getTypeIcon}
                        getTypeColor={getTypeColor}
                        getPriorityColor={getPriorityColor}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        isDragging={draggedTask === task.id}
                        onTaskClick={setShowTaskDetails}
                      />
                    ))}
                    
                    {getTasksByStatus(column.id).length === 0 && (
                      <div className="text-center py-6 text-gray-400">
                        <div className="text-sm">Nenhuma tarefa</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Modal para Nova Tarefa */}
        {showNewTaskModal && (
          <NewTaskModal 
            newTask={newTask}
            setNewTask={setNewTask}
            onSave={handleCreateTask}
            onClose={() => setShowNewTaskModal(false)}
          />
        )}

        {/* Modal de Detalhes da Tarefa */}
        {showTaskDetails && (
          <TaskDetailsModal
            task={tasks.find(t => t.id === showTaskDetails)}
            onClose={() => setShowTaskDetails(null)}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
            getPriorityColor={getPriorityColor}
          />
        )}

        {/* Modal de Informações do Webhook */}
        <WebhookInfo
          isVisible={showWebhookInfo}
          onClose={() => setShowWebhookInfo(false)}
        />
      </div>
    </div>
  );
}

// Modal para Nova Tarefa
interface NewTaskModalProps {
  newTask: Partial<CreateTaskData>;
  setNewTask: (task: Partial<CreateTaskData>) => void;
  onSave: () => void;
  onClose: () => void;
}

function NewTaskModal({ newTask, setNewTask, onSave, onClose }: NewTaskModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-brand-500" />
              </div>
              <span>Nova Ocorrência</span>
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título da Ocorrência *
              </label>
              <input
                type="text"
                value={newTask.title || ''}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm text-sm"
                placeholder="Ex: Limpeza de lixo acumulado"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                value={newTask.description || ''}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
                className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm text-sm resize-none"
                placeholder="Descreva detalhes da ocorrência..."
              />
            </div>

            {/* Linha 1: Tipo e Prioridade */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={newTask.type || 'trash'}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value as Task['type'] })}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm text-sm"
                >
                  <option value="trash">Lixo</option>
                  <option value="lighting">Iluminação</option>
                  <option value="fire">Incêndio</option>
                  <option value="flood">Inundação</option>
                  <option value="crime">Crime</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <select
                  value={newTask.priority || 'Média'}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm text-sm"
                >
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>
            </div>

            {/* Linha 2: Local e Responsável */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local
                </label>
                <input
                  type="text"
                  value={newTask.location || ''}
                  onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                  className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm text-sm"
                  placeholder="Ex: Brasília Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsável
                </label>
                <input
                  type="text"
                  value={newTask.assignee || ''}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm text-sm"
                  placeholder="Ex: Equipe Limpeza A"
                />
              </div>
            </div>

            {/* Linha 3: Data e Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Limite
                </label>
                <input
                  type="date"
                  value={newTask.dueDate || ''}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm text-sm"
                />
              </div>


            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={onSave}
              className="bg-brand-500 hover:bg-brand-600 text-white"
              disabled={!newTask.title || !newTask.description}
            >
              <Save className="h-4 w-4 mr-2" />
              Criar Ocorrência
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal de Detalhes da Tarefa
interface TaskDetailsModalProps {
  task?: Task;
  onClose: () => void;
  getTypeIcon: (type: Task['type']) => React.ComponentType<{ className?: string }>;
  getTypeColor: (type: Task['type']) => string;
  getPriorityColor: (priority: Task['priority']) => string;
}

function TaskDetailsModal({ task, onClose, getTypeIcon, getTypeColor, getPriorityColor }: TaskDetailsModalProps) {
  if (!task) return null;

  const TypeIcon = getTypeIcon(task.type);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                <TypeIcon className={cn('h-5 w-5', getTypeColor(task.type))} />
              </div>
              <span>Detalhes da Ocorrência</span>
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Header com título e prioridade */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium', getPriorityColor(task.priority))}>
                  {task.priority}
                </span>
              </div>
              <p className="text-gray-600">{task.description}</p>
            </div>

            {/* Informações em grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Local
                  </label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{task.location}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Responsável
                  </label>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{task.assignee}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Data Limite
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{task.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Tipo de Ocorrência
                  </label>
                  <div className="flex items-center space-x-2">
                    <TypeIcon className={cn('h-4 w-4', getTypeColor(task.type))} />
                    <span className="text-gray-900 capitalize">{task.type}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Confiança IA
                  </label>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-brand-500" />
                    <span className="text-brand-600 font-medium">{task.aiConfidence}%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Data de Criação
                  </label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{task.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status atual */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Status Atual
              </label>
              <div className="flex items-center space-x-2">
                <div className={cn(
                  'w-3 h-3 rounded-full',
                  task.status === 'todo' ? 'bg-brand-500' :
                  task.status === 'in-progress' ? 'bg-yellow-500' :
                  'bg-green-500'
                )}></div>
                <span className="font-medium text-gray-900">
                  {task.status === 'todo' ? 'A Fazer' :
                   task.status === 'in-progress' ? 'Fazendo' :
                   'Concluído'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 

interface TaskCardProps {
  task: Task;
  onMove: (taskId: string, newStatus: string) => void;
  getTypeIcon: (type: Task['type']) => React.ComponentType<{ className?: string }>;
  getTypeColor: (type: Task['type']) => string;
  getPriorityColor: (priority: Task['priority']) => string;
  onDragStart: (e: DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  onTaskClick: (taskId: string) => void;
}

function TaskCard({ task, onMove, getTypeIcon, getTypeColor, getPriorityColor, onDragStart, onDragEnd, isDragging, onTaskClick }: TaskCardProps) {
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  const TypeIcon = getTypeIcon(task.type);

  const statusOptions = [
    { id: 'todo', label: 'A Fazer' },
    { id: 'in-progress', label: 'Fazendo' },
    { id: 'done', label: 'Concluído' }
  ].filter(option => option.id !== task.status);

  return (
    <div 
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative",
        isDragging && "opacity-50 scale-95"
      )}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      onClick={() => onTaskClick(task.id)}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TypeIcon className={cn('h-3 w-3', getTypeColor(task.type))} />
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getPriorityColor(task.priority))}>
            {task.priority}
          </span>
          {/* Indicador de origem webhook */}
          {task.incident_id && (
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3 text-green-500" />
              {task.photos && task.photos.length > 0 && (
                                  <Image className="h-3 w-3 text-blue-500" />
              )}
              {task.classification && (
                <div className="flex items-center">
                  {task.classification === 'validated' && <CheckCircle className="h-3 w-3 text-green-500" />}
                  {task.classification === 'pending' && <AlertCircle className="h-3 w-3 text-yellow-500" />}
                  {task.classification === 'rejected' && <XCircle className="h-3 w-3 text-red-500" />}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMoveOptions(!showMoveOptions)}
            className="text-gray-400 hover:text-gray-600"
          >
            <MoreHorizontal className="h-3 w-3" />
          </button>
          
          {showMoveOptions && (
            <div className="absolute right-0 top-5 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-28">
              <div className="py-1">
                {statusOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onMove(task.id, option.id);
                      setShowMoveOptions(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    → {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Content */}
      <h3 className="font-medium text-gray-900 mb-1.5 text-sm line-clamp-2">{task.title}</h3>
      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>

      {/* Task Meta */}
      <div className="space-y-1.5">
        <div className="flex items-center text-xs text-gray-500">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="truncate">{task.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>{task.dueDate}</span>
          </div>
          
          <div className="flex items-center text-xs">
            <AlertTriangle className="h-3 w-3 mr-1 text-brand-500" />
            <span className="text-brand-600 font-medium">{task.aiConfidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
} 