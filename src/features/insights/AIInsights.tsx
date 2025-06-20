import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  Target,
  BarChart3,
  Activity,
  Satellite,
  Eye,
  Clock,
  Shield,
  Lightbulb,
  Flame,
  Droplets,
  Trash2
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface InsightCard {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  category: 'security' | 'prediction' | 'correlation' | 'anomaly';
  value: string;
  change: string;
  source: string;
}

interface PredictionModel {
  name: string;
  accuracy: number;
  lastUpdate: string;
  status: 'active' | 'training' | 'error';
  predictions: number;
}

const AIInsights: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30d');

  const insights: InsightCard[] = [
    {
      id: '1',
      title: 'Correlação Crime x Iluminação',
      description: 'Áreas com iluminação precária apresentam 73% mais crimes noturnos',
      impact: 'high',
      trend: 'up',
      confidence: 94,
      category: 'correlation',
      value: '73%',
      change: '+12% vs mês anterior',
      source: 'Sentinel-2 + SSP Crime Data'
    },
    {
      id: '2',
      title: 'Predição de Incêndios',
      description: 'Alto risco de incêndio detectado em 5 regiões para próximos 7 dias',
      impact: 'high',
      trend: 'up',
      confidence: 87,
      category: 'prediction',
      value: '5 áreas',
      change: 'Risco 40% maior',
      source: 'MODIS + Dados Meteorológicos'
    },
    {
      id: '3',
      title: 'Anomalia de Lixo Acumulado',
      description: 'Detecção de acúmulo anômalo de resíduos em Ceilândia Norte',
      impact: 'medium',
      trend: 'up',
      confidence: 91,
      category: 'anomaly',
      value: '3 pontos',
      change: 'Novo desde ontem',
      source: 'Sentinel-2 Multispectral'
    },
    {
      id: '4',
      title: 'Eficiência das Ações',
      description: 'Taxa de resolução de problemas urbanos aumentou 28%',
      impact: 'medium',
      trend: 'up',
      confidence: 89,
      category: 'security',
      value: '28%',
      change: '+5% vs trimestre',
      source: 'Análise Temporal IA'
    },
    {
      id: '5',
      title: 'Risco de Inundação',
      description: 'Modelo prevê alto risco de alagamento em 3 regiões',
      impact: 'high',
      trend: 'stable',
      confidence: 85,
      category: 'prediction',
      value: '3 regiões',
      change: 'Próximas 48h',
      source: 'SRTM + Dados Pluviométricos'
    },
    {
      id: '6',
      title: 'Padrão Temporal de Crimes',
      description: 'Pico de ocorrências identificado entre 18h-22h em áreas mal iluminadas',
      impact: 'high',
      trend: 'stable',
      confidence: 92,
      category: 'correlation',
      value: '18h-22h',
      change: 'Padrão consistente',
      source: 'NASA VIIRS + SSP Data'
    }
  ];

  const models: PredictionModel[] = [
    {
      name: 'Modelo de Predição de Crimes',
      accuracy: 87.3,
      lastUpdate: '2h atrás',
      status: 'active',
      predictions: 1247
    },
    {
      name: 'Modelo de Risco de Incêndio',
      accuracy: 91.8,
      lastUpdate: '4h atrás',
      status: 'active',
      predictions: 892
    },
    {
      name: 'Modelo de Risco de Inundação',
      accuracy: 84.2,
      lastUpdate: '1h atrás',
      status: 'training',
      predictions: 634
    },
    {
      name: 'Detecção de Desordem Urbana',
      accuracy: 93.1,
      lastUpdate: '30min atrás',
      status: 'active',
      predictions: 2156
    }
  ];

  const categories = [
    { id: 'all', label: 'Todos', icon: Brain },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'prediction', label: 'Predições', icon: Target },
    { id: 'correlation', label: 'Correlações', icon: BarChart3 },
    { id: 'anomaly', label: 'Anomalias', icon: AlertCircle }
  ];

  const timeRanges = [
    { id: '7d', label: '7 dias' },
    { id: '30d', label: '30 dias' },
    { id: '90d', label: '90 dias' },
    { id: '1y', label: '1 ano' }
  ];

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-brand-600 bg-brand-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return impact;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'stable': return <Activity className="h-4 w-4 text-brand-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'training': return 'text-brand-600 bg-brand-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'training': return 'Treinando';
      case 'error': return 'Erro';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Insights de IA
              </h1>
              <p className="text-gray-600">
                Análises inteligentes via satélites e sistemas open-source
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                  <Satellite className="h-5 w-5 text-brand-600" />
                </div>
                <span className="text-sm text-gray-600">Dados em tempo real</span>
              </div>
              
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm min-w-32"
              >
                {timeRanges.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-brand-600 text-white'
                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center",
                    selectedCategory === category.id
                      ? "bg-white/20"
                      : "bg-white"
                  )}>
                    <Icon className={cn(
                      "h-4 w-4",
                      selectedCategory === category.id
                        ? "text-white"
                        : "text-gray-600"
                    )} />
                  </div>
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Models Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status dos Modelos de IA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {models.map(model => (
              <div key={model.name} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">{model.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                    {getStatusLabel(model.status)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Precisão</span>
                    <span className="text-sm font-medium text-gray-900">{model.accuracy}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Predições</span>
                    <span className="text-sm font-medium text-gray-900">{model.predictions.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Atualizado {model.lastUpdate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInsights.map(insight => (
            <div key={insight.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                    {getTrendIcon(insight.trend)}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                  {getImpactLabel(insight.impact)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-brand-600">{insight.value}</div>
                  <div className="text-xs text-gray-500">{insight.change}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Confiança</div>
                  <div className="flex items-center justify-end space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-brand-600 h-2 rounded-full" 
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{insight.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>Fonte: {insight.source}</span>
                </div>
                
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Analytics */}
        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Análise em Tempo Real</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Trash2 className="h-8 w-8 text-brand-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">127</div>
              <div className="text-sm text-gray-500">Pontos de lixo detectados</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="h-8 w-8 text-brand-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">89</div>
              <div className="text-sm text-gray-500">Áreas mal iluminadas</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Flame className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-500">Alertas de incêndio</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Droplets className="h-8 w-8 text-brand-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-500">Riscos de inundação</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights; 