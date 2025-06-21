exports.handler = async (event, context) => {
  console.log('🔗 Webhook recebido no Netlify:', event.httpMethod);
  
  // Handle preflight CORS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Method not allowed. Use POST.' 
      })
    };
  }

  try {
    // Parse the webhook payload
    const webhookData = JSON.parse(event.body);
    
    console.log('📦 Dados brutos do webhook recebidos:', webhookData);
    console.log('🔍 [WEBHOOK-HANDLER] Payload recebido:', JSON.stringify(webhookData, null, 2));

    // Detectar formato do payload e normalizar
    let normalizedData;
    
    if (webhookData.collected_data) {
      // Formato completo esperado
      normalizedData = webhookData;
      console.log('📋 Formato completo detectado');
    } else if (webhookData.incident_id && webhookData.type) {
      // Formato simplificado do seu backend - converter para formato esperado
      console.log('📋 Formato simplificado detectado - convertendo...');
      normalizedData = {
        incident_id: webhookData.incident_id,
        user_phone: webhookData.user_phone || '+5561000000000',
        collected_data: {
          type: webhookData.type,
          description: webhookData.description || `Ocorrência do tipo ${webhookData.type} reportada`,
          location: webhookData.location,
          urgency: webhookData.urgency || 'media',
          photos: webhookData.photos || [],
          coordinates: webhookData.coordinates || {
            lat: -15.7942,
            lng: -47.8822
          }
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
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Invalid webhook payload format',
          received: webhookData,
          expectedFormats: [
            'Format 1: {incident_id, collected_data, ai_analysis, ...}',
            'Format 2: {incident_id, type, location, description, ...}'
          ]
        })
      };
    }

    console.log('📋 Dados normalizados:', {
      incident_id: normalizedData.incident_id,
      type: normalizedData.collected_data.type,
      location: normalizedData.collected_data.location,
      urgency: normalizedData.collected_data.urgency
    });
    console.log('🔄 [WEBHOOK-HANDLER] Dados convertidos para formato frontend:', JSON.stringify(normalizedData, null, 2));

    // Notificar o webhook-checker sobre o novo webhook
    try {
      const checkerResponse = await fetch(`${event.headers.host ? 'https://' + event.headers.host : 'http://localhost:8888'}/.netlify/functions/webhook-checker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedData)
      });
      console.log('📤 Webhook enviado para fila:', checkerResponse.status);
      console.log('✅ [WEBHOOK-HANDLER] Dados enviados para webhook-checker com sucesso');
    } catch (error) {
      console.warn('⚠️ Erro ao enviar para fila (não crítico):', error.message);
      console.error('❌ [WEBHOOK-HANDLER] Falha ao enviar para webhook-checker:', error);
    }
    
    console.log('✅ Webhook processado e preparado para o frontend');
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Webhook processed successfully',
        incident_id: normalizedData.incident_id,
        timestamp: new Date().toISOString(),
        status: 'received',
        webhook_data: normalizedData
      })
    };

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
}; 