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
    severity: 'medium',
    region: 'Ceilândia'
  },
  {
    id: '16',
    type: 'flood',
    position: { lat: -15.8000, lng: -48.0300 },
    title: 'Risco Moderado de Alagamento',
    description: 'SRTM: Área com potencial de acúmulo hídrico',
    severity: 'medium',
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

// Função para criar ícones customizados com animações - Cores por criticidade
const createCustomIcon = (type: string, severity: string, title: string = '') => {
  // Cores específicas para cada nível de severidade
  let backgroundColor = '#4220F3'; // Default brand para medium
  let borderColor = '#4220F3';
  let shadowColor = 'rgba(66, 32, 243, 0.7)';
  
  if (severity === 'high') {
    backgroundColor = '#dc2626'; // Vermelho para crítico
    borderColor = '#dc2626';
    shadowColor = 'rgba(220, 38, 38, 0.7)';
  } else if (severity === 'low') {
    backgroundColor = '#059669'; // Verde para baixo
    borderColor = '#059669';
    shadowColor = 'rgba(5, 150, 105, 0.7)';
  }

  const icons = {
    trash: '🗑️',
    lighting: '💡',
    fire: '🔥',
    flood: '💧',
    crime: '🛡️'
  };

  const emoji = icons[type as keyof typeof icons] || '📍';
  
  // Detecta se é um alerta novo (baseado no título)
  const isNewAlert = title.includes('🚨 NOVO');
  
  // Animações diferentes baseadas na severidade e se é novo
  const getAnimation = (severity: string, isNew: boolean = false) => {
    if (isNew) {
      return `
        animation: newAlert-${severity} 0.8s ease-in-out infinite, criticalPulse-${severity} 1.2s ease-in-out infinite, emergencyFlash-${severity} 3s ease-in-out infinite;
        @keyframes newAlert-${severity} {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.15) rotate(-2deg); }
          50% { transform: scale(1.2) rotate(0deg); }
          75% { transform: scale(1.15) rotate(2deg); }
        }
        @keyframes emergencyFlash-${severity} {
          0%, 90%, 100% { background-color: ${backgroundColor}; }
          45% { background-color: #ffffff; }
        }
      `;
    }
    
    switch (severity) {
      case 'high':
        return `
          animation: criticalPulse-${severity} 1.5s ease-in-out infinite, bounce-${severity} 2s ease-in-out infinite;
        `;
      case 'medium':
        return `
          animation: mediumPulse-${severity} 2s ease-in-out infinite;
        `;
      case 'low':
        return `
          animation: lowGlow-${severity} 3s ease-in-out infinite;
        `;
      default:
        return '';
    }
  };

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <style>
        .marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .pulse-ring {
          position: absolute;
          border: 3px solid ${borderColor} !important;
          border-radius: 50%;
          animation: pulseRing-${severity} 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
          opacity: 0;
        }
        
        .marker-main {
          background-color: ${backgroundColor} !important;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          box-shadow: 0 3px 12px rgba(0,0,0,0.4);
          position: relative;
          z-index: 2;
          cursor: pointer;
          transition: all 0.3s ease;
          ${getAnimation(severity, isNewAlert)}
        }
        
        .marker-main:hover {
          transform: scale(1.2) !important;
          box-shadow: 0 5px 20px rgba(0,0,0,0.5) !important;
        }
        
        .marker-pointer {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid ${borderColor} !important;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        
        @keyframes pulseRing-high {
          0% {
            transform: scale(0.8);
            opacity: 1;
            border-color: ${borderColor};
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
            border-color: ${borderColor};
          }
        }
        
        @keyframes pulseRing-medium {
          0% {
            transform: scale(0.8);
            opacity: 1;
            border-color: ${borderColor};
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
            border-color: ${borderColor};
          }
        }
        
        @keyframes pulseRing-low {
          0% {
            transform: scale(0.8);
            opacity: 1;
            border-color: ${borderColor};
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
            border-color: ${borderColor};
          }
        }
        
        @keyframes criticalPulse-high {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 0 0 ${shadowColor}; 
          }
          50% { 
            transform: scale(1.1); 
            box-shadow: 0 5px 20px rgba(0,0,0,0.5), 0 0 0 12px ${shadowColor.replace('0.7', '0')}; 
          }
        }
        
        @keyframes criticalPulse-medium {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 0 0 ${shadowColor}; 
          }
          50% { 
            transform: scale(1.1); 
            box-shadow: 0 5px 20px rgba(0,0,0,0.5), 0 0 0 12px ${shadowColor.replace('0.7', '0')}; 
          }
        }
        
        @keyframes criticalPulse-low {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 0 0 ${shadowColor}; 
          }
          50% { 
            transform: scale(1.1); 
            box-shadow: 0 5px 20px rgba(0,0,0,0.5), 0 0 0 12px ${shadowColor.replace('0.7', '0')}; 
          }
        }
        
        @keyframes bounce-high {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-6px) scale(1.05); }
          60% { transform: translateY(-3px) scale(1.02); }
        }
        
        @keyframes bounce-medium {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-6px) scale(1.05); }
          60% { transform: translateY(-3px) scale(1.02); }
        }
        
        @keyframes bounce-low {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-6px) scale(1.05); }
          60% { transform: translateY(-3px) scale(1.02); }
        }
        
        @keyframes mediumPulse-medium {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 0 0 ${shadowColor}; 
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 4px 16px rgba(0,0,0,0.45), 0 0 0 10px ${shadowColor.replace('0.7', '0')}; 
          }
        }
        
        @keyframes lowGlow-low {
          0%, 100% { 
            box-shadow: 0 3px 12px rgba(0,0,0,0.4); 
          }
          50% { 
            box-shadow: 0 0 20px ${shadowColor}, 0 3px 12px rgba(0,0,0,0.4); 
          }
        }
      </style>
      
      <div class="marker-container">
        <div class="pulse-ring"></div>
        <div class="marker-main">
          ${emoji}
          <div class="marker-pointer"></div>
        </div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

const LeafletMapComponent: React.FC<LeafletMapProps> = ({ 
  incidents = brasiliaIncidents, 
  onIncidentClick 
}) => {
  // Centro de Brasília
  const center: [number, number] = [-15.7801, -47.9292];

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

  const handleMarkerClick = (incident: MapIncident) => {
    if (onIncidentClick) {
      onIncidentClick(incident);
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden relative" key="map-animations-fixed-v4">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        key="leaflet-map-animations-v4"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.position.lat, incident.position.lng]}
            icon={createCustomIcon(incident.type, incident.severity, incident.title)}
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
      
      {/* Estatísticas em tempo real */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000] border-l-4 border-brand-500">
        <div className="text-xs font-semibold text-gray-800 mb-2 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Dados em Tempo Real</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-medium">4 ocorrências críticas</span>
            <span className="text-red-600 font-bold">↑2 NOVOS</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
            <span>6 ocorrências médias</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>2 ocorrências baixas</span>
          </div>
          <div className="text-gray-600 pt-1 border-t border-gray-200">
            <div className="flex items-center space-x-1">
              <span>🔄</span>
              <span>Atualizado há 30s</span>
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