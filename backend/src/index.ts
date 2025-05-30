import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (_, res) => {
  res.send('API do Painel de Produção está online.');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const todasOPs = await prisma.productionOrder.findMany();
  console.log(todasOPs);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
