import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OMIE_APP_KEY = process.env.OMIE_APP_KEY;
const OMIE_APP_SECRET = process.env.OMIE_APP_SECRET;
const OMIE_API_URL = 'https://app.omie.com.br/api/v1/produtos/op/';

interface OmieUpsertRequestPayload {
  call: string;
  app_key: string;
  app_secret: string;
  param: Array<{
    copUpsertRequest: {
      identificacao: {
        cCodIntOP: string; // ID da OP no Kanban
        nCodOP?: number; // Código da OP na Omie, se já existir
        nCodProduto?: number; // Código do produto
        nQtde?: number; // Quantidade a produzir
        dDtPrevisao?: string; // Data de previsão
      };
      info?: {
        cEtapa?: string; // Etapa da Ordem de Produção
      };
    };
  }>;
}

export async function updateOmieOrderStatus(opId: string, omieStatus: string, nCodOP?: number, nCodProduto?: number, nQtde?: number, dDtPrevisao?: string): Promise<any> {
  if (!OMIE_APP_KEY || !OMIE_APP_SECRET) {
    throw new Error('OMIE_APP_KEY and OMIE_APP_SECRET must be defined in environment variables.');
  }

  const payload: OmieUpsertRequestPayload = {
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
  if (nCodOP) payload.param[0].copUpsertRequest.identificacao.nCodOP = nCodOP;
  if (nCodProduto) payload.param[0].copUpsertRequest.identificacao.nCodProduto = nCodProduto;
  if (nQtde) payload.param[0].copUpsertRequest.identificacao.nQtde = nQtde;
  if (dDtPrevisao) payload.param[0].copUpsertRequest.identificacao.dDtPrevisao = dDtPrevisao;

  try {
    const response = await axios.post(OMIE_API_URL, payload);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Erro ao atualizar status da OP na Omie:", error.response ? error.response.data : error.message);
    } else if (error instanceof Error) {
      console.error("Erro ao atualizar status da OP na Omie:", error.message);
    } else {
      console.error("Erro ao atualizar status da OP na Omie: Erro desconhecido", error);
    }
    throw error;
  }
}

// Mapeamento de etapas do Kanban para códigos Omie
export const omieEtapaMapping: { [key: string]: string } = {
  'nova': '10',
  'a_produzir': '15', // Omie não usa, mas mantemos para consistência
  'em_producao': '20',
  'acabamento': '30',
  'finalizado': '60',
};

