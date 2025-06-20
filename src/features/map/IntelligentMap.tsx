import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import { 
  Map, 
  Satellite, 
  Layers, 
  Calendar, 
  BarChart3, 
  Zap, 
  Eye, 
  Download,
  Share2,
  Maximize2,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Clock,
  MapPin,
  Activity,
  Globe,
  Mountain,
  Moon,
  Trash2,
  Lightbulb,
  Flame,
  Droplets,
  Shield
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import 'leaflet/dist/leaflet.css';

// Fix para os ícones padrão do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapIncident {
  id: string;
  type: 'trash' | 'lighting' | 'fire' | 'flood' | 'crime';
  position: { lat: number; lng: number };
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  region: string;
}

// Dados reais de desordens urbanas em Brasília
const brasiliaIncidents: MapIncident[] = [
  {
    id: '1',
    type: 'lighting',
    position: { lat: -15.7801, lng: -47.9292 },
    title: 'Iluminação - W3 Norte',
    description: 'NASA VIIRS: 12 pontos com iluminação deficiente na W3 Norte',
    severity: 'medium',
    region: 'Plano Piloto'
  },
  {
    id: '2',
    type: 'trash',
    position: { lat: -15.7942, lng: -47.8822 },
    title: 'Lixo - Setor Comercial Sul',
    description: 'Sentinel-2: Acúmulo anômalo de resíduos detectado',
    severity: 'medium',
    region: 'Plano Piloto'
  },
  {
    id: '3',
    type: 'crime',
    position: { lat: -15.8386, lng: -48.0494 },
    title: 'Área de Risco - Taguatinga Centro',
    description: 'Correlação IA: Crime + Baixa iluminação (Confiança: 87%)',
    severity: 'medium',
    region: 'Taguatinga'
  },
  {
    id: '4',
    type: 'fire',
    position: { lat: -15.8500, lng: -48.0600 },
    title: 'Risco Incêndio - Parque Taguatinga',
    description: 'MODIS: Vegetação seca + Temperatura elevada (35°C)',
    severity: 'medium',
    region: 'Taguatinga'
  },
  {
    id: '5',
    type: 'fire',
    position: { lat: -15.7500, lng: -47.8500 },
    title: '🚨 NOVO - Incêndio Ativo',
    description: 'MODIS: Foco de calor detectado há 30min - Emergência!',
    severity: 'high',
    region: 'Brasília'
  },
];

const createCustomIcon = (type: string, severity: string, title: string = '') => {
  const getEmoji = (type: string) => {
    switch (type) {
      case 'trash': return '🗑️';
      case 'lighting': return '💡';
      case 'fire': return '🔥';
      case 'flood': return '💧';
      case 'crime': return '🛡️';
      default: return '📍';
    }
  };

  const emoji = getEmoji(type);
  const isNew = title.includes('🚨 NOVO');
  
  return L.divIcon({
    html: `
      <style>
        .marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-main {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          position: relative;
          z-index: 2;
          background: white;
          border: 3px solid ${severity === 'high' ? '#dc2626' : severity === 'medium' ? '#4220F3' : '#059669'};
          box-shadow: 0 3px 12px rgba(0,0,0,0.4);
          ${severity === 'high' ? 'animation: bounce-high 2s infinite;' : 
            severity === 'medium' ? 'animation: mediumPulse-medium 3s infinite;' : 
            'animation: lowGlow-low 4s infinite;'}
        }
        @keyframes bounce-high {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-8px) scale(1.1); }
          60% { transform: translateY(-3px) scale(1.02); }
        }
        @keyframes mediumPulse-medium {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 0 0 rgba(66, 32, 243, 0.7); 
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 4px 16px rgba(0,0,0,0.45), 0 0 0 10px rgba(66, 32, 243, 0); 
          }
        }
        @keyframes lowGlow-low {
          0%, 100% { 
            box-shadow: 0 3px 12px rgba(0,0,0,0.4); 
          }
          50% { 
            box-shadow: 0 0 20px rgba(5, 150, 105, 0.7), 0 3px 12px rgba(0,0,0,0.4); 
          }
        }
      </style>
      <div class="marker-container">
        <div class="marker-main">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-brand-600 bg-brand-50 border-brand-200';
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getSeverityLabel = (severity: string) => {
  switch (severity) {
    case 'high': return 'CRÍTICO';
    case 'medium': return 'MÉDIO';
    case 'low': return 'BAIXO';
    default: return 'DESCONHECIDO';
  }
};

const getTypeIcon = (type: string) => {
  const icons = {
    trash: Trash2,
    lighting: Lightbulb,
    fire: Flame,
    flood: Droplets,
    crime: Shield
  };
  return icons[type as keyof typeof icons] || Trash2;
};

const IntelligentMap: React.FC = () => {
  const [activeView, setActiveView] = useState<'standard' | 'satellite' | 'terrain' | 'hybrid' | 'topo' | 'dark' | 'heat' | 'analysis'>('standard');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const [showAnalysisZones, setShowAnalysisZones] = useState(true);
  const [showPredictions, setShowPredictions] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const mapUrls = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    hybrid: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    topo: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    heat: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    analysis: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
  };

  // URLs específicas para overlays
  const overlayUrls = {
    hybrid: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  // Dados mockados baseados no tipo de visualização
  const getViewSpecificData = (viewType: string) => {
    const baseZones = [
      {
        id: 'zone1',
        name: 'Ceilândia Norte',
        coordinates: [
          [-15.8050, -48.1200],
          [-15.8150, -48.1100],
          [-15.8200, -48.1150],
          [-15.8100, -48.1250]
        ] as [number, number][],
        type: 'high_risk' as const,
        incidents: 12,
        prediction: 85
      },
      {
        id: 'zone2',
        name: 'Taguatinga Centro',
        coordinates: [
          [-15.8300, -48.0400],
          [-15.8400, -48.0300],
          [-15.8450, -48.0450],
          [-15.8350, -48.0500]
        ] as [number, number][],
        type: 'monitoring' as const,
        incidents: 6,
        prediction: 45
      },
      {
        id: 'zone3',
        name: 'Asa Norte',
        coordinates: [
          [-15.7500, -47.8800],
          [-15.7600, -47.8700],
          [-15.7650, -47.8750],
          [-15.7550, -47.8850]
        ] as [number, number][],
        type: 'safe' as const,
        incidents: 1,
        prediction: 15
      }
    ];

    switch (viewType) {
      case 'satellite':
        return baseZones.map(zone => ({
          ...zone,
          name: `${zone.name} - Análise Satelital`,
          incidents: zone.incidents + Math.floor(Math.random() * 3),
          prediction: Math.min(zone.prediction + 10, 95),
          satelliteData: {
            cloudCover: Math.floor(Math.random() * 20),
            resolution: '0.5m',
            captureDate: '2024-06-20'
          }
        }));
      
      case 'terrain':
        return baseZones.map(zone => ({
          ...zone,
          name: `${zone.name} - Análise Topográfica`,
          terrainData: {
            elevation: Math.floor(Math.random() * 200) + 1000,
            slope: Math.floor(Math.random() * 15) + 2,
            aspect: ['Norte', 'Sul', 'Leste', 'Oeste'][Math.floor(Math.random() * 4)]
          }
        }));
      
      case 'hybrid':
        return baseZones.map(zone => ({
          ...zone,
          name: `${zone.name} - Visão Híbrida`,
          hybridData: {
            streetDensity: Math.floor(Math.random() * 100),
            buildingCount: Math.floor(Math.random() * 500) + 100,
            roadLength: Math.floor(Math.random() * 50) + 10
          }
        }));
      
      case 'heat':
        return baseZones.map(zone => ({
          ...zone,
          name: `${zone.name} - Densidade`,
          type: zone.incidents > 8 ? 'high_risk' as const : 
                zone.incidents > 4 ? 'monitoring' as const : 'safe' as const,
          heatData: {
            intensity: zone.incidents * 8.5,
            radius: Math.floor(Math.random() * 500) + 200,
            gradient: ['#0000ff', '#00ff00', '#ffff00', '#ff0000']
          }
        }));
      
      case 'analysis':
        return baseZones.map(zone => ({
          ...zone,
          name: `${zone.name} - Predição IA`,
          prediction: Math.min(zone.prediction + Math.floor(Math.random() * 15), 98),
          aiData: {
            confidence: Math.floor(Math.random() * 20) + 80,
            algorithm: 'Random Forest + Neural Network',
            factors: ['Densidade populacional', 'Iluminação', 'Histórico criminal']
          }
        }));
      
      case 'topo':
        return baseZones.map(zone => ({
          ...zone,
          name: `${zone.name} - Topográfico`,
          topoData: {
            contourLines: Math.floor(Math.random() * 20) + 10,
            waterBodies: Math.floor(Math.random() * 3),
            vegetation: Math.floor(Math.random() * 60) + 20
          }
        }));
      
      case 'dark':
        return baseZones.map(zone => ({
          ...zone,
          name: `${zone.name} - Modo Noturno`,
          nightData: {
            lightPollution: Math.floor(Math.random() * 100),
            visibility: Math.floor(Math.random() * 80) + 20,
            crimeProbability: zone.prediction * 1.2
          }
        }));
      
      default:
        return baseZones.map(zone => ({
          ...zone,
          name: `${zone.name} - Padrão`
        }));
    }
  };

  const [analysisZones, setAnalysisZones] = useState<any[]>(getViewSpecificData('standard'));

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'high_risk': return '#dc2626';
      case 'monitoring': return '#4220F3';
      case 'safe': return '#059669';
      default: return '#6b7280';
    }
  };

  const getZoneOpacity = (type: string) => {
    switch (type) {
      case 'high_risk': return 0.3;
      case 'monitoring': return 0.2;
      case 'safe': return 0.1;
      default: return 0.1;
    }
  };

  const timeRangeStats = {
    '24h': { incidents: 12, predictions: 8, coverage: '95%' },
    '7d': { incidents: 67, predictions: 34, coverage: '98%' },
    '30d': { incidents: 284, predictions: 156, coverage: '99%' },
    '90d': { incidents: 892, predictions: 467, coverage: '99.5%' }
  };

  const refreshData = () => {
    setLastUpdate(new Date());
  };

  // Função para simular carregamento de dados específicos da visualização
  const loadViewData = async (viewType: string) => {
    setIsLoading(true);
    setLoadingProgress(0);

    // Simular carregamento progressivo
    const loadingSteps = [
      { progress: 20, message: 'Conectando com servidores...' },
      { progress: 40, message: 'Carregando dados geográficos...' },
      { progress: 60, message: 'Processando camadas...' },
      { progress: 80, message: 'Aplicando filtros...' },
      { progress: 100, message: 'Finalizando...' }
    ];

    for (const step of loadingSteps) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setLoadingProgress(step.progress);
    }

    // Atualizar dados específicos da visualização
    const newData = getViewSpecificData(viewType);
    setAnalysisZones(newData);
    setLastUpdate(new Date());
    
    await new Promise(resolve => setTimeout(resolve, 200));
    setIsLoading(false);
    setLoadingProgress(0);
  };

  const handleViewChange = (newView: string) => {
    if (newView !== activeView) {
      // Primeiro atualiza a view, depois carrega os dados
      setActiveView(newView as any);
      // Pequeno delay para garantir que o mapa seja re-renderizado
      setTimeout(() => {
        loadViewData(newView);
      }, 100);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const exportData = () => {
    console.log('Exportando dados do mapa...');
  };

  const shareMap = () => {
    console.log('Compartilhando mapa...');
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : 'p-6 h-screen'}`}>
      <div className="flex flex-col h-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mapa Inteligente</h1>
            <p className="text-gray-600">Análise avançada via satélites e IA preditiva</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={refreshData}
              className="flex items-center space-x-2 text-white bg-brand-600 hover:bg-brand-700"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Atualizar</span>
            </Button>
            
            <Button
              onClick={exportData}
              variant="ghost"
              className="flex items-center space-x-2 text-brand-700 hover:bg-brand-700 hover:text-white"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </Button>
            
            <Button
              onClick={shareMap}
              variant="ghost"
              className="flex items-center space-x-2 text-brand-700 hover:bg-brand-700 hover:text-white"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </Button>
            
            <Button
              onClick={toggleFullscreen}
              variant="ghost" 
              className="flex items-center space-x-2 text-brand-700 hover:bg-brand-700 hover:text-white"
            >
              <Maximize2 className="w-4 h-4" />
              <span>{isFullscreen ? 'Sair' : 'Tela Cheia'}</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 flex space-x-6 min-h-0">
          {/* Painel de Controles */}
          <div className="w-80 space-y-4">
            {/* Visões do Mapa */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-brand-600" />
                  Visões do Mapa
                </div>
                {isLoading && (
                  <div className="flex items-center space-x-2 text-xs text-brand-600">
                    <div className="w-3 h-3 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
                    <span>Carregando...</span>
                  </div>
                )}
              </h3>
              <div className="space-y-1">
                {[
                  { id: 'standard', name: 'Padrão', icon: Map, desc: 'Mapa de ruas padrão' },
                  { id: 'satellite', name: 'Satélite', icon: Satellite, desc: 'Imagens de satélite' },
                  { id: 'terrain', name: 'Relevo', icon: Mountain, desc: 'Elevação e topografia' },
                  { id: 'hybrid', name: 'Híbrido', icon: Globe, desc: 'Satélite + ruas' },
                  { id: 'topo', name: 'Topográfico', icon: BarChart3, desc: 'Curvas de nível' },
                  { id: 'dark', name: 'Noturno', icon: Moon, desc: 'Tema escuro' },
                  { id: 'heat', name: 'Calor', icon: Activity, desc: 'Densidade de dados' },
                  { id: 'analysis', name: 'Análise IA', icon: Zap, desc: 'Predições avançadas' }
                ].map((view) => {
                  const IconComponent = view.icon;
                  return (
                    <button
                      key={view.id}
                      onClick={() => handleViewChange(view.id)}
                      disabled={isLoading}
                      className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition-all text-left ${
                        activeView === view.id
                          ? 'bg-brand-50 border-2 border-brand-200 text-brand-700'
                          : 'border-2 border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activeView === view.id ? 'bg-brand-100' : 'bg-gray-100'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{view.name}</div>
                        <div className="text-xs text-gray-500 truncate">{view.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Período Temporal */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-brand-600" />
                Análise Temporal
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(['24h', '7d', '30d', '90d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTimeRange === range
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Incidentes:</span>
                  <span className="font-semibold">{timeRangeStats[selectedTimeRange].incidents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Predições:</span>
                  <span className="font-semibold">{timeRangeStats[selectedTimeRange].predictions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cobertura:</span>
                  <span className="font-semibold text-green-600">{timeRangeStats[selectedTimeRange].coverage}</span>
                </div>
              </div>
            </Card>

            {/* Camadas Avançadas */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-brand-600" />
                Camadas Inteligentes
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={showAnalysisZones}
                    onChange={(e) => setShowAnalysisZones(e.target.checked)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 accent-brand-600"
                    style={{ accentColor: '#4220F3' }}
                  />
                  <span className="text-sm font-medium">Zonas de Análise</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={showPredictions}
                    onChange={(e) => setShowPredictions(e.target.checked)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 accent-brand-600"
                    style={{ accentColor: '#4220F3' }}
                  />
                  <span className="text-sm font-medium">Predições IA</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={(e) => setShowHeatmap(e.target.checked)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 accent-brand-600"
                    style={{ accentColor: '#4220F3' }}
                  />
                  <span className="text-sm font-medium">Mapa de Calor</span>
                </label>
              </div>
            </Card>

            {/* Estatísticas em Tempo Real */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-brand-600" />
                Estatísticas Avançadas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium">Alto Risco</span>
                  </div>
                  <span className="text-sm font-bold text-red-600">4 zonas</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-brand-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-brand-600" />
                    <span className="text-sm font-medium">Monitoramento</span>
                  </div>
                  <span className="text-sm font-bold text-brand-600">6 zonas</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Seguras</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">2 zonas</span>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Última atualização</span>
                  </div>
                  <span>{lastUpdate.toLocaleTimeString()}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Mapa Principal */}
          <div className="flex-1 min-h-0">
            <Card className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  {activeView === 'standard' && 'Mapa Padrão - OpenStreetMap'}
                  {activeView === 'satellite' && 'Visão de Satélite - World Imagery'}
                  {activeView === 'terrain' && 'Análise de Relevo - OpenTopoMap'}
                  {activeView === 'hybrid' && 'Mapa Híbrido - Satélite + Ruas'}
                  {activeView === 'topo' && 'Mapa Topográfico - World Topo'}
                  {activeView === 'dark' && 'Modo Noturno - CartoDB Dark'}
                  {activeView === 'heat' && 'Mapa de Calor - Densidade de Incidentes'}
                  {activeView === 'analysis' && 'Análise Preditiva - IA Avançada'}
                </h3>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Dados em tempo real</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-h-[500px] rounded-lg overflow-hidden relative">
                {/* Indicador de carregamento */}
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[2000] flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 text-center">
                      <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        Carregando {activeView === 'satellite' ? 'Imagens de Satélite' :
                                   activeView === 'terrain' ? 'Dados de Relevo' :
                                   activeView === 'hybrid' ? 'Visão Híbrida' :
                                   activeView === 'topo' ? 'Dados Topográficos' :
                                   activeView === 'dark' ? 'Modo Noturno' :
                                   activeView === 'heat' ? 'Mapa de Calor' :
                                   activeView === 'analysis' ? 'Análise IA' :
                                   'Dados do Mapa'}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${loadingProgress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">{loadingProgress}% concluído</div>
                    </div>
                  </div>
                )}

                <MapContainer
                  center={[-15.7801, -47.9292]}
                  zoom={11}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-lg"
                  key={`map-container-${activeView}`}
                >
                  {/* Camada base principal */}
                  <TileLayer
                    attribution={
                      activeView === 'satellite' ? '&copy; ESRI' :
                      activeView === 'terrain' ? '&copy; OpenTopoMap' :
                      activeView === 'hybrid' ? '&copy; ESRI & OpenStreetMap' :
                      activeView === 'topo' ? '&copy; ESRI' :
                      activeView === 'dark' ? '&copy; CartoDB' :
                      activeView === 'heat' ? '&copy; CartoDB' :
                      activeView === 'analysis' ? '&copy; OpenStreetMap HOT' :
                      '&copy; OpenStreetMap contributors'
                    }
                    url={mapUrls[activeView]}
                    key={`base-tiles-${activeView}`}
                  />
                  
                                     {/* Overlay específico para mapa híbrido */}
                   {activeView === 'hybrid' && (
                     <TileLayer
                       url={overlayUrls.hybrid}
                       opacity={0.3}
                       key="hybrid-overlay"
                     />
                   )}
                  
                  
                  
                  {/* Zonas de Análise */}
                  {showAnalysisZones && analysisZones.map((zone) => (
                    <Polygon
                      key={`zone-${zone.id}-${activeView}`}
                      positions={zone.coordinates}
                      pathOptions={{
                        color: getZoneColor(zone.type),
                        fillColor: getZoneColor(zone.type),
                        fillOpacity: getZoneOpacity(zone.type),
                        weight: 2,
                        interactive: true
                      }}
                    >
                      <Popup>
                        <div className="p-3 min-w-[250px]">
                          <h4 className="font-semibold text-gray-900 mb-2">{zone.name}</h4>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Incidentes:</span>
                              <span className="font-medium">{zone.incidents}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Predição:</span>
                              <span className="font-medium">{zone.prediction}%</span>
                            </div>
                            
                            {/* Dados específicos por visualização */}
                            {zone.satelliteData && (
                              <div className="mt-3 pt-2 border-t border-gray-200">
                                <div className="font-medium text-gray-700 mb-1">Dados Satelitais:</div>
                                <div className="flex justify-between">
                                  <span>Cobertura de nuvens:</span>
                                  <span>{zone.satelliteData.cloudCover}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Resolução:</span>
                                  <span>{zone.satelliteData.resolution}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Data da captura:</span>
                                  <span>{zone.satelliteData.captureDate}</span>
                                </div>
                              </div>
                            )}
                            
                            {zone.terrainData && (
                              <div className="mt-3 pt-2 border-t border-gray-200">
                                <div className="font-medium text-gray-700 mb-1">Dados Topográficos:</div>
                                <div className="flex justify-between">
                                  <span>Elevação:</span>
                                  <span>{zone.terrainData.elevation}m</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Inclinação:</span>
                                  <span>{zone.terrainData.slope}°</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Orientação:</span>
                                  <span>{zone.terrainData.aspect}</span>
                                </div>
                              </div>
                            )}
                            
                            {zone.hybridData && (
                              <div className="mt-3 pt-2 border-t border-gray-200">
                                <div className="font-medium text-gray-700 mb-1">Dados Híbridos:</div>
                                <div className="flex justify-between">
                                  <span>Densidade de ruas:</span>
                                  <span>{zone.hybridData.streetDensity}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Edifícios:</span>
                                  <span>{zone.hybridData.buildingCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Extensão de vias:</span>
                                  <span>{zone.hybridData.roadLength}km</span>
                                </div>
                              </div>
                            )}
                            
                            {zone.heatData && (
                              <div className="mt-3 pt-2 border-t border-gray-200">
                                <div className="font-medium text-gray-700 mb-1">Mapa de Calor:</div>
                                <div className="flex justify-between">
                                  <span>Intensidade:</span>
                                  <span>{zone.heatData.intensity.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Raio de influência:</span>
                                  <span>{zone.heatData.radius}m</span>
                                </div>
                              </div>
                            )}
                            
                            {zone.aiData && (
                              <div className="mt-3 pt-2 border-t border-gray-200">
                                <div className="font-medium text-gray-700 mb-1">Análise IA:</div>
                                <div className="flex justify-between">
                                  <span>Confiança:</span>
                                  <span>{zone.aiData.confidence}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Algoritmo:</span>
                                  <span className="text-xs">{zone.aiData.algorithm}</span>
                                </div>
                                <div className="mt-1">
                                  <span className="text-xs text-gray-600">
                                    Fatores: {zone.aiData.factors.join(', ')}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {zone.topoData && (
                              <div className="mt-3 pt-2 border-t border-gray-200">
                                <div className="font-medium text-gray-700 mb-1">Dados Topográficos:</div>
                                <div className="flex justify-between">
                                  <span>Curvas de nível:</span>
                                  <span>{zone.topoData.contourLines}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Corpos d'água:</span>
                                  <span>{zone.topoData.waterBodies}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Vegetação:</span>
                                  <span>{zone.topoData.vegetation}%</span>
                                </div>
                              </div>
                            )}
                            
                            {zone.nightData && (
                              <div className="mt-3 pt-2 border-t border-gray-200">
                                <div className="font-medium text-gray-700 mb-1">Dados Noturnos:</div>
                                <div className="flex justify-between">
                                  <span>Poluição luminosa:</span>
                                  <span>{zone.nightData.lightPollution}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Visibilidade:</span>
                                  <span>{zone.nightData.visibility}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Prob. crime noturno:</span>
                                  <span>{zone.nightData.crimeProbability.toFixed(1)}%</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Polygon>
                  ))}
                  
                  {/* Marcadores de Incidentes */}
                  {brasiliaIncidents.map((incident) => (
                    <Marker
                      key={incident.id}
                      position={[incident.position.lat, incident.position.lng]}
                      icon={createCustomIcon(incident.type, incident.severity, incident.title)}
                    >
                      <Popup maxWidth={300} className="custom-popup">
                        <div className="p-2 max-w-sm">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {React.createElement(getTypeIcon(incident.type), {
                                className: "h-5 w-5 text-brand-600"
                              })}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                {incident.title}
                              </h3>
                              <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                                {incident.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  📍 {incident.region}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                                  {getSeverityLabel(incident.severity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
                
                {/* Overlay de Informações */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-gray-800">Fonte dos Dados:</div>
                    {activeView === 'standard' && (
                      <div className="text-gray-600">
                        • OpenStreetMap<br/>
                        • Dados Colaborativos<br/>
                        • Atualização: Contínua
                      </div>
                    )}
                    {activeView === 'satellite' && (
                      <div className="text-gray-600">
                        • World Imagery (ESRI)<br/>
                        • Resolução: 0.5-1m<br/>
                        • Imagens de Satélite
                      </div>
                    )}
                    {activeView === 'terrain' && (
                      <div className="text-gray-600">
                        • OpenTopoMap<br/>
                        • Dados SRTM + OSM<br/>
                        • Modelo de Elevação
                      </div>
                    )}
                    {activeView === 'hybrid' && (
                      <div className="text-gray-600">
                        • Satélite + Ruas<br/>
                        • World Imagery + OSM<br/>
                        • Visão Combinada
                      </div>
                    )}
                    {activeView === 'topo' && (
                      <div className="text-gray-600">
                        • World Topo (ESRI)<br/>
                        • Mapa Topográfico<br/>
                        • Curvas de Nível
                      </div>
                    )}
                    {activeView === 'dark' && (
                      <div className="text-gray-600">
                        • CartoDB Dark<br/>
                        • Modo Noturno<br/>
                        • Reduz Fadiga Visual
                      </div>
                    )}
                    {activeView === 'heat' && (
                      <div className="text-gray-600">
                        • Análise de Densidade<br/>
                        • Algoritmos de IA<br/>
                        • Tempo Real
                      </div>
                    )}
                    {activeView === 'analysis' && (
                      <div className="text-gray-600">
                        • Machine Learning<br/>
                        • Predições Avançadas<br/>
                        • Confiança: 94%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentMap; 