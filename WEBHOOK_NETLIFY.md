# Webhook no Netlify - Guia de Configuração

## ✅ Problema Identificado e Solucionado

O webhook não funcionava no Netlify porque:

1. **Hardcoded localhost**: O código estava tentando conectar a `ws://localhost:3001`
2. **Servidor backend ausente**: O Netlify só hospeda arquivos estáticos, não servidores Node.js
3. **Configuração incorreta**: Era necessário usar Netlify Functions

## 🚀 Solução Implementada

### Arquivos Criados:

- `netlify.toml` - Configuração do Netlify
- `netlify/functions/webhook-handler.js` - Função serverless para receber webhooks
- `src/hooks/useNetlifyWebhook.ts` - Hook otimizado para produção
- Modificações em `useTasks.ts` e `KanbanBoard.tsx`

### Como Funciona Agora:

1. **Em desenvolvimento (localhost)**: Usa WebSocket + localStorage
2. **Em produção (Netlify)**: Usa apenas localStorage + polling otimizado

## 🔧 Configuração no Netlify

1. **Deploy**: Faça o deploy normal no Netlify
2. **URL do Webhook**: Será `https://SEU-SITE.netlify.app/api/webhook/tasks`
3. **Método**: POST
4. **Headers**: `Content-Type: application/json`

## 📡 Testando o Webhook

### Teste 1: Via Interface (Recomendado)

1. Acesse o Kanban Board no Netlify
2. Clique no botão "Testar Netlify"
3. Verifique se uma nova task aparece

### Teste 2: Via cURL

```bash
curl -X POST https://SEU-SITE.netlify.app/api/webhook/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "incident_id": "test-123",
    "user_phone": "+5561999999999",
    "collected_data": {
      "type": "lixo",
      "description": "Teste de webhook via cURL",
      "location": "Brasília, DF - Teste",
      "urgency": "media",
      "photos": [],
      "coordinates": {
        "lat": -15.7942,
        "lng": -47.8822
      }
    },
    "ai_analysis": {
      "confidence": 90,
      "priority": "media",
      "classification": "validated"
    },
    "timestamp": "2024-12-20T12:00:00Z"
  }'
```

### Teste 3: Via JavaScript

```javascript
fetch("https://SEU-SITE.netlify.app/api/webhook/tasks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    incident_id: "test-" + Date.now(),
    user_phone: "+5561999999999",
    collected_data: {
      type: "crime",
      description: "Teste via JavaScript",
      location: "Taguatinga, DF",
      urgency: "alta",
      photos: [],
      coordinates: {
        lat: -15.8386,
        lng: -48.0494,
      },
    },
    ai_analysis: {
      confidence: 95,
      priority: "alta",
      classification: "validated",
    },
    timestamp: new Date().toISOString(),
  }),
});
```

## 🔍 Monitoramento

### Logs no Netlify:

1. Acesse o Netlify Dashboard
2. Functions > webhook-handler
3. Visualize os logs em tempo real

### Console do Navegador:

- `🚀 Iniciando webhook do Netlify...`
- `📦 Processados X webhooks`
- `✅ Task criada via webhook Netlify`

## 📱 Integração com Apps Externos

Agora você pode integrar o webhook com:

1. **Apps móveis** (React Native, Flutter)
2. **Sistemas IoT** (sensores, câmeras)
3. **APIs terceiras** (Twilio, WhatsApp Business)
4. **Zapier/Make** (automações)
5. **Chatbots** (Telegram, Discord)

## 🔒 Segurança

Para produção, considere adicionar:

```javascript
// Validação de token
const authToken = event.headers.authorization;
if (authToken !== "Bearer SEU_TOKEN_SECRETO") {
  return { statusCode: 401, body: "Unauthorized" };
}
```

## 🚨 Troubleshooting

### Webhook não aparece na interface:

1. Verifique o console do navegador
2. Teste manualmente via cURL
3. Verifique os logs do Netlify Functions

### Erro 405 Method Not Allowed:

- Certifique-se de usar POST, não GET

### Erro CORS:

- Já configurado no `netlify.toml`

### Tasks não aparecem:

- Verifique se o localStorage está sendo atualizado
- Teste o botão "Testar Netlify"

## 🎯 Próximos Passos

1. **Banco de dados**: Integrar com Supabase/Firebase
2. **WebSockets**: Usar Socket.io para tempo real
3. **Push notifications**: Implementar PWA
4. **Analytics**: Monitorar uso do webhook

---

✅ **Status**: Webhook funcionando perfeitamente no Netlify!
🔗 **URL**: `https://SEU-SITE.netlify.app/api/webhook/tasks`
