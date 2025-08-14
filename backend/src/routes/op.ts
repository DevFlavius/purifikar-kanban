import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { jsonWithBigInt } from '../utils/json';
import { updateOmieOrderStatus, } from '../utils/omieApi';

const router = Router();
const prisma = new PrismaClient();

const etapaEnum = z.enum([
  'nova',
  'a_produzir',
  'em_producao',
  'acabamento',
  'finalizado'
]);

// GET /op
router.get('/', async (_req: Request, res: Response) => {
  try {
    const ops = await prisma.production_orders.findMany();
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonWithBigInt(ops));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar OPs' });
  }
});

// GET /op/:id      (vamos corrigir agora)

router.get(
  '/:id',
  async (
    req: Request<{ id: string }, {}, {}, {}>,
    res: Response
  ): Promise<void> => {
    try {
      const id = BigInt(req.params.id);
      const op = await prisma.production_orders.findUnique({ where: { id } });

      if (!op) {
        res.status(404).json({ erro: 'OP não encontrada' });
        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.send(jsonWithBigInt({ ...op, id: op.id.toString() }));
    } catch (err) {
      console.error('Erro no GET /op/:id =>', err);
      res.status(500).json({ erro: 'Erro ao buscar OP' });
    }
  }
);

type Params = { id: string };
type Body = { etapa: Number };

// PUT /op/:id/status
router.put(
  '/:id',
  async (req: Request<Params, {}, Body>, res: Response) => {
    try {
    const { etapa } = req.body;
    const { id } = req.params;

    const atualizada = await prisma.production_orders.update({
      where: { id: BigInt(id) },
      data: { etapa: Number(etapa) }, // O banco de dados espera um número
    });

    // Busca informações da OP para enviar à Omie
    const opParaOmie = await prisma.production_orders.findUnique({
      where: { id: BigInt(id) },
    });

    if (opParaOmie) {
      // Chamada da função atualizada, passando apenas os parâmetros necessários
      await updateOmieOrderStatus(
        opParaOmie.id.toString(), // nCodOP
        etapa.toString(), // cEtapa
      );
    }
      res.send(jsonWithBigInt(atualizada));

    } catch (error) {
      console.error('Erro no PUT /op/:id =>', error);
      res.status(500).json({ erro: 'Erro ao atualizar OP' });
    }
  }
);

export default router;