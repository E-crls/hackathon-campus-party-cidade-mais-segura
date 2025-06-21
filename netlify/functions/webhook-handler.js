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
    
    console.log('📦 Dados do webhook recebidos:', {
      incident_id: webhookData.incident_id,
      type: webhookData.collected_data?.type,
      location: webhookData.collected_data?.location,
      urgency: webhookData.collected_data?.urgency
    });

    // Validate required fields
    if (!webhookData.incident_id || !webhookData.collected_data) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Invalid webhook payload. Missing required fields.',
          required: ['incident_id', 'collected_data']
        })
      };
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send to external services
    // 3. Trigger notifications
    
    // For now, we'll simulate storage and return success
    // In a real implementation, you'd save to a database like:
    // await saveToDatabase(webhookData);
    // await sendNotification(webhookData);
    
    console.log('✅ Webhook processado com sucesso');
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Webhook processed successfully',
        incident_id: webhookData.incident_id,
        timestamp: new Date().toISOString(),
        status: 'received'
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