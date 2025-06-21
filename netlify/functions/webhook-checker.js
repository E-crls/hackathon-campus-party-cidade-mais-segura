// Armazenamento temporário em memória (em produção, use um banco de dados)
let pendingWebhooks = [];

exports.handler = async (event, context) => {
  console.log('🔍 Webhook checker chamado:', event.httpMethod);
  
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'GET') {
    // Retornar webhooks pendentes
    console.log(`📦 Retornando ${pendingWebhooks.length} webhooks pendentes`);
    console.log('📤 [WEBHOOK-CHECKER] Enviando webhooks para frontend:', JSON.stringify(webhooksToReturn, null, 2));
    
    const webhooksToReturn = [...pendingWebhooks];
    pendingWebhooks = []; // Limpar após retornar
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        webhooks: webhooksToReturn,
        count: webhooksToReturn.length,
        timestamp: new Date().toISOString()
      })
    };
  }

  if (event.httpMethod === 'POST') {
    // Adicionar novo webhook pendente
    try {
      const webhookData = JSON.parse(event.body);
      pendingWebhooks.push({
        ...webhookData,
        received_at: new Date().toISOString()
      });
      
      console.log('📥 Novo webhook adicionado à fila:', webhookData.incident_id);
      console.log(`📊 Total de webhooks pendentes: ${pendingWebhooks.length}`);
      console.log('💾 [WEBHOOK-CHECKER] Webhook armazenado na fila:', JSON.stringify(webhookData, null, 2));
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'Webhook added to queue',
          queue_length: pendingWebhooks.length
        })
      };
    } catch (error) {
      console.error('❌ Erro ao processar POST no webhook-checker:', error);
      return {
        statusCode: 400,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error: error.message
        })
      };
    }
  }

  return {
    statusCode: 405,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      error: 'Method not allowed'
    })
  };
}; 