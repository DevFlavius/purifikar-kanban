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

      res.json({
      ...atualizada,
      id: atualizada.id.toString() // ✅ converte o BigInt
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar OP' });
      console.error('Erro no PUT /op/:id =>', error);
    }
  }
);

export default router;
