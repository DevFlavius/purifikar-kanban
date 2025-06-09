
import { Router, Request, Response } from 'express';

const router = Router();

// POST /webhook/omie
router.post('/omie', async (req: Request, res: Response) => {
  try {
    console.log('Webhook recebido da Omie:', req.body);

    // Aqui você pode processar os dados recebidos, como:
    // - Validar o payload
    // - Atualizar sua base de dados
    // - Criar ou atualizar uma OP, por exemplo

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao processar webhook da Omie:', err);
    res.status(500).json({ erro: 'Erro ao processar webhook' });
  }
});

export default router;