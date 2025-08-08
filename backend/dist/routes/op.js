"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const json_1 = require("../utils/json");
const omieApi_1 = require("../utils/omieApi");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const etapaEnum = zod_1.z.enum([
    'nova',
    'a_produzir',
    'em_producao',
    'acabamento',
    'finalizado'
]);
// GET /op
router.get('/', async (_req, res) => {
    try {
        const ops = await prisma.production_orders.findMany();
        res.setHeader('Content-Type', 'application/json');
        res.send((0, json_1.jsonWithBigInt)(ops));
    }
    catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar OPs' });
    }
});
// GET /op/:id      (vamos corrigir agora)
router.get('/:id', async (req, res) => {
    try {
        const id = BigInt(req.params.id);
        const op = await prisma.production_orders.findUnique({ where: { id } });
        if (!op) {
            res.status(404).json({ erro: 'OP não encontrada' });
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send((0, json_1.jsonWithBigInt)({ ...op, id: op.id.toString() }));
    }
    catch (err) {
        console.error('Erro no GET /op/:id =>', err);
        res.status(500).json({ erro: 'Erro ao buscar OP' });
    }
});
// PUT /op/:id/status
router.put('/:id', async (req, res) => {
    try {
        const { etapa } = req.body;
        const { id } = req.params;
        const atualizada = await prisma.production_orders.update({
            where: { id: BigInt(id) },
            data: { etapa: Number(etapa) }, // Certifica que é número
        });
        const omieEtapa = omieApi_1.omieEtapaMapping[etapaEnum.parse(etapa)];
        if (omieEtapa) {
            // Busca informações adicionais da OP para enviar à Omie, se necessário
            const opParaOmie = await prisma.production_orders.findUnique({ where: { id: BigInt(id) } });
            if (opParaOmie) {
                await (0, omieApi_1.updateOmieOrderStatus)(opParaOmie.id.toString(), omieEtapa, Number(opParaOmie.id), Number(opParaOmie.id_produto), Number(opParaOmie.quant_total), opParaOmie.dt_previsao ? opParaOmie.dt_previsao.toLocaleDateString("pt-BR") : undefined);
            }
        }
        res.send((0, json_1.jsonWithBigInt)(atualizada));
    }
    catch (error) {
        console.error('Erro no PUT /op/:id =>', error);
        res.status(500).json({ erro: 'Erro ao atualizar OP' });
    }
});
exports.default = router;
//# sourceMappingURL=op.js.map