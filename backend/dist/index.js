"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const op_1 = __importDefault(require("./routes/op"));
const webhook_1 = __importDefault(require("./routes/webhook"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
// Middleware para interpretar JSON no corpo das requisições
app.use(express_1.default.json());
// Rotas da API
app.use('/op', op_1.default);
app.use('/webhook', webhook_1.default);
// Rota padrão da API para verificação
app.get('/api', (_, res) => {
    res.send('API do Painel de Produção está online.');
});
// Servir arquivos estáticos do frontend
const publicPath = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(publicPath));
// Fallback para SPA - todas as rotas não-API retornam o index.html
app.use((req, res, next) => {
    // Se a rota começar com /api, /op ou /webhook, continuar para próximo middleware
    if (req.path.startsWith('/api') || req.path.startsWith('/op') || req.path.startsWith('/webhook')) {
        return next();
    }
    // Para todas as outras rotas, servir o index.html
    res.sendFile(path_1.default.join(publicPath, 'index.html'));
});
// Inicialização do servidor
const PORT = parseInt(process.env.PORT || '3001', 10);
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor unificado rodando em http://localhost:${PORT}`);
    console.log(`Frontend disponível em: http://localhost:${PORT}`);
    console.log(`API disponível em: http://localhost:${PORT}/api`);
});
// Exemplo de chamada para verificar se o Prisma está funcionando
async function main() {
    const todasOPs = await prisma.production_orders.findMany();
    console.log('Ordens de Produção encontradas:', todasOPs.length);
}
main()
    .catch((e) => {
    console.error('Erro ao acessar o banco de dados:', e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=index.js.map