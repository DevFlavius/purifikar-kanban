# 🏭 Painel de Produção - Purifikar (Versão Unificada)

Este é um sistema de **Kanban Web** desenvolvido para acompanhar em tempo real a produção da indústria **IPF industria (Grupo Purifikar)**. 

## 🚀 Mudanças na Arquitetura Unificada

### ✅ O que mudou:
- **Servidor único**: Agora roda em apenas um processo Node.js
- **Build unificado**: Frontend e backend são compilados juntos
- **Servir estático**: O Express serve os arquivos do React diretamente
- **Comandos simplificados**: Um único `npm start` para rodar tudo

### 🏗️ Estrutura Atual:
```
purifikar-kanban/
├── package.json              # Scripts de gerenciamento geral
├── backend/
│   ├── src/
│   │   ├── index.ts          # Servidor Express unificado
│   │   ├── routes/           # Rotas da API
│   │   └── ...
│   ├── dist/
│   │   ├── index.js          # Backend compilado
│   │   └── public/           # Frontend compilado (servido pelo Express)
│   └── package.json          # Dependências e scripts principais
└── frontend/
    ├── src/                  # Código fonte React
    ├── vite.config.ts        # Configurado para build em backend/dist/public
    └── package.json          # Dependências do frontend
```

## ⚙️ Como Rodar (Versão Unificada)

### 📋 Passo a Passo Completo

#### 1. Instalação das dependências
```bash
# Na raiz do projeto (purifikar-kanban/)
npm run install:all
```
Este comando instala as dependências do backend e frontend automaticamente.

#### 2. Geração do Prisma Client
```bash
# Navegue para o diretório backend
cd backend

# Gere o Prisma Client (OBRIGATÓRIO para o banco de dados funcionar)
npx prisma generate

# Volte para a raiz do projeto
cd ..
```
⚠️ **IMPORTANTE**: O `prisma generate` deve ser executado dentro da pasta `backend/` onde está localizado o arquivo `prisma/schema.prisma`.

#### 3. Desenvolvimento (com hot reload)
```bash
# Na raiz do projeto
npm run dev
```
Isso irá:
- Rodar o backend em modo desenvolvimento (porta 3001)
- Rodar o frontend em modo desenvolvimento (porta 5173)
- Configurar proxy automático para as APIs

#### 4. Produção (build + start unificado)
```bash
# Na raiz do projeto
npm start
```
Isso irá:
1. Compilar o frontend para `backend/dist/public/`
2. Compilar o backend TypeScript para `backend/dist/`
3. Iniciar o servidor unificado na porta 3001

### 🌐 Acesso
- **Frontend**: http://localhost:3001 (produção) ou http://localhost:5173 (desenvolvimento)
- **API**: http://localhost:3001/api
- **Rotas específicas**: 
  - http://localhost:3001/op
  - http://localhost:3001/webhook

### 🔄 Resumo dos Comandos (Ordem Correta)
```bash
# 1. Instalar dependências
npm run install:all

# 2. Gerar Prisma Client
cd backend
npx prisma generate
cd ..

# 3. Rodar em desenvolvimento
npm run dev

# OU rodar em produção
npm start
```

## 🔧 Scripts Disponíveis

### Na raiz do projeto:
- `npm run install:all` - Instala dependências de todos os módulos
- `npm run dev` - Modo desenvolvimento com hot reload
- `npm run build` - Build completo (frontend + backend)
- `npm start` - Build e start em produção
- `npm run clean` - Limpa arquivos de build

### No diretório backend:
- `npm run dev` - Apenas backend em desenvolvimento
- `npm run dev:unified` - Backend + frontend em desenvolvimento
- `npm run build` - Build completo
- `npm run build:frontend` - Build apenas do frontend
- `npm run build:backend` - Build apenas do backend
- `npm start` - Build e start em produção

## 🌐 Configuração de Proxy

Durante o desenvolvimento, o Vite está configurado para fazer proxy das rotas da API:
- `/op/*` → `http://localhost:3001`
- `/webhook/*` → `http://localhost:3001`

## 📦 Tecnologias Utilizadas

### 🖥️ Frontend
- React + TypeScript
- Vite (configurado para build unificado)
- DnD Kit (`@dnd-kit/core`, `@dnd-kit/sortable`)
- TailwindCSS
- Axios para chamadas HTTP

### 🛠️ Backend
- Node.js com TypeScript
- Express.js (servindo API + arquivos estáticos)
- Prisma ORM
- PostgreSQL
- Integração com API da Omie

## 🧩 Funcionalidades

- 📦 Exibição das Ordens de Produção em 5 colunas Kanban
- 📥 Recebimento automático das OPs via Webhook da Omie
- 🔁 Sincronização de status com a Omie
- 🧲 Drag and drop com DnD Kit
- 👁️ Modal detalhado ao clicar em uma OP
- 🧼 Estilo limpo e responsivo com animações suaves

## 🚀 Deploy

Para deploy em produção:

1. Configure as variáveis de ambiente necessárias
2. Execute `npm run build` para compilar tudo
3. Execute `npm start` ou `node backend/dist/index.js`
4. O servidor estará disponível na porta configurada (padrão: 3001)

## 🔄 Migração da Versão Anterior

Se você estava usando a versão com dois servidores separados:

1. **Pare os servidores antigos**
2. **Atualize o código** com as modificações desta versão
3. **Reinstale as dependências**: `npm run install:all`
4. **Use os novos comandos**: `npm start` ou `npm run dev`

## 📝 Notas Importantes

- O frontend agora é servido pelo Express na rota raiz (`/`)
- As rotas da API continuam funcionando normalmente (`/op`, `/webhook`, `/api`)
- O fallback para SPA está configurado para servir `index.html` em rotas não-API
- Durante desenvolvimento, ainda é possível rodar frontend e backend separadamente se necessário

