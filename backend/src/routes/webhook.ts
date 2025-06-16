import { Request, Response, Router } from 'express';
import { produtos, formatarData } from '../utils/produtos';
import { PrismaClient, IntegrationStatus } from '@prisma/client';
import { atualizarLogIntegracao, criarLogIntegracao } from '../utils/log-register'

const prisma = new PrismaClient();
const router = Router();

router.post(
  '/',
  async (
    req: Request<{}, {}, any, {}>,
    res: Response
  ): Promise<void> => {
    try {
      const payload = req.body;
      const input = payload.event;
      const codProduto = input.nCodProd;
      const nCodOp = input.nCodOP;
      const ProdOrdType = payload.topic;


      //Procura o produto nos mapping de produtos, com base no código do produto
      const produto = produtos.mapping.find(p => p.ident.idProduto === codProduto);
      //define o codigo do produto pelo ID do produto encontrado
      const codProdutoRecebido = produto?.ident.codProduto;

      await criarLogIntegracao({
        origem: 'kanban-PFK-webhook',
        payload: req.body,
        foreign_id: payload.messageid,
        contexto: 'Recebendo dados de OP',
        status: IntegrationStatus.EM_PROCESSO
      })

      // verifica o tipo de operação e se for de exclusão, remove a ordem de produção
      if (ProdOrdType === "OrdemProducao.Excluida") {
        console.log('Ordem de produção excluída');
        await prisma.production_orders.delete({
          where: {
            id: nCodOp, // valor único
          },
        });
        await atualizarLogIntegracao({ origem: 'kanban-PFK-webhook-Exclusao', foreign_id: payload.messageid, contexto: 'Exclusão de Ordem de produção', status: IntegrationStatus.SUCESSO });
        res.status(200).send('Ordem de produção excluída');
        return;
      }
      
      // verifica se o produto está ativo, filtro de produtos inativos
      if (!produtos.ativo.includes(String(codProdutoRecebido))) {
        console.log('Produto inativo, ignorando...');
        console.log(codProdutoRecebido);
        await atualizarLogIntegracao({ origem: 'kanban-PFK-webhook-inativo', foreign_id: payload.messageid, contexto: 'Produto inativo, ignorando...', status: IntegrationStatus.SUCESSO });
        res.status(200).send('Produto inativo');
        return;
      }
      
      // verifica se o produto está mapeado, se não estiver, retorna 204
      if (!produto) {
        console.log('Produto não mapeado:', codProduto);
        await atualizarLogIntegracao({ origem: 'kanban-PFK-webhook-NaoMapeado', foreign_id: payload.messageid, contexto: 'produto não mapeado', status: IntegrationStatus.ERRO });
        res.status(204).send();
        return;
      }

      // formata os dados para salvar no banco
      const dadosFormatados = {
        id: Number(input.nCodOP),
        id_produto: produto.ident.idProduto,
        cod_produto: produto.ident.codProduto,
        nome_produto: produto.ident.descrProduto,
        etapa: Number(input.cEtapa),
        quant_total: Number(input.nQtde ?? 1),
        op_num: input.cNumOP,
        dt_previsao: new Date(formatarData(input.dDtPrevisao)),
        componentes:
          produto.itens.map(item => ({
            nome: item.descrProdMalha,
            unidade: item.unidProdMalha,
            quantidade: item.quantProdMalha
          }))
        
      };

      //inclui ou atualiza a ordem de produção no banco
      await prisma.production_orders.upsert({
          where: {
            id: dadosFormatados.id, // valor único
          },
          update: {
            ...dadosFormatados,
          },
          create: {
            ...dadosFormatados,
          },
      });
      await atualizarLogIntegracao({ origem: 'kanban-PFK-webhook-IncuidaNoBanco', foreign_id: payload.messageid, contexto: 'OS registrada no banco', status: IntegrationStatus.SUCESSO });
      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Erro no webhook:', error);
      await atualizarLogIntegracao({ origem: 'kanban-PFK-webhook-Erro', foreign_id: req.body.messageid, contexto: 'Erro ao processar webhook', status: IntegrationStatus.ERRO });
      res.status(500).json({ erro: 'Erro ao processar webhook' });
    }
  }
);

export default router;