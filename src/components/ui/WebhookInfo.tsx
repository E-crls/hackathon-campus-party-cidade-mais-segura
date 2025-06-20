import { useState } from 'react';
import { Copy, Check, Code, ExternalLink, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface WebhookInfoProps {
  isVisible: boolean;
  onClose: () => void;
}

export function WebhookInfo({ isVisible, onClose }: WebhookInfoProps) {
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const webhookEndpoint = `${window.location.origin}/api/webhook/tasks`;
  
  const examplePayload = `{
  "incident_id": "uuid-example-123",
  "user_phone": "+5561999999999",
  "collected_data": {
    "type": "lixo",
    "description": "Acúmulo de lixo na calçada",
    "location": "Rua das Flores, 123 - Brasília/DF",
    "urgency": "media",
    "photos": ["base64_encoded_image_1", "base64_encoded_image_2"],
    "coordinates": {
      "lat": -15.7942,
      "lng": -47.8822
    }
  },
  "ai_analysis": {
    "confidence": 85,
    "priority": "media",
    "classification": "validated"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`;

  const copyToClipboard = async (text: string, type: 'endpoint' | 'payload') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'endpoint') {
        setCopiedEndpoint(true);
        setTimeout(() => setCopiedEndpoint(false), 2000);
      } else {
        setCopiedPayload(true);
        setTimeout(() => setCopiedPayload(false), 2000);
      }
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-brand-600" />
              <span>Configuração do Webhook</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Endpoint */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <span>Endpoint do Webhook</span>
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">POST</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(webhookEndpoint, 'endpoint')}
                  className="text-xs"
                >
                  {copiedEndpoint ? (
                    <>
                      <Check className="h-3 w-3 mr-1 text-green-600" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              <code className="text-sm font-mono text-gray-800 break-all">
                {webhookEndpoint}
              </code>
            </div>
          </div>

          {/* Headers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Headers Necessários</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <code className="text-sm font-mono text-gray-800">
                Content-Type: application/json
              </code>
            </div>
          </div>

          {/* Estrutura do Payload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <span>Estrutura do Payload</span>
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-200 relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(examplePayload, 'payload')}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                {copiedPayload ? (
                  <>
                    <Check className="h-3 w-3 mr-1 text-green-400" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
              <pre className="text-sm text-gray-100 overflow-x-auto">
                {examplePayload}
              </pre>
            </div>
          </div>

          {/* Tipos Suportados */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tipos de Ocorrência</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'lixo', label: 'Lixo/Resíduos', color: 'bg-green-100 text-green-700' },
                { key: 'iluminacao', label: 'Iluminação', color: 'bg-yellow-100 text-yellow-700' },
                { key: 'crime', label: 'Crime/Segurança', color: 'bg-red-100 text-red-700' },
                { key: 'incendio', label: 'Incêndio', color: 'bg-orange-100 text-orange-700' },
                { key: 'inundacao', label: 'Inundação', color: 'bg-blue-100 text-blue-700' },
              ].map((type) => (
                <div
                  key={type.key}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium text-center',
                    type.color
                  )}
                >
                  <code className="font-mono text-xs">{type.key}</code>
                  <br />
                  <span className="text-xs">{type.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Níveis de Urgência */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Níveis de Urgência</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'baixa', label: 'Baixa', color: 'bg-blue-100 text-blue-700' },
                { key: 'media', label: 'Média', color: 'bg-yellow-100 text-yellow-700' },
                { key: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-700' },
                { key: 'critica', label: 'Crítica', color: 'bg-red-100 text-red-700' },
              ].map((urgency) => (
                <div
                  key={urgency.key}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium text-center',
                    urgency.color
                  )}
                >
                  <code className="font-mono text-xs">{urgency.key}</code>
                  <br />
                  <span className="text-xs">{urgency.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resposta */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Resposta do Webhook</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Sucesso (200):</strong>
              </p>
              <code className="text-sm font-mono text-gray-800">
                {`{ "success": true, "task_id": "generated-uuid", "message": "Tarefa criada com sucesso" }`}
              </code>
              
              <p className="text-sm text-gray-600 mb-2 mt-4">
                <strong>Erro (400/500):</strong>
              </p>
              <code className="text-sm font-mono text-gray-800">
                {`{ "success": false, "error": "Descrição do erro" }`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 