import { Request, Response, Router } from 'express';
import { produtos, formatarData } from '../utils/produtos';
import { PrismaClient } from '@prisma/client';
import { jsonWithBigInt } from '../utils/json';

const prisma = new PrismaClient();
const router = Router();

router.post(
  '/',
  async (
    req: Request<{}, {}, any, {}>, // <- Corrigido aqui
    res: Response
  ): Promise<void> => {
    try {
      const payload = req.body;
      const input = payload.inputG?.identificacao;
      const codProduto = input?.nCodProd;

      const produto = produtos.find(p => p.ident.idProduto === codProduto);

      if (!produto) {
        console.log('Produto não mapeado:', codProduto);
        res.status(204).send();
        return;
      }

      const dadosFormatados = {
        id: Number(payload.inputG.identificacao.nCodOP),
        id_produto: produto.ident.idProduto,
        cod_produto: produto.ident.codProduto,
        nome_produto: produto.ident.descrProduto,
        etapa: Number(payload.inputG.infAdicionais.cEtapa),
        quant_total: Number(payload.inputG.identificacao.nQtde ?? 1),
        op_num: payload.inputG.identificacao.cNumOP,
        dt_previsao: new Date(formatarData(payload.inputG.identificacao.dDtPrevisao)),
        componentes: JSON.stringify(
          produto.itens.map(item => ({
            nome: item.descrProdMalha,
            unidade: item.unidProdMalha,
            quantidade: item.quantProdMalha
          }))
        )
      };

      await prisma.production_orders.create({ data: dadosFormatados });

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.status(500).json({ erro: 'Erro ao processar webhook' });
    }
  }
);

export default router;