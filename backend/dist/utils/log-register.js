"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarLogIntegracao = criarLogIntegracao;
exports.atualizarLogIntegracao = atualizarLogIntegracao;
// Importa o client do Prisma e o tipo do model
const client_1 = require("@prisma/client");
// Instancia o client do Prisma
const prisma = new client_1.PrismaClient();
async function criarLogIntegracao({ origem, payload, foreign_id, contexto, status }) {
    try {
        const log = await prisma.integration_logs.upsert({
            where: { foreign_id },
            update: {
                origem,
                payload,
                contexto,
                status
            },
            create: {
                origem,
                payload,
                foreign_id,
                contexto,
                status: 'EM_PROCESSO'
            }
        });
        return log;
    }
    catch (error) {
        console.error('Erro ao criar log de integração:', error);
        throw error;
    }
}
async function atualizarLogIntegracao({ foreign_id, origem, status, contexto, response }) {
    try {
        const log = await prisma.integration_logs.updateMany({
            where: {
                foreign_id,
            },
            data: {
                status,
                contexto,
                response
            }
        });
        return log;
    }
    catch (error) {
        console.error('Erro ao atualizar log de integração:', error);
        throw error;
    }
}
//# sourceMappingURL=log-register.js.map