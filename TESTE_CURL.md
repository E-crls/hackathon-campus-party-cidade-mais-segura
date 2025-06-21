# 🧪 Comandos cURL para Testar no Postman

## 🔗 **1. Teste do Webhook Principal**

_(O que seu backend já faz)_

### URL:

```
POST https://campus-party-cidade-mais-segura.netlify.app/api/webhook/tasks
```

### Headers:

```
Content-Type: application/json
```

### Body (JSON):

```json
{
  "incident_id": "test-123-456",
  "type": "lixo",
  "location": "Águas Claras, Rua 233, quadra 5, lote 6, número 9",
  "urgency": "media",
  "description": "Acúmulo de lixo em lugares escuros em Águas Claras",
  "confidence": 95
}
```

### cURL:

```bash
curl -X POST "https://campus-party-cidade-mais-segura.netlify.app/api/webhook/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "incident_id": "test-123-456",
    "type": "lixo",
    "location": "Águas Claras, Rua 233, quadra 5, lote 6, número 9",
    "urgency": "media",
    "description": "Acúmulo de lixo em lugares escuros em Águas Claras",
    "confidence": 95
  }'
```

---

## 💉 **2. Teste do Webhook Inject**

_(A NOVA solução para notificar o frontend)_

### URL:

```
POST https://campus-party-cidade-mais-segura.netlify.app/api/webhook/inject
```

### Headers:

```
Content-Type: application/json
```

### Body (JSON):

```json
{
  "incident_id": "inject-test-789",
  "type": "crime",
  "location": "Taguatinga Norte, QNF 20, Conjunto K",
  "urgency": "alta",
  "description": "Atividade suspeita reportada por cidadão",
  "confidence": 88
}
```

### cURL:

```bash
curl -X POST "https://campus-party-cidade-mais-segura.netlify.app/api/webhook/inject" \
  -H "Content-Type: application/json" \
  -d '{
    "incident_id": "inject-test-789",
    "type": "crime",
    "location": "Taguatinga Norte, QNF 20, Conjunto K",
    "urgency": "alta",
    "description": "Atividade suspeita reportada por cidadão",
    "confidence": 88
  }'
```

---

## 🔍 **3. Teste para Verificar Webhooks Pendentes**

### URL:

```
GET https://campus-party-cidade-mais-segura.netlify.app/api/webhook/inject
```

### cURL:

```bash
curl -X GET "https://campus-party-cidade-mais-segura.netlify.app/api/webhook/inject" \
  -H "Content-Type: application/json"
```

---

## 🧪 **Como Testar no Postman**

### **Teste 1: Webhook Inject (Recomendado)**

1. **Método**: POST
2. **URL**: `https://campus-party-cidade-mais-segura.netlify.app/api/webhook/inject`
3. **Headers**:
   - `Content-Type: application/json`
4. **Body > Raw > JSON**:

```json
{
  "incident_id": "postman-test-" + Math.random(),
  "type": "iluminacao",
  "location": "Sobradinho, Quadra 15, Casa 23",
  "urgency": "media",
  "description": "Poste de luz queimado na via principal"
}
```

### **Teste 2: Verificar se Apareceu**

1. **Abra o site** no navegador
2. **F12 > Console**
3. **Aguarde até 2 segundos**
4. **Verifique os logs**:
   - `🔄 [FRONTEND] Verificando webhooks pendentes na API...`
   - `📥 [WEBHOOK-INJECT] Webhook para injeção`
   - `✅ Task criada via webhook Netlify`

---

## 🎯 **Resposta Esperada**

### **Sucesso (Status 200)**:

```json
{
  "success": true,
  "message": "Webhook queued for injection",
  "incident_id": "postman-test-123",
  "queue_length": 1
}
```

### **Erro (Status 400)**:

```json
{
  "error": "Invalid webhook format"
}
```

---

## ⚡ **Teste Rápido**

**Para ver funcionando IMEDIATAMENTE:**

1. **Execute este cURL**:

```bash
curl -X POST "https://campus-party-cidade-mais-segura.netlify.app/api/webhook/inject" \
  -H "Content-Type: application/json" \
  -d '{"incident_id":"teste-agora-123","type":"lixo","location":"Brasília Centro","urgency":"alta"}'
```

2. **Abra o site e veja a task aparecer!** 🎯

---

## 🌐 **Teste Multi-Sessão**

**Para testar com múltiplos usuários/abas:**

1. **Abra o site em várias abas/dispositivos**
2. **Execute o webhook** de qualquer lugar
3. **TODAS as sessões** vão receber a task automaticamente! ✨

### **Logs que você verá (cada sessão):**

```
🚀 Iniciando webhook do Netlify (Multi-sessão)...
🔍 [MULTI-SESSION] Timestamp inicial desta sessão: 1703123456789
⏰ [MULTI-SESSION] Atualizando timestamp: 1703123456789 → 1703123460000
📊 [FRONTEND] Total na fila global: 1
🎯 [FRONTEND] Nova task adicionada ao cache
```

---

💡 **Dica**: Use o endpoint `/api/webhook/inject` - ele vai fazer a task aparecer na interface de **TODOS os usuários** simultaneamente!
