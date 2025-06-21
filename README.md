# Orbis - Plataforma Inteligente de Segurança Urbana

## Sobre o Projeto

Orbis é uma plataforma inteligente e integrada que permite mapear, classificar, acopanhar e tratar desordens urbanas e rurais com impacto potencial na segurança pública, utilizando inteligência artificial (IA), georreferenciamento e participação cidadã.

## Tecnologias Utilizadas

- **React 19** com TypeScript
 **TailwindCSS** para estilização
 **TanStack Query** par cache e fetch de dados
 **Zod** para validação de esquemas
 **React Hook Form** para formulários
**Lucide React** para ícones
**Chart.js** para gráficos (futuro)
 **Leaflet** para mapas (futuro)

## Arquitetura

O projeto sege os **princípios SOLID** adaptados para React:

### Estrutura de Pastas

```
src/
├── components/
│   ├── ui/              # Componentes genéricos reutilizáveis
│   └── feature/         # Componentes específicos de funcionalidades
├── features/
│   ├── dashboard/       # Feature de Dashboard
│   └── wizard/          # Feature de IA Assistant
├── hooks/               # Hooks personalizados
├── services/            # Camada de dados e API
├── schemas/             # Validações com Zod
├── utils/               # Utilitários
└── types/               # Tipos TypeScript
```

### Princípios SOLID

1. SRP (Single Responsibility): Cada componente tem uma responsabilidade única
2. OCP (Open/Closed): Componentes extensíveis via props e composição
3. LSP (Liskov Substitution): Interfaces bem definidas e previsíveis
4. ISP (Interface Segregation): Props específicas, sem dependências desnecessárias
5. DIP (Dependency Inversion): Injeção de dependências via hooks e context

## Funcionalidades Implementadas

### Dashboard Executivo

- **KPI Cards** com dados em tempo real
- **Animações** e feedback visual
- **Responsividade** completa
- **Tema dark/light**

### Assistente IA

- **Chat interativo** com IA
- **Sugestões automáticas** contextuais
- **Validação de entrada** com Zod
- **Histórico de conversas**

### Sistema de Design

- **Componentes reutilizáveis** (Button, Card, Input)
- **Tema consistente** com variáveis CSS
- **Animações suaves** e transições
- **Acessibilidade** (a11y) integrada

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Lint do código
npm run lint

# Preview da build
npm run preview
```

## Configuração do Ambiente
### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```bash
# Clone o repositório
git clone [repo-url]

# Entre na pasta
cd orbis-app

# Instale as dependências
npm install --legacy-peer-deps

# Inicie o desenvolvimento
npm run dev
```

## Design Responsivo

A aplicação é totalmente responsiva, seguindo os breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Tema e Estilização

### Dark Mode por Padrão

Conforme especificação, a aplicação usa **dark mode** como padrão, com opção de alternar para light mode.

### Variáveis CSS Customizadas

```css
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 217 91% 60%;
  /* ... */
}
```

## 🔍 Validação e Type Safety

### Zod Schemas

Todos os dados são validados usando Zod:

```typescript
export const chatInputSchema = z.object({
  message: z.string().min(1).max(1000),
});
```

### TypeScript Strict

Projeto configurado com TypeScript em modo strict para máxima type safety.

## Próximos Passos

### Mapa Inteligente

- Integração com Leaflet
- Visualização georreferenciada
- Filtros dinâmicos
- Heat maps

### Dashboards Avançados

- Gráficos interativos com Chart.js
- Relatórios exportáveis
- Análises preditivas

### IA Avançada

- Integração com LLM real
- Análise de imagens de satélite
- Predições mais precisas

## Checklist de Qualidade

- ✅ Componentes com responsabilidade única
- ✅ Tipagem TypeScript clara e correta
- ✅ Validação com Zod implementada
- ✅ Composição ao invés de condicionais
- ✅ Reutilização de componentes e hooks
- ✅ Estrutura de pastas organizada
- ✅ Classes Tailwind bem organizadas
- ✅ Componentes acessíveis
- ✅ Sem hardcode de dados

## Público-Alvo

**Gestores do Ministério da Segurança Pública** que precisam de:

- Visão consolidada das desordens urbanas
- Insights baseados em dados
- Tomada de decisão ágil
- Transparência nas ações

---

> **Aviso**: Este projeto segue as melhores práticas de desenvolvimento React moderno, priorizando manutenibilidade, escalabilidade e experiência do usuário.
