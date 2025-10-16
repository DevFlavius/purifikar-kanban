"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOmieProductStructure = getOmieProductStructure;
const axios_1 = __importDefault(require("axios"));
async function getOmieProductStructure(productId) {
    const OMIE_API_URL = 'https://app.omie.com.br/api/v1/geral/malha/';
    const APP_KEY = process.env.OMIE_APP_KEY;
    const APP_SECRET = process.env.OMIE_APP_SECRET;
    if (!APP_KEY || !APP_SECRET) {
        console.error('OMIE_APP_KEY or OMIE_APP_SECRET not set in environment variables.');
        return null;
    }
    const requestBody = {
        call: 'ConsultarEstrutura',
        app_key: APP_KEY,
        app_secret: APP_SECRET,
        param: [{
                idProduto: productId
            }]
    };
    try {
        const response = await axios_1.default.post(OMIE_API_URL, requestBody);
        return response.data;
    }
    catch (error) {
        console.error('Erro ao consultar estrutura do produto na Omie:', error);
        return null;
    }
}
//# sourceMappingURL=omieProductStructure.js.map