"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const produtos_1 = require("../utils/produtos");
const client_1 = require("@prisma/client");
const log_register_1 = require("../utils/log-register");
const OmieGetObs_1 = require("../utils/OmieGetObs");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const payload = req.body;
        const input = payload.event;
        const codProduto = input.nCodProd;
        const nCodOp = input.nCodOP;
        const ProdOrdType = payload.topic;
        console.log('message id', req.body.messageId);
        //Procura o produto nos mapping de produtos, com base no código do produto
        const produto = produtos_1.produtos.mapping.find(p => p.ident.idProduto === codProduto);
        //define o codigo do produto pelo ID do produto encontrado
        const codProdutoRecebido = produto?.ident.codProduto;
        await (0, log_register_1.criarLogIntegracao)({
            origem: 'kanban-PFK-webhook',
            payload: req.body,
            foreign_id: req.body.messageId,
            contexto: 'Recebendo dados de OP',
            status: client_1.IntegrationStatus.EM_PROCESSO
        });
        // verifica o tipo de operação e se for de exclusão, remove a ordem de produção
        if (ProdOrdType === "OrdemProducao.Excluida") {
            console.log("Ordem de produção excluída");
            // Usar deleteMany para evitar erro se o registro já não existir
            await prisma.production_orders.deleteMany({
                where: {
                    id: nCodOp,
                },
            });
            await (0, log_register_1.atualizarLogIntegracao)({ origem: "kanban-PFK-webhook-Exclusao", foreign_id: payload.messageid, contexto: "Exclusão de Ordem de produção", status: client_1.IntegrationStatus.SUCESSO });
            res.status(200).send("Ordem de produção excluída");
            return;
        }
        // verifica se o produto está ativo, filtro de produtos inativos
        if (!produtos_1.produtos.ativo.includes(String(codProdutoRecebido))) {
            console.log('Produto inativo, ignorando...');
            console.log(codProdutoRecebido);
            await (0, log_register_1.atualizarLogIntegracao)({ origem: 'kanban-PFK-webhook-inativo', foreign_id: payload.messageid, contexto: 'Produto inativo, ignorando...', status: client_1.IntegrationStatus.SUCESSO });
            res.status(200).send('Produto inativo');
            return;
        }
        // verifica se o produto está mapeado, se não estiver, retorna 204
        if (!produto) {
            console.log('Produto não mapeado:', codProduto);
            await (0, log_register_1.atualizarLogIntegracao)({ origem: 'kanban-PFK-webhook-NaoMapeado', foreign_id: payload.messageid, contexto: 'produto não mapeado', status: client_1.IntegrationStatus.ERRO });
            res.status(204).send();
            return;
        }
        let observacao = null;
        try {
            observacao = await (0, OmieGetObs_1.consultarOrdemProducao)(input.nCodOP);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("Erro ao consultar a ordem de produção na Omie:", input.nCodOP, errorMessage);
            // Verifica se o erro é devido à OP não cadastrada na Omie
            if (errorMessage.includes("Ordem de Produção não cadastrada")) {
                await (0, log_register_1.atualizarLogIntegracao)({ origem: "kanban-PFK-webhook-OmieNotFound", foreign_id: payload.messageid, contexto: "OP não encontrada na Omie", status: client_1.IntegrationStatus.ERRO });
                res.status(200).send("OP não encontrada na Omie, ignorando."); // Retorna 200 para Omie não tentar novamente
                return; // Interrompe o processamento do webhook
            }
            await (0, log_register_1.atualizarLogIntegracao)({ origem: "kanban-PFK-webhook-ErroOmie", foreign_id: payload.messageid, contexto: "Erro ao consultar Omie", status: client_1.IntegrationStatus.ERRO });
            res.status(500).json({ erro: "Erro ao consultar Omie" });
            return; // Interrompe o processamento do webhook
        }
        const dataFormatada = (0, produtos_1.formatarData)(input.dDtPrevisao);
        // verifica se tem data de previsão, se não tiver define como undefined
        const dt_previsao_final = dataFormatada ? new Date(dataFormatada) : null;
        // formata os dados para salvar no banco
        const dadosFormatados = {
            id: Number(input.nCodOP),
            id_produto: produto.ident.idProduto,
            cod_produto: produto.ident.codProduto,
            nome_produto: produto.ident.descrProduto,
            etapa: Number(input.cEtapa),
            quant_total: Number(input.nQtde ?? 1),
            op_num: input.cNumOP,
            dt_previsao: dt_previsao_final,
            observacao: observacao || '',
            componentes: produto.itens.map(item => ({
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
        await (0, log_register_1.atualizarLogIntegracao)({ origem: 'kanban-PFK-webhook-IncuidaNoBanco', foreign_id: payload.messageid, contexto: 'OS registrada no banco', status: client_1.IntegrationStatus.SUCESSO });
        res.status(200).json({ status: 'ok' });
    }
    catch (error) {
        console.error('Erro no webhook:', error);
        await (0, log_register_1.atualizarLogIntegracao)({ origem: 'kanban-PFK-webhook-Erro', foreign_id: req.body.messageid, contexto: 'Erro ao processar webhook', status: client_1.IntegrationStatus.ERRO });
        res.status(500).json({ erro: 'Erro ao processar webhook' });
    }
});
exports.default = router;
//# sourceMappingURL=webhook.js.map