"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOmieOrderStatus = updateOmieOrderStatus;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const OMIE_APP_KEY = process.env.OMIE_APP_KEY;
const OMIE_APP_SECRET = process.env.OMIE_APP_SECRET;
const OMIE_API_URL = 'https://app.omie.com.br/api/v1/produtos/op/';
// Função atualizada para usar a nova operação e o novo payload
async function updateOmieOrderStatus(nCodOP, cEtapa) {
    const payload = {
        call: 'AlterarOrdemProducao', // Operação alterada
        app_key: OMIE_APP_KEY,
        app_secret: OMIE_APP_SECRET,
        param: [
            {
                identificacao: {
                    nCodOP: nCodOP,
                },
                infAdicionais: [
                    {
                        cEtapa: cEtapa,
                    },
                ],
            },
        ],
    };
    try {
        const response = await axios_1.default.post(OMIE_API_URL, payload);
        console.log('Resposta da API Omie:', response.data);
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Erro ao atualizar status da OP na Omie:', error.response ? error.response.data : error.message);
        }
        else if (error instanceof Error) {
            console.error('Erro ao atualizar status da OP na Omie:', error.message);
        }
        else {
            console.error('Erro ao atualizar status da OP na Omie: Erro desconhecido', error);
        }
        throw error;
    }
}
//# sourceMappingURL=omieApi.js.map