import { Request, Response, Router } from 'express';
import { formatarData } from '../utils/produtos';
import { PrismaClient, IntegrationStatus } from '@prisma/client';
import { atualizarLogIntegracao, criarLogIntegracao } from '../utils/log-register'
import { consultarOrdemProducao, OrdemProducaoInfo } from '../utils/OmieGetOP';
import { getOmieProductStructure } from '../utils/omieProductStructure';

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
      console.log('message id', req.body.messageId);

    //Procura o produto na API da Omie com base no código do produto
    const omieProduct = await getOmieProductStructure(codProduto);
    const codProdutoRecebido = omieProduct?.ident.codProduto;

      await criarLogIntegracao({
        origem: 'kanban-PFK-webhook',
        payload: req.body,
        foreign_id: req.body.messageId,
        contexto: 'Recebendo dados de OP',
        status: IntegrationStatus.EM_PROCESSO
      })

      // verifica o tipo de operação e se for de exclusão, remove a ordem de produção
      if (ProdOrdType === "OrdemProducao.Excluida") {
        console.log("Ordem de produção excluída");
        // Usar deleteMany para evitar erro se o registro já não existir
        await prisma.production_orders.deleteMany({
          where: {
            id: nCodOp,
          },
        });
        await atualizarLogIntegracao({ origem: "kanban-PFK-webhook-Exclusao", foreign_id: payload.messageid, contexto: "Exclusão de Ordem de produção", status: IntegrationStatus.SUCESSO });
        res.status(200).send("Ordem de produção excluída");
        return;
      }

      const allowedProductCodes = [
        "FIL-WD-ST",
        "FIL-WD-SL",
        "WC-ST04-T-B-D",
        "WC-ST04-S-B-E",
        "WC-ST04-T-B-E",
        "WC-SL01-S-B-D",
        "WC-SL-TM-DR",
        "WC-ST04-S-I-D",
        "WC-ST04-D-I-D",
        "WC-ST04-D-I-E",
        "WC-ST04-D-B-D",
        "WC-ST04-D-B-E",
        "WC-ST04-S-I-E",
        "WC-ST04-T-I-D",
        "WC-ST04-T-I-E",
        "WC-SL01-S-B-E",
        "WC-SL01-T-B-E",
        "WC-ST04-S-B-D-HU",
        "WC-ST04-S-B-D",
        "WC-ST04-S-B-E-H",
        "WC-ST04-S-I-D-H",
        "WC-ST04-S-I-E-H",
        "WC-ST04-S-B-E-HU",
        "WC-ST04-S-I-D-HU",
        "WC-ST04-S-I-E-HU",
        "WC-ST04-T-B-D-H",
        "WC-ST04-T-B-E-H",
        "WC-ST04-T-B-E-HU",
        "WC-ST04-T-B-D-HU",
        "WC-ST04-T-I-D-HPC",
        "WC-ST04-T-I-E-H",
        "WC-ST04-T-I-D-HU",
        "WC-ST04-T-I-E-HU",
        "WC-SL01-D-B-E",
        "WC-SL01-D-B-D",
        "WC SP",
        "3103",
        "WC-ST04-S-P-D",
        "WC-ST04-S-P-E",
        "PRD00259",
        "PRD00262",
        "PRD00263",
        "PRD00269",
        "PRD00270",
        "PRD00271",
        "PRD00272",
        "PRD00273",
        "PRD00274",
        "PRD00275",
        "PRD00276",
        "ST05-S-I-D",
        "WC-ST05-S-I-D",
      ];
      
      // verifica se o produto está ativo, filtro de produtos inativos
      // verifica se o produto foi encontrado na Omie, se não, retorna 204
      if (!omieProduct || !allowedProductCodes.includes(omieProduct.ident.codProduto)) {
        console.log("Produto não mapeado ou não permitido:", codProduto);
        await atualizarLogIntegracao({ origem: "kanban-PFK-webhook-NaoMapeadoOuNaoPermitido", foreign_id: payload.messageid, contexto: "Produto não mapeado ou não permitido", status: IntegrationStatus.ERRO });
        res.status(204).send();
        return;
      }
      
     let getOp: OrdemProducaoInfo | null = null;
      
    try {
       getOp = await consultarOrdemProducao(input.nCodOP);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Erro ao consultar a ordem de produção na Omie:", input.nCodOP, errorMessage);

      // Verifica se o erro é devido à OP não cadastrada na Omie
      if (errorMessage.includes("Ordem de Produção não cadastrada")) {
        await atualizarLogIntegracao({ origem: "kanban-PFK-webhook-OmieNotFound", foreign_id: payload.messageid, contexto: "OP não encontrada na Omie", status: IntegrationStatus.ERRO });
        res.status(200).send("OP não encontrada na Omie, ignorando."); // Retorna 200 para Omie não tentar novamente
        return; // Interrompe o processamento do webhook
      }

      await atualizarLogIntegracao({ origem: "kanban-PFK-webhook-ErroOmie", foreign_id: payload.messageid, contexto: "Erro ao consultar Omie", status: IntegrationStatus.ERRO });
      res.status(500).json({ erro: "Erro ao consultar Omie" });
      return; // Interrompe o processamento do webhook
    }
  
      const dataFormatada = formatarData(input.dDtPrevisao);
      // verifica se tem data de previsão, se não tiver define como undefined
      const dt_previsao_final = dataFormatada ? new Date(dataFormatada) : null;
      
      // formata os dados para salvar no banco
      const dadosFormatados = {
        id: Number(input.nCodOP),
        id_produto: omieProduct.ident.idProduto,
        cod_produto: omieProduct.ident.codProduto,
        nome_produto: omieProduct.ident.descrProduto,
        etapa: Number(input.cEtapa),
        quant_total: Number(getOp?.nQtde ?? 1),
        op_num: input.cNumOP,
        dt_previsao: dt_previsao_final,
        observacao: getOp?.cObs || '',
        componentes:
          omieProduct.itens.map(item => ({
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