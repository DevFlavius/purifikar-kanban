import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { jsonWithBigInt } from '../utils/json';
import { RequestHandler } from 'express';

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

// GET /op/:id
router.get('/:id', async (req, res) => {
  try {
    const op = await prisma.production_orders.findUnique({
      where: { id: BigInt(req.params.id) }
    });
    res.json(op);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar OP' });
  }
});

type Params = { id: string };
type Body = { etapa: string };

// PUT /op/:id/status
router.put(
  '/:id',
  async (req: Request<Params, {}, Body>, res: Response) => {
    try {
      const { etapa } = req.body;
      const { id } = req.params;

      const atualizada = await prisma.production_orders.update({
        where: { id: BigInt(id) },
        data: { etapa }
      });

      res.json(atualizada);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar OP' });
    }
  }
);

export default router;
