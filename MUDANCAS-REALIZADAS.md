# 📋 Resumo das Mudanças Realizadas para Unificação

## 🎯 Objetivo
Unificar o projeto para rodar em um único processo Node.js, eliminando a necessidade de dois servidores separados (backend na porta 3001 e frontend na porta 5173).

## 🔧 Modificações Realizadas

### 1. **Frontend (`frontend/vite.config.ts`)**
```typescript
// ANTES: Build padrão do Vite
// DEPOIS: Build direcionado para backend/dist/public
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/dist/public',
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: ['kanban.flavio.space'],
    proxy: {
      '/op': 'http://localhost:3001',
      '/webhook': 'http://localhost:3001'
    }
  },
});
```

### 2. **Backend (`backend/package.json`)**
```json
{
  "name": "purifikar-kanban-unified",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd ../frontend && npm run build",
    "build:backend": "tsc",
    "start": "npm run build && node dist/index.js",
    "dev:unified": "concurrently \"npm run dev\" \"cd ../frontend && npm run dev\""
  },
  "devDependencies": {
    // ... outras dependências
    "concurrently": "^8.2.2"
  }
}
```

### 3. **Backend (`backend/src/index.ts`)**
```typescript
// ADICIONADO: Import do path
import path from 'path';

// ADICIONADO: Servir arquivos estáticos
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// ADICIONADO: Fallback para SPA
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/op') || req.path.startsWith('/webhook')) {
    return next();
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// MODIFICADO: Servidor escutando em 0.0.0.0
const PORT = parseInt(process.env.PORT || '3001', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor unificado rodando em http://localhost:${PORT}`);
  console.log(`Frontend disponível em: http://localhost:${PORT}`);
  console.log(`API disponível em: http://localhost:${PORT}/api`);
});
```

### 4. **Raiz do Projeto (`package.json`)**
```json
{
  "name": "purifikar-kanban",
  "scripts": {
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install",
    "dev": "cd backend && npm run dev:unified",
    "build": "cd backend && npm run build",
    "start": "cd backend && npm start",
    "clean": "rm -rf backend/dist && rm -rf frontend/dist"
  }
}
```

## 🚀 Como Usar Agora

### 📋 Passo a Passo Completo para Desenvolvimento:
```bash
# 1. Instalar dependências (na raiz do projeto)
npm run install:all

# 2. Gerar o Prisma Client (OBRIGATÓRIO - executar dentro da pasta backend)
cd backend
npx prisma generate
cd ..

# 3. Rodar em modo desenvolvimento (2 processos com proxy)
npm run dev
```

### 📋 Passo a Passo Completo para Produção:
```bash
# 1. Instalar dependências (se ainda não foi feito)
npm run install:all

# 2. Gerar o Prisma Client (se ainda não foi feito)
cd backend
npx prisma generate
cd ..

# 3. Build e start unificado (1 processo)
npm start
```

### ⚠️ Observações Importantes:
- O comando `npx prisma generate` **DEVE** ser executado dentro da pasta `backend/`
- O arquivo `schema.prisma` está localizado em `backend/prisma/schema.prisma`
- Sem o `prisma generate`, o backend não conseguirá se conectar ao banco de dados

## ✅ Benefícios Alcançados

1. **Simplicidade**: Um único comando `npm start` para rodar tudo
2. **Menos processos**: Apenas um servidor Node.js em produção
3. **Facilidade de deploy**: Um único ponto de entrada
4. **Manutenção**: Configuração centralizada
5. **Performance**: Menos overhead de rede (sem proxy em produção)

## 🔄 Fluxo de Build

1. **Frontend**: `vite build` → `backend/dist/public/`
2. **Backend**: `tsc` → `backend/dist/`
3. **Execução**: `node backend/dist/index.js`

## 📁 Estrutura Final

```
purifikar-kanban/
├── package.json                    # Scripts gerais
├── backend/
│   ├── src/index.ts               # Servidor unificado
│   ├── dist/
│   │   ├── index.js              # Backend compilado
│   │   └── public/               # Frontend compilado
│   └── package.json              # Scripts principais
└── frontend/
    ├── vite.config.ts            # Build para backend/dist/public
    └── package.json              # Dependências frontend
```

## 🎉 Resultado

Agora você pode usar apenas:
- `npm start` para produção (build + start unificado)
- `npm run dev` para desenvolvimento (com hot reload)

O frontend estará disponível em `http://localhost:3001` junto com a API!

