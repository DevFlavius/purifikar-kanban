"use strict";
// backend/src/services/omieService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultarOrdemProducao = consultarOrdemProducao;
const axios_1 = __importDefault(require("axios"));
const OMIE_API_URL = 'https://app.omie.com.br/api/v1/produtos/op/';
/**
 * Consulta os detalhes de uma Ordem de Produção na API da Omie.
 * @param nCodOP - O código da Ordem de Produção a ser consultada.
 * @returns A string contendo a observação (cObs) da OP ou null se não for encontrada.
 */
async function consultarOrdemProducao(nCodOP) {
    try {
        const response = await axios_1.default.post(OMIE_API_URL, {
            call: 'ConsultarOrdemProducao',
            app_key: process.env.OMIE_APP_KEY,
            app_secret: process.env.OMIE_APP_SECRET,
            param: [{ nCodOP }],
        });
        // A resposta da Omie costuma vir com os dados que precisamos
        if (response.data && response.data.observacoes.cObs) {
            console.log(`Observação encontrada para OP ${nCodOP}: ${response.data.observacoes.cObs}`);
            return response.data.observacoes.cObs;
        }
        return null;
    }
    catch (error) {
        console.error(`Erro ao consultar OP ${nCodOP} na Omie:`, error);
        // Você pode querer registrar esse erro de forma mais robusta
        // usando a função logRegister que já existe no projeto.
        throw new Error('Falha ao comunicar com a API da Omie.');
    }
}
//# sourceMappingURL=OmieGetObs.js.map