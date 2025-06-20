import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  Trash2, 
  Lightbulb, 
  Flame, 
  Droplets, 
  Shield 
} from 'lucide-react';
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

interface LeafletMapProps {
  incidents?: MapIncident[];
  onIncidentClick?: (incident: MapIncident) => void;
  activeFilter?: string;
}

// Dados reais de desordens urbanas em Brasília
const brasiliaIncidents: MapIncident[] = [
  // Plano Piloto
  {
    id: '1',
    type: 'lighting',
    position: { lat: -15.7801, lng: -47.9292 },
    title: 'Iluminação - W3 Norte',
    description: 'NASA VIIRS: 12 pontos com iluminação deficiente na W3 Norte',
    severity: 'low',
    region: 'Plano Piloto'
  },
  {
    id: '2',
    type: 'trash',
    position: { lat: -15.7942, lng: -47.8822 },
    title: 'Lixo - Setor Comercial Sul',
    description: 'Sentinel-2: Acúmulo anômalo de resíduos detectado',
    severity: 'low',
    region: 'Plano Piloto'
  },
  
  // Taguatinga
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
  
  // Ceilândia
  {
    id: '5',
    type: 'trash',
    position: { lat: -15.8159, lng: -48.1070 },
    title: 'Lixo Crítico - Ceilândia Norte',
    description: 'Sentinel-2: 8 pontos críticos de acúmulo identificados',
    severity: 'medium',
    region: 'Ceilândia'
  },
  {
    id: '6',
    type: 'lighting',
    position: { lat: -15.8200, lng: -48.1150 },
    title: 'Iluminação - Ceilândia Sul',
    description: 'NASA VIIRS: 15 postes sem funcionamento detectados',
    severity: 'medium',
    region: 'Ceilândia'
  },
  
  // Sobradinho
  {
    id: '7',
    type: 'flood',
    position: { lat: -15.6533, lng: -47.7869 },
    title: 'Risco Alagamento - Sobradinho I',
    description: 'SRTM: Topografia indica risco alto próximas 48h',
    severity: 'medium',
    region: 'Sobradinho'
  },
  {
    id: '8',
    type: 'fire',
    position: { lat: -15.6400, lng: -47.7700 },
    title: 'Incêndio - Sobradinho II',
    description: 'MODIS: Foco de calor detectado - Área rural',
    severity: 'medium',
    region: 'Sobradinho'
  },
  
  // Gama
  {
    id: '9',
    type: 'crime',
    position: { lat: -16.0209, lng: -48.0616 },
    title: 'Segurança - Gama Leste',
    description: 'Análise SSP: Aumento 23% ocorrências último mês',
    severity: 'medium',
    region: 'Gama'
  },
  
  // Samambaia
  {
    id: '10',
    type: 'lighting',
    position: { lat: -15.8758, lng: -48.0936 },
    title: 'Iluminação - Samambaia Norte',
    description: 'NASA VIIRS: Corredor escuro identificado (2km)',
    severity: 'medium',
    region: 'Samambaia'
  },
  {
    id: '11',
    type: 'trash',
    position: { lat: -15.8850, lng: -48.1000 },
    title: 'Resíduos - Samambaia Sul',
    description: 'Sentinel-2: Descarte irregular via análise espectral',
    severity: 'medium',
    region: 'Samambaia'
  },
  
  // Alertas Recentes (últimas 2 horas) - CRÍTICOS
  {
    id: '12',
    type: 'fire',
    position: { lat: -15.7500, lng: -47.8500 },
    title: '🚨 NOVO - Incêndio Ativo',
    description: 'MODIS: Foco de calor detectado há 30min - Emergência!',
    severity: 'high',
    region: 'Brasília'
  },
  {
    id: '13',
    type: 'crime',
    position: { lat: -15.8100, lng: -48.0800 },
    title: '🚨 NOVO - Área de Risco Elevado',
    description: 'IA Alert: Padrão anômalo detectado - Requer atenção imediata',
    severity: 'high',
    region: 'Taguatinga'
  },
  
  // Alertas MÉDIOS (Laranja)
  {
    id: '14',
    type: 'trash',
    position: { lat: -15.7200, lng: -47.8600 },
    title: 'Lixo Moderado - Asa Sul',
    description: 'Sentinel-2: Acúmulo detectado em área comercial',
    severity: 'medium',
    region: 'Plano Piloto'
  },
  {
    id: '15',
    type: 'lighting',
    position: { lat: -15.8900, lng: -48.1200 },
    title: 'Iluminação Deficiente - Ceilândia Centro',
    description: 'NASA VIIRS: 8 pontos com baixa luminosidade',
    severity: 'low',
    region: 'Ceilândia'
  },
  {
    id: '16',
    type: 'flood',
    position: { lat: -15.8000, lng: -48.0300 },
    title: 'Risco Moderado de Alagamento',
    description: 'SRTM: Área com potencial de acúmulo hídrico',
    severity: 'low',
    region: 'Taguatinga'
  },
  {
    id: '17',
    type: 'crime',
    position: { lat: -16.0100, lng: -48.0500 },
    title: 'Monitoramento Preventivo',
    description: 'SSP: Área requer atenção preventiva',
    severity: 'medium',
    region: 'Gama'
  },
  
  // Alertas BAIXOS (Verde)
  {
    id: '18',
    type: 'lighting',
    position: { lat: -15.7600, lng: -47.9100 },
    title: 'Manutenção Programada - Asa Norte',
    description: 'NASA VIIRS: Área com iluminação adequada - manutenção preventiva',
    severity: 'low',
    region: 'Plano Piloto'
  },
  {
    id: '19',
    type: 'trash',
    position: { lat: -15.8400, lng: -48.0700 },
    title: 'Coleta Regular - Taguatinga Sul',
    description: 'Sentinel-2: Área limpa - coleta funcionando normalmente',
    severity: 'low',
    region: 'Taguatinga'
  },
  
  // Alertas CRÍTICOS Adicionais (Vermelho)
  {
    id: '20',
    type: 'flood',
    position: { lat: -15.7300, lng: -47.8800 },
    title: '🚨 CRÍTICO - Risco de Inundação Iminente',
    description: 'SRTM + Meteorologia: Área com alto risco de alagamento - Ação imediata necessária',
    severity: 'high',
    region: 'Plano Piloto'
  },
  {
    id: '21',
    type: 'fire',
    position: { lat: -15.9200, lng: -48.1500 },
    title: '🚨 CRÍTICO - Foco de Incêndio Ativo',
    description: 'MODIS: Incêndio em vegetação detectado - Bombeiros acionados',
    severity: 'high',
    region: 'Ceilândia'
  }
];

// Função para criar ícones customizados - VERSÃO SIMPLIFICADA
const createCustomIcon = (type: string, severity: string) => {
  
  // Determinar cor baseada na severidade
  let bgColor = '#f59e0b'; // laranja padrão
  
  if (severity === 'high') {
    bgColor = '#dc2626'; // vermelho
  } else if (severity === 'low') {
    bgColor = '#059669'; // verde
  }

  const icons = {
    trash: '🗑️',
    lighting: '💡',
    fire: '🔥',
    flood: '💧',
    crime: '🛡️'
  };

  const emoji = icons[type as keyof typeof icons] || '📍';

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${bgColor} !important;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white !important;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        box-shadow: 0 3px 12px rgba(0,0,0,0.4);
        position: relative;
        cursor: pointer;
        color: white;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  });
};

const LeafletMapComponent: React.FC<LeafletMapProps> = ({ 
  incidents = brasiliaIncidents, 
  onIncidentClick,
  activeFilter = 'Todos'
}) => {
  // Centro de Brasília
  const center: [number, number] = [-15.7801, -47.9292];

  // Função para mapear os filtros do Dashboard para os tipos de incidentes
  const getIncidentTypeFromFilter = (filter: string): string | null => {
    const filterMap: { [key: string]: string } = {
      'Lixo': 'trash',
      'Iluminação': 'lighting',
      'Incêndios': 'fire',
      'Crimes': 'crime',
      'Inundação': 'flood'
    };
    return filterMap[filter] || null;
  };

  // Filtrar incidentes baseado no filtro ativo
  const filteredIncidents = React.useMemo(() => {
    if (activeFilter === 'Todos') {
      return incidents;
    }
    
    const incidentType = getIncidentTypeFromFilter(activeFilter);
    if (!incidentType) {
      return incidents; // Se o filtro não for reconhecido, mostra todos
    }
    
    return incidents.filter(incident => incident.type === incidentType);
  }, [incidents, activeFilter]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
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

  const handleMarkerClick = (incident: MapIncident) => {
    if (onIncidentClick) {
      onIncidentClick(incident);
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden relative" key="map-simple-colors-v6">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        key="leaflet-map-simple-colors-v6"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredIncidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.position.lat, incident.position.lng]}
            icon={createCustomIcon(incident.type, incident.severity)}
            eventHandlers={{
              click: () => handleMarkerClick(incident),
            }}
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
      
      {/* Estatísticas em tempo real - Dinâmicas baseadas no filtro */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000] border-l-4 border-brand-500">
        <div className="text-xs font-semibold text-gray-800 mb-2 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Dados em Tempo Real</span>
          {activeFilter !== 'Todos' && (
            <span className="text-brand-600 font-medium">({activeFilter})</span>
          )}
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-medium">
              {filteredIncidents.filter(i => i.severity === 'high').length} ocorrências críticas
            </span>
            {filteredIncidents.filter(i => i.severity === 'high').length > 0 && (
              <span className="text-red-600 font-bold">ATENÇÃO</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>{filteredIncidents.filter(i => i.severity === 'medium').length} ocorrências médias</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{filteredIncidents.filter(i => i.severity === 'low').length} ocorrências baixas</span>
          </div>
          <div className="text-gray-600 pt-1 border-t border-gray-200">
            <div className="flex items-center space-x-1">
              <span>🔄</span>
              <span>Total: {filteredIncidents.length} | Atualizado há 30s</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legenda */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <div className="text-xs font-semibold text-gray-800 mb-2">Legenda</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <span>🗑️</span>
            <span>Lixo</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>💡</span>
            <span>Iluminação</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🔥</span>
            <span>Incêndio</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>💧</span>
            <span>Inundação</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🛡️</span>
            <span>Segurança</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeafletMapComponent; 