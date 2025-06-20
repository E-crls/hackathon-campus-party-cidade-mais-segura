import { useEffect, useState } from 'react';
import { 
  Eye, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Shield,
  Flame,
  Trash2,
  Lightbulb,
  Calendar,
  BarChart3,
  MapPin
} from 'lucide-react';
import LeafletMapComponent from '../../components/feature/LeafletMap';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useLoading } from '../../hooks/useLoading';
import { orbisAPI } from '../../services/api';
import { formatNumber, formatPercentage } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { KPIData } from '../../schemas';

export function Dashboard() {
  const { isLoading, withLoading } = useLoading();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Todos');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await withLoading(
        () => orbisAPI.getKPIs(),
        'Carregando dados do dashboard...'
      );
      setKpiData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  if (isLoading || !kpiData) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Carregando dados do dashboard..." />
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">
              <span className="font-semibold">Olá, Gestor MSP</span>
            </h1>
            <p className="text-gray-600">
              Monitore desordens urbanas via satélites e dados open-source
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>20 de dezembro de 2024</span>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Resolvidas"
            value={kpiData.resolved.value}
            trend={kpiData.resolved.trend}
            icon={CheckCircle}
            color="green"
            subtitle="+8 tarefas"
          />
          <MetricCard
            title="Monitoradas"
            value={kpiData.monitoring.value}
            trend={kpiData.monitoring.trend}
            icon={Eye}
            color="brand"
            subtitle="-6 horas"
          />
          <MetricCard
            title="Eficiência"
            value={93}
            trend={12}
            icon={BarChart3}
            color="green"
            subtitle="+12%"
            isPercentage
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Mapa de Ocorrências */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border border-gray-200 h-full min-h-[500px] flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-gray-900 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-brand-500" />
                    </div>
                    <span className="whitespace-nowrap">Desordens Urbanas</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <FilterButton 
                      active={activeFilter === 'Todos'} 
                      label="Todos" 
                      onClick={() => setActiveFilter('Todos')}
                    />
                    <FilterButton 
                      active={activeFilter === 'Lixo'} 
                      label="Lixo" 
                      onClick={() => setActiveFilter('Lixo')}
                    />
                    <FilterButton 
                      active={activeFilter === 'Iluminação'} 
                      label="Iluminação" 
                      onClick={() => setActiveFilter('Iluminação')}
                    />
                    <FilterButton 
                      active={activeFilter === 'Incêndios'} 
                      label="Incêndios" 
                      onClick={() => setActiveFilter('Incêndios')}
                    />
                    <FilterButton 
                      active={activeFilter === 'Crimes'} 
                      label="Crimes" 
                      onClick={() => setActiveFilter('Crimes')}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 flex-1 min-h-0">
                <LeafletMapComponent activeFilter={activeFilter} />
              </CardContent>
            </Card>
          </div>

          {/* Análises e Correlações */}
          <div>
            <Card className="bg-white shadow-sm border border-gray-200 h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-brand-500" />
                  </div>
                  <span>Análises IA</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3 flex-1">
                <AnalysisItem
                  title="Crime x Luz"
                  value="73%"
                  description="Correlação NASA VIIRS + dados SSP: 73% mais crimes em áreas escuras"
                  trend="negative"
                  color="red"
                />
                
                <AnalysisItem
                  title="Regiões de Alto Risco por Horário"
                  value="18h-22h"
                  description="Análise temporal VIIRS: pico de risco entre 18h-22h (transição luz/escuro)"
                  trend="negative"
                  color="red"
                />
                
                <AnalysisItem
                  title="Precariedade (Luz x Lixo)"
                  value="85%"
                  description="Correlação satelital: VIIRS (luz) + Sentinel-2 (resíduos) = 85% sobreposição"
                  trend="negative"
                  color="red"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Current Tasks - Melhorado */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg text-gray-900 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-brand-500" />
                  </div>
                  <span>Tarefas Prioritárias</span>
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Gerenciamento de tarefas por status</p>
              </div>
              <div className="flex items-center space-x-2">
                <select className="text-sm border border-gray-200 rounded-lg pl-4 pr-10 py-2 bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm">
                  <option>Esta Semana</option>
                  <option>Este Mês</option>
                  <option>Trimestre</option>
                </select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <TaskItem
                title="Limpeza Urgente - Setor Comercial Sul"
                status="Em andamento"
                statusColor="orange"
                time="4h"
                priority="Alta"
                icon={Trash2}
              />
              
              <TaskItem
                title="Reparo Iluminação - Asa Norte QD 15"
                status="Pausado"
                statusColor="brand"
                time="8h"
                priority="Média"
                icon={Lightbulb}
              />
              
              <TaskItem
                title="Prevenção Incêndio - Parque Nacional"
                status="Concluído"
                statusColor="green"
                time="32h"
                priority="Alta"
                icon={Flame}
              />

              <TaskItem
                title="Monitoramento Área de Risco - Sobradinho"
                status="Pendente"
                statusColor="gray"
                time="0h"
                priority="Baixa"
                icon={Shield}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  trend: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'green' | 'brand' | 'orange';
  subtitle: string;
  isPercentage?: boolean;
}

function MetricCard({ title, value, trend, icon: Icon, color, subtitle, isPercentage = false }: MetricCardProps) {
  const colorStyles = {
    green: 'text-green-600',
    brand: 'text-brand-600',
    orange: 'text-brand-600',
  };

  const trendColor = trend > 0 ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
            <Icon className={cn('h-5 w-5', colorStyles[color])} />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">
            {formatNumber(value)}{isPercentage ? '%' : ''}
          </div>
          <div className="flex items-center space-x-2">
            <span className={cn('text-sm font-medium', trendColor)}>
              {trend > 0 ? '+' : ''}{isPercentage ? trend : formatPercentage(trend)}
            </span>
            <span className="text-sm text-gray-500">{subtitle}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FilterButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function FilterButton({ label, active = false, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 text-xs font-medium rounded-full border transition-colors',
        active
          ? 'bg-brand-500 text-white border-brand-500'
          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
      )}
    >
      {label}
    </button>
  );
}



interface AnalysisItemProps {
  title: string;
  value: string;
  description: string;
  trend: 'positive' | 'negative';
  color: 'red' | 'green' | 'brand';
}

function AnalysisItem({ title, value, description, trend, color }: AnalysisItemProps) {
  const colorStyles = {
    red: 'text-red-600',
    green: 'text-green-600',
    brand: 'text-brand-600',
  };

  const trendIcon = trend === 'positive' ? TrendingUp : TrendingDown;
  const TrendIcon = trendIcon;

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-900 flex-1 min-w-0 pr-2">{title}</h4>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <span className={cn('text-base font-bold whitespace-nowrap', colorStyles[color])}>{value}</span>
          <TrendIcon className={cn('h-4 w-4 flex-shrink-0', trend === 'positive' ? 'text-green-500' : 'text-red-500')} />
        </div>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{description}</p>
    </div>
  );
}

interface TaskItemProps {
  title: string;
  status: string;
  statusColor: 'green' | 'orange' | 'brand' | 'gray';
  time: string;
  priority: string;
  icon: React.ComponentType<{ className?: string }>;
}

function TaskItem({ title, status, statusColor, time, priority, icon: Icon }: TaskItemProps) {
  const statusStyles = {
    green: 'bg-green-100 text-green-700',
    orange: 'bg-brand-100 text-brand-700',
    brand: 'bg-gray-100 text-gray-700',
    gray: 'bg-gray-100 text-gray-600',
  };

  const priorityStyles = {
    'Alta': 'bg-red-100 text-red-700',
    'Média': 'bg-orange-100 text-orange-700',
    'Baixa': 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1">{title}</h4>
          <div className="flex items-center space-x-2">
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusStyles[statusColor])}>
              {status}
            </span>
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', priorityStyles[priority as keyof typeof priorityStyles])}>
              {priority}
            </span>
            <span className="text-xs text-gray-500">{time}</span>
          </div>
        </div>
      </div>
      
      <button className="text-gray-400 hover:text-gray-600 ml-4">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
    </div>
  );
} 