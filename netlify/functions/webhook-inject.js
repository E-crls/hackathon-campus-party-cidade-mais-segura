// Armazenamento temporário para webhook injection
let pendingInjects = [];

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

      // Adicionar na lista de injeções pendentes
      pendingInjects.push({
        ...normalizedData,
        injected_at: new Date().toISOString(),
        id: normalizedData.incident_id || Date.now().toString()
      });

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

  // GET: Retornar webhooks para injeção
  if (event.httpMethod === 'GET') {
    console.log(`📤 [WEBHOOK-INJECT] Retornando ${pendingInjects.length} webhooks para injeção`);
    
    const injectsToReturn = [...pendingInjects];
    pendingInjects = []; // Limpar após retornar

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        webhooks: injectsToReturn,
        count: injectsToReturn.length,
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