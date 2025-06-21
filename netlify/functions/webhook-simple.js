exports.handler = async (event, context) => {
  console.log('🔗 [WEBHOOK-SIMPLE] Webhook recebido:', event.httpMethod);
  
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  try {
    const webhookData = JSON.parse(event.body);
    console.log('📦 [WEBHOOK-SIMPLE] Payload recebido:', JSON.stringify(webhookData, null, 2));

    // Converter para formato esperado
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
        body: JSON.stringify({ error: 'Invalid webhook payload format' })
      };
    }

    console.log('🔄 [WEBHOOK-SIMPLE] Dados convertidos:', JSON.stringify(normalizedData, null, 2));

    // Método 1: Usar JSONBin.io (gratuito)
    const JSONBIN_API_KEY = '$2b$10$your-api-key-here'; // Você precisa criar uma conta gratuita
    const JSONBIN_BIN_ID = 'your-bin-id-here';
    
    // Método 2: Usar localStorage via resposta customizada (SOLUÇÃO MAIS SIMPLES)
    const responseWithWebhook = {
      success: true,
      message: 'Webhook processed successfully',
      incident_id: normalizedData.incident_id,
      timestamp: new Date().toISOString(),
      status: 'received',
      // Incluir os dados do webhook na resposta para que o backend possa processá-los
      webhook_data: normalizedData,
      // Instrução para o backend salvar no frontend
      frontend_action: {
        action: 'save_to_localstorage',
        key: 'pending_webhooks',
        data: normalizedData
      }
    };

    console.log('✅ [WEBHOOK-SIMPLE] Processamento concluído');
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(responseWithWebhook)
    };

  } catch (error) {
    console.error('❌ [WEBHOOK-SIMPLE] Erro:', error);
    
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
}; 