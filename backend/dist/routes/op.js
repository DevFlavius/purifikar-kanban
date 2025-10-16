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
        // Busca informações da OP para enviar à Omie
        const opParaOmie = await prisma.production_orders.findUnique({
            where: { id: BigInt(id) },
        });
        if (opParaOmie) {
            // Chamada da função atualizada, passando apenas os parâmetros necessários
            console.log('Etapa enviada para Omie:', etapa);
            await (0, omieApi_1.updateOmieOrderStatus)(opParaOmie.id.toString(), // nCodOP
            etapa.toString());
        }
        const atualizada = await prisma.production_orders.update({
            where: { id: BigInt(id) },
            data: { etapa: Number(etapa) }, // O banco de dados espera um número
        });
        res.send((0, json_1.jsonWithBigInt)(atualizada));
    }
    catch (error) {
        console.error('Erro no PUT /op/:id =>', error);
        res.status(500).json({ erro: 'Erro ao atualizar OP' });
    }
});
exports.default = router;
//# sourceMappingURL=op.js.map