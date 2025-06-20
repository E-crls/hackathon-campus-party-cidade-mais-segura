import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Middleware para interceptar webhooks
    middlewares: [
      {
        name: 'webhook-handler',
        configureServer(server) {
          server.middlewares.use('/api/webhook/tasks', (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              
              req.on('data', chunk => {
                body += chunk.toString();
              });
              
              req.on('end', () => {
                try {
                  const webhookData = JSON.parse(body);
                  
                  console.log('🚨 WEBHOOK RECEBIDO!', {
                    incident_id: webhookData.incident_id,
                    type: webhookData.collected_data?.type,
                    location: webhookData.collected_data?.location
                  });
                  
                  // Enviar dados para o frontend via postMessage
                  const message = {
                    type: 'WEBHOOK_RECEIVED',
                    data: webhookData
                  };
                  
                  // Broadcast para todas as janelas abertas
                  if (global.broadcastChannel) {
                    global.broadcastChannel.postMessage(message);
                  }
                  
                  // Salvar no localStorage para o frontend pegar
                  const existingWebhooks = JSON.parse(global.localStorage?.getItem('pending_webhooks') || '[]');
                  existingWebhooks.push(webhookData);
                  if (global.localStorage) {
                    global.localStorage.setItem('pending_webhooks', JSON.stringify(existingWebhooks));
                  }
                  
                  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                  res.end(JSON.stringify({
                    success: true,
                    message: 'Webhook recebido com sucesso!',
                    incident_id: webhookData.incident_id
                  }));
                  
                } catch (error) {
                  console.error('❌ Erro ao processar webhook:', error);
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    success: false,
                    error: 'Dados inválidos'
                  }));
                }
              });
            } else if (req.method === 'OPTIONS') {
              // Handle CORS preflight
              res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
              });
              res.end();
            } else {
              next();
            }
          });
        }
      }
    ]
  }
})
