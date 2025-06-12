# Purifikar Kanban – Backend

API em Node.js + TypeScript + Prisma + PostgreSQL

## 📦 Tecnologias e Dependências Principais

- **Node.js**
- **TypeScript**
- **Prisma ORM**
  - `@prisma/client`
  - `prisma`
- **PostgreSQL**
- **pg**
- **Express**
- **dotenv**
- Outras listadas no `package.json`

## 🎯 Instalação

```bash
git clone https://github.com/FlavioPurifikar/purifikar-kanban.git
cd purifikar-kanban/backend
npm install
```

Crie um arquivo `.env` na raiz com o seguinte conteúdo:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/NOME_DO_BANCO?schema=public"
```

Inicie um container PostgreSQL com Docker (exemplo):

```bash
docker run --name purifikar-pg -e POSTGRES_USER=usuario \
-e POSTGRES_PASSWORD=senha -e POSTGRES_DB=purifikar \
-p 5432:5432 -d postgres
```

## 🛠 Uso do Prisma

### Inicialização

```bash
npx prisma init --datasource-provider postgresql
```

Gera a estrutura `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### Criar Banco e Cliente Prisma

```bash
npx prisma migrate dev --name init
```

Esse comando:
- Cria as tabelas no banco
- Gera o cliente Prisma
- Cria a pasta `prisma/migrations`

### Adição de Nova Tabela (Model)

1. Edite o `schema.prisma` com a nova model:

```prisma
model NovaTabela {
  id   Int    @id @default(autoincrement())
  nome String
}
```

2. Rode a nova migração:

```bash
npx prisma migrate dev --name add_nova_tabela
```

3. Regere o cliente Prisma:

```bash
npx prisma generate
```

### Sincronizar com o Banco já Existente

Caso o banco tenha sido alterado diretamente:

```bash
npx prisma db pull
npx prisma generate
```

### Acesso Visual ao Banco

```bash
npx prisma studio
```

## 🚀 Execução

```bash
npm run dev
```

## 🧩 Outros Comandos Úteis

| Ação                              | Comando                                           |
|----------------------------------|---------------------------------------------------|
| Instalar dependências            | \`npm install\`                                   |
| Inicializar Prisma               | \`npx prisma init --datasource-provider postgresql\` |
| Rodar migração inicial           | \`npx prisma migrate dev --name init\`            |
| Criar nova entidade              | Editar schema.prisma + \`npx prisma migrate dev\` |
| Regenerar cliente Prisma         | \`npx prisma generate\`                           |
| Sincronizar BD -> Prisma         | \`npx prisma db pull\`                            |
| Iniciar GUI Prisma               | \`npx prisma studio\`                             |
| Rodar servidor em dev            | \`npm run dev\`                                   |

## ✅ Notas Finais

- Versione sempre os arquivos de migração
- Teste bem antes de aplicar alterações em produção
- Use Docker e `.env` para padronizar ambientes
- Documente os endpoints e use ferramentas como Swagger se necessário
