# 🏭 Painel de Produção - Purifikar

Este é um sistema de **Kanban Web** desenvolvido para acompanhar em tempo real a produção da indústria **IPF industria (Grupo Purifikar)**. Ele permite o acompanhamento de Ordens de Produção (OPs) em diferentes etapas de fabricação, integrando com a API da Omie e oferecendo um painel visual interativo com drag and drop.

---

## 🚀 Tecnologias Utilizadas

### 🖥️ Frontend
- React + TypeScript
- Vite
- DnD Kit (`@dnd-kit/core`, `@dnd-kit/sortable`)
- TailwindCSS (parcial)
- CSS customizado (cards, modal, responsividade)
- Axios para chamadas HTTP

### 🛠️ Backend
- Node.js com TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Docker para ambiente isolado
- Integração com API da Omie

---

## 🧩 Funcionalidades

- 📦 Exibição das Ordens de Produção em 5 colunas Kanban:
  - Nova
  - A Produzir
  - Em Produção
  - Acabamento
  - Finalizado
- 📥 Recebimento automático das OPs via Webhook da Omie
- 🔁 Sincronização de status com a Omie (via PUT)
- 🧲 Drag and drop com DnD Kit
- 👁️ Modal detalhado ao clicar em uma OP, com componentes, observações, etc.
- 🧼 Estilo limpo e responsivo com animações suaves
- 🕵️ Scroll automático no modal quando há muitos componentes

---

## 🧮 Etapas da Produção (mapeamento)

| Nome Interno   | Código para Omie |
|----------------|------------------|
| `nova`         | `10`             |
| `a_produzir`   | `15` *(local)*   |
| `em_producao`  | `20`             |
| `acabamento`   | `30`             |
| `finalizado`   | `60`             |

> 💡 O status `a_produzir` é utilizado apenas no frontend para fins operacionais internos e **não é sincronizado com a Omie**.

---

## ⚙️ Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/purifikar-kanban.git
cd purifikar-kanban
```
---

### 2. Configure o backend

```bash
cd backend
cp .env.example .env
# edite com os dados do PostgreSQL (server.pfklabs.online)
npx prisma generate
npx prisma migrate dev
npm install
npm run dev
```

---

### 3. Configure o frontend

```bash
cd ../frontend
npm install
npm run dev
```
---

### 4. Acesse
Abra http://localhost:5173 no navegador.

---

### 🐳 Docker (opcional)
Se desejar rodar tudo com Docker:
```bash
docker-compose up --build
```
---

### 📡 Webhook Omie
Ao receber um número de OP via webhook da Omie, o backend busca os dados da OP completa e insere ou atualiza no banco. A tabela `production_orders` é usada como base para exibir no frontend.

---

