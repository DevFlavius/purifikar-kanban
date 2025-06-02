import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { jsonWithBigInt } from '../utils/json';

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
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const op = await prisma.production_orders.findUnique({
      where: { id: BigInt(req.params.id) }
    });

    if (!op) return res.status(404).json({ erro: 'OP não encontrada' });

    res.setHeader('Content-Type', 'application/json');
    res.send(jsonWithBigInt(op));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar OP por ID' });
  }
});

type Params = { id: string };
type Body = { etapa: string };

// PUT /op/:id/status
router.put('/:id/status', async (req: Request<Params, {}, Body>, res: Response) => {
  try {
    const parse = etapaEnum.safeParse(req.body.etapa);
    if (!parse.success) {
      return res.status(400).json({ erro: 'Etapa inválida' });
    }

    const op = await prisma.production_orders.update({
      where: { id: BigInt(req.params.id) },
      data: { etapa: parse.data }
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(jsonWithBigInt(op));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar a etapa da OP' });
  }
});

export default router;
