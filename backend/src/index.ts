import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import opRouter from './routes/op';
import webhookRoutes from './routes/webhook';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Rotas da aplicação
app.use('/op', opRouter);
app.use('/webhook', webhookRoutes);

// Rota padrão para verificação
app.get('/', (_, res) => {
  res.send('API do Painel de Produção está online.');
});

// Inicialização do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Exemplo de chamada para verificar se o Prisma está funcionando
async function main() {
  const todasOPs = await prisma.production_orders.findMany();
  console.log('Ordens de Produção encontradas:', todasOPs.length);
}

main()
  .catch((e) => {
    console.error('Erro ao acessar o banco de dados:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
