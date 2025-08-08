"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.omieEtapaMapping = void 0;
exports.updateOmieOrderStatus = updateOmieOrderStatus;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const OMIE_APP_KEY = process.env.OMIE_APP_KEY;
const OMIE_APP_SECRET = process.env.OMIE_APP_SECRET;
const OMIE_API_URL = 'https://app.omie.com.br/api/v1/produtos/op/';
async function updateOmieOrderStatus(opId, omieStatus, nCodOP, nCodProduto, nQtde, dDtPrevisao) {
    if (!OMIE_APP_KEY || !OMIE_APP_SECRET) {
        throw new Error('OMIE_APP_KEY and OMIE_APP_SECRET must be defined in environment variables.');
    }
    const payload = {
        call: 'UpsertOrdemProducao',
        app_key: OMIE_APP_KEY,
        app_secret: OMIE_APP_SECRET,
        param: [
            {
                copUpsertRequest: {
                    identificacao: {
                        cCodIntOP: opId,
                    },
                    info: {
                        cEtapa: omieStatus,
                    },
                },
            },
        ],
    };
    // Adiciona campos opcionais se fornecidos
    if (nCodOP)
        payload.param[0].copUpsertRequest.identificacao.nCodOP = nCodOP;
    if (nCodProduto)
        payload.param[0].copUpsertRequest.identificacao.nCodProduto = nCodProduto;
    if (nQtde)
        payload.param[0].copUpsertRequest.identificacao.nQtde = nQtde;
    if (dDtPrevisao)
        payload.param[0].copUpsertRequest.identificacao.dDtPrevisao = dDtPrevisao;
    try {
        const response = await axios_1.default.post(OMIE_API_URL, payload);
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error("Erro ao atualizar status da OP na Omie:", error.response ? error.response.data : error.message);
        }
        else if (error instanceof Error) {
            console.error("Erro ao atualizar status da OP na Omie:", error.message);
        }
        else {
            console.error("Erro ao atualizar status da OP na Omie: Erro desconhecido", error);
        }
        throw error;
    }
}
// Mapeamento de etapas do Kanban para códigos Omie
exports.omieEtapaMapping = {
    'nova': '10',
    'a_produzir': '15', // Omie não usa, mas mantemos para consistência
    'em_producao': '20',
    'acabamento': '30',
    'finalizado': '60',
};
//# sourceMappingURL=omieApi.js.map