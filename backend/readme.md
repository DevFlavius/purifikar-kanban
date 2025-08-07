# Backend - Purifikar Kanban

Este diretório contém o código-fonte do backend da aplicação Purifikar Kanban, responsável por gerenciar as Ordens de Produção (OPs), interagir com o banco de dados e integrar com a API da Omie.

## 🚀 Tecnologias Utilizadas

*   **Node.js com TypeScript**: Ambiente de execução JavaScript no servidor, com a adição de tipagem estática do TypeScript para maior robustez e manutenibilidade.
*   **Express.js**: Framework web minimalista e flexível para Node.js, utilizado para construir a API RESTful que serve o frontend e lida com as requisições do webhook da Omie.
*   **Prisma ORM**: Um ORM (Object-Relational Mapper) moderno e de próxima geração para Node.js e TypeScript. Ele facilita a interação com o banco de dados, permitindo que você trabalhe com seus dados de forma segura e eficiente.
*   **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional robusto e de código aberto, utilizado para armazenar as informações das Ordens de Produção e logs de integração.
*   **Docker**: Utilizado para criar um ambiente de desenvolvimento isolado e consistente, empacotando o backend e o banco de dados em contêineres.
*   **Axios**: Cliente HTTP baseado em Promises para fazer requisições assíncronas a APIs externas, incluindo a API da Omie.
*   **`dotenv`**: Biblioteca para carregar variáveis de ambiente de um arquivo `.env`, mantendo as credenciais e configurações sensíveis fora do controle de versão.
*   **`zod`**: Biblioteca de validação de esquemas TypeScript-first, utilizada para garantir a integridade dos dados recebidos nas requisições.

## 🧩 Funcionalidades do Backend

*   **API RESTful para OPs**: Fornece endpoints para listar, consultar e atualizar Ordens de Produção.
*   **Recebimento de Webhooks da Omie**: Escuta e processa webhooks enviados pela API da Omie para receber automaticamente novas OPs ou atualizações.
*   **Sincronização de Status com a Omie**: Quando o status de uma OP é alterado no Kanban, o backend envia uma requisição `copUpsertRequest` para a API da Omie para manter os dados sincronizados.
*   **Gerenciamento de Logs de Integração**: Registra o status das interações com a API da Omie para fins de auditoria e depuração.
*   **Filtragem de Produtos**: Lógica para filtrar produtos inativos ou não mapeados recebidos da Omie.

## ⚙️ Como Rodar Localmente

1.  **Navegue até o diretório do backend:**
    ```bash
    cd purifikar-kanban/backend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do diretório `backend` com as seguintes variáveis:
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/purifikar_kanban"
    OMIE_APP_KEY="SUA_APP_KEY_DA_OMIE"
    OMIE_APP_SECRET="SEU_APP_SECRET_DA_OMIE"
    ```
    *   Substitua `user`, `password`, `localhost:5432` e `purifikar_kanban` pelos dados do seu banco de dados PostgreSQL.
    *   Substitua `SUA_APP_KEY_DA_OMIE` e `SEU_APP_SECRET_DA_OMIE` pelas suas credenciais de acesso à API da Omie.

4.  **Gere o cliente Prisma e execute as migrações (certifique-se de que seu PostgreSQL está rodando):**
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor estará rodando em `http://localhost:3001`.

## 📂 Estrutura do Projeto

*   `src/`
    *   `index.ts`: Ponto de entrada da aplicação, onde o servidor Express é inicializado e as rotas são configuradas.
    *   `routes/`:
        *   `op.ts`: Define as rotas para operações CRUD (Create, Read, Update, Delete) relacionadas às Ordens de Produção.
        *   `webhook.ts`: Lida com o processamento dos webhooks recebidos da Omie.
    *   `utils/`:
        *   `json.ts`: Utilitário para lidar com a serialização de BigInt para JSON.
        *   `log-register.ts`: Funções para registrar logs de integração.
        *   `omieApi.ts`: Contém a lógica para interagir com a API da Omie, incluindo a função `updateOmieOrderStatus` e o mapeamento de etapas.
        *   `OmieGetObs.ts`: Funções para consultar detalhes de OPs na Omie.
        *   `produtos.ts`: Mapeamento de produtos e lógica de filtragem.
*   `prisma/`: Contém o esquema do banco de dados (`schema.prisma`) e as migrações do Prisma.
*   `package.json`: Define as dependências do projeto e scripts de execução.
*   `tsconfig.json`: Configurações do TypeScript para o projeto backend.


