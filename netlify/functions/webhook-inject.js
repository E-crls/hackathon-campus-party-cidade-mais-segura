// Armazenamento temporário para webhook injection (com timestamp para múltiplas sessões)
let pendingInjects = [];
const WEBHOOK_TTL = 60000; // 60 segundos de vida útil para cada webhook

exports.handler = async (event, context) => {
  console.log('💉 [WEBHOOK-INJECT] Chamada recebida:', event.httpMethod);
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Action',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // POST: Adicionar webhook para injeção
  if (event.httpMethod === 'POST') {
    try {
      const webhookData = JSON.parse(event.body);
      console.log('📥 [WEBHOOK-INJECT] Webhook para injeção:', JSON.stringify(webhookData, null, 2));

      // Converter formato se necessário
      let normalizedData;
      
      if (webhookData.collected_data) {
        normalizedData = webhookData;
      } else if (webhookData.incident_id && webhookData.type) {
        normalizedData = {
          incident_id: webhookData.incident_id,
          user_phone: webhookData.user_phone || '+5561000000000',
          collected_data: {
            type: webhookData.type,
            description: webhookData.description || `Ocorrência do tipo ${webhookData.type} reportada`,
            location: webhookData.location,
            urgency: webhookData.urgency || 'media',
            photos: webhookData.photos || [],
            coordinates: webhookData.coordinates || { lat: -15.7942, lng: -47.8822 }
          },
          ai_analysis: {
            confidence: webhookData.confidence || 85,
            priority: webhookData.urgency || 'media',
            classification: 'validated'
          },
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid webhook format' })
        };
      }

      // Adicionar na lista de injeções pendentes com timestamp
      const webhookWithTimestamp = {
        ...normalizedData,
        injected_at: new Date().toISOString(),
        injected_timestamp: Date.now(),
        id: normalizedData.incident_id || Date.now().toString(),
        session_id: Math.random().toString(36).substr(2, 9) // ID único para rastreamento
      };
      
      pendingInjects.push(webhookWithTimestamp);
      
      // Limpar webhooks expirados (mais de 60 segundos)
      const now = Date.now();
      pendingInjects = pendingInjects.filter(webhook => 
        (now - webhook.injected_timestamp) < WEBHOOK_TTL
      );

      console.log('✅ [WEBHOOK-INJECT] Webhook adicionado para injeção');
      console.log(`📊 [WEBHOOK-INJECT] Total pendente: ${pendingInjects.length}`);

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Webhook queued for injection',
          incident_id: normalizedData.incident_id,
          queue_length: pendingInjects.length
        })
      };

    } catch (error) {
      console.error('❌ [WEBHOOK-INJECT] Erro no POST:', error);
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  // GET: Retornar webhooks para injeção (sem limpar para suportar múltiplas sessões)
  if (event.httpMethod === 'GET') {
    // Obter parâmetro de timestamp da última consulta desta sessão
    const lastCheck = event.queryStringParameters?.since || '0';
    const lastCheckTimestamp = parseInt(lastCheck);
    
    // Limpar webhooks expirados
    const now = Date.now();
    pendingInjects = pendingInjects.filter(webhook => 
      (now - webhook.injected_timestamp) < WEBHOOK_TTL
    );
    
    // Retornar apenas webhooks mais novos que a última consulta desta sessão
    const newWebhooks = pendingInjects.filter(webhook => 
      webhook.injected_timestamp > lastCheckTimestamp
    );
    
    console.log(`📤 [WEBHOOK-INJECT] Retornando ${newWebhooks.length} webhooks novos para injeção`);
    console.log(`📊 [WEBHOOK-INJECT] Total na fila: ${pendingInjects.length}, Novos desde ${lastCheck}: ${newWebhooks.length}`);
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        webhooks: newWebhooks,
        count: newWebhooks.length,
        total_in_queue: pendingInjects.length,
        current_timestamp: now,
        timestamp: new Date().toISOString()
      })
    };
  }

  return {
    statusCode: 405,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}; 